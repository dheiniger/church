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
            url: 'http://norwalkbaptist.org/sermons/?json=1',
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
	    "<div id='website-button' class='social-button'><a href='http://norwalkbaptist.org'>Visit our website!</a></div>" +
	    "<div id='facebook-button' class='social-button'><a href='https://www.facebook.com/NorwalkBaptistChurch'>Visit our Facebook page!</a></div>" +	   
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
    var html = "<h1 class='content-title'>" + sermonTitles[index]+ "</h1>" +
 	"<section id='audio-player'>" +
	"<audio id='audio' src='" + sermonSources[index] + "'></audio>" + 
	"<span id='time-played'></span>" +
	"<span id='time-remaining'></span>" +
	"<input type='range' class='topcoat-range' id='seekbar'>" +	
	"<button onclick=\"document.getElementById(\'audio\').play()\">Play</button>" +
	"<button onclick=\"document.getElementById(\'audio\').pause()\">Pause</button>" +
	"</section>";

    renderPageContent(html);
    initializeBar();
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

function setupSeekbar() {
    seekbar.min = audio.startTime;
    seekbar.max = audio.startTime + audio.duration;
    console.log("seekbar: " + seekbar.value);
}

function seekAudio() {
    audio.currentTime = seekbar.value;
    console.log(seekbar.value);
}

function updateUI() {   
    var lastBuffered = audio.buffered.end(audio.buffered.length-1);
    var timePlayed = document.getElementById('time-played');
    var timeRemaining = document.getElementById('time-remaining');
    seekbar.min = audio.startTime;
    seekbar.max = lastBuffered;
    seekbar.value = audio.currentTime;
    timePlayed.innerHTML = convertSecondsToTimeFormat("" + audio.currentTime);
    timeRemaining.innerHTML = '-' + convertSecondsToTimeFormat(seekbar.max - audio.currentTime);
    console.log("ui updated: " + seekbar.value);
}

function initializeBar(){
    var audio = document.getElementById('audio');
    var seekbar = document.getElementById('seekbar');
    audio.addEventListener('durationchange', setupSeekbar);
    audio.addEventListener('timeupdate', updateUI);
    seekbar.onchange = seekAudio;
    audio.ontimeupdate = updateUI;
    seekbar.value = 0;
}

function convertSecondsToTimeFormat(timeInSeconds){
    var seconds = Math.floor(timeInSeconds % 60);
    var minutes = Math.floor(timeInSeconds / 60);
    var hours = Math.floor(minutes / 60);
    
    if(seconds < 10){
	seconds = "0" + seconds;
    }
    return minutes + ":" + seconds; 
}
