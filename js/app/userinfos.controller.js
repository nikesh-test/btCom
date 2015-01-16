function userInfosCtrl(ng, wi, aj, utils){
	var $ = jQuery,
		serverController = "friends",
		actions = {
			getFollowing 	: "get_following",
			getFollowers 	: "get_followers.json"
		};


	ng.removeProfilePic = function(e){
		utils.OpenModal({
			message_id: 1575,
			tmpl: root + 'partials/modal.html',
			scope: ng, 
			action: function(){
				console.log('image removed successfully!');
				removeProfileImage();
			}
		});
	}
	
	ng.editProfilePic = function(e){
		utils.OpenModal({
			tmpl: root + 'users/editprofilepic',
			scope: ng, 
			action: function(){
				console.log('do image edit!');
				crop.cropImage();
			}
		});
	}

	ng.showsyncdiv = function(){
 
 		if($('#fbsync').is(':checked'))
			$('#fbsyncdiv').show();
		else
			$('#fbsyncdiv').hide();

	};
	
	ng.syncFBData = function(){
 
 		if($('#fbsyncevents').is(':checked')) {
			 
			$.ajax({
 			  url: root + 'users/fbimportevent',
  			  type: 'POST',
 		  }).done(function(response) {
 
 			  if(response){
  				  var _d = $.parseJSON(response);
 				  if(_d.success){
 					  if(parseInt(_d.data.code) == 0){
 						 $("#fbstatp").text(_d.data.message);
						 $("#fbstatp").fadeOut(5000);
  					  }
					  else {
 
					  $("#fbstatp").text(_d.data.message);
						 $("#fbstatp").fadeOut(5000);
 
				  }

 				  } 
 			  }
 		  }).fail(function(response) {
 			 $("#fbstatp").text(_d.data.message);
						 $("#fbstatp").fadeOut(5000);
 		  });	
		}
		 
		if($('#fbsyncfriends').is(':checked')) {
			 
			$.ajax({
 			  url: root + 'users/fbimportfriends',
  			  type: 'POST',
 		  }).done(function(response) {
 
 			  if(response){
  				  var _d = $.parseJSON(response);
				 
 				  if(_d.success){
					
 					  if(parseInt(_d.data.code) == 0){
						  
						  $.ajax({
							  url: root + 'users/syncedon',
							  type: 'POST',
						  }).done(function(dresponse) {
							  
							 var _sd = $.parseJSON(dresponse); 
							 
							  if(parseInt(_sd.data.code) == 0){
								  
								  $("#lastSyncP").text(_sd.data.message);
								  
							  }
							 
						  });
 						 $("#fbstatp").text(_d.data.message);
						 $("#fbstatp").fadeOut(5000);
  					  }
					  else {
 					  
					 	$("#fbstatp").text(_d.data.message);
						 $("#fbstatp").fadeOut(5000);
 
				  }

 				  } 
 			  }
 		  }).fail(function(response) {
			alert(_d.data.message);
	  		$("#fbstatp").text(_d.data.message);
			$("#fbstatp").fadeOut(5000);
 		  });	
			
		}
		
	};
	
	
	var removeProfileImage = function(){
		var requestObj = {};
		// utils.AjaxRequest('/users/removePic', 'POST', '', function(data, status){
		utils.AjaxPost("users", "removePic", requestObj, ng, function(data, status){		
			
			//checking status
			if(status == 'success'){
				if(data){
					data = data.data;
					$("#profilePhoto").attr("src", "/user_assets/" + data.name + "?timestamp=" + new Date().getTime());
					$('#liRemovePic').hide();
				}
			} else if(status == 'error'){
				
			}
		});
	};
	
	

	var get_following = function(){
		
		var requestObj = {};
		var pathname = window.location.pathname;
		var actionname =  pathname.split('/')[2];
		
		if (actionname == 'profile'){
			
			requestObj = {
				"id" : pathname.split('/')[3]
			};
		}
		// utils.AjaxRequest('/friends/getAllFriends', 'POST', '', function(data, status){
		utils.AjaxPost("friends", "getAllFriends", requestObj, ng, function(data, status){			
			//checking status
			if(status == 'success'){
				if(data){
					ng.following = data.data.following;
				}
			} else if(status == 'error'){
				alert('Some error has occurred while fetching friends!')
			}
		});

	};

	/*var get_followers = function(){

		utils.AjaxCall(serverController, actions.getFollowers, 'true', function(data, status){
			if(status == "success"){
				ng.followers = data.followers;
			}
		});

	};*/
	
	var init = function(){

		get_following();
		//get_followers();
	};

	init();


}
userInfosCtrl.$inject = ['$scope', '$window', '$http', 'BudsTimeUtils'];