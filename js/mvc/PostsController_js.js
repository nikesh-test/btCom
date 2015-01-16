jQuery.extend({

	PostController: function(model, view){
		/**
		 * listen to the view
		 */
		var vlist = $.ViewListener({
			loadAllPosts : function(){
				model.getAllPost();
			},
			showMoreCommentsClikced : function(postId){
				model.getComments(postId);
			}
		});

		view.addListener(vlist);

		/**
		 * listen to the model
		 */
		var mlist = $.ModelListener({
			loadBegin : function() {
				view.showLoading({"msg":"Fetching Data..."});
			},
			loadFail : function() {
				view.showError({"msg":"Ajax error"});
			},
			loadPostsFinished : function(items) {
				view.showPosts(items);
			},
			loadCommentsFinished : function(items) {
				view.showComments(items);
			}
		});
		model.addListener(mlist);
	}
	
});

