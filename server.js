var express = require("express");
var socket = require("socket.io");
var app = express();
var server = app.listen(process.env.PORT);
var io = socket(server);
var fs = require("fs");

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
   fs.readFile("history.json", function(err, data){
      if(err) throw err;
      var obj = JSON.parse(data);
      var arr = obj.chat;
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

   fs.readFile("history.json", function(err, data){
      if(err) throw err;
      var obj = JSON.parse(data);
      var arr = obj.chat;
      var arrlength = arr.length;
      arr.push(msg);

      if(arrlength>100) arr.shift();

      var newobj = {"chat":arr};
      var newfile = JSON.stringify(newobj, null, 2);
      fs.writeFile("history.json", newfile, function(err){
         if(err) throw err;
      })
   });

}
