const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', (req, res) => {
	res.render('index.hbs',{});
});

router.post('/', (req, res) => {
	console.log("inside the routes.js post...")
	// console.log(typeof req.body.billableRate);
	
	/*{ 
	industry: 'Delivery',
	  zipcode: '94066',
	  billableRate: '10',
	  staffingAgency: '',
	  numOfWorkers: '10' 
	}*/

	var industry = req.body.industry;
	var zipcode = req.body.zipcode;
	var billableRate = parseInt(req.body.billableRate);
	var staffingAgency = req.body.staffingAgency;
	var numOfWorkers = parseInt(req.body.numOfWorkers);


	// get the geocode
	var googleGeocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipcode}&key=AIzaSyCNDtxwhsmDX3jtE0vffrRX87PMzP481pY`;

	axios.get(googleGeocodeUrl)

		.then((response) => {
			// response.data

			console.log("Response from Google Maps API: ");
			console.log(response.data.results);

			var city;
			var state_code;

			for(var i = 0; i < response.data.results[0].address_components.length; i++){
				var component = response.data.results[0].address_components[i];

		        switch(component.types[0]) {
		            case 'locality':
		                city = component.long_name;
		                break;
		            case 'administrative_area_level_1':
		                state_code = component.short_name;
		                break;
		            
		        }
			}

			console.log("the city is: " + city);
			console.log("the state is: " + state_code);

			var minimumWageUrl = `https://typ3wonolo:wontyp3y17@wonolo.herokuapp.com/get_minimum_wage?city=${city}&state_code=${state_code}`;

			axios.get(minimumWageUrl, {

				data: {},
				headers: {
					'Accept': '*/*',
					'Content-Type': "text/plain; charset=utf-8; application/json; text/html",
					'Accept-Charset': '*',

				}

			})

			.then((response) => {

				console.log('starting to find the fill rate');


				var minimum_wage = response.minimum_wage;
				var hourlyWage = billableRate * .6;

		    	// Retrieve fill rate

				var fillRateUrl = `https://wonolo-ml.herokuapp.com/savcal?auth_token=19bd75e4-659e-4b99-b4dc-68d86e51efdc&model=15_1_saving_calculator&category=${industry}&zip=${zipcode}&rate=${hourlyWage}`;


				axios.get(fillRateUrl)

				.then((response) => {

					console.log("grabbed fill rate");
					console.log(response.data);

					var wonoloFee = 1.4;
					var standard_working_hours = 8;
					var avg_working_days = 261;
			    	var currentCost = (billableRate * numOfWorkers * standard_working_hours);
					var wonoloCost = ((hourlyWage * wonoloFee) * numOfWorkers * standard_working_hours);
					var savingsAmount = (currentCost - wonoloCost)*avg_working_days;

					var fill_rate_val;
					fill_rate_percentage = response.data;

					if(fill_rate_percentage < .85){
						fill_rate_val = .85;
					}


					console.log("Fill rate val: " + fill_rate_val);
					console.log("Savings amount: " + savingsAmount)

					var result = {
						fill_rate: fill_rate_val,
						savings: savingsAmount
					}

					res.send(result);


				})
				.catch((error) => {

					console.log("this is the error after making request ot fill rate");
				})

			})
			.catch((error) => {
				console.log("this is the error after making request to min wage");
				console.log(error);
			})

		})
		.catch((error) => {
			// do something here
			console.log("there is an error occuring")
			console.log(error);
		})


	
})

module.exports = router

