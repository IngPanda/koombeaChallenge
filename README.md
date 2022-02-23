# koombeaChallenge

## _The Last Markdown Editor, Ever_


Technical test for koombea

## System Requirements

- Git v2.22
- NodeJs v12 or superior
- Mariadb v10.7

## System Requirements

### Installation step 1 
clone this repository
 ```shell
 git clone https://github.com/IngPanda/koombeaChallenge.git
 ```
 ### Installation step 2
 In the Mariadb SQL command line run these scripts in the following order
  ```sql
  CREATE DATABASE IF NOT EXISTS dbContacts;

USE dbContacts;

CREATE TABLE IF NOT EXISTS users(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(30) NOT NULL,
    password VARCHAR(100) NOT NULL,
    fullname VARCHAR(100)
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_email UNIQUE (email)
);
CREATE TABLE IF NOT EXISTS files(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    path VARCHAR(150) NOT NULL,
    nameFile VARCHAR(50) NOT NULL,
    status VARCHAR (50) NOT NULL DEFAULT 'On hold',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INT(11) NOT NULL,
    CONSTRAINT `fk_users` FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS contacts(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    date_birth VARCHAR(11) NOT NULL,
    phone VARCHAR(16) NOT NULL,
    address VARCHAR(200) NOT NULL,
    number_card VARCHAR(17) NOT NULL,
    franchise_card VARCHAR (50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    file_id INT(11) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_files` FOREIGN KEY (file_id) REFERENCES files (id)
);
CREATE TABLE session(
  sid                     VARCHAR(100) PRIMARY KEY NOT NULL,   
  session                 VARCHAR(2048) DEFAULT '{}',   
  lastSeen                DATETIME DEFAULT NOW() 
);
  ```
 ### Installation step 3
 in a batch console run
  ```shell
 npm install
 ```

 to install dependencies
 
  ### Installation step 4
  Configure database access on the file found in
```sh
 /src/keys.js
 ```
 ```js
module.exports = {
    database: {
        host: 'localhost',
        user: 'root', // mariadb user
        password: 'password', //mariadb password
        database: 'dbContacts',
    }
}
 ```
   ### Installation step 5
   Finally to run the server use the following batch command
 ```sh
    npm start
 ```
## Sample file

The example file can be found in the example folder inside the project

