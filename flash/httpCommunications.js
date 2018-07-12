/*
 *****	Library Name:	httpCommunications	*****
 *****	Version:		1.0.11				*****
 *****	Written by:		Arkadi Viner		*****
 *****	Reviewed by:	Leonardo Severini	*****
 *****	Date:			25/06/2013			*****
 * jifukui 2017.04.28
 *
 */
var cmd_elTime;
var repliesQueue = new RepliesQueue();
var sendQueue = new SendQueue();
var handlersDataStruct = {};
var retryCounter = 0;
var pollingsUntilRetryCounter = 0;
var privilegeUser=-1;
var commandsToSend = [];
var timeSyncBrowser = 0;
var beginSyncFlag = true; //if true, program is in sync mode, it stops sending commands in sendQueue, and sends sync queries.
var lastSyncQuery = null;
var httpCommFrame = CreateHttpCommObj();
var forceRefresh = false;
var UNKNOWN_ERROR = "UNKNOWN_ERROR";
var error_flag=0;
var error_error=false;
var have401=false;
//settings 
INTERVAL_TIME = 2000; 			// Interval of checking if communication flag enabled, if in diabled communication mode.
INTERVAL_TIME_UPLOADING = 2000; 			// Interval between handshakes
INTERVAL_COMMAND_TIME = 2000;    // Interval between commands on the list
NUM_OF_POLLINGS_UNTIL_RETRY = 0;
RETRY_COUNT = 1;

commands_sent_in_group = 0;
commands_received_counter = 0;
var httpComm;
var interval_normal_polling = INTERVAL_TIME;
var prev_device_state = ""; //stores previus device state so user would be notified if device is in upload state for example.
var privilageflag=0;
//event handlers
var pNoResponseErrorHandler = null;
var pHandShakeErrorHandler = null;
var pHandShakeSuccessHandler = null;//这个标记不知道是做什么用的
var pAllOutputHandler = null;
var pDeviceStateChangedHandler = null;

//errors flags
flag_ResponseError = false;
flag_HandShakeError = false;

//other flags
flag_onlyRecieve = false;
flag_EnableCommunication = true; //if false, stops sending and recieving
/**/
var httpComm_WaitForReplay =
{
  'watchRegxFlag':false,
  'regxArray':null,
  'recievedString': null,
  'okHandler': null,
  'timeoutHandler': null,
  'timeCommandSent': null,
  'timeout': 10000,
  'Start':
      function(regxArr, okHandler, timeoutHandler, timeout)
      {
          this.watchRegxFlag = true;
          this.regxArray = new Array();	//build array of regular expression objects.
          for (var i = 0; i < regxArr.length; i++) {
              var regx = new RegExp(regxArr[i], "i");
              this.regxArray.push(regx);
          }
          this.recievedString = null;
          this.okHandler = okHandler;
          this.timeoutHandler = timeoutHandler;
          this.timeCommandSent = null;
          this.timeout = timeout;
          this.timeCommandSent = (new Date()).getTime();
      },
  'Check':
      function(reply)
      {  //returns true if expected reply recieved or timeout
          var regxString = "";
          if(reply != "")
          {
              for (var i = 0; i < this.regxArray.length; i++) {

                  if(this.regxArray[i].test(reply))
                  {
                      this.watchRegxFlag = false; //stop checking for replies
                      if(this.okHandler != null)
                          this.okHandler(reply, i);
                      return true;
                  }
              }
          }
          return false;
	},
  'CheckTimeOut':
      function()
      {
          if(((new Date()).getTime() - this.timeCommandSent) > this.timeout) //check for a timeout
          {
              this.watchRegxFlag = false; //stop checking for replies
              if(this.timeoutHandler != null)
                  this.timeoutHandler(this.recievedString);
              return true;
          }

          return false;
	}
};

function func_addHandler(regexstring, handlerMethod, customData)
{
	if(!(regexstring in handlersDataStruct))
	{
		handlersDataStruct[regexstring] = new Object();
	}

	handlersDataStruct[regexstring].handlerMethod = handlerMethod;
	
	if(customData != undefined)
		handlersDataStruct[regexstring].customData = customData;
}

