var edid_loaded_from_file = false;
var edid_flag=-1;
var filename="";
var jifukui_dest=[];
var jifukui_edid_state=[];
var isMobile="";
var failfiel=true;
var firstflag=true;
var flag_sendedidcommand=0;
var myScrolledid;
var edidscriptload=["init.js","routeButton.js","mobile_touch.js"];
var edidscriptToLoadIndex = 0;
var edidscriptToLoadReties = 3;
var filehaveloadedid=false;
ligObject.errorEdid=false;
var openEdidDiv = function(value){
    firstflag=true;
    var str = "<div id='propertiesBox'>";
    str += "<div id='contentBox' style='min-width: 676px;min-height: 698px'>";
    str += "<div class='txtTitle'>EDID</div>";
    str += "<table class='edidTable'>";
    str += "<tr>";
    str += "<td >Read From:</td>";
    str += "<td style='padding-left: 33px'>Short Summary</td>";
    str += "<td>Copy to:</td>";
    str += "</tr>";

    str += "<tr>";
    str += "<td id='readFrom' class='edidTableTd'></td>";
    str += "<td class='edidTableTd'>";

    str += "<div id='edidSummary'>";
    str += "<table width='100%' >";
    str += "<tr><td class='edidSummaryTableTd'><div id='edidSumaryData'>Select a Source</div></td></tr>";
    str += "<tr><td class='edidSummaryTableTd' id='edidSumaryFrom'></td></tr>";
    str += "<tr><td class='edidSummaryTableTd' id='edidSumaryTo'></td></tr>";
    str += "<tr><td id='edidSumaryButton' class='actionButton' onclick='edid_CopyEdid();'>COPY</td></tr>";
    str += "</table>";
    str += "</div>";

    str += "</td>";
    str += "<td id='copyTo' class='edidTableTd' style='width: 150px'></td>";
    str += "</tr>";

    str += "</table>";
    str += "</div>";
    str += "</div>";
    $("#contentDiv").html(str);

    $("#edidSumaryButton").hide();
	
	// Add Inputs
	var inputsType = new Array();
	inputsType[0]="HDMI";
	inputsType[1]="HDMI";
	inputsType[2]="HDMI";
	inputsType[3]="HDMI";
	inputsType[4]="HDMI";
	inputsType[5]="HDMI";
    inputsType[6]="HDMI";
    inputsType[7]="HDMI";

    // Add Inputs
    $("#readFrom").append("<div style='margin: 0px 7px' >Inputs Capability</div>");
    // Add Color Space
    $("#readFrom").append("<div><input id='cs_cap' style='width: 20px' type='checkbox' onclick='edid_cs_inputsOnSelection()'>RGB color space only</div>");
    // Add Deep corlor
    $("#readFrom").append("<div><input id='dc_cap' style='width: 20px' type='checkbox' onclick='edid_dc_inputsOnSelection()'>Deep color OFF</div>");
    //Add
    $("#readFrom").append("<div><input id='pcm_cap' style='width: 20px' type='checkbox' onclick='edid_pcm_inputsOnSelection()'>2-channel LPCM only</div>");
    $('#readFrom').append("<div style='background-color:  #484848;width: 219px'><iframe onload='iframeload()' src='edid.html' name='edidiframe' width='215px' height='400px'></iframe></div>");
	var defaultStr = "<div id='default' class='setButton setButtonDisable' style='width: 200px; ' onclick='edid_loadDefaultEdid();'>DEFAULT</div>";
	$("#readFrom").append(defaultStr);

	var fileStr = "";
	if(!isMobile.any)
    {
        fileStr += "<form id='HttpCommUploadIFrame' method='post' enctype='multipart/form-data' name='form1' >";
        fileStr += "<div id='browse' class='setButton setButtonDisable' style='width: 200px;height: auto;' onclick='edid_loadEdidButton();'>File<br>&nbsp;&nbsp;&nbsp;BROWSE...</div>";
        fileStr += "<input  style='visibility: hidden' id='edidFileName' type='file' name='textline'/>";
        fileStr += "</form>";
    }

	$("#readFrom").append(fileStr);
	$("#edidFileName").change(function(){
	    console.log("have change");
		edid_loadEdidFromFile();
	});



	$("#copyTo").append("<table><tr><td><div><input id='selectAllCb' onclick='edid_selectAllInputs();' type='checkbox'/>Inputs</div></td></tr></table>");//<td><div style='cursor: pointer' class='iconLock'onclick='SetLock()'></div></td>
	for(var i=0;i<ligObject.InputCounts;i++)
	{
		var id="cp_inputs_"+i;
		$("#copyTo").append("<div id='"+id+"' />");
		var rb = new jifukui_routeButton("rb_cp_inputs"+i);
		rb.index = (i+1);
		rb.showExpanded = false;
		// Labels
		rb.labelInfoList[0] = "Input "+(i+1);
		rb.labelInfoList[1] = "~" + inputsType[i];
		rb.actionButtonList[0]="";//<div class='iconLock'></div>
		rb.groupId = "cp_inputs";
		rb.onAction = edid_cp_inputsOnSelection;
		rb.create(id);
	}
	showLoading(false);
    edid_loadDefaultEdid();
    //edid_init_sync_queries();
};

