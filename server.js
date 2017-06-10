const express = require('express'),
    exphbs = require('express-handlebars'),
    path = require('path'),
    app = express(),
    mongo = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID;


var mongodbUrl = "mongodb://hussein:123456@ds119772.mlab.com:19772/heroku_sxhx0zb7";
var locurl = 'https://shortener-fcc.herokuapp.com/';


var hbs = exphbs.create({});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.get('/', function(req, res){
    res.render('home', {url: locurl});
});

app.get("/new/:proto//:url.:com", function(req, res) {

  mongo.connect(mongodbUrl, function(err, db) {
      if (err) return err;
      var coll = db.collection('urls');
      var url = req.params.proto+"//"+req.params.url+"."+req.params.com;
      coll.find().sort({_id:-1}).limit(1).toArray(function(er, results) {
          var id = 1;
          if (results.length) {
              id = results[0]._id + 1;
          }
          coll.insert({ _id : id, url: url  }, function(err, data) {
            db.close()
            var obj = {
                    "original_url":url,
                    "short_url":locurl +  + data.insertedIds[0]
            };
            res.json(obj);
          });
      });
  });


});

app.get("/new/*",function(req, res) {
  res.json({"error":"Wrong url format, make sure you have a valid protocol and real site."});
});


app.get("/:id", function(req, res) {
    mongo.connect(mongodbUrl, function(err, db) {
        if (err) return err;
        var coll = db.collection('urls');
        coll.findOne({ _id : parseInt(req.params.id) }, function(err, data){
            db.close()
            res.redirect(data.url);
        })

    });
});




var port = process.argv[2];

app.listen(port, function() {
  console.log('server listening on port ' + port);
});
