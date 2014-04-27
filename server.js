var express = require('express');
var fs = require('fs');
var engines = require('consolidate');
var app = express();
var request = require('request');
var cheerio = require('cheerio');
var moment = require('moment');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/templates'); // tell Express where to find templates
app.use(express.static(__dirname)); //allows css to work with rendered html

var passport = require('passport')
  , util = require('util')
  , GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


// API Access link for creating client ID and secret:
// https://code.google.com/apis/console/
var GOOGLE_CLIENT_ID = "332163333251-85agi4c8jqn9abr2s8cfnglfrmim17rl.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "lDt73HYtQlINdjV5A0dELjMk";
if (!process.env.PORT){
	GOOGLE_CLIENT_ID = "332163333251.apps.googleusercontent.com";
	GOOGLE_CLIENT_SECRET = "2DF_1WSIP_7jW7z9Gp_Rs0ok";

}
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "/logincallback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      
      // To keep the example simple, the user's Google profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Google account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

// configure Express for Passport
app.configure(function() {
  app.set('views', __dirname + '/templates'); // tell Express where to find templates
  app.set('view engine', 'ejs');
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname)); //allows css to work with rendered html
});

//Create DBs
var anyDB = require('any-db');
var connFood = anyDB.createConnection('sqlite3://food.db');
var conn = anyDB.createConnection('sqlite3://users.db');
var connBugs = anyDB.createConnection('sqlite3://bugs.db');
var connPurchases = anyDB.createConnection('sqlite3://purchases.db');
var connRatings = anyDB.createConnection('sqlite3://ratings.db');


var connFlavors = anyDB.createConnection('sqlite3://flavors.db');

var connMissing = anyDB.createConnection('sqlite3://missing.db');

exec("rm -f locked.txt");
exec("javac *.java", function(error, stdout, stderr){
	if(error !== null) {
		console.log(stderr);
	}
});


//Should ideally only be called once
function resetServer(){
	//delete pre-existing databases
	exec("rm -f *.db", function(error, stdout, stderr){
		exec("rm -f *.ser", function(error2, stdout2, stderr2){
			connFood = anyDB.createConnection('sqlite3://food.db');
			conn = anyDB.createConnection('sqlite3://users.db');
			connBugs = anyDB.createConnection('sqlite3://bugs.db');
			connPurchases = anyDB.createConnection('sqlite3://purchases.db');
			connRatings = anyDB.createConnection('sqlite3://ratings.db');		
			connMissing = anyDB.createConnection('sqlite3://missing.db');

			conn.query('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,username TEXT, month TEXT,day TEXT, gender TEXT)');
			fillFoodDB();
			connBugs.query('CREATE TABLE bugs(user TEXT, time INTEGER, message TEXT)');
			connPurchases.query('CREATE TABLE purchases (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, item TEXT, date TEXT)');
			connRatings.query('CREATE TABLE ratings (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, item TEXT, rating INTEGER)');
			connFlavors.query('CREATE TABLE flavors (user TEXT, item TEXT, flavor TEXT)');
			connMissing.query('CREATE TABLE missing (food TEXT, price INTEGER, location TEXT)');
		});
	});
}

//Comment out for for LIVE SITE!!
//resetServer();

var monthToNum = {'January' : 1, 'February' : 2, 'March' : 3, 'April' : 4, 'May': 5, 'June': 6, 'July' : 7, 'August' : 8, 'September' : 9, 'October' : 10, 'November' : 11, 'December' : 12};


app.post("/flavor", function(req,res){
	console.log("A FLAVOR!");
	var user = req.user.emails[0].value;
	var flavor= req.body.flavor;
	var item = req.body.item;
	var queryString = 'INSERT INTO flavors VALUES ($1, $2, $3)';
	var query = connFlavors.query(queryString, [user, item, flavor]); //TODO: log the actual time
	query.on('error', console.error);
	query.on('end', function(){
		res.end();
	});

});

app.post("/approve", function(req,res){
	var flavor = req.body.flavor;
	var item = req.body.item;

	var queryStringP = 'SELECT price, location FROM food WHERE item=$1';
	connFood.query(queryStringP, [item],function(error, results){
		if(error){
			console.error(error);
		}
		var info = results.rows[0];
		if(Number(info.price) === info.price) //TODO: make this actually check that price is defined
		{
			var newfood = (item + " - " + flavor);
			connFood.query('INSERT INTO food VALUES ($1,$2,$3)', [newfood, info.price, info.location]);
			addFoodToClient([newfood]);
		}
		var queryStringD = 'DELETE FROM flavors WHERE item=$1 AND flavor=$2';
		var queryD = connFlavors.query(queryStringD, [item, flavor]); 
		queryD.on('error', console.error);
		queryD.on('end', function(){
			res.end();
		});
	});
});

