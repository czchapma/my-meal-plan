var express = require('express');
var engines = require('consolidate');
var app = express();
app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/templates'); // tell Express where to find templates
app.use(express.static(__dirname)); //allows css to work with rendered html

app.use(express.bodyParser());
 
app.post('*', function(req, res){
	conn.query('SELECT * FROM zipcodes WHERE zipcode="' + req.body.zipcode +'"', function(error, result) {
		if(error !== null){
			res.end(error);
		} else if(result.rows.length === 0){
			res.end("<html><body>Invalid Zipcode!" + mainPage + "</body></html>");
		} else {
			res.end("<html><body>Zipcode: " + req.body.zipcode + " is located in " + result.rows[0].city + ", " + result.rows[0].state + "<br>Again?" + mainPage + "</body></html>")
		}
	});


});

//Navigates to Brown's get portal to get credit/points info
app.get('/login', function(req, res){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods','GET,POST,OPTIONS');
	res.header('Access-Control-Allow-headers','Content-Type,Authorization,Content-Length,X-Request-With');
	res.redirect('http://www.brown.edu/getportal');
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
