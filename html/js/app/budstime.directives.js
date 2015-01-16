var bt_module = angular.module('budstime', []);

bt_module.directive('crouselIt', function() {
    return {
        restrict:'C',
        link: function link(scope, element, attrs) {
         	scope.$watch("event.gallery", function(){
           		if(scope.event.gallery.length > 6){
  	          		element.jcarousel({
  			        	visible: 6,
  			        	scroll: 3
  			       	});
  		    	  }
          }, true);
        }
    }
});

bt_module.directive('btAutofocus', function() {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {
          scope.$watch(attrs.btAutofocus, function(val){
              if(!val)
                element.trigger('focus');
          }, true);
        }
    }
});

bt_module.directive('btUserToggle', function() {
    return {
        restrict:'C',
        link: function link(scope, element, attrs) {

          var update_attending = function(){
              var group = $.grep(scope.groups, function(e){ return e.id == scope.group_select; });
              if(group.length){
                 scope.attending = group[0].users.indexOf(scope.user.id) !== -1 ? true : false;
              }
          };

          scope.$watch(attrs.btGroups, function( val ){
              if( val ){
                update_attending();
              }
          }, true);

          scope.$watch(attrs.btSlctdGroup, function( val ){
            if( val ){
              update_attending();
            }
          }, true);

        }
    }
});



bt_module.directive('btToggleFade', function() {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {
            var notification_box = $('#notification-popover');
            scope.$watch(attrs.btToggleFade, function(val){
                if(val){
                  notification_box.fadeIn(500);
                }else{
                  notification_box.fadeOut(200);
                }
            }, true);
        }
    }
});

bt_module.directive('btFadeOut', function() {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {
            scope.$watch(attrs.btFadeOut, function(val){
                val ? element.fadeOut(400) : '';
            }, true);
        }
    }
});


bt_module.directive('btSlideToggle', function() {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {
            scope.$watch(attrs.btSlideToggle, function(val){
                val ? element.slideDown(400) : element.slideUp(400);
            }, true);
        }
    }
});

bt_module.directive('btToggleVal', function() {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {
            scope.$watch(attrs.btToggleVal, function(val){
                val ? element.slideDown(400) : element.slideUp(400);
            }, true);
        }
    }
});


bt_module.directive('tooltipIt', function() {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {

          if( attrs.tooltipIt ){
            scope.$watch(attrs.tooltipIt, function(){
            	element.tooltip();
            }, true);
          } else {
            element.tooltip();
          }

        }
    }
});

bt_module.directive('btYoutubePreview', function() {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {

          var youtube_parser = function(url){
              var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
              var match = url.match(regExp);
              
              if(match&&match[7].length==11) 
                return match[7] ;
              else
                return false;
          };

          scope.$watch(attrs.btYoutubePreview, function( val ){
              if(val){
                var v_id = youtube_parser( val );
                src = v_id ? 'http://img.youtube.com/vi/'+v_id+'/1.jpg' : '/';
                element.attr('src', src );
              }
          }, true);

        }
    }
});



bt_module.directive('btScrollIt', function() {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {
          var interval;

          var do_scroll = function(){
              var pane, api;
              if(!api){
                pane = element;
                element.jScrollPane({
                    scrollbarWidth: 6,
                    mouseWheelSpeed: 100,
                    animateDuration: 600,
                    animateEase: 'swing'
                });

                api = pane.data('jsp');
              }

              interval = setInterval(function(){
                  api.reinitialise();
              }, 500);
          };

          if(attrs.btModal){
           
            $(attrs.btModal).on('shown', function(){
                do_scroll();
            });

            $(attrs.btModal).on('hide', function(){
                clearInterval(interval);
            });
          }else{            
            scope.$watch(attrs.btScrollShown, function(val){
                val ? do_scroll() : clearInterval(interval);
            }, true);
          }
          
        }
    }
});

bt_module.directive('onEnter', function() {
    return function(scope, element, attrs) {

	        element.bind("keydown keypress", function(e) {
	        	var code = (e.keyCode ? e.keyCode : e.which);
	            if(code === 13 && !e.shiftKey) {
	                scope.$apply(function(){
	                    scope.$eval(attrs.onEnter);
	                });
	                e.preventDefault();
	            }
	        });
    };
});

bt_module.directive('onEscape', function() {
    return function(scope, element, attrs) {

	        element.bind("keydown keypress", function(e) {
	        	var code = (e.keyCode ? e.keyCode : e.which);
	            if(code === 27) { // escape
	                scope.$apply(function(){
	                    scope.$eval(attrs.onEscape);
	                });
	                e.preventDefault();
	            }
	        });
    };
});

