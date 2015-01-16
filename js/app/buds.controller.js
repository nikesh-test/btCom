function budsCtrl(ng, wi, aj, utils){
	var $ = jQuery,
		serverController = "events",
		actions = {
			getBudEvents : "your_buds_currently"
		};

	ng.openEventDetail = function( id ){
		console.log( id );
	};

	ng.toggle = function( val ){
		ng.toggleBuds = val ? false : true;
	};

	ng.load_more_events = function(){
		ng.bud_events_visible += 3;
	};

	var get_bud_events = function(){
		var requestObj = {};

		utils.AjaxCall(serverController, actions.getBudEvents, requestObj, ng, function(data, status){
			if(status === "success"){
				
				ng.bud_events = data.data.events;
				ng.bud_events_visible = 3;
				ng.total_events = data.data.total_events || 1;
				
				// ng.events_pagination = data.data.events_pagination;
				// ng.currentPage++;
			}
		});
	};

	var init = function(){
		ng.currentPage = 1;
		get_bud_events();
		ng.toggleBuds = true;
	};

	init();
}
budsCtrl.$inject = ['$scope', '$window', '$http', 'BudsTimeUtils'];