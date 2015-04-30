var View = function(){
    this.content = $("#content");
    this.menuButton = $("#menu-button");
    console.log("initialized view");
};

View.prototype.renderPageContent = function(html){
    this.content.html(html);
};

View.prototype.getBlogPostHTMLFromJSON = function(blogPostsInJSON){
   var blogHtml = "";
    	$.each(blogPostsInJSON, function(index){
	    if(this.categories[0].slug === "pastors-blog"){
		blogHtml +=  "<div class='blog-segment'>" + 
		    "<h1 class='blog-title' id='" + index + "' onclick='retrieveBlogPost(" + index + ");'>" + this.title + "</h1>" +
		    "<div class='timestamp'>" + this.date +"</div>" +
		    "</div>"
	    }
	});
    return blogHtml;
};
