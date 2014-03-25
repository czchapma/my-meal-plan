var express = require('express');
var engines = require('consolidate');
var app = express();
app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/templates'); // tell Express where to find templates
app.use(express.static(__dirname)); //allows css to work with rendered html

app.use(express.bodyParser());
 
//Navigates to Brown's get portal to get credit/points info
app.get('/login', function(req, res){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods','GET,POST,OPTIONS');
	res.header('Access-Control-Allow-headers','Content-Type,Authorization,Content-Length,X-Request-With');
	res.redirect('http://www.brown.edu/getportal');
});
app.get('/dininghalls', function(req, res) {
	res.redirect('http://www.brown.edu/Student_Services/Food_Services/eateries/refectory.php');
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