function handShake()
{	
	$.ajax({
		url: "test.cgx?cmd=",
		context: document.body,
		cache : false,
		data: {
			username :  $("").val(),
			password :  $("").val()
		},
		success: function ( data ) {
			var recievedReply;
			if(pHandShakeSuccessHandler != null)
				pHandShakeSuccessHandler();
				
			recievedReply = processResponse(data);
			
			if(recievedReply!=null){

				if(recievedReply.command.toLowerCase().indexOf("ok") == -1)
					return false;

				timeSyncBrowser = parseInt(recievedReply.timeSync);
                privilegeUser = parseInt(recievedReply.privilege);
                httpCommFrame.privilege=privilegeUser;
                httpCommFrame.oldprivilege=httpCommFrame.privilege;
			}
		},
		error:function (xhr, ajaxOptions, thrownError){
			if(!flag_HandShakeError && pHandShakeErrorHandler != null)
			{
				flag_HandShakeError = true;
				var err = getAjaxError(xhr, thrownError);
				if(err != UNKNOWN_ERROR)
					pHandShakeErrorHandler(err);
			}
		},
		async: false
	});
	return true;
}

function func_sendMessageWait(commandToSendAndWait)
{	
	var  retValue ="";
	$.ajax({
		url: "test.cgx?cmd="+commandToSendAndWait,
		context: document.body,
		cache : false,
        timeout:10000,
		data: {
			username :  $("").val(),
			password :  $("").val()
		},
		success: function ( data ) {
			var recievedReply = processResponse(data);
			if(recievedReply!=null)
				retValue = recievedReply.command;
            if(have401)
            {
                httpComm.setCommunicationEnabled(true);
                have401=false;
            }
		},
		error:
            function (xhr, ajaxOptions, thrownError){
			if(!flag_HandShakeError && pHandShakeErrorHandler != null)
			{
				flag_HandShakeError = true;
				var err = getAjaxError(xhr, thrownError);
				if(err != UNKNOWN_ERROR)
					pHandShakeErrorHandler(err);
			}
			retValue = "ERROR";	
		},
		async: false
	});
	return retValue;
}

function func_sendMessageWaitResponse(message, responseRegxArray, timeout, okHandler, timeoutHandler)
{
	httpComm_WaitForReplay.Start(responseRegxArray, okHandler, timeoutHandler, timeout);	
	flag_onlyRecieve = true;
	updateMultiple("test.cgx?cmd=" + message);
}

function func_init()
{
	if (typeof cmd_elTime !=="undefined")
		clearTimeout(cmd_elTime);

	func_clearErrorFlag('ALL');
	if(handShake())
	{
		periodicUpdate();
		return true;
	}
	
	return false;
}

function func_handle(message)
{
	if(retryCounter > 0) //if we expect some replies
	{
		commands_received_counter ++;
	
		if(commands_received_counter >= commands_sent_in_group)
		{
			retryCounter = 0; //no need to retry previosly sent command.
		}
	}

	for (var regexstring in handlersDataStruct) {
	
		regexp = new RegExp(regexstring, "i");
		
		replyMatch = regexp.exec(message.data);
		if (replyMatch)
		{
			var handlerData = handlersDataStruct[regexstring];
			message.matches = replyMatch;
			
			if(handlerData.customData != undefined)
				message.customData = handlerData.customData;
			
			if(handlerData.handlerMethod != undefined)
				handlerData.handlerMethod(message);
            if(handlerData.privilege!=undefined)
                message.privilege=handlerData.privilege;
			break; //don't search any other accurances in the string. Maybe there will be cases, that it will be needed...
		}
	}	
}

function isQueryCommand(message)
{
	if(message == "" || (message.indexOf("?") != -1))
		return true;

	return false;
}

function func_sendMessage(message)
{
	if(!isQueryCommand(message))
		timeSyncBrowser ++;
	var newMessage = new Object();
	newMessage.content = message;
	newMessage.noRetry = false;
	sendQueue.Enqueue(newMessage);
}

function func_sendMessageNoRetry(message)
{
	if(!isQueryCommand(message))
		timeSyncBrowser ++;
	var newMessage = new Object();
	newMessage.content = message;
	newMessage.noRetry = true;
	sendQueue.Enqueue(newMessage);
}
function func_sendMessageNoWait(a)
{
	updateMultiple("test.cgx?cmd="+a);
}

function func_clearErrorFlag(which)
{
	flag_ResponseError = false;
	flag_HandShakeError = false;
}

function func_setCommunicationEnabled(isEnabled)
{
	flag_EnableCommunication = isEnabled;
}

function func_changePollingInterval(interval)
{
	interval_normal_polling = interval;
}

