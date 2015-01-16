function budstimeMainCtrl(ng, wi, aj, utils){
	
	var $ = jQuery,
		serverController = "user",
		actions = {
			getUsers : "get_users.json",
			getGroups : "get_groups.json",
			getFollowing : "get_following.json"
		};


	ng.openProfilePage = function( id ){
		console.log( id );
	};

	ng.getUserInfo = function( id, request ){

		var user = getUserById(id);
	
		if(user.length){
			user = user[0];
			return eval('user.'+ request) ? eval('user.'+ request) : '';
		}
	};

	var getUserById = function( id ){
		return $.grep(ng.users, function(e){ return e.id == id; });		
	};

	var getAllUsersInfo = function(){
		utils.AjaxCall(serverController, actions.getUsers, '', function(data, status){
			ng.users = data.users;
		});
	};

	var getUserGroups = function(){
		utils.AjaxCall('groups', actions.getGroups, '', function(data, status){
			if(status == "success"){
				ng.groups = data.groups;
				ng.group_select = data.groups[0].id;
			}
		});
	};

	ng.toggleCounting = function( checked ){
		checked ? ng.invite.count++ : ng.invite.count--;
	};

	var get_invite_list = function(){
		utils.AjaxCall(serverController, actions.getFollowing, true, function(data, status){
			if(status == "success"){
				ng.invited = data.following;
				ng.invite.count = 0;
			}
		});
	};

	var init = function(){

		// get all user data
		getAllUsersInfo();
		getUserGroups();
		get_invite_list();
		ng.invite = {};

	};

	init();
}
budstimeMainCtrl.$inject = ['$scope', '$window', '$http', 'BudsTimeUtils'];