\c employeetracker_db;

INSERT INTO Department (NAME )
VALUES ('SALES'),('MARKETING');

INSERT INTO Role (title, salary, department)
VALUES ('MANAGER OF SALES', 60000, 1), ('ADVERTISER', 70000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('JOHN', 'DOE', 1, NULL), ('BILL', 'GATES', 2, NULL);