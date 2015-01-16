jQuery.extend({
	PostsModel: function(){
		/**
		 * our local cache of data
		 */
		var cache = new Array();
		/**
		 * a reference to ourselves
		 */
		var that = this;
		/**
		 * who is listening to us?
		 */
		var listeners = new Array();
		
		/**
		 * get contents of cache into an array
		 */
		function toArray(){
			var a = new Array();
			for (var i in cache){
				a.push(cache[i]);
			}
			return a;
		}
		
		/**
		 * load a json response from an
		 * ajax call
		 */
		function loadResponse(data){
			$.each(data, function(item){
				cache[data[item].id] = data[item];
				that.notifyItemLoaded(data[item]);
			});
		}
		
		/**
		 * look in the cache for a single item
		 * if it's there, get it, if not
		 * ask the server to load it
		 */
		this.getComments = function(id){
			if(cache[id]) return cache[id];
			that.notifyLoadBegin();
			$.ajax({
				url: 'ajax.php',
				data : { load : true, id : id },
				type: 'GET',
				dataType: 'json',
				timeout: 1000,
				error: function(){
					that.notifyLoadFail();
				},
				success: function(data){
					loadResponse(data);
					that.notifyCommentsLoadFinish();
				}
			});
		}
		
		/**
		 * load lots of data from the server
		 * or return data from cache if it's already
		 * loaded
		 */
		this.getAllPosts = function(){
			var outCache = toArray();
			if(outCache.length) return outCache;
			that.notifyLoadBegin();
			$.ajax({
				url: 'ajax.php',
				data : { load : true },
				type: 'GET',
				dataType: 'json',
				timeout: 1000,
				error: function(){
					that.notifyLoadFail();
				},
				success: function(data){
					loadResponse(data);
					that.notifyPostsLoadFinish();
				}
			});
		}
		
		/**
		 * load lots of data from the server
		 */
		this.clearAll = function(){
			cache = new Array();
		}
		
		/**
		 * add a listener to this model
		 */
		this.addListener = function(list){
			listeners.push(list);
		}
		
		/**
		 * notify everone that we're starting 
		 * to load some data
		 */
		this.notifyLoadBegin = function(){
			$.each(listeners, function(i){
				listeners[i].loadBegin();
			});
		}
		/**
		 * we're done loading, tell everyone
		 */
		this.notifyPostsLoadFinish = function(){
			$.each(listeners, function(i){
				listeners[i].loadPostsFinished();
			});
		}
		/**
		 * we're done loading, tell everyone
		 */
		this.notifyLoadFail = function(){
			$.each(listeners, function(i){
				listeners[i].loadFail();
			});
		}
		/**
		 * tell everyone the item we've loaded
		 */
		this.notifyCommentsLoadFinish = function(item){
			$.each(listeners, function(i){
				listeners[i].loadCommentsFinished(item);
			});
		}
	
	},
	
	/**
	 * let people create listeners easily
	 */
	ModelListener: function(list) {
		if(!list) list = {};
		return $.extend({
			loadBegin : function() { },
			loadPostsFinished : function() { },
			loadCommentsFinished : function() { },
			loadFail : function() { }
		}, list);
	}
});

