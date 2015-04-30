/**
   Given a navigation button object, bind its click handler to the
   given actionFunction.  After the button is clicked, the navigation
   menu should be closed, so all navigation button's should call toggleMenu()
   after their main action is performed.
*/
bindNavigationHandler = function (navigationButton, actionFunction){
    navigationButton.click(function(){
	clearPage();
	actionFunction();
	updateActiveButton(navigationButton);
    });
};

clearPage = function(){
    var loader = "<div class='loader'><img src='img/ajax-loader.gif' height='30' width='30'/></div>";
    $("#content").html("");
    $("#content").html(loader);
};

updateActiveButton = function(navigationButton){
    var test = navigationButton.parent().siblings().children();
    navigationButton.parent().siblings().children().removeClass("ui-btn-active");
    navigationButton.addClass("ui-btn-active");
};

// Add the click handlers to buttons
bindHandlers = function(){
    bindNavigationHandler($("#aboutButton"), updateAbout);
    bindNavigationHandler($("#blogButton"), updateBlog);
    bindNavigationHandler($("#sermonsButton"), updateSermons);
    bindNavigationHandler($("#contactButton"), updateConnect);
};

initialize = function(){
    FastClick.attach(document.body);
    bindHandlers();
};

initialize();
