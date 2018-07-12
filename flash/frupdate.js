var showLogs = false;
var frupdateTime=40;
var TimeObj;
var sendfile=0;

var openFirmwareDiv = function(){

	$("#contentDiv").load("firmware.html", function(){
		$("#HttpCommUploadFile").change(function(){
			fr_update_choosedFile();		
		});
		
		initUpdate();		
		$("#updateDiv").show();
		showLoading(false);
	});
};

var fr_update_submit_dialog_response = function(dialog_respose)
{
	if(sendfile!=3)
	{
		return false;
	}
	sendfile=4;
	console.log("4");
	// showDialogBox(false, true);
	if(dialog_respose == "CANCEL")
		return false;
	var file_name = $('#HttpCommUploadFile').val();
	var ext = $('#HttpCommUploadFile').val().split('.').pop().toLowerCase();
	if(ext == "lba"||ext=="lb1"||ext=="lb2") //firmware
	{
		if(checkDriverName(file_name))
		{
			lastUploadType = "fw";
            KuiUpgradeprogram(0);
			httpComm.sendMessageWaitResponse("HTTP-UPLOAD 0", ["HTTP-UPLOAD 0 READY", "HTTP-UPLOAD 0 ERROR"], 25000, responseRecievedHandler, errorHandler);
		} else {
			alert ("This is not a valid driver for this device!");
			return false;
		}
	}
	else if(ext=="img")
	{
		lastUploadType = "img";
        KuiUpgradeprogram(1);
		httpComm.sendMessageWaitResponse("HTTP-UPLOAD 0", ["HTTP-UPLOAD 0 READY", "HTTP-UPLOAD 0 ERROR"], 25000, responseRecievedHandler, errorHandler);
	}
	else if(ext == "fct") //arm9 firmware
	{
		if(checkDriverName(file_name))
		{
			lastUploadType = "fc";
			httpComm.sendMessageWaitResponse("HTTP-UPLOAD 2", ["HTTP-UPLOAD 2 READY", "HTTP-UPLOAD 2 ERROR"], 120000, responseRecievedHandler, errorHandler);
		} else {
			alert ("This is not a valid driver for this device!");
			return false;
		}
	}
	else if(ext == "rbf") //Altera file
	{
		if(checkDriverName(file_name))
		{
			lastUploadType = "rb";
			httpComm.sendMessageWaitResponse("HTTP-UPLOAD 1", ["HTTP-UPLOAD 1 READY", "HTTP-UPLOAD 1 ERROR"], 25000, responseRecievedHandler, errorHandler);
			fu_selectStage("0", "0");
		} else {
			alert ("This is not a valid driver for this device!");
			return false;
		}
	}
	else //regular file
	{
		alert("This file is not supported");
		return false;
	}

	function checkDriverName(filename)
	{

		return true;
	}

	function responseRecievedHandler(recieved_msg, expectedRegxIndex)
	{
		if(sendfile!=4)
		{
			return false;
		}
        httpComm.setCommunicationEnabled(false);
		sendfile=5;
		console.log("5");
		httpComm.changePollingInterval(INTERVAL_TIME_UPLOADING);
		var isExplorer =  navigator.userAgent.toLowerCase().indexOf("msie") > 0;
		$('#HttpCommUploadIFrame').ajaxSubmit({
			beforeSubmit:
				function(formData, jqForm, options) {
					if(isExplorer)
					{
						$("#fr_uploadId").html("working...");
						fr_preloaderIsLoading = true;
						fr_launchpreloader();
					}
					else
					{
                        $("#KramerLoadStatus").removeClass("icon_ProcessIdle");
                        $("#KramerLoadStatus").addClass("icon_ProcessCurrent");
						$("#KramerLoadProcess").html("0%");
					}
				},
			uploadProgress:
				function(event, position, total, percentComplete) {
					var percentVal = percentComplete + '%';
					$("#KramerLoadProcess").html(percentVal);

				},
			success:
				function(xhr)
				{
					if(isExplorer)
						fr_stopPreloader();
					httpComm.changePollingInterval(INTERVAL_TIME);
                    UpgradeCloseDialog("OK");
				}
		});
	}

	function errorHandler(recieved_msg)
	{
		//alert('Timeout: ' + recieved_msg);
	}


	function fr_launchpreloader(){
		$("#fr_uploadId").fadeOut(300, function(){
			$("#fr_uploadId").fadeIn(300, function(){
				if(fr_preloaderIsLoading)
					fr_launchpreloader();
			});
		});
	}

	function fr_stopPreloader(){
		/*
		 fr_preloaderIsLoading = false;
		 $("#fr_uploadId").html("done");
		 $("#fr_uploadId").fadeIn(300);
		 */
	}

	$("#fu_selectFile").hide();
	$("#fu_showStatus").show();
	return false;
};

