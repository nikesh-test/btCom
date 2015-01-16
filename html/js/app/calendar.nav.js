bt_module.directive('btCalendarNavYear', function(BudsTimeUtils) {
    return {
        restrict:'A',
        templateUrl: 'partials/calendar-nav.html',
        link: function link(scope, element, attrs) {

         var  serverController = "calendar",
              actions = {
                getCalendarMonths : "get_list_of_months.json",
                getCalendarYears  : "get_list_of_years.json",
                getAllDays        : "get_list_of_days.json"
              };


          scope.set_current_year = function( year ){
            scope.current_year = year;
          };

          scope.set_current_day = function( day ){
            scope.current_day = day;
          };

          scope.set_current_month = function( month ){
            scope.current_month = month;
          };          

          scope.short_month = function( month_name ){
            return month_name.substring(0,3).toUpperCase();
          };

          scope.trigger_day = function( day ){
            scope.set_current_day( day );
            scope.showView('day');
            scope.updateEvents();
          };


          var request_setup = function(){
            return {
              day: scope.current_day,
              month: scope.current_month,
              year: scope.current_year
            };
          };
         
          var get_months = function(){
            BudsTimeUtils.AjaxCall(serverController, actions.getCalendarMonths, request_setup() , function(data, status){
              if(status == "success"){
                 scope.months = data.months;
              }
            });
          };

          var get_days = function(){
            BudsTimeUtils.AjaxCall(serverController, actions.getAllDays, request_setup(), function(data, status){
              if(status == "success"){
                  scope.days = data.days;
              }
            });
          };

          var get_years = function(){
            BudsTimeUtils.AjaxCall(serverController, actions.getCalendarYears, request_setup(), function(data, status){
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