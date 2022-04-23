import React from "react";
import { getDatabase, ref, set } from "firebase/database";
var request = require("request");

class Traffic extends React.Component {
    constructor(props) {
        super(props);
        this.currentTime = undefined;
        this.past = false;
        this.setTime = undefined;
        this.arrivalTime = undefined;
        this.state = {
            arriveHour: this.props.hour,
            arriveMin: this.props.minute,
            hour: 0,
            minute: 0
        };
        this.getTraffic = this.getTraffic.bind(this);
        this.updateTraffic = this.updateTraffic.bind(this);
        this.updateTraffic();
    }
    componentDidMount() {
        this.interval = setInterval(() => this.updateTraffic(), 30000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    async getDate() {
        this.currentTime = new Date();
        if(this.currentTime.getHours() >= this.state.arriveHour && this.currentTime.getMinutes() > this.state.arriveMin){
            this.setTime = new Date(this.currentTime);
            this.setTime.setHours(this.state.arriveHour, this.state.arriveMin);
        }else{
            this.setTime = new Date(this.currentTime);
            this.setTime.setDate(this.setTime.getDate() + 1);
            this.setTime.setHours(this.state.arriveHour, this.state.arriveMin);
        }
        console.log(this.setTime);
    }
    getTraffic() {
        return new Promise(function (resolve, reject) {
            var clientServerOptions = {
                uri: "http://localhost:3001/traffic",
            };
            request(clientServerOptions, function (error, response) {
                resolve(response.body)
            });
        });
    }
    async updateTraffic() {
        let data = await this.getTraffic();
        await this.getDate();
        data = JSON.parse(data);
        console.log(this.setTime.getMilliseconds())
        this.arrivalTime = new Date(this.setTime);
        this.arrivalTime.setSeconds(-1 * data.rows[0].elements[0].duration.value)
        console.log(this.arrivalTime);
        this.setState({
            hour: this.arrivalTime.getHours(),
            minute: this.arrivalTime.getMinutes()
        });
        this.getDate();
    }
    render() {
        const db = getDatabase();
        const trafRef = ref(db, "modules/traffic/text/");
        var ampm = "AM"
        if(this.hour > 12) {
            this.hour -= 12;
            ampm = "PM";
        }
        if(this.hour === 0)
            this.hour = 12;

        var minute = this.minute
        if(this.minute < 10)
            minute = "0" + this.minute;

        var ampm2 = "AM"
        if(this.state.hour > 12) {
            this.state.hour -= 12;
            ampm2 = "PM";
        }
        if(this.state.hour === 0)
            this.state.hour = 12;

        var minute2 = this.state.minute
        if(this.state.minute < 10)
            minute2 = "0" + this.state.minute;
        
        set (trafRef, {
                text: "In order to arrive at " + this.hour 
            + " " + minute + ampm + " to your desired destination, you must leave by " 
            + this.state.hour + " " + minute2 + ampm2
        });
        return (
            <div
                style={{
                    height: "100%",
                    overflow: "hidden",
                    opacity: this.props.disabled ? "0" : "1",
                }}
            >
                <p
                    style={{
                        fontSize: "30px",
                        marginLeft: "1vh",
                        fontFamily: "helvetica",
                        textAlign: "center",
                        fontWeight: "lighter",
                    }}
                >
                    Time to Leave to Arrive at <br/>
                    <u>{this.state.arriveMin > 12 ? this.state.arriveHour % 12 : (this.state.arriveHour === 0 || this.state.arriveHour === 12) ? 12 : 
this.state.arriveHour}:{this.state.arriveMin < 10 ? ("0" + this.state.arriveMin) : this.state.arriveMin} {this.state.arriveHour >= 12 ? "PM" : "AM"}</u>
                </p>
                <p
                    style={{
                        fontSize: "50px",
                        textAlign: "center",
                        marginTop: "50px",
                        fontFamily: "helvetica",
                        fontWeight: "lighter",
                    }}
                >
		{this.state.hour > 12 ? this.state.hour % 12 : (this.state.hour === 0 || this.state.hour === 12) ? 12 : 
this.state.hour}:{this.state.minute < 10 ? ("0" + this.state.minute) : this.state.minute} {this.state.hour >= 12 ? "PM" : "AM"}
                </p>
            </div>
        );
    }
}

export default Traffic;
