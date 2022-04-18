import React from 'react';
import outline from './assets/human.png';
import { getDatabase, ref, onValue, set } from "firebase/database";
import './spinner.css';

class Scan extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
        const db = getDatabase();
		return (
			<div style={{
				color: "white",
				fontFamily: "helvetica",
				fontWeight: "lighter",
				letterSpacing: "10px",
				textAlign: "center",
			}}>
				<h3>{this.props.stage === 1 ? 'Please Center Yourself' : 
					 this.props.stage === 3 ? 'Generating Recommendations...' : 
					 this.props.stage === 4 ? 'Scanning Complete!' : ''}</h3>
				<div className='triple-spinner' style={{
					opacity: this.props.stage === 2 || this.props.stage === 3 ? '1' : '0'
				}}></div>
				<img src={`data:image/png;base64,${this.props.image}`} style={{
					position: "absolute",
					margin: "auto",
					left: '0',
					right: '0',
					textAlign: 'center',
					maxHeight: '300px',
					maxWidth: '300px',
					top: '32%',
					opacity: this.props.stage === 2 || this.props.stage === 3 ? '1' : '0'
				}} alt="" onerror="this.style.display='none'"></img>
				<p style={{
					position: "absolute",
					margin: "auto",
					left: '0',
					right: '0',
					textAlign: 'center',
					top: '80%',
					opacity: this.props.stage === 2 ? '1' : '0'
				}}>Continue?</p>
				<img style={{
					position: 'relative',
					display: 'inline-block',
					zIndex: '9',
					marginTop: '10vh',
					opacity: this.props.stage === 1 ? '1' : '0'
				}} src={outline} alt="outline" />
			</div>
		);
	}
}

export default Scan;
