var 
	// debug = require('debug')('express-socket.io-session:example'),
	app = require('express')(),
	server = require('http').createServer(app),
	io = require('socket.io')(server),
	session = require('express-session')({
		secret: 'my-secret',
		resave: true,
		saveUninitialized: true
	}),
	sharedsession = require("express-socket.io-session");
	cors = require("cors");
	corsOptions = {
		origin: (process.env.REACT_APP_CLIENT || 'http://localhost:3000'),
		credentials: true };
	cookieParser = require('cookie-parser');
	bodyParser = require('body-parser');
	uuidv4 = require('uuid').v4;

app.use(session);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser());


io.use(
	sharedsession(session, {
		autoSave: true
	})
);

app.get('/login/:nickname', function(req, res) {
	const nickname = req.params.nickname; 
	const nicknameAvailable = !nicknameCollection.includes(nickname);

	if(nicknameAvailable) {
		nicknameCollection.push(nickname);
	}
	res.status(200).send({nicknameSaved:nicknameAvailable});

});

app.get('/logout/:nickname', function(req, res) {
	const nickname = req.params.nickname; 
	if(nicknameCollection.includes(nickname)) {
		removeNickname(nickname);
	}

	res.status(200).send({logout:true});
});



app.use(require('express').static(__dirname));

io.on('connection', function(socket) {
	console.log('Connection established')

	socket.on('userConnected', (data) => {
		saveNewMessage(data);
		socket.broadcast.emit('newMessage', data);
		console.log('new user',data)
	});

	socket.on('loadMessages', () => {
		socket.emit('loadMessages', messageCollection);
	});

  	socket.on('sendMessage', (data) => { 
		saveNewMessage(data);
		io.emit('newMessage', data);
		console.log('Message received: ',data);
  	});

	socket.on('disconnet', (nickname) => { 
		console.log(nickname,'disconnected')
	});

});
  
const PORT = process.env.PORT || 8001;
const server_url = process.env.SERVER_URL
server.listen(PORT,null, function(){
  console.log(`listening on *:${PORT}`);
});

function saveNewMessage(message) {
	message.id = uuidv4();
	messageCollection.push(message);
}

function removeNickname(nickname) {
	nicknameCollection.splice(nicknameCollection.indexOf(nickname),1);
}

messageCollection = [ 
	{'id':'8ea473bf-d89b-4732-93f1-ab39e01604c9','user':'John','body':'Fake Message from John','datetime':Date.now(),'isUserMessage':true, 'isSystemMessage':false},
	{'id':'04ab7b23-eae4-4fe1-8ab0-4519b915ec6f','user':'Doe','body':'Fake Message from Doe','datetime':Date.now(),'isUserMessage':true, 'isSystemMessage':false},
	{'id':'14ab7b23-eae4-4fe1-8ab0-4519b915ec6f','user':'Lorem Ipsum','body':'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
	'datetime':Date.now(),'isUserMessage':true, 'isSystemMessage':false},
	{'id':'24ab7b23-eae4-4fe1-8ab0-4519b915ec6f','user':'Lorem Ipsum','body':'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
	'datetime':Date.now(),'isUserMessage':true, 'isSystemMessage':false},
	{'id':'34ab7b23-eae4-4fe1-8ab0-4519b915ec6f','user':'John Doe','body':'Short message from John Doe','datetime':Date.now(),'isUserMessage':true, 'isSystemMessage':false},
	{'id':'44ab7b23-eae4-4fe1-8ab0-4519b915ec6f','user':'Sara','body':'Fake Message from Sara','datetime':Date.now(),'isUserMessage':true, 'isSystemMessage':false},
	{'id':'54ab7b23-eae4-4fe1-8ab0-4519b915ec6f','user':'Slade','body':'Fake Message from Slade','datetime':Date.now(),'isUserMessage':true, 'isSystemMessage':false},
	{'id':'64ab7b23-eae4-4fe1-8ab0-4519b915ec6f','user':'Bruce','body':'Fake Message from Bruce','datetime':Date.now(),'isUserMessage':true, 'isSystemMessage':false},

  ];
  
nicknameCollection = [
	'John',
	'Doe',
	'Lorem Ipsum',
	'Slade',
	'Sara',
	'Bruce',
	'John Doe'
];
