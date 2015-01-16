var friend = {
	
	// initilize the friend events
	init: function(){
		$('#btnAddFriend').bind('click', function(){
			$('#btnAddFriend').attr('disabled', 'disabled');
			$('#add-friend-text').text('sending request...');
			friend.sendRequest();
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
		friend.ajax('/friends/sendRequest', 'POST', $('#frmSendFriendRequest').serialize(), function(response){
			$('#add-friend-text').text('request sent');
		});
	}	
};

// calling init
friend.init();