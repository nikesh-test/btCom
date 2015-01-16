var bt_module = angular.module('budstime', []);
var root = '/';

bt_module.directive('btUploadImage', function(BudsTimeUtils) {
    return {
        restrict: 'A',
        link: function link(scope, element, attrs, $eval) {

          var addUploadEvent = function( event ){
              var event_id = event.id;

              element.fileupload({
                  url : '/events/image_upload_response?id=' + event_id,
                  dataType: 'json',
                  done: function (e, data) {
                      scope.$apply(function(){
                          var files = data.result.data.files;
                          if(event.images.length > 0) {
                            event.images = files.concat( event.images );
                          } else {
                            event.images = files; 
                          }                         
                      });
                  },
                  progressall: function (e, data) {
                      var progress = parseInt(data.loaded / data.total * 100, 10),
                          progress_el = $( attrs.btUploadProgress );

                      progress_el.show().find('.bar').css(
                          'width',
                          progress + '%'
                      );

                      if( progress === 100 ){
                        setTimeout(function(){
                          progress_el.fadeOut('slow');
                        }, 1500);
                      }
                  }
              });          
          }


          scope.$watch(attrs.btUploadImage, function( val ){
              if( val ){
                addUploadEvent( val );
              }
          }, true);

        }
    }
});


bt_module.directive('btShowImage', function(BudsTimeUtils) {
  return {
    restrict:'A',
    link: function link(scope, element, attrs) {

      scope.$watch(attrs.btShowImage, function(val){
          if(val){ // val == event object
            
            var imgIndex = parseInt(attrs.btIndex, 10);

            element.addClass('pointer').on('click', function(e){
              e.preventDefault();
              
              scope.gallery = {};
              scope.gallery.currentImage = val.images[imgIndex].src||val.images[imgIndex].thumbnail_url;
              scope.gallery.currentIndex = imgIndex;
              scope.gallery.title = val.eventname||val.title;
              scope.gallery.images = val.images;
              
              scope.setCurrentImg = function( index ){
                scope.gallery.currentImage = val.images[index].src||val.images[index].thumbnail_url;
                scope.gallery.currentIndex = index;
              };

              BudsTimeUtils.OpenModal({
                  scope: scope, 
                  tmpl: root + 'partials/image-gallery.html'
              });

            });  
          }
      }, true);
      
    }
  }
});

bt_module.directive('btUploadPreview', function($http, $compile, BudsTimeUtils) {
  return {
    restrict:'A',
    link: function link(scope, element, attrs) {

      var serverController = "events",
              actions = {
                removePhoto : "delete_photo"
              };

      var renderResult = function( event ){

        scope.removeImageOnPreview = function( index, event_id, image_id ){
          var requestObj = {
            event_id : event_id,
            image_id : image_id
          };

          BudsTimeUtils.AjaxCall(serverController, actions.removePhoto, requestObj, scope, function(data, status){
            if(status == "success"){
              event["images"].splice(index, 1);
            }
          });
        };

        scope.event = event;

        element.html('');
        var html = $http.get(root +'partials/upload-image-preview.html').then(function(data){
            html = $compile(data.data)(scope);
            element.html( html );                
        });

      };

      scope.$watch(attrs.btUploadPreview, function(val){
          if(val){ // val == event object
            renderResult( val );
          }
      }, true);

    }
  }
});


