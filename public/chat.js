
//establishing connection
var socket = io();



swal({
  title: "Welcome",
  text: "Enter your name:",
  type: "input",
  showCancelButton: false,
  closeOnConfirm: false,
  inputPlaceholder: "your sweet name"
}, function (user) {
  if (user === false) return false;
  if (user === "") {
    swal.showInputError("we need your name!");
    return false
  }
  else{

  	$('#chatHeader').html('<h1 >'+user+'</h1>');
	socket.emit('user',user,function(checkIfExists){
		if(checkIfExists){
			swal.close();
		}
		else{

			swal.showInputError("This username exists!!");
		}
	});
	
  }
  
});


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


	$('#output  #out').append('<li class="clearfix"><p><strong class="primary-font pull-right">'+data.user+'</strong><span class="msg">'+ data.msg+'</span></p></li>');

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

			content+='<li class="clearfix"><p><strong class="primary-font pull-right">'+olddata[i].user+'</strong><span class="msg">'+olddata[i].msg+'</span></p></li>';
		
		}	
		$('#output  #out').html(content);
	}
});

///infinite scrolling===============

$(".panel-body").animate({ scrollTop: $(".panel-body")[0].scrollHeight }, 1000);
