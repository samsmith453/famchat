var express = require("express");
var socket = require("socket.io");
var app = express();
var server = app.listen(process.env.PORT);
var io = socket(server);

var auth = require("http-auth");
var digest = auth.digest({
   realm: "Chat",
   file: __dirname + "/htdigest",
   type: "digest",
   msg401: "Oops 401"
});

app.use(auth.connect(digest));

app.get("/", function(req, res){
   app.use(express.static("public"));
   res.sendFile(__dirname + "/public/index.html");
});

io.sockets.on("connection", newConnection);

function newConnection(socket){
   socket.on("inbound", inboundMessage);
   function inboundMessage(data){
      socket.broadcast.emit("outbound", data);
   }
}
