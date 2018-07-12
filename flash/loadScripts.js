var scriptToLoad = [
	'init.js', 
	'utils.js', 
	'kslider.js',
	'generalInfo.js',
	'comm_settings.js',
	'httpCommunications.js',
	'onoffbutton.js',
	'inputField.js',
	'routeButton.js',
	'routing.js',
	'routingDevices.js',
	'inputField.js',
	'edid.js',
    'edidReader.js',
    'frupdate.js',
    'jquery.form.js',
    'jquery.sortable.js',
    'mobile_touch.js',
    'SetandRecall.js',
    'password.js',
    'timeout.js',
    'audioswitch.js',
    'stepin.js'
];


var scriptToLoadIndex = 0;
var scriptToLoadReties = 3;

function loadScriptAndWait(){
	var percent = Math.round(scriptToLoadIndex / scriptToLoad.length * 100);
	var str = "Loading resources (" + percent + "%)";
	$("#loadingDivText").html(str);
		
	$.getScript(scriptToLoad[scriptToLoadIndex], function(){
		scriptToLoadReties = 3;
		scriptToLoadIndex++;
		if(scriptToLoadIndex==scriptToLoad.length)
		{
            init();
		}
		else
		{
			loadScriptAndWait();
		}
	}).fail(function(){ 
		scriptToLoadReties--;
		if(scriptToLoadReties != 0)
			loadScriptAndWait();
		else 
			$("#loadingDivText").html("Error loading resources.");
	});
}

//@ sourceURL=loadScripts.js