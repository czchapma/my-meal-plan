	var express = require('express');
var fs = require('fs');
var engines = require('consolidate');
var app = express();
var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');
var exec = require('child_process').exec;
app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/templates'); // tell Express where to find templates
app.use(express.static(__dirname)); //allows css to work with rendered html

app.use(express.bodyParser());

var monthToNum = {'January' : 1, 'February' : 2, 'March' : 3, 'April' : 4, 'May': 5, 'June': 6, 'July' : 7, 'August' : 8, 'September' : 9, 'October' : 10, 'November' : 11, 'December' : 12};

//delete pre-existing databases
exec("rm -f *.db");
exec("rm -f *.ser");
exec("javac ML_Client.java User_Reviews.java RunML.java", function(error, stdout, stderr){
	console.log(error, stdout, stderr);
});
//Create DBs
var anyDB = require('any-db');
//TODO: Lol probably shouldn't store password directly in DB
var conn = anyDB.createConnection('sqlite3://users.db');
conn.query('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,username TEXT, password TEXT, month TEXT,day TEXT, gender TEXT)');
//Navigates to Brown's get portal to get credit/points info
app.get('/login', function(req, res){
	res.render('login.html',{login: 'notyet'});
});

app.get('/newaccount', function(req, res){
	res.render('newaccount.html');
});

app.post('/storeUser', function(req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var month = req.body.month;
	month = monthToNum[month];
	var year = req.body.year;
	var gender = req.body.gender;
	var password = req.body.password;
	if (gender === 'other'){
		var otherType = req.body.otherType;
	}
	//double check that there isn't an existing username
	var queryString = 'SELECT id FROM users WHERE username=$1';
    conn.query(queryString, [email], function(nameError, nameRes){
		if (nameRes.rows.length === 0){
			var queryString = 'INSERT INTO users VALUES ($1, $2, $3, $4, $5, $6, $7)';
		    conn.query(queryString, [null, name, email, password, month, year, gender], function(error, result){
				var queryString = "SELECT id FROM users WHERE username=$1";
				conn.query(queryString, [email], function(lookupErr, lookupRes){
					//Add to ML Client
					var csvString = String(lookupRes.rows[0].id) +"," + name + "," + gender + "," + otherType + "," + year + "," + month;
					console.log(csvString);
					exec('java RunML ADD "' + csvString + '"', function (error, stdout, stderr) {
						console.log(stdout,stderr, error);
						if (stdout.indexOf('Warning: users already contains this userId. Aborting.') !== -1) {
							console.log('user already exists!');
						} else {
							console.log('all good');
						}
						res.redirect('/login');
					});
				});
			});
		} else {
			console.log("User already registered!");
			res.redirect('/login');
		}
	});
});

app.post('/retrieveUser', function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	var queryString = "SELECT * FROM users WHERE username=$1";
    conn.query(queryString, [username], function(error, results){
    	if(error){
    		console.log(error);
    	}
    	if (results === undefined || results.rows.length === 0){
    		console.log(results);
    		console.log('no such user', username,'found');
    	} else if (results.rows[0].password === password){
    		console.log('password correct!');
			res.render('mydining.html', {login: 'true'});
    	} else {
    		console.log('incorrect password, expected:',results.rows[0].password, 'but got', password);
			res.render('login.html',{login: 'failed'});
    	}
    });
});

app.post('/review', function(req, res){
	var username = req.body.username;
	var item = req.body.item;
	var rating = req.body.rating;
	var queryString = "SELECT id FROM users WHERE username=$1";
	conn.query(queryString, [username], function(err, results){
		if (results.rows.length > 0) {
			var id = String(results.rows[0].id);
			exec('java RunML MODIFY REVIEW ' + id + ' ' + item + ' ' + rating, function (error, stdout, stderr) {
				console.log('errors',error);
				console.log('stderr',stderr);
				console.log('stdout',stdout);
				//returns nothing
				//TODO: maybe return error to client?
				res.end();
			});
		} else {
			console.log('username',username,'not in db');
			res.end();
		}
	});
});

//TODO: fix security threat. By just concatenating the calls to RunML. someone could use some form of injection I think. 
//My guess is that you could do something to turn the string into multiple lines, and then literally run anything serverside.
app.post('/guess',function(req,res){
	var username = req.body.username;
	var item = req.body.item;
	var rating = req.body.rating;
	var queryString = "SELECT id FROM users WHERE username=$1";
	conn.query(queryString, [username], function(err, results){
		var id = String(results.rows[0].id);
		exec('java RunML PING GUESS ' + id + ' ' + item + ' ' + rating, function (error, stdout, stderr) {
			console.log('errors',error);
			console.log('stderr',stderr);
			//returns the rating (ex: 1.0)
			res.end(stdout);
		});
	});
});