function CreateHttpCommObj()
{

	httpCommFrame = new Object();
    httpCommFrame.privilege=privilegeUser;
    httpCommFrame.oldprivilege=httpCommFrame.privilege;
	httpCommFrame.addHandler = func_addHandler;
	httpCommFrame.init = func_init;
	httpCommFrame.handle = func_handle;
	httpCommFrame.sendMessage = func_sendMessage;
	httpCommFrame.sendMessageNoRetry = func_sendMessageNoRetry;
	httpCommFrame.sendMessageNoWait = func_sendMessageNoWait;
	httpCommFrame.sendMessageWait = func_sendMessageWait;
	httpCommFrame.addHandShakeSuccessHandler = function(method)
		{
			pHandShakeSuccessHandler = method;	
		};
	httpCommFrame.addHandShakeErrorHandler = function(method)
		{

			pHandShakeErrorHandler = method;	
		};
	httpCommFrame.addNoResponseErrorHandler = function(method)
		{
			pNoResponseErrorHandler = method;	
		};
	httpCommFrame.addAllOutputHandler = function(method)
		{
			pAllOutputHandler = method;			
		};
	httpCommFrame.addDeviceStateChangedHandler = function(method)
		{
			pDeviceStateChangedHandler = method;			
		};		
		
	httpCommFrame.clearErrorFlag = func_clearErrorFlag;
				
	httpCommFrame.SyncQueriesList = new SyncQueriesList();

	httpCommFrame.sendMessageWaitResponse = func_sendMessageWaitResponse;	
	
	httpCommFrame.setCommunicationEnabled = func_setCommunicationEnabled;
	
	httpCommFrame.changePollingInterval = func_changePollingInterval;	
	
	httpCommFrame.Settings = new Object();	
	
	httpCommFrame.Settings.IgnoreConnectionLostErrorWhileWaitingResponse = false;  //if set, connection lost message will not be shown.
	
	httpCommFrame.Settings.NumberOfCommandsSendInGroup = 5;
	
	return httpCommFrame;
}

/* Returns instance of a http object */
function GetHttpCommObj()
{
	return httpCommFrame;
}


function getNextSyncQuery()
{
	if(lastSyncQuery == null)
		httpCommFrame.SyncQueriesList.Begin();

	lastSyncQuery = httpCommFrame.SyncQueriesList.Get();

	return lastSyncQuery;
}


function periodicUpdate() {
	
	var commandObj = null;
	var needRetry = true;
	var delayRetry = false;
	if(!flag_EnableCommunication)//如果使能通信标记为false执行
	{
		return;
	}
	/*如果通信標記為true*/
	if(retryCounter == 0)
	{	
		pollingsUntilRetryCounter = 0;
		commands_sent_in_group = 0;
		commandsToSend.length = 0; //clear the array
		var pulled_commands_counter = 0;
		while(pulled_commands_counter < httpCommFrame.Settings.NumberOfCommandsSendInGroup)
		{
			if(!beginSyncFlag)
			{
				commandObj = sendQueue.Dequeue();
			}
			else
			{
				var nextSyncQuery = httpCommFrame.SyncQueriesList.Get();
				if(nextSyncQuery != null)
				{
					commandObj = {};
					commandObj.content = nextSyncQuery;				
				}
			}
			if(commandObj == null)
				break;
				
			commandsToSend.push(commandObj.content);
			pulled_commands_counter ++;
		}
		
		if(pulled_commands_counter == 0)
		{
			if(beginSyncFlag)
				beginSyncFlag = false;
		
			commands_sent_in_group = 0;			
			needRetry = false;
		}
		else
		{
			commands_sent_in_group = pulled_commands_counter;
			commands_received_counter = 0;
		}
		
		if(needRetry)
			retryCounter = RETRY_COUNT;
	}
	else
	{

		if(pollingsUntilRetryCounter < NUM_OF_POLLINGS_UNTIL_RETRY)
		{
			pollingsUntilRetryCounter ++;
			delayRetry = true;
		}
		else
		{
			pollingsUntilRetryCounter = 0;
			retryCounter --;			
		}
	}
	if(httpComm_WaitForReplay.watchRegxFlag && httpComm_WaitForReplay.CheckTimeOut())
    {
        flag_onlyRecieve = false;
    }
	if(commandsToSend.length == 0 || flag_onlyRecieve || delayRetry)
	{
		console.log("pulled_commands_counter="+pulled_commands_counter);
        console.log("retryCounter="+retryCounter);
        console.log("beginSyncFlag="+beginSyncFlag);
        retryCounter = 0;
        updateMultiple("test.cgx");

	}
	else
	{
		var commands_url = "";
		for(var i = 0; i < commandsToSend.length; i++)
		{
			commands_url = commands_url + "cmd=" + commandsToSend[i] + "&";
		}
		commands_url = commands_url.slice(0,-1); //remove the last '&'
		updateMultiple("test.cgx?" + commands_url);
	}
    cmd_elTime = setTimeout(periodicUpdate, INTERVAL_COMMAND_TIME);
}

