import React from 'react';
import outline from './assets/human.png';
import './spinner.css';

class Scan extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div style={{
				color: "white",
				fontFamily: "helvetica",
				fontWeight: "lighter",
				letterSpacing: "10px",
				textAlign: "center",
			}}>
				<h3>{this.props.stage === 1 ? 'Please Center Yourself' : 
					 this.props.stage === 2 ? 'Generating Recommendations...' : 
					 this.props.stage === 3 ? 'Scanning Complete!' : ''}</h3>
				<div className='triple-spinner' style={{
					opacity: this.props.stage === 2 ? '1' : '0'
				}}></div>
				<img style={{
					position: 'relative',
					display: 'inline-block',
					zIndex: '9',
					marginTop: '-13vh',
					opacity: this.props.stage === 1 ? '1' : '0'
				}} src={outline} alt="outline" />
			</div>
		);
	}
}

export default Scan;