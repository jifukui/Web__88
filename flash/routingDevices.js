var routingDeviceDryContacts = 0x02;// NONE OUT0 ECHO
var num_btn=[0,0,0,0,0,0];
var num_module=[0,0,0,0,0,0];
var type_module=[[1,2,3,4,5,6,7,8],[1,2,3,4,5,6,7,8],[1,2,3,4,5,6,7,8],[1,2,3,4,5,6,7,8],[1,2,3,4,5,6,7,8],[1,2,3,4,5,6,7,8]];
var device_name=["a","b","c","d","e","f","g","h"];

var routeSwitchDevice = function(id, obj){
    var command, i,num;
    num=parseInt(num_btn[id]);
	if(jifukui_hdcp_echo_mode==0)
    {
        var actived = $("#"+obj.id).hasClass("iconStatusSwithDevice");
        _routing_actualInput = parseInt(id)+1;
        var content = "";

        if(actived)
            content += routingCreateSwitchDeviceButtons(id);
        else
        {
            content +="No device detected!!!";
            jifukui_hdcp_echo_mode=2;
            return;
        }
        content += "<div class='txtProperty'></div>";
        content += routingCreateSwitchDeviceTable(id);
        $('#kDialogBtnCancel').show();
        $('#kDialogBtnOk').show();
        showDialogBox(true,false,device_name[id]  , content, "routeCloseDialog");
        routingGetDryContacts(id);
        httpComm.Settings.NumberOfCommandsSendInGroup = num+6;//<24
        httpComm.setCommunicationEnabled(false);
        httpComm.addHandler("PROG-ACTION ", routingBtnStateHandler);
        httpComm.addHandler("REMOTE-INFO ", remoteInfoHandler);
        httpComm.SyncQueriesList.Init();
        id=parseInt(id)+1;
        for(i=1;i<=num;++i)
        {
            command="PROG-ACTION? 0,"+id+","+i;
            httpComm.SyncQueriesList.Add(command);
        }
        httpComm.SyncQueriesList.Add("REMOTE-INFO? 0,1");
        httpComm.SyncQueriesList.Add("REMOTE-INFO? 0,2");
        httpComm.SyncQueriesList.Add("REMOTE-INFO? 0,3");
        httpComm.SyncQueriesList.Add("REMOTE-INFO? 0,4");
        httpComm.SyncQueriesList.Add("REMOTE-INFO? 0,5");
        httpComm.SyncQueriesList.Add("REMOTE-INFO? 0,6");
        routing_debug_query_count=0;
        httpComm.setCommunicationEnabled(true);
    }
    jifukui_hdcp_echo_mode=2;
}


var routingBtnStateHandler = function(reply)
{
	console.log("StepIn Btn status >> "+reply.parameters+" in="+_routing_actualInput);
	var actInput=reply.parameters.split(',')[1];
    var but_id=reply.parameters.split(',')[2];
    var btn_name1,btn_name2,btn_name3;
	if (actInput==_routing_actualInput)
	{
		var action = reply.parameters.split(',')[3];
	 	action = $.trim(action);		
		var actionVal = parseInt(action);
		btn_name1="#routingDeviceDryContacts_"+but_id+"_1";
        btn_name2="#routingDeviceDryContacts_"+but_id+"_2"
        btn_name3="#routingDeviceDryContacts_"+but_id+"_3"
		routingDeviceDryContacts=actionVal;
		
		if (routingDeviceDryContacts&03)
        {
            $(btn_name1).removeClass("routingDeviceDryContactsIconSelected");
        }
		else
        {
            $(btn_name1).addClass("routingDeviceDryContactsIconSelected");
        }
		if (routingDeviceDryContacts&0x02)
        {
            $(btn_name2).addClass("routingDeviceDryContactsIconSelected");
        }
		else
        {
            $(btn_name2).removeClass("routingDeviceDryContactsIconSelected");
        }
		if (routingDeviceDryContacts&0x01)
        {
            $(btn_name3).addClass("routingDeviceDryContactsIconSelected");
        }
		else
        {
            $(btn_name3).removeClass("routingDeviceDryContactsIconSelected");
        }
  	}
}



