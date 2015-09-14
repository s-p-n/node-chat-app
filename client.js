var socket = io();
var audio;

function parseMessage (msg) {
	 var entityMap = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': '&quot;',
		"'": '&#39;'
	};

	function escapeHtml(string) {
		return String(string).replace(/[&<>"']/g, function (s) {
			return entityMap[s];
		});
	}

	var parseMap = {
		'\n': '<br>',
		'[b]': '<b>',
		'[/b]': '</b>',
		'[i]': '<em>',
		'[/i]': '</em>'
	}

	msg = escapeHtml(msg);
	var token;
	for (token in parseMap) {
		msg = msg.replace(token, parseMap[token]);
	}
	return msg;
}

function sendMessage () {
	var blocked = false;
	return function () {
		var msg = $('#m').val();
		if (msg.length === 0 || blocked) {
			return false;
		}
		blocked = true;
		socket.emit('message', $('#m').val());
		$('#m').val('');

		setInterval(function () {
			blocked = false;
		}, 2000);

		return false;
	};
}

function appendMessage (msg) {
	msg = parseMessage(msg);
	var lastMsg = $('#messages li:last');
	var msgName = msg.split(':')[0];
	var lastMsgName = lastMsg.text().split(':')[0];
	if (lastMsgName === msgName) {
		lastMsg.append('<br>' + msg.split(':')[1]);
	} else {
		$('#messages').append($('<li>').html(msg));
	}
}

function autoScroll () {
	var height = 0;
	$('#messages li').each(function () {
		height += $(this).height();
	});
	$("#messages").animate({ scrollTop: height }, "slow");
}

function init () {
	if (window.navigator.userAgent.indexOf("MSIE ") === -1) {
		audio = new Audio('audio.wav');
	} else {
		audio = new Audio('audio.mp3');
	}
	var i, msg;
	for (i = 0; i < message_history.length; i += 1) {
		appendMessage(message_history[i]);
	}
	autoScroll();

	if (cookies.nickname !== void 0) {
		$('#name').val(cookies.nickname);
	}
}

init();

$('#name').blur(function () {
	var name = $('#name').val();
	if (name.length === 0) {
		name = 'Anonymous';
	}
	document.cookie = "nickname=" + name;
	socket.emit('nickname', name);
	
})

$('form').submit(sendMessage());

(function () {
	//var shiftDown = false;
	//$(document).on('keyup keydown', function(event){shiftDown = e.shiftKey} );
	$('#m').keypress(function (event) {
		console.log(event.which, event.shiftKey);
		if (event.which === 13 && !event.shiftKey) {
			$('form').submit();
			return false;
		}
	});
}());
socket.on('chat message', function (msg) {
	appendMessage(msg);
	audio.play();
	autoScroll();
});