var express = require('express');
var fs = require('fs');
var engines = require('consolidate');
var app = express();
var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');
app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/templates'); // tell Express where to find templates
app.use(express.static(__dirname)); //allows css to work with rendered html

app.use(express.bodyParser());
//Navigates to Brown's get portal to get credit/points info
app.get('/login', function(req, res){
	passport.authenticate('http://www.brown.edu/getportal');
	makeRequest('https://get.cbord.com/brown/full/funds_home.php', function(body){
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

app.get('/dininghalls', function(req, res) {
	res.render('dininghalls.html');
});

app.get('/specials', function(req, res) {
	res.render('specials.html');
});

app.get('/mydining', function(req, res) {
	res.render('mydining.html');
});

app.get('/menu/ratty', function(req, res) {
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

app.get('/menu/vdub', function(req,res) {
	makeRequest('http://www.brown.edu/Student_Services/Food_Services/eateries/verneywoolley_menu.php', function(body){
		$ = cheerio.load(body);
		var src = $('iframe').first().attr('src');
		var ignoreList = ["",".","Opens for lunch","Opens for Lunch",'spring 1', 'spring 2', 'spring 3', 'spring 4', 'spring 5', 'Breakfast','Lunch','Dinner', 'Daily Sidebars'];
		makeRattyVDubMenu(res,src,ignoreList);
	});
});

app.get('/menu/blueroom', function(req,res) {
	makeRequest('https://www.google.com/calendar/htmlembed?showTitle=0&showNav=0&showDate=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0&mode=AGENDA&height=500&wkst=1&bgcolor=%23FFFFFF&src=brown.edu_ecua9ff3gkcocn27ffon8700dk%40group.calendar.google.com&color=%23B1440E&src=brown.edu_1qo9psm1828mt6apg4df9rb9dc%40group.calendar.google.com&color=%23875509&src=brown.edu_eof6uj287ti6bvajbhsbfest90%40group.calendar.google.com&color=%232F6309&src=brown.edu_urf3617tirt011tjh67jc8l3o8%40group.calendar.google.com&color=%232F6309&ctz=America%2FNew_York', function(body){
		$ = cheerio.load(body);
		var day = $('.events').first();
		var obj = {}
		var items = day.find('span[class=event-summary]').each(function(idx, elm){
			if (idx === 0){
				obj['soups'] = $(this).text();
			} else if (idx === 1){
				obj['dinner'] = $(this).text();
			}
		});
		res.json(obj);
	});
});

app.get('/menu/ivyroom', function(req, res){
	makeRequest('http://www.brown.edu/Student_Services/Food_Services/eateries/ivyroom_menu.php', function(body){
		$ = cheerio.load(body);
		var src = $('iframe').first().attr('src');
		var ignoreList = ['.', ''];
		var time = new Date().getHours();
		//Lunch Menu
		if (time < 14){
			makeRattyVDubMenu(res,src,ignoreList);
		} else {
			//Dinner Menu
			res.write('Mac and Cheese\nFalafel Wrap\nTacos\nPizza\nSmoothies');
		}
	});
});

app.get('/menu/andrews', function(req,res){
	res.write("Panini's\nPastas\nPizza\nGreen Curry Chicken\nJungle Vegetable Yellow Curry\nSushi\n");
	var time = new Date().getHours();
	//Lunch Menu
	if (time < 14){
		res.end('Vietnamese Pho with Beef, Chicken or Tofu & Veggies\nSpicy Thai Pho with Beef, Chicken or Tofu & Veggies');
	} else {
		//Dinner Menu
		res.end('Thai BBQ Chicken\nChicken & Veggie\nSteamed jasmine rice\n')
	}
});

app.get('/menu/jos', function(req, res){
	var day = moment().day();
	var time = new Date().getHours();

	//Midnight - 2AM there is no Quesedillas/Grilled Cheese
	if (time < 23 && time > 3){
		if (day === 1 || day === 3 || day === 7) {
			//Grilled cheese Sunday/Monday/Wednesday
			res.write('Gormet Grilled Cheese\n');
		} else {
			//Quesedillas every other night
			res.write('Quesedillas\n');
		}
	}
	res.end('Three Burners\nCustom Salad\nSpicy With\nBeef Carb\nTurkey Carb\nChicken Carb\nMozerella Sticks\nFries\nOnion Rings');
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
		response.end(toReturn.substr(0,toReturn.length - 1));
	}
	makeRequest(menuUrl, callback);
}