app.get('/print',function(req,res){
		exec('java RunML PRINT', function (error, stdout, stderr) {
			console.log('errors',error);
			console.log('stderr',stderr);
			console.log('stdout',stdout);
			
			res.end(stdout);
		});
	
});

//adds a bunch of testing data to the database
app.get('/populateTests', function(req,res){
	res.render("testPop.html");
});

app.post('/suggest',function(req,res){
	var username = req.body.username;
	var numItems = req.body.numItems;
	var k = 3;
	console.log(username);
	console.log(numItems);
	var queryString = "SELECT id FROM users WHERE username=$1";
	conn.query(queryString, [username], function(err, results){
		var id = String(results.rows[0].id);
		exec('java RunML PING SUGGEST ' + id + ' ' + numItems + ' ' + k, function (error, stdout, stderr) {
			console.log('errors',error);
			console.log('stderr',stderr);
			//returns the suggestions comma separated
			res.end(stdout);
		});
	});
});

app.post('/trackCredits', function(req, res){
	var credits = parseInt(req.body.credits); //integer
	var points = parseFloat(req.body.points); //might be float, could be integer
	var obj = {};
	var lastDay = moment('May 16, 2014');
	var today = moment();
	var daysLeft = lastDay.diff(today, 'days');
	var creditsLeft = credits / daysLeft;
	creditsLeft = Math.round(creditsLeft * 100) / 100;
	var pointsLeft = points/ daysLeft;
	pointsLeft = Math.round(pointsLeft * 100) / 100;
	obj['credits'] = creditsLeft;
	obj['points'] = pointsLeft;
	res.json(JSON.stringify(obj));
});

app.get('/dininghalls', function(req, res) {
	res.render('dininghalls.html');
});

app.get('/specials', function(req, res) {
    res.render('specials.html');
});

app.get('/mydining', function(req, res) {
	res.render('mydining.html', {login: 'false'});
});

app.get('/mydining/log', function(req,res) {
	console.log("I'M HERE");
	res.render('mydininglog.html');
});

app.get('/menu/ratty', function(req, res) {
	makeRequest('http://www.brown.edu/Student_Services/Food_Services/eateries/refectory_menu.php',function(body){
		$ = cheerio.load(body);
		var day = moment().day();
		var bSrc = $('#Breakfast').attr('src');
		var lSrc = $('#Lunch').attr('src');
		var dSrc = $('#Dinner').attr('src');
		var ignoreList = ["",".","OPENS FOR LUNCH", "Opens for lunch","Opens for Lunch", "Roots & Shoots","Grill","Bistro","Chef\'s Corner"];
		var time = new Date().getHours();
		//TODO if time > 18 need THE NEXT DAYS breakfast
		if (day !== 0 && (time < 11 || time > 18)){
			console.log('day is', day);
			//Breakfast
			makeRattyIvyMenu(res,bSrc,ignoreList, false);
		} else if (time < 15 || (day === 0 && time > 18)) {
			//Lunch
			makeRattyIvyMenu(res,lSrc,ignoreList, false);
		} else {
			//Dinner
			makeRattyIvyMenu(res, dSrc, ignoreList, false);
		}
	});
});

app.get('/menu/vdub', function(req,res) {
	makeRequest('http://www.brown.edu/Student_Services/Food_Services/eateries/verneywoolley_menu.php', function(body){
		$ = cheerio.load(body);
		var src = $('iframe').first().attr('src');
		var ignoreList = ["",".","OPENS FOR LUNCH","Opens for lunch","Opens for Lunch",'spring 1', 'spring 2', 'spring 3', 'spring 4', 'spring 5', 'spring 6', 'spring 7', 'Breakfast','Lunch','Dinner', 'Daily Sidebars'];

		function callback(body){
			var toReturn = ["","","",""];
			$ = cheerio.load(body);
			var count = 0;
			$('td').each(function(idx, elem) {
				var text = $(this).text();
				//items not to include in our menu
				if (ignoreList.indexOf(text) === -1) {
					toReturn[count] += text + '\n';
				}

				//increment count
				if (text !== ".") {
					count += 1;
					if (count > 3){
						count = 0;
					}
				}
			});

			//get rid of extra new line
			for(var i=0; i< toReturn.length; i++){
				toReturn[i] = toReturn[i].substr(0,toReturn[i].length - 1);
			}

			var time = new Date().getHours();
			if (time < 11 || time > 19){
				//Breakfast
				res.end(toReturn[1]);
			} else if (time < 15){
				//Lunch
				res.end(toReturn[2] + '\n' + toReturn[0]);
			} else {
				//Dinner
				res.end(toReturn[3] + '\n' + toReturn[0]);
			}
		}
		makeRequest(src, callback);
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
			makeRattyIvyMenu(res,src,ignoreList, false);
		} else {
			//Dinner Menu
			res.end('Mac and Cheese\nFalafel Wrap\nTacos\nPizza\nSmoothies');
		}
	});
});

