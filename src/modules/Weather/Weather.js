import React from 'react';
import { getDatabase, ref, onValue, set } from "firebase/database";
import './icons/css/weather-icons.css'

class Weather extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			current: {
				sunrise: 0,
				sunset: 0,
				temp: 0.0,
				id: 0
			},
			day1: {
				high: 0.0,
				low: 0.0,
				id: 0
			},
			day2: {
				high: 0.0,
				low: 0.0,
				id: 0
			},
			day3: {
				high: 0.0,
				low: 0.0,
				id: 0
			},
			day4: {
				high: 0.0,
				low: 0.0,
				id: 0
			},
		};
		this.key = '77cdf28617fe90dbf251d34b33a89144';
		this.updateWeather();
		this.getConditions = this.getConditions.bind(this);
		this.getDoW = this.getDoW.bind(this);
	}
	componentDidMount() {
		this.interval = setInterval(
			() => this.updateWeather(),
			300000
		);
	}
	componentWillUnmount() {
		clearInterval(this.interval);
	}
	async getWeather() {
		try {
			const response = await fetch('https://api.openweathermap.org/data/2.5/onecall?lat=35.2220&lon=-101.8313&exclude=hourly,minutely,alerts&units=imperial&appid=' + this.key, {
				method: 'GET',
				credentials: 'same-origin'
			});
			const obj = await response.json();
			console.log(obj);
			return obj;
		} catch (error) {
        }
	}
	async updateWeather(){
		const data = await this.getWeather();
		this.setState({
			current: {
				sunrise: data.current.sunrise,
				sunset: data.current.sunset,
				temp: data.current.temp,
				id: data.current.weather[0].id
			},
			day1: {
				high: data.daily[0].temp.max,
				low: data.daily[0].temp.min,
				id: data.daily[0].weather[0].id
			},
			day2: {
				high: data.daily[1].temp.max,
				low: data.daily[1].temp.min,
				id: data.daily[1].weather[0].id
			},
			day3: {
				high: data.daily[2].temp.max,
				low: data.daily[2].temp.min,
				id: data.daily[2].weather[0].id
			},
			day4: {
				high: data.daily[3].temp.max,
				low: data.daily[3].temp.min,
				id: data.daily[3].weather[0].id
			},
		});
	}
	getConditions(id){
		let daytime = this.getDaytime();
		let str = "";
		console.log(id);
		
		if(id >= 200 && id < 300){
			//Thunderstorm
			str += "storm-showers"
		}
		else if(id >= 300 && id < 500){
			//Drizzle
			str += "showers"
		}
		else if(id >= 500 && id < 600){
			//Rain
			if(daytime) str += "day-";
			else str += "night-";
			str += "rain"
			console.log(str);
		}
		else if(id >= 600 && id < 700){
			//Snow
			str += "snow"
		}
		else if(id >= 700 && id < 800){
			//Atmosphere
			str += "fog"
		}
		else if(id === 800){
			//Clear
			if(daytime) str += "day-sunny";
			else str += "night-clear";
		}
		else if(id > 800){
			//Clouds
			if(daytime) str += "day-";
			else str += "night-";
			str += "cloudy"
		}
		return str;
	}
	getDaytime(){
		const d = new Date();
		let time = d.getTime() / 1000;
		if(time > this.state.current.sunrise && time < this.state.current.sunset) return true;
		return false;
	}
	getDoW(index){
		const d = new Date();
		const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		let day = (d.getDay() + index) % 7;
		return names[day];
	}
	render() {
        const db = getDatabase();
        const wRef = ref(db, "modules/weather/text/");
		set (wRef, {
				text: "Today's forecast is, " + this.getConditions(this.state.day1.id) + 
			" with a high of " + parseInt(this.state.day1.high) + 
			"°F, a low of " + parseInt(this.state.day1.low) + 
			"°F, but the current temperature is " + parseInt(this.state.current.temp) + "°F." 
		});
		return (
			<div style={{
                height: "95%",
                overflow: "hidden",
				opacity: this.props.disabled ? '0' : '1'}}>
				<div>
					<i className={"wi wi-" + this.getConditions(this.state.current.id)} style={{
						fontSize: "80px", 
						marginTop: "2vh"}}></i>
					<p style={{
						fontSize: "40px", 
						display: "inline-block",
						marginLeft: "1vh",
						fontFamily: "helvetica",
						fontWeight: "lighter",
						marginTop: "-1vh"}}>{parseInt(this.state.current.temp) + "°F"}</p>
				</div>
				<div>
					<div style={{display: "inline-block", width: "8vh"}}>
						<p style={{
							fontSize: "15px",
							marginLeft: "1vh",
							fontFamily: "helvetica",
							fontWeight: "lighter"}}>Today</p>
						<i className={"wi wi-" + this.getConditions(this.state.day1.id)} style={{
							fontSize: "40px"}}></i>
						<p style={{
							fontSize: "15px",
							marginLeft: "1vh",
							fontFamily: "helvetica",
							fontWeight: "lighter"}}>{parseInt(this.state.day1.high) + "°F"}</p>
						<p style={{
							fontSize: "15px",
							marginLeft: "1vh",
							fontFamily: "helvetica",
							fontWeight: "lighter",
							marginTop: "-1.5vh"}}>{parseInt(this.state.day1.low) + "°F"}</p>
					</div>
					<div style={{display: "inline-block", width: "8vh"}}>
						<p style={{
							fontSize: "15px",
							marginLeft: "0vh",
							textAlign: "center",
							fontFamily: "helvetica",
							fontWeight: "lighter"}}>{this.getDoW(1)}</p>
						<i className={"wi wi-" + this.getConditions(this.state.day2.id)} style={{
							fontSize: "40px"}}></i>
						<p style={{
							fontSize: "15px",
							marginLeft: "1vh",
							fontFamily: "helvetica",
							fontWeight: "lighter"}}>{parseInt(this.state.day2.high) + "°F"}</p>
						<p style={{
							fontSize: "15px",
							marginLeft: "1vh",
							fontFamily: "helvetica",
							fontWeight: "lighter",
							marginTop: "-1.5vh"}}>{parseInt(this.state.day2.low) + "°F"}</p>
					</div>
					<div style={{display: "inline-block", width: "8vh"}}>
						<p style={{
							fontSize: "15px",
							marginLeft: "1vh",
							fontFamily: "helvetica",
							fontWeight: "lighter"}}>{this.getDoW(2)}</p>
						<i className={"wi wi-" + this.getConditions(this.state.day3.id)} style={{
							fontSize: "40px"}}></i>
						<p style={{
							fontSize: "15px",
							marginLeft: "1vh",
							fontFamily: "helvetica",
							fontWeight: "lighter"}}>{parseInt(this.state.day3.high) + "°F"}</p>
						<p style={{
							fontSize: "15px",
							marginLeft: "1vh",
							fontFamily: "helvetica",
							fontWeight: "lighter",
							marginTop: "-1.5vh"}}>{parseInt(this.state.day3.low) + "°F"}</p>
					</div>
					<div style={{display: "inline-block", width: "8vh"}}>
						<p style={{
							fontSize: "15px",
							marginLeft: "1vh",
							fontFamily: "helvetica",
							fontWeight: "lighter"}}>{this.getDoW(3)}</p>
						<i className={"wi wi-" + this.getConditions(this.state.day4.id)} style={{
							fontSize: "40px"}}></i>
						<p style={{
							fontSize: "15px",
							marginLeft: "1vh",
							fontFamily: "helvetica",
							fontWeight: "lighter"}}>{parseInt(this.state.day4.high) + "°F"}</p>
						<p style={{
							fontSize: "15px",
							marginLeft: "1vh",
							fontFamily: "helvetica",
							fontWeight: "lighter",
							marginTop: "-1.5vh"}}>{parseInt(this.state.day4.low) + "°F"}</p>
					</div>
				</div>
			</div>
		);
	}
}

export default Weather;
