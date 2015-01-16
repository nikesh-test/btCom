function upcomingEventsCtrl(ng, wi, aj, utils){
	var serverController = "events",
		actions = {
			getUpcomingEvents : "get_upcoming_events"
		};

	var get_upcoming_events = function(){
		var requestObj = {};
		utils.AjaxCall(serverController, actions.getUpcomingEvents, requestObj, ng, function(data, status){
			if(status == "success"){
				ng.upcoming_events = data.data.events;
			}
		});		
	};

	var init = function(){
		get_upcoming_events();
	};

	// init();
}
upcomingEventsCtrl.$inject = ['$scope', '$window', '$http', 'BudsTimeUtils'];