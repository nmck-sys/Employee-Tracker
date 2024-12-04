\c employeetracker_db;



SELECT * FROM EMPLOYEE;


SELECT e.id,e.first_name,e.last_name, r.title, r.salary, d.name FROM employee e LEFT JOIN ROLE r ON e.role_id = r.id LEFT JOIN department d ON r.department = d.id;