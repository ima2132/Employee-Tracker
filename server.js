inquirer = require('inquirer');
const consoleTable = require('console.table');

const pool = require('./config/connection');


// Increase the maximum number of event listeners for the 'warning' event
require('events').EventEmitter.defaultMaxListeners = 20; // Adjust the number as per your needs

// Connect to the MySQL server using the connection pool
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log(`   
      ╔═══╗-----╔╗--------------╔═╗╔═╗----------------
      ║╔══╝-----║║--------------║║╚╝║║----------------
      ║╚══╦╗╔╦══╣║╔══╦╗─╔╦══╦══╗║╔╗╔╗╠══╦═╗╔══╦══╦══╦═╗
      ║╔══╣╚╝║╔╗║║║╔╗║║─║║║═╣║═╣║║║║║║╔╗║╔╗╣╔╗║╔╗║║═╣╔╝
      ║╚══╣║║║╚╝║╚╣╚╝║╚═╝║║═╣║═╣║║║║║║╔╗║║║║╔╗║╚╝║║═╣║
      ╚═══╩╩╩╣╔═╩═╩══╩═╗╔╩══╩══╝╚╝╚╝╚╩╝╚╩╝╚╩╝╚╩═╗╠══╩╝
      -------║║------╔═╝║---------------------╔═╝║----
      -------╚╝------╚══╝---------------------╚══╝----`
  );
});

// Function to view all departments
function viewAllDepartments() {
  const query = 'SELECT id, name AS department FROM department';
  pool.query(query, (err, res) => {
    if (err) throw err;
    console.log('\n\n');
    console.table(res);
    start();
  });
}

// Function to view all roles
function viewAllRoles() {
  const query = `
    SELECT \
      r.id, 
      r.title, 
      r.salary, 
      d.name AS department
    FROM role r
    JOIN department d ON r.department_id = d.id
  `;
  pool.query(query, (err, res) => {
    if (err) throw err;
    console.log('\n\n');
    console.table(res);
    start();
  });
}

// Function to view all employees
function viewAllEmployees() {
  const query = `
    SELECT 
      e.id, 
      e.first_name, 
      e.last_name, 
      r.title, 
      d.name AS department, 
      r.salary, 
      CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    JOIN role r ON e.role_id = r.id
    JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id
  `;
  pool.query(query, (err, res) => {
    if (err) throw err;
    console.log('\n\n');
    console.table(res);
    start();
  });
}

// Function to add a department
function addDepartment() {
  inquirer
    .prompt([
      {
        name: 'name',
        type: 'input',
        message: 'What is the name of the department? ',
      },
    ])
    .then((answer) => {
      const query = 'INSERT INTO department (name) VALUES (?)';
      pool.query(query, [answer.name], (err, res) => {
        if (err) throw err;
        console.log('Department added to the database successfully!');
        start();
      });
    })
    .catch((error) => {
      console.error('Error during prompt:', error);
      start();
    });
}

// Function to add a role
function addRole() {
  const departmentQuery = 'SELECT id, name FROM department';

  pool.query(departmentQuery, (err, departmentResults) => {
    if (err) throw err;

    const departmentChoices = departmentResults.map((department) => ({
      name: department.name,
      value: department.id,
    }));

    inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: '? What is the name of the role? ',
        },
        {
          type: 'input',
          name: 'salary',
          message: '? What is the salary of the role? ',
        },
        {
          type: 'list',
          name: 'department_id',
          message: '? Which department does the role belong to? ',
          choices: departmentChoices,
        },
      ])
      .then((answers) => {
        const query =
          'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
        pool.query(
          query,
          [answers.title, answers.salary, answers.department_id],
          (err, res) => {
            if (err) throw err;
            console.log('Role added to the database successfully!');
            start();
          }
        );
      })
      .catch((error) => {
        console.error('Error during prompt:', error);
        start();
      });
  });
}

// Function to add an employee
function addEmployee() {
  const roleQuery = 'SELECT id, title FROM role';
  const employeeQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS employee_name FROM employee';

  pool.query(roleQuery, (err, roleResults) => {
    if (err) throw err;

    const roleChoices = roleResults.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    pool.query(employeeQuery, (err, employeeResults) => {
      if (err) throw err;

      const employeeChoices = employeeResults.map((employee) => ({
        name: employee.employee_name,
        value: employee.id,
      }));

      employeeChoices.push({ name: 'No manager', value: null });

      inquirer
        .prompt([
          {
            type: 'input',
            name: 'first_name',
            message: "? What is the employee's first name? ",
          },
          {
            type: 'input',
            name: 'last_name',
            message: "? What is the employee's last name? ",
          },
          {
            type: 'list',
            name: 'role_id',
            message: '? What is the role for the employee? ',
            choices: roleChoices,
          },
          {
            type: 'list',
            name: 'manager_id',
            message: '? Who is the manager for the employee? ',
            choices: employeeChoices,
          },
        ])
        .then((answers) => {
          const query =
            'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
          pool.query(
            query,
            [
              answers.first_name,
              answers.last_name,
              answers.role_id,
              answers.manager_id,
            ],
            (err, res) => {
              if (err) throw err;
              console.log('Employee added successfully!');
              start();
            }
          );
        })
        .catch((error) => {
          console.error('Error during prompt:', error);
          start();
        });
    });
  });
}

// Function to update an employee role
function updateEmployeeRole() {
  const employeeQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS employee_name FROM employee';
  const roleQuery = 'SELECT id, title FROM role';

  pool.query(employeeQuery, (err, employeeResults) => {
    if (err) throw err;

    const employeeChoices = employeeResults.map((employee) => ({
      name: employee.employee_name,
      value: employee.id,
    }));

    pool.query(roleQuery, (err, roleResults) => {
      if (err) throw err;

      const roleChoices = roleResults.map((role) => ({
        name: role.title,
        value: role.id,
      }));

      inquirer
        .prompt([
          {
            type: 'list',
            name: 'employee_id',
            message: '? Select the employee to update:',
            choices: employeeChoices,
          },
          {
            type: 'list',
            name: 'new_role_id',
            message: 'Select the new role for the employee:',
            choices: roleChoices,
          },
        ])
        .then((answers) => {
          const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
          pool.query(
            query,
            [answers.new_role_id, answers.employee_id],
            (err, res) => {
              if (err) throw err;
              console.log('Employee role updated successfully!');
              start();
            }
          );
        })
        .catch((error) => {
          console.error('Error during prompt:', error);
          start();
        });
    });
  });
}

// Main function to start the application
function start() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: '? What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Quit'
        ],
      },
    ])
    .then((answer) => {
      switch (answer.action) {

        case 'View all departments':
          viewAllDepartments();
          break;

        case 'View all roles':
          viewAllRoles();
          break;

        case 'View all employees':
          viewAllEmployees();
          break;

        case 'Add a department':
          addDepartment();
          break;

        case 'Add a role':
          addRole();
          break;

        case 'Add an employee':
          addEmployee();
          break;

        case 'Update an employee role':
          updateEmployeeRole();
          break;

        case 'Quit':
          console.log('Goodbye!');
          pool.end();
          process.exit();
      }
    })
    .catch((error) => {
      console.error('Error during prompt:', error);
      start();
    });
}

// Initialize the application
function init() {
  try {
    start();
  } catch (error) {
    console.error('Error starting application:', error);
    pool.end();
  }
}

// Run the application
init();