app.get('/menu/andrews', function(req,res){
	res.write("Panini's\nPastas\nPizza\nGreen Curry Chicken\nJungle Vegetable Yellow Curry\nSushi\n");
	andrewsSpecials(res);
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
	res.end('Gnocchi\nCustom Salad\nSpicy With\nBeef Carb\nTurkey Carb\nChicken Carb\nMozerella Sticks\nFries\nOnion Rings');
});

app.get('/status/ratty', function(req, res) {
	var hour = new Date().getHours();
	var minute = new Date().getMinutes();
	var day = moment().day();
	var toReturn = {};
	//Sunday Brunch 10:30 - 4PM
	if ((day === 7) && (((hour === 10 && minute >= 30) || hour > 10) && hour < 16)) {
		toReturn['open'] = 'true';
		toReturn['message'] = "Currently open for Brunch until 4PM!";
	//Breakfast: 7:30 - 11
	} else if (day !== 7 && (((hour === 7 && minute > 30) || hour > 8) && hour < 11)){
		toReturn['open'] = 'true';
		toReturn['message'] = 'Currently open for Breakfast until 11AM!';
	//Lunch: 11AM - 4PM
	} else if(hour >= 11 && hour < 16){
		toReturn['open'] = 'true';
		toReturn['message'] = 'Currently open for Lunch until 4PM!';
	//Dinner: 4PM - 7:30PM
	} else if(hour >= 16 && (hour < 19 || (hour === 19 && minute < 30))) {
		toReturn['open'] = 'true';
		toReturn['message'] = 'Currently open for Dinner until 7:30PM!'
	} else {
		toReturn['open'] = 'false';
		//Sunday brunch starts at 10:30am, otherwise 7:30AM
		if(day === 6){
			toReturn['message'] = 'Closed! Re-opens tomorrow at 10:30AM';
		} else {
			toReturn['message'] = 'Closed! Re-opens tomorrow at 7:30AM';
		}
	}
	res.json(JSON.stringify(toReturn));
});

app.get('/status/vdub', function(req, res) {
	var hour = new Date().getHours();
	var minute = new Date().getMinutes();
	var day = moment().day();
	var toReturn = {};
	//Weekends closed
	if (day === 6 || day === 7){
		toReturn['open'] = 'false';
		toReturn['message'] = 'Closed! Re-opens Monday at 7:30AM';
	}
	//Breakfast: 7:30 - 11
	else if (((hour === 7 && minute > 30) || hour > 8) && hour < 11){
		toReturn['open'] = 'true';
		toReturn['message'] = 'Currently open for Breakfast until 11AM!';
	//Lunch: 11AM - 2PM
	} else if(hour >= 11 && hour < 14){
		toReturn['open'] = 'true';
		toReturn['message'] = 'Currently open for Lunch until 2PM!';
	//Closed 2PM - 4:30PM
	} else if (hour >= 14 && (hour < 16 || hour === 16 && minute < 30)) {
		toReturn['open'] = 'false';
		toReturn['message'] = 'Closed! Re-opens today at 4:30PM';
	//Dinner: 4:30PM - 7:30PM
	} else if((hour >= 16 || hour === 16 && minute >= 30) && (hour < 19 || (hour === 19 && minute < 30))) {
		toReturn['open'] = 'true';
		toReturn['message'] = 'Currently open for Dinner until 7:30PM!'
	} else {
		toReturn['open'] = 'false';
		if(day === 5){
			toReturn['message'] = 'Closed! Re-opens Monday at 7:30AM';
		} else {
			toReturn['message'] = 'Closed! Re-opens tomorrow at 7:30AM';
		}
	}
	res.json(JSON.stringify(toReturn));
});

