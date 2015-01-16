var eventfriend = {
	
	// initilize the friend events
	init: function(){
		$('#btnSendRequest').bind('click', function(){
			$('#btnSendRequest').attr('disabled', 'disabled');
			eventfriend.sendRequest();
		});
	},
	
	// ajax request
	ajax: function(_url, _type, _data, _callback){
		$.ajax({			
			type: _type,
			url: _url,
			data: _data,
			cache: false			
		}).done(function(response) {
			if(typeof _callback === 'function'){
				_callback(response);
			}
		}).fail(function(response) { 
			if(typeof _callback === 'function'){
				_callback(response);
			}	
		});	    
	},
	
	// this method is responsible for sending new request
	sendRequest: function(){
		eventfriend.ajax('/eventfriends/add', 'POST', $('#frmSendEventFriendRequest').serialize(), function(response){
			$('#btnSendRequest').removeAttr('disabled');
			
			console.log(response);
		});
	}	
};

// calling init
eventfriend.init();