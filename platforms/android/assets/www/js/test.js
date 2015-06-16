var aboutContent;
var blogContentHtml;
var blogPosts;
var sermonsContent;
var connectContent;
var sermonTitles;
var sermonSources;
var sermonBibleText;
var playing;
var media;
var mediaTimer;
var playPauseButton;
var seekbar;
var currentPage = "blog";

function updateAbout(){
    currentPage = "about";
    if(typeof(aboutContent) === 'undefined' || aboutContent === null){
	$.ajax({
            url: 'http://norwalkbaptist.org/church-beliefs/?json=1',
            dataType: 'jsonp',
            success: function(json){
		aboutContent = json.page.content;
		if(currentPage === "about"){
		    renderPageContent(aboutContent);
		}
            }    
	});
    }else{	
	renderPageContent(aboutContent);
    }
}

function updateBlog(){
    currentPage = "blog";
    if(typeof(blogContent) === 'undefined' || blogContent === null){
	$.ajax({
            url: 'http://norwalkbaptist.org/?json=get_recent_posts',
            dataType: 'jsonp',
            success: function(json){
		blogPosts = json.posts;
		blogContentHtml = retrieveBlogHTMLFromJson(blogPosts);
		if(currentPage === "blog"){
		    renderPageContent(blogContentHtml);
		}
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
    currentPage = "sermons";
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
		//sermonBibleText = getSermonBibleText(cleanHtml);
		sermonTitles.forEach(function(entry, index){
		    html += "<div class='list-segment'>" + 
			"<h1 class='list-title' onclick='displaySermon(" + index + ");'>" + entry + "</h1>" +
			//"<div class='timestamp'>" + sermonBibleText[index] + "</div>" +
			"</div>";
		});
		
		sermonsContent = html;
		if(currentPage === "sermons"){
		    renderPageContent(sermonsContent);
		}
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
/*
function getSermonBibleText(cleanHtml){
    var texts = ["a", "b", "c", "d", "e", "f"];
    var passages = $(cleanHtml).find('span.bible_passage');
    
    var biblePassages = $(cleanHtml).find('span.bible_passage');
    Object.keys(biblePassages).forEach(function(entry){
	if(isNumeric(entry)){
	    console.log("Passages: " + biblePassages[entry].innerHTML);
	    texts.push(biblePassages[entry].innerHTML);
	}
    });

    return texts;
}*/

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

function getSermonBibleText(cleanHtml){
    var sermonBiblePassageSpanTags = getSermonBiblePassageSpanTags(cleanHtml);
    var sermonBiblePassagePlainText = getSermonBiblePassagePlainText(sermonBiblePassageSpanTags);
    return sermonBiblePassagePlainText;
}

function getSermonBiblePassageSpanTags(cleanHtml){    
    var sermonBiblePassageSpanTags = $(cleanHtml).find('span.bible_passage');
    
    return sermonBiblePassageSpanTags
}

function getSermonBiblePassagePlainText(passageSpanTags){
    var biblePassages = [];
    Object.keys(passageSpanTags).forEach(function(index){
	if(isNumeric(index)){
	    biblePassages.push(passageSpanTags[index].innerHTML);
	}
    });
    return biblePassages
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
	}
    });
    return sermonAudioSources;
}

function togglePlayPause(){   
    if(!playing){
	play();
    }else{
	pause();
    }
}

function play(){   
    updateSeekBar();
    media.play();
    playing = true;
    playPauseButton.className = "";
    playPauseButton.className = "pause";
}

function pause(){
    media.pause();
    clearInterval(mediaTimer);
    playing = false;
    playPauseButton.className = "";
    playPauseButton.className = "play";
}   

function stop(){    
    if(!(typeof(media) === 'undefined' || media === null)){
	media.stop();	
	clearInterval(mediaTimer);
	media = null;
    }

    if(!(typeof(playPauseButton) === 'undefined' || playPauseButton === null)){	
	playPauseButton.className = "";
	playPauseButton.className = "play";
    }
}

function displaySermon(index){      
    //Make sure another file isn't already playing
    stop();
    var html = "<h1 class='sermon-title header'>" + sermonTitles[index]+ "</h1>" +
	//"<h2 class='subheader'>"+ sermonBibleText[index] +"</h2>"+
 	"<section id='audio-player'>" +
	"<span class='timer' id='time-played'>0:00</span>" +
	"<span class='timer' id='time-remaining'>0:00</span>" +
	"<input type='range' id='seekbar' min='0'>" +	
	"<button id='playPauseButton' class='buffer' onclick=\"togglePlayPause();\"></button>" +
	"</section>";
 
    renderPageContent(html);    
    initializeBar(index);   
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

//@Deprecated
function setupSeekbar() {
    seekbar.min = 0;
    seekbar.max = media.startTime + media.duration();
}

function updateTimers(position){
    var timePlayed = document.getElementById('time-played');
    var timeRemaining = document.getElementById('time-remaining');
    timePlayed.innerHTML = convertSecondsToTimeFormat(position);
    timeRemaining.innerHTML = convertSecondsToTimeFormat(media.getDuration() - position);
}

function seekAudio() {
    if(playing){
	pause();
    }
    updateTimers(seekbar.value);
    media.seekTo(convertToMilliSeconds(seekbar.value));
}

function convertToMilliSeconds(seconds){
    return seconds*1000;
}

//@Deprecated
function updateUI() {   
    var lastBuffered = audio.buffered.end(audio.buffered.length-1);
    var timePlayed = document.getElementById('time-played');
    var timeRemaining = document.getElementById('time-remaining');
    seekbar.min = audio.startTime;
    seekbar.max = lastBuffered;
    seekbar.value = audio.currentTime;
    timePlayed.innerHTML = convertSecondsToTimeFormat("" + audio.currentTime);
    timeRemaining.innerHTML = '-' + convertSecondsToTimeFormat(seekbar.max - audio.currentTime);
}

function updateSeekBar(){
    if(typeof(seekbar) === 'undefined' || seekbar === null){
	seekbar = document.getElementById('seekbar');
    }
    
    // Update media position every second
    mediaTimer = setInterval(function () {
	// get media position
	media.getCurrentPosition(
            // success callback
            function (position) {
		if (position > -1) {
		    seekbar.value = position;		    
		    updateTimers(position);
		    //timePlayed.innerHTML = position;
		}
            },
            // error callback
            function (e) {
		console.log("Error getting pos=" + e);
            }
	);
    }, 1000);
}

function initializeBar(index){
    media = new Media(sermonSources[index]);  
    playPauseButton = document.getElementById('playPauseButton'); 
    seekbar = document.getElementById('seekbar');
  
    buffer();
    
    seekbar.addEventListener('change', seekAudio);
    seekbar.value = 0;      
}

function buffer(){
    //this is a stupid hack
    media.play();
    var counter = 0;
    var timerDur = setInterval(function() {
        counter = counter + 100;
        if (counter > 90000) {
	    alert("There was a problem retrieving the audio file.  Please check your network connection and try again");
            clearInterval(timerDur);
        }
	
        var dur = media.getDuration();
        if (dur > 0) {	    
	    media.seekTo(0);
	    media.stop();
	    media.release();
            clearInterval(timerDur);
	    seekbar.max = dur
            updateTimers(0);
	    playPauseButton.className = "";
	    playPauseButton.className = "play";
	   // alert("should be enabled now");
        }
    }, 100);
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
