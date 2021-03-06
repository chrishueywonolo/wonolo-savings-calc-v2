const express = require('express');
const router = express.Router();
const axios = require('axios');
const https = require('https');
const querystring = require('querystring');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');



router.get('/', (req, res) => {
	res.render('index.hbs',{});
});

router.post('/calculate-savings', (req, res) => {
	// console.log("inside the routes.js post...")
	// console.log("req.body data from calculate savings: ")
	// console.log(req.body);


	var billableRate = req.body.billableRate;
	if(billableRate[0] == "0"){
		billableRate = billableRate.slice(1,billableRate.length);
		billableRate = parseInt(billableRate);
	}


	var numOfWorkers = req.body.numOfWorkers;
	if(numOfWorkers[0] == "0"){
		numOfWorkers = numOfWorkers.slice(1,numOfWorkers.length);
		numOfWorkers = parseInt(numOfWorkers);
	}

	var industry = req.body.industry;
	var zipcode = req.body.zipcode;
	// var billableRate = parseInt(req.body.billableRate);
	var staffingAgency = req.body.staffingAgency;
	// var numOfWorkers = parseInt(req.body.numOfWorkers);
	var useStaffingAgency = req.body.useStaffingAgency;

	var zap_obj = {
		industry,
		zipcode,
		billableRate,
		staffingAgency,
		numOfWorkers,
		useStaffingAgency
	}

	axios.post('https://hooks.zapier.com/hooks/catch/2761357/an40ps/',zap_obj)
	.then((response) => {
		// console.log('sent staffing info to zapier');
		// console.log(response);
		// don't do anything
		
	})
	.catch((error) => {
		// console.log('error sending data obj to zapier');
		// console.log(error);
	})



	// get the geocode
	var googleGeocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipcode}&key=AIzaSyCNDtxwhsmDX3jtE0vffrRX87PMzP481pY`;

	axios.get(googleGeocodeUrl)

		.then((response) => {
			// response.data

			// console.log("Response from Google Maps API: ");
			// console.log(response.data.results);

			// error handling for when invalid zipcode/zero_results
			if(response.data.status === "ZERO_RESULTS"){

				var error_message = "Sorry, we couldn't find locate that zipcode"
				res.send(error_message);
			}

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

			// console.log("the city is: " + city);
			// console.log("the state is: " + state_code);

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

				// console.log('starting to find the fill rate');

				// console.log(response);
				// console.log("minimum wage", response.data.minimum_wage);

				var minimum_wage = response.data.minimum_wage;

				// console.log("billable rate", billableRate);
				// console.log(minimum_wage);


				var hourlyWage;


				if(useStaffingAgency === "no"){

					hourlyWage = billableRate;
					if(hourlyWage < minimum_wage){

						var min_wage_msg = "Please double check that you have entered a hourly wage higher than the minimum wage in your area.";
						var obj = {

							min_wage_err: true,
							min_wage_msg: min_wage_msg

						};

						res.send(obj);


					}

				} else {

					hourlyWage = billableRate * .4;
					if(billableRate < minimum_wage){

						var min_wage_msg = "Please enter a billable rate value above the minimum wage in your area.";
						var obj = {

							min_wage_err: true,
							min_wage_msg: min_wage_msg

						};

						res.send(obj);

					}
				}

				

		    	// Retrieve fill rate

				var fillRateUrl = `https://wonolo-ml.herokuapp.com/savcal?auth_token=19bd75e4-659e-4b99-b4dc-68d86e51efdc&model=15_1_saving_calculator&category=${industry}&zip=${zipcode}&rate=${hourlyWage}`;




				axios.get(fillRateUrl)

				.then((response) => {

					// console.log("grabbed fill rate");
					// console.log(response.data);

					var wonoloFee = 1.4;
					var standard_working_hours = 8;
					var avg_working_days = 261;
			    	var currentCost;
			    	var savingsAmount;
			    	var wonoloCost;
			    	var can_save;
			    	
			    	if(useStaffingAgency === "no"){


			    		var annual_wage = (hourlyWage * standard_working_hours * avg_working_days);
			    		var benefits_cost = annual_wage * .31;
			    		var hiring_cost = annual_wage * .10;
			    		var bad_hire_cost = annual_wage * .30;
			    		currentCost = annual_wage + benefits_cost + hiring_cost + bad_hire_cost;
			    		wonoloCost = hourlyWage * wonoloFee * standard_working_hours * avg_working_days;
			    		if(wonoloCost > currentCost){

			    			// do something
			    			savingsAmount = "-";
			    			can_save = false;

			    		} else {

			    			savingsAmount = (currentCost - wonoloCost) * numOfWorkers;
			    			can_save = true;

			    		}
			    		

			    	} else {

			    		currentCost = (billableRate * numOfWorkers * standard_working_hours); // how much you spend for 1 day
			    		wonoloCost = ((hourlyWage * wonoloFee) * numOfWorkers * standard_working_hours); // how much you spend w/ Wonolo for 1 day
			    		savingsAmount = (currentCost - wonoloCost) * avg_working_days; // how much you save over 1 year
			    		can_save = true;
			    	}

					var real_fill_rate;
					var fill_rate_msg = "";
					fill_rate_percentage = response.data;

					// console.log("this is the fill rate percentage: " + fill_rate_percentage);

					// find the difference between current_wage and minimum_wage
					// if (difference <= 1){ fill rate is 85% }
					// if (1 < difference <=5) { fill rate is random between 86% - 90% }
					// if (difference > 5) { fill rate is random between 90% - 100% }
					var wage_difference;
					wage_difference = hourlyWage - minimum_wage;
					var tier_2_rand_num = Math.floor(Math.random()*5);
					var tier_3_rand_num = Math.floor(Math.random()*9);

					var wage_diff_fill_rate = [.86, .87, .88, .89, .90, .91, .92, .93, .94, .95, .96, .97, .98, .99];


					if(wage_difference <= 1){

						real_fill_rate = .85;
						fill_rate_msg = "Your estimated fill rate is based on several factors. Please speak with a Wonolo Specialist to discuss how to improve this number.";

					} else if (1 < wage_difference <= 5) {

						real_fill_rate = wage_diff_fill_rate[Math.round(wage_difference)-1];
						fill_rate_msg = "Wow, looks like Wonolo is a great fit for your staffing needs. We encourage you to chat with a Wonolo Specialist to discuss how your business can benefit from using Wonolo.";

					} else if (5 < wage_difference <= 14) {

						real_fill_rate = wage_diff_fill_rate[Math.round(wage_difference)-1];
						fill_rate_msg = "Wow, looks like Wonolo is a great fit for your staffing needs. We encourage you to chat with a Wonolo Specialist to discuss how your business can benefit from using Wonolo.";

					} else {

						real_fill_rate = 1.00;

					}


					// if(fill_rate_percentage >= .86){

					// 	real_fill_rate = fill_rate_percentage;
					// 	fill_rate_msg = "Wow, looks like Wonolo is a great fit for your staffing needs. We encourage you to chat with a Wonolo Specialist to discuss how your business can benefit from using Wonolo.";

					// } else {

					// 	real_fill_rate = .85;
					// 	fill_rate_msg = "Your estimated fill rate is based on several factors. Please speak with a Wonolo Specialist to discuss how to improve this number.";

					// }


					var savings_msg = ["Your CFO is smiling right now.", "Wow, you'll be saving a lot.", "I'm not a clairvoyant, but I think I see a promotion in your future.","Winner winner, chicken dinner!","Pat yourself on the back.",

					]


					var rand_num;
					var selected_savings_msg;

					if(can_save){

						rand_num = Math.floor(Math.random()*5);
						selected_savings_msg = savings_msg[rand_num];

					} else {

						selected_savings_msg = "Sorry, we're unable to provide you with an estimation. Chat with a Wonolo rep to see if we're a good fit."

					}

					// console.log("Fill rate val: " + real_fill_rate);
					// console.log("Savings amount: " + savingsAmount)

					var result = {

						fill_rate: real_fill_rate,
						fill_rate_msg: fill_rate_msg,
						savings: savingsAmount,
						savings_msg: selected_savings_msg,
						industry: industry,
						can_save: can_save,

					}

					res.send(result);


				})
				.catch((error) => {

					// console.log("this is the error after making request ot fill rate");
				})

			})
			.catch((error) => {
				// console.log("this is the error after making request to min wage");
				// console.log(error);
			})

		})
		.catch((error) => {
			// do something here
			// console.log("there is an error occuring")
			// console.log(error);
		})


	
})


