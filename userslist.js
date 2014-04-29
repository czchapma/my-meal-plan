//prints list of users
var anyDB = require('any-db');
conn = anyDB.createConnection('sqlite3://mymealplandata.db');
var query = conn.query('SELECT username from users');
query.on('error', function(err) {
	console.log(err);
});
query.on('row', function(row) {
	console.log(row.username);
});
