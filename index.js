var net = require('net');
var count = 0,
	users = {}; //用户组，储存的是conn
var server = net.createServer(function(conn) { //每个连接一个conn
	conn.write(' \r\n > welcome to \033[92mnode-chat\033[39m!' + ' \r\n > ' + count + ' other people are connected at this time' + ' \r\n > pleace write your name and press enter:\r\n');
	count++; //聊天室人数计数器
	conn.setEncoding('utf-8');
	var nickname;
	var msg = '';
	conn.on('data', function(data) {
		if (data != '\r\n') {
			msg = msg + data; //整合data。回车才为一条信息
		} else {
			//第一条信息为昵称
			if (!nickname) {
				if (users[msg]) { //昵称对应conn
					conn.write('nickname is already in use.try again: \r\n');
					return;
				} else {
					nickname = msg;
					users[nickname] = conn;
					broadcast(nickname + ' joined the room \r\n');
				}
			} else {
				broadcast(nickname + ' : ' + msg + "\r\n")
			}
			msg = ''; //发送完一条后置空
		}

	});
	conn.on('close', function() {
		count--;
		broadcast('\033[96m > ' + nickname + ' left the room\033[39m\r\n');
	});
});

function broadcast(msg, exceptMyself) {
	for (var i in users) {
		if (!exceptMyself || i != nickname) { //如果除了自己为真则排除掉自己，如果为假则非后为真||短路。
			users[i].write(msg)
		}
	}
}
server.listen(3000, function() {
	console.log('\033[96m  server listening on *:3000!\033[39m');
})