app.post("/approveMissing", function(req,res){
	console.log("approving missing");
	var food = req.body.food;
	var price = req.body.price;
	var location = req.body.location;
	console.log(food);
	console.log(price);
	console.log(location);
	connFood.query('INSERT INTO food VALUES ($1,$2,$3)', [food, price, location]).on('end',function(error, result){
		console.log(error);});
		addFoodToClient([food]);
		var queryStringD = 'DELETE FROM missing WHERE food=$1 AND price=$2 AND location=$3';
		var queryD = connMissing.query(queryStringD, [food, price,location]); 
		queryD.on('error', console.error);
		queryD.on('end', function(){
			res.end();
		});

});

app.post("/deny",function(req,res){
	var flavor = req.body.flavor;
	var item = req.body.item;
	var queryStringD = 'DELETE FROM flavors WHERE item=$1 AND flavor=$2';
	var queryD = connFlavors.query(queryStringD, [item, flavor]); 
	queryD.on('error', console.error);
	queryD.on('end', function(){
		res.end();
	});
});

app.get('/flavorData', function(req,res){
	var queryString = 'SELECT * from flavors';
	connFlavors.query(queryString, [], function(error, results){
		if(error){
			console.error(error);
			res.end();
		} else {
			res.json(results.rows);
		}
	});

});

app.get('/bugData', function(req,res){
	var queryString = 'SELECT * from bugs';
	connBugs.query(queryString, [], function(error, results){
		if(error){
			console.error(error);
		}
		res.json(results.rows);
	});

});

app.get('/missingData',function(req,res){

	var queryString = 'SELECT * from missing';
	connMissing.query(queryString, [], function(error, results){
		if(error){
			console.error(error);
			res.end();
		} else {
			res.json(results.rows);
		}
	});
});


app.post('/bugs',function(req, res) {
	console.log("A BUG!");
	var user = 'not logged in!';
  	if (req.isAuthenticated()) {
		user = req.user.emails[0].value;
	}
	var message = req.body.message;
	var queryString = 'INSERT INTO bugs VALUES ($1, $2, $3)';
	var query = connBugs.query(queryString, [user, 0, message]); //TODO: log the actual time
	query.on('error', console.error);
	query.on('end', function(){
		res.end();
	});
	});

app.post('/missing',function(req, res) {
	console.log("SOMETHING MISSING!");
	var food= req.body.food;
	var price = req.body.price;
	var location = req.body.location;
	var queryString = 'INSERT INTO missing VALUES ($1, $2, $3)';
	var query = connMissing.query(queryString, [food, price, location]); 
	query.on('error', console.error);
	query.on('end', function(){
		res.end();
	});
});
//Authenticates with google
app.get('/login',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile',
                                            'https://www.googleapis.com/auth/userinfo.email'] }),
  function(req, res){});

app.get('/logincallback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
  	//check if in the db
  	var email = req.user.emails[0].value;
  	console.log(email);
  	var queryString = 'SELECT id FROM users WHERE username=$1';
    conn.query(queryString, [email], function(nameError, nameRes){
		if (nameRes.rows.length === 0){
			//Not in DB
			res.redirect('/newaccount');
		} else{
			//already in DB
			res.redirect('/logpurchase');
		}
	});
});

//TODO: incorporate into clientside
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/isLoggedIn', function(req,res){
  if (req.isAuthenticated()) {
  	res.end('yes');
  } else{
  	res.end('no');
  }
});

app.get('/newaccount', ensureAuthenticated, function(req, res){
	res.render('newaccount.html', {name: req.user.displayName, email: req.user.emails[0].value});
});

//get 5 random items to rate, called in newaccount.js
app.get('/random5', function(req, res){
	var queryString = 'SELECT * FROM food ORDER BY RANDOM() LIMIT 5;';
	connFood.query(queryString, function(err, response){
		if(err){
			console.log(err);
		}
		res.json(response.rows);
	});
});

