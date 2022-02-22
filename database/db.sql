CREATE DATABASE IF NOT EXISTS dbContacts;

USE dbContacts;

CREATE TABLE IF NOT EXISTS users(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(30) NOT NULL,
    password VARCHAR(100) NOT NULL,
    fullname VARCHAR(100)
    created_at timestamp NOT NULL current_timestamp,
    CONSTRAINT unique_email UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS contacts(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    date_birth VARCHAR(11) NOT NULL,
    phone VARCHAR(16) NOT NULL,
    address VARCHAR(200) NOT NULL,
    number_card VARCHAR(17) NOT NULL,
    franchise_card VARCHAR (50) NOT NULL,
    user_id INT(11) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_users` FOREIGN KEY (user_id) REFERENCES users (id)
);
CREATE TABLE session(
  sid                     VARCHAR(100) PRIMARY KEY NOT NULL,   
  session                 VARCHAR(2048) DEFAULT '{}',   
  lastSeen                DATETIME DEFAULT NOW() 
);