// when user submits modal form
router.post('/contact', (req,res) => {


	var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

	// console.log("this is the req.body data: ");
	// console.log(req.body);
	// console.log(req.body.first_name);

	var email = req.body.email;
	var first_name = req.body.first_name;
	var last_name = req.body.last_name;
	var phone = req.body.phone;
	var company = req.body.company;
	var position = req.body.position;
	var industry = req.body.industry;
	var call_me = req.body.call_me;

	// console.log(email, first_name, last_name, phone, company, position, industry, call_me);


	// build the data object
	var postData = querystring.stringify({
	    'email': email,
	    'firstname': first_name,
	    'lastname': last_name,
	    'phone': phone,
	    'company': company,
	    'jobtitle': position,
	    'contact_me': call_me,
	    'hs_context': JSON.stringify({
	        "hutk": req.cookies.hubspotutk,
	        "ipAddress": req.headers['x-forwarded-for'] || req.connection.remoteAddress,
	        "pageUrl": fullUrl,
	        "pageName": "Savings Calculator"
	    })
	});

	// set the post options, changing out the HUB ID and FORM GUID variables.

	var options = {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': postData.length
		}
	}

	// send to zapier sheet


	axios.post('https://hooks.zapier.com/hooks/catch/2761357/apcxmr/',postData)
	.then((response) => {
		// console.log('sent info to zapier');
		// console.log(response);
		// don't do anything
		
	})
	.catch((error) => {
		// console.log('error sending data obj to zapier');
		// console.log(error);
	})


	var url = 'https://forms.hubspot.com/uploads/form/v2/1862878/7bcb73a8-e9db-498f-a6ad-12ab975472be';


	axios.post(url, postData, options)

	.then((response) => {

		// run another call to the respective case study form
		if(response.status = 204){

			var case_study_form_id = 'dae05afb-4480-4288-b4d6-1f44604cd1b5';

			if(industry === 'Delivery'){

				case_study_form_id = 'ea293002-5ffd-4473-9b71-8c6da574b3d6';

			} else if(industry === 'Event_Staff') {

				case_study_form_id = '7d445f78-c19a-4c52-89e3-88cb0f034a51';

			} else if(industry === 'Merchandising') {

				case_study_form_id = '48fa635f-3dd6-417d-bbde-9b889c376f83';

			}


			var caseStudyUrl = `https://forms.hubspot.com/uploads/form/v2/1862878/${case_study_form_id}`


			axios.post(caseStudyUrl, postData, options)

			.then((response) => {
				
				if(response.status = 204){
					var msg = "Your contact information was successfully submitted."
					res.send(msg);
				}

			})
			.catch((error) => {

				// console.log("there was an error submitting the dynamic case study info to hubspot");
				// console.log(error);


			})
		}

		// https://hooks.zapier.com/hooks/catch/2761357/ape7jx/

	})
	.catch((error) => {

		// console.log("an error occurred submitting to hubspot");
		// console.log(error);

	})
})

module.exports = router

