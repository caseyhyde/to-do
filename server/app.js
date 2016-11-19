var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var tasks = require('./routes/')

app.use(bodyParser.urlencoded({ extended: true}));

app.get('/', function (req, res) {
  res.sendFile(path.resolve('./public/views/index.html'));
});

app.use(express.static('./public'));

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function () {
  console.log('Listening on port ', app.get('port'));
});
