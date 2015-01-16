function userInfosCtrl(ng, wi, aj, utils){
	var $ = jQuery,
		serverController = "user",
		actions = {
			getFollowing 	: "get_following.json",
			getFollowers 	: "get_followers.json"
		};


	ng.removeProfilePic = function(){
		utils.OpenModal({
			message_id: 1575,
			tmpl: 'partials/modal.html',
			scope: ng, 
			action: function(){
				console.log('image removed successfully!');
			}
		});
	}

	var get_following = function(){

		utils.AjaxCall(serverController, actions.getFollowing, true, function(data, status){
			if(status == "success"){
				ng.following = data.following;
			}
		});

	};

	var get_followers = function(){

		utils.AjaxCall(serverController, actions.getFollowers, true, function(data, status){
			if(status == "success"){
				ng.followers = data.followers;
			}
		});

	};
	
	var init = function(){

		get_following();
		get_followers();
	};

	init();


}
userInfosCtrl.$inject = ['$scope', '$window', '$http', 'BudsTimeUtils'];