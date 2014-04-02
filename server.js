var express = require('express');
var fs = require('fs');
var engines = require('consolidate');
var app = express();
var request = require('request');
var cheerio = require('cheerio');
app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/templates'); // tell Express where to find templates
app.use(express.static(__dirname)); //allows css to work with rendered html

app.use(express.bodyParser());
 
//Navigates to Brown's get portal to get credit/points info
app.get('/login', function(req, res){
	res.redirect('http://www.brown.edu/getportal');
});
app.get('/dininghalls', function(req, res) {
	res.render('dininghalls.html');
});

app.get('/specials', function(req, res) {
	res.render('specials.html');
});

app.get('/mydining', function(req, res) {
	res.render('mydining.html');
});

app.get('/rattymenu', function(req, res) {
	makeRequest('http://www.brown.edu/Student_Services/Food_Services/eateries/refectory_menu.php',function(body){
		$ = cheerio.load(body);
		var bSrc = $('#Breakfast').attr('src');
		var lSrc = $('#Lunch').attr('src');
		var dSrc = $('#Dinner').attr('src');
		//Breakfast
		var ignoreList = ["",".","Opens for lunch","Opens for Lunch", "Roots & Shoots","Grill","Bistro","Chef\'s Corner"];
		makeRattyMenu(bSrc,ignoreList);
		//Lunch
		makeRattyMenu(lSrc,ignoreList);
		//Dinner
		makeRattyMenu(dSrc, ignoreList);
	});
	res.end('done!');
});
app.get('/', function(req, res){
	res.render('home.html');
});

app.get('*', function(req,res){
	console.log('not implemented yet!');
});
//Visit localhost:8080
app.listen(8080, function(){
	console.log("server running on port 8080");
});


function makeRequest(url, callback){
	request(url, function(error, response, body){
		callback(body);
	});
}

function makeRattyMenu(menuUrl, ignoreList){
	var toReturn = [];
	makeRequest(menuUrl, function(body){
		$ = cheerio.load(body);
		$('td').each(function(idx, elem) {
			var text = $(this).text();
			//items not to include in our menu
			if (ignoreList.indexOf(text) === -1) {
				toReturn.push(text);	
			}
		});
		return toReturn;
	});
}
