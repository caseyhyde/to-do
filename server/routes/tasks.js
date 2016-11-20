var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/to-do';

router.get('/', function(req, res) { //route for getting tasks from database
  console.log("Get request received from client");
  pg.connect(connectionString, function(err, client, done) {

    if(err) { //if error in connection:
      console.log('Could not connect to database', err);
      res.sendStatus(500); //send 500 status back to client.js
    }

    client.query('SELECT * FROM current_tasks', function(err, result) {
      done(); //end query

      if(err) { //if error in query:
        console.log('Query error: ', err); //log out the error
        res.sendStatus(500); //send 500 status to client.js
      }

      res.send(result.rows); //send rows of tasks table to client.js

    });
  });
});

router.delete('/:taskId', function(req, res) {
  var taskId = req.params.taskId;
  console.log('Delete Route Hit!');

  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log("Error deleting from database");
      res.sendStatus(500);
    }

    client.query('DELETE FROM current_tasks WHERE id = $1', [taskId], function(err, result) {
      done();

      if(err) {
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });//close query function
  }); //close connect
}); //end route

router.put('/:taskId', function(req, res) {
  var taskId = req.params.taskId;
  var task = req.body;
  console.log("Update route hit!");

  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log("Error updating database");
      res.sendStatus(500);
    }

    client.query('UPDATE current_tasks SET task_name=$1, task_details=$2' +
    'WHERE id=$3', [task.task_name, task.task_details, taskId], function(err, result) {
      done()
      if(err) {
        console.log("Unable to update database");
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });//close query
  });//close connect
});//end route

router.post('/', function(req, res) {
  var newTask = req.body;
  console.log("Add task route hit!");

  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log("Unable to add to database");
      res.sendStatus(500);
    }

    client.query('INSERT INTO current_tasks (task_name, task_details)' +
    'VALUES ($1, $2)', [newTask.newTaskName, newTask.newTaskDetails],
    function(err, result) {
      if(err) {
        console.log("Query error: ", err);
      } else {
        res.sendStatus(201);
      }
    });//end query

  });//close connect
});//end route



module.exports = router;
