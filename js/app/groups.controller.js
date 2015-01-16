function UserGroupsCtrl(ng, wi, aj, utils){

	var $ = jQuery,
		serverController = "groups",
		actions = {
			getGroups : "get_groups.json",
			addGroup : "add_group.json",
			removeGroup: "add_group.json", // (1) in this action I don't need a json as callback. I just check if the 'status' param, which comes from the callback function, is 'success' or 'error'.
			bindUserInGroup: "add_group.json", // the same case as (1)
			unbindUserInGroup: "add_group.json" // the same case as (1)
		};

	ng.addGroup = function(){
		var group_name = ng.group.name;		
		if(group_name !== ""){
			utils.AjaxCall(serverController, actions.addGroup, group_name, ng, function(data, status){
				if(status == "success"){
					ng.groups.push( data );
					groupFielReset();
				}
			});				
		}
	};

	ng.removeGroup = function(group){
		utils.OpenModal({
			message_id: 1660,
			tmpl: root + 'partials/modal.html',
			scope: ng, 
			action: function(){
				var requestObj = {
					group_id : group.id
				};

				utils.AjaxCall(serverController, actions.removeGroup, requestObj, ng, function(data, status){
					if (status == "success") {
						var index = ng.groups.indexOf(group);
						ng.groups.splice(index, 1);
					}
				});
			}
		});
	};

	ng.updateUserInGroupStatus = function(user, request){
		
		var group_slct_obj = getArrayObjById(ng.group_select, ng.groups),
			index = group_slct_obj.users.indexOf(user.id),
			params = { 
				group_id: group_slct_obj.id, 
				user_id: user.id 
			};

			if(request === "unbind") {
				utils.AjaxCall(serverController, actions.unbindUserInGroup, params, ng, function(data, status){
					if(status === "success"){
						group_slct_obj.users.splice(index,1);
					}
				});
			}
					
			if(request === "bind"){
				utils.AjaxCall(serverController, actions.bindUserInGroup, params, ng, function(data, status){
					if(status === "success"){
						group_slct_obj.users.push(user.id);
					}
				});
			}
	};

	ng.clearAddGroup = function(){
		if(ng.group) ng.group.name = "";
		ng.addGroupField = true;
	};

	ng.listAllFriends = function(){
		ng.listFriendsChecked = ng.listFriendsChecked ? false : true;
	};

	ng.updateModal = function(group){
		ng.group_select = group.id;
	};
	
	// helpers functions
	var groupFielReset = function(){
		ng.group = {name:'', users: [], id:0};
	};

	var getArrayObjById = function(id, array){
		var ind = $.grep(array, function(e){ return e.id == id; });
		return ind[0];
	};

	var getUserGroups = function(){
		var requestObj = {};
		utils.AjaxCall(serverController, actions.getGroups, requestObj, ng, function(data, status){
			if(status == "success"){
				ng.groups = data.groups;
				ng.group_select = data.groups[0].id;
			}
		});
	};

	var init = function(){
		// getUserGroups();
	};

	init();

}

UserGroupsCtrl.$inject = ['$scope', '$window', '$http', 'BudsTimeUtils'];