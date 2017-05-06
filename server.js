var express = require('express');

var app = express();

app.get('/', function(req, res){
  res.end("hello world");
});






var port = 8080;
app.listen(port, function() {
  console.log('server listening on port ' + port);
  console.log('https://freecodecamp-husseinraoouf.c9users.io');
});

