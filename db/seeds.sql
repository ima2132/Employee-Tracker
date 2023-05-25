-- inserted sample departments
INSERT INTO department (name) VALUES
  ('Sales'),
  ('Engineering'),
  ('Marketing'),
  ('Finance');

-- inserted sample roles
INSERT INTO role (title, salary, department_id) VALUES
  ('Sales Representative', 45000.00, 1), -- 1
  ('Sales Manager', 70000.00, 1), -- 2
  ('Software Engineer', 125000.00, 2), -- 3
  ('Marketing Coordinator', 85000.00, 3), -- 4 
  ('Finance Manager', 98000.00, 4); -- 5

-- inserted sample employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('Eren', 'Jaeger', 2, NULL),
  ('Mikasa', 'Ackerman', 3, NULL),
  ('Armin', 'Arlert', 4, 5),
  ('Hange', 'Zoe', 1, 2),
  ('Levi', 'Ackerman', 5, NULL);