var initUpdate = function(){
    document.getElementById('kDialogBtnOk').style.visibility="visible";
	registerDeviceMessages();
	httpComm.setCommunicationEnabled(true);
	httpComm.addDeviceStateChangedHandler(deviceStateChangedHandler);
	httpComm.Settings.IgnoreConnectionLostErrorWhileWaitingResponse = true;
	
	$("#fu_selectFile").show();
	$("#fu_showStatus").hide();
	
	$('#HttpCommUploadIFrame').on("submit", function(event) {
		var file_name = $('#HttpCommUploadIFrame #HttpCommUploadFile').val();
		if(file_name == '') 
		{
            $('#kDialogBtnCancel').hide();
            $('#kDialogBtnOk').show();
            showDialogBox(true, true, "Error", "You must choose a file", "hideDialogBox");
			return false;
		}
		
		var subtitle = "Click OK to upgrade your device firmware.\r\nDo not interrupt the file transfer before completion.\r\nDoing so may damage the device.";
        document.getElementById("kDialogBtnCancel").innerHTML="CLOSE";
		$('#kDialogBtnCancel').show();
		$('#kDialogBtnOk').show();
		showDialogBox(true, true, "Warning" , subtitle, "fr_update_submit_dialog_response");	
		return false;		
	});
};

var fr_preloaderIsLoading = false;


var startUpdate = function(){
	
};

var stopUpdate = function(){
//httpComm.setCommunicationEnabled(false);
};

var lastUploadType = "";

var registerDeviceMessages = function()
{
	httpComm.addHandler("HTTP-UPLOAD \\d DONE", fileUploadSuccess);
	httpComm.addHandler("HTTP-UPLOAD \\d ERROR", fileUploadError);
	httpComm.SyncQueriesList.Init();
};

var fileUploadSuccess = function(reply)
{
	if(lastUploadType == "fw")
	{
		httpComm.sendMessage("UPGRADE");				
	}
	
	httpComm.sendMessage("RESET");	
	
	fileUploadRefreshTimer();
};

var fileUploadResetTimer = 50; 
var fileUploadRefreshTimer = function(){
	fu_selectStage("99", fileUploadResetTimer + "s");
	fileUploadResetTimer--;
	if( fileUploadResetTimer > 0 )
	{
		setTimeout("fileUploadRefreshTimer();", 1000);
	}
	else
	{
		alert("Firmware Uploaded successfully");
		window.location.reload();
	}
};

var fileUploadError = function(reply)
{
	httpComm.changePollingInterval(INTERVAL_TIME);
	alert("Error uploading file!");
};


var deviceStateChangedHandler = function(dev_state, dev_substate, stage, progress) 
{
	//for example: 1,0,0,20 <-- upload,firmware,flash erease,20%
	// State: 0 - Idle
	// State: 1 - Upload
	
	// Sub state: 0 - Firmware
	// Sub state: 1 - Filesystem
	// Sub state: 2 - External device 0 (ARM 9)
	
	// Stage: 0 - Erase flash A 			(30s)
	// Stage: 1 - Uploading file to device  (31s)
	// Stage: 2 - Erase flash B				(15s)
	// Stage: 3 - Copy to flash				(3:22)

	
	// Progress: 0-100 %
	
	if(dev_state == "1")
	{
		fu_selectStage(stage, progress);
	}
	
	// $('#txtBoxDeviceState').val("State: " + dev_state + ", Sub state: " + dev_substate + ", Stage: " + stage + ", Progress: " + progress);	
	
};


var fu_selectStage = function(stage, progress){
	
	if(showLogs)  console.log(stage + " " + progress);
	$("#fr_uploadImgId").removeClass('iconsProcessCurrent iconsProcessDone');
	$("#fr_writingImgId").removeClass('iconsProcessCurrent iconsProcessDone');
	$("#fr_resetImgId").removeClass('iconsProcessCurrent iconsProcessDone');
	
	
	if(stage=="0") $("#fr_uploadImgId").addClass('iconsProcessCurrent');
	if(stage=="1") $("#fr_uploadImgId").addClass('iconsProcessCurrent');
	if(stage=="2") $("#fr_writingImgId").addClass('iconsProcessCurrent');
	if(stage=="3") $("#fr_writingImgId").addClass('iconsProcessCurrent');
	if(stage=="99") $("#fr_resetImgId").addClass('iconsProcessCurrent');
	
	if(stage == "0" || stage == "1")
	{
		if(progress == "0") progress = "working...";		
		$("#fr_uploadId").html(progress);
		$("#fr_uploadImgId").addClass('iconsProcessCurrent');
	}
	
	if(stage == "2" || stage == "3")
	{	
		$("#fr_uploadId").html('done');
		$("#fr_uploadImgId").addClass('iconsProcessDone');
		$("#fr_writingId").html(progress+"%");
	}
	
	if(stage == "99")
	{
		if(lastUploadType == "fw" || lastUploadType == "rb")
		{
			$("#fr_uploadId").html('done');
			$("#fr_erasingId").html('done');
			$("#fr_writingId").html('done');
			$("#fr_uploadImgId").addClass('iconsProcessDone');
			$("#fr_writingImgId").addClass('iconsProcessDone');
		} else {			
			$("#fr_writingImgId").addClass('iconsProcessDone');
			$("#fr_uploadImgId").addClass('iconsProcessDone');
			$("#fr_writingId").html('done');
		}
		
		$("#fr_resetId").html(progress);
	}
};

