import React from 'react';

class Weather extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			current: {
				temp: 0.0,
				weather: ""
			},
			day1: {
				high: 0.0,
				low: 0.0,
				weather: ""
			},
			day2: {
				high: 0.0,
				low: 0.0,
				weather: ""
			},
			day3: {
				high: 0.0,
				low: 0.0,
				weather: ""
			},
			day4: {
				high: 0.0,
				low: 0.0,
				weather: ""
			},
		};
		this.key = '76d2f48a1f2ac2166008d7fc456adf88';
		this.getWeather();
	}
	componentDidMount() {
		this.interval = setInterval(
			() => this.updateWeather(),
			30000
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
            console.error(error);
        }
	}
	async updateWeather(){
		const data = await this.getWeather();
		console.log(data.current.temp);
		this.setState({
			current: {
				temp: data.current.temp,
				weather: data.current.weather[0].main
			},
			day1: {
				high: data.daily[0].temp.max,
				low: data.daily[0].temp.min,
				weather: data.daily[0].weather[0].main
			},
			day2: {
				high: data.daily[1].temp.max,
				low: data.daily[1].temp.min,
				weather: data.daily[1].weather[0].main
			},
			day3: {
				high: data.daily[2].temp.max,
				low: data.daily[2].temp.min,
				weather: data.daily[2].weather[0].main
			},
			day4: {
				high: data.daily[3].temp.max,
				low: data.daily[3].temp.min,
				weather: data.daily[3].weather[0].main
			},
		});

		console.log(this.state);
	}
	render() {
		return (
			<div></div>
		);
	}
}

export default Weather;