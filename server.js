const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');

// create a connection to the MySQL database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password_123',
    database: 'employee_db'
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
    const query = 'SELECT * FROM department';
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    });
  }

// function to view all roles
async function viewAllRoles() {
    const query = 'SELECT r.id, r.title, r.salary, d.name AS department FROM role r JOIN department d ON r.department_id = d.id';
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    });
  }
  
// function to view all employees
  async function viewAllEmployees() {
    const query = `
      SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
      FROM employee e
      JOIN role r ON e.role_id = r.id
      JOIN department d ON r.department_id = d.id
      LEFT JOIN employee m ON e.manager_id = m.id;
    `;
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      start();
    });
  }

// function to add a department
async function addDepartment() {
    const answers = await inquirer
      .prompt([
        {
          name: 'name',
          type: 'input',
          message: 'Enter the name of the department:',
        },
      ])

      // Insert the department into the database
      const query = 'INSERT INTO department (name) VALUES (?)';
      connection.query(query, [answers.name], (err, res) => {
        if (err) {
          console.error('Error adding department: ', err);
        } else {
          console.log('Department added successfully!');
        }
      });
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

      // Insert the department into the database
      const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
      connection.query(query, [role.title, role.salary, role.department_id], (err, res) => {
        if (err) {
          console.error('Error adding department: ', err);
        } else {
          console.log('Role added successfully!');
        }
      });
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
    
    const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
    connection.query(query, [employee.first_name, employee.last_name, employee.role_id, employee.manager_id], (err, res) => {
      if (err) {
        console.error('Error adding department: ', err);
      } else {
        console.log('Employee added successfully!');
      }
    });
  }


// function to update an employee
async function updateEmployeeRole() {
  
}


// main function to start the application
async function start() {
    // the user will be prompted with the following options 
    const { action } = await inquirer.prompt({
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Quit'
      ]
    });

 // performs the selected actions
 switch (action) {
    case 'View all departments':
      await viewAllDepartments();
      break;
    case 'View all roles':
      await viewAllRoles();
      break;
    case 'View all employees':
      await viewAllEmployees();
      break;
    case 'Add a department':
      await addDepartment();
      break;
    case 'Add a role':
      await addRole();
      break;
    case 'Add an employee':
      await addEmployee();
      break;
    case 'Update an employee role':
      await updateEmployeeRole();
      break;
    case 'Quit':
      console.log('Goodbye!');
      connection.end();
      return;
  }

// repeats the process
    console.log('');
    await start();
  }

// initializes the application
async function init() {
    try {
      // starts the application
      await start();
    } catch (error) {
      console.error('Error starting application:', error);
      connection.end();
    }
  }
  
// runs the application
  init();