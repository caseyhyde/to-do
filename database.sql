CREATE TABLE current_tasks (
  id SERIAL PRIMARY KEY,
  task_name VARCHAR(50),
  task_details VARCHAR(1000)
 );

 CREATE TABLE completed_tasks (
   id SERIAL PRIMARY KEY,
   task_name VARCHAR(50),
   task_details VARCHAR(1000)
 );

 CREATE TABLE future_tasks (
   id SERIAL PRIMARY KEY,
   task_name VARCHAR(50),
   task_details VARCHAR(1000)
 );

 INSERT INTO task (task_name, task_details)
 VALUES('Walk the dog', 'Fluffy needs a 1 mile walk!'),
 ('Eat veggies today', 'This does not include pizza'),
 ('Make love, not war', 'This is important'),
 ('Get better at whistling', 'Also very important'),
 ('Build better igloo', 'Let''s include an entry way this time'),
 ('Destroy igloo', 'Make many sound effects'),
 ('Make a bunch of sample tasks', 'There has to be a faster way to do this'),
 ('Try really hard at something', 'Give up immidiately if it doesn''t work out');
