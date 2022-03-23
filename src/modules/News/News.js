import React from 'react';
import { getDatabase, ref, onValue, set } from "firebase/database";

class News extends React.Component {
    constructor(props) {
        super(props);
        this.key = '6a01b0cf91834dd8b6982dc8a9f26293';
        this.counter = 0;
        this.updateNews();
        this.state = { 
            article: {
                title: "",
                description: ""
            }
        };
    }
    componentDidMount() {
        this.interval = setInterval(
            () => this.updateNews(),
            60000
        );
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    async getNews() {
        try {
            const response = await fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=' + this.key, {
                method: 'GET',
                credentials: 'same-origin'
            });
            const obj = await response.json();
            console.log(obj);
            return obj;
        } catch (error) {
        }
    }
    async updateNews(){
        const data = await this.getNews();
        if(this.counter <= 19) {
            console.log(data.articles[this.counter].title)
            this.setState({
                article: {
                title : data.articles[this.counter].title,
                description : data.articles[this.counter].description
                }
            });

        }
        this.counter=this.counter+1;
        if(this.counter == 20) {
            this.counter = 0;
        }
    }
    render() {
        const db = getDatabase();
        const newsRef = ref(db, "modules/news/text/");
        set(newsRef, {
		text: "On today's top news there is, " + this.state.article.title  + 
		this.state.article.description
	});
        return ( 
            <div style={{
                height: "100%", 
                overflow: "hidden",
                opacity: this.props.disabled ? '0' : '1'
            }}>
                <p style={{
                    fontSize: "30px",
                    marginLeft: "1vh",
                    fontFamily: "impact",
                    fontWeight: "lighter"}}><u>Today's Top News</u></p>
                <p style={{
                    fontSize: "18px",
                    marginLeft: "1vh",
                    fontFamily: "courier new",
                    fontWeight: "bold"}}>{this.state.article.title}</p>
                <br></br>
                <p style={{
                    fontSize: "18px",
                    marginLeft: "1vh",
                    fontFamily: "helvetica",
                    fontStyle: "italic",
                    fontWeight: "lighter"}}>{this.state.article.description}</p>
            </div>

        );
    }
}

export default News;
