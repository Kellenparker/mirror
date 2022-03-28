const express = require("express");
const PiCamera = require("pi-camera");
const { getDatabase, ref, onValue, set, update } = require("firebase/database");
const imageToBase64 = require("image-to-base64");
const {
    searchAmazon,
    AmazonSearchResult,
} = require("unofficial-amazon-search");
const { initializeApp } = require('firebase/app');
const app = express();
const cors = require("cors");
const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const port = 3001;

app.use(cors());

//You can use this to check if your server is working
app.get("/", (req, res) => {
    res.send("Welcome to your server");

    // Configure Firebase API
    const firebaseConfig = {
        apiKey: "AIzaSyBVLFOHZH78eU1L3G0i4y7jHvnCQ3bBn0o",
        authDomain: "mirror-c9884.firebaseapp.com",
        databaseURL: "https://mirror-c9884-default-rtdb.firebaseio.com",
        projectId: "mirror-c9884",
        storageBucket: "mirror-c9884.appspot.com",
        messagingSenderId: "34657405784",
        appId: "1:34657405784:web:15e50fdaa189c02b34f32d",
        measurementId: "G-DE67V3RQ71",
    };

	// Initialize Firebase
	const app = initializeApp(firebaseConfig);

});

// Start your server on a specified port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get("/traffic", function (req, res) {
    const db = getDatabase();
    const trafficRef = ref(db, "modules/traffic");
    var source, destination;
    onValue(trafficRef, (snapshot) => {
        source = snapshot.child('source').val();
        destination = snapshot.child('destination').val();
    })
    var axios = require("axios");
    var config = {
        method: "get",
        url: "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + source + "&destinations=" + destination + "&units=imperial&key=AIzaSyAvxC1YthC5IKPeJC1T95xaw7JEvBczrJ0",
        headers: {},
    };

    axios(config)
        .then(function (response) {
			res.send(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
	
})

app.get("/remove", function (req, res) {
    // Load database
    const db = getDatabase();
    const linksRef = ref(db, "scan/links");

    // Remove all links by using set function
    set(linksRef, {
        linkAmt: 0,
    });
});

app.get("/capture", function (req, res) {

    // Configure Firebase API
    const firebaseConfig = {
        apiKey: "AIzaSyBVLFOHZH78eU1L3G0i4y7jHvnCQ3bBn0o",
        authDomain: "mirror-c9884.firebaseapp.com",
        databaseURL: "https://mirror-c9884-default-rtdb.firebaseio.com",
        projectId: "mirror-c9884",
        storageBucket: "mirror-c9884.appspot.com",
        messagingSenderId: "34657405784",
        appId: "1:34657405784:web:15e50fdaa189c02b34f32d",
        measurementId: "G-DE67V3RQ71",
    };

	// Initialize Firebase
	const app = initializeApp(firebaseConfig);

    console.log("capture");

    // Load database
    const db = getDatabase();

    // Set scan stage to 2 to update UI
    update(ref(db, "scan"), {
        stage: 2,
    });

    // Captures an image using raspberry pi camera
    const myCamera = new PiCamera({
        mode: "photo",
        output: `${__dirname}/capture/img.jpg`,
        width: 1280,
        height: 900,
        nopreview: true,
    });
    myCamera
        .snap()
        .then((result) => {
            // Your picture was captured
        })
        .catch((error) => {
            console.log("error");
        });

    // Function used to filter out labels
    function filterLabels(clothingAr, newLabel) {
        //First check if label already exists
        if (clothingAr.includes(newLabel)) return;

        clothingLen = clothingAr.length;
        pushLabel = true;

        // Conflict array: Leftmost label wont get added if leftward labels exist already
        const conflicts = [
            ["Jersey", "Dress shirt"],
            ["Blazer", "Dress shirt"],
            ["T-shirt", "Dress shirt"],
            ["Vest", "Sportswear"],
            ["Fur", "Jacket"],
            ["T-shirt", "Coat", "Blazer"],
            ["Cardigan", "Blazer", "Coat"],
            ["Blazer", "Coat"],
            ["Blazer", "Dress"],
            ["Formal wear", "Day dress"],
        ];

        // Test conflicts first
        conflictLen = conflicts.length;

        // Look for newLabel in conflicts array
        for (let i = 0; i < conflictLen; i++) {
            // If newLabel is found, loop through its conflicts
            if (conflicts[i][0] === newLabel) {
                labelLen = conflicts[i].length;
                for (let j = 1; j < labelLen; j++) {
                    if (clothingAr.includes(conflicts[i][j])) {
                        pushLabel = false;
                        console.log(
                            "found conflict for label: " +
                                newLabel +
                                ", " +
                                conflicts[i][j]
                        );
                    }
                }
            }
        }

        pushLabel ? clothingAr.push(newLabel) : 0;
    }

    function substituteLabels(clothingAr) {
        // Last item will be the substitute for the beginning elements
        // Example: Sun dress replaces Day dress
        // Single element arrays will just be replaced with nothing
        const substitutions = [
            [
                "Formal wear",
                "Fashion design",
                "Blazer",
                "Jersey",
                "Sportswear",
                "Sportswear",
            ],
            ["T-shirt", "Clothing", "Dress Shirt"],
            ["T-shirt", "Clothing", "Abdomen", "Dress Shirt"],
            ["T-shirt", "Abdomen", "Dress Shirt"],
            ["Clothing", "Dress shirt"],
            ["adult"],
            ["Jacket", "Jacket Hoodie Sweatshirts"],
            [
                "Dress shirt",
                "Sportswear",
                "Formal wear",
                "Hoodie",
                "Jacket Hoodie Sweatshirts",
                "Jacket Hoodie Sweatshirts",
            ],
            ["Fur", "Fuzzy"],
            ["Fuzzy", "Pattern", "Fuzzy shirts Sweatshirt Hoodie"],
            ["Fashion design"],
            ["Dress shirt", "Formal wear", "Pattern", "Button up Shirt"],
            ["Abdomen", "Formal wear", "Pattern", "Crop top Blouses"],
            ["Jersey", "Vest", "T-shirt", "Tank top"],
            [
                "Abdomen",
                "Pattern",
                "Jersey",
                "Sportswear",
                "T-shirt",
                "T-shirts and Tank top",
            ],
            [
                "Abdomen",
                "Pattern",
                "T-shirt",
                "Sportswear",
                "T-shirt and Tank top",
            ],
            ["Sweatshirt", "T-shirt", "Pattern", "Sportswear", "Long sleeve"],
            ["Sportswear", "Fuzzy shirts Sweatshirt Hoodie", "Cardigans"],
            [
                "Fuzzy Shirt Sweatshirt Hoodie",
                "T-shirt and Tank top",
                "Fuzzy tops Cardigans",
            ],
            ["Cowboy hat", "Hoodie", "Western flannel"],
            ["Cowboy hat", "Button up Shirt", "Western flannel"],
            ["Coat", "Suit", "Hoodie", "Suit Coat"],
            [
                "Formal wear",
                "Coat",
                "Fur clothing",
                "Fuzzy shirts Sweatshirt Hoodie",
                "Fuzzy Sweatershirts Coats",
            ],
            ["Blazer", "Formal wear", "Fuzzy", "Fuzzy Sweatershirts Coats"],
            ["Style", "Abdomen", "T-shirt and Tank top", "Blouses"],
            ["Style", "T-shirt and Tank top", "Blouse"],
            ["Shirt", "Suit Coat", "Blazer"],
            ["Shirt", "Coat", "Suit", "Button up Shirt", "Blazer"],
            ["Dress", "Day dress", "Sun dress"],
            ["Pattern", "Sun dress", "Sun dress"],
            ["Vest", "Bodybuilding", "Bodybuilding Tank-top"],
            [
                "Abdomen",
                "T-shirt",
                "Bodybuilding Tank-top",
                "Bodybuilding Tank-top",
            ],
            ["Suit", "Hoodie", "Blazer"],
            ["Polo shirt", "Abdomen", "T-shirts and Tank top", "Polo Shirt"],
            ["Polo shirt", "T-shirt", "Jersey", "Abdomen", "Polo Shirt"],
        ];

        subLen = substitutions.length;
        for (let i = 0; i < subLen; i++) {
            clothingLen = clothingAr.length;
            let change = true;
            let subIndexes = [];
            let newAr = [];

            // Skip if initial sub label does not exist in clothing array
            if (!clothingAr.includes(substitutions[i][0])) continue;

            // Push initial index to subIndex
            subIndexes.push(clothingAr.indexOf(substitutions[i][0]));

            // Find indexes of elements to be replaced
            insideLen = substitutions[i].length;
            for (let j = 1; j < insideLen - 1; j++) {
                let index = clothingAr.indexOf(substitutions[i][j]);
                if (index === -1) {
                    // If element does not exist, do not do substitution
                    change = false;
                    break;
                } else {
                    // Add index to index array
                    subIndexes.push(index);
                }
            }

            // Looks for next substitution if one is now found
            if (!change) continue;

            // If one is found, get replacement from substitution array
            let replacement;
            insideLen != 1
                ? (replacement = substitutions[i][insideLen - 1])
                : 0;

            // Loop through clothing array to find elements that won't be replaced, add them to new array
            for (let j = 0; j < clothingLen; j++) {
                if (subIndexes.includes(j)) continue;
                newAr.push(clothingAr[j]);
            }
            // Add substitute to new array
            insideLen != 1 ? newAr.push(replacement) : 0;
            clothingAr = newAr;
        }
        // Return new set of labels if labels changed
        return clothingAr;
    }

    async function buildLink() {
        // Imports the Google Cloud client library
        const vision = require("@google-cloud/vision");

        // Creates an client for use in Google Cloud API
        const client = new vision.ImageAnnotatorClient();

        // Variable to hold base64 version of image
        var img;

        // Convert captured image to base64 for use in annotateImage request
        await imageToBase64(`${__dirname}/capture/img.jpg`).then((response) => {
            img = response;
            const imgRef = ref(db, "scan/img");
            set(imgRef, img);
        });

        // Create request for annotateImage
        const request = {
            image: {
                content: img,
            },
            features: [
                {
                    // Can change amount of labels returned by changing maxResults
                    maxResults: 50,
                    type: "LABEL_DETECTION",
                },
            ],
        };

        // All appropriate clothing labels
        const apprLabels = [
            "Apron",
            "Bodybuilding",
            "Coat",
            "Dress",
            "Hoodie",
            "Jacket",
            "Jersey",
            "Shirt",
            "Blouse",
            "Sportswear",
            "Sweater",
            "Sweatshirt",
            "Vest",
            "T-shirt",
            "Suit",
            "Blazer",
            "Dress shirt",
            "Formal wear",
            "Polo shirt",
            "Day dress",
            "Style",
            "Fashion design",
            "Pattern",
            "Fur clothing",
            "Abdomen",
            "Fur",
            "Cowboy hat",
            "Cardigan",
            "Tank Top",
            "Long sleeve",
        ];

        // Array that will hold only the clothing labels
        var clothingLabels = [];

        // Get labels using Google Cloud Vision
        let res = client.annotateImage(request).then((result) => {
            let labels = result[0].labelAnnotations;
            console.log("Labels:");
            labels.forEach((label) =>
                label.score > 0.5 ? console.log(label.description) : 0
            );

            // Sort through all returned labels to find appropriate labels, determined by apprLabels
            labels.forEach(function (label) {
                const len = apprLabels.length;
                for (let i = 0; i < len; i++) {
                    if (label.description === apprLabels[i]) {
                        // Update clothingLabels array with filtered labels
                        filterLabels(clothingLabels, label.description);
                    }
                }
            });

            // Obtain age and gender data
            const userRef = ref(db, "user");
            var ageData, genderData;
            var ageStr = (genderStr = "");

            // Get values of age and gender, will only run once
            onValue(
                userRef,
                (snapshot) => {
                    ageData = snapshot.child("age").val();
                    genderData = snapshot.child("gender").val();

                    if (ageData < 12) ageStr = "child";
                    else if (ageData < 18) ageStr = "teen";
                    else ageStr = "adult";

                    if (genderData === 0) genderStr = "mens";
                    else if (genderData === 1) genderStr = "womens";

                    if (clothingLabels.length <= 2)
                        filterLabels(clothingLabels, "Clothing");

                    // Filter age and gender strings
                    filterLabels(clothingLabels, ageStr);
                    filterLabels(clothingLabels, genderStr);

                    console.log(clothingLabels);
                    // Run labels through substituteLabels function
                    clothingLabels = substituteLabels(clothingLabels);
                    console.log(clothingLabels);

                    // Build search string
                    let searchStr = "";
                    let len = clothingLabels.length;
                    for (let i = 0; i < len; i++)
                        searchStr += clothingLabels[i] + " ";

                    console.log(searchStr);

                    // Grab amazon search results using search strings
                    let results = searchAmazon(searchStr).then((data) => {
                        const linksRef = ref(db, "scan/links");

                        // console.log(data);

                        // Save number of links in variable count
                        var count;

                        // Add every search result into the database
                        data.searchResults.forEach(function (result, i) {
                            // Update links/ with a new link child
                            const currentLink = "link" + i;
                            update(linksRef, {
                                [currentLink]: true,
                            });

                            // Set link child with link values
                            const curLinkRef = ref(
                                db,
                                "scan/links/" + currentLink
                            );
                            set(curLinkRef, {
                                linkTitle: result.title,
                                linkUrl: result.productUrl,
                                linkImg: result.imageUrl,
                            });
                            count = i;
                        });

                        // Update link count in database
                        update(linksRef, {
                            linkAmt: { count },
                        });

                        // Set scan stage to 3 to update UI
                        update(ref(db, "scan"), {
                            stage: 3,
                        });

                        setTimeout(function () {
                            update(ref(db, "scan"), {
                                stage: 0,
                            });
                        }, 10000);
                    });
                },
                {
                    // Makes the onValue function only run once
                    onlyOnce: true,
                }
            );
        });
    }
    buildLink();
});
