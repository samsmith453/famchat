var socket = io.connect("192.168.0.16:3000");

function receiveMesg(msg){
   console.log("receive");
   $(".chatbox").append("They said: "+msg+"<BR>");
}

$(document).ready(function(){
   $(".btn").click(function(){
      var val = $(".textbox").val();
      $(".chatbox").append("I said: " +val+"<BR>");
      socket.emit("inbound", val);
      $(".textbox").val("");
   })

   socket.on("outbound", receiveMesg);

   $(".textbox").keypress(function(e){
      if(e.keyCode==13){
         $(".btn").click();
      }
   })
});