var remoteInfoHandler = function(reply){
    var i;
	var rep = reply.parameters.split(',');
    console.log(rep);

	var stageId = parseInt(parseInt(rep[1]));
	var connected = $.trim(rep[2]);
	var modelName = $.trim(rep[3]);
    device_name[stageId-1]=modelName;
	var crrInput = $.trim(rep[4]);
    var capabilities=$.trim(rep[5]);
    num_module[stageId-1]=$.trim(rep[6]);
    num_btn[stageId-1]= $.trim(rep[7]);
	for(i=0;i<num_module[(stageId-1)];++i)
    {
        type_module[(stageId-1)][i]=$.trim(rep[(8+i)]);
    }
	var btn = routeButton.getObjById("rb_inputs" + (stageId-1));
	if(btn!=null)
    {
		if(connected == "1")
		{
			if ($("#inputDeviceConfig"+(stageId-1)).hasClass("iconStatusSwithDeviceDisabled"))
			   	btn.actionButtonList[0] = btn.actionButtonList[0].replace("iconStatusSwithDeviceDisabled","iconStatusSwithDevice");		
			else if ($("#inputDeviceConfig"+(stageId-1)).hasClass("iconStatusSwithDevice")==false)
				$("#inputDeviceConfig"+(stageId-1)).addClass("iconStatusSwithDevice");
			if(_routing_actualInput == stageId)
			{
				routingDeviceSwitchClicked(crrInput, stageId-1,0);
			}	
		}
		else
		{
			if ($("#inputDeviceConfig"+(stageId-1)).hasClass("iconStatusSwithDevice"))
			   	btn.actionButtonList[0] = btn.actionButtonList[0].replace("iconStatusSwithDevice","iconStatusSwithDeviceDisabled");		
			else if ($("#inputDeviceConfig"+(stageId-1)).hasClass("iconStatusSwithDeviceDisabled")==false)
				$("#inputDeviceConfig"+(stageId-1)).addClass("iconStatusSwithDeviceDisabled");
							
		}
		btn.refresh();
	}else
	{

	}	
}



var routingGetDryContacts = function(id)
{	
	var i=0;
	var actIndex = i+1;
	var nid = parseInt(id) + 1;
	var params = sendAndWaitCommand("PROG-ACTION? 0,"+nid+","+actIndex);	
	
	var action = params.split(',')[3];
	action = $.trim(action);
	
	var actionVal = parseInt(action);
	
	routingDeviceDryContacts=actionVal;
	if (routingDeviceDryContacts&0x03)
		$("#routingDeviceDryContacts_1_1").removeClass("routingDeviceDryContactsIconSelected");
	else
		$("#routingDeviceDryContacts_1_1").addClass("routingDeviceDryContactsIconSelected");
	if (routingDeviceDryContacts&0x02)
		$("#routingDeviceDryContacts_1_2").addClass("routingDeviceDryContactsIconSelected");
	else
		$("#routingDeviceDryContacts_1_2").removeClass("routingDeviceDryContactsIconSelected");
	if (routingDeviceDryContacts&0x01)
		$("#routingDeviceDryContacts_1_3").addClass("routingDeviceDryContactsIconSelected");
	else
		$("#routingDeviceDryContacts_1_3").removeClass("routingDeviceDryContactsIconSelected");
}



var routingCreateSwitchDeviceButtons = function(inputId){
    var num;
    var id_stepin;
    var i;
    var type;
	var content = "<table>";
	content +="<tr>";
    for(i=0;i<num_module[inputId];i++)
    {
        num=i+1;
        id_stepin="routingDeviceSwitch"+num;

        if(type_module[inputId][i]==0)
        {
            type="    ";
        }
        else if(type_module[inputId][i]==1)
        {
            type="DVI";
        }
        else if(type_module[inputId][i]==2)
        {
            type="HDMI";
        }
        else if(type_module[inputId][i]==3)
        {
            type="DP";
        }
        else if(type_module[inputId][i]==4)
        {
            type="HDBT";
        }
        else if(type_module[inputId][i]==5)
        {
            type="SDI";
        }
        else if(type_module[inputId][i]==6)
        {
            type="VGA";
        }
        else if(type_module[inputId][i]==7)
        {
            type="DGKat";
        }
        else
        {
            type="    ";
        }
        content +="<td id='"+id_stepin+"' class='routingDeviceSwitcTableIcon' onclick='routingDeviceSwitchClicked("+num+","+inputId+",1);'>"+type+"</td>";
    }
	content +="</tr>";	
	content += "</table>";
	return content;
}



