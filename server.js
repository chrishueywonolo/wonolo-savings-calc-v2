const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

// registering middleware
// app.use(() => {
// 
// })

// app.use((req, res, next) => {

// 	// must call next() for app to move on
// })

// /*
// hbs.registerHelper(<name of func>, (args) => {

// })
// */


// // <p>{{<name of helper}} arg1 arg2</p>


// app.get('/', (req, res) => {
// 	// can pass any data through to the template
// 	res.render('index.hbs', {});
// });





router.get('/', (req, res) => {
	res.render('index.hbs',{})
});

router.post('/', (req,res) => {
	res.send('This is the homepage with POST request')
});

app.use('/', router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`App started, listening on port ${port}`);
});


