function upcomingEventsCtrl(ng, wi, aj, utils){
	var $ = jQuery,
		serverController = "events",
		actions = {
			getUpcomingEvents : "get_upcoming_events.json"
		};

	ng.openEventDetail = function( id ){
		console.log( id );
	};

	var get_upcoming_events = function(){
		utils.AjaxCall(serverController, actions.getUpcomingEvents, true, function(data, status){
			if(status == "success"){
				ng.upcoming_events = data.events;
			}
		});		
	};

	var init = function(){
		get_upcoming_events();
	};

	init();
}
upcomingEventsCtrl.$inject = ['$scope', '$window', '$http', 'BudsTimeUtils'];