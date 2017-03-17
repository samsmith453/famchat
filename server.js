var express = require("express");
var socket = require("socket.io");
var app = express();
var server = app.listen(process.env.PORT);
var io = socket(server);
var fs = require("fs");
var mongo = require("mongodb").MongoClient;
var url = "mongodb://sam453:chatpass@ds133450.mlab.com:33450/smithchathistory";

var auth = require("http-auth");
var digest = auth.digest({
   realm: "Chat",
   file: __dirname + "/htdigest",
   type: "digest",
   msg401: "Oops 401"
});

app.use(auth.connect(digest));

app.set("views", "./views");
app.set("view engine", "pug");

app.get("/", function(req, res){
   mongo.connect(url, function(err, db){
      if(err) throw err;

      var collection = db.collection("history");
      collection.find({
         "test": "yes"
      },{
         "_id": 0,
         "test": 0,
         "chat": 1
      }).toArray(function(err, docs){
         console.log(docs);
         if(err) throw err;
         console.log("mongo");
         var arr = docs[0].chat;
         var record = [];
         for(var i=1; i<arr.length; i++){
            if(arr[i].sender==arr[i-1].sender) record.push(i);
         }
         for(var h=0; h<record.length; h++){
            var n = record[h];
            arr[n].sender="";
         }

         app.use(express.static("public"));
         res.render('index', { user: req.user, arr: arr });
      })
   })
});

io.sockets.on("connection", newConnection);

function newConnection(socket){
   socket.on("inbound", inboundMessage);
   function inboundMessage(data){
      io.sockets.emit("outbound", data);
      files(data);
   }
}

function files(msg){

   mongo.connect(url, function(err, db){
      if(err) throw err;
      var collection = db.collection("history");
      collection.find({
         "test": "yes"
      },{
         "_id": 0,
         "test": 0,
         "chat": 1
      }).toArray(function(err, docs){
         var arr = docs[0].chat;
         var arrlength = arr.length;
         arr.push(msg);
         if(arrlength>100) arr.shift();

         collection.update({
            "test": "yes"
         },{
            "chat": arr
         }, function(err, result){
            if(err) throw err;
         });
      });
   });
};
