const { Pool } = require('pg');
const inquirer = require("inquirer");
const { start } = require('repl');
const pool = new Pool(
    {
        // TODO: Enter PostgreSQL username
        user: 'postgres',
        // TODO: Enter PostgreSQL password
        password: 'noah',
        // The host where your PostgreSQL server is running (usually 'localhost')
        host: 'localhost',
        // The name of the PostgreSQL database you want to connect to
        database: 'employeetracker_db'
    },
    // Callback function that logs a message once the pool is created
    console.log(`Connected to the books_db database.`)
)

// Establish a connection to the PostgreSQL database
pool.connect();



function startMenu() {
    inquirer.prompt([
        {
            type: "list",
            name: "choices",
            message: "What would you like to do?",
            choices: ["New employee", "New Role", "New department", "Display all employees", "Display all roles in the department", "Update employee role", "Exit application"]
        }
    ]).then(({ choices }) => {
        switch (choices) {
            case "New employee":
                new_employee()
                break;
            case "New Role":
                new_role()
                break;
            case "New department":
                new_department()
                break;
            case "Display all employees":
                display_employees()
                break;
            case "Display all roles in the department":
                display_roles()
                break;
            case "Update employee role":
                update_role()
                break;
            default:
                pool.end()
                process.exit(0)
        }
    })
}


function display_employees(){

pool.query("SELECT e.id,e.first_name,e.last_name, r.title, r.salary, d.name from employee e left join role r on e.role_id = r.id left join department d on r.department = d.id;")
.then(({rows}) => {
    console.table(rows)
    startMenu()
})
}
function new_employee() {
    inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "Enter the first name of the employee:"
        },
        {
            type: "input",
            name: "last_name",
            message: "Enter the last name of the employee:"
        },
        {
            type: "input",
            name: "role_id",
            message: "Enter the role ID of the employee:"
        }
    ]).then(({ first_name, last_name, role_id }) => {
        pool.query("INSERT INTO employee (first_name, last_name, role_id) VALUES ($1, $2, $3)", [first_name, last_name, role_id])
            .then(() => {
                console.log("Employee added!");
                startMenu();
            })
            .catch(err => {
                console.error(err);
                startMenu();
            });
    });
}

function new_role() {
    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "Enter the title of the new role:"
        },
        {
            type: "input",
            name: "salary",
            message: "Enter the salary for this role:"
        },
        {
            type: "input",
            name: "department_id",
            message: "Enter the department ID for this role:"
        }
    ]).then(({ title, salary, department_id }) => {
        pool.query("INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)", [title, salary, department_id])
            .then(() => {
                console.log("Role added!");
                startMenu();
            })
            .catch(err => {
                console.error(err);
                startMenu();
            });
    });
}

function new_department() {
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Enter the name of the new department:"
        }
    ]).then(({ name }) => {
        pool.query("INSERT INTO department (name) VALUES ($1)", [name])
            .then(() => {
                console.log("Department added!");
                startMenu();
            })
            .catch(err => {
                console.error(err);
                startMenu();
            });
    });
}

function display_roles() {
    pool.query("SELECT r.id, r.title, d.name AS department FROM role r LEFT JOIN department d ON r.department_id = d.id;")
        .then(({ rows }) => {
            console.table(rows);
            startMenu();
        })
        .catch(err => {
            console.error(err);
            startMenu();
        });
}

function update_role() {
    pool.query("SELECT id, first_name, last_name FROM employee;")
        .then(({ rows }) => {
            const employees = rows.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }));
            return inquirer.prompt([
                {
                    type: "list",
                    name: "employee_id",
                    message: "Select the employee whose role you want to update:",
                    choices: employees
                },
                {
                    type: "input",
                    name: "new_role_id",
                    message: "Enter the new role ID:"
                }
            ]);
        })
        .then(({ employee_id, new_role_id }) => {
            pool.query("UPDATE employee SET role_id = $1 WHERE id = $2", [new_role_id, employee_id])
                .then(() => {
                    console.log("Employee role updated!");
                    startMenu();
                })
                .catch(err => {
                    console.error(err);
                    startMenu();
                });
        })
        .catch(err => {
            console.error(err);
            startMenu();
        });
}

startMenu();