var edid_init_sync_queries = function()
{
	httpComm.setCommunicationEnabled(false);
    httpComm.Settings.NumberOfCommandsSendInGroup =4;
	httpComm.addHandler("DISPLAY", edidDisplayHandler);
	httpComm.addHandler("SET-IN-CAP \\d,\\d,\\d", inportCapHandler);
    httpComm.addHandler("INPUT-TYPE ", edidSignalModeHandler);
    //httpComm.addHandler("LOCK-EDID \\d,\\d", edidLockModeHandler);
    httpComm.addHandler("LOCK-FP",AllLockModeHander);
	httpComm.SyncQueriesList.Init();
	httpComm.SyncQueriesList.Add("DISPLAY?");
	httpComm.SyncQueriesList.Add("SET-IN-CAP?");
    httpComm.SyncQueriesList.Add("INPUT-TYPE?");
    /*
    httpComm.SyncQueriesList.Add("LOCK-EDID? 1");
    httpComm.SyncQueriesList.Add("LOCK-EDID? 2");
    httpComm.SyncQueriesList.Add("LOCK-EDID? 3");
    httpComm.SyncQueriesList.Add("LOCK-EDID? 4");
    httpComm.SyncQueriesList.Add("LOCK-EDID? 5");
    httpComm.SyncQueriesList.Add("LOCK-EDID? 6");
    httpComm.SyncQueriesList.Add("LOCK-EDID? 7");
    httpComm.SyncQueriesList.Add("LOCK-EDID? 8");
    */
    httpComm.SyncQueriesList.Add("LOCK-FP?");//AFV模式
	httpComm.setCommunicationEnabled(true);
	refreshCommands();
};

var edidDisplayHandler = function(reply){
	var rep = reply.parameters.split(',');
    var btn;
    var str;
    jifukui_edid_state=rep;
    if(rep.length==ligObject.OutputCounts)
    {
        for(var i=0;i<rep.length;i++)
        {
            btn = edidiframe.window.routeButton.getObjById("rb_outputs" + i);
            if(btn!=null)
            {
                if (rep[i]==0)
                {
                    btn.actionButtonList[0] =btn.actionButtonList[0].replace("routeControlTextLabel1","routeControlTextLabel3");

                }else
                {
                    btn.actionButtonList[0] =btn.actionButtonList[0].replace("routeControlTextLabel3","routeControlTextLabel1");
                }
                btn.refresh();
            }
        }
    }
};

var inportCapHandler = function(reply){
    var rep = reply.parameters.split(',');
    var cs = parseInt(parseInt($.trim(rep[1])));
    var dc = parseInt(parseInt($.trim(rep[2])));
    var pcm=parseInt(parseInt($.trim(rep[0])));
    var btn_cs =document.getElementById("cs_cap");
    var btn_dc =document.getElementById("dc_cap");
    var btn_pcm=document.getElementById("pcm_cap");
    if(btn_cs!=null)
    {
        if(cs==1)
        {
            btn_cs.checked=true;
        }
        else
        {
            btn_cs.checked=false;
        }
    }
    if(btn_dc!=null)
    {
        if(dc==1)
        {
            btn_dc.checked=true;
        }
        else
        {
            btn_dc.checked=false;
        }
    }
    if(btn_pcm!=null)
    {
        if (pcm==1)
        {
            btn_pcm.checked=true;
        }
        else
        {
            btn_pcm.checked=false;
        }
    }
};

