var BlogData = function(){

    var retrieveRecentBlogPostsJson = function(){
	return $.ajax({
            type: "GET",
	    dataType: 'jsonp',
            url: "http://norwalkbaptist.org/?json=get_recent_posts",
            async: false
	}).responseText;
    }

    this.initialize = function(){
	this.recentBlogPostsJson = retrieveRecentBlogPostsJson();
	console.log(this.recentBlogPostsJson);
    }

}