//get 1 random item to rate, called in newaccount.js
app.get('/random', function(req, res){
	var queryString = 'SELECT * FROM food ORDER BY RANDOM() LIMIT 1;';
	connFood.query(queryString, function(err, response){
		if(err){
			console.log(err);
		}
		res.json(response.rows);
	});
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
			var queryString = 'INSERT INTO users VALUES ($1, $2, $3, $4, $5, $6)';
		    conn.query(queryString, [null, name, email, month, year, gender], function(error, result){
				var queryString = "SELECT id FROM users WHERE username=$1";
				conn.query(queryString, [email], function(lookupErr, lookupRes){
					//Add to ML Client
					var csvString = String(lookupRes.rows[0].id) +"," + name + "," + gender + "," + otherType + "," + year + "," + month;
					console.log(csvString);
					var addToML = spawn('java', ["RunML", "ADD",csvString]);
					addToML.stdout.on('data', function(data) {
						//console.log('stdout: ',data);
					});
					addToML.stderr.on('data',function(data){
						console.log('stderr:',data);
					});
					addToML.on('exit', function(code){
						//Handle ratings
						var items = [];
						var ratings = [];
						for (var i=1; i<=5; i++){
							var curr = req.body['item' + i];
							if (!curr){
								break;
							}
							var item = curr.substring(0,curr.length - 1);
							var rating = curr.substring(curr.length - 1, curr.length);
							items.push(item);
							ratings.push(rating);
						}
						review(res, email, items, ratings);
					});		
				});
			});
		} else {
			res.redirect('/logpurchase');
		}
	});
});

//Logs a purchase, used by mydininglog.js
app.post('/logpurchase', function(req, res){
	var email = req.user.emails[0].value;
	var item = req.body.item;
	var date = new Date().toDateString();
	var queryString = 'INSERT INTO purchases VALUES ($1, $2, $3, $4)';
	var query = connPurchases.query(queryString, [null,email, item, date]);
	query.on('error', console.error);
	query.on('end', function(){
		res.end();
	});
});

app.get('/allpurchases', function(req, res){
	var email = req.user.emails[0].value;
	var queryString = 'SELECT date,item from purchases WHERE email=$1';
	connPurchases.query(queryString, [email], function(error, results){
		if(error){
			console.error(error);
		}
		res.json(results.rows);
	});
});

app.post('/knapsack', function(req, res){
	console.log(req.body.hall);
	var myQuery = connFood.query('SELECT * from food WHERE location=$1',[req.body.hall]);
	var foodList = '';
	myQuery.on('row', function(row){
		if (row !== undefined){
				foodList += row.item + "," + row.price + ',';
		}
	});
	myQuery.on('end', function(){
		foodList = foodList.substring(0, foodList.length -1);
		
		var ls = spawn('java',["Knapsack",foodList,req.body.maxMoney]);
		var output = "";
		ls.stdout.on('data', function (data) {
		  output += data;
		});

		ls.stderr.on('data', function (data) {
		  console.log('stderr: ' + data);
		});

		ls.on('exit', function (code) {
		  res.end(output);
		});

	});
});

app.post('/login', function(req, res, next) {
	console.log('login!');
  	passport.authenticate('google');
});

app.post('/review', function(req, res){
	var email = req.user.emails[0].value;
	var item = req.body.item;
	var rating = req.body.rating;
	review(res, email, [item], [rating]);
});