var edidSignalModeHandler = function(reply)
{
    var rep = reply.parameters.split(',');
    var btn;
    var btn1;
    var displayStr;
    if(rep.length==ligObject.OutputCounts)
    {
        for(var i=0;i<rep.length;i++)
        {
            btn = routeButton.getObjById("rb_cp_inputs" + i);
            btn1=edidiframe.window.routeButton.getObjById("rb_inputs" + i);
            displayStr  = (parseInt(parseInt($.trim(rep[i]))))?"HDMI":"DVI";
            btn.labelInfoList[1] = "~" + displayStr;
            btn1.labelInfoList[1] = "~" + displayStr;
            btn.refresh();
            btn1.refresh();
        }
    }

};

var edidLockModeHandler=function(reply)
{
    var rep = reply.parameters.split(',');
    var stageId = parseInt(parseInt($.trim(rep[0])));
    var mode=parseInt(parseInt($.trim(rep[1])));
    var btn = routeButton.getObjById("rb_cp_inputs" + (stageId-1));
   if(btn!=null)
   {
       if(mode==1)
       {
           btn.actionButtonList[0]="<div class='iconLock'></div>";
       }
       else
       {
           btn.actionButtonList[0]="<div class=''></div>";
       }
       btn.refresh();
   }

};

var edid_loadEdidFromFile = function(){
    edid_loaded_from_file = true;
    var file_name = document.forms['HttpCommUploadIFrame']['edidFileName'].files[0];
    filename=file_name;
    var re=/.bin$/i;
    var SafariFlag=navigator.userAgent.search("Safari");
    if(typeof  FileReader=="undefined")
    {
        SafariFlag=true;
    }
    else
    {
        SafariFlag=false;
    }
    if(parseInt(file_name.size)%128!=0)
    {
        $('#kDialogBtnCancel').hide();
        $('#kDialogBtnOk').show();
        showDialogBox(true,true,"Warning","File type error.","hideDialogBox");
        return false
    }
    if(re.test(file_name.name))
    {
        failfiel=true;
        if((!isMobile.any)&&(!SafariFlag))
        {
            edid_flag=2;
            edidiframe.window.routeButton.setSelectedAllGroup ("outputs",false);
            edidiframe.window.routeButton.setSelectedAllGroup ("inputs",false);
            $("#default").addClass("setButtonDisable");
            $("#browse").removeClass("setButtonDisable");
            var eFrom = "FROM<BR/>File: <BR/><div style='word-break: break-all'><strong>"+file_name.name + "</strong></div>";
            $("#edidSumaryFrom").html(eFrom);
            var reader;
            reader = new FileReader();
            reader.readAsArrayBuffer(file_name);
            reader.onprogress=function () {
            };
            reader.onload= function () {
                var aByte, byteStr;
                result = new Uint8Array( reader.result);
                var edidText = "";
                for (n = 0; n < result.length; ++n)
                {
                    aByte = result[n];
                    byteStr = aByte.toString(16);
                    if (byteStr.length < 2) {
                        byteStr = "0" + byteStr;
                    }
                    edidText += byteStr;
                }
                var  edid = new EdidReader("file_response.dat");
                ligObject.errorEdid=false;
                edid.onEdidLoaded = edidEdidLoaded;
                edid.onEdidError = edidEdidError;
                edid.setEdidData(edidText);
                edid_getEdidTo();
            };

            reader.onerror=function () {
                if(evt.target.error.name == "NotReadableError")
                {
                }
            };

        }
        else
        {
            console.log("手機？蘋果瀏覽器?");
        }
    }
    else
    {
        if(failfiel)
        {
            if(firstflag)
            {
                // alert("File type error");
                $('#kDialogBtnCancel').hide();
                $('#kDialogBtnOk').show();
                showDialogBox(true,true,"Warning","File type error.","hideDialogBox");
                firstflag=false;
            }
            else
            {
                firstflag=true;
            }
        }
    }
};

