var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var message_log = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/audio.mp3', function (req, res) {
	res.sendFile(__dirname + '/13290__schademans__pipe9.mp3');
});

app.get('/audio.wav', function (req, res) {
	res.sendFile(__dirname + '/13290__schademans__pipe9.wav');
});

app.get('/client', function (req, res) {
	res.sendFile(__dirname + '/client.js');
});

app.get ('/assets/:type/:asset', function (req, res) {
	var asset = req.params.asset;
	var type = req.params.type;
	console.log("Asset:", asset);
	res.sendFile(__dirname + '/assets/' + type + '/' + asset);
});

app.get('/history', function (req, res) {
	res.send('var message_history = ' + JSON.stringify(message_log));
});

io.on('connection', function (socket) {
	var nickname = "Anonymous";
	console.log('User connected.');
	socket.on('nickname', function (name) {
		console.log("User set nickname:", name);
		nickname = name;
	});
	socket.on('message', function (msg) {
		var message = nickname + ': ' + msg;
		message_log.push(message);
		console.log(message);
		io.emit('chat message', message);
	});
	socket.on('disconnect', function () {
		console.log("User disconnected.");
	});
});

http.listen(3000, function(){
  console.log('Listening.');
});
