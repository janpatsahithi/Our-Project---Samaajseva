CREATE DATABASE IF NOT EXISTS samaajseva CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE samaajseva;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('NGO','Donor') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional seed users (password: 123)
-- INSERT INTO users (name, email, password_hash, role) VALUES
-- ('Demo NGO', 'ngo@seva.org', '$2a$10$0D8sCq9gPpo0gKYKqzA3R.xk7aXyZB6uTX0lS8g6j3aG3pHCE8Yoe', 'NGO'),
-- ('Demo Donor', 'donor@seva.com', '$2a$10$0D8sCq9gPpo0gKYKqzA3R.xk7aXyZB6uTX0lS8g6j3aG3pHCE8Yoe', 'Donor');


