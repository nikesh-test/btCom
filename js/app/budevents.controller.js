function yourBudsCtrl(ng, wi, aj, utils){
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
		get_bud_events('true');
	};

	var get_bud_events = function( append ){
		var requestObj = {};
		utils.AjaxCall(serverController, actions.getBudEvents, requestObj, ng,function(data, status){
			if(status === "success"){
				if(append === "true")
					ng.bud_events = ng.bud_events.concat(data.data);
				else
					ng.bud_events = data.data;
			}
		});
	};

	var init = function(){
		get_bud_events('false');
		ng.toggleBuds = false;
	};

	init();
}
yourBudsCtrl.$inject = ['$scope', '$window', '$http', 'BudsTimeUtils'];