var _showLog = true;
var _connected = false;
var _IS_MOBILE_ = false;

function preloadImages(arrayOfImages) {
    $(arrayOfImages).each(function(){	
        $('<img/>')[0].src = this;
    });	
}

function LoadFileRetry(id, filename, callbackFunction){
	$(id).load(filename, "", function(responseText, textStatus, XMLHttpRequest){
		 if(textStatus == 'error') {
			LoadFileRetry(id, filename, callbackFunction);
		 } else {
			if(callbackFunction != null)
				callbackFunction();
		 }
	});
}

function GetFileNameNoCache(filename)
{
	return filename;
	
	//var rnd = Math.floor(Math.random()*10001);
	// return filename+"?"+rnd;
}

/**********
* LogPrint
***********************/
var LogPrint = function(message){
	if(_showLog)
	{
		//console.log("### LOG ###: " + message);
	}
}

/**
 * Set a cookie
 */
function setCookie(c_name,value,exdays)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
}

/**
 * Get a cookie
 */
function getCookie(c_name)
{
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++)
	{
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==c_name)
		{
			return unescape(y);
		}
	}
}

/**
 * Deleta a cookie
 */
function delCookie(c_name) {
	document.cookie = c_name +'=; expires=Thu, 01-Jan-70 00:00:01 GMT;';
} 


/**
*	Load a XML file
*/
function loadXmlFile(xmlFile, callback)
{
	$.ajax({
		type: "GET",
		url: xmlFile,
		dataType: "xml",		
		success: function(xml) {
			callback(xml);			
		},		
		error: function(xml) {
			loadXmlFile(xmlFile, callback);	
		}
	});	
}

/**********
* showLoading
***********************/
function showLoading(show)
{	
	centerContent();
	if(show)
	{
		$("#loadingDiv").fadeIn(300);
	}
	else 
	{
		$("#loadingDiv").fadeOut(300);
	}
}

/**********
* callFunction
***********************/
function callFunction(functionName, params)
{
	var fn = window[functionName]; 
	if(typeof fn === 'function') {
		return fn(params);
	}
	return "NO VALUE";
}

/**********
* sendAndWaitCommand
***********************/
function sendAndWaitCommand(a)
{
    return null!=httpComm?httpComm.sendMessageWait(a):"ERROR";
}

function sendAndWaitCommandResponse(commandToSend, waitResponse, receiveHandler, errorHandler){
	httpComm.sendMessageWaitResponse(commandToSend, waitResponse, 2000, receiveHandler, errorHandler);
}
function sendMessageNoWait(a)
{
    return null!=httpComm?httpComm.sendMessageNoWait(a):"ERROR";
}
/**********
* getGeneralValue
***********************/
function getGeneralValue(command)
{
	if(command == "ERROR") 
		return command;
	var value = command.substring(command.lastIndexOf("/0"));
	return value;
}

/**********
* refreshCommands
***********************/
function refreshCommands(){
	if(httpComm !=null)
		httpComm.SyncQueriesList.ForceRefresh();		
}


/**********
* checkForErrors
***********************/
var checkForErrors = function(err){
	if(err == 1){
		return true;
	} else {
		return false;
	}
}

/**********
* _SignalType
***********************/
var _SignalType = new Array();           
_SignalType[0] = "No Signal";
_SignalType[1] = "DVI";
_SignalType[2] = "HDMI";
_SignalType[3] = "Display Port";
_SignalType[4] = "HDBaseT";
_SignalType[5] = "SDI";
_SignalType[6] = "VGA";

