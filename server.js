const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');

// increase the maximum number of event listeners for the 'warning' event
require('events').EventEmitter.defaultMaxListeners = 20; // adjust the number as per your needs

// create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password_123',
  database: 'employee_db'
});

// connects to the MySQL server
connection.connect((err) => {
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


// function to view all roles
async function viewAllRoles() {
    const query = 'SELECT r.id, r.title, r.salary, d.name AS department FROM role r JOIN department d ON r.department_id = d.id';
    connection.query(query, (err, res) => {
      if (err) throw err;
      console.log('\n\n');
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
    console.log('\n\n');
    console.table(res);
    start();
  });
}

// function to add a department
async function addDepartment() {
  return new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          name: 'name',
          type: 'input',
          message: 'Enter the name of the department:',
        },
      ])
      .then(async (answers) => {
        // Insert the department into the database
        const query = 'INSERT INTO department (name) VALUES (?)';
        connection.query(query, [answers.name], (err, res) => {
          if (err) {
            console.error('Error adding department: ', err);
            reject(err);
          } else {
            console.log('Department added successfully!');
            resolve(res);
          }
        });
      })
      .catch((error) => {
        console.error('Error during prompt: ', error);
        reject(error);
      });
  });
}



// function to add a role
async function addRole() {
  return new Promise((resolve, reject) => {
    // Fetch all departments from the database
    const departmentQuery = 'SELECT id, name FROM department';

    connection.query(departmentQuery, (err, departmentResults) => {
      if (err) {
        console.error('Error fetching departments: ', err);
        reject(err);
        return;
      }

      // Map the department results to an array of { name, value } objects for inquirer choices
      const departmentChoices = departmentResults.map((department) => ({
        name: department.name,
        value: department.id,
      }));

      inquirer
        .prompt([
          {
            type: 'input',
            name: 'title',
            message: 'Enter the title of the role:',
          },
          {
            type: 'input',
            name: 'salary',
            message: 'Enter the salary for the role:',
          },
          {
            type: 'list',
            name: 'department_id',
            message: 'Select the department for the role:',
            choices: departmentChoices,
          },
        ])
        .then(async (role) => {
          // Insert the role into the database
          const query =
            'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
          connection.query(
            query,
            [role.title, role.salary, role.department_id],
            (err, res) => {
              if (err) {
                console.error('Error adding role: ', err);
                reject(err);
              } else {
                console.log('Role added successfully!');
                resolve(res);
              }
            }
          );
        })
        .catch((error) => {
          console.error('Error during prompt: ', error);
          reject(error);
        });
    });
  });
}


// function to add an employee
async function addEmployee() {
  return new Promise((resolve, reject) => {
    // Fetch all departments and roles from the database
    const departmentQuery = 'SELECT id, name FROM department';
    const roleQuery = 'SELECT id, title FROM role';
    const employeeQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS employee_name FROM employee';

    connection.query(departmentQuery, (err, departmentResults) => {
      if (err) {
        console.error('Error fetching departments: ', err);
        reject(err);
        return;
      }

      connection.query(roleQuery, (err, roleResults) => {
        if (err) {
          console.error('Error fetching roles: ', err);
          reject(err);
          return;
        }

        connection.query(employeeQuery, (err, employeeResults) => {
          if (err) {
            console.error('Error fetching managers: ', err);
            reject(err);
            return;
          }

          // Map the department results to an array of { name, value } objects for inquirer choices
          const departmentChoices = departmentResults.map((department) => ({
            name: department.name,
            value: department.id,
          }));

          // Map the role results to an array of { name, value } objects for inquirer choices
          const roleChoices = roleResults.map((role) => ({
            name: role.title,
            value: role.id,
          }));

          // Map the employee results to an array of {name, value} objects
          const employeeChoices = employeeResults.map((employee) => ({
            name: employee.employee_name,
            value: employee.id,
          }));

          // Add an additional choice for No manager
          employeeChoices.push({name: "No manager", value: null});

          // Prompt the user to enter employee details and select department and role
          inquirer
            .prompt([
              {
                type: 'input',
                name: 'first_name',
                message: "Enter the employee's first name:",
              },
              {
                type: 'input',
                name: 'last_name',
                message: "Enter the employee's last name:",
              },
              {
                type: 'list',
                name: 'department_id',
                message: 'Select the department for the employee:',
                choices: departmentChoices,
              },
              {
                type: 'list',
                name: 'role_id',
                message: 'Select the role for the employee:',
                choices: roleChoices,
              },
              {
                type: 'list',
                name: 'manager_id',
                message: "Select the manager for the employee:",
                choices: employeeChoices
              },
            ])
            .then(async (employee) => {
              const query =
                'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
              connection.query(
                query,
                [
                  employee.first_name,
                  employee.last_name,
                  employee.role_id,
                  employee.manager_id,
                ],
                (err, res) => {
                  if (err) {
                    console.error('Error adding employee:', err);
                    reject(err);
                  } else {
                    console.log('Employee added successfully!');
                    resolve(res);
                  }
                }
              );
            })
            .catch((error) => {
              console.error('Error during prompt: ', error);
              reject(error);
            });
        });
      });
    });
  });
}

// function to update an employee
async function updateEmployeeRole() {

  return new Promise((resolve, reject) => {
    // Fetch all employees and roles from the database
    const employeeQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS employee_name FROM employee';
    const roleQuery = 'SELECT id, title FROM role';
    
    connection.query(employeeQuery, (err, employeeResults) => {
      if (err) {
        console.error('Error fetching employees: ', err);
        reject(err);
        return;
      }

      connection.query(roleQuery, (err, roleResults) => {
        if (err) {
          console.error('Error fetching roles: ', err);
          reject(err);
          return;
        }

        // maps the employee results to an array of { name, value } objects for inquirer choices
        const employeeChoices = employeeResults.map((employee) => ({
          name: employee.employee_name,
          value: employee.id,
        }));

        // maps the role results to an array of { name, value } objects for inquirer choices
        const roleChoices = roleResults.map((role) => ({
          name: role.title,
          value: role.id,
        }));

        // prompts the user to select an employee and role
        inquirer
          .prompt([
            {
              type: 'list',
              name: 'employee_id',
              message: 'Select the employee to update:',
              choices: employeeChoices,
            },
            {
              type: 'list',
              name: 'new_role_id',
              message: 'Select the new role for the employee:',
              choices: roleChoices,
            },
          ])
          .then(async (answers) => {
            const query =
              'UPDATE employee SET role_id = ? WHERE id = ?';
            connection.query(
              query,
              [answers.new_role_id, answers.employee_id],
              (err, res) => {
                if (err) {
                  console.error('Error updating employee role: ', err);
                  reject(err);
                } else {
                  console.log('Employee role updated successfully!');
                  resolve(res);
                }
              }
            );
          })
          .catch((error) => {
            console.error('Error during prompt: ', error);
            reject(error);
          });
      });
    });
  });
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
      process.exit();
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