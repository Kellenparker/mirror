const express = require('express')
const PiCamera = require('pi-camera');
const {spawn} = require('child_process');
const {Storage} = require('@google-cloud/storage');
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
	
	async function printLabels() {
		// Imports the Google Cloud client library
		const vision = require('@google-cloud/vision');
	  
		// Creates a client
		const client = new vision.ImageAnnotatorClient();
	  
		// Performs label detection on the image file
		const [result] = await client.labelDetection(`${ __dirname }/capture/img.jpg`);
		const labels = result.labelAnnotations;
		console.log('Labels:');
		labels.forEach(label => console.log(label.description));
	  }
	  printLabels();
});