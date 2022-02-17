import React from 'react';

class Traffic extends React.Component {
    constructor(props) {
        super(props);
        this.key = 'AIzaSyAD4HtmEE29mUY2MzT91LU0o6VxiXmmv54';
        this.counter = 0;
        this.updateTraffic();
        this.state = { 
            traffic: {
                time: "",
                distance: ""
            }
        };
    }
    componentDidMount() {
        this.interval = setInterval(
            () => this.updateTraffic(),
            30000
        );
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    async getTraffic() {
        const proxyurl = "https://cors-anywhere.herokuapp.com/";
        try {
            const response = await fetch('https://maps.googleapis.com/maps/api/distancematrix/json?destinations=40.659569%2C-73.933783%7C40.729029%2C-73.851524%7C40.6860072%2C-73.6334271%7C40.598566%2C-73.7527626&origins=40.6655101%2C-73.89188969999998&key=' + this.key, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                  "Access-Control-Allow-Origin": '*',
                  "Access-Control-Allow-Methods": 'GET'
                },
            });
            const obj = await response.json();
            console.log(obj);
            return obj;
        } catch (error) {
        }
    }
    async updateTraffic(){
        const data = await this.getTraffic()
        this.setState({
            traffic: {
                time : data.rows.elements.duration.text,
                distance : data.rows.elements.distance.text
        }})
    }
    render() {
        return ( 
            <div style={{height: "100%", overflow: "scroll"}}>
                <p style={{
                    fontSize: "30px",
                    marginLeft: "1vh",
                    fontFamily: "helvetica",
                    fontWeight: "lighter"}}><u>Traffic</u></p>
                <p style={{
                    fontSize: "25px",
                    marginLeft: "1vh",
                    fontFamily: "helvetica",
                    fontWeight: "lighter"}}>Time: {this.state.traffic.time}</p>
                <hr></hr>
                <p style={{
                    fontSize: "20px",
                    marginLeft: "1vh",
                    fontFamily: "helvetica",
                    fontWeight: "lighter"}}>Distance: {this.state.traffic.distance}</p>
            </div>

        );
    }
}

export default Traffic;