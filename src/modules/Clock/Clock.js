import React from 'react';

class Clock extends React.Component {
	constructor(props) {
		super(props);
		this.currentTime = new Date()
		this.state = {
			hour: this.currentTime.getHours(),
			minute: this.currentTime.getMinutes(),
			month: this.currentTime.getMonth(),
			day: this.currentTime.getDate(),
			year: this.currentTime.getFullYear(),
		};
		this.monthName = this.monthName.bind(this);
		this.extension = this.extension.bind(this);
	}
	componentDidMount() {
		this.interval = setInterval(
			() => this.tick(),
			30000
		);
	}
	componentWillUnmount() {
		clearInterval(this.interval);
	}
	tick() {
		this.currentTime = new Date();
		this.setState({
			hour: this.currentTime.getHours(),
			minute: this.currentTime.getMinutes(),
			month: this.currentTime.getMonth(),
			day: this.currentTime.getDate(),
			year: this.currentTime.getFullYear()
		});
	}
	monthName(month) {
		const monthNames = ["January", "February", "March", "April", "May", "June",
			"July", "August", "September", "October", "November", "December"]
		return monthNames[month];
	}
	extension(day) {
		if ((day >= 4 && day < 21) || (day >= 24 && day < 31)) {
			return 'th';
		} else if (day === 1 || day === 21 || day === 31) {
			return 'st';
		} else if (day === 2 || day === 22) {
			return 'nd';
		} else if (day === 3 || day === 23) {
			return 'rd';
		}
	}
	render() {
		return (
			<div style={{
				color: "white",
				fontFamily: "helvetica",
				fontWeight: "lighter",
				letterSpacing: "10px",
				textAlign: "center",
				opacity: this.props.disabled ? '0' : '1'
			}}>
				<h3 className="date" style={{
					fontSize: "2vh",
					opacity: this.props.disabled ? '0' : '1'
				}}>
					{this.monthName(this.state.month)} {this.state.day}{this.extension(this.state.day)}, {this.state.year}
				</h3>
				<h3 className="time" style={{
					fontSize: "3vh",
					opacity: this.props.disabled ? '0' : '1'
				}}>
					{this.state.hour > 12 ? this.state.hour % 12 : (this.state.hour === 0 || this.state.hour === 12) ? 12 : this.state.hour}:{this.state.minute < 10 ? ("0" + this.state.minute) : this.state.minute} {this.state.hour >= 12 ? "PM" : "AM"}
				</h3>
			</div>
		);
	}
}

export default Clock;