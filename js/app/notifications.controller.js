function notificationsCtrl(ng, wi, aj, utils, $timeout){
	var $ = jQuery,
		serverController = "notification",
		actions = {
			getNotifications : "get_notifications.json"
		};
	
	var requestIds = {			
			user_request: {},
			event_request:{}			
	};

	var	time_formats = [
						    [60, 'just now', 1], // 60 
						    [120, '1 minute ago', '1 minute from now'], // 60*2
						    [3600, 'minutes', 60], // 60*60, 60
						    [7200, '1 hour ago', '1 hour from now'], // 60*60*2 
						    [86400, 'hours', 3600], // 60*60*24, 60*60 
						    [172800, 'yesterday', 'tomorrow'], // 60*60*24*2 
						    [604800, 'days', 86400], // 60*60*24*7, 60*60*24 
						    [1209600, 'last week', 'next week'], // 60*60*24*7*4*2 
						    [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7 
						    [4838400, 'last month', 'next month'], // 60*60*24*7*4*2 
						    [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4 
						    [58060800, 'last year', 'next year'], // 60*60*24*7*4*12*2 
						    [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12 
						    [5806080000, 'last century', 'next century'], // 60*60*24*7*4*12*100*2 
						    [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
						];

	ng.pretty_date = function( date_str ) {
	    var time = ('' + date_str).replace(/-/g, "/").replace(/[TZ]/g, " "),
	    	seconds = (new Date - new Date(time)) / 1000,
	    	token = 'ago',
	        list_choice = 1;

	    if (seconds < 0) {
	        seconds = Math.abs(seconds);
	        token = 'from now';
	        list_choice = 2;
	    }

	    var i = 0,
	        format;
	    while (format = time_formats[i++]) if (seconds < format[0]) {
	        if (typeof format[2] == 'string') return format[list_choice];
	        else return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
	    }
	    
	    return time;
	};

	ng.toggleNotificationsPopover = function(){
		ng.showNotifications = ng.showNotifications ? false : true;

		if(ng.general_unread > 0) {
			subtract_overall_unread( ng.general_unread, function(){
				ng.general_unread = 0;
				// set unread to read
				//var notification_ids = get_unread_notications(ng.general_request_array, 'general');
				get_unread_notications(ng.general_request_array, 'general');
				set_notification_as_read();
			});
		}
	};

	ng.changeTag = function( to ){

		if( to === "users") {
			ng.showGlobal = false;
			ng.showUserRequests = true;
			ng.showEventRequests = false;

			if( ng.user_unread > 0) {
				subtract_overall_unread( ng.user_unread, function(){
					ng.user_unread = 0;		
					// set unread to read
					//var notification_ids = get_unread_notications( ng.user_request_array, 'user_request');
					get_unread_notications( ng.user_request_array, 'user_request');
					set_notification_as_read();			
				});
			}

		} else if (to === "events"){
			ng.showGlobal = false;
			ng.showUserRequests = false;
			ng.showEventRequests = true;

			if( ng.event_unread > 0) {
				subtract_overall_unread( ng.event_unread, function(){
					ng.event_unread = 0;
					// set unread to read
					//var notification_ids = get_unread_notications( ng.event_request_array, 'event_request' );
					get_unread_notications( ng.event_request_array, 'event_request' );
					set_notification_as_read();
				});
			}
		} else {
			default_tabs();
		}

	};

	var default_tabs = function(){
		ng.showGlobal = true;
		ng.showUserRequests = false;
		ng.showEventRequests = false;
	};

	var subtract_overall_unread = function( sub_numb, callback ){
		ng.overall_unread-=sub_numb;

		$timeout(function(){
			callback();
		}, 1000);
	};

	var sum_overall_unread = function(){
		ng.overall_unread = ng.general_unread + ng.event_unread + ng.user_unread;	
	};

	var check_unread = function(){
		 var cats = ng.notifications;
		 
		 for(var i=0;i<cats.length;i++){	 	
		 	if(cats[i].name == "user_request")
		 		ng.user_unread = cats[i].unread_length;		 		
		 	else if(cats[i].name == "event_request")
		 		ng.event_unread = cats[i].unread_length;
		 	else
		 		ng.general_unread = cats[i].unread_length;
		 }

		 sum_overall_unread();
	};

	var get_unread_notications = function( nots_array, type ){
		var ids = [];
		for(var i=0;i<nots_array.length;i++){
			if(type === 'general'){
				if (nots_array[i].unread !== 0){
					if(nots_array[i].type === 'friend_request'){
						requestIds.user_request[i] = nots_array[i].id;
					} else if(nots_array[i].type === 'event_request'){
						requestIds.event_request[i] = nots_array[i].id;
					}
				}
			} else if(type === 'user_request'){
				if (nots_array[i].unread !== 0){
					requestIds.user_request[i] = nots_array[i].id;
				}
			} else {
				if (nots_array[i].unread !== 0){
					requestIds.event_request[i] = nots_array[i].id;
				}
			}
			
			//if (nots_array[i].unread !== 0){
			//	ids.push(nots_array[i].id);
			//}
		}
		
		//return ids;
	};

	var split_notification_cats = function(){

		for(var i=0;i<ng.notifications.length;i++){
			if(ng.notifications[i].name === "user_request")
				ng.user_request_array = ng.notifications[i].notifications;
			else if(ng.notifications[i].name === "event_request")
				ng.event_request_array = ng.notifications[i].notifications;
			else
				ng.general_request_array = ng.notifications[i].notifications;
		}

	};

	var set_notification_as_read = function(){
		console.log(requestIds);
		/*utils.AjaxCall(serverController, actions.getNotifications, nots_id_array, function(data, status){
			if(status == "success"){
				console.log(nots_id_array);
				console.log('The above notification ids has been updated from unread to read!');
			}
		});*/
		
		$.ajax({
		  	type: "POST",
		  	url: "/friends/update",
		  	data: requestIds
		}).done(function(data) {
			
		}).error(function(data){
			alert('Sorry! Some error has occurred.');
		});
	};
	
	var get_notifications = function(){
		// utils.AjaxCall('app', 'webroot/json/notification/' + actions.getNotifications, {}, ng, function(data, status){
		// 	if(status == "success"){
		// 		console.log(data.categories);
		// 		ng.notifications = data.categories;
		// 		check_unread();
		// 		split_notification_cats();
		// 	}
		// });
		var requestObj = {};
		utils.AjaxRequest('/users/getAllNotifications', 'POST', requestObj, function(data, status){
			if(status == "success"){
				//console.log(data.data.categories);
				ng.notifications = data.data.categories;
				check_unread();
				split_notification_cats();								
			}
		});
	};
	
	ng.accept = function(id, which){				
		$.ajax({
			  	type: "POST",
			  	url: "/"+ which +"/accept",
			  	data: { "id" : id }
			}).done(function(data) {
				data = $.parseJSON(data);
				if(data.data.error == 0){
					$('#ur_'+id).hide();
					 window.location.href = root + 'users/home';
				}
			}).error(function(data){
				alert('Sorry! ACCEPT REQUEST has been failed.');
			});
	};
	
	ng.decline = function(id, which){
		$.ajax({
		  	type: "POST",
		  	url: "/"+ which +"/decline",
		  	data: { "id" : id }
		}).done(function(data) {
			data = $.parseJSON(data);
			if(data.data.error == 0){
				$('#ur_'+id).hide();
			}
		}).error(function(data){
			alert('Sorry! DECLINE REQUEST has been failed.')
		});
	};

	ng.accept_event = function(id){				
		$.ajax({
			  	type: "POST",
			  	url: "/eventfriends/accept",
			  	data: { "id" : id }
			}).done(function(data) {
				data = $.parseJSON(data);
				if(data.data.error == 0){
					$('#evntreq_'+id).hide();
				}
			}).error(function(data){
				alert('Sorry! ACCEPT REQUEST has been failed.');
			});
	};
	
	ng.decline_event = function(id){
		$.ajax({
		  	type: "POST",
		  	url: "/eventfriends/decline",
		  	data: { "id" : id }
		}).done(function(data) {
			data = $.parseJSON(data);
			if(data.data.error == 0){
				$('#evntreq_'+id).hide();
			}
		}).error(function(data){
			alert('Sorry! DECLINE REQUEST has been failed.')
		});
	};
	
	var init = function(){
		default_tabs();
		get_notifications();
		ng.showNotifications = false;
	};

	init();
}
notificationsCtrl.$inject = ['$scope', '$window', '$http', 'BudsTimeUtils', '$timeout'];