/**********
* _ResolutionList
***********************/
var _ResolutionList = new Array();           
_ResolutionList[0] = new Array(1, 1, false, 1);
_ResolutionList[1] = new Array(640, 480, false, 60);
_ResolutionList[2] = new Array(720, 480, false, 60);
_ResolutionList[3] = new Array(720, 480, false, 60);
_ResolutionList[4] = new Array(1280, 720, false, 60);
_ResolutionList[5] = new Array(1920, 1080, true, 60);
_ResolutionList[6] = new Array(1440, 480, true, 60);
_ResolutionList[7] = new Array(1440, 480, true, 60);
_ResolutionList[8] = new Array(1440, 240, false, 60);
_ResolutionList[9] = new Array(1440, 240, false, 60);
_ResolutionList[10] = new Array(2880, 480, true, 60);
_ResolutionList[11] = new Array(2880, 480, true, 60);
_ResolutionList[12] = new Array(2880, 240, false, 60);
_ResolutionList[13] = new Array(2880, 240, false, 60);
_ResolutionList[14] = new Array(1440, 480, false, 60);
_ResolutionList[15] = new Array(1440, 480, false, 60);
_ResolutionList[16] = new Array(1920, 1080, false, 60);
_ResolutionList[17] = new Array(720, 576, false, 50);
_ResolutionList[18] = new Array(720, 576, false, 50);
_ResolutionList[19] = new Array(1280, 720, false, 50);
_ResolutionList[20] = new Array(1920, 1080, true, 50);
_ResolutionList[21] = new Array(1440, 576, true, 50);
_ResolutionList[22] = new Array(1440, 576, true, 50);
_ResolutionList[23] = new Array(1440, 288, false, 50);
_ResolutionList[24] = new Array(1440, 288, false, 50);
_ResolutionList[25] = new Array(2880, 576, true, 50);
_ResolutionList[26] = new Array(2880, 576, true, 50);
_ResolutionList[27] = new Array(2880, 288, false, 50);
_ResolutionList[28] = new Array(2880, 288, false, 50);
_ResolutionList[29] = new Array(1440, 576, false, 50);
_ResolutionList[30] = new Array(1440, 576, false, 50);
_ResolutionList[31] = new Array(1920, 1080, false, 50);
_ResolutionList[32] = new Array(1920, 1080, false, 24);
_ResolutionList[33] = new Array(1920, 1080, false, 25);
_ResolutionList[34] = new Array(1920, 1080, false, 30);
_ResolutionList[35] = new Array(2880, 480, false, 60);
_ResolutionList[36] = new Array(2880, 480, false, 60);
_ResolutionList[37] = new Array(2880, 576, false, 50);
_ResolutionList[38] = new Array(2880, 576, false, 50);
_ResolutionList[39] = new Array(1920, 1080, true, 50);
_ResolutionList[40] = new Array(1920, 1080, true, 100);
_ResolutionList[41] = new Array(1280, 720, false, 100);
_ResolutionList[42] = new Array(720, 576, false, 100);
_ResolutionList[43] = new Array(720, 576, false, 100);
_ResolutionList[44] = new Array(1440, 576, true, 100);
_ResolutionList[45] = new Array(1440, 576, true, 100);
_ResolutionList[46] = new Array(1920, 1080, true, 120);
_ResolutionList[47] = new Array(1280, 720, false, 120);
_ResolutionList[48] = new Array(720, 480, false, 120);
_ResolutionList[49] = new Array(720, 480, false, 120);
_ResolutionList[50] = new Array(1440, 480, true, 120);
_ResolutionList[51] = new Array(1440, 480, true, 120);
_ResolutionList[52] = new Array(720, 576, false, 200);
_ResolutionList[53] = new Array(720, 576, false, 200);
_ResolutionList[54] = new Array(1440, 576, true, 200);
_ResolutionList[55] = new Array(1440, 576, true, 200);
_ResolutionList[56] = new Array(720, 480, false, 200);
_ResolutionList[57] = new Array(720, 480, false, 200);
_ResolutionList[58] = new Array(1440, 480, true, 200);
_ResolutionList[59] = new Array(1440, 480, true, 200);
_ResolutionList[60] = new Array(1280, 720, false, 24);
_ResolutionList[61] = new Array(1280, 720, false, 25);
_ResolutionList[62] = new Array(1280, 720, false, 30);
_ResolutionList[63] = new Array(1920, 1080, false, 120);
_ResolutionList[64] = new Array(1920, 1080, false, 100);

/**********
* getResolution
***********************/
function getResolution(index)
{
	var str = "Unknown Resolution";
	
	if(index != 0){
		str  = ""+_ResolutionList[index][0];
		str += "x"+_ResolutionList[index][1];
		str += ""+ (_ResolutionList[index][2])?"i":"p";
		str += "@"+_ResolutionList[index][3];
	}
	return str;
}


/**********
* replaceAll
***********************/
String.prototype.replaceAll = function(token, newToken, ignoreCase) {
    var str, i = -1, _token;
    if((str = this.toString()) && typeof token === "string") {
        _token = ignoreCase === true? token.toLowerCase() : undefined;
        while((i = (
            _token !== undefined? 
                str.toLowerCase().indexOf(
                            _token, 
                            i >= 0? i + newToken.length : 0
                ) : str.indexOf(
                            token,
                            i >= 0? i + newToken.length : 0
                )
        )) !== -1 ) {
            str = str.substring(0, i)
                    .concat(newToken)
                    .concat(str.substring(i + token.length));
        }
    }
	return str;
};



/**********
* getOffset
***********************/
function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}


/**********
* roundRect for canvas
***********************/
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x+r, y);
  this.arcTo(x+w, y,   x+w, y+h, r);
  this.arcTo(x+w, y+h, x,   y+h, r);
  this.arcTo(x,   y+h, x,   y,   r);
  this.arcTo(x,   y,   x+w, y,   r);
  this.closePath();
  return this;
};