var edid_loadEdidButton = function(){
    $('#edidFileName').click();
};

var edid_selectAllInputs = function(){
	var ch = $("#selectAllCb").attr('checked');
	routeButton.setSelectedAllGroup("cp_inputs", ch);	
	edid_getEdidTo();
};

var _edid_actualSourceType = 0;
var _edid_actualOutput = 0;
var _edid_actualInput= 0;

var edid_loadDefaultEdid = function(){
    edid_flag=1;
    $("#default").removeClass("setButtonDisable");
    $("#browse").addClass("setButtonDisable");
	edid_loaded_from_file = false;
	_edid_actualSourceType = 2; //Default
    if(edidiframe.window.routeButton!=null)
    {
        edidiframe.window.routeButton.setSelectedAllGroup ("outputs",false);
        edidiframe.window.routeButton.setSelectedAllGroup ("inputs",false);
    }
	edid_getEdidFrom(2,0,true);
	edid_getEdidTo();
};


var edid_inputsOnSelection=function(id){
    edid_flag=-2;
    edid_loaded_from_file = false;
    _edid_actualSourceType = 0;
    edidiframe.window.routeButton.setSelectedAllGroup ("outputs",false);
    edidiframe.window.routeButton.setSelectedAllGroup ("inputs",false);
    if($("#default").hasClass("setButtonDisable"))
    {
    }
    else
    {
        $("#default").addClass("setButtonDisable")
    }
    if($("#browse").hasClass("setButtonDisable"))
    {
    }
    else
    {
        $("#browse").addClass("setButtonDisable")
    }
    edidiframe.window.routeButton.setSelected(id, true);
    _edid_actualInput = parseInt(id.substring(id.length - 1))+1;
    edid_getEdidFrom(0,parent._edid_actualInput,true);
   edid_getEdidTo();
};

var edid_outputsOnSelection = function(id){

    var number;
    number=id.match(/\d+/g);
    if(jifukui_edid_state[number]==1)
    {
        edid_flag=-1;
        edid_loaded_from_file = false;
        _edid_actualSourceType = 1;
        edidiframe.window.routeButton.setSelectedAllGroup ("outputs",false);
        edidiframe.window.routeButton.setSelectedAllGroup ("inputs",false);
        if($("#default").hasClass("setButtonDisable"))
        {
        }
        else
        {
            $("#default").addClass("setButtonDisable")
        }
        if($("#browse").hasClass("setButtonDisable"))
        {
        }
        else
        {
            $("#browse").addClass("setButtonDisable")
        }
        edidiframe.window.routeButton.setSelected(id, true);
        _edid_actualOutput = parseInt(id.substring(id.length - 1))+1;
        edid_getEdidFrom(1,_edid_actualOutput,true);
        edid_getEdidTo();
    }
    else
    {
        // alert("No load");
        if(edid_flag==1)
        {
            edid_loadDefaultEdid();
        }
        else if(edid_flag==2)
        {
            edid_loadEdidFromFile();
        }
        else if(parent.edid_flag==-1)
        {
            edid_getEdidFrom(1,parent._edid_actualOutput,true);
        }
        else if(edid_flag==-2)
        {
            edid_getEdidFrom(0,_edid_actualInput,true);
        }
    }
};

var edid_cp_inputsOnSelection=function(id){
    var btn;
    btn = routeButton.getObjById(id);
    if(btn!=null)
    {
        if(edid_flag===1)
            $("#default").removeClass("setButtonDisable");
        else if(edid_flag===2)
            $("#browse").removeClass("setButtonDisable");
        routeButton.togleSelected(id);
        edid_getEdidTo(id);
        $("#selectAllCb").attr("checked",false);
    }
};

var edid_cs_inputsOnSelection=function(){
    var status=document.getElementById("cs_cap").checked;
    if(edid_flag===1)
        $("#default").removeClass("setButtonDisable");
    else if(edid_flag===2)
        $("#browse").removeClass("setButtonDisable");
    if (status)
        sendAndWaitCommand("SET-IN-CAP 0,0,1");
    else
        sendAndWaitCommand("SET-IN-CAP 0,0,0");
    edid_debug_query_count=0;
    httpComm.setCommunicationEnabled(true);
};

