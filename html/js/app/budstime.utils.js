bt_module.factory('BudsTimeUtils', function($rootScope, $http, $compile){
  
  var bt_setup = {
  	url : "http://localhost/budstime/html/json/",
  	messages : dialog_messages,
    popupElement: {}
  };

  bt_setup.AjaxCall = function(controller, action, params, callback){
   	var url = this.url + controller + "/" +  action;

    // angular ajax call
    $http({
        url: url,
        method: "GET",
        data: params
    }).success(function(data, status, headers, config) {
        callback(data, 'success');
    }).error(function(data, status, headers, config) {
        callback(data, 'error');
    });
  };


  bt_setup.getMonthName = function( index ){
    var monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ];
    return monthNames[index];
  };

  bt_setup.updateCurrentDate = function( date, scope ){
    var m = 0;
    date = date.split('/');
    m = (date[0]<10) ? parseInt(date[0].replace('0','')) : date[0];

    scope.current_day = parseInt(date[1]);
    scope.current_month = this.getMonthName(m-1);
    scope.current_year = parseInt(date[2]);
  };

  bt_setup.get_current_date = function(){
    var today = new Date(),
    dd = today.getDate(),
    m = today.getMonth(),
    yyyy = today.getFullYear();
   
    return {
      day:  dd,
      month: this.getMonthName(m),
      year: yyyy
    }
  };

  bt_setup.updateEvents = function( scope, init ){

    var day_request = {},
      serverController = "events",
      actions = {
        getDayEvents  : "get_day_response.json"
      };

    if(!init){
      day_request = {
        day: scope.current_day,
        month: scope.current_month,
        year: scope.current_year
      };
    } else {
      day_request = this.get_current_date();
      scope.current_day = day_request.day;
      scope.current_month = day_request.month;
      scope.current_year = day_request.year;
    }

    this.AjaxCall(serverController, actions.getDayEvents, day_request, function(data, status){
      if(status == "success"){
        scope.sections = data.data.sections;
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

  bt_setup.runPopUp = function( popup, options ) {
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
        }else{
          popup.off('hidden.current');
        }
      }, 200);      
  }

  var md_params = {
      message_id: 0,
      scope: '',
      tmpl: '',
      action: false,
      cancel: false
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

        bt_setup.runPopUp(popup);

    });
    
  };

  bt_setup.close = function(tmpl){
      var popup = bt_setup.getPopup(tmpl);
      if (popup)
          popup.modal('hide');
  }

  return bt_setup;

});