import React from 'react';

class Register extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			name: ''
		}
	}

	onNameChange = (event) => {//read user input for email
			this.setState({name: event.target.value});
		}
	onEmailChange = (event) => {//read user input for email
		this.setState({email: event.target.value});
	}

	onPasswordChange = (event) => {//read user input for password
		this.setState({password: event.target.value});
	}
	
	onSubmitRegister = () => {
			//send login info to server make sure it is post
			console.log(this.state.signinEmail, this.state.signinPassword);

			fetch(process.env.REST_API + '/register', {
				method: 'post', //get by default
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					email: this.state.email,
					password: this.state.password,
					name: this.state.name
				})
			})
				.then(response  => response.json())
				.then(user => {
					if (user.id) {//if we get a user back
						this.props.loadUser(user);//load user info from server put it in app state
						this.props.onRouteChange('home');
					}
				});

		}
	render() {
		return (
		<article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
			<main className="pa4 black-80">
			  <div className="measure">
			    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
			      <legend className="f1 fw6 ph0 mh0">Register</legend>
			      <div className="mt3">
			      <div className="mt3">
			        <label className="db fw6 lh-copy f6" for="name">Name</label>
			        <input 
			        	className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
			        	type="text" 
			        	name="name"  
			        	id="name"
			        	onChange={this.onNameChange}/>
			      </div>
			        <label className="db fw6 lh-copy f6" for="email-address">Email</label>
			        <input 
			            className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
			            type="email" 
			            name="email-address"  
			            id="email-address"
			            onChange={this.onEmailChange}/>
			      </div>
			      <div className="mv3">
			        <label className="db fw6 lh-copy f6" for="password">Password</label>
			        <input 
			            className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
			            type="password" 
			            name="password"  
			            id="password"
			            onChange={this.onPasswordChange}/>
			      </div>
			    </fieldset>
			    <div className="">
			      <input onClick={this.onSubmitRegister} className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Register"/>
			    </div>
			  </div>
	         </main>
         </article>
	     );
	 }
}

export default Register;