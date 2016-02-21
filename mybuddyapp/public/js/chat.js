window.onload = function() {
 
    var messages = [];
    var socket = io.connect('/');
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
  var body = message.slice(colonLoc);
  if(isSelf){
    return selfSideTemplate({message:locals});
  }
  else{
    return otherSideTemplate({message:locals});
  }
}
function otherSideTemplate(locals) {
  var buf = [];
  var jade_mixins = {};
  var jade_interp;
  var locals_for_with = locals || {};
  (function(message) {
    buf.push('<li class="other"><div class="avatar hide"><img src="/img/user.png" draggable="false"></div><div class="msg"><p>' + jade.escape((jade_interp = message) == null ? "" : jade_interp) + "</p></div></li>");
  }).call(this, "message" in locals_for_with ? locals_for_with.message : typeof message !== "undefined" ? message : undefined);
  return buf.join("");
}
function selfSideTemplate(locals) {
  var buf = [];
  var jade_mixins = {};
  var jade_interp;
  var locals_for_with = locals || {};
  (function(message) {
    buf.push('<li class="other"><div class="avatar hide"><img src="/img/user.png" draggable="false"></div><div class="msg"><p>' + jade.escape((jade_interp = message) == null ? "" : jade_interp) + "</p></div></li>");
  }).call(this, "message" in locals_for_with ? locals_for_with.message : typeof message !== "undefined" ? message : undefined);
  return buf.join("");
}
