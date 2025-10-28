import mysql from 'mysql2/promise';

// No .env required: defaults match XAMPP (root with empty password)
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'samaajseva',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;


