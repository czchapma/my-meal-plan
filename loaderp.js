

//Create DBs
var anyDB = require('any-db');

connFood = anyDB.createConnection('sqlite3://food.db');
			conn = anyDB.createConnection('sqlite3://users.db');
			connBugs = anyDB.createConnection('sqlite3://bugs.db');
			connPurchases = anyDB.createConnection('sqlite3://purchases.db');
			connRatings = anyDB.createConnection('sqlite3://ratings.db');		
			connMissing = anyDB.createConnection('sqlite3://missing.db');
			connFlavors = anyDB.createConnection('sqlite3://flavors.db');
			
			conn.query('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,username TEXT, month TEXT,day TEXT, gender TEXT)');
			connBugs.query('CREATE TABLE bugs(user TEXT, time INTEGER, message TEXT)');
			connPurchases.query('CREATE TABLE purchases (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, item TEXT, date TEXT)');
			connRatings.query('CREATE TABLE ratings (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, item TEXT, rating INTEGER)');
			connFlavors.query('CREATE TABLE flavors (user TEXT, item TEXT, flavor TEXT)');
			connMissing.query('CREATE TABLE missing (food TEXT, price INTEGER, location TEXT)');