//TODO: known bug - will display wrong message if it's the morning before opening
app.get('/status/blueroom', function(req, res){
	var hour = new Date().getHours();
	var minute = new Date().getMinutes();
	var day = moment().day();
	var toReturn = {};
	//Weekdays: 7:30AM - 9PM
	if (day !== 6 && day !== 7){
		if (((hour === 7 && minute >= 30) || hour > 7) && hour < 21) {
			toReturn['open'] = 'true';
			toReturn['message'] = 'Currently open until 9PM!';
		} else {
			toReturn['open'] = 'false';
			//Fridays after closing, the next open time is 9
			if (day === 5){
				toReturn['message'] = 'Closed! Re-opens tomorrow at 9AM';
			} else {
				toReturn['message'] = 'Closed! Re-opens tomorrow at 7:30AM';
			}
		}
	//Weekends: 9AM - 5PM
	} else {
		if (hour >= 9 && hour < 17){
			toReturn['open'] = 'true';
			toReturn['message'] = 'Currently open until 5PM';
		} else {
			toReturn['open'] = 'false';
			if (day === 6){
				toReturn['message'] = 'Closed! Re-opens tomorrow at 9AM';
			} else {
				toReturn['message'] = 'Closed! Re-opens tomorrow at 7:30AM';
			}
		}
	}
	res.json(JSON.stringify(toReturn));
});

app.get('/status/ivyroom', function(req, res) {
	var hour = new Date().getHours();
	var minute = new Date().getMinutes();
	var day = moment().day();
	var toReturn = {};
	//Lunch, Weekdays 11:30AM - 1:45PM
	if (day < 6 && ((hour === 11 && minute >= 30) || (hour >= 12 && (hour < 13 || hour === 13 && minute <= 45)))) {
		toReturn['open'] = 'true';
		toReturn['message'] = 'Currently open for Lunch until 1:45PM';
	} else if (day === 6 || day === 5){
		toReturn['open'] = 'false';
		toReturn['message'] = 'Closed! Re-opens Sunday at 7:30PM';
	} else if (((hour === 19 && minute >= 30) || hour > 19) && hour < 24) {
		toReturn['open'] = 'true';
		toReturn['message'] = 'Open for Dinner until Midnight';
	} else {
		toReturn['open'] = 'false';
		if (hour < 5){
			toReturn['message'] = 'Closed! Re-opens tomorrow at 7:30PM';
		} else {
			toReturn['message'] =  'Closed! Re-opens today at 7:30PM';
		}
	}
	res.json(JSON.stringify(toReturn));
});

app.get('/status/aco', function(req,res) {
	var hour = new Date().getHours();
	var toReturn = {};
	if ((hour >= 0 && hour < 2) || hour > 11){
		toReturn['open'] = 'true';
		toReturn['message'] = 'Open until 2AM!';
	} else {
		toReturn['open'] = 'false';
		toReturn['message'] = 'Closed! Re-opens today at 11AM';
	}
	res.json(JSON.stringify(toReturn));
});

app.get('/status/jos', function(req,res){
	var hour = new Date().getHours();
	var toReturn = {};
	if ((hour >= 0 && hour < 2) || hour >= 18) {
		toReturn['open'] = 'true';
		toReturn['message'] = 'Open until 2AM!';
	} else {
		toReturn['open'] = 'false';
		toReturn['message'] = 'Closed! Re-opens today at 6PM';
	}
	res.json(JSON.stringify(toReturn));

});

app.get('/times/ratty', function(req,res){
	res.end('Monday - Saturday: 7:30AM - 7:30PM\nSunday: 10:30AM - 7:30PM');
});

app.get('/times/vdub', function(req,res){
	res.end('Weekdays\nBreakfast: 7:30AM - 9:30AM\nContinental Breakfast: 9:30AM - 11AM\nLunch: 11AM - 2PM\nDinner: 4:30PM-7:30PM\nSaturday/Sunday: Closed');
});

app.get('/times/blueroom', function(req,res){
	res.end('Weekdays: 7:30AM - 9PM\nWeekends: 9AM - 5PM');
});

app.get('/times/ivyroom', function(req,res){
	res.end('Weekday Lunch: 11:30AM - 1:45PM\nSunday - Thursday Dinner: 7:30PM - Midnight');
});

app.get('/times/jos', function(req,res){
	res.end('6PM - 2AM daily');
});

app.get('/times/aco', function(req,res){
	res.end('11AM - 2AM daily');
});

app.get('/specials/ratty', function(req, res){
	makeRequest('http://www.brown.edu/Student_Services/Food_Services/eateries/refectory_menu.php',function(body){
		$ = cheerio.load(body);
		var lSrc = $('#Lunch').attr('src');
		var dSrc = $('#Dinner').attr('src');
		var time = new Date().getHours();
		if (time < 15){
			//Lunch
			makeRattyIvyMenu(res,lSrc,[], true);
		} else {
			//Dinner
			makeRattyIvyMenu(res, dSrc, [], true);
		}
	});
});

