bt_module.directive('btCalendarNavYear', function(BudsTimeUtils) {
    return {
        restrict : 'A',
        templateUrl: root + 'partials/calendar-nav.html',
        link: function link(scope, element, attrs) {

         var  serverController = "calendar",
              actions = {
                getCalendarMonths : "get_list_of_months",
                getCalendarYears  : "get_list_of_years",
                getAllDays        : "get_list_of_days"
              };


         scope.short_month = function( month_name ){
            return month_name.substring(0,3).toUpperCase();
          };

          scope.trigger_day = function( day ){
            scope.set_current_day( day );
            scope.showView('day');
            BudsTimeUtils.updateEvents(scope);
          };

          var request_setup = function(){
            return {
              day: scope.current_day,
              month: scope.current_month,
              year: scope.current_year
            };
          };
         
          var get_months = function(){
            BudsTimeUtils.AjaxCall(serverController, actions.getCalendarMonths, request_setup(), scope, function(data, status){
              if(status == "success"){
                 scope.months = data.data.months;
              }
            });
          };

          var get_days = function(){
            BudsTimeUtils.AjaxCall(serverController, actions.getAllDays, request_setup(), scope, function(data, status){
              if(status == "success"){
                  scope.days = data.data.days;
              }
            });
          };

          var get_years = function(){
            BudsTimeUtils.AjaxCall(serverController, actions.getCalendarYears, request_setup(), scope, function(data, status){
              if(status == "success"){
                 scope.years = data.years;
              }
            });
          };

          scope.$watch(attrs.btCalendarNavMonth, function(val, oldval){
            if(val !== oldval)
              get_days();
          });

                  
          scope.$watch(attrs.btCalendarNavYear, function(val, oldval){
            if(val !== oldval)
              get_months();
          });

          var init = function(){
            get_days();
            get_months();
            get_years();
          };

          init();          

        }
    }
});