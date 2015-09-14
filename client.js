var socket = io();
var audio;

if (window.navigator.userAgent.indexOf("MSIE ") === -1) {
	audio = new Audio('audio.wav');
} else {
	audio = new Audio('audio.mp3');
}

function init () {
	var i;
	for (i = 0; i < message_history.length; i += 1) {
		$('#messages').append($('<li>').text(message_history[i]));
	}
	$("#messages").animate({ scrollTop: $("#messages").height() }, "slow");
}

init();

$('#name').blur(function () {
	socket.emit('nickname', $('#name').val());
})

$('form').submit(function(){
	socket.emit('message', $('#m').val());
	$('#m').val('');
	return false;
});

socket.on('chat message', function (msg) {
	$('#messages').append($('<li>').text(msg));
	audio.play();
	$("#messages").animate({ scrollTop: $("#messages").height() }, "slow");
});