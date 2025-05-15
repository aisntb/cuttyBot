import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host     : 'ondojung.mycafe24.com',
  port     : 3306,
  user     : 'ondojung',
  password : 'hyseo0207*',
  database : 'ondojung',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});