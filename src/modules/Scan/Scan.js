import React from 'react';
import loading from './assets/loadingicon.gif';
import outline from './assets/human.png';

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
				<img style={{
					position: 'absolute',
					left: '29.5vh',
					marginRight: 'auto',
					opacity: this.props.stage === 2 ? '1' : '0'
				}} src={loading} alt="loading..." />
				<img style={{
					marginTop: '15vh',
					marginLeft: 'auto',
					marginRight: 'auto',
					opacity: this.props.stage === 1 ? '1' : '0'
				}} src={outline} alt="loading..." />
			</div>
		);
	}
}

export default Scan;