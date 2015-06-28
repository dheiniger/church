var Data = function(){
    this.isBlogDataReady = false;
    this.isSermonsDataReady = false;
    this.isAboutDataReady = false;
    this.isContactDataReady = false;
    this.blogJSON = "";
    this.sermonsJSON = "";
    this.aboutJSON = "";
    this.contactJSON = "";
    this.retrieveBlogJSON();
    this.retrieveSermonsJSON();
    this.retrieveAboutJSON();
    this.retrieveContactJSON();
    console.log("initialized data");
};


Data.prototype.retrieveBlogJSON = function(){
    $.ajax({
	url: 'http://norwalkbaptist.org/?json=get_recent_posts',
	dataType: 'jsonp',
	context: this,
	success: function(JSON){
	    this.blogJSON = JSON;
	    this.isBlogDataReady = true;
	}
    });    
};

Data.prototype.retrieveSermonsJSON = function(){
    $.ajax({
	url: 'http://norwalkbaptist.org/recent-sermons/?json=1',
	dataType: 'jsonp',
	context: this,
	success: function(JSON){
	    this.sermonsJSON = JSON;
	    this.isSermonsDataReady = true;
	}
    });    
};

Data.prototype.retrieveAboutJSON = function(){
    $.ajax({
	url: 'http://norwalkbaptist.org/church-beliefs/?json=1',
	dataType: 'jsonp',
	context: this,
	success: function(JSON){
	    this.aboutJSON = JSON;
	    this.isAboutDataReady = true;
	}
    });    
};

//TODO
Data.prototype.retrieveContactJSON = function(){
    $.ajax({
	url: 'http://norwalkbaptist.org/church-beliefs/?json=1',
	dataType: 'jsonp',
	context: this,
	success: function(JSON){
	    this.contactJSON = JSON;
	    this.isContactDataReady = true;
	}
    });    
};

