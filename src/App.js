import React, { Component } from 'react';
import Navigation from './Components/Navigation/Navigation.js';
import Logo from './Components/Logo/Logo.js';
import Rank from './Components/Rank/Rank.js';
import Register from './Components/Register/Register.js';
import SignIn from './Components/SignIn/SignIn.js';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition.js';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm.js';
import './App.css';
import Particles from 'react-particles-js';


const particlesOptions = {
  particles: {
    line_linked: {
      number: {
        value: 50,
        density: {
          enable: true,
          value_area: 1000
        }
      }
    }
  }
}

/*used to reset state so user who logins in
    to the same session after someone logs out
    of does not see the image they scanned*/ 
const initialState = {
  input: '',
  imageUrl: '',
  box: {}, //will contain bounding box values from response
  route: 'signin', //keeps track of where we are on the page
  isSignedIn: false,
  user: {//stores user info fetched from server
    id:'',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {}, //will contain bounding box values from response
      route: 'signin', //keeps track of where we are on the page
      isSignedIn: false,
      user: {//stores user info fetched from server
        id:'',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    //Determines location of face
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    }
  }

  displayFaceBox = (box) => {//puts box over face
    this.setState({box: box});
  }
  onInputChange = (event) => {//is property of the app
    this.setState({input: event.target.value})
  }

  onBtnSubmit = () => {
    this.setState({imageUrl: this.state.input});
    fetch('https://guarded-river-37677.herokuapp.com/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
    .then(response => response.json())
    .then(response => {
       if (response) {
        fetch('https://guarded-river-37677.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id 
          })
      })
        .then(response => response.json())
        .then(count => {//refreshes user entry number after face scan
          this.setState(Object.assign(this.state.user, { entries: count}))
          //Object.assign changes value of obj property without changing entire object
          //We need it bc the name of user will be changed to undefined when changing entries count
        })
      this.displayFaceBox(this.calculateFaceLocation(response))
    }})
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});

  }
  render() {
    return (
      <div className="App">
       <Particles 
              params={particlesOptions}
              className = 'particles'
            />

        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        {this.state.route === 'home'
          ? <div>
              <Logo />
              <Rank
                name={this.state.user.name}
                entries={this.state.user.entries} /> 
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onBtnSubmit={this.onBtnSubmit}/>
             
              <FaceRecognition box={this.state.box} imageUrl ={this.state.imageUrl} />
            </div>
          : (
              this.state.route === 'signin' || this.state.route === 'signout'
              ? <SignIn loadUser={this.loadUser} 
                        onRouteChange={this.onRouteChange}/>
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
     }
      </div>
    );
  }
}

export default App;
