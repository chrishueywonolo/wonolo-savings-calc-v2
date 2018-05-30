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
}, (errorMessage) => {
	console.log(errorMessage);
})

/*
var somePromise = new Promise((resolve, reject) => {
	// only can pass one obj to resolve() and reject()
});

somePromise.then((obj) => {
	// only called if Promise works as expected
	// can pass obj
}, (errorMessage) => {
	// print error message
});

*/

/***** Promise Chaining *****/


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


// takes one function which is error handler
// can remove the errorHandler from previous Promises
.catch((errorMessage) => {
	console.log(errorMessage);
});