function updateMultiple(requestedUrl, userName, userPassword) {
	$.ajax({
		url: requestedUrl,
		context: document.body,
		cache : false,
		timeout:10000,
		// contentType:"application/x-www-form-urlencoded;charset=gb2312",
		data: {
			username :  $(userName).val(),
			password :  $(userPassword).val()
		},
		success: function ( data ) {
		    error_flag=0;
            error_error=false;
			recievedReply = processResponse(data);

			if(recievedReply != null)
			{
				var recievedTimeSync = parseInt(recievedReply.timeSync);

				if(recievedTimeSync > timeSyncBrowser || forceRefresh)
				{
					forceRefresh = false;
					timeSyncBrowser = recievedTimeSync;
					httpCommFrame.SyncQueriesList.Begin();
					beginSyncFlag = true;
					retryCounter = 0;
				}
				if(httpComm_WaitForReplay.watchRegxFlag && recievedReply.command != null)
				{
					if(httpComm_WaitForReplay.Check(recievedReply.command)) //if expected reply received...
						flag_onlyRecieve = false; //allow send data again.
				}				
				
				if(pDeviceStateChangedHandler != null && prev_device_state != recievedReply.state)
				{
					prev_device_state = recievedReply.state;
					arr_state_info = recievedReply.state.split(',');
					pDeviceStateChangedHandler(arr_state_info[0], arr_state_info[1], arr_state_info[2], arr_state_info[3]);
				}
                if(recievedReply.privilege!=null)
                {
                    privilegeUser = parseInt(recievedReply.privilege);
                    httpCommFrame.privilege=privilegeUser;
                    if(privilageflag==0)
                    {
                        httpCommFrame.oldprivilege=httpCommFrame.privilege;
                    }
                    privilageflag=1;
                    if(httpCommFrame.privilege!=httpCommFrame.oldprivilege)
                    {
                        window.location.reload();
                    }

                }
				if(recievedReply.command != "")
				{
					parseAndEnque(recievedReply);

					while((parsedReply = repliesQueue.Dequeue()) != null)
					{
						func_handle(parsedReply);
					}
				}
			}
		},
		error:function (xhr, ajaxOptions, thrownError){
            console.log("xhr.status的状态值"+xhr.status);
            console.log("xhr.statusText字段数据"+xhr.statusText);
            console.log("xhr对象"+xhr);
            //console.log(xhr.error);
            console.log("error_flag掉线（error）数量标识,12将弹出警告"+error_flag);
            console.log("error_error掉线警告标识，true表示弹出过警告"+error_error);
            if(xhr.status==401&&have401==false)
            {
                have401=true;
                httpComm.setCommunicationEnabled(false);
                sendAndWaitCommand("NET-DHCP?");
            }
            if(xhr.statusText=="error"||xhr.statusText=="timeout")
            {
                error_flag=error_flag+1;
                if(error_error==false&&error_flag==12)
                {
                    error_error=true;
                    var TitleStr="";
                    TitleStr +="<div class='txtProperty'></div>";
                    TitleStr +="<table><tr>";

                    TitleStr +="<td><table>";
                    TitleStr +="<div style='max-width: 19px;max-height: 19px' class='icon_cross'>";
                    TitleStr +="</table></td>";

                    TitleStr +="<td><table>";
                    TitleStr +="<td>Please make sure the cable is connected.</td>";
                    TitleStr +="</table></td>";

                    TitleStr +="</tr></table>";
                    $('#kDialogBtnCancel').hide();
                    $('#kDialogBtnOk').hide();
                    showDialogBox(true,true,"Communication Error",TitleStr);
                }
            }
			if(!flag_ResponseError && pNoResponseErrorHandler != null)
			{
				flag_ResponseError = true;
				var err = getAjaxError(xhr, thrownError);
				if(err != UNKNOWN_ERROR)
                {
                    pNoResponseErrorHandler(err);
                }

			}
			if(httpComm_WaitForReplay.watchRegxFlag) //if we in mode - WaitForReplay
			{
				if(!httpCommFrame.Settings.IgnoreConnectionLostErrorWhileWaitingResponse)
				{
					httpComm_WaitForReplay.watchRegxFlag = false; //stop checking for replies
					flag_onlyRecieve = false; //allow update sending commands.
					httpComm_WaitForReplay.timeoutHandler('ERR_NO_RESPONSE'); //report timeout
				}
			}			
		}

	});	
 }

 