var closeUploadDialog = function(){
	$("#contentDiv").show();
	$("#updateDiv").hide();
	// httpComm.setCommunicationEnabled(false);
};
var jifukui_updatefile=function()
{
    sendfile=0;
    if(ligObject.updatafile!="")
    {
		sendfile=1;
        $("#HttpCommUploadIFrame").on("submit",function()
            {
                var a=ligObject.updatafile;
				if(sendfile==1)
				{
					sendfile=2;
                    a=a.replace(/^.*[\\\/]/,"");
                    var b=/(?:\.([^.]+))?$/.exec(a)[0];
                    // var c=a.indexOf(b);
                    // if(c>40)
                    // {
                    //     // alert("error:The file name must be 40 characters or less!");
                    //     $('#kDialogBtnCancel').hide();
                    //     $('#kDialogBtnOk').show();
                    //     showDialogBox(true,true,"Warning","Please select HDMI Output or Analog Output.","hideDialogBox");
                    //     return false;
                    // }
                    var file=document.getElementById("HttpCommUploadFile").files;
                    if(file[0].size>2097152)
                    {
                        $('#kDialogBtnCancel').hide();
                        $('#kDialogBtnOk').show();
                        showDialogBox(true,true,"Warning","The maximum file size is 2MB.","hideDialogBox");
                        return false;
                    }
                    var filetype=a.substr(a.lastIndexOf(".")).toLowerCase();
                    var filename= a.search(/^UPLOAD_KMR_/i);
                    if((filetype==".lba"||filetype==".lb1"||filetype==".lb2")&&filename==0)
                    {
                        document.getElementById("kDialogBtnCancel").innerHTML="CLOSE";
                        $('#kDialogBtnCancel').show();
                        $('#kDialogBtnOk').show();
                        showDialogBox(true,true,"Warning","<div>To upgrade your device firmware, click OK.</div><div>Do not interrupt the file transfer before completion. Doing so may damage the device</div>","jifukui_dialog");
                    }
                    else if(filetype==".img"&&filename==0)
                    {
                        document.getElementById("kDialogBtnCancel").innerHTML="CLOSE";
                        $('#kDialogBtnCancel').show();
                        $('#kDialogBtnOk').show();
                        showDialogBox(true,true,"Warning","<div>To upgrade your device image, click OK.</div><div>Do not interrupt the file transfer before completion. Doing so may damage the device</div>","jifukui_dialog");
                    }
                    else if(filetype==".lba"||filetype==".lb1"||filetype==".lb2")
                    {
                        $('#kDialogBtnCancel').hide();
                        $('#kDialogBtnOk').show();
                        showDialogBox(true,true,"Error","The driver is incompatible with this device","hideDialogBox");
                    }
                    else if(filename==0)
                    {
                        $('#kDialogBtnCancel').hide();
                        $('#kDialogBtnOk').show();
                        showDialogBox(true,true,"Error:","Invalid file.","hideDialogBox");
                    }
                    else
                    {
                        $('#kDialogBtnCancel').hide();
                        $('#kDialogBtnOk').show();
                        showDialogBox(true,true,"Error:","Invalid file","hideDialogBox");
                    }
                    return false;
				}
            }
        )
    }
    else
    {
        if(sendfile==0)
		{
			sendfile=101;
            $("#HttpCommUploadIFrame").on("submit",function(a)
                {
                    if(sendfile==101)
					{
                        $('#kDialogBtnCancel').hide();
                        $('#kDialogBtnOk').show();
                        showDialogBox(true, true, "Error", "You must choose a file", "hideDialogBox");
					}
                    return false;
                }
            )
		}
    }
};
var fr_checkDriverName=function(a){
    var b= false;
    a=a.replace("_","-");
    var c=a.substr(a.lastIndexOf(".")).toLowerCase();
    if(".lba"==c||c==".lb1"||c==".lb2")
    {
        b=true;
    }
    return b;
};
var fr_openUploadStatusDialog=function()
{
    var a;
    a="<table style='margin: 0 auto;'><tbody> <tr>";
    a+="            <td></td>";
    a+="           <td id='fr_filename' width='200px'></td>";
    a+="      <td></td>";
    a+="  </tr>";
    a+="  <tr>";
    a+="      <td></td>";
    a+="      <td width='200px' class='txtSubtitle' style='text-decoration: underline'>Stage</td>";
    a+="      <td class='txtSubtitle' style='text-decoration: underline'>";
    a+="          <div style='width: 150px'>Status</div>";
    a+="      </td>";
    a+="  </tr>";
    a+="  <tr>";
    a+="      <td>";
    a+="          <div id='fr_uploadImgId' class='icon_ProcessIdle'></div>";
    a+="      </td>";
    a+="      <td>Uploading File</td>";
    a+="      <td id='fr_uploadId'>idle</td>";
    a+="  </tr>";
    a+="  <tr>";
    a+="      <td>";
    a+="          <div id='fr_writingImgId' class='icon_ProcessIdle'></div>";
    a+="      </td>";
    a+="      <td>Updating Firmware</td>";
    a+="      <td id='fr_writingId'>idle</td>";
    a+="  </tr>";
    a+="  <tr>";
    a+="      <td>";
    a+="          <div id='fr_resetImgId' class='icon_ProcessIdle'></div>";
    a+="      </td>";
    a+="      <td>Restart Device</td>";
    a+="      <td id='fr_resetId'>idle</td>";
    a+="  </tr>";
    a+="</tbody>";
    return a+="</table>";
};

