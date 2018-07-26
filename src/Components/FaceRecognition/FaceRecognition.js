import React from 'react';
import './FaceRecognition.css'
const FaceRecognition = ({imageUrl, box}) => {
	let imageDisplay = <div></div>;
	if (imageUrl) {
		imageDisplay = <div><img id='inputImage' src={imageUrl} alt="The face to be scanned. " width='500px' height='auto'/>
						 <div className='bounding-box' 
							style={{
							borderStyle: "none",
							top: box.topRow, 
							right:box.rightCol, 
							left: box.leftCol, 
							bottom: box.bottomRow}}>
						</div></div>
	} 
	return (
		<div className='center ma'>
			<div className='absolute mt2'> 
			{imageDisplay}			
			</div>
		</div>	
	);
}

export default FaceRecognition;