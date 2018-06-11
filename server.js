const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const router = express.Router();
const routes = require('./routes/routes.js');



const app = express();

app.use(bodyParser.json({
	type: "*/*"
}));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname + '/public')));



app.use('/', routes)

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`App started, listening on port ${port}`);
});