var jifukui_dialog=function(event)
{
	if(sendfile!=2)
	{
		return false;
	}
	console.log("3");
	sendfile=3;
    if("CANCEL"==event)
    {
        showDialogBox(false, true);
    }
    else
    {
        fr_update_submit_dialog_response("OK");
    }

};

var UpgradeCloseDialog=function(evnt)
{
	if(sendfile!=5)
	{
		return false;
	}
	sendfile=0;
	console.log("0");
    if(evnt=="OK")
    {
		sendMessageNoWait("RESET");
        $("#KramerLoadStatus").removeClass("icon_ProcessCurrent");
		$("#KramerLoadStatus").addClass("icon_ProcessDone");
        $("#KramerLoadProcess").html("done");

		$("#KramerResetStatus").removeClass("icon_ProcessIdle");
        $("#KramerResetStatus").addClass("icon_ProcessDone");
        $("#KramerResetProcess").html("done");

        $("#KramerRestartStatus").addClass("icon_ProcessIdle");
        $("#KramerRestartStatus").addClass("icon_ProcessCurrent");

        FrupdateSettimeout();
    }
    else
    {
        showDialogBox(false, true);
    }
};

var FrupdateSettimeout=function()
{
    if(frupdateTime==0)
    {
        clearTimeout(TimeObj);
        window.location.reload();
    }
    else
    {
        frupdateTime-=1;
    }
    $("#KramerRestartProcess").html(frupdateTime+" s");
    TimeObj=setTimeout("FrupdateSettimeout()",1000);
};

var KuiUpgradeprogram=function (id)
{
    var FileType;
	if(id==0)
		FileType="Uploading Fireware";
	else if(id==1)
		FileType="Uploading Image";
    $('#kDialogBtnCancel').hide();
    $('#kDialogBtnOk').hide();
    var texthtml="";
    texthtml = "<div class='txtProperty'></div>";
    texthtml += "<table>";

	texthtml +="<tr>";
	texthtml +="<td></td>";
    texthtml +="<td><h3 style='text-decoration: underline;margin-bottom: 0px' >Stage</h3></td>";
    texthtml +="<td ><h3 style='text-decoration: underline;margin-bottom: 0px'>Status</h3></td>";
	texthtml +="</tr>";


    texthtml +="<tr>";
    texthtml +="<td class='icon_ProcessIdle' style='width: 19px' id='KramerLoadStatus'></td>";
    texthtml +="<td width='150px'>Uploading File</td>";
    texthtml +="<td id='KramerLoadProcess'>idle</td>";
    texthtml +="</tr>";


    texthtml +="<tr>";
    texthtml +="<td class='icon_ProcessIdle' id='KramerResetStatus'></td>";
    texthtml +="<td>"+FileType+"</td>";
    texthtml +="<td id='KramerResetProcess'>idle</td>";
    texthtml +="</tr>";

    texthtml +="<tr>";
    texthtml +="<td class='icon_ProcessIdle' id='KramerRestartStatus'></td>";
    texthtml +="<td>Restart Device</td>";
    texthtml +="<td id='KramerRestartProcess'>idle</td>";
    texthtml +="</tr>";

    texthtml += "</table>";
    $("#kDialogBoxSubTitle").width(240);
    showDialogBox(true, true, "Upgrade Status", texthtml);
};
//@ sourceURL=frupdate.js