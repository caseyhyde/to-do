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

    client.query('SELECT * FROM tasks', function(err, result) {
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

    client. query('DELETE FROM tasks WHERE id = $1', [taskId], function(err, result) {
      done();

      if(err) {
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });//close query function

  }); //close connect
}); //end route

module.exports = router;
