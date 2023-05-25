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

// function to view all roles
async function viewAllRoles() {
    const roles = await query(`
      SELECT role.*, department.name AS department_name
      FROM role
      INNER JOIN department ON role.department_id = department.id
    `);
    console.table(roles);
  }
  
// function to view all employees
  async function viewAllEmployees() {
    const employees = await query(`
      SELECT employee.*, role.title AS role_title, department.name AS department_name
      FROM employee
      INNER JOIN role ON employee.role_id = role.id
      INNER JOIN department ON role.department_id = department.id
    `);
    console.table(employees);
  }
  
// function to add a department
  async function addDepartment() {
    const department = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:'
      }
    ]);
    
    await query('INSERT INTO department (name) VALUES (?)', [department.name]);
    console.log('Department added successfully!');
  }
  
// function to add a role
  async function addRole() {
    const role = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the role:'
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the salary for the role:'
      },
      {
        type: 'input',
        name: 'department_id',
        message: 'Enter the department ID for the role:'
      }
    ]);
    
    await query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [role.title, role.salary, role.department_id]);
    console.log('Role added successfully!');
  }
  
// function to add an employee
  async function addEmployee() {
    const employee = await inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: "Enter the employee's first name:"
      },
      {
        type: 'input',
        name: 'last_name',
        message: "Enter the employee's last name:"
      },
      {
        type: 'input',
        name: 'role_id',
        message: "Enter the role ID for the employee:"
      },
      {
        type: 'input',
        name: 'manager_id',
        message: "Enter the manager ID for the employee (optional):"
      }
    ]);
    
    await query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [employee.first_name, employee.last_name, employee.role_id, employee.manager_id]);
    console.log('Employee added successfully!');
  }