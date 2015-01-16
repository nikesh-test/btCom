function ProfileCalendarCtrl(ng, wi, aj, utils){

	var $ = jQuery,
		serverController = "events",
		actions = {
			getDayEvents 	: "get_day_response",
			getDayEvents 	: "get_events_day",
			addComment 		: "add_comment",
			getAllComments 	: "get_all_comments",
			removeEvent		: "get_day_response",
			listEvents 		: "list_events",
			inviteFriends   : "invite_friends"
		};
	

	ng.updateEvents = function(){
		utils.updateEvents(ng);
	};

	ng.listEvents = function( timerange ){

		var requestObj = {
			date :  {
		      day : ng.current_day,
		      month : ng.current_month,
		      year : ng.current_year
		    },
			time_range : timerange
		};

		// utils.AjaxCall('events', actions.listEvents, requestObj, ng, function(data, status){
		utils.AjaxCall('app', 'webroot/json/events/get_bud_events.json', requestObj, ng, function(data, status){
			if(status === "success"){
				ng.event_list = data.data.events;
				ng.event_list_time_range = timerange;
				utils.OpenModal({
					tmpl: root + 'partials/event-list.html',
					scope: ng
				});				
			}
		});
		
	};

	ng.inviteFriends = function( event ){
		utils.OpenModal({
			tmpl: root + 'partials/invite-friends.html',
			scope: ng, 
			action: function(){
				var i, friends_selected = [];
				for(i=0;i<ng.invited.length;i++){
					ng.invited[i].checked ? friends_selected.push(ng.invited[i].id) : '';
				}

				if(friends_selected.length > 0){
				    var requestObj = {
	                	event_id : event.id,
	                	userlist : friends_selected
	                };

	                // utils.AjaxCall('events', actions.inviteFriends, requestObj, ng, function(data, status){
					utils.AjaxCall('app', 'webroot/json/events/get_event_list.json', requestObj, ng, function(data, status){
						if(status === "success"){
							utils.updateEvents(ng);
						}
					});
				}
			}
		});
	};

	/*
	ng.returnEvent = function(section){
		ng.event = section.event;
	};
	*/
	// ng.openGalleryItem = function( image ){
	// 	console.log(image.id);
	// };

	
	// calendar navigation
	ng.showView = function( which ){
		if( which == "year"){
			ng.calendarDayView =  false;
			ng.calendarMonthView = false;
			ng.calendarYearView = true;
		} else if(which == "month"){
			ng.calendarDayView =  false;
			ng.calendarMonthView = true;
			ng.calendarYearView = false;
		} else{
			defaultCalendarView();
		}
	};

	var defaultCalendarView = function(){
		ng.calendarDayView =  true;
		ng.calendarMonthView = false;
		ng.calendarYearView = false;
	};

	var init = function(){
		defaultCalendarView();
		
	};

	init();

}
ProfileCalendarCtrl.$inject = ['$scope', '$window', '$http', 'BudsTimeUtils'];