const axios = require('axios');

/***** Promise Chaining *****/
var asyncAdd = (a, b) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (typeof a === 'number' && typeof b === 'number'){
				resolve(a+b);
			} else {
				reject('Arguments must be numbers');
			}
		}, 1500);
	});
}


asyncAdd(5,7).then((res) => {
	console.log('Result: ', res);
	return asyncAdd(res, 33); // return a nother Promise
}, (errorMessage) => {
	console.log(errorMessage);
})
.then((res) => {
	console.log('should be 45', res);
}, (errorMessage) => {
	console.log(errorMessage);
});


var googleGeocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipcode}`;

axios.get(googleGeocodeUrl)

	.then((response) => {
		// response.data
		var city;
		var state_code;

		for(var i = 0; i < data.results[0].address_components.length; i++){
			var component = data.results[0].address_components[i];

	        switch(component.types[0]) {
	            case 'locality':
	                city = component.long_name;
	                break;
	            case 'administrative_area_level_1':
	                state_code = component.short_name;
	                break;
	            
	        }
		}
		var minimumWageUrl = `https://typ3wonolo:wontyp3y17@wonolo.herokuapp.com/get_minimum_wage?city=${city}&state_code=${state_code}`;

		axios.get(minimumWageUrl).then((response) => {

			// minWage =

			var fillRateUrl = `https://wonolo-ml.herokuapp.com/savcal?auth_token=19bd75e4-659e-4b99-b4dc-68d86e51efdc&model=15_1_saving_calculator&category=${industry}&zip=${zipcode}&rate=${hourlyWage}`;
		})

	})
	.catch((error) => {
		// do something here
		console.log(error);
	})








				var getGeocode = $.ajax({
						url: googleGeocode,
						type: "GET",
						dataType: "json",

					}),

					getMinWage = getGeocode.then(function(data){

						var city;
						var state_code;

						for(var i = 0; i < data.results[0].address_components.length; i++){
							var component = data.results[0].address_components[i];

				            switch(component.types[0]) {
				                case 'locality':
				                    city = component.long_name;
				                    break;
				                case 'administrative_area_level_1':
				                    state_code = component.short_name;
				                    break;
				                
				            }
						}
						console.log(city,state_code);
						var minimumWageUrl = `https://typ3wonolo:wontyp3y17@wonolo.herokuapp.com/get_minimum_wage?city=${city}&state_code=${state_code}`;

						return $.ajax({
				    		url: minimumWageUrl,
				    		type: 'GET',
				    		dataType: 'json',
				    		
				    	});

					})


var hourlyWage;

				getMinWage.done(function(data){
					console.log("minimum wage value: " + data);
					hourlyWage = billableRate * .6;
					minimumWageValue = data.minimum_wage;

					console.log("Industry is: " + industry);
					console.log("Zipcode is: " + zipcode);
					console.log("Hourly Wage is: " + hourlyWage);
					// ****** FILL RATE ****** //
			    	var fillRateUrl = `https://wonolo-ml.herokuapp.com/savcal?auth_token=19bd75e4-659e-4b99-b4dc-68d86e51efdc&model=15_1_saving_calculator&category=${industry}&zip=${zipcode}&rate=${hourlyWage}`;

			    	var getFillRate = $.ajax({
				    		url: fillRateUrl,
				    		type: 'GET',
				    		dataType: 'json',

				    	})

			    	// execute getFillRate
		    		getFillRate.done(function(data){
		    			console.log("fill rate value: " + data);
			    		fillRate = data.fill_rate;

			    		// display results
			    		checkResults(hourlyWage, minimumWageValue, fillRate);
			    		delayResults(showResults);
		    		});


		    		
				});