var edid_dc_inputsOnSelection=function(){
    var status=document.getElementById("dc_cap").checked;
    if(edid_flag===1)
        $("#default").removeClass("setButtonDisable");
    else if(edid_flag===2)
        $("#browse").removeClass("setButtonDisable");
    if (status)
        sendAndWaitCommand("SET-IN-CAP 0,1,1");
    else
        sendAndWaitCommand("SET-IN-CAP 0,1,0");
    edid_debug_query_count=0;
    httpComm.setCommunicationEnabled(true);
};

var edid_pcm_inputsOnSelection=function(){
    var status=document.getElementById("pcm_cap").checked;
    if(edid_flag===1)
        $("#default").removeClass("setButtonDisable");
    else if(edid_flag===2)
        $("#browse").removeClass("setButtonDisable");
    if (status)
        sendAndWaitCommand("SET-IN-CAP 0,2,1");
    else
        sendAndWaitCommand("SET-IN-CAP 0,2,0");
    edid_debug_query_count=0;
    httpComm.setCommunicationEnabled(true);
};

var edid_getEdidFrom = function(source, id,isSend){
    if (isSend)
    {
        var resp = sendAndWaitCommand("HTTP-DOWNLOAD 0," + source + "," + id);
        $("#edidSumaryData").html("Loading EDID...");
        if (resp.indexOf("ERR") != -1)
        {
            $("#edidSumaryData").html("ERROR GETING EDID");
        }
        else
        {
            var edid = new EdidReader("file_response.dat");
            ligObject.errorEdid=false;
            edid.onEdidLoaded = edidEdidLoaded;
            edid.onEdidError = edidEdidError;
            edid.load();
        }
    }
	var src = (source==1)?"Output"+_edid_actualOutput:(source==2)?"Default":"Input"+_edid_actualInput;
	var eFrom = "FROM<BR/> " + src;
	$("#edidSumaryFrom").html(eFrom);
};

var edid_getEdidTo = function(id){
	var dest= edid_getSelectedDestinations();
	var eTo = "Select a destination";
    if(edid_loaded_from_file)
    {
        $("#edidSumaryButton").html("UPLOAD");
        _edid_actualSourceType = 3;
    }
    else
    {
        $("#edidSumaryButton").html("COPY");
    }
    if(!ligObject.errorEdid)
    {
        if(dest == ""){
            $("#edidSumaryButton").hide();
        }
        else {
            $("#edidSumaryButton").show();
            eTo = " TO <br/>" +dest;
        }
    }
    else
    {
        $("#edidSumaryButton").hide();
    }
    $("#edidSumaryTo").html(eTo);
};

var edidEdidLoaded = function(edidObj){
	var info = "<table width='100%'>";
	info+= "<tr><td class='edidSumaryDataTitle'>" + edidObj.getName()+"</td></tr>";
	var res = edidObj.getNativeResolution();
	info+= "<tr><td>" + res.horizontal + "x" + res.vertical +"</td></tr>";
	if(edidObj.getDeepColor() != "No supported")
		info+= "<tr><td>Deep Color</td></tr>";
	if(edidObj.getAudioChannels()>0)
	{
		if(edidObj.getAudioChannels()>2)
			info+= "<tr><td>Multichannel audio</td></tr>";
		else
			info+= "<tr><td>2 channels Audio</td></tr>";
	}
	info+= "<tr><td class='edidSumaryDataLen'>" + edidObj.getLength()+"</td></tr>";
	info+= "</table>";
	$("#edidSumaryData").html(info);
};

var edidEdidError = function(){
    ligObject.errorEdid=true;
	$("#edidSumaryData").html("Error Loading EDID");
};

