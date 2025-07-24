const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'mysql-lexus-xshop.k.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_TcIdKQ4M2YGw2nO2-W1',
  port: 26667,
  database: 'defaultdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Enable async/await support
const db = pool.promise();

module.exports = db;


//host = mysql-lexus-xshop.k.aivencloud.com
//user = avnadmin
//password = AVNS_TcIdKQ4M2YGw2nO2-W1
//port = 26667