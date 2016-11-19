var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = 'postgres://localhost:5432/sigma';

router.get('/', function(req, res) {
  console.log("Get request received from client");
  res.send({Hello: "hello"});
});

module.exports = router;
