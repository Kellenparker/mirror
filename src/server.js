const express = require('express')
const PiCamera = require('pi-camera');
const {spawn} = require('child_process');
const {Storage} = require('@google-cloud/storage');
const imageToBase64 = require('image-to-base64');
const {searchAmazon, AmazonSearchResult} = require('unofficial-amazon-search');
const app = express()
const cors = require('cors')
const port = 3001

app.use(cors())

//You can use this to check if your server is working
app.get('/', (req, res)=>{
    res.send("Welcome to your server")
	const storage = new Storage({projectId: 'genial-core-326621', keyFilename: 'genial-core-326621-00c4218e4202.json'});
	// Makes an authenticated API request.
	async function listBuckets() {
		try {
		const [buckets] = await storage.getBuckets();
	
		console.log('Buckets:');
		buckets.forEach(bucket => {
			console.log(bucket.name);
		});
		} catch (err) {
		console.error('ERROR:', err);
		}
	}
	listBuckets();
})

//Start your server on a specified port
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
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

		await imageToBase64(`${ __dirname }/capture/img.jpg`)
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
		const apprLabels = ['Apron', 'Coat', 'Collar', 'Costume', 'Dress', 'Hoodie', 'Jacket', 'Jersey', 'Shirt', 'Blouse',
							'Sweater', 'Sweatshirt', 'Vest', 'T-shirt'];
		
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
							console.log('here');
							clothingLabels.push(label.description);
						}
					}
				});
				
				console.log(clothingLabels);

				let searchStr;

				for(let i = 0; i < clothingLabels.length; i++){
					searchStr = clothingLabels[i] + ' '
				}

				searchAmazon(searchStr).then(data => {
						data.searchResults.forEach(result => console.log(result.title));
				  	});

			});
		
	  }
	  buildLink();
});