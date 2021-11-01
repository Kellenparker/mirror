const express = require('express')
const PiCamera = require('pi-camera');
const {spawn} = require('child_process');
const {Storage} = require('@google-cloud/storage');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, onValue, set, update, removeValue} = require("firebase/database");
const imageToBase64 = require('image-to-base64');
const {searchAmazon, AmazonSearchResult} = require('unofficial-amazon-search');
const app = express()
const cors = require('cors')
const port = 3001

app.use(cors())

//You can use this to check if your server is working
app.get('/', (req, res)=>{
    res.send("Welcome to your server")
	const firebaseConfig = {
		apiKey: "AIzaSyBVLFOHZH78eU1L3G0i4y7jHvnCQ3bBn0o",
		authDomain: "mirror-c9884.firebaseapp.com",
		databaseURL: "https://mirror-c9884-default-rtdb.firebaseio.com",
		projectId: "mirror-c9884",
		storageBucket: "mirror-c9884.appspot.com",
		messagingSenderId: "34657405784",
		appId: "1:34657405784:web:15e50fdaa189c02b34f32d",
		measurementId: "G-DE67V3RQ71"
	  };
	  
	// Initialize Firebase
	const app = initializeApp(firebaseConfig);
})

//Start your server on a specified port
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})

app.get('/remove', function(req, res){
	// Load database
	const db = getDatabase();
	const linkNumRef = ref(db, "camera/linkNum");
	const linksRef = ref(db, "links");
	set(linksRef, {
		linkAct: false
	});
})

app.get('/capture', function(req, res) {
	console.log('capture');
	const myCamera = new PiCamera({
		mode: 'photo',
		output: `${ __dirname }/capture/img.jpg`,
		width: 1280,
		height: 900,
		nopreview: true,
	});
	myCamera.snap()
		.then((result) => {
			// Your picture was captured
		})
		.catch((error) => {
			console.log("error");
		});
	
	async function buildLink() {
		// Imports the Google Cloud client library
		const vision = require('@google-cloud/vision');
	  
		// Creates a client
		const client = new vision.ImageAnnotatorClient();

		var img

		await imageToBase64(`${ __dirname }/capture/img.jpeg`)
			.then((response) => {
				img = response
			})
		
		const request = {
			image: {
				content: img
			},
			features: [
				{
					maxResults: 50,
					type: "LABEL_DETECTION"
				}
			]
		};
		// Performs label detection on the image file
		const apprLabels = ['Apron', 'Coat', 'Costume', 'Dress', 'Hoodie', 'Jacket', 'Jersey', 'Shirt', 'Blouse',
							'Sweater', 'Sweatshirt', 'Vest', 'T-shirt', 'Suit', 'Blazer', 'Dress shirt', 'Formal wear'];
		
		const clothingLabels = [];

		let res = client.annotateImage(request)
			.then((result) => {
				console.log(result[0].labelAnnotations);
				let labels = result[0].labelAnnotations;
				console.log('Labels:');
				labels.forEach(label => label.score > .5 ? console.log(label.description) : 0);
				
				labels.forEach(function(label){
					for(let i = 0; i < apprLabels.length; i++){
						if(label.description === apprLabels[i]){
							clothingLabels.push(label.description);
						}
					}
				});
				
				console.log(clothingLabels);

				// Build search string
				let searchStr = "";
				for(let i = 0; i < clothingLabels.length; i++)
					searchStr += clothingLabels[i] + ' ';

				// Load database
				const db = getDatabase();

				// Obtain age and gender data
				const userRef = ref(db, "user");
				var ageData, genderData;
				var ageStr = genderStr = "";
				onValue(userRef, (snapshot) => {
					ageData = snapshot.child("age").val();
					genderData = snapshot.child("gender").val();

					if(ageData < 12)
						ageStr = 'child';
					else if(ageData < 18)
						ageStr = 'teen';
					else
						ageStr = 'adult';

					
					if(genderData === 0)
						genderStr = 'male';
					else
						genderStr = 'female';

					// Add title and links to database
					
					searchStr += ageStr + ' ' + genderStr;
					console.log(searchStr);

					// Generate results and store as link objects in database
					let results = searchAmazon(searchStr, {maxResults: 20}).then(data => {
						
						const linksRef = ref(db, "links");

						console.log(data);

						data.searchResults.forEach(function (result, i) {

							const currentLink = "link" + i
							update(linksRef, {
								[currentLink]: true
							})
							const curLinkRef = ref(db, "links/" + currentLink);
							set(curLinkRef, {
								linkTitle: result.title,
								linkUrl: result.productUrl,
								linkImg: result.imageUrl
							})

						});

						update(linksRef, {
							linkAct: true
						})


					});

				}, {
					onlyOnce: true
				});	

			});
		
	  }
	  buildLink();
});