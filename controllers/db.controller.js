const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: 3308,
  database: 'easy_mall',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Enable async/await support
const db = pool.promise();

module.exports = db;
