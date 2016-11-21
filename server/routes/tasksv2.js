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

module.exports = router;