var edid_getSelectedDestinations = function(){
	var selectedInputs = routeButton.getAllGroup("cp_inputs");
	var dests = "Input";
	var inpList = "";
	var count = 0;
    var num=0;
    var btn;
    jifukui_dest=[];
	for(var i=0;i<selectedInputs.length;i++)
	{
        btn = routeButton.getObjById("rb_cp_inputs"+i);
		if(selectedInputs[i].isSelected&&(btn.actionButtonList[0].search("iconLock")==-1)){
			count++;		
			inpList += (i+1) +" ";
		}
        if(selectedInputs[i].isSelected){
            jifukui_dest[num]=parseInt(i)+1;
            num++;
        }
	}
	if(count > 1)
		dests+="s";
		
	dests += " " + inpList;
	if(count==0)
		dests="";
	return dests;
};

var edid_getMaskDestinations = function()
{
	var selectedInputs = routeButton.getAllGroup("cp_inputs");
	var mask = "";
    var btn;
	for(var i=0;i<selectedInputs.length;i++)
	{
        btn = routeButton.getObjById("rb_cp_inputs"+i);
		if(selectedInputs[i].isSelected&&(btn.actionButtonList[0].search("iconLock")==-1))
			mask += "1";
		else
			mask += "0";
	}
	mask = mask.split("").reverse().join("");
	return "0x" + parseInt(mask,2).toString(16);
};

var edid_index_scrous=0;
var edid_input_mask=0;
var edid_CopyEdid = function(){
    flag_sendedidcommand=1;
	var mask = edid_getMaskDestinations();
    edid_input_mask=mask;
    edid_safe_mode = 0;//默认0不修改后128字节数据
    document.getElementById("kDialogBtnCancel").innerHTML="CLOSE";
    $('#kDialogBtnCancel').show();
    $('#kDialogBtnOk').show();
    var preventText = "<div><input onchange='edid_safe_modeChange(event);' type='checkbox' style='width: 10px'/>Add audio (stereo) to the selected EDID?</div>";
	if(_edid_actualSourceType == 3)
	{
        filehaveloadedid=true;
	    flag_sendedidcommand=23;
        if(ligObject.DVIEdid)
        {
            showDialogBox(true,true, "EDID", "Are you sure you want to upload this file to selected inputs? "+preventText, "SendEdidFileComand");
        }
        else
        {
            // edid_safe_mode = 1;
            showDialogBox(true,true, "EDID", "Are you sure you want to upload this file to selected inputs? ", "SendEdidFileComand");
        }
	}
	else	
	{
	    flag_sendedidcommand=21;
		if(_edid_actualSourceType == 1)
            edid_index_scrous = _edid_actualOutput;
		else if(_edid_actualSourceType == 0)
            edid_index_scrous = _edid_actualInput;
		else {
            edid_index_scrous = 1;
		}
        if(ligObject.DVIEdid)
        {
            showDialogBox(true,true, "EDID", "Are you sure you want to copy this edid to selected inputs? "+preventText,"CopyEdidCommand");
        }
        else
        {
            // edid_safe_mode = 1;
            showDialogBox(true,true, "EDID", "Are you sure you want to copy this edid to selected inputs? ","CopyEdidCommand");
        }
	}
};

var SendEdidFileComand=function(reply)
{
    if(flag_sendedidcommand!=23)
    {
        return false;
    }
    flag_sendedidcommand=33;
    showDialogBox(false, false);
    if(reply=="OK")
    {
        edid_uploadEdidFromFile();
    }
    console.log(" jifukui 31");
};

var edid_safe_mode = 1;//1添加音频块0不添加音频块
var edid_safe_modeChange = function(evt){
    var val = evt.target.checked;
    edid_safe_mode = (val)?1:0;
};