bt_module.directive('autoResize', function() {
    return {
        restrict:'C',
        link: function link(scope, element, attrs) {
			     element.autoresize();
        }
    }
});


bt_module.directive('datepicker', function() {
    return {
        restrict: 'C',
        link: function link(scope, element, attrs, ctrl) {
                element.mask("99/99/9999");

                element.datepicker();
        }
    }
});

bt_module.directive('btTimepicker', function($compile) {
    return {
        restrict:'A',
        require: 'ngModel',
        compile: function(element, attrs) {
            var outer_html =  $('<div>').append( element.removeAttr('ng-model').removeAttr('bt-timepicker').clone() ).html();
            outer_html = outer_html.replace('<input ', '');
            element.replaceWith( '<input ng-model="' + attrs.btTimepicker +'" ' + outer_html );

            return function(scope, element, attrs, ngModel) {
                
                $compile($(element))(scope);
                
                var time = "",
                    options = {
                      showMeridian: false,
                      onSelect: function(dateText, inst){
                        console.log( dateText );
                      }
                    };

                var today = new Date(),
                    hours = today.getHours(),
                    minutes = today.getMinutes(),
                    minutes = (minutes<10?'0':'') + minutes;

                if(attrs.setCurrentTime == "to") {
                  hours<23 ? (hours+= 1) : minutes = 59;
                }
                
                time = hours + ':' + minutes;
                options.defaultTime = time;

                // init values
                ngModel.$setViewValue( time );
                element.mask("99:99");
                
                element.timepicker( options );

                element.on('change', function() {
                  ngModel.$setViewValue( $(this).val() );
                });

            }
        }
    }
});


bt_module.directive('setCurrentDate', function($compile) {
    return {
        restrict:'A',
        require: 'ngModel',
        compile: function(element, attrs) {
            var outer_html =  $('<div>').append( element.removeAttr('ng-model').removeAttr('data-set-current-date').clone() ).html();
            outer_html = outer_html.replace('<input ', '');
            element.replaceWith( '<input ng-model="' + attrs.setCurrentDate +'" ' + outer_html );

            return function(scope, element, attrs, ngModel) {
                
                $compile($(element))(scope);
                
                var getCurrentDate = function(){
                  var today = new Date(),
                  dd = today.getDate(),
                  mm = today.getMonth()+1,
                  yyyy = today.getFullYear();

                  if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} 

                  return  mm+'/'+dd+'/'+yyyy;
                };

                ngModel.$setViewValue( getCurrentDate() );

                // bind the date change
                element.on('changeDate', function(ev) {
                      var newDate = new Date(ev.date),
                          dd = newDate.getDate(),
                          mm = newDate.getMonth()+1,
                          yyyy = newDate.getFullYear();
                      dd = (dd<10) ? '0'+dd : ''+dd;
                      mm = (mm<10) ? '0'+mm : ''+mm;

                    ngModel.$setViewValue(  mm+'/'+dd+'/'+yyyy );
                });
                

            };
        }
    }
});

bt_module.directive('btRegexValidate', function() {
    return {
        // restrict to an attribute type.
        restrict: 'A',
        
        // element must have ng-model attribute.
        require: 'ngModel',
        
        // scope = the parent scope
        // elem = the element the directive is on
        // attr = a dictionary of attributes on the element
        // ctrl = the controller for ngModel.
        link: function(scope, elem, attr, ctrl) {
            
            //get the regex flags from the regex-validate-flags="" attribute (optional)
            var flags = attr.regexValidateFlags || '';
            
            //create the regex obj.
            var regex = new RegExp(attr.btRegexValidate, flags);
            
            //test and set the INITIAL validity for btRegexValidate.
            ctrl.$setValidity('btRegexValidate', regex.test(ctrl.$viewValue));
            
            //add a parser that will process each time the value is 
            // parsed into the model when the user updates it.
            ctrl.$parsers.unshift(function(value) {
                
                //test ans set the validity after update.
                ctrl.$setValidity('btRegexValidate', regex.test(value));
                
                //return the value, this is important or you will not see the model 
                // updating, because the parser is returning nothing.
                return value;
            });
        }
    };
});

// bt_module.directive('inviteModal', function() {
//     return {
//         restrict:'A',
//         scope: '@inviteModal',
//         controller: 'inviteFriendsCtrl',
//         link: function link(scope, element, attrs, ctrl) {
//           attrs.$observe('inviteModal', function (val) {
//               $(attrs.href).find('.event-name').html( val ); // needs refactoring
//           });          

//         }
//     }
// });