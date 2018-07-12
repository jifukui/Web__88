var stepIN_num_btn=[0,0,0,0,0,0,0,0];//按键数量
var stepINnum_module=[0,0,0,0,0,0,0,0];//模式数量
var connectflag=[1,1,1,1,1,1,1,1];//连接标志
var inputselectedflag=[0,0,0,0,0,0,0,0];
var stepINtype_module=[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];//模式名对应的编号
var stepINdevice_name=["","","","","","","",""];//级联设备的设备名数组
var ActionInput=0;//当前选择的按钮
var OutputValue=[[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0]];
var stepIN=[0,0,0,0,0,0,0,0];
var routingdevicebtnclicked=0;
var openstepinDiv=function()
{
    stepin_init_sync_queries();
    var str = "<div id='propertiesBox'>";
    str += "<div id='contentBox' style='min-width: 710px'>";
    str += "<div class='txtTitle'>Step-In Settings</div>";
    str += "<div>";
    str += "<table width='100%'><tr>";
    str += "<td style='width:200px'>"+"</td>";
    str += "</tr></table>";
    str += "</div>";
    str += "</tr>";

    str += "<tr>";
    str += "<td>";
    str += "<div id= 'RoutingDiv' class= 'contentBoxFilAFV'>";

    str +="<table>";
    str +="<tr>";
    str +="<td style='min-width: 100px;padding: 10px' align='center'>Input</td>";
    str +="<td style='min-width: 500px;padding: 10px'></td>";
    str +="</tr>";
    str +="<tr>";
    str +="<td style='min-width: 100px;padding: 10px' id='Inputs'></td>";
    str +="<td style='min-width: 500px;padding: 10px' id='StepInMessage' ></td>";
    str +="</tr>";
    str +="</table>";


    str += "</div>";
    str += "</td>";
    str += "<td style='vertical-align:top'>";
    str += "</td>";
    str += "		</tr>";
    str += "	</div>";
    str += "</div>";

    $("#contentDiv").html(str);
    StepIn();
    $("#StepIn_button"+ActionInput).addClass("jifukui_setbutton");
    setTimeout("showLoading(false);", 1500);
};

var StepIn=function()
{
    var i;
    // var id="Label_"+(i+1);
    var La_str="";
    for(i=0;i<ligObject.InputCounts;i++)
    {

        if(stepIN[i]!=0)
        {
            La_str +="<div style='padding-left: 30px'><input id='StepIn_button"+i+"' class='mousePointer' onclick='StepIn_Btn("+i+")' type='button' value='"+(i+1)+"'></div>";
        }
        else
        {
            La_str +="<div style='padding-left: 30px'><input id='StepIn_button"+i+"' class='jifukui_disablebutton' onclick='StepIn_Btn("+i+")' type='button' value='"+(i+1)+"'></div>";
        }
    }
    $("#Inputs").append(La_str);
    var str="";
    //标题
    str +="<td style='min-width: 500px;padding: 10px' id='StepInMessage'>";
    str +="<div style='display: none'>";
    str +="</div></td>";
    $("#StepInMessage").append(str);
};

