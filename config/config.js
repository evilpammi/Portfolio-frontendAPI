const mysql = require('mysql');

// Get the Host from Environment or use default
const host = process.env.DB_HOST || 'localhost';

// Get the User for DB from Environment or use default
const user = process.env.DB_USER || 'root';

// Get the Password for DB from Environment or use default
const password = process.env.DB_PASS || 'P@ssw0rd1';

// Get the Database from Environment or use default
const database = process.env.DB_DATABASE || 'localtest';

// Create the connection with required details
const con = mysql.createConnection({
  host, user, password, database
});

con.connect(function(err) {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }

  console.log('Connected as id ' + con.threadId);
});

module.exports = con;