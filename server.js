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
	makeRequest('/getportal', function(body){
		$ = cheerio.load(body);
		console.log(body);
		var values = {}
		$('td').each(function(idx,elm){
			console.log(idx);
			if (idx === 0){
				//Bear Bucks
				values.add('bearbucks',elm.text());
			} else if(idx === 1) {
				//Flex Points
				values.add('flexpoints',elm.text());
			}
		});
		console.log(values);
		res.render('mydining.html');
	});
});

app.get('/getportal', function(req,res){
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
		var ignoreList = ["",".","Opens for lunch","Opens for Lunch", "Roots & Shoots","Grill","Bistro","Chef\'s Corner"];
		var time = new Date().getHours();
		if (time < 11 || time > 18){
			//Breakfast
			makeRattyVDubMenu(res,bSrc,ignoreList);
		} else if (time < 15){
			//Lunch
			makeRattyVDubMenu(res,lSrc,ignoreList);
		} else {
			//Dinner
			console.log('dinner');
			makeRattyVDubMenu(res, dSrc, ignoreList);
		}
	});
});

app.get('/vdubmenu', function(req,res) {
	makeRequest('http://www.brown.edu/Student_Services/Food_Services/eateries/verneywoolley_menu.php', function(body){
		$ = cheerio.load(body);
		var src = $('iframe').first().attr('src');
		var ignoreList = ["",".","Opens for lunch","Opens for Lunch",'spring 1', 'spring 2', 'spring 3', 'spring 4', 'Breakfast','Lunch','Dinner', 'Daily Sidebars'];
		makeRattyVDubMenu(res,src,ignoreList);
	});
});

app.get('/', function(req, res){
	res.render('home.html');
});

app.get('*', function(req,res){
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

function makeRattyVDubMenu(response, menuUrl, ignoreList){
	function callback(body){
		var toReturn = ""
		$ = cheerio.load(body);
		$('td').each(function(idx, elem) {
			var text = $(this).text();
			//items not to include in our menu
			if (ignoreList.indexOf(text) === -1) {
				toReturn += text + '\n';
			}
		});
		response.end(toReturn.substr(0,toReturn.length - 2));
	}
	makeRequest(menuUrl, callback);
}
