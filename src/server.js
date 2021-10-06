const express = require('express')
const PiCamera = require('pi-camera');
const app = express()
const cors = require('cors')
const port = 3001

app.use(cors())

//You can use this to check if your server is working
app.get('/', (req, res)=>{
    res.send("Welcome to your server")
})

//Start your server on a specified port
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})

app.get('/capture', function(req, res) {
	console.log('capture');
	const myCamera = new PiCamera({
		mode: 'photo',
		output: `${ __dirname }/test.jpg`,
		width: 640,
		height: 480,
		nopreview: true,
	});
	myCamera.snap()
		.then((result) => {
			// Your picture was captured
		})
		.catch((error) => {
			console.log("error");
		});
});