/**********
* getMousePos for canvas
***********************/
function getMousePos(canvas, evt) {
	if(canvas){
	var rect = canvas.getBoundingClientRect();
		return {
		  x: evt.clientX - rect.left,
		  y: evt.clientY - rect.top
		};
	} else {
		return "error";
	}
}

/******* Validate IP Address IPv4 *********/
function fnValidateIPAddress(ipaddr, zeroAllow) {
    ipaddr = ipaddr.replace( /\s/g, "");
    if(ipaddr==inputField.INPUT_OBJECT_ARRAY[2].value||ipaddr==inputField.INPUT_OBJECT_ARRAY[0].value)
    {
        return false;
    }
    var re = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    if (re.test(ipaddr))
    {
        var parts = ipaddr.split(".");
        parts[0] = parseInt(parseFloat(parts[0]));
        parts[1] = parseInt(parseFloat(parts[1]));
        parts[2] = parseInt(parseFloat(parts[2]));
        parts[3] = parseInt(parseFloat(parts[3]));
        if(!zeroAllow)
        {
            if (parts[0]<0||parts[0]>223||parts[0]==127) {
                console.log("第一字节是用非法的数据");
                return false;
            }
            for (var i=1; i<parts.length; i++) {
                if (parts[i] > 255){
                    console.log("数据超出范围");
                    return false;
                }
            }
            if ((parts[1]|parts[2]|parts[3])== 0||(parts[1]&parts[2]&parts[3])== 255) {
                console.log("使用的全1全0");
                return false;
            }
            else
            {
                return true;
            }
        }
    }
    else
    {
        console.log("不合法的数据");
        return false;
    }
}
function fnValidateMask(ipaddr) {
    ipaddr = ipaddr.replace( /\s/g, "");
    var re = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    if (re.test(ipaddr)) {
        var parts = ipaddr.split(".");
        var mask=0;
        var value=1;
        parts[0] = parseInt(parseFloat(parts[0]));
        parts[1] = parseInt(parseFloat(parts[1]));
        parts[2] = parseInt(parseFloat(parts[2]));
        parts[3] = parseInt(parseFloat(parts[3]));
        for (var i=0; i<4; i++) {
            if (parts[i] > 255){
                console.log("超出范围");
                return false;
            }
        }
        mask=(parts[0]+256)*256*256*256+parts[1]*256*256+parts[2]*256+parts[3];
        mask=mask.toString(2);
        console.log(mask);
        mask=mask.slice(1);
        console.log(mask);
        var reg=/1+/g;
        var str=mask.match(reg);
        console.log(str);
        console.log(mask.indexOf("1"));
        if(str==null)
        {
            console.log("權威0");
            return false;
        }
        if(str.length>1||(mask.indexOf("1")!=0))
        {
            console.log("0,1交叉或者是1开始的位置不为0");
            return false;
        }
        else
        {
            if(str[0].length>30||str[0].length<3)
            {
                console.log("子网掩码的1数据量不对");
                return false;
            }
            else
            {
                return true;
            }
        }
    }
    return false;
}
/**********
* _ColorIndex
***********************/
var _ColorIndex = new Array();           
_ColorIndex[0] = "rgba(97,56, 97, 0.8)";
_ColorIndex[1] = "rgba(97,56, 97, 1)";
_ColorIndex[2] = "rgba(44, 44, 44, 0.5)";
_ColorIndex[3] = "rgba(44, 44, 44, 0.5)";
_ColorIndex[4] = "rgba(44, 44, 44, 0.5)";
_ColorIndex[5] = "rgba(44, 44, 44, 0.5)";
_ColorIndex[6] = "rgba(44, 44, 44, 0.5)";
_ColorIndex[7] = "rgba(44, 44, 44, 0.5)";
_ColorIndex[8] = "rgba(44, 44, 44, 0.5)";
_ColorIndex[9] = "rgba(44, 44, 44, 0.5)";


/**********
* _ColorDisabledIndex
***********************/
var _ColorDisabledIndex = new Array();           
_ColorDisabledIndex[0] = "#333333";
_ColorDisabledIndex[1] = "#444444";
_ColorDisabledIndex[2] = "#555555";
_ColorDisabledIndex[3] = "#666666";
_ColorDisabledIndex[4] = "#777777";
_ColorDisabledIndex[5] = "#888888";
_ColorDisabledIndex[6] = "#999999";
_ColorDisabledIndex[7] = "#aaaaaa";
_ColorDisabledIndex[8] = "#bbbbbb";
_ColorDisabledIndex[9] = "#cccccc";

//@ sourceURL=utils.js