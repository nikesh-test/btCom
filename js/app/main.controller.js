function budstimeMainCtrl(ng, wi, aj, $location, utils){
	
	var $ = jQuery,
		serverController = "friends",
		eventServerController = "events",
		actions = {
			getUsers : "get_users",
			getGroups : "get_groups.json",
			getFollowing : "get_following",
			// setNewEvent : "get_day_response"
			addEvent : "addevent",
			removeEvent : "remove_event"
		};

	var resetImagesOnAddEvent = function(){
		ng.Event.images = [];
	};

	ng.toggleAditional = function(){
		ng.Event.showAditionalOpts = ng.Event.showAditionalOpts ? false : true;
	};

	ng.privacyToggle = function( current ){
		ng.Event.eventprivacy = current;
	};

	ng.newVideoUrl = function( event, error, updateEvent ){	

		if (error === false && event.youtubeurl !== ""){
			event.videos.unshift( event.youtubeurl );
			event.youtubeurl = "";
		}		

		if(updateEvent){
			var requestObj = {
				event : event
			};
			utils.AjaxCall('events', 'add_video', requestObj, ng, function(data, status){
				if(status === "success"){}
			});
		} 		
	};

	ng.removeVideoUrl = function( event, index, updateEvent ){
		event.videos.splice(index, 1);
		if(updateEvent){
			var requestObj = {
					event : event
				};
			utils.AjaxCall('events', 'remove_video', requestObj, ng, function(data, status){
				if(status === "success"){}
			});
		}
	};

	var addEvent = function( showAditionalOpts ){

		var requestObj = {
          Event : ng.Event
        };	

		if( !showAditionalOpts ){
			utils.AjaxPost(eventServerController, actions.addEvent, requestObj, ng, function(data, status){
				if(status == "success"){
					ng.Event.id = data.data.event_id;
					ng.Event.showAditionalOpts = true;
				}
			});
		} else {
			utils.AjaxPost(eventServerController, actions.addEvent, requestObj, ng, function(data, status){
				if(status == "success"){
					var new_date = ng.Event.eventfromdate;
					utils.updateCurrentDate( new_date, ng);
					utils.updateEvents(ng);
					utils.get_upcoming_events(ng);
					ng.Event = utils.getResetedEventInfo();		
				}
			});	
		}
	};

	ng.removeEvent = function( event_id ){

		var requestObj = {
          id : event_id
        };

		utils.OpenModal({
			message_id: 1576,
			scope: ng, 
			tmpl: root + 'partials/modal-remove-event.html',
			action: function(){
				utils.AjaxPost(eventServerController, actions.removeEvent, requestObj, ng, function(data, status){
					if(status == "success"){
						ng.destroyEditEvent();
						utils.updateEvents(ng);
					}
				});
			}
		});
	};

	ng.triggerAddEvent = function( showAditionalOpts ){
		addEvent( showAditionalOpts );
	};

	ng.openAddEvent = function(){
		if(ng.Event.images.length){
			utils.updateEvents(ng);
		}

		ng.Event = utils.getResetedEventInfo();

		if(ng.friendID){
			ng.Event.userlist.push(ng.friendID);
		}

		utils.OpenModal({
			tmpl: root + 'events/addevent',
			scope: ng, 
			action: function(){

				addEvent( ng.Event.showAditionalOpts );
			},
			cancel : function(){
				if(ng.Event.showAditionalOpts){ // skip function
					addEvent( ng.Event.showAditionalOpts );
				}
			}
		});
	};

	ng.editEvent = function( event_id ){
		ng.renderEditEvent = event_id;
		var modalId = "#event-" + event_id;
		utils.close( modalId );
	};

	ng.inviteFriends = function(){
		utils.OpenModal({
			tmpl: root + 'partials/invite-friends.html',
			scope: ng, 
			action: function(){
				var i, friends_selected = [];
				for(i=0;i<ng.invited.length;i++){
					ng.invited[i].checked ? friends_selected.push(ng.invited[i].id) : '';
				}

				ng.$apply(function(){
					// $('#event_invite_userlist').val(JSON.stringify(friends_selected));
					ng.Event.userlist = friends_selected;
				});
			}
		});
	};

	ng.listUsers = function( event ){
		var requestObj = {
			eventTitle : event.title
		};

		// utils.AjaxCall('events', 'get_user_list', requestObj, ng, function(data, status){
		utils.AjaxCall('app', 'webroot/json/events/get_user_list.json', requestObj, ng, function(data, status){
			if(status === "success"){
				ng.user_list = data.data.users;
				ng.userListEventTitle = event.title;

				utils.OpenModal({
					tmpl: root + 'partials/users-list.html',
					scope: ng
				});
			}
		});
	};

	ng.searchResult = function( query ){
		if(query && query !== ""){
			ng.renderSearch = true;
			ng.searchResultDestroy = false;
		}
	};

	ng.removeSearchQuery = function(){
		ng.renderSearch = false;
		ng.searchResultDestroy = true;			
	};

	ng.searchTimeResult = function(){
		ng.renderTimeSearch = true;
		ng.searchTimeResultDestroy = false;
	};

	ng.removeTimeSearchQuery = function(){
		ng.renderTimeSearch = false;
		ng.searchTimeResultDestroy = true;
	};

	// ng.openProfilePage = function( id ){
	// 	console.log( id );
	// };

	ng.respondFriendRequest = function( id, action ){
		var requestObj = {
			id : id
		};
		utils.AjaxPost('friends', action, requestObj, ng, function(data, status){
			if(status == "success"){
				window.location.reload();
			}			
		});
	};

	ng.addFriend = function( user ){
		var requestObj = {
			data : {
				Friend : {
					friend_id : user.id
				}
			}
		};
		utils.AjaxPost('friends', 'sendRequest', requestObj, ng, function(data, status){
			if(status == "success"){
				user.is_friend = true;
			}			
		});
	};

	ng.removeFriend = function( user ){
		var requestObj = {
			friend_id : user.id
		};
		utils.AjaxPost('friends', 'remove_friend', requestObj, ng, function(data, status){
			if(status == "success"){
				user.is_friend = false;
			}
		});
	};

	ng.getUserInfo = function( id, request ){
		var user = getUserById(id);
		if(user.length){
			user = user[0];
			return user[request] ? user[request] : '';
		} 
	};

	var getUserById = function( id ){
		if( ng.users ){
			return $.grep(ng.users, function(e){ 
				return e.id == id;
			});
		}
	};

	var getAllUsersInfo = function(){
		var requestObj = {};
		utils.AjaxCall('friends', actions.getUsers, requestObj, ng, function(data, status){
			ng.users = data.data.users;
		});
	};

	var getUserGroups = function(){
		var requestObj = {};
		utils.AjaxCall('groups', actions.getGroups, requestObj, ng, function(data, status){
			if(status == "success"){
				ng.groups = data.groups;
				ng.group_select = data.groups[0].id;
			}
		});
	};

	ng.toggleCounting = function( checked ){
		checked ? ng.invite.count++ : ng.invite.count--;
	};

	ng.set_current_year = function( year ){
		ng.current_year = year;
	};

	ng.set_current_day = function( day ){
		ng.current_day = day;
	};

	ng.set_current_month = function( month ){
		ng.current_month = month;
	};   

	ng.editProfile = function(){
		utils.OpenModal({
			tmpl: root + 'users/edit',
			scope: ng, 
			action: function(){
				console.log('update profile');
				updateProfile();
			}
		});
	};

	ng.joinAction = function( event ){
		var requestObj = {
			user_id : event.user_id,
			event_id : event.id
		};
		utils.AjaxCall("eventfriends", "add", requestObj, ng, function(data, status){
			if(status == "success"){
				event.showJoin = false;
			}
		});
	};

	ng.removeComment = function( id, index, comments ){
		var serverController = "events",
			actions = {
				removeComment : "delete_comment"
			},
			requestObj = {
		      commentID : id
		    };

		utils.AjaxCall(serverController, actions.removeComment, requestObj, ng, function(data, status){
		  if(status == "success"){
		  	// console.log( comments.last_comments, index);
		  	var index = parseInt( index, 10 );
		  	comments.last_comments.splice(index, 1);
		    comments.comments_length = comments.comments_length - 1;    
		  }
		});
	};

	var updateProfile = function(){		
		$.ajax({
			  url: root + 'users/edit',
			  type: 'POST',
			  data: $('#UserEditForm').serialize()
		  }).done(function(response) {
			  if(response){
				  var _d = $.parseJSON(response);
				  if(_d.success){
					  if(parseInt(_d.data.code) == 0){
						  window.location.href = '/users/home';
					  }
				  } else {
					  alert('Sorry! we are not able to update your profile, Please try again.')
				  }
			  }
		  }).fail(function(response) {
			  alert('Sorry! we are not able to update your profile, Please try again.')
		  });	
	};

	var get_invite_list = function(){
		var requestObj = {};
		var pathname = window.location.pathname;
		var actionname =  pathname.split('/')[2];
		
		if (actionname == 'profile'){
			
			requestObj = {
				"id" : pathname.split('/')[3]
			};
		}
		utils.AjaxCall(serverController, actions.getFollowing, requestObj, ng, function(data, status){
			if(status == "success"){
				ng.invited = data.data.following;
				ng.invite.count = 0;
			}
		});
	};

	var checkLocation = function(){
		var baseUrl = $location.host(),
			absUrl = $location.absUrl(),
			path = $location.path(),
			friendProfileUrl = $location.protocol() + '://' + baseUrl + '/friends/profile/',
			friendId = absUrl.replace(friendProfileUrl, '');
		
		if( path.indexOf("/event/") !== -1){
			path = path.split("/");
			var eventID = parseInt( path[2], 10 ) || 0;
			if( eventID ){
				utils.openEventInfo( eventID, ng );
			}
		}

		friendId = parseInt(friendId, 10) || 0;
		if( friendId ){
			ng.friendID = friendId;
		}
	};

	var init = function(){

		ng.friendID = 0;
		ng.currentUser = currentUser;
		checkLocation();

		// get all user data
		getAllUsersInfo();
		// getUserGroups();
		get_invite_list();

		ng.invite = {};
		ng.renderSearch = false;
		ng.searchResultDestroy = '';
		ng.renderEditEvent = 0;
		ng.Event = {};
		ng.Event.images = [];
		ng.Event.showAditionalOpts = false;
		ng.facebookSync = false;


      	utils.get_current_date(ng, function(current_date){
  			ng.current_day = current_date.day;
	        ng.current_month = utils.getMonthName(current_date.month-1);
	        ng.current_year = current_date.year;
	        utils.updateEvents(ng);
      	});

      	utils.get_upcoming_events( ng );
     
	};

	init();
}
budstimeMainCtrl.$inject = ['$scope', '$window', '$http', '$location', 'BudsTimeUtils'];