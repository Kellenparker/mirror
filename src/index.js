import React from 'react';
import ReactDOM from 'react-dom';
import Clock from './modules/Clock/Clock.js';
import Scan from './modules/Scan/Scan.js';
import Weather from './modules/Weather/Weather.js'
import Calendar from './modules/Calendar/Calendar.js'
import Motivation from './modules/Motivation/Motivation.js'
import News from './modules/News/News.js';
//import Traffic from './modules/Traffic/Traffic.js';
import { app } from './firebase.js';
import { getDatabase, ref, onValue, set } from "firebase/database";
var request = require('request');


// Call localhost:3001/ to initialize Firebase
var clientServerOptions = {
	uri: 'http://localhost:3001/',
};
request(clientServerOptions, function (error, response) {
	console.log(error, response.body);
	return;
});

// index: 0 = clock, 1 = weather, 2 = calendar, 3 = motivation, 4 = notes, 5 = news, 6 = traffic
let locations = [null, null, null, null, null, null, null];

function canLocate(type, location) {
	if(location < 1 || location > 7) return false;
	for(let i = 0; i < location.length; i++){
		if(i === type) continue;
		if(location === locations[i]){
			return false;
		}
	}
	return true;
}

const db = getDatabase();
const scanStageRef = ref(db, "scan/stage");
const imgRef = ref(db, "scan/img");
var scanStage;
onValue(scanStageRef, (scansnap) => {
	scanStage = scansnap.val();
	onValue(imgRef, (imgsnap) => {
		let img = imgsnap.val();
		ReactDOM.render(<Scan stage={scanStage} image={img}/>, document.getElementById('mid2'));
	})
})

const timeRef = ref(db, "modules/time");
var timeDisabled, timeLocation;
onValue(timeRef, (snapshot) => {
	timeDisabled = snapshot.child('disabled').val();
	timeLocation = snapshot.child('location').val();
	ReactDOM.render(<Clock disabled={timeDisabled} />, document.getElementById(timeLocation));
})

const weatherRef = ref(db, "modules/weather");
var weatherDisabled, weatherLocation;
onValue(weatherRef, (snapshot) => {
	weatherDisabled = snapshot.child('disabled').val();
	weatherLocation = snapshot.child('location').val();
	if(canLocate(1, weatherLocation)){
		if(locations[1] === null){
			locations[1] = weatherLocation;
			ReactDOM.render(<Weather disabled={weatherDisabled} />, document.getElementById(weatherLocation));
		}
		else if(locations[1] != timeLocation){
			ReactDOM.render(<Weather disabled={weatherDisabled} />, document.getElementById(weatherLocation));
			ReactDOM.render(<div/>, document.getElementById(locations[1]));
			locations[1] = weatherLocation;
		}
		ReactDOM.render(<Weather disabled={weatherDisabled} />, document.getElementById(weatherLocation));
	}
	else {
		console.log("Cannot move module there");
	}
})

const calendarRef = ref(db, "modules/calendar");
var calendarDisabled, calendarLocation;
onValue(calendarRef, (snapshot) => {
	calendarDisabled = snapshot.child('disabled').val();
	calendarLocation = snapshot.child('location').val();
	if(canLocate(2, calendarLocation)){
		if(locations[2] === null){
			locations[2] = calendarLocation;
			ReactDOM.render(<Calendar disabled={calendarDisabled} />, document.getElementById(calendarLocation));
		}
		else if(locations[2] != calendarLocation){
			ReactDOM.render(<Calendar disabled={calendarDisabled} />, document.getElementById(calendarLocation));
			ReactDOM.render(<div/>, document.getElementById(locations[2]));
			locations[2] = calendarLocation;
		}
		ReactDOM.render(<Calendar disabled={calendarDisabled} />, document.getElementById(calendarLocation));
	}
	else {
		console.log("Cannot move module there");
	}
})

