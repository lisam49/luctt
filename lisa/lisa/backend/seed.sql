
DROP DATABASE IF EXISTS luct_reporting;
CREATE DATABASE luct_reporting;
USE luct_reporting;

-- Disable foreign key checks to drop tables
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120),
  email VARCHAR(120) UNIQUE,
  password VARCHAR(255),
  role VARCHAR(30)
);

-- Classes table
CREATE TABLE classes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  class_name VARCHAR(120),
  faculty_name VARCHAR(120),
  venue VARCHAR(120),
  scheduled_time VARCHAR(50),
  total_registered INT DEFAULT 0
);

-- Courses table
CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200),
  code VARCHAR(50),
  stream VARCHAR(200)
);

-- Reports table
CREATE TABLE reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  faculty_name VARCHAR(200),
  class_name VARCHAR(200),
  week_of_reporting VARCHAR(50),
  date_of_lecture DATE,
  course_name VARCHAR(200),
  course_code VARCHAR(50),
  lecturer_name VARCHAR(200),
  num_present INT,
  total_registered INT,
  venue VARCHAR(200),
  scheduled_time VARCHAR(50),
  topic_taught TEXT,
  learning_outcomes TEXT,
  recommendations TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ratings table
CREATE TABLE ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  module VARCHAR(50),
  target_id INT,
  rating INT,
  comment TEXT,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert users
INSERT INTO users (name, email, password, role) VALUES
('Lisebo Mokhutsoane','lisebo.mokhutsoane@gmail.com', SHA2('lisebo123', 256),'lecturer'),
('Lerato Molefe','lerato.molefe@gmail.com', SHA2('lerato456', 256),'student'),
('Thabo Nche','thabo.nche@gmail.com', SHA2('thabo789', 256),'student'),
('Palesa Sekhonyana','palesa.sekhonyana@gmail.com', SHA2('palesa321', 256),'student'),
('Mpho Lekhooa','mpho.lekhooa@gmail.com', SHA2('mpho654', 256),'student'),
('Kabelo Moleko','kabelo.moleko@gmail.com', SHA2('kabelo987', 256),'student'),
('Neo Mahase','neo.mahase@gmail.com', SHA2('neo159', 256),'student'),
('Sefako Teboho','sefako.teboho@gmail.com', SHA2('sefako753', 256),'student'),
('Dipuo Makhetha','dipuo.makhetha@gmail.com', SHA2('dipuo456', 256),'lecturer'),
('Lecturer Jane','lecturer.jane@gmail.com', SHA2('jane123', 256),'lecturer'),
('Principal Lecturer','principal.luct@gmail.com', SHA2('principal999', 256),'prl'),
('Program Leader','program.leader@gmail.com', SHA2('program111', 256),'pl'),
('Thato Mohlanka','thato.mohlanka@gmail.com', SHA2('thato888', 256),'lecturer');

-- Insert classes
INSERT INTO classes (class_name, faculty_name, venue, scheduled_time, total_registered) VALUES
('IT101-A','Faculty of ICT','Room 201','08:00 - 10:00',45),
('IT101-B','Faculty of ICT','Room 202','10:00 - 12:00',38),
('BIT201-A','Faculty of ICT','Room 301','13:00 - 15:00',50),
('BBIT301','Faculty of ICT','Room 305','15:00 - 17:00',60),
('CS102-Lerato','Faculty of ICT','Room 210','09:00 - 11:00',40),
('SE201-Palesa','Faculty of ICT','Room 212','11:00 - 13:00',35);

-- Insert courses
INSERT INTO courses (name, code, stream) VALUES
('Introduction to IT','IT101','Diploma in Information Technology'),
('Business Systems','BS102','Diploma in Business Information Technology'),
('Data Structures','IT202','Diploma in Information Technology'),
('Software Engineering Principles','SE301','BSc Degree in Business Information Technology'),
('Computer Systems','CS102','Diploma in Information Technology'),
('Systems Analysis','SA210','Diploma in Business Information Technology');

-- Insert reports
INSERT INTO reports (
  faculty_name, class_name, week_of_reporting, date_of_lecture, course_name, course_code,
  lecturer_name, num_present, total_registered, venue, scheduled_time, topic_taught,
  learning_outcomes, recommendations
) VALUES
('Faculty of ICT','IT101-A','Week 3','2025-09-15','Introduction to IT','IT101','Thato Mohlanka',40,45,'Room 201','08:00 - 10:00','Intro to programming','Understand basics of programming','Give more exercises'),
('Faculty of ICT','IT101-B','Week 4','2025-09-22','Introduction to IT','IT101','Lerato Molefe',35,38,'Room 202','10:00 - 12:00','Control structures','Apply if/else and loops','Provide lab practice'),
('Faculty of ICT','BIT201-A','Week 5','2025-09-29','Data Structures','IT202','Dipuo Makhetha',48,50,'Room 301','13:00 - 15:00','Arrays and Linked Lists','Differentiate array vs linked list','More examples'),
('Faculty of ICT','BBIT301','Week 6','2025-10-01','Software Engineering Principles','SE301','Lerato Molefe',55,60,'Room 305','15:00 - 17:00','SDLC Models','Understand waterfall vs agile','Encourage group projects'),
('Faculty of ICT','CS102-Lerato','Week 1','2025-09-01','Computer Systems','CS102','Thato Mohlanka',38,40,'Room 210','09:00 - 11:00','Hardware basics','Identify PC components','Show live demos'),
('Faculty of ICT','SE201-Palesa','Week 2','2025-09-08','Systems Analysis','SA210','Dipuo Makhetha',30,35,'Room 212','11:00 - 13:00','Requirements gathering','Create BRD documents','Practice interviews');

-- Insert ratings
INSERT INTO ratings (module, target_id, rating, comment, user_id) VALUES
('course', 1, 4, 'Good course', 2),
('class', 1, 5, 'Well organized', 3);
