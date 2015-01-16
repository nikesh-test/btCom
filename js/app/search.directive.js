bt_module.directive('btSearchDropdown', function(BudsTimeUtils, $http, $compile) {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {

          var dropdown_scope = element.closest('.dropdown'),
              serverController = "search",
              actions = {
                searchResultDropdown : "search_result_dropdown"
              };

          element.on('keypress', function(e){
            var code = e.which;
            if(code==13)e.preventDefault();
            if(code==32||code==13||code==188||code==186){
              dropdown_scope.removeClass('open');
            }
          });

          dropdown_scope.find('.dropdown-menu').on('click', function(){
            dropdown_scope.removeClass('open');
          });

          var renderResult = function( result ){
            scope.results = result.results;
            scope.results_length = result.results_length;

            // render search template                
            var  html = $http.get(root +'partials/search-dropdown.html').then(function(data){
                  html = $compile(data.data)(scope);
                  dropdown_scope.find('.dropdown-menu').html( html );
                  dropdown_scope.addClass('open');
            });            
          };
          
          var get_results = function( query ){
            var searchQuery = { 
              query  : query
            };
            BudsTimeUtils.AjaxCall(serverController, actions.searchResultDropdown, searchQuery ,scope, function(data, status){
              if(status == "success"){
                renderResult( data.data );
              }
            });
          };

          scope.$watch(attrs.btSearchDropdown, function(val){
              if(val && val.length > 2)
                get_results(val); 
              else
                dropdown_scope.removeClass('open');
          }, true);
        }
    }
});


bt_module.directive('btSearchResult', function(BudsTimeUtils, $http, $compile) {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {

          var  serverController = "search",
              actions = {
                searchResult : "search_result"
              };

          var closeSearchDropdown = function(){
            $('#searchform').removeClass('open');
          };

          var renderResult = function( result ){

            closeSearchDropdown();

            // init scope vars
            scope.events_search = result.events;
            scope.users_search = result.users;
            scope.results_length = result.results_length;
            scope.events_length = result.events_length;
            scope.users_length = result.users_length;
            scope.searchTerm = scope.searchQuery;
            scope.renderSearch = false;


            // render search template
            var  html = $http.get(root + 'partials/search-result.html').then(function(data){
                  html = $compile(data.data)(scope);
                  element.show().html(html).next('.col-wide').hide();
                  $('.col-narrow.pull-right').hide();
                  setTimeout(function(){
                    BudsTimeUtils.loading("body", "false");
                  }, 500);
            });
          };

          var destroyResult = function(){
              element.hide().html('').next('.col-wide').show();
              $('.col-narrow.pull-right').show();
              scope.searchQuery = "";
          };
        
          var get_results = function(){
            BudsTimeUtils.loading("body", "true");
            var requestObj = {
              query : scope.searchQuery 
            };
            BudsTimeUtils.AjaxCall(serverController, actions.searchResult, requestObj, scope, function(data, status){
              if(status == "success"){
                 renderResult( data.data );
              }
            });
          };

          scope.$watch(attrs.btSearchResult, function(val){
            if(val && val === true)
              get_results();
          }, true);

          scope.$watch(attrs.btSearchResultDestroy, function(val){
            if(val && val === true)
              destroyResult();
          }, true);

        }
    }
});


bt_module.directive('btSearchTimeResult', function(BudsTimeUtils, $http, $compile) {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {

          var serverController = "search",
              actions = {
                searchResult : "search_time_result"
              };

          var renderResult = function( result ){

            // init scope vars
            scope.events_search = result.events;
            scope.users_search = result.users;
            scope.renderTimeSearch = false;

            // render search template
            var   html = $http.get(root + 'partials/search-time-result.html').then(function(data){
                  html = $compile(data.data)(scope);
                  
                  element.html( html ).show();

                  // hide
                  $('#main-column').hide();
                  $('#left-column').hide();
                  $('#right-column').hide();


                  setTimeout(function(){
                    BudsTimeUtils.loading("body", "false");
                  }, 500);
            });
          };

          var destroyResult = function(){

              element.hide().html('');
              
              // show
              $('#main-column').show();
              $('#left-column').show();
              $('#right-column').show();
              
              //reset search time query
              scope.searchTime.dateFrom = "";
              scope.searchTime.timeFrom = "";
              scope.searchTime.dateTo = "";
              scope.searchTime.timeTo = "";
          };
        
          var get_results = function(){
            BudsTimeUtils.loading("body", "true");
            //console.log( scope.searchTime );
            BudsTimeUtils.AjaxCall(serverController, actions.searchResult, scope.searchTime , scope, function(data, status){
              if(status == "success"){
                console.log(data.data);
                 renderResult( data.data );
              }
            });
          };

          scope.$watch(attrs.btSearchTimeResult, function(val){
            if(val && val === true)
              get_results();
          }, true);

          scope.$watch(attrs.btSearchTimeResultDestroy, function(val){
            if(val && val === true)
              destroyResult();
          }, true);

        }
    }
});