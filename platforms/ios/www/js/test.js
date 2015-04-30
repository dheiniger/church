var aboutContent;
var blogContentHtml;
var blogPosts;
var sermonsContent;
var connectContent;
var sermonTitles;
var sermonSources;

function initializeJsonVariables(){

}

function updateAbout(){
    if(typeof(aboutContent) === 'undefined' || aboutContent === null){
	$.ajax({
            url: 'http://norwalkbaptist.org/church-beliefs/?json=1',
            dataType: 'jsonp',
            success: function(json){
		aboutContent = json.page.content;
		renderPageContent(aboutContent);
            }    
	});
    }else{	
	renderPageContent(aboutContent);
    }
}

function updateBlog(){
    if(typeof(blogContent) === 'undefined' || blogContent === null){
	$.ajax({
            url: 'http://norwalkbaptist.org/?json=get_recent_posts',
            dataType: 'jsonp',
            success: function(json){
		blogPosts = json.posts;
		blogContentHtml = retrieveBlogHTMLFromJson(blogPosts);
		renderPageContent(blogContentHtml);
            }    
	});
    }else{
	renderPageContent(blogContentHtml);
    }
}

function retrieveBlogHTMLFromJson(blogJson){
    var blogHtml = "";
    	$.each(blogPosts, function(index){
	    if(this.categories[0].slug === "pastors-blog"){
		blogHtml +=  "<div class='list-segment'>" + 
		    "<h1 class='list-title' id='" + index + "' onclick='retrieveBlogPost(" + index + ");'>" + this.title + "</h1>" +
		    "<div class='timestamp'>" + this.date +"</div>" +
		    "</div>"
	    }
	});
    return blogHtml;
}

function retrieveBlogPost(blogIndex){
    var html = "<h1 class='content-title'>" + blogPosts[blogIndex].title + "</h1> " +
	"<div id='blogContent'>" + blogPosts[blogIndex].content + "</div>";
    renderPageContent(html);
}

function updateSermons(){
    if(typeof(sermonsContent) === 'undefined' || sermonsContent === null){
	$.ajax({
            url: 'http://norwalkbaptist.org/recent-sermons/?json=1',
            dataType: 'jsonp',
            success: function(json){
		var html = "";
		var parsed = $(json.page.content);
		var cleanHtml = removeBadTextFromHtml(json.page.content);
		sermonSources = getSermonMp3SourcesAsText(cleanHtml);
		sermonTitles = getSermonTitlesAsText(cleanHtml);
		sermonTitles.forEach(function(entry, index){
		    html += "<div class='list-segment'>" + 
			"<h1 class='list-title' onclick='displaySermon(" + index + ");'>" + entry + "</h1>" +
			"</div>";
		});
		
		sermonsContent = html;
		renderPageContent(sermonsContent);
            }    
	});
    }else{
	renderPageContent(sermonsContent);
    }    	
}

function updateConnect(){
    if(typeof(connectContent) === 'undefined' || connectContent == null){
	html = "<div class='social-button-wrapper'>" +
	    "<div id='facebook-button' class='social-button'><a href='https://www.facebook.com/NorwalkBaptistChurch'>Visit our Facebook page!</a></div>" +
	    "<div id='website-button' class='social-button'><a href='http://norwalkbaptist.org'>Visit our website!</a></div>" +
	    "</div>";
	connectContent = html;
	renderPageContent(connectContent);
    }else{
	renderPageContent(connectContent);
    }
}

function removeBadTextFromHtml(dirtyHtml){
    var cleanHtml = dirtyHtml.replace("\t", "").replace("\r", "").replace("\n", "");
    return cleanHtml;
}

function getSermonTitlesAsText(cleanHtml){
    var sermonTitleH3Tags = getSermonTitleH3TagsAsObject(cleanHtml);
    var sermonAnchorTags = getSermonAnchorTagsAsObject(sermonTitleH3Tags);
    var sermonTitles = getSermonTitlesPlainText(sermonAnchorTags);
    return sermonTitles;
}

function getSermonTitleH3TagsAsObject(cleanHtml){   
    var sermonTitleH3Tags = $(cleanHtml).find('h3.sermon-title');   
    return sermonTitleH3Tags;
}

function getSermonAnchorTagsAsObject(headerTags){
    var sermonAnchorTags = [];
    Object.keys(headerTags).forEach(function(index){
	if(isNumeric(index)){
	    // The stuff we want is actually in an array located at [0]
	    sermonAnchorTags.push($(headerTags[index]).find('a')[0]);
	}
    });
    return sermonAnchorTags;
}

function getSermonTitlesPlainText(anchorTags){
    var sermonTitlesText = [];
    anchorTags.forEach(function(entry){
	sermonTitlesText.push(entry.text);
    });
    return sermonTitlesText;
}

function getSermonMp3SourcesAsText(cleanHtml){
    var sermonAudioTags = getSermonAudioTags(cleanHtml);
    var sermonAudioSources = getSermonAudioSources(sermonAudioTags);
    return sermonAudioSources;
}

function getSermonAudioTags(cleanHtml){
    var sermonAudioTags = $(cleanHtml).find('audio');
    return sermonAudioTags;
}

function getSermonAudioSources(audioTags){
    var sermonAudioSources = [];
    Object.keys(audioTags).forEach(function(index){
	if(isNumeric(index)){
	    sermonAudioSources.push(audioTags[index].textContent);
	    console.log(sermonAudioSources[index]);
	}
    });
    return sermonAudioSources;
}

function displaySermon(index){
   var html = "<audio controls>" +
	"<source src = '" + sermonSources[index] +"' type='audio/mpeg'>" + 
	"</audio>";
    renderPageContent(html);
    console.log("sermon src for index: " + index + " is: " + sermonSources[index]);
   // playAudio(sermonSources[index]);
}

function updateContact(){
    $("#content").html();
}

function renderPageContent(html){
    $("#content").html(html)
}

function isNumeric(num){
    return !isNaN(num)
}


//audio player code - this is more of a sample and isn't being used right now
/*var my_media = null;
var mediaTimer = null;

function playAudio(src) {
    // Create Media object from src
    my_media = new Media(src, onSuccess, onError);
    
    // Play audio
    my_media.play();
    
    // Update my_media position every second
    if (mediaTimer == null) {
        mediaTimer = setInterval(function() {
            // get my_media position
            my_media.getCurrentPosition(
                // success callback
                function(position) {
                    if (position > -1) {
                        setAudioPosition((position) + " sec");
                    }
                },
                // error callback
                function(e) {
                    console.log("Error getting pos=" + e);
                    setAudioPosition("Error: " + e);
                }
            );
        }, 1000);
    }
}

function pauseAudio() {
    if (my_media) {
        my_media.pause();
    }
}

// Stop audio
//
function stopAudio() {
    if (my_media) {
        my_media.stop();
    }
    clearInterval(mediaTimer);
    mediaTimer = null;
}

// onSuccess Callback
//
function onSuccess() {
    console.log("playAudio():Audio Success");
}

// onError Callback
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

// Set audio position
//
function setAudioPosition(position) {
    document.getElementById('audio_position').innerHTML = position;
}
*/
