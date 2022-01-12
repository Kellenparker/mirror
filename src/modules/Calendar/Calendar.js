import React from 'react';

class Calendar extends React.Component {
	constructor(props) {
		super(props);
        this.today = new Date();
        var dd = String(this.today.getDate()).padStart(2, '0');
        var mm = String(this.today.getMonth() + 1).padStart(2, '0');
        var yyyy = this.today.getFullYear();
		this.state = {
            label: {
                events: ""
            },
			event1: {
				date: "",
                dow: "",
				time: "",
				summary: ""
			},
			event2: {
				date: "",
                dow: "",
				time: "",
				summary: ""
			},
			event3: {
				date: "",
                dow: "",
				time: "",
				summary: ""
			},
			event4: {
				date: "",
                dow: "",
				time: "",
				summary: ""
			},
            event5: {
				date: "",
                dow: "",
				time: "",
				summary: ""
			}
		};
		this.key = 'AIzaSyDq38hGFE7qO7nNjWfgGnK2JlaK_J1mW5Q';
        this.currentDate = yyyy + '-' + mm + '-' + dd;
        this.currentDateISO = this.today.toISOString().slice(0,-5);
		this.updateCalendar();
	    this.formatAMPM = this.formatAMPM.bind(this);
	}

	componentDidMount() {
		this.interval = setInterval(
			() => this.updateCalendar(),
			3000
		);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	async getCalendar() {
		try {
			const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/mirrorsquaredllc%40gmail.com/events?key=" + this.key + "&singleEvents=true&orderBy=startTime&maxResults=5&timeMin=" + this.currentDate + "T00:00:00-06", {
				method: 'GET',
				credentials: 'same-origin'
			});
			const obj = await response.json();
			return obj;
		} catch (error) {
            console.error(error);
        }
	}

	async updateCalendar(){
		const data = await this.getCalendar();
        var counter = 0;
        var arrayLength = Object.keys(data.items).length;
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        if (arrayLength == 0){
            this.setState({
                label: {
                    events: "No Upcoming Events"
                },
                event1: {
                    date: "",
                    dow: "",
                    time: "",
                    summary: ""
                },
                event2: {
                    date: "",
                    dow: "",
                    time: "",
                    summary: ""
                },
                event3: {
                    date: "",
                    dow: "",
                    time: "",
                    summary: ""
                },
                event4: {
                    date: "",
                    dow: "",
                    time: "",
                    summary: ""
                },
                event5: {
                    date: "",
                    dow: "",
                    time: "",
                    summary: ""
                }
            });
        } else if (arrayLength == 1){
            this.setState({
                event2: {
                    date: "",
                    dow: "",
                    time: "",
                    summary: ""
                },
                event3: {
                    date: "",
                    dow: "",
                    time: "",
                    summary: ""
                },
                event4: {
                    date: "",
                    dow: "",
                    time: "",
                    summary: ""
                },
                event5: {
                    date: "",
                    dow: "",
                    time: "",
                    summary: ""
                }});
        } else if (arrayLength == 2){
            this.setState({
                event3: {
                    date: "",
                    dow: "",
                    time: "",
                    summary: ""
                },
                event4: {
                    date: "",
                    dow: "",
                    time: "",
                    summary: ""
                },
                event5: {
                    date: "",
                    dow: "",
                    time: "",
                    summary: ""
                }});
        }else if (arrayLength == 3){
            this.setState({
                event4: {
                    date: "",
                    dow: "",
                    time: "",
                    summary: ""
                },
                event5: {
                    date: "",
                    dow: "",
                    time: "",
                    summary: ""
                }});
        }else if (arrayLength == 4){
            this.setState({
                event5: {
                    date: "",
                    dow: "",
                    time: "",
                    summary: ""
                }});
        }
        
        while (counter < arrayLength){
            if (data.items[counter].start.hasOwnProperty('dateTime')){
                var eventDateTime = new Date(data.items[counter].start.dateTime);
                let month = months[eventDateTime.getMonth()];
                var day = eventDateTime.getDate();
                var dow = days[eventDateTime.getDay()];
                var time =this.formatAMPM(eventDateTime);
                this.setState({
                    label: {
                        events: "Upcoming Events"
                    }
                });
                switch(counter){
                    case 0:
                        this.setState({
                            event1: {
                                date: ", " + month + " " + day + " ",
                                dow: dow,
                                time: "(" + time + ")",
                                summary: data.items[counter].summary
                            }
                        });
                        break;
                    case 1:
                        this.setState({
                            event2: {
                                date: ", " + month + " " + day + " ",
                                dow: dow,
                                time: "(" + time + ")",
                                summary: data.items[counter].summary
                            }
                        });   
                        break;                        
                    case 2:
                        this.setState({
                            event3: {
                                date: ", " + month + " " + day + " ",
                                dow: dow,
                                time: "(" + time + ")",
                                summary: data.items[counter].summary
                            }
                        });
                        break;
                    case 3:
                        this.setState({
                            event4: {
                                date: ", " + month + " " + day + " ",
                                dow: dow,
                                time: "(" + time + ")",
                                summary: data.items[counter].summary
                            }
                        });
                        break;
                    case 4:
                        this.setState({
                            event5: {
                                date: ", " + month + " " + day + " ",
                                dow: dow,
                                time: "(" + time + ")",
                                summary: data.items[counter].summary
                            }
                        });
                        break;
                }
            }
            if(data.items[counter].start.hasOwnProperty('date')){
                var eventDate = new Date (data.items[counter].start.date);
                let month = months[eventDate.getMonth()];
                var day = eventDate.getDate() + 1;
                var dow = days[eventDate.getDay()];
                this.setState({
                    label: {
                        events: "Upcoming Events"
                    }
                });
                switch(counter){
                    case 0:
                        this.setState({
                            event1: {
                                date: ", " + month + " " + day + " ",
                                dow: dow,
                                time: "(All Day)",
                                summary: data.items[counter].summary
                            }
                        });
                        break;
                    case 1:
                        this.setState({
                            event2: {
                                date: ", " + month + " " + day + " ",
                                dow: dow,
                                time: "(All Day)",
                                summary: data.items[counter].summary
                            }
                        });   
                        break;                        
                    case 2:
                        this.setState({
                            event3: {
                                date: ", " + month + " " + day + " ",
                                dow: dow,
                                time: "(All Day)",
                                summary: data.items[counter].summary
                            }
                        });
                        break;
                    case 3:
                        this.setState({
                            event4: {
                                date: ", " + month + " " + day + " ",
                                dow: dow,
                                time: "(All Day)",
                                summary: data.items[counter].summary
                            }
                        });
                        break;
                    case 4:
                        this.setState({
                            event5: {
                                date: ", " + month + " " + day + " ",
                                dow: dow,
                                time: "(All Day)",
                                summary: data.items[counter].summary
                            }
                        });
                        break;
                }
            }
            counter++; 
        }
        // console.log(this.state)
	}

    formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

	render() {
		return (
			<div>
                <p style={{
                    fontSize: "25px",
                    marginLeft: "1vh",
                    fontFamily: "helvetica",
                    fontWeight: "lighter"}}>{this.state.label.events}</p>
                <hr></hr>
                <p style={{
                    fontSize: "18px",
                    marginLeft: "1vh",
                    fontFamily: "helvetica",
                    fontWeight: "lighter"}}><i>{this.state.event1.dow}{this.state.event1.date}{this.state.event1.time}</i></p>
                <p style={{
                    fontSize: "20px",
                    marginLeft: "1vh",
                    fontFamily: "helvetica",
                    fontWeight: "lighter"}}>{this.state.event1.summary}</p>
                <br></br>
                <p style={{
                    fontSize: "18px",
                    marginLeft: "1vh",
                    fontFamily: "helvetica",
                    fontWeight: "lighter"}}><i>{this.state.event2.dow}{this.state.event2.date}{this.state.event2.time}</i></p>

                <p style={{
                    fontSize: "20px",
                    marginLeft: "1vh",
                    fontFamily: "helvetica",
                    fontWeight: "lighter"}}>{this.state.event2.summary}</p>
                <br></br>
                <p style={{
                    fontSize: "18px",
                    marginLeft: "1vh",
                    fontFamily: "helvetica",
                    fontWeight: "lighter"}}><i>{this.state.event3.dow}{this.state.event3.date}{this.state.event3.time}</i></p>

                <p style={{
                    fontSize: "20px",
                    marginLeft: "1vh",
                    fontFamily: "helvetica",
                    fontWeight: "lighter"}}>{this.state.event3.summary}</p>
			</div>
		);
	}
}

export default Calendar;