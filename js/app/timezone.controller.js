function timezoneCtrl(ng, wi, aj, utils){
	var $ = jQuery,
		serverController = "users",
		actions = {
			getTimeZone : "get_timezones",
			setTimeZone : "set_timezone"
		};


	ng.toggleTimezones = function(){
		ng.timezoneVisible = ng.timezoneVisible ? false : true;
	};

	ng.setTimeZone = function( tz ){
		var requestObj = {
			timezone : tz
		};
		/* hardcoded json */
		utils.AjaxCall(serverController, actions.setTimeZone, requestObj, ng, function(data, status){
			if(status === "success"){
				ng.currentTimezone = data.data.current;
				utils.hideAllOverLayers();
				ng.toggleTimezones();
				window.location.href = root + 'users/home';
			}
		});

		/* replace hardcoded with this: */
		// utils.AjaxCall(serverController, actions.setTimeZone, requestObj, ng, function(data, status){
		// 	if(status === "success"){
		// 		ng.currentTimezone = data.data.current;
		// 		utils.hideAllOverLayers();
		// 		ng.toggleTimezones();
		// 	}
		// });
	};

	var getTimeZone = function(){
		var requestObj = {};
		/* hardcoded json */
		utils.AjaxCall(serverController, actions.getTimeZone, requestObj, ng, function(data, status){
			if(status === "success"){
				ng.timezones = data.data.timezones;
				ng.currentTimezone = data.data.current;
			}
		});

		/* replace hardcoded with this: */
		// utils.AjaxCall(serverController, actions.getTimeZone, requestObj, ng, function(data, status){
		// 	if(status === "success"){
		// 		ng.timezone = data.data.timezone;
		// 	}
		// });
	};

	var init = function(){
		getTimeZone();
		ng.timezoneVisible = false;
	};

	init();
}
timezoneCtrl.$inject = ['$scope', '$window', '$http', 'BudsTimeUtils'];