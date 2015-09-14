var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')('http');


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/client', function req, res) {
	res.sendFile(__dirname + '/client.js');
}

io.on('connection', function (socket) {
	console.log('a user connected');
})

http.listen(3000, function(){
  console.log('listening on *:3000');
});
