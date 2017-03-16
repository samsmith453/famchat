var socket = io.connect(window.location.hostname);
//will need to change the above to work on heroku

var lastsender;

function receiveMesg(msg){
   var text = msg.msg;
   var sender = msg.sender;
   var time = msg.time;
   if(sender==lastsender){
      console.log("yes");
      $(".chatbox").append("<div class='row'><div class='filler'></div><p class='sender'></p><p class='msg'>"+text+"</p><pclass='time'>"+time+"</p></div>")
   }
   else if(sender==person){
      $(".chatbox").append("<div class='row'><img class='pic' src='/pics/"+sender+".jpg'><p class='sender'>Me</p><p class='msg'>"+text+"</p><pclass='time'>"+time+"</p></div>")
   }
   else{
      $(".chatbox").append("<div class='row'><img class='pic' src='/pics/"+sender+".jpg'><p class='sender'>"+sender+"</p><p class='msg'>"+text+"</p><pclass='time'>"+time+"</p></div>")
   }

   lastsender=sender;

}

function scrolldown(){
   $('html, body').animate({scrollTop:$(document).height()}, 'slow');
}

$(document).ready(function(){
scrolldown();
   $(".chatbox").on("mouseenter", ".row", function(){
      $(this).css({"background-color": "#c6d3ff"});
   });
   $(".chatbox").on("mouseleave", ".row", function(){
      $(this).css({"background-color": "white"});
   });

   $(".btn").click(function(){
      var val = $(".textbox").val();
      if(val!=""){
            var d = new Date();
            var time = d.getHours() +":"+ d.getMinutes() + " " + d.getDate() +"/"+(d.getMonth()+1);
         var obj = {
            msg: val,
            sender: person,
            time: time
         }
         socket.emit("inbound", obj);
         $(".textbox").val("");
         scrolldown();
      }
      return;
   })

   socket.on("outbound", receiveMesg);

   $(".textbox").keypress(function(e){
      if(e.keyCode==13){
         $(".btn").click();
      }
   })
});