const motRef = ref(db, "modules/motivation");
var motDisabled, motLocation;
onValue(motRef, (snapshot) => {
	motDisabled = snapshot.child('disabled').val();
	motLocation = snapshot.child('location').val();
	if(canLocate(3, motLocation)){
		if(locations[3] === null){
			locations[3] = motLocation;
			ReactDOM.render(<Motivation disabled={motDisabled} />, document.getElementById(motLocation));
		}
		else if(locations[3] != motLocation){
			ReactDOM.render(<Motivation disabled={motDisabled} />, document.getElementById(motLocation));
			ReactDOM.render(<div/>, document.getElementById(locations[3]));
			locations[3] = motLocation;
		}
		ReactDOM.render(<Motivation disabled={motDisabled} />, document.getElementById(motLocation));
	}
	else {
		console.log("Cannot move module there");
	}
})

const notesRef = ref(db, "modules/notes");
var notesDisabled, notesLocation, notesText, notes;
onValue(notesRef, (snapshot) => {
    notesDisabled = snapshot.child('disabled').val();
    notesLocation = snapshot.child('location').val();
    notesText = snapshot.child('text').val();
    if (notesDisabled == false){
        notes = (
            <div style={{height: "100%", overflow: "hidden"}}>
				<p style={{
						fontSize: "25px",
						marginLeft: "1vh",
						fontFamily: "helvetica",
						whiteSpace: 'pre-wrap',
						fontWeight: "lighter"}}>{notesText}</p>
            </div>
        );
    }
	else notes = (<div></div>);
	if(canLocate(4, notesLocation)){
		if(locations[4] === null){
			locations[4] = notesLocation;
			ReactDOM.render(notes, document.getElementById(notesLocation));
		}
		else if(locations[4] != notesLocation){
			ReactDOM.render(notes, document.getElementById(notesLocation));
			ReactDOM.render(<div/>, document.getElementById(locations[4]));
			locations[4] = notesLocation;
		}
	}
	else {
		console.log("Cannot move module there");
	}
    ReactDOM.render(notes, document.getElementById(notesLocation));
})

const newsRef = ref(db, "modules/news");
var newsDisabled, newsLocation;
onValue(newsRef, (snapshot) => {
	newsDisabled = snapshot.child('disabled').val();
	newsLocation = snapshot.child('location').val();
	if(canLocate(5, newsLocation)){
		if(locations[5] === null){
			locations[5] = newsLocation;
			ReactDOM.render(<News disabled={newsDisabled} />, document.getElementById(newsLocation));
		}
		else if(locations[5] != newsLocation){
			ReactDOM.render(<News disabled={newsDisabled} />, document.getElementById(newsLocation));
			ReactDOM.render(<div/>, document.getElementById(locations[3]));
			locations[5] = newsLocation;
		}
		ReactDOM.render(<News disabled={newsDisabled} />, document.getElementById(newsLocation));
	}
	else {
		console.log("Cannot move module there");
	}
})
/*
const traRef = ref(db, "modules/traffic");
var traDisabled, traLocation;
onValue(traRef, (snapshot) => {
	traDisabled = snapshot.child('disabled').val();
	traLocation = snapshot.child('location').val();
	if(canLocate(6, traLocation)){
		if(locations[6] === null){
			locations[6] = traLocation;
			ReactDOM.render(<Traffic disabled={traDisabled} />, document.getElementById(traLocation));
		}
		else if(locations[6] != traLocation){
			ReactDOM.render(<Traffic disabled={traDisabled} />, document.getElementById(traLocation));
			ReactDOM.render(<div/>, document.getElementById(locations[3]));
			locations[6] = traLocation;
		}
	}
	else {
		console.log("Cannot move module there");
	}
})*/

// Get capture value
const captureRef = ref(db, "scan/camera/capture/");
const cameraRef = ref(db, "scan/camera/");
var captureData;
onValue(captureRef, (snapshot) => {
	captureData = snapshot.val();
	console.log(captureData);

	// If capture is true, initialize server side scan function
	if (captureData) {
		var clientServerOptions = {
			uri: 'http://localhost:3001/capture',
		};
		request(clientServerOptions, function (error, response) {
			console.log(error, response.body);
			return;
		});
		// Set capture back to false after calling server function
		set(cameraRef, {
			capture: false
		});
	}
})