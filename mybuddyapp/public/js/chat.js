window.onload = function() {
 
    var messages = [];
    var socket = io.connect('localhost:3000/');
    var name = document.getElementById("NameofPerson");
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    socket.on('message', function (data,first) {
        if (first){
            var List = data.message.toString().split(',')
            for(var i=0; i<List.length; i++) {
                messages.push(List[i]);
            }
            if(data.message) {
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += renderMessage(messages[i]) + '<br />';
            }
            content.innerHTML = html;
            } else {
                console.log("There is a problem:", data);
            }
        }
        else{
            if(data.message) {
                messages.push(data.message);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += renderMessage(messages[i]) + '<br />';
            }
            content.innerHTML = html;
            } else {
                console.log("There is a problem:", data);
            }
        }
    });
    sendButton.onclick = function() {
        var text = field.value;
        var textwithname = name.value+": " + text;
        socket.emit('send', { message: textwithname });
    };
}
var renderMessage = function(message){
  var isSelf = (message.indexOf(name.value) == 0);
  var colonLoc = message.indexOf(":");
  var body = message;
  console.log(body)
  if(isSelf){
    return selfSideTemplate({message:body});
  }
  else{
    return otherSideTemplate({message:body});
  }
}
function otherSideTemplate(locals) {
  var buf = [];
  var jade_mixins = {};
  var jade_interp;
  var locals_for_with = locals.message;
  (function(message) {
    buf.push('<li class="other"><div class="avatar"><img src="/img/user.png" draggable="false"></div><div class="msg"><p>'+message  + "</p></div></li>");
  }).call(this, locals_for_with);
  return buf.join("");
}
function selfSideTemplate(locals) {
  var buf = [];
  var jade_mixins = {};
  var jade_interp;
  var locals_for_with = locals || {};
  (function(message) {
    buf.push('<li class="other"><div class="avatar"><img src="/img/user.png" draggable="false"></div><div class="msg"><p>' +message+ "</p></div></li>");
  }).call(this, "message" in locals_for_with ? locals_for_with.message : typeof message !== "undefined" ? message : undefined);
  return buf.join("");
}
