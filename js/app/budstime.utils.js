bt_module.factory('BudsTimeUtils', function($rootScope, $http, $compile){
  
  var bt_setup = {
  	url : root + "",
  	messages : dialog_messages,
    popupElement: {}
  };

  bt_setup.AjaxCall = function(controller, action, params, scope, callback){
   	var url = this.url + controller + "/" +  action;

    if( scope.friendID && (typeof params === "object") ){
      params.friendID = scope.friendID;
    }

    // angular ajax call
    jQuery.ajax({
        url: url,
        type: "GET",
        data: params,
        dataType : 'json',
        success : function(data, status, headers, config) {
          scope.$apply(function(){
            callback(data, 'success');
          });
      }
    });
  };

  bt_setup.AjaxPost = function(controller, action, params, scope, callback){
    var url = this.url + controller + "/" +  action;

    if( scope.friendID && (typeof params === "object") ){
      params.friendID = scope.friendID;
    }

    // angular ajax call
    jQuery.ajax({
        url: url,
        type: "POST",
        data: params,
        dataType : 'json',
        success : function(data, status, headers, config) {
          scope.$apply(function(){
            callback(data, 'success');
          });
      }
    });
  };

  
  
  bt_setup.AjaxRequest = function(_url, _method, _params, _callback){
	  
	    // angular ajax call
	    $http({
	        url: _url,
	        method: _method,
	        data: _params
	    }).success(function(data, status, headers, config) {
	    	if(typeof _callback === 'function'){
	    		_callback(data, 'success');
	    	}
	    }).error(function(data, status, headers, config) {
	    	if(typeof _callback === 'function'){
	    		_callback(data, 'error');
	    	}
	    });
  };


  bt_setup.getMonthName = function( index ){
    var monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];
    return monthNames[index];
  };

  bt_setup.getResetedEventInfo = function(){
    return { 
        eventname : '',
        eventdesc: '',
        eventfromdate: '',
        eventfromtime: '',
        eventtodate: '',
        eventtotime: '',
        eventlocation: '',
        eventprivacy: 'public',
        userlist: [],
        visiblefor: 0,
        shareonfb: false,
        youtubeurl: '',
        videos: [],
        images: [],
        action: 'add',
        showAditionalOpts: false
      }
  };

  bt_setup.getYoutubeIdByUrl = function(url){
      var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
      var match = url.match(regExp);
      
      if(match&&match[7].length==11) 
        return match[7];
      else
        return false;
  };

  bt_setup.formatSecondsAsTime = function(secs) {
      var hr = Math.floor(secs / 3600);
      var min = Math.floor((secs - (hr * 3600)) / 60);
      var sec = Math.floor(secs - (hr * 3600) - (min * 60));

      if (hr < 10) {
          hr = "0" + hr;
      }
      if (min < 10) {
          min = "0" + min;
      }
      if (sec < 10) {
          sec = "0" + sec;
      }
      if (hr) {
          hr = "00";
      }

      return hr + ':' + min + ':' + sec;
  };

  bt_setup.loading = function( element, show ){
    if( show === "true" )
      $(element).mask("loading...");
    else
      $(element).unmask();
  };  

  bt_setup.updateCurrentDate = function( date, scope ){
    var m = 0;
    date = date.split('/');
    m = (date[0]<10) ? parseInt(date[0].replace('0','')) : date[0];

    scope.current_day = parseInt(date[1]);
    scope.current_month = this.getMonthName(m-1);
    scope.current_year = parseInt(date[2]);
  };

  bt_setup.get_current_date = function( scope, callback ){

    var serverController = "users",
        actions = {
          getCurrentDate  : "get_current_date"
        };

    var requestObj = {};

      this.AjaxCall(serverController, actions.getCurrentDate, requestObj, scope, function(data, status){
      //this.AjaxCall('app', 'webroot/json/events/get_current_date.json', requestObj, scope, function(data, status){
      if(status == "success"){
        callback(data.data);
      }
    });
  };

  bt_setup.hideAllOverLayers = function(){
    var popovers = $('#main-content').find('.popover');
    popovers.each(function(){
      var _self = $(this);
      if(_self.css('display') === "block"){
        _self.fadeOut(100);
      }
    });
  };

  bt_setup.updateEvents = function( scope, init ){

    var day_request = {},
        serverController = "events",
        actions = {
          getDayEvents  : "get_events_day"
        };

    var requestObj = {
      day : scope.current_day,
      month : scope.current_month,
      year : scope.current_year
    };

    this.AjaxCall(serverController, actions.getDayEvents, requestObj, scope, function(data, status){
      if(status == "success"){
        $rootScope.sections = data.data.sections;
      }
    });   
  };

  bt_setup.get_upcoming_events = function( scope ){
    
    var requestObj = {},
        serverController = "events",
        actions = {
          getUpcomingEvents : "get_upcoming_events"
        };

    this.AjaxCall(serverController, actions.getUpcomingEvents, requestObj, scope, function(data, status){
      if(status == "success"){
        scope.upcoming_events = data.data.events;
      }
    });   

  };


  // Get the popup
  bt_setup.getPopup = function(tmpl, create){
      if (!bt_setup.popupElement[tmpl] && create)
      { 
          
          var tmpl_path = tmpl.split('/'),
              id = tmpl_path[tmpl_path.length-1].replace('.html', '');

          bt_setup.popupElement[tmpl] = $('<div id="'+ id +'" class="modal hide small-width" tabindex="-1" role="dialog" aria-hidden="true"></div>');
          bt_setup.popupElement[tmpl].appendTo('body');
      }
      return bt_setup.popupElement[tmpl];
  }


  bt_setup.runPopUp = function( popup, shown, options ) {
      setTimeout(function(){
        var opened_modal = $('.modal.in');
        
        if(opened_modal.length){
          opened_modal.modal('hide');
        }
        
        popup.modal(options);

        if( opened_modal.length ){
          popup.on('hidden.current', function() {
            opened_modal.modal('show');
          });
        } else {
          popup.off('hidden.current');
        }
        
        // trigger callback
        if(shown)
          shown();

      }, 200);      
  }

  var md_params = {
      message_id: 0,
      scope: '',
      tmpl: '',
      action: false,
      cancel: false,
      shown : false
  };

  bt_setup.OpenModal = function( md_params ){
  	
    var popup = this.getPopup(md_params.tmpl, true);

    if(this.messages[md_params.message_id])
      md_params.scope.md = this.messages[md_params.message_id];

    var html = $http.get(md_params.tmpl).then(function(data){
        
        html = $compile(data.data)(md_params.scope);

        popup.html(html);

        popup.find(".btn-confirm").click(function() {
            if(md_params.action) md_params.action();
            bt_setup.close(md_params.tmpl);
        });

        popup.find(".btn-cancel").click(function () {
            if(md_params.cancel) md_params.cancel();
            bt_setup.close(md_params.tmpl);
        });

        if( md_params.shown ){
          bt_setup.runPopUp(popup, md_params.shown);
        } else {
          bt_setup.runPopUp(popup);
        }

    });
    
  };

  bt_setup.close = function(tmpl){
    var popup = bt_setup.getPopup(tmpl);
    if (popup) {
      popup.modal('hide');
    }    
    $(tmpl).modal('hide');
  }

  bt_setup.openEventInfo = function( id, ng ){
    var div = angular.element( document.createElement('div') );
        div.attr({
          "bt-event-info" : id,
          "bt-open-on-load" : "true"
        });
    var el = $compile( div )( ng );
    angular.element(document.body).append(el);
  }

  return bt_setup;

});

bt_module.filter('dateToDay', function() {
  return function(input) {
    var dateArray = input.split("-");
    return dateArray[2];
  };
});

bt_module.filter('dateToMonthAbbr', function( BudsTimeUtils ) {
  return function(input) {
    var dateArray = input.split("-"),
        month = dateArray[1].replace("0", "");
    month = BudsTimeUtils.getMonthName( parseInt(month, 10) - 1 );
    month = month.substring(0, 3);
    return month;
  };
});