var StepIn_Btn=function(id)
{
    var str="#StepIn_button"+id;
    var flag=$(str).hasClass("jifukui_disablebutton");
    if(flag)
    {
        $('#kDialogBtnCancel').hide();
        $('#kDialogBtnOk').show();
        showDialogBox(true,true,"Warning","No Step-In device connected.","hideDialogBox");
        return false;
    }
    else
    {
        ActionInput=id;
        jifukui_button_select("StepIn_button",id,ligObject.InputCounts);
        stepin_init_sync_queries();
    }

};
var stepin_draw=function(id)
{
    var str="";
    str +="<td style='min-width: 500px;padding: 10px' id='StepInMessage'>";
    str +="<div>";
    str +="<table>";
    str +="<tr>";
    str +="<td id='stepinInput'>";
    if(connectflag[id]==1)
    {
        str +=StepInCreateSwitchDeviceButtons(id);
    }
    str +="</td>";
    str +="<td style='min-width: 24px'><div style='width: 24px;height: 260px'><canvas id='stepinspan' style='width: 24px;height:260px'></canvas></td>"
    str +="<td id='stepinButton'>";

    if(connectflag[id]==1)
    {
        str +=StepInCreateSwitchDeviceTable(id);
    }
    str +="</td>";
    str +="</tr>";
    str +="</table>";
    str +="</div></td>";
    $("#StepInMessage").replaceWith(str);
    stepinspan();
};
var stepinspan=function()
{
    var draw=document.getElementById("stepinspan");
    var ctx=draw.getContext("2d");
    ctx.fillStyle="#555555";
    ctx.fillRect(12,0,20,420);
};
var StepInCreateSwitchDeviceButtons = function(inputId){
    var num;
    var id_stepin;
    var i;
    var type;
    var content = "<table>";
    content +="<tr><td><div id='StepinName'>"+stepINdevice_name[inputId]+"</div></td></tr>";
    content +="<tr><td>Inputs</td></tr>";

    for(i=0;i<stepINnum_module[inputId];i++)
    {
        num=i+1;
        id_stepin="routingDeviceSwitch"+num;

        if(stepINtype_module[inputId][i]==0)
        {
            type="    ";
        }
        else if(stepINtype_module[inputId][i]==1)
        {
            type="DVI";
        }
        else if(stepINtype_module[inputId][i]==2)
        {
            type="HDMI";
        }
        else if(stepINtype_module[inputId][i]==3)
        {
            type="DP";
        }
        else if(stepINtype_module[inputId][i]==4)
        {
            type="HDBT";
        }
        else if(stepINtype_module[inputId][i]==5)
        {
            type="SDI";
        }
        else if(stepINtype_module[inputId][i]==6)
        {
            type="VGA";
        }
        else if(stepINtype_module[inputId][i]==7)
        {
            type="DGKat";
        }
        else
        {
            type="    ";
        }
        content +="<tr><td id='"+id_stepin+"' class='routingDeviceSwitcTableIcon' onclick='routingDeviceSwitchClicked("+num+","+inputId+",1);'>"+type+"</td></tr>";
    }

    content += "</table>";
    return content;
};
var StepInCreateSwitchDeviceTable = function(id){
    var i,n;
    var btn_id1;
    var num,checkboxid;
    var type;
    var buttonstr="";
    var checkboxname;
    var data;
    var content = "<table>";
    var titlestring="Route the Step-In input to the selected outputs ";//+ligObject.ModelName
    content +="<tr><div style='min-width: 450px;padding: 0px 0px 20px 0px'>"+titlestring+"</div></tr>";//On press Step-In switch to the follow outputs of the VS-88UHD
    content +="<tr>";
    for(i=0;i<stepIN_num_btn[id];++i)
    {
        num=parseInt(i+1);
        buttonstr="Button "+num+":";
        content += "<table>";
        for(n=0;n<ligObject.OutputCounts/2;n++)
        {
            checkboxid=parseInt(n+1);
            btn_id1="routingDeviceDryContacts_"+num+"_"+checkboxid;
            checkboxname="Output "+checkboxid;
            data=Math.pow(2,checkboxid-1);
            if(n==0)
            {
                content +="<tr>";
                content +="<td>"+buttonstr+"</td>";
                content +="<td><input type='checkbox' id='"+btn_id1+"' onclick='routingDeviceDryContactClicked("+num+","+checkboxid+","+data+");'>"+checkboxname+"</td>";
                checkboxid=parseInt(checkboxid+ligObject.OutputCounts/2);
                btn_id1="routingDeviceDryContacts_"+num+"_"+checkboxid;
                checkboxname="Output "+checkboxid;
                data=Math.pow(2,checkboxid-1);
                content +="<td style='padding-left: 20px'><input type='checkbox' id='"+btn_id1+"' onclick='routingDeviceDryContactClicked("+num+","+checkboxid+","+data+");'>"+checkboxname+"</td>";
                checkboxid=parseInt(checkboxid+ligObject.OutputCounts/2);
                btn_id1="routingDeviceDryContacts_"+num+"_"+checkboxid;
                checkboxname="Output "+checkboxid;
                data=Math.pow(2,checkboxid-1);
                content +="<td style='padding-left: 20px'><input type='checkbox' id='"+btn_id1+"' onclick='routingDeviceDryContactClicked("+num+","+checkboxid+","+data+");'>Echo</td>";
                content +="</tr>";
            }
            else
            {
                content +="<tr>";
                content +="<td></td>";
                content +="<td><input type='checkbox' id='"+btn_id1+"' onclick='routingDeviceDryContactClicked("+num+","+checkboxid+","+data+");'>"+checkboxname+"</td>";
                checkboxid=parseInt(checkboxid+ligObject.OutputCounts/2);
                btn_id1="routingDeviceDryContacts_"+num+"_"+checkboxid;
                checkboxname="Output "+checkboxid;
                data=Math.pow(2,checkboxid-1);
                content +="<td style='padding-left: 20px'><input type='checkbox' id='"+btn_id1+"' onclick='routingDeviceDryContactClicked("+num+","+checkboxid+","+data+");'>"+checkboxname+"</td>";
                content +="<td></td>";
                content +="</tr>";
            }

        }
        content += "</tr></table>";
    }
    content += "</tr></table>";
    return content;
};

