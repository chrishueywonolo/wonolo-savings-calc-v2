console.log("Starting app!");

// require() 
// - available to you whenever
// ex. const fs = require('fs');

// const x = require("./x.js");
// will bring in any code from "x.js"

// npm install <package name> --save
// adds to package.json file

const _ = require('lodash');
const fs = require('fs');
const request = require('request');
const express = require('express');
const axios = require('axios');
const app = express();
const https = require('https');
const http = require('http');
const forceSsl = require('express-force-ssl');

// const key = fs.readFileSync('./encryption/private.key');
// const cert = fs.readFileSync( './encryption/primary.crt' );
// const ca = fs.readFileSync( './encryption/intermediate.crt' );



// var options = {
//   key: key,
//   cert: cert,
//   ca: ca
// };

// app.use(forceSSl);

app.get('/', (req, res) => {
  res.send('Hello World')
});
 

// https.createServer(options, app).listen(443);
// http.createServer(app).listen(80);


app.listen(3000, () => {
	console.log("Listening on port 3000!");
});

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
// request({
// 	url: geocodeUrl,
// 	json: true
// }, (error, response, body) => {
// 	console.log("printing body: " + JSON.stringify(body, undefined, 2));
// })

// GET request
axios.get(<url>).then((response) => {
	// throw new Error('<custom msg'>);
	// response.data
})
.then((response) => {
	// do something here
})

.catch((e) => {
	// console.log(e);
})


// how to grab the form values and use them in app.js
