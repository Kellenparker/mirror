const express = require('express')
const PiCamera = require('pi-camera');
const {spawn} = require('child_process');
const {Storage} = require('@google-cloud/storage');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, onValue, set, update, removeValue} = require('firebase/database');
const imageToBase64 = require('image-to-base64');
const {searchAmazon, AmazonSearchResult} = require('unofficial-amazon-search');
const app = express()
const cors = require('cors')
const port = 3001

app.use(cors())

//You can use this to check if your server is working
app.get('/', (req, res)=>{
    res.send('Welcome to your server')

	// Configure Firebase API
	const firebaseConfig = {
		apiKey: 'AIzaSyBVLFOHZH78eU1L3G0i4y7jHvnCQ3bBn0o',
		authDomain: 'mirror-c9884.firebaseapp.com',
		databaseURL: 'https://mirror-c9884-default-rtdb.firebaseio.com',
		projectId: 'mirror-c9884',
		storageBucket: 'mirror-c9884.appspot.com',
		messagingSenderId: '34657405784',
		appId: '1:34657405784:web:15e50fdaa189c02b34f32d',
		measurementId: 'G-DE67V3RQ71'
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
	const linksRef = ref(db, 'links');

	// Remove all links by using set function
	set(linksRef, {
		linkAmt: 0
	});
})

app.get('/capture', function(req, res) {
	console.log('capture');
	
	// Captures an image using raspberry pi camera
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
			console.log('error');
		});
	
	async function buildLink() {
		// Imports the Google Cloud client library
		const vision = require('@google-cloud/vision');
	  
		// Creates an client for use in Google Cloud API
		const client = new vision.ImageAnnotatorClient();

		// Variable to hold base64 version of image
		var img

		// Convert captured image to base64 for use in annotateImage request
		await imageToBase64(`${ __dirname }/capture/img.jpeg`)
			.then((response) => {
				img = response
			})
		
		// Create request for annotateImage
		const request = {
			image: {
				content: img
			},
			features: [
				{
					// Can change amount of labels returned by changing maxResults
					maxResults: 50,
					type: 'LABEL_DETECTION'
				}
			]
		};
		
		// All appropriate clothing labels
		const apprLabels = ['Apron', 'Bodybuilding', 'Coat', 'Costume', 'Dress', 'Hoodie', 'Jacket', 'Jersey', 'Shirt', 'Blouse', 'Sportswear',
							'Sweater', 'Sweatshirt', 'Vest', 'T-shirt', 'Suit', 'Blazer', 'Dress shirt', 'Formal wear'];
		
		// Array that will hold only the clothing labels
		const clothingLabels = [];

		// Get labels using Google Cloud Vision
		let res = client.annotateImage(request)
			.then((result) => {
				let labels = result[0].labelAnnotations;
				console.log('Labels:');
				labels.forEach(label => label.score > .5 ? console.log(label.description) : 0);
				
				// Sort through all returned labels to find appropriate labels, determined by apprLabels
				labels.forEach(function(label){
					const len = apprLabels.length
					for(let i = 0; i < len; i++){
						if(label.description === apprLabels[i]){
							// Update clothingLabels array with filtered labels
							clothingLabels.push(label.description);
						}
					}
				});
				
				console.log(clothingLabels);

				// Build search string 
				let searchStr = 'clothes ';
				for(let i = 0; i < clothingLabels.length; i++)
					searchStr += clothingLabels[i] + ' ';

				// Load database
				const db = getDatabase();

				// Obtain age and gender data
				const userRef = ref(db, 'user');
				var ageData, genderData;
				var ageStr = genderStr = '';
				// Get values of age and gender, will only run once
				onValue(userRef, (snapshot) => {
					ageData = snapshot.child('age').val();
					genderData = snapshot.child('gender').val();

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

					// Add gender and age to search string
					searchStr += ageStr + ' ' + genderStr;
					console.log(searchStr);

					// Grab amazon search results using search strings
					let results = searchAmazon(searchStr, {maxResults: 20}).then(data => {
						
						const linksRef = ref(db, 'links');

						console.log(data);

						// Save number of links in variable count
						var count;

						// Add every search result into the database
						data.searchResults.forEach(function (result, i) {

							// Update links/ with a new link child
							const currentLink = 'link' + i
							update(linksRef, {
								[currentLink]: true,
							})

							// Set link child with link values
							const curLinkRef = ref(db, 'links/' + currentLink);
							set(curLinkRef, {
								linkTitle: result.title,
								linkUrl: result.productUrl,
								linkImg: result.imageUrl
							})
							count = i;

						});

						// Update link count in database
						update(linksRef, {
							linkAmt: {count}
						})


					});

				}, {
					// Makes the onValue function only run once
					onlyOnce: true
				});	

			});
		
	  }
	  buildLink();
});