var express = require('express');
var path = require('path');
var app = express();
var mongo = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

// app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'views')));

app.get('/', function(req, res){
  res.sendFile('/views/index.html');
});

app.get("/new/:proto//:url.:com", function(req, res) {
  
  mongo.connect("mongodb://" + process.env.IP + ":27017/data1", function(err, db) {
      // db gives access to the database
      if (err) return err;
      var coll = db.collection('coll1');
      var url = req.params.proto+"//"+req.params.url+"."+req.params.com;
      var id = Math.round(Math.random()*9999);
      console.log(id);
      coll.insert({
        url: url,
        _id : id
      }, function(err, data) {
        // handle error
        if (err) return err;
        // other operations
        console.log(data);
        db.close()
        var obj = {
                "original_url":url,
                "short_url":"https://freecodecamp-husseinraoouf.c9users.io/" + data.insertedIds[0]
        };
        // res.writeHead(200, { 'content-type': 'text/plain' });
        res.json(obj);
      });
      
      
  })

  
});

app.get("/new/*",function(req, res) {
  res.json({"error":"Wrong url format, make sure you have a valid protocol and real site."});
});


app.get("/:id", function(req, res) {
  mongo.connect("mongodb://" + process.env.IP + ":27017/data1", function(err, db) {
      // db gives access to the database
      if (err) return err;
      var coll = db.collection('coll1');
      coll.findOne({
        _id : parseInt(req.params.id)
      }, function(err, data){
        if (err) return err;
        
        console.log(req.params.id)
        console.log(data)
        db.close()
        // res.writeHead(200, { 'content-type': 'text/plain' });
        // res.end("asd");
        res.redirect(data.url);
      })
      
  });
  
});




var port = 8080;
app.listen(port, function() {
  console.log('server listening on port ' + port);
  console.log('https://freecodecamp-husseinraoouf.c9users.io');
});