//设置下位机的切换
var routingDeviceSwitchClicked = function(id, inputId,sw){
    for(var i=0;i<stepINnum_module[inputId];i++)
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
        var output_id=(parseInt(ActionInput)+1);
        routingdevicebtnclicked=1;
        sendAndWaitCommand("TUNNEL-CTRL 0,"+ output_id + ",\"VID "+id+">1\"");
    }
};
//输出口的状态
var routingDeviceDryContactClicked = function(index,id ,actionId)
{
    var btn_name;
    btn_name="routingDeviceDryContacts_"+index+"_"+id;
    if (!document.getElementById(btn_name).checked)
    {
        OutputValue[ActionInput][index-1]=OutputValue[ActionInput][index-1]&(~actionId);
    }
    else
    {
        OutputValue[ActionInput][index-1]=OutputValue[ActionInput][index-1]|actionId;
    }
    sendAndWaitCommand("PROG-ACTION 0,"+(parseInt(ActionInput)+1)+","+index+","+OutputValue[ActionInput][index-1].toString(16));
};
var stepin_init_sync_queries=function()
{
    httpComm.setCommunicationEnabled(false);
    httpComm.Settings.NumberOfCommandsSendInGroup =3+parseInt(stepIN_num_btn[ActionInput]);//<24
    httpComm.addHandler("REMOTE-INFO", remoteInfoHandler);
    httpComm.addHandler("PROG-ACTION", stepinBtnStateHandler);
    httpComm.addHandler("STP-CNT-STA", StepinBtnStateHandler);
    httpComm.addHandler("LOCK-FP",AllLockModeHander);
    httpComm.SyncQueriesList.Init();
    for(var i=0;i<(parseInt(stepIN_num_btn[ActionInput]));i++)
    {
        httpComm.SyncQueriesList.Add("PROG-ACTION? 0,"+(parseInt(ActionInput)+1)+","+parseInt(i+1));
    }
    httpComm.SyncQueriesList.Add("REMOTE-INFO? 0,"+(parseInt(ActionInput)+1));
    httpComm.SyncQueriesList.Add("STP-CNT-STA?");
    httpComm.SyncQueriesList.Add("LOCK-FP?");//AFV模式
    routing_debug_query_count=0;
    httpComm.setCommunicationEnabled(true);
    refreshCommands();
};

