# Employee Tracker
## Table of Contents
- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Demonstration](#demonstration)

## Description 
The main objective of this project is to essentially build a command-line application from scratch to manage a company's employee database, using `Node.js`, `Inquirer`, and `MySQL`. 
Employee Tracker allows employers to easily survey and interact with a record of their employees by executing queries on their `SQL` database. This database comprises tables designated for departments, roles, and employees. Users also have the ability to add, modify, or delete entries for employees, roles, and departments.

The user seed data in this project draws inspiration from the iconic characters in Attack on Titan. 

## Installation
To install the program, you will need to have `VS Code` and `Node.js` installed. First, clone my repo. You will then need to install dependencies in order to use the Employee Tracker. 

To generate the employee tracker, run the following command in your terminal: 

`npm install`

After installing the necessary dependencies, it's required to populate your database with initial data to properly run the application using the SQL schema. This can be achieved by executing the following commands: 

`mysql -u root -p <db/schema.sql`

`mysql -u root -p <db/seeds.sql`

You can then start the application by running the command `node server.js`.

## Usage
To begin the program, execute the command `node server.js` in your terminal. The terminal will display several queries that you can scroll through.  

<img width="695" alt="Screenshot 2023-06-08 at 3 19 48 AM" src="https://github.com/ima2132/Employee-Tracker/assets/117132129/916840d5-6dee-4d15-8b2b-32975ebae996">


## License
Please refer to the LICENSE listed in the repo. 

## Demonstration 
Click on the link below to watch a video demonstration of how to use the application:

[Employee Tracker Demo.webm](https://github.com/ima2132/Employee-Tracker/assets/117132129/c132c87b-37d8-471b-91ba-c3f7ec9124c8)


