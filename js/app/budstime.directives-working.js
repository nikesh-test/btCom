var bt_module = angular.module('budstime', []);
var root = '/';

bt_module.directive('btUploadImage', function() {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {

            // Initialize the jQuery File Upload widget:
            element.fileupload({
                // Uncomment the following to send cross-domain cookies:
                //xhrFields: {withCredentials: true},
                url: 'server/php/'
            });

            // Enable iframe cross-domain access via redirect option:
            element.fileupload(
                'option',
                'redirect',
                window.location.href.replace(
                    /\/[^\/]*$/,
                    '/cors/result.html?%s'
                )
            );

            if (window.location.hostname === 'blueimp.github.com') {
                // Demo settings:
                element.fileupload('option', {
                    url: '//jquery-file-upload.appspot.com/',
                    maxFileSize: 5000000,
                    acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
                    process: [
                        {
                            action: 'load',
                            fileTypes: /^image\/(gif|jpeg|png)$/,
                            maxFileSize: 20000000 // 20MB
                        },
                        {
                            action: 'resize',
                            maxWidth: 1440,
                            maxHeight: 900
                        },
                        {
                            action: 'save'
                        }
                    ]
                });
                // Upload server status check for browsers with CORS support:
                if ($.support.cors) {
                    $.ajax({
                        url: '//jquery-file-upload.appspot.com/',
                        type: 'HEAD'
                    }).fail(function () {
                        $('<span class="alert alert-error"/>')
                            .text('Upload server currently unavailable - ' +
                                    new Date())
                            .appendTo('#fileupload');
                    });
                }
            } else {

                // Load existing files:
                // element.addClass('fileupload-processing');

                $.ajax({
                    // Uncomment the following to send cross-domain cookies:
                    //xhrFields: {withCredentials: true},
                    url: element.fileupload('option', 'url'),
                    dataType: 'json',
                    context: $('#fileupload')[0]
                }).done(function (result) {
                    $(this)
                        .removeClass('fileupload-processing')
                        .fileupload('option', 'done')
                        .call(this, null, {result: result});
                });
            }

        }
    }
});


bt_module.directive('btCarouselIt', function() {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {
         	scope.$watch(attrs.btCarouselIt, function( val ){
              
              var v = attrs.btCarouselVisible,
                  options = {
                    scroll: 3
                  };

           		if( val ){
                
                  if(v){
                    options.visible = parseInt(v, 10);
                    if( element.find('li').length > options.visible ) {
                      element.jcarousel( options );
                    }
                  } else {
                    element.jcarousel( options );
                  }  	          		
              }

          }, true);
        }
    }
});


bt_module.directive('btVhidden', function() {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {

          scope.$watch(attrs.btVhidden, function( val ){
              if(val){
                element.css('visibility', 'hidden');
              } else {
                element.css('visibility', 'visible');
              }
          }, true);

        }
    }
});


bt_module.directive('btIsFriend', function() {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {
          scope.$watch(attrs.btIsFriend, function(val){

              var f = element.find('.friend'),
                  nf = element.find('.not-friend'),
                  mousenterf = {},
                  mouseleavef = {};

              if(val === true){
                f.css('display', 'block');
                nf.css('display', 'none');

                mousenterf = function(){
                  f.find('.default').hide();
                  f.find('.hover').show();
                };
                
                mouseleavef = function(){
                  f.find('.hover').hide();
                  f.find('.default').show();
                };

              } 

              if(val === false) {
                f.css('display', 'none');
                nf.css('display', 'block');
               
                mousenterf = function(){
                  nf.find('.default').hide();
                  nf.find('.hover').show();
                };
                
                mouseleavef = function(){
                  nf.find('.hover').hide();
                  nf.find('.default').show();
                };
              }
              element.off('mouseenter.btnFriendAction').on('mouseenter.btnFriendAction', mousenterf);
              element.off('mouseleave.btnFriendAction').on('mouseleave.btnFriendAction', mouseleavef);

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

bt_module.directive('btOnEnter', function() {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {
          element.on('keypress', function(e){
            var code = e.which;
            if(code==13)e.preventDefault();
            if(code==32||code==13||code==188||code==186){
              scope.$apply(function(s) {
                s.$eval(attrs.btOnEnter);
              });
            } 
          });
        }
    }
});


bt_module.directive('btShowTab', function() {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {
          element.on('click', function(e){
              e.preventDefault();
              $(this).parent().addClass('current').siblings().removeClass('current')
              $( attrs.btShowTab ).show().siblings().hide();
          });
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

bt_module.directive('btEventInfo', function(BudsTimeUtils, $http, $compile) {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {

          var serverController = "events",
              actions = {
                eventInfoPage : "event_info_response"
              };

          var renderResult = function( result ){
            scope.eventDetail = result;

            // render search template                
            var html = $http.get(root +'partials/event-info.html').then(function(data){
                html = $compile(data.data)(scope);

                var event_info_modal = $('.event-info-modal');
                if(!event_info_modal.length)
                  event_info_modal = $('<div id="event-'+ scope.eventDetail.id +'" class="modal event-info-modal hide" tabindex="-1" role="dialog" aria-hidden="true"></div>');
                else
                  event_info_modal.attr('id', 'event-'+ scope.eventDetail.id);

                event_info_modal.html( html );
                event_info_modal.appendTo('body');
                $('#event-'+ scope.eventDetail.id).modal();
            });
          };
          
          var get_results = function( event_id ){
            BudsTimeUtils.AjaxCall(serverController, actions.eventInfoPage, event_id , scope, function(data, status){
              if(status == "success"){
                renderResult( data.data );
              }
            });
          };

          scope.$watch(attrs.btEventInfo, function(val){
              if(val){
                element.css('cursor', 'pointer').on('click', function(e){
                  e.preventDefault();
                  get_results( val );
                });
              }
          }, true);
         

         
        }
    }
});