var stepinBtnStateHandler = function(reply)
{
    portid=reply.parameters.split(',')[1];
    but_id=reply.parameters.split(',')[2];
    btn_val=reply.parameters.split(',')[3];
    btn_val=parseInt(btn_val,16);
    OutputValue[portid-1][but_id-1]=btn_val;
};



var remoteInfoHandler = function(reply){
    if(routingdevicebtnclicked==0)
    {
        var i;
        var rep = reply.parameters.split(',');
        var stageId = parseInt(parseInt(rep[1]-1));
        connectflag[stageId] =$.trim(rep[2]);
        var modelName = $.trim(rep[3]);
        stepINdevice_name[stageId]=modelName;
        inputselectedflag[stageId] = $.trim(rep[4]);
        var capabilities=$.trim(rep[5]);
        stepINnum_module[stageId]=$.trim(rep[6]);
        if(stepIN_num_btn[stageId]!=$.trim(rep[7]))
        {
            stepIN_num_btn[stageId]= $.trim(rep[7]);
            stepin_init_sync_queries();
        }
        for(var i3=0;i3<stepINnum_module[stageId];i3++)
        {
            stepINtype_module[stageId][i3]=$.trim(rep[8+i3]);
        }
        if($.trim(rep[2])==0)
        {
            var str="";

            //标题
            str +="<td style='min-width: 500px;padding: 10px' id='StepInMessage'>";
            str +="<div style='display: none'>";
            str +="</div></td>";
            $("#StepInMessage").replaceWith(str);
        }

        else
        {
            stepin_draw(stageId);
        }

        for(i=0;i<stepINnum_module[stageId];i++)
        {
            if($("#routingDeviceSwitch"+(i+1)).hasClass("routingDeviceSwitcTableIconSelected"))
            {
                $("#routingDeviceSwitch"+(i+1)).removeClass("routingDeviceSwitcTableIconSelected");
            }
            $("#routingDeviceSwitch"+(i+1)).removeClass("routingDeviceSwitcTableIconSelected");
        }
        $("#routingDeviceSwitch"+inputselectedflag[stageId]).addClass("routingDeviceSwitcTableIconSelected");
        var btn_val;
        var btn_name;
        var btn_id;
        for(var i1=1;i1<(parseInt(stepIN_num_btn[stageId])+1);i1++)
        {
            btn_name="routingDeviceDryContacts_"+i1+"_";
            btn_val=OutputValue[stageId][i1-1]+512;
            var len=9-ligObject.OutputCounts;
            for(var i2= 9,num=1;i2>=len;i2--,num++)
            {
                btn_val=btn_val.toString(2);
                btn_id=document.getElementById(btn_name+num);
                if(btn_id)
                {
                    if(btn_val[i2]==0)
                    {
                        document.getElementById(btn_name+num).checked=false;
                    }
                    else if(btn_val[i2]==1)
                    {
                        document.getElementById(btn_name+num).checked=true;
                    }
                    else
                    {

                    }
                }
            }
        }
    }
    else
    {
        ++routingdevicebtnclicked;
        if(routingdevicebtnclicked>2)
        {
            routingdevicebtnclicked=0;
        }
    }
};
var StepinBtnStateHandler=function(reply)
{
    var rep = reply.parameters.split(',');
    var str;
    var flag;
    for(var i=0;i<rep.length;i++)
    {
        stepIN[i]=rep[i];
        str="#StepIn_button"+i;
        flag=$(str).hasClass("jifukui_disablebutton");//jifukui_setbutton
        if(rep[i]!=0)//set
        {
            if(flag)
            {
                $(str).addClass("mousePointer");
                $(str).removeClass("jifukui_disablebutton");
            }
        }
        else
        {
            if(flag)
            {
            }
            else
            {
                $(str).removeClass("mousePointer");
                $(str).addClass("jifukui_disablebutton");
                
            }
        }
    }
};