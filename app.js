console.log("Starting app!");

// require() 
// - available to you whenever
// ex. const fs = require('fs');

// const x = require("./x.js");
// will bring in any code from "x.js"

// npm install <package name> --save
// adds to package.json file

const _ = require('lodash');
const request = require('request');

// nodemon <root file name>.js

// JSON.stringify(<obj>);
// JSON.parse(<string>);


// **** CALLBACKS **** //

// var getUser = (id, callback) => {

// 	var user = {
// 		id: id,
// 		name: 'Charlie',
// 	};
// 	callback(user);

// };

// getUser(31, (userObj) => {
// 	// do something with data => user
// 	console.log(userObj);
// })


// make the request to Google API
request({
	url: geocodeUrl,
	json: true
}, (error, response, body) => {
	console.log("printing body: " + JSON.stringify(body, undefined, 2));
})

// how to grab the form values and use them in app.js
