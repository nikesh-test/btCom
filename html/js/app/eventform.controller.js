function eventFormCtrl(ng, wi, aj, utils){
	var $ = jQuery,
		serverController = "events",
		actions = {
			setNewEvent : "get_day_response.json"
		};

	ng.toggleAditional = function(){
		ng.e.showAditionalOpts = ng.e.showAditionalOpts ? false : true;
	};

	ng.toggleShare = function(){
		ng.e.share_on_facebook = ng.e.share_on_facebook ? false : true;
	};

	ng.privacyToggle = function( current ){
		ng.e.privacy = current;
	};

	var addEvent = function(){
		utils.AjaxCall(serverController, actions.setNewEvent, ng.e, function(data, status){
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
			tmpl: 'partials/add-event.html',
			scope: ng, 
			action: function(){
				addEvent();
			}
		});
	};

	ng.inviteFriends = function(){
		utils.OpenModal({
			tmpl: 'partials/invite-friends.html',
			scope: ng, 
			action: function(){
				var i, friends_selected = [];
				for(i=0;i<ng.invited.length;i++){
					ng.invited[i].checked ? friends_selected.push(ng.invited[i].id) : '';
				}
				ng.$apply(function(){
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