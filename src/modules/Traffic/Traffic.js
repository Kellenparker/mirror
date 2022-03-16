import { timers } from "jquery";
import React from "react";
var request = require("request");

class Traffic extends React.Component {
    constructor(props) {
        super(props);
        this.currentTime = undefined;
        this.hour = 8;
        this.minute = 0;
        this.past = false;
        this.setTime = undefined;
        this.arrivalTime = undefined;
        this.state = {
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
        if(this.currentTime.getHours() >= this.hours && this.currentTime.getMinutes() > this.minutes){
            this.setTime = new Date(this.currentTime);
            this.setTime.setHours(this.hour, this.minute);
        }else{
            this.setTime = new Date(this.currentTime);
            this.setTime.setDate(this.setTime.getDate() + 1);
            this.setTime.setHours(this.hour, this.minute);
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
    }
    render() {
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
                    <u>{this.hour < 10 ? "0" + this.hour: this.hour}:{this.minute < 10 ? "0" + this.minute: this.minute}</u>
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
                    {this.state.hour < 10 ? "0" + this.state.hour: this.state.hour}:{this.state.minute < 10 ? "0" + this.state.minute: this.state.minute}
                </p>
            </div>
        );
    }
}

export default Traffic;