var routingCreateSwitchDeviceTable = function(id){
    var i;
    var btn_id;
    var num;
    var type;
	var content = "<table>";
	content +="<tr>";
	content +="<td class='routingDeviceDryContactsTitle'>#</td>";
	//content +="<td class='routingDeviceDryContactsTitle'>None</td>";
	content +="<td class='routingDeviceDryContactsTitle'>Out1</td>";
	content +="<td class='routingDeviceDryContactsTitle'>Echo</td>";
	content +="</tr>";
	for(i=0;i<num_btn[id];++i)
    {
        num=i+1;
        btn_id="routingDeviceDryContacts_"+num+"_"+"2";
        type="Button"+num;
        content +="<tr>";
        content +="<td class='routingDeviceDryContactsTitle'>"+type+"</td>";
        content +="<td id='"+btn_id+"' class='routingDeviceDryContactsIcon' onclick='routingDeviceDryContactClicked("+num+",2);'></td>";
        btn_id="routingDeviceDryContacts_"+num+"_"+"3";
        content +="<td id='"+btn_id+"' class='routingDeviceDryContactsIcon' onclick='routingDeviceDryContactClicked("+num+",3);'></td>";
        content +="</tr>";
    }
	content += "</table>";
	return content;
}




var routingDeviceSwitchClicked = function(id, inputId,sw){
	for(var i=0;i<num_module[inputId];i++)
    {
        if($("#routingDeviceSwitch"+(i+1)).hasClass("routingDeviceSwitcTableIconSelected"))
        {
            $("#routingDeviceSwitch"+(i+1)).removeClass("routingDeviceSwitcTableIconSelected");
        }
        $("#routingDeviceSwitch"+(i+1)).removeClass("routingDeviceSwitcTableIconSelected");
    }
	$("#routingDeviceSwitch"+id).addClass("routingDeviceSwitcTableIconSelected");
	if (sw==1)
    {
    	sendAndWaitCommand("TUNNEL-CTRL 0,"+ inputId + ",\"VID "+id+">1\"");
	}
}



var routingDeviceDryContactClicked = function(index, actionId, sendCmd){
	
	var actionVal=routingDeviceDryContacts;
    var but_id=index;
    var btn_name1,btn_name2,btn_name3;
	if (actionId==1)
	{
		actionVal&=~0x3;
	}else if (actionId==2)
	{
		if (actionVal&0x02)
		{
			actionVal&=~0x02;
		}else
		{
			actionVal|=0x02;
		}
	}else if (actionId==3)
	{
		if (actionVal&0x01)
		{
			actionVal&=~0x01;
		}else
		{
			actionVal|=0x01;
		}
	}
    btn_name1="#routingDeviceDryContacts_"+but_id+"_1";
    btn_name2="#routingDeviceDryContacts_"+but_id+"_2"
    btn_name3="#routingDeviceDryContacts_"+but_id+"_3"
    routingDeviceDryContacts=actionVal;
    if (routingDeviceDryContacts&03)
    {
        $(btn_name1).removeClass("routingDeviceDryContactsIconSelected");
    }
    else
    {
        $(btn_name1).addClass("routingDeviceDryContactsIconSelected");
    }
    if (routingDeviceDryContacts&0x02)
    {
        $(btn_name2).addClass("routingDeviceDryContactsIconSelected");
    }
    else
    {
        $(btn_name2).removeClass("routingDeviceDryContactsIconSelected");
    }
    if (routingDeviceDryContacts&0x01)
    {
        $(btn_name3).addClass("routingDeviceDryContactsIconSelected");
    }
    else
    {
        $(btn_name3).removeClass("routingDeviceDryContactsIconSelected");
    }
	if(sendCmd != false)
	{
		var bid = parseInt(_routing_actualInput) + 0;	
		var cmd = "PROG-ACTION 0,"+bid+","+index+","+actionVal;
		sendAndWaitCommand(cmd);	
		routingDeviceDryContacts=actionVal;
	}
}



//@ sourceURL=routingDevices.js