var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/to-do';

router.get('/currenttasks', function(req, res) {
  console.log("Get request received from client for current tasks");
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log("Could not connect to database to get current tasks");
      res.sendStatus(500);
    }
    client.query('SELECT * FROM tasks WHERE completed=FALSE', function(err, result) {
      done();
      if(err) {
        console.log("Query error getting current tasks");
        res.sendStatus(500);
      }
      res.send(result.rows);
    });//close query
  });//close connect
});//end route
router.get('/completedtasks', function(req, res) {
  console.log("Get request received from client for completed tasks");
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log("Could not connect to database to get completed tasks");
      res.sendStatus(500);
    }
    client.query('SELECT * FROM tasks WHERE completed=TRUE', function(err, result) {
      done();
      if(err) {
        console.log("Query error getting completed tasks");
        res.sendStatus(500);
      }
      res.send(result.rows);
    });//close query
  });//close connect
});//end route
router.post('/', function(req, res) {
  var newTask = req.body;
  console.log("Post request received from client for new task");
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log("Could not connect to database to post new task");
      res.sendStatus(500);
    }
    client.query('INSERT INTO tasks (task_name, task_details) VALUES ($1, $2)',
    [newTask.task_name, newTask.task_details], function(err, result) {
      if(err) {
        console.log("Query error posting new task: ", err);
        res.sendStatus(500);
      } else {
        res.sendStatus(201);
      }
    });//end query
  });//end connect
});//end route
router.delete('/:taskId', function(req, res) {
  var taskId = req.params.taskId;
  console.log("Delete route hit");
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log("Error deleting from database");
      res.sendStatus(500);
    }
    client.query('DELETE FROM tasks WHERE  id=$1', [taskId], function(err, result) {
      done();
      if(err) {
        console.log("Query error deleting current task");
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });//end query
  });//end connect
});//end route
router.put('/:taskid', function(req, res) {
  var taskId = req.params.taskid;
  var task = req.body;
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log("Error updating task in database");
      res.sendStatus(500);
    }
    client.query('UPDATE tasks SET task_name=$1, task_details=$2' +
    'WHERE id=$3', [task.task_name, task.task_details, taskId], function(err, result) {
      done();
      if(err) {
        console.log("Query error updating task in database");
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });//close query
  });//close connect
});//Close route
router.put('/completed/:taskid', function(req, res) {
  var taskId = req.params.taskid;
  var status = req.body;
  pg.connect(connectionString, function(err, client, done) {
    if(err) {
      console.log("Error updating task in database");
      res.sendStatus(500);
    }
    client.query('UPDATE tasks SET completed=$1' +
    'WHERE id=$2', [status.completed, taskId], function(err, result) {
      done();
      if(err) {
        console.log("Query error updating task in database");
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });//close query
  });//close connect
});//Close route
module.exports = router;