//TODO: fix security threat. By just concatenating the calls to RunML. someone could use some form of injection I think. 
//My guess is that you could do something to turn the string into multiple lines, and then literally run anything serverside.
app.post('/guess',function(req,res){
	var username = req.user.emails[0].value;
	var item = req.body.item;
	var rating = req.body.rating;
	var queryString = "SELECT id FROM users WHERE username=$1";
	conn.query(queryString, [username], function(err, results){
		var id = String(results.rows[0].id);
		var ls = spawn('java', ["RunML", "PING", "GUESS",id,item,rating]);
		var output = "";
		ls.stdout.on('data', function (data) {
		  output += data;
		});

		ls.stderr.on('data', function (data) {
		  console.log('stderr: ' + data);
		});

		ls.on('exit', function (code) {
		  res.end(output);
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
  	var username = req.user.emails[0].value;
	var numItems = req.body.numItems;
	var k = 3;
	console.log(username);
	console.log(numItems);
	var queryString = "SELECT id FROM users WHERE username=$1";
	conn.query(queryString, [username], function(err, results){
		var id = String(results.rows[0].id);
		var ls = spawn('java', ["RunML", "PING", "SUGGEST",id, numItems, k]);
		var output = "";
		ls.stdout.on('data', function (data) {
		  output += data;
		});

		ls.stderr.on('data', function (data) {
		  console.log('stderr: ' + data);
		});

		ls.on('exit', function (code) {
		  res.end(output);
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
  if (req.isAuthenticated()) {
	res.render('dininghalls.html', {name : req.user.displayName});
  } else{
  	res.render('dininghalls.html');
  }
});

app.get('/specials', function(req, res) {
  if (req.isAuthenticated()) {
	res.render('specials.html', {name : req.user.displayName});
  } else{
  	res.render('specials.html');
  }
});

app.get('/mydining', function(req, res) {
  if (req.isAuthenticated()) {
	res.render('creditsandpoints.html', {name : req.user.displayName});
  } else{
  	res.render('creditsandpoints.html');
  }
});

app.get('/browseitems', ensureAuthenticated, function(req,res) {
	res.render('browseitems.html', {name : req.user.displayName});
});

app.get('/logpurchase', ensureAuthenticated, function(req,res) {
	res.render('logpurchase.html', {name : req.user.displayName});
});

app.get('/prevtransactions', ensureAuthenticated, function(req,res) {
	res.render('prevtransactions.html', {name : req.user.displayName});
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

	//Midnight - 2AM there is no Quesadillas/Grilled Cheese
	if (time < 23 && time > 3){
		if (day === 1 || day === 3 || day === 7) {
			//Grilled cheese Sunday/Monday/Wednesday
			res.write('Gourmet Grilled Cheese\n');
		} else {
			//Quesadillas every other night
			res.write('Quesadillas\n');
		}
	}

	res.end(getThreeBurners() + '\nCustom Salad\nSpicy With\nBeef Carb\nTurkey Carb\nChicken Carb\nMozerella Sticks\nFries\nOnion Rings');
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
	if (day === 0 || day === 7){
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
	if ((hour >= 0 && hour < 2) || hour >= 11){
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

	//Midnight - 2AM there is no Quesadillas/Grilled Cheese
	if (time < 23 && time > 3){
		if (day === 1 || day === 3 || day === 7) {
			//Grilled cheese Sunday/Monday/Wednesday
			res.write('Gourmet Grilled Cheese, ');
		} else {
			//Quesadillas every other night
			res.write('Quesadillas, ');
		}
	}
	res.end(getThreeBurners());
});

app.get('/specials/aco', function(req, res){
	andrewsSpecials(res);
});

app.get('/itemlistjos', function(req, res){
	var myQuery = connFood.query('SELECT * from food WHERE location="jos" ');
	myQuery.on('row', function(row){
		if (row !== undefined){
			res.write(row.item + "," + row.price + '\n');
		}
	});
	myQuery.on('end', function(){
		res.end();
	});
});

app.get('/itemlistaco', function(req, res){
	var myQuery = connFood.query('SELECT * from food WHERE location="aco"');
	myQuery.on('row', function(row){
		if (row !== undefined){
			res.write(row.item + "," + row.price + '\n');
		}
	});
	myQuery.on('end', function(){
		res.end();
	});
});

app.get('/itemlistblueroom', function(req, res){
	var myQuery = connFood.query('SELECT * from food WHERE location="blueroom"');
	myQuery.on('row', function(row){
		if (row !== undefined){
			res.write(row.item + "," + row.price + '\n');
		}
	});
	myQuery.on('end', function(){
		res.end();
	});
});

app.get('/itemlistivy', function(req, res){
	var myQuery = connFood.query('SELECT * from food WHERE location="ivyroom"');
	myQuery.on('row', function(row){
		if (row !== undefined){
			res.write(row.item + "," + row.price + '\n');
		}
	});
	myQuery.on('end', function(){
		res.end();
	});
});

app.get('/itemlist', function(req, res){
	var ratingsQuery = connRatings.query('SELECT * from ratings', function(err, result){
		console.log(result);
		var map = {};
		for(var i=0; i<result.rows.length; i++){
			map[result.rows[i]['item']] = result.rows[i]['rating'];
		}
		console.log(map);
		var foodQuery = connFood.query('SELECT * from food');
		foodQuery.on('row', function(row){
			if (row !== undefined){
				if (map[row.item]){
					res.write(row.item + "," + row.price + "," + map[row.item] + '\n');
				} else {
					res.write(row.item + "," + row.price + '\n');
				}
			}
		});
		foodQuery.on('end', function(){
			res.end();
		});
	});
});

app.get('/', function(req, res){
  if (req.isAuthenticated()) {
	res.render('home.html', {name : req.user.displayName});
  } else{
  	res.render('home.html');
  }
});

app.get('/mod',function(req,res){
	res.render('mod.html');
});
app.get('*', function(req,res){
});

//Visit localhost:8080
var port = process.env.PORT || 8080;
app.listen(port, function(){
	console.log("server running on port",port);
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

function fillFoodDB() {
	var foodList = ['jos','aco', 'ivyroom', 'blueroom'];
	connFood.query('CREATE TABLE food (item TEXT PRIMARY KEY,price INT, location TEXT)');
	for (var locIndex=0; locIndex < foodList.length; locIndex ++){
		var queryString = 'INSERT INTO food VALUES ($1, $2, $3)';
		var curr = foodList[locIndex];
		var data = fs.readFileSync('data/' + foodList[locIndex] + '.csv', 'utf8');
		var lines = data.split('\n');
		var itemList = [];
		for (var i=0; i<lines.length; i++){
			var split = lines[i].split(',');
			if (split.length === 2){
				var item = split[0].trim();
				itemList.push(item);
				var price = split[1].trim();
				price = price.replace('$','');
				price = Math.ceil(100 * parseFloat(price));
				connFood.query(queryString, [item, price,curr]);
			}
		}
		addFoodToClient(itemList);
	}
}

function fillUsersDB() {
	var queryString = 'INSERT INTO users VALUES ($1, $2, $3, $4, $5, $6, $7)';
	conn.query(queryString, [null,'Steven','smcgarty@cs.brown.edu','****','March','1992','Male'], function(err1, res1){
		conn.query(queryString, [null,'Christine','czchapma@cs.brown.edu','****','August','1992','Male'], function(err2, res2){
			conn.query(queryString, [null,'Zach','zolstein@brown.edu','****','March','1992','Male'], function(err3, res3){
				conn.query(queryString, [null,'Raymond','raymond_zeng@brown.edu','****','March','1992','Male'], function(err4, res4){
				});
			});
		});
	});

	var csvString = "1,Steven McGarty,Male,,1992,3,Chobani,4,Sandwich,5";
	exec('java RunML ADD "' + csvString + '"', function (error, stdout, stderr) {
		csvString = "2,Christine,Female,,1992,8,Sandwich,1,Chobani,3";
		exec('java RunML ADD "' + csvString + '"', function (error, stdout, stderr) {
			csvString = "3,Zach,Male,,1992,3,Falafel,5,Tuna,3";
			exec('java RunML ADD "' + csvString + '"', function (error, stdout, stderr) {
				csvString = "4,Raymond,Male,,1992,3,Chobani,5,Tuna,1";
				exec('java RunML ADD "' + csvString + '"', function (error, stdout, stderr) {
				});
			});
		});
	});
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

function addFoodToClient(foodList){
	if(foodList.length === 0){
		return;
	}

	var food = foodList.pop();
	var ls = spawn('java',["RunML","FOODLIST",food]);
	ls.stderr.on('data', function (data) {
	  console.log('stderr: ' + data);
	});
	ls.on('exit', function(code){
		addFoodToClient(foodList);
	});
}

function review (res, username, items, ratings){
	if (items.length === 0 || ratings.length === 0){
		res.end();
	} else {
		var queryString = "SELECT id FROM users WHERE username=$1";
		conn.query(queryString, [username], function(err, results){
			if (results.rows.length > 0) {
				var item = items.pop();
				var rating = ratings.pop();
				var id = String(results.rows[0].id);
				var ls = spawn('java', ['RunML', "MODIFY", "REVIEW",id,item,rating]);
				var output = "";
				ls.stdout.on('data', function (data) {
			  		output += data;
				});	

				ls.stderr.on('data', function (data) {
			  		console.log('stderr: ' + data);
				});	

				ls.on('exit', function (code) {
					//Add Rating to ratings db
					queryString = 'INSERT INTO ratings VALUES ($1, $2, $3, $4)';
					connRatings.query(queryString, [null, username, item, rating], function(dbErr, dbRes){
						if(dbErr){
							console.log(dbErr);
						}
						review(res, username, items, ratings);
					});
				});	

			} else {
				console.log('username',username,'not in db');
				res.end();
			}
		});
	}
}

function getThreeBurners(){
	var day = moment().day();
	var threeBurners = 'Crepes';
	if (day === 0 || day === 7){
		threeBurners = 'Early Early Breakfast'
	}
	return threeBurners;
}
