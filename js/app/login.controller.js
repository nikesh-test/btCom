function LoginCtrl(ng, wi, aj, $location, utils){

	ng.forgotPwSubmit = function( email ){
		var requestObj = {
				email : email
			};
		utils.AjaxPost('users', 'forgotpwd', requestObj, ng, function(data, status){
			if(status === "success"){
				ng.showForgotSuccessMsg = true;
				ng.fg_email = "";
			}
		});
	};

    var init = function(){
		ng.btMessages = {
			timezoneIsDefault : true
		};
		ng.su_dateofbirth = "";
		ng.showForgotSuccessMsg = false;
    };
	init();
}

LoginCtrl.$inject = ['$scope', '$window', '$http', '$location', 'BudsTimeUtils'];
