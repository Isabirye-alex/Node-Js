const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.AIVEN_HOST,
  user: process.env.AIVEN_NAME,
  password: process.env.AIVEN_PASSWORD,
  port:process.env.AIVEN_PORT,
  database: process.env.AIVEN_DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Enable async/await support
const db = pool.promise();

module.exports = db;
