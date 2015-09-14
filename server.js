var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cookieParser = require('cookie-parser');
var message_log = [];

function parseCookies (cookieString) {
	if (cookieString === void 0 || cookieString.length === 0) {
		return {};
	}

	console.log(cookieString);
	var cookies = {};
	var cookie_split1 = cookieString.split(';');
	var cookie_split2;
	var i;
	for (i = 0; i < cookie_split1.length; i += 1) {
		cookie_split2 = cookie_split1[i].split('=');
		cookies[cookie_split2[0].trim()] = cookie_split2[1];
	}
	return cookies;
}

app.use(cookieParser());

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/audio.mp3', function (req, res) {
	res.sendFile(__dirname + '/assets/audio/13290__schademans__pipe9.mp3');
});

app.get('/audio.wav', function (req, res) {
	res.sendFile(__dirname + '/assets/audio/13290__schademans__pipe9.wav');
});

app.get('/client', function (req, res) {
	res.sendFile(__dirname + '/assets/js/client.js');
});

app.get ('/assets/:type/:asset', function (req, res) {
	var asset = req.params.asset;
	var type = req.params.type;
	//console.log("Asset:", asset);
	res.sendFile(__dirname + '/assets/' + type + '/' + asset);
});

app.get('/data', function (req, res) {
	var data = '';
	data += 'var cookies = ' + JSON.stringify(req.cookies) + ';\n';
	data += 'var message_history = ' + JSON.stringify(message_log) + ';\n';
	res.send(data);
});

io.on('connection', function (socket) {
	var nickname = "Anonymous";
	var cookies = parseCookies(socket.handshake.headers.cookie);
	//console.log("Cookies:", cookies);
	if (cookies.nickname !== void 0) {
		nickname = cookies.nickname;
	}
	console.log(nickname + ' connected.');
	socket.on('nickname', function (name) {
		//console.log("User set nickname:", name);

		nickname = name;
	});
	socket.on('message', function (msg) {
		var message = nickname + ': ' + msg;
		if (message_log.length > 10) {
			message_log.shift();
		}
		message_log.push(message);
		//console.log(message);
		io.emit('chat message', message);
	});
	socket.on('disconnect', function () {
		console.log(nickname, "disconnected.");
	});
});

http.listen(3000, function(){
  console.log('Listening.');
});
