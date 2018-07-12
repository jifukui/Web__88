¡=·?A!CAEaGÅI°K¡M·OQ!SAUÒˇWÅY°[¡]·_a!cAeaerDeviceMessages()
{

	httpComm.addHandler("HTTP-UPLOAD \\d DONE", fileUploadSuccess);
	httpComm.addHandler("RGB .*", fileUploadSuccess);
	httpComm.addHandler("HTTP-UPLOAD \\d ERROR", fileUploadError);
}


function fileUploadSuccess(reply)
{
	if(lastUploadType == "fw")
	{
		httpComm.sendMessage("UPGRADE");
		//httpComm.sendMessage("RESET");		
	}
	
	alert("File uploaded successfuly!");	
}


function fileUploadError(reply)
{
	httpComm.changePollingInterval(INTERVAL_TIME);
	alert("Error uploading file!");
}

function allOutputHandler(data)
{
	var x = $('#CommandsOutput').val() + '\r\n' + data;
	$(' #CommandsOutput ').val(x);
}

function deviceStateChangedHandler(dev_state, dev_substate, stage, progress) //for example: 1,0,0,20 <-- upload,firmware,flash erase,20%
{
	$('#txtBoxDeviceState').val("State: " + dev_state + ", Sub state: " + dev_substate + ", Stage: " + stage + ", Progress: " + progress);	
}

function init_page()
{
	init_default_values();
	httpComm  = GetHttpCommObj();
	registerDeviceMessages();
	httpComm.addHandShakeErrorHandler(handShakeErrorHandler);
	httpComm.addNoResponseErrorHandler(noResponseErrorHandler);		
	init_sync_queries();
	httpComm.init();
	fileUploadInit();
	httpComm.addAllOutputHandler(allOutputHandler);
	httpComm.addDeviceStateChangedHandler(deviceStateChangedHandler);
	
	httpComm.Settings.IgnoreConnectionLostErrorWhileWaitingResponse = true;
}

function fileUploadInit() {
    
	var bar = $('.bar');
	var percent = $('.percent');
	var status = $('#status');

	
	$('#HttpCommUploadIFrame').on("submit", function(event) {
		
		event.preventDefault();	

		var file_name = $('#HttpCommUploadIFrame #HttpCommUploadFile').val();
		if(file_name == '') 
		{
			alert ("you must choose a file");
			return false;
		}		
		
		//Check if it is a known file extention.
		var ext = $('#HttpCommUploadIFrame #HttpCommUploadFile').val().split('.').pop().toLowerCase();
		
		if(ext == "kfw") //firmware
		{
			lastUploadType = "fw";
			httpComm.sendMessageWaitResponse("HTTP-UPLOAD 0", ["HTTP-UPLOAD 0 READY", "HTTP-UPLOAD 0 ERROR"], 25000, responseRecievedHandler, errorHandler);
		}
		else if(ext == "fct") //arm9 firmware
		{
			lastUploadType = "fc";
			httpComm.sendMessageWaitResponse("HTTP-UPLOAD 2", ["HTTP-UPLOAD 2 READY", "HTTP-UPLOAD 2 ERROR"], 200000, responseRecievedHandler, errorHandler);
		}
		else if(ext == "edid") //edid
		{
			lastUploadType = "ed";
			httpComm.sendMessageWaitResponse("HTTP-UPLOAD 3,0,01,0", ["HTTP-UPLOAD 3 READY", "HTTP-UPLOAD 3 ERROR"], 200000, responseRecievedHandler, errorHandler); //input,mask-0x01,safe-mode
		}		
		else //regular file
		{
			lastUploadType = "fs";		
			httpComm.sendMessageWaitResponse("HTTP-UPLOAD 1", ["HTTP-UPLOAD 1 READY", "HTTP-UPLOAD 1 ERROR"], 25000, responseRecievedHandler, errorHandler);		
		}

		function responseRecievedHandler(recieved_msg, expectedRegxIndex)
		{
			httpComm.changePollingInterval(INTERVAL_TIME_UPLOADING);
			//httpComm.setCommunicationEnabled(false);
			
			$('#HttpCommUploadIFrame').ajaxSubmit({
				beforeSubmit: function(formData, jqForm, options) {
					status.empty();
					var percentVal = '0%';
					bar.width(percentVal);
					percent.html(percentVal);					
				},
				uploadProgress: function(event, position, total, percentComplete) {
					var percentVal = percentComplete + '%';
					bar.width(percentVal);
					percent.html(percentVal);
				},
				complete: function(xhr) {			
					httpComm.changePollingInterval(INTERVAL_TIME);
					//httpComm.setCommunicationEnabled(true);
				}
			});
		}

		function errorHandler(recieved_msg)
		{
			alert('Timeout: ' + recieved_msg);
		}
		
		return false;
	});
}	


function handShakeErrorHandler(error_text)
{
	alert(error_text);
	//console.log("############### Handshake error: " + error_text);
}


function noResponseErrorHandler(error_text)
{
	alert(error_text);
	//console.log("############### Response error: " + error_text);
}


function init_default_values()
{
/*
	selectInput("Video", 1, 1, false);
	selectInput("Video", 1, 2, false);
	selectInput("Audio", 1, 1, false);
	selectInput("Audio", 1, 2, false);
*/	
}


function init_sync_queries()
{

	httpComm.SyncQueriesList.Init();
/*
	httpComm.SyncQueriesList.Add("vid? 1");
	httpComm.SyncQueriesList.Add("vid? 2");
	httpComm.SyncQueriesList.Add("aud? 1");
	httpComm.SyncQueriesList.Add("aud? 2");	
*/
}

function sendWaitResponseTest()
{
	httpComm.sendMessageWaitResponse("model?", ["MODEL ..+", "ERR.*"], 5000, okHandler, timeoutHandler);
	//httpComm.sendMessageWaitResponse("not_existing_command?", ["MODEL ..+", "ERR.*"], 5000, okHandler, timeoutHandler);
}

function sendEnteredCommand()
{
	var command = $('#CommandsInput').val();
	httpComm.sendMessage(command);	
}

function okHandler (recieved_msg)
{
	alert('Recieved: ' + recieved_msg);
}

function timeoutHandler (recieved_msg)
{
	alert('Timeout: ' + recieved_msg);
}

//console.log("############### index.js was loaded.");
//@ sourceURL=index.js