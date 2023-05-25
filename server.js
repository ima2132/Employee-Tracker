const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
const consoleTable = require('console.table');

// create a connection to the MySQL database
const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'company'
  });

// function to perform a database query
async function query(sql, values = []) {
    try {
      const [rows] = await connection.execute(sql, values);
      return rows;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }

  // function to view all departments
async function viewAllDepartments() {
    const departments = await query('SELECT * FROM department');
    console.table(departments);
  }