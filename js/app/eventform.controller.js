function eventFormCtrl(ng, wi, aj, utils){
	var $ = jQuery,
		serverController = "event",
		actions = {
			setNewEvent : "get_day_response"
		};

	ng.toggleAditional = function(){
		ng.e.showAditionalOpts = ng.e.showAditionalOpts ? false : true;
	};

	ng.privacyToggle = function( current ){
		ng.e.privacy = current;
	};

	var addEvent = function(){
	
		$.ajax({
 			  url: root + 'events/addevent',
  			  type: 'POST',
 			  data: $('#EventAddeventForm').serialize()
 
		  }).done(function(response) {
 
 			  if(response){
  				  var _d = $.parseJSON(response);
 				  if(_d.success){
 					  if(parseInt(_d.data.code) == 0){
 						  window.location.href = root + 'users/home';
  					  }

 				  } else {
 
					  alert('Sorry! we are not able to add event, Please try again.')
 
				  }
 			  }
 		  }).fail(function(response) {
 			  alert('Sorry! we are not able to add event, Please try again.')
 		  });	
		
		utils.AjaxCall(serverController, actions.setNewEvent, ng.e, ng, function(data, status){
			if(status == "success"){
				console.log( ng.e ); // event object posted
				var new_date = ng.e.date.date_range.from;
				utils.updateCurrentDate( new_date, ng);
				utils.updateEvents(ng);
				formReset();
			}
		});
	};


	ng.openAddEvent = function(){
		utils.OpenModal({
			tmpl: root + 'events/addevent',
			scope: ng, 
			action: function(){
				addEvent();
			}
		});
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
					$('#event_invite_userlist').val(JSON.stringify(friends_selected));
					ng.e.friends = friends_selected;
				});
			}
		});
	};

	var default_form = { 
		name : '',
		details: '',
		date: {
			date_range:{
				from: '',
				to: ''
			},
			time_range:{
				from: '',
				to: ''
			}
		},
		location: '',
		privacy: 'public',
		friends: [],
		visible_for: 0,
		share_on_facebook: false,
		youtube: '',
		showAditionalOpts: false
	};

	var formReset = function(){
		ng.e = default_form;
	};

}
eventFormCtrl.$inject = ['$scope', '$window', '$http', 'BudsTimeUtils'];