bt_module.directive('btEditEvent', function(BudsTimeUtils, $http, $compile) {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {

          var serverController = "events",
              actions = {
                editEvent : "edit_event",
                removeEvent : "remove_event",
                updateEvent : "update_event"
              };

          var renderResult = function( result ){
            scope.Event = result.event[0];
            scope.renderEditEvent = 0;

            // render search template
            var   html = $http.get(root + 'partials/edit-event.html').then(function(data){
                  html = $compile(data.data)(scope);
                  
                  element.html( html ).show();

                  // hide
                  $('#main-column').hide();
                  $('#right-column').hide();

                  setTimeout(function(){
                    BudsTimeUtils.loading("body", "false");
                  }, 500);
            });
          };

          scope.destroyEditEvent = function(){

              scope.Event = BudsTimeUtils.getResetedEventInfo();

              element.hide().html('');
              $('#main-column').show();
              $('#right-column').show();
          };

          
          scope.editEventSave = function( eventId ){
            BudsTimeUtils.AjaxCall(serverController, actions.updateEvent, scope.Event, scope, function(data, status){
            // BudsTimeUtils.AjaxCall('app', 'webroot/json/events/edit_event.json', scope.Event, scope, function(data, status){
              if(status == "success"){
                scope.updateSuccess = true;
              }
            });
          };

          var get_results = function( eventId ){
            BudsTimeUtils.loading("body", "true");
            scope.updateSuccess = false;

            var requestObj = {
              event_id : eventId
            }; 
           
            BudsTimeUtils.AjaxCall('events', 'edit_event', requestObj, scope, function(data, status){
            //BudsTimeUtils.AjaxCall('app', 'webroot/json/events/edit_event.json', requestObj, scope, function(data, status){
              if(status == "success"){
                 renderResult( data.data );
              }
            });
          };

          scope.$watch(attrs.btEditEvent, function(val){
            if(typeof val !== "undefined" && val > 0) {
              var eventId = val;              
              get_results( eventId );
            }
          }, true);

        }
    }
});

