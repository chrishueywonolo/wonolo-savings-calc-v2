const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');

const router = express.Router();
const routes = require('./routes/routes.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));



app.use('/', routes)

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`App started, listening on port ${port}`);
});


