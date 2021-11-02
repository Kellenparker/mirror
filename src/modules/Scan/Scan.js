import React from 'react';

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
				<h3 style={{opacity: this.props.stage === 1 ? '1' : '0'}}>Please Center Yourself</h3>
			</div>
		);
	}
}

export default Scan;