bt_module.directive('btCarouselIt', function() {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {
          scope.$watch(attrs.btCarouselIt, function( val ){
              
              var visibleLength = attrs.btCarouselVisible,
                  options = {
                    scroll: 3,
                    itemFallbackDimension: 55
                  };

              if( val && val.length>0){
                  if( visibleLength ){
                    options.visible = parseInt(visibleLength, 10);
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

bt_module.directive('btOpenProfile', function() {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {

          scope.$watch(attrs.btOpenProfile, function( val ){
              if( val ) {
                element.off('click.openProfile').on('click.openProfile', function(){
                  window.location.href = root + 'friends/profile/' + val;
                });
              }
          }, true);

        }
    }
});

bt_module.directive('btZelectTimezone', function() {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {

          var tz = jstz.determine(),
              response_text = "";
          if (typeof (tz) !== 'undefined') {
              response_text = tz.name(); 
              element.find('option[value="'+ response_text + '"]').attr("selected", "selected");
          }

          element.zelect({
            initial : response_text
          });

        }
    }
});

bt_module.directive('btLoginForm', function() {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {
            element.find(".fogot-link").on("click", function(e){
              e.preventDefault();
              element.find(".login-form-box").hide();
              element.find(".forgot-password-box").fadeIn();
            });

            element.find(".ng-close-forgot").on("click", function(e){
              e.preventDefault();
              element.find(".forgot-password-box").hide();
              element.find(".login-form-box").fadeIn();
            });
        }
    }
});

bt_module.directive('btHomeSlider', function() {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {

          var pagerNav = attrs.btHomeSlider,
              total_slides = element.find('.item').length;
          if(total_slides > 1) {
            element.cycle({
              fx:     'fade',
              speed:   1500,
              timeout: 3500,
              pager:  pagerNav, 
              pagerAnchorBuilder: function(idx, slide) { 
                  return pagerNav + ' li:eq(' + idx + ')'; 
              }
            });
          }
        }
    }
});


bt_module.directive('pwCheck', function () {
  return {
    require: 'ngModel',
    link: function (scope, elem, attrs, ctrl) {
      var firstPassword = '#' + attrs.pwCheck;
      elem.add(firstPassword).on('keyup', function () {
        scope.$apply(function () {
          var v = elem.val()===$(firstPassword).val();
          scope.btMessages.showPwNotMatch = !v;
        });
      });
    }
  }
});

bt_module.directive('btSignUpForm', function() {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {

          // scope.btMessages.showFirstStepErros = false;

          var firstStep = element.find("#sign-up-first-setp"),
              secondStep = element.find("#sign-up-second-setp");
          
          element.find("#bt-ok").on("click", function(){
            if(firstStep.find(".ng-invalid").length || scope.btMessages.showPwNotMatch==true){
              scope.$apply(function(){
                scope.btMessages.showFirstStepErros = true;
              });
            } else {
              firstStep.hide();
              secondStep.fadeIn();
            }
          });

          element.find(".back-button").on("click", function(e){
            e.preventDefault();
            secondStep.hide();
            firstStep.fadeIn();
          });

          scope.submitForm = function( valid ){
            if(valid){
              $("#sign-up-form").submit();
            }
          };
        }
    }
});

bt_module.directive('btBody', function(BudsTimeUtils) {
    return function(scope, element, attrs) {
      var hash = window.location.hash,
          importAction = function( requestObj ){

            var urlappend = '',
                root = '/';

            urlappend += '?func=1';

            if(requestObj.friends){
              urlappend += '&fbf=1';
            }
            if(requestObj.events){
             urlappend +='&fbe=1';
            }

            if(requestObj.events || requestObj.friends){
              window.location.href = root + 'users/goFBLogin' + urlappend;
            } else {
             alert('Please select Any option to import');
            }

          };

      if( hash === "#/open-facebook-import" ){
        scope.importfb = {};

        BudsTimeUtils.OpenModal({
            scope: scope, 
            tmpl: root + 'partials/import-fb.html',
            action: function(){
              importAction(scope.importfb);
            }
        });
      }  

    };
});

bt_module.directive('btNavVideo', function() {
    return {
        restrict: 'A',
        link: function link(scope, element, attrs) {

          var resetToFirst = function( listWrapper, currentVideoNumb ){
              listWrapper.find('.current').removeClass('current');
              listWrapper.find('.video-box').first().show().addClass('current');
              currentVideoNumb.html("1");
          };

          var initVideoNav = function( vLength ){

           var listWrapper = element.find('.videos-list'),
           currentVideoNumb = element.find('.current-video-numb');

           
            resetToFirst(listWrapper, currentVideoNumb);

            element.find('.video-preview-nav-left').off('click.videoPreviewL').on('click.videoPreviewL', function(){
              var currentItem = listWrapper.find('.current');
              if( currentItem.prev('.video-box').length ){
                currentItem.removeClass('current').hide().prev('.video-box').show().addClass('current');
              }
              var currentIndex = listWrapper.find('.current').index();
              currentVideoNumb.html( parseInt(currentIndex, 10) + 1 );
            });

            element.find('.video-preview-nav-right').off('click.videoPreviewR').on('click.videoPreviewR', function(){
              var currentItem = listWrapper.find('.current');
              if( currentItem.next('.video-box').length ){
                currentItem.removeClass('current').hide().next('.video-box').show().addClass('current');
              }
              var currentIndex = listWrapper.find('.current').index();
              currentVideoNumb.html( parseInt(currentIndex, 10) + 1 );
            });  
    
          }; 

          scope.$watch(attrs.btNavVideo, function( val ){
              if(val){
                initVideoNav( val );
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

bt_module.directive('btToggleVideoField', function() {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {
          element.on('click', function(e){
            e.preventDefault();
            $(this).closest('.ng-video-context').find(attrs.btToggleVideoField).toggle();
          })
        }
    }
});


bt_module.directive('btOnEnter', function() {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {
          element.on('keypress', function(e){
            var code = e.which;
            if(code==13) { e.preventDefault(); }
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



bt_module.directive('btFadeToggle', function() {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {
          var initFadeDirective = function(){
              var dropdown = $( attrs.btFadeToggle );
              dropdown.hide();
              element.on('click', function(){
                if(dropdown.css('display') === "none"){                
                  dropdown.fadeIn(500);
                } else {
                  dropdown.fadeOut(200);
                }
              });
          };

          initFadeDirective();
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

bt_module.directive('btToggle', function() {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {
          var init = function(){
              var dropdown = $( attrs.btToggle );
              dropdown.hide();
              element.on('click', function(){
                if(dropdown.css('display') === "none"){                
                  dropdown.show();
                } else {
                  dropdown.hide();
                }
              });
          };

          init();
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

bt_module.directive('btYoutubePreview', function(BudsTimeUtils) {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {

          scope.$watch(attrs.btYoutubePreview, function( val ){
              if(val){
                var v_id = BudsTimeUtils.getYoutubeIdByUrl( val );
                src = v_id ? 'http://img.youtube.com/vi/'+v_id+'/1.jpg' : '/';
                element.attr('src', src );
              }
          }, true);

        }
    }
});

bt_module.directive('btYoutubeClick', function(BudsTimeUtils) {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {
          scope.youtubeplay = {};

          scope.$watch(attrs.btYoutubeClick, function( val ){
              if(val){
                element.on('click', function(e){
                  var yt_video_id = BudsTimeUtils.getYoutubeIdByUrl( val );
                  scope.youtubeplay.title = "Video";                  
                  scope.youtubeplay.url = "http://www.youtube.com/embed/" + yt_video_id;

                  if( yt_video_id ){
                    $.getJSON('http://gdata.youtube.com/feeds/api/videos/'+yt_video_id+'?v=2&alt=jsonc', function(data,status,xhr){
                        var yt_response = data.data;
                        scope.youtubeplay.title = yt_response.title;
                    }); 
                  }
                  
                  BudsTimeUtils.OpenModal({
                    scope: scope, 
                    tmpl: root + 'partials/youtube-player.html'
                  });

                });
              }
          }, true);          
        }
    }
});


bt_module.directive('btYoutubeInfo', function(BudsTimeUtils) {
    return {
        restrict:'A',
        template: '<strong class="title">{{yt_title}}</strong>' +
                  '<span class="duration">{{yt_duration}}</span>',
        link: function link(scope, element, attrs) {

          var youtubeInfoInit = function( video_url ){
            var yt_video_id = BudsTimeUtils.getYoutubeIdByUrl( video_url );
            if( yt_video_id ){
              $.getJSON('http://gdata.youtube.com/feeds/api/videos/'+yt_video_id+'?v=2&alt=jsonc', function(data,status,xhr){
                  var yt_response = data.data;
                  scope.$apply(function(){
                    scope.yt_title = yt_response.title;
                    scope.yt_duration = BudsTimeUtils.formatSecondsAsTime(yt_response.duration);
                  });
              }); 
            }
          };

          scope.$watch(attrs.btYoutubeInfo, function( val ){
              if(val){
                youtubeInfoInit( val );                
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

          if (attrs.btModal) {
            $(attrs.btModal).on('shown', function(){
                do_scroll();
            });

            $(attrs.btModal).on('hide', function(){
                clearInterval(interval);
            });
          } else {            
            scope.$watch(attrs.btScrollShown, function(val){
                if(val){ 
                  setTimeout(function(){
                    do_scroll();
                  }, 100);                  
                } else { 
                  clearInterval(interval);
                }

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


bt_module.directive('btMask', function() {
    return {
        restrict: 'A',
        link: function link(scope, element, attrs) {
          element.mask( attrs.btMask );
          element.on("keypress", function(){
            var date = this.value;
            scope.$apply(function(){
              scope[attrs.ngModel] = date;
            });
          });
        }
    }
});

bt_module.directive('datepicker', function() {
    return {
        restrict: 'C',
        link: function link(scope, element, attrs) {
                var options = {};
                element.mask("99/99/9999");
                if(element.hasClass('ng-date-to')){
                  options = {
                    onRender: function(date) {
                      console.log(scope.searchTime)
                      // console.log(date.valueOf(), checkin.date.valueOf());
                      // return date.valueOf() <= checkin.date.valueOf() ? 'disabled' : '';
                      return '';
                    }
                  };
                } 
                element.datepicker( options );
        }
    }
});
                  

bt_module.directive('btOpenModal', function(BudsTimeUtils) {
    return {
        restrict: 'A',
        link: function link(scope, element, attrs) {
          element.on('click', function(e){
            BudsTimeUtils.OpenModal({
              scope: scope, 
              tmpl: root + 'partials/' + attrs.btOpenModal
            });
          });
        }
    }
});

bt_module.directive('btMakePlanText', function(BudsTimeUtils) {
    return {
        restrict: 'A',
        link: function link(scope, element, attrs) {

          var convertTo24Hour = function( time ){
            var timeArray = time.split(" "),
                hours = parseInt(timeArray[0].substr(0, 2), 10),
                timeAmPm = timeArray[1];

            if(timeAmPm == "am" && hours == 12) {
                time = timeArray[0].replace('12', '00');
            }
            if(timeAmPm == "pm" && hours < 12) {
                time = timeArray[0].replace(hours, (hours + 12));
            }

            time = time.replace(/(am|pm)/, '');
            time = $.trim(time);

            return time;
          };

          var months = {
            January: "01",
            February: "02",
            March : "03",
            April : "04",
            May : "05",
            June : "06",
            July : "07",
            August : "08",
            September : "09",
            October : "10",
            November : "11",
            December : "12"
          };

          var currentHourDelay = function( hour ){
            hour = parseInt(hour, 10);
            if(hour == 0){
              hour = 23;
            } else {
              hour -= 1;
              if (hour < 10) {
                hour = "0" + hour;
              }
            }            
            return hour;
          };

          scope.$watch(attrs.btMakePlanText, function(val){
            if( val ) {
              var buttonTimeFrom = convertTo24Hour( val );
              BudsTimeUtils.get_current_date(scope, function(current_date){
                var serverDateHour = currentHourDelay( current_date.hour ), 
                    buttonFullDate = months[ scope.current_month ] + "/" + scope.current_day + "/" + scope.current_year + " " + buttonTimeFrom + ":00",
                    serverFullDate = current_date.month + "/" + current_date.day + "/" + current_date.year + " " + serverDateHour + ":" + current_date.minutes + ":00";
                if ( Date.parse(buttonFullDate) >= Date.parse(serverFullDate) ){
                    element.text("Make some plan?")
                }
              });            
            }
          }, true);

        }
    }
});

bt_module.directive('btTimepicker', function($compile, BudsTimeUtils) {
    return {
        restrict:'A',
        require: 'ngModel',
        compile: function(element, attrs) {
            var placeholder = element.attr('placeholder'),
                classes = element.attr('class');
            element.replaceWith( '<input ng-model="' + attrs.btTimepicker +'"  type="text" data-set-current-time="from" class="'+ classes +'" placeholder="'+ placeholder +'">');

            return function(scope, element, attrs, ngModel) {
                
                // compile the html template
                $compile($(element))(scope);
                
                var time = "",
                    options = {
                      showMeridian: false
                    };

                BudsTimeUtils.get_current_date(scope, function(current_date){
                   var hours = parseInt(current_date.hour, 10),
                       minutes = parseInt(current_date.minutes, 10),
                       minutes = (minutes<10?'0':'') + minutes; 

                    if(attrs.setCurrentTime === "to") {
                      hours<23 ? (hours+= 1) : minutes = 59;
                    }
                    
                    hours = (hours<10?'0':'') + hours;

                    time = hours + ':' + minutes;
                    options.defaultTime = time;

                    // init values
                    scope.$watch(attrs.btTimepicker, function(val){
                      if(!val || val === time){
                         ngModel.$setViewValue( time );
                      }
                      if(val && val !== time){
                        ngModel.$setViewValue( val );
                      }
                    }, true);
                    
                    element.mask("99:99");                
                    element.timepicker( options );

                    if(element.hasClass('ng-time-from')){
                      element.on('change', function() {
                          var newTime = $(this).val(),
                              timeToEl = $(this).closest('.ng-date-wrapper').find('.ng-time-to');
                          timeToEl.val(newTime);
                          ngModel.$setViewValue( newTime );
                      });
                    } else if(element.hasClass('ng-time-to')){
                      element.on('change', function() {
                        var newTime = $(this).val(),
                            dateWrapper = $(this).closest('.ng-date-wrapper'),
                            timeFromEl = dateWrapper.find('.ng-time-from'),
                            dateToEl =  dateWrapper.find('.ng-date-to'),
                            dateFromEl = dateWrapper.find('.ng-date-from');

                        if( Date.parse( dateToEl.val() + ' ' + newTime + ':00' ) <= Date.parse( dateFromEl.val()+ ' ' + timeFromEl.val() + ':00' ) ) {
                          element.attr('value', timeFromEl.val() );
                          ngModel.$setViewValue( timeFromEl.val() );
                        } else {
                          ngModel.$setViewValue( newTime );
                        }
                      });
                    } else {
                      element.on('change', function() {
                          var newTime = $(this).val();
                          ngModel.$setViewValue( newTime );
                      });
                    }

                });        

            }
        }
    }
});

bt_module.directive('setCurrentDate', function($compile, BudsTimeUtils, $parse) {
    return {
        restrict:'A',
        require: 'ngModel',
        compile: function(element, attrs) {
            var placeholder = element.attr('placeholder'),
                classes = element.attr('class');
            element.replaceWith( '<input ng-model="' + attrs.setCurrentDate +'" type="text" class="'+ classes +'" placeholder="'+ placeholder +'">' );

            return function(scope, element, attrs, ngModel) {
              

                // compile the html template
                $compile($(element))(scope);
                
                BudsTimeUtils.get_current_date(scope, function(current_date){
                    var currentDate = "",
                        mm = current_date.day,
                        dd = current_date.month;

                    currentDate =  dd +'/'+ mm +'/'+ current_date.year;

                    // init values
                    scope.$watch(attrs.setCurrentDate, function(val){
                      if(!val || val === currentDate){
                         ngModel.$setViewValue( currentDate );
                      }
                      if(val && val !== currentDate){                        
                        ngModel.$setViewValue( val );
                      }
                    }, true);
                    

                    // bind the date change
                    if( element.hasClass('ng-date-from') ){
                       element.on('changeDate', function(e) {
                          var newDate = element.val(),
                              dateWrapper = element.closest('.ng-date-wrapper'),
                              timeToEl = dateWrapper.find('.ng-time-to'),
                              timeFromEl = dateWrapper.find('.ng-time-from'),
                              dateToEl = dateWrapper.find('.ng-date-from');
                          ngModel.$setViewValue( newDate );      
                          
                          var dateToElement = element.closest('.ng-date-wrapper').find('.ng-date-to');
                       
                          if( Date.parse( dateToElement.val() + ' 00:01:00' ) < Date.parse( element.val() + ' 00:01:00' ) ){
                            scope.$apply(function(){
                              dateToElement.datepicker('setValue', newDate);
                              scope.$eval( dateToElement.attr("ng-model") + " = " + element.attr("ng-model") );
                            });
                          }                          

                          if( Date.parse( element.val() + ' 00:01:00' ) == Date.parse( dateToEl.val() + ' 00:01:00' ) ){
                            scope.$apply(function(){
                              timeToEl.attr('value', timeFromEl.val()).blur();  
                            });   
                          }               
                      });  
                    } else if( element.hasClass('ng-date-to') ){
                      element.on('changeDate', function(ev) {
                          var newDate = element.val(),
                              dateWrapper = element.closest('.ng-date-wrapper'),
                              timeToEl = dateWrapper.find('.ng-time-to'),
                              timeFromEl = dateWrapper.find('.ng-time-from'),
                              dateFromEl = dateWrapper.find('.ng-date-from'),
                              dateFrom = dateFromEl.data("datepicker");
                          ngModel.$setViewValue( newDate );   
                          
                          if(ev.date.valueOf() < dateFrom.date.valueOf()){
                            scope.$apply(function(){                              
                              element.datepicker('setValue', dateFromEl.val());
                              scope.$eval( element.attr("ng-model") + " = " + dateFromEl.attr("ng-model") );
                            });   
                          }     

                          if( Date.parse( dateFromEl.val() + ' 00:01:00' ) == Date.parse( element.val() + ' 00:01:00' ) ){
                            scope.$apply(function(){
                              timeToEl.attr('value', timeFromEl.val()).blur();  
                            });   
                          }                
                      });   
                    } else {
                      element.on('changeDate', function(e) {
                          var newDate = $(this).val();
                          ngModel.$setViewValue( newDate );                  
                      });  
                    }
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

            var requestObj = {
              event_id : event_id
            };

            // BudsTimeUtils.AjaxCall(serverController, actions.eventInfoPage, requestObj, scope, function(data, status){
            BudsTimeUtils.AjaxCall('events', 'event_info_response', requestObj, scope, function(data, status){
              if(status == "success"){
                renderResult( data.data );
              }
            });
          };

          scope.$watch(attrs.btEventInfo, function(val){
              if(val){
                element.css('cursor', 'pointer').on('click.eventInfo', function(e){
                  e.preventDefault();
                  get_results( val );
                });

                if( attrs.btOpenOnLoad === "true" ){
                  element.trigger("click.eventInfo");
                }
              }
          }, true);
         
        }
    }
});