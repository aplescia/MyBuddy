window.onload = function() {
 
    var messages = [];
    var socket = io.connect('http://localhost:3000');
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
                html += messages[i] + '<br />';
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
                html += messages[i] + '<br />';
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