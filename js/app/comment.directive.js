bt_module.directive('btShowComments', function(BudsTimeUtils, $http, $compile) {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {

          var serverController = "events",
              actions = {
                allComments : "get_all_comments"
              };

          var renderResult = function( result, event_id ){
            scope.allComments = result.comments;
            scope.commentsLength = result.comments_length;

            // render search template                
            var html = $http.get(root +'partials/comments.html').then(function(data){
                html = $compile(data.data)(scope);
                $('.comment-list-' + event_id).each(function(){
                  $(this).html( html );
                });
                element.removeClass('c-pointer').find('.text').html( scope.commentsLength + ' comments' );
            });
          };
          
          var get_results = function( event_id ){
            var requestObj = {
              "event_id" : event_id
            }
            BudsTimeUtils.AjaxCall(serverController, actions.allComments, requestObj, scope, function(data, status){
              if(status == "success"){
                renderResult( data.data, event_id );
              }
            });
          };
          
          scope.$watch(attrs.btShowComments, function( val ){
              if( val ){
                  var clicked = false;
                  element.addClass('c-pointer').on('click', function(e){
                    e.preventDefault();
                    if(!clicked)
                      get_results( val );
                    clicked = true;
                  });
              }
          }, true);
        }
    }
});


bt_module.directive('btAddComment', function(BudsTimeUtils, $http, $compile) {
    return {
        restrict:'A',
        scope: false,
        link: function link(scope, element, attrs) {

          var serverController = "events",
              actions = {
               addComment : "add_comment"
              };

          var get_results = function( event, comment_text ){

            var newComment = {
              event_id : event.id,
              comment_text : comment_text
            };

            BudsTimeUtils.AjaxCall(serverController, actions.addComment, newComment, scope, function(data, status){
              if(status == "success"){
                event.comments.last_comments.push( data.data );
                event.comments.comments_length = event.comments.comments_length + 1;
              }
            });

          };
          
          scope.$watch(attrs.btAddComment, function( val ){
              if( val ){
                  element.on('keypress', function(e){
                      
                      var code = (e.keyCode ? e.keyCode : e.which);
                      if(code == 13 && !e.shiftKey) {
                        var text = $(this).val();
                        if($.trim(text) !== ""){
                          get_results( val, text);
                          $(this).val('');
                          e.preventDefault(); 
                        }
                      } 
                  });
              }
          }, true);
        }
    }
});

bt_module.directive('btRemoveComment', function( BudsTimeUtils ) {
    return {
        restrict:'A',
        link: function link(scope, element, attrs) {
          var serverController = "events",
              actions = {
               removeComment : "delete_comment"
              };

          scope.$watch(attrs.btRemoveComment, function( val ){
              if( val ){
                var requestObj = {
                      commentID : val
                    };

                    element.on('click', function(e){
                      e.preventDefault();
                      BudsTimeUtils.AjaxCall(serverController, actions.removeComment, requestObj, scope, function(data, status){
                        if(status == "success"){
                          element.closest('.comment-item').fadeOut(400, function(){
                            $(this).remove();  
                          });                      
                        }
                      });
                    });
              }
          }, true);

        }
    }
});