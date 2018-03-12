var express =require('express');

var app = express();

var http =require('http').Server(app);
var io = require('socket.io')(http);

var mongoose = require('mongoose');

var Chat = require('./Chat-model');

const chatModel = mongoose.model('Chat');

const events = require('events');

const myEventEmitter = new events.EventEmitter();

myEventEmitter.on('dbSave', function(data){
	var newMsg = new chatModel({msg: data.msg,user:data.user});
	newMsg.save(function (err) {
	  if (err) {
		  console.log(err.message);
	  } else {
		console.log("Message Inserted successfully");
		io.sockets.emit('newChat',{msg: data.msg, user: data.user});		
		  
	  }
	});
});


//===========================Application Set Up=================================================================//


//static files

app.use(express.static('public'));


//connect to mongodb
const dbPath  = "mongodb://test:test@ds153948.mlab.com:53948/chatdb";

// connect with database
db = mongoose.connect(dbPath);

mongoose.connection.once('open', function() {

	console.log("database connection open success");

});


//socket setup


var users={};

io.on('connection',function(socket){

		console.log('made socket connection',socket.id);

		

		socket.on('user',function(username,check){//=======================================user event

			if(username in users){
				check(false);
			}
			else{

				check(true);
				socket.user = username;
				users[socket.user]=socket.id;
				console.log(users);
				socket.broadcast.emit('newuser',socket.user);

			}
			
		});

			
		
			 socket.on('start chat', function(data){//====================chat event
			 	console.log(data);
			 	
			 	var msg = {"msg":data,"user":socket.user};
			 	myEventEmitter.emit('dbSave',msg);


			 }); 

			 
			const query= chatModel.find({});
			
			 query.sort('-created').exec(function(err,olddata) {
			 	if (err) {throw err;}
			 		
			 	 io.emit('oldmsgs',olddata);
			 });



		socket.on('typing',function(){//=======================================typing event

			socket.broadcast.emit('typing',socket.user+' is typing.........');
		});


		socket.on('disconnect',function(){

			console.log(' disconnected');
			socket.broadcast.emit('loggedout',socket.user+' has left.....');

			delete users[socket.user];


		});
});


http.listen(4000,function(){
	console.log('App listening on port 4000');
});