function getAjaxError(xhr, thrownError)
{
	var message;
	var statusErrorMap = {
		'400' : "Server understood the request but request content was invalid.",
		'401' : "Unauthorised access.",
		'403' : "Forbidden resouce can't be accessed.",
		'500' : "Internal Server Error.",
		'503' : "Service Unavailable"
	};
	if (xhr.status) {
		message = statusErrorMap[xhr.status];
						if(!message){
							  message="Unknown Error.";
						  }
	}else if(thrownError=='parsererror'){
		message="Parsing XML Request failed.";
	}else if(thrownError=='timeout'){
		message="Request Time out.";
	}else if(thrownError=='abort'){
		message="Request was aborted by the server.";
	}else {
		message=UNKNOWN_ERROR;
	}
	return message;
} 

function RepliesQueue()
{
  this.Stack = new Array();
  this.length = 0;
  this.Enqueue = function(kid, name, parameters, data)
  {
	var newReplyObj = new Object();
	newReplyObj.kid = kid;
	newReplyObj.name = name;	
	newReplyObj.parameters = parameters;
	newReplyObj.data = data;
	
    this.Stack[this.Stack.length] = newReplyObj;
    return this;
  };
  this.Dequeue = function()
  {
    if (this.Stack.length > 0)
    {
      var Result = this.Stack[0];
      this.Stack = this.Stack.slice(1);//删除第一个数组元素
      return Result;
    }
    return null;
  }
}

/*
* 发送碎裂也是一个对象
*
* */
function SendQueue()
{
  this.Stack = new Array();
  this.length = 0;
  this.Enqueue = function(data)
  {
	// Tack the new entry onto the end of the array	
    this.Stack[this.Stack.length] = data;
    return this;
  };
  this.Dequeue = function()
  {
    // Remove the first entry from the array and return it
    if (this.Stack.length > 0)
    {
      var Result = this.Stack[0];	  
      this.Stack = this.Stack.slice(1);
      return Result;
    }
    return null;
  }
}

function SyncQueriesList()
{
	this.Add = function(data)
	{
		this.Stack[this.Stack.length] = data;
		return this;
	};
  
	this.Init = function()
	{
		this.Stack = new Array();
		this.current = 0;
	};
	
	this.Begin = function()
	{
		this.current = 0;
	};
	
	this.ForceRefresh = function()
	{
		this.current = 0;
		forceRefresh = true;		
		window.clearInterval(cmd_elTime);
		periodicUpdate();		
	};
    
	this.Get = function()
	{
		var res = null;
		if (this.Stack != undefined)
		{
			if (this.Stack[this.current]  != undefined)
			{
				res = this.Stack[this.current++];
			}
		}
		return res;
	}  
}


function parseAndEnque(reply)
{
	if(pAllOutputHandler != null)
		pAllOutputHandler(reply.command);
	replies = reply.command.split("\n");
	if (replies.length < 1) return false;

	re = /~(\d\d)@\s?([\w-]+)(.*)/;

	for (var i = 0; i < replies.length; i++) {
		try {
			replyMatch = re.exec(replies[i]);

			if (!replyMatch) 
				return false;
				
			data = replyMatch[0];
			kid = replyMatch[1];
			cmdName = replyMatch[2];
			parameters = replyMatch[3];
			repliesQueue.Enqueue(kid,cmdName,parameters,data);
		}
		catch (e) {		
		}
	}

	return true;
}

function debugStringAsBytes(str)
{
	var bytes = [];

	for (var i = 0; i < str.length; ++i)
	{
		bytes.push(str.charCodeAt(i));
	}

	return bytes.toString();
}

function processResponse(xmlDoc) {

	var ret = null;

	try {
		textElementArr = xmlDoc.getElementsByTagName("data");//获取文本含有此标签的数组

        if(textElementArr.length > 0)
        {
            ret = new Object();
            if(textElementArr[0].childNodes[0].childNodes.length > 0)
                ret.command = textElementArr[0].childNodes[0].childNodes[0].nodeValue;
            else
                ret.command = "";
            if(textElementArr[0].childNodes[1].childNodes.length > 0)
                ret.timeSync = textElementArr[0].childNodes[1].childNodes[0].nodeValue;
            if(textElementArr[0].childNodes[2].childNodes.length > 0)
                ret.state = textElementArr[0].childNodes[2].childNodes[0].nodeValue;
            if(textElementArr[0].childNodes[3].childNodes.length > 0)
                ret.privilege =textElementArr[0].childNodes[3].childNodes[0].nodeValue;
        }
		else
			ret = null;
	}
	catch(error) {
		ret = null;
	}
	
	return ret;
}

//console.log("############### httpCommunications.js was loaded.");
//@ sourceURL=httpCommunications.js