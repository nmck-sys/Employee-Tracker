\c employeetracker_db;



SELECT * FROM EMPLOYEE;


SELECT e.id,e.first_name,e.last_name, r.title, r.salary, d.name from employee e left join role r on e.role_id = r.id left join department d on r.department = d.id;
