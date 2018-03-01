
//establishing connection
var socket = io();


var user = prompt('enter your name');

if(user!= null){

	$('#header').html('<h1 class="user">'+user+'</h1>');
	socket.emit('user',user);
}

socket.on('newuser',function(user){//===================================================user joined event

		
		console.log(user);
		$('#join').html('<p><em>'+user+' has joined...........</em></p>');

		setTimeout(function(){
			$('#join').html('');

		},3000);

});

socket.on('loggedout',function(data){//===========================================================user logged out event

	$('#logout').html('<p><em>'+data+'</em></p>');

		setTimeout(function(){
			$('#logout').html('');

		},3000);

});

$('#send').on('click',function(){ //===================================================click event

	socket.emit('start chat',$('#message').val());//============chat event emitted

	$('#message').val('');
});


$('#message').on('keypress',function(e){//======================================enter key press event
	const key=e.which;
	if(key==13)
	{
		$('#send').click();
		return false;
	}
		
});

$('#message').on('keypress',function(){//=================================================typing event

	if($('#message').val()){

		socket.emit('typing');
	}
});


socket.on('newChat',function(data){//===========================================================chat event


	$('#output').append('<p><strong>'+data.user+':</strong>'+data.msg+'</p>');

});





socket.on('typing',function(data){

	var timer;
	clearTimeout(timer);

	$('#typing').html('<p><em>'+data+'</em></p>');

	timer = setTimeout(function(){

		$('#typing').html('');
	},2000);
	
});

///loading old message====================
socket.on('oldmsgs',function(olddata){

	console.log(olddata);
	
	var content='';
	
	if(olddata){

		for(i=olddata.length-1;i>=0;i--){

			content+='<p><strong>'+olddata[i].user+':</strong>'+olddata[i].msg+'</p>';
		
		}	
		$('#output').html(content);
	}
});

///infinite scrolling===============

$("#chat-window").animate({ scrollTop: $("#chat-window")[0].scrollHeight }, 1000);