var edid_uploadEdidFromFile = function(){
	$('#HttpCommUploadIFrame').on("submit", function(event) {
		event.preventDefault();
		var file_name =filename; //$('#HttpCommUploadIFrame #edidFileName').val();
		if(file_name == '') 
		{
            $('#kDialogBtnCancel').hide();
            $('#kDialogBtnOk').show();
            showDialogBox(true, true, "Error", "You must choose a file", "hideDialogBox");
			return false;
		}
		var mask = edid_getMaskDestinations();
        if(filehaveloadedid)
        {
            httpComm.sendMessageWaitResponse("HTTP-UPLOAD 3,0,"+mask+","+edid_safe_mode, ["HTTP-UPLOAD 3 READY", "HTTP-UPLOAD 3 ERROR"], 200000, responseRecievedHandler, errorHandler);
            filehaveloadedid=false;
        }
		function responseRecievedHandler(recieved_msg, expectedRegxIndex)
		{
			httpComm.changePollingInterval(INTERVAL_TIME_UPLOADING);
			$('#HttpCommUploadIFrame').ajaxSubmit({
				beforeSubmit: function(formData, jqForm, options) {
				},
				uploadProgress: function(event, position, total, percentComplete) {
				},
				complete: function(xhr) {

					httpComm.changePollingInterval(INTERVAL_TIME);
                    var TitleStr="";
                    TitleStr +="<div class='txtProperty'></div>";
                    TitleStr +="<table><tr>";

                    TitleStr +="<td><table>";
                    TitleStr +="<div style='max-width: 19px;max-height: 19px' class='icon_right'>";
                    TitleStr +="</table></td>";

                    TitleStr +="<td><table>";
                    TitleStr +="<td>The EDID was copied successfully.</td>";
                    TitleStr +="</table></td>";

                    TitleStr +="</tr></table>";

                    $('#kDialogBtnCancel').hide();
                    $('#kDialogBtnOk').show();
                    showDialogBox(true,true,"Message",TitleStr,"hideDialogBox");
				},
				error: function (xhr, ajaxOptions, thrownError) {
				}
			});
		}

		function errorHandler(recieved_msg)
		{
            $('#kDialogBtnCancel').hide();
            $('#kDialogBtnOk').show();
            showDialogBox(true,true,"Warning","EDID is invalid or not supported.","hideDialogBox");
		}
		
		return false;
	});
	$("#HttpCommUploadIFrame").submit();
	return false;
};

var SetLock=function()
{
    var btn;
    var str;
    for(var i=0;i<jifukui_dest.length;i++)
    {
        btn = routeButton.getObjById("rb_cp_inputs"+(parseInt(jifukui_dest[i])-1));
        str="LOCK-EDID "+jifukui_dest[i]+",";
        if(btn.actionButtonList[0].search("iconLock")!=-1)
        {
            btn.actionButtonList[0]="<div class=''></div>";
            str=str+0;
        }
        else
        {
            btn.actionButtonList[0]="<div class='iconLock'></div>";
            str=str+1;
        }
        sendAndWaitCommand(str);
        btn.refresh();
        edid_getEdidTo(parseInt(jifukui_dest[i])-1);
    }

};

var CopyEdidCommand=function(reply)
{
    if(flag_sendedidcommand==21)
    {
        flag_sendedidcommand=31;
        if(reply=="OK")
        {
            var resp = sendAndWaitCommand("CPEDID "+_edid_actualSourceType+","+edid_index_scrous+","+"0"+"," +edid_input_mask+","+edid_safe_mode);
            if(resp.indexOf("ERR") > -1)
            {
                $('#kDialogBtnCancel').hide();
                $('#kDialogBtnOk').show();
                showDialogBox(true,true,"Warning","EDID is invalid or not supported.","hideDialogBox");
            }
            else {
                var TitleStr="";
                TitleStr +="<div class='txtProperty'></div>";
                TitleStr +="<table><tr>";

                TitleStr +="<td><table>";
                TitleStr +="<div style='max-width: 19px;max-height: 19px' class='icon_right'>";
                TitleStr +="</table></td>";

                TitleStr +="<td><table>";
                TitleStr +="<td>The EDID was copied successfully.</td>";
                TitleStr +="</table></td>";

                TitleStr +="</tr></table>";

                $('#kDialogBtnCancel').hide();
                $('#kDialogBtnOk').show();
                showDialogBox(true,true,"Message",TitleStr,"EDIDCopyhideDialogBox");
            }
        }
        else
        {
            showDialogBox(false);
        }
    }
};

function iframeload()
{
    edidscriptToLoadIndex = 0;
    edidiframe.window.edidloaded();
}
var EDIDCopyhideDialogBox=function (reply) {
    if(reply=="OK")
    {
        $('#kDialogBtnOk').unbind();
        showDialogBox(false);
    }
};
//@ sourceURL=edid.js