app.get('/specials/vdub', function(req, res){
	makeRequest('http://www.brown.edu/Student_Services/Food_Services/eateries/verneywoolley_menu.php', function(body){
		$ = cheerio.load(body);
		var src = $('iframe').first().attr('src');
		var ignoreList = ["",".","OPENS FOR LUNCH","Opens for lunch","Opens for Lunch",'spring 1', 'spring 2', 'spring 3', 'spring 4', 'spring 5', 'Breakfast','Lunch','Dinner', 'Daily Sidebars'];

		function callback(body){
			var toReturn = ["","","",""];
			$ = cheerio.load(body);
			var count = 0;
			var time = new Date().getHours();
			$('td').each(function(idx, elem) {
				var text = $(this).text();
				if (time < 15 && idx === 22){
					//Lunch
					res.end('(Lunch) ' + text);
				} else if (idx === 23){
					//Dinner
					res.end('(Dinner) ' + text);
				}
			});
		}
		makeRequest(src, callback);
	});
});

app.get('/specials/blueroom', function(req, res){
	makeRequest('https://www.google.com/calendar/htmlembed?showTitle=0&showNav=0&showDate=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0&mode=AGENDA&height=500&wkst=1&bgcolor=%23FFFFFF&src=brown.edu_ecua9ff3gkcocn27ffon8700dk%40group.calendar.google.com&color=%23B1440E&src=brown.edu_1qo9psm1828mt6apg4df9rb9dc%40group.calendar.google.com&color=%23875509&src=brown.edu_eof6uj287ti6bvajbhsbfest90%40group.calendar.google.com&color=%232F6309&src=brown.edu_urf3617tirt011tjh67jc8l3o8%40group.calendar.google.com&color=%232F6309&ctz=America%2FNew_York', function(body){
		$ = cheerio.load(body);
		var day = $('.events').first();
		var obj = {}
		var items = day.find('span[class=event-summary]').each(function(idx, elm){
			if (idx === 1){
				res.end($(this).text());
			}
		});
	});
});

app.get('/specials/ivyroom', function(req, res){
	makeRequest('http://www.brown.edu/Student_Services/Food_Services/eateries/ivyroom_menu.php', function(body){
		$ = cheerio.load(body);
		var src = $('iframe').first().attr('src');
		var ignoreList = ['.', ''];

		function callback(body){
			var toReturn = ""
			$ = cheerio.load(body);
			$('td').each(function(idx, elem) {
				var text = $(this).text();
				if (idx === 7){
					toReturn += text + ', ';
				} else if (idx === 9){
					toReturn += text;
				}
			});
			res.end(toReturn);
		}
		makeRequest(src, callback);
	});
});

app.get('/specials/jos', function(req, res){
	var day = moment().day();
	var time = new Date().getHours();

	//Midnight - 2AM there is no Quesedillas/Grilled Cheese
	if (time < 23 && time > 3){
		if (day === 1 || day === 3 || day === 7) {
			//Grilled cheese Sunday/Monday/Wednesday
			res.write('Gormet Grilled Cheese, ');
		} else {
			//Quesadillas every other night
			res.write('Quesadillas, ');
		}
	}
	res.end('Gnocchi');
});

app.get('/specials/aco', function(req, res){
	andrewsSpecials(res);
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

function makeRattyIvyMenu(response, menuUrl, ignoreList, specials){
	function callback(body){
		var toReturn = ""
		$ = cheerio.load(body);
		$('td').each(function(idx, elem) {
			var text = $(this).text();
			//items not to include in our menu
			if (!specials && ignoreList.indexOf(text) === -1) {
				toReturn += text + '\n';
			} else if (specials){
				//Specials for Ratty: Bistro item and Salad Bar
				if (idx === 14){
					toReturn += text + '\n';
				} else if (text.indexOf('Salad Bar') !== -1){
					toReturn += text + '\n';
				}
			}
		});
		response.end(toReturn.substr(0,toReturn.length - 1));
	}
	makeRequest(menuUrl, callback);
}

function andrewsSpecials(res) {
	var time = new Date().getHours();
	//Lunch Menu
	if (time < 14){
		res.end('Vietnamese Pho with Beef, Chicken or Tofu & Veggies\nSpicy Thai Pho with Beef, Chicken or Tofu & Veggies');
	} else {
		//Dinner Menu
		res.end('Thai BBQ Chicken\nChicken & Veggie\nSteamed jasmine rice\n')
	}
}
