const express = require('express');
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// setup handlebars view engine
const handlebars = require('express-handlebars');

app.engine('handlebars', 
	handlebars({defaultLayout: 'main'}));

app.set('view engine', 'handlebars');

// static resources
app.use(express.static(__dirname + '/public'));

// Use the zipCode module
const cities = require('./zipCodeModule_v2');

// GET request to the homepage

app.get('/',  (req, res) => {
	res.render('homeView');
});

app.get('/zip', (req, res) => {
	if (req.query.id){
	res.render('lookupByZipView', {
	id: req.query.id,
	response: cities.lookupByZipCode(req.query.id)
	});
	}
	else{
	res.render('lookupByZipForm');
	}
	});

app.post('/zip', (req, res) => {
	res.render('lookupByZipView', {
		id: req.body.id,
		response: cities.lookupByZipCode(req.body.id)
		});
});

// Implement the JSON, XML, & HTML formats

app.get('/zip/:id', (req, res) => {
	if(req.get("Accept") == 'application/xml'){
		data = cities.lookupByZipCode(req.params.id);
		let popXML = 
				'<?xml version="1.0"?>\n<zipCode id="' +
					req.params.id + '">\n\t<city>' + data.city + '</city>\n\t<state>' + data.state + '</state>\n\t<pop>'+data.pop+'</pop>\n</zipCode>'
		res.set('Content-Type', 'text/xml');
		res.send(popXML)
	}
	else if(req.get("Accept") == 'application/json'){
		res.json(cities.lookupByZipCode(req.params.id));
	}
	else{
		res.render('lookupByZipView',{
			id: req.params.id,
			response: cities.lookupByZipCode(req.params.id)
		});
	}

});



app.get('/city', (req, res) => {
	if (req.query.city && req.query.state) {
		var data = cities.lookupByCityState(req.query.city,req.query.state)
		res.render('lookupByCityStateView', {
			city: req.query.city,
			state: req.query.state,
			response: data
		});
	}
	else{
		res.render('lookupByCityStateForm')
	}
	});


app.post('/city', (req, res) => {
	var data = cities.lookupByCityState(req.body.city,req.body.state)
	res.render('lookupByCityStateView', {
		city: req.body.city,
		state: req.body.state,
		response: data
	});

});

// Implement the JSON, XML, & HTML formats

app.get('/city/:city/state/:state', (req, res) => {
	if(req.get("Accept") == 'application/xml'){
		let popXML = 
				'<?xml version="1.0"?>\n<city-state city="' +
					req.params.city + '" state="' + req.params.state + '">\n' + 
					cities.lookupByCityState(req.params.city, req.params.state).data.map(function(c){
						return '\t<entry zip="' + c.zip + ' pop="' + c.pop + '" />';
					}).join('\n') + '\n</city-state>\n';
		res.set('Content-Type', 'text/xml');
		res.send(popXML)
	}
	else if(req.get("Accept") == 'application/json'){
		res.json(cities.lookupByCityState(req.params.city, req.params.state))
	}
	else{
		res.render('lookupByCityStateView', {
			city: req.params.city,
			state: req.params.state,
			response: cities.lookupByCityState(req.params.city, req.params.state)
		})
	}


});



app.get('/pop', (req, res) => {
	if (req.query.state) {
		res.render('populationView', {
			state: req.query.state,
			response: cities.getPopulationByState(req.query.state)
		});
	}
	else{
		res.render('populationForm')
	}});

// Implement the JSON, XML, & HTML formats

app.get('/pop/:state', (req, res) => {
	if(req.get("Accept") == 'application/xml'){
		data = cities.getPopulationByState(req.params.state);
		let popXML = 
				'<?xml version="1.0"?>\n<state-pop state="' +
					data.state + '">\n\t<pop>' + data.pop + '</pop>\n</state-pop>'
		res.set('Content-Type', 'text/xml');
		res.send(popXML)
	}

	else if(req.get("Accept") == 'application/json'){
		res.json(cities.getPopulationByState(req.params.state))
	}
	else{
		res.render('populationView', {
			state: req.params.state,
			response: cities.getPopulationByState(req.params.state)
		})
	}

});


app.use((req, res) => {
	res.status(404);
	res.render('404');
});

app.listen(3000, () => {
  console.log('http://localhost:3000');
});

