var express =require('express');

var app = express();

var http =require('http').Server(app);
var io = require('socket.io')(http);

var mongoose = require('mongoose');

var Chat = require('./Chat-model');

const chatModel = mongoose.model('Chat');

const events = require('events');

const myEventEmitter = new events.EventEmitter();


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




io.on('connection',function(socket){

		console.log('made socket connection',socket.id);

		

		socket.on('user',function(username){//=======================================user event

			socket.user = username;
			socket.broadcast.emit('newuser',socket.user);

			
		});

			 function saveHandler(data){

			 	const newMsg = new chatModel({msg: data,user:socket.user});
				 	newMsg.save(function(err){
				 		
				 		if(err){throw err;}

						console.log("successful in saving data");

						//console.trace("daa");
						 io.sockets.emit('newChat',{msg: data, user: socket.user});		

						 
					});
				
				//myEventEmitter.removeListener('dbSave',saveHandler);
				
			 }

			 myEventEmitter.on('dbSave',saveHandler);
		
			 socket.on('start chat', function(data){//====================chat event
			 	console.log(data);
			 	
			 	myEventEmitter.emit('dbSave',data);


			 	/*const newMsg = new chatModel({msg: data,user:socket.user});
			 	newMsg.save(function(err){
			 		if (err) {throw err;}
			 		else{
			 			io.sockets.emit('newChat',{msg: data, user: socket.user});
			 		}
			 	});*/
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
		});
});


http.listen(4000,function(){
	console.log('App listening on port 4000');
});
