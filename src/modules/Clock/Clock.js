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
      year: this.currentTime.getFullYear()
    };
    this.monthName = this.monthName.bind(this);
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
  render() {
    return (
      <div style={{
        color: "white",
        fontFamily: "helvetica",
        fontWeight: "lighter",
        letterSpacing: "10px",
        textAlign: "center"
      }}>
        <h3 className="date" style={{fontSize: "40px"}}>
          {this.monthName(this.state.month)} {this.state.day}, {this.state.year}
        </h3>
        <h3 className="time" style={{fontSize: "70px"}}>
          {this.state.hour % 12}:{this.state.minute} {this.state.hour >= 12 ? "PM" : "AM"}
        </h3>
      </div>
    );
  }
}

export default Clock;