/*****************************
* Project: Generic Web
* File: main.js
* Author: Leonardo Severini
* Last modify: 12/02/2013
******************************/
var deviceXML = null;
var httpComm = null;

document.ontouchmove = function(e) {e.preventDefault()};

/**********
* load
***********************/
$(window).load(function(){

	$.ajaxSetup({  
		// Enable caching of AJAX responses  
		cache: false
	}); 
	
	$.getScript("/loadScripts.js", function(){
        loadScriptAndWait();
		}).fail(function(){ 
			$("#loadingDivText").html("Error loading resources.");
		});
});


//@ sourceURL=main.js