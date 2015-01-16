function ProfileCalendarCtrl(ng, wi, aj, utils){

	var $ = jQuery,
		serverController = "events",
		actions = {
			getDayEvents 	: "get_day_response.json",
			addComment 		: "add_comment.json",
			getAllComments 	: "get_all_comments.json",
			removeEvent		: "get_day_response.json"
		};
	

	ng.updateEvents = function(){
		utils.updateEvents(ng);
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
				
				console.log(e, friends_selected);
			}
		});
	};

	ng.removeEvent = function( section ){
		utils.OpenModal({
			message_id: 1576,
			scope: ng,
			tmpl: 'partials/modal.html',
			action: function(){
				utils.AjaxCall(serverController, actions.removeEvent, section.event.id, function(data, status){
					if(status == "success"){
						var index = ng.sections.indexOf(section);
						ng.sections.splice(index, 1);
					}
				});
			}
		});
	};

	ng.addComment = function(section){

			var update_comment = function( data ){
				var index = ng.sections.indexOf(section),
					event_comments = ng.sections[index].event.comments;
				
					event_comments.last_comments.push( data );
	            	event_comments.comments_length++; 
	            	section.newComment = "";
            };

            var params = {
            	comment: section.newComment,
            	event_id: section.event.id
            };

            utils.AjaxCall(serverController, actions.addComment, params, function(data, status){
				if(status == "success"){
					update_comment( data );
				}
			});            
	};

	ng.showAllComments = function( event_id ){
		
			utils.AjaxCall(serverController, actions.getAllComments, event_id, function(data, status){
				if(status == "success"){
					data = data.comments;					
					for(var i=data.length-1; i>=0; i--){
						ng.event.comments.last_comments.unshift(data[i]);
					}
					ng.event.comments.comments_left = 0;
				}
			});		
	}

	ng.returnEvent = function(section){
		ng.event = section.event;
	};

	ng.showEventDetails = function( id ){
		console.log( id );
	};

	ng.openGalleryItem = function( image ){
		console.log(image.id);
	};

	
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
		utils.updateEvents(ng, true);
	};

	init();

}
ProfileCalendarCtrl.$inject = ['$scope', '$window', '$http', 'BudsTimeUtils'];