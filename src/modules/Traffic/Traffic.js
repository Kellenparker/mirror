import React from "react";

class Traffic extends React.Component {
    constructor(props) {
        super(props);
        this.key = "AIzaSyAD4HtmEE29mUY2MzT91LU0o6VxiXmmv54";
        this.counter = 0;
        this.updateTraffic();
        this.state = {
            traffic: {
                time: "",
                distance: "",
            },
        };
    }
    componentDidMount() {
        this.interval = setInterval(() => this.updateTraffic(), 30000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    async getTraffic() {
        var clientServerOptions = {
			uri: 'http://localhost:3001/traffic',
		};
		request(clientServerOptions, function (error, response) {
			console.log(error, response);
			return;
		});

    }
    async updateTraffic() {
        var clientServerOptions = {
			uri: 'http://localhost:3001/traffic',
		};
		request(clientServerOptions, function (error, response) {
			console.log(error, response);
			return;
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
                        fontWeight: "lighter",
                    }}
                >
                    <u>Traffic</u>
                </p>
                <p
                    style={{
                        fontSize: "25px",
                        marginLeft: "1vh",
                        fontFamily: "helvetica",
                        fontWeight: "lighter",
                    }}
                >
                    Time: {this.state.traffic.time}
                </p>
                <hr></hr>
                <p
                    style={{
                        fontSize: "20px",
                        marginLeft: "1vh",
                        fontFamily: "helvetica",
                        fontWeight: "lighter",
                    }}
                >
                    Distance: {this.state.traffic.distance}
                </p>
            </div>
        );
    }
}

export default Traffic;
