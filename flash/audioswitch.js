var LastConnectedStatues=[0,0,0,0,0,0,0,0];
var PriarityStatues=[1,2,3,4,5,6,7,8];
var _switchInputTableNames=["Input1","Input2","Input3","Input4","Input5","Input6","Input7","Input8"];
var OutButton=1;
ligObject.starttouch=false;
var openaudioswitchDiv=function()
{
    autoseitch_init_sync_queries();
    var str = "<div id='propertiesBox' >";
    str += "<div id='contentBox' style='min-width: 600px;width: 600px'>";
    str += "<div class='txtTitle'>Auto Switch Settings</div>";
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
    str +="<td style='min-width: 100px;padding: 10px' align='center'></td>";
    str +="<td style='min-width: 150px;padding: 10px'></td>";
    str +="<td style='min-width: 24px'></td>";
    str +="<td style='min-width: 295px;padding: 10px'></td>";
    str +="</tr>";
    str +="<tr>";
    str +="<td style='min-width: 100px;height: 400px;padding: 10px;' id='Outputs'></td>";
    str +="<td style='min-width: 150px;height: 400px;padding: 10px;' id='Mode'></td>";
    //str +="<td style='min-width: 24px'><div style='width: 24px;height: 420px'><canvas id='audioswitchspan'style='width: 24px;height:420px'></canvas></td>"
    str +="<td style='min-width: 295px;height: 400px;padding: 10px;' id='Statues'></td>";
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
    //audioswitchspan();
    ASS_Mode();
    ASS_Btn(0);
    ModeRadio(0);
    setTimeout("showLoading(false);", 1500);
};
// var audioswitchspan=function()
// {
//     var draw=document.getElementById("audioswitchspan");
//     var ctx=draw.getContext("2d");
//     ctx.fillStyle="#555555";
//     ctx.fillRect(12,0,20,420);
// };
var ASS_Mode=function()
{
    var La_str="";
    var mode_context="";
    La_str +="<div>Output</div>";
    for(var i=0;i<ligObject.OutputCounts;i++)
    {
        La_str +="<div><input style='cursor: pointer' id='ASS_Btn"+i+"' onclick='ASS_Btn("+i+")' type='button' value='"+(i+1)+"'></div>";
    }
    $("#Outputs").append(La_str);

   mode_context +="<div id='Mode_context'>Mode Select</div>";
    $("#Mode").append(mode_context);


    $("#Statues").append(AutoSwitchSettingsText());

};
var ASS_Btn=function(id)
{
    $("#Mode_context").replaceWith(AutoSwitchSettingsRadio());
    jifukui_button_select("ASS_Btn",id,ligObject.OutputCounts);
    var data;
    data=document.getElementById("RadioMode0");
    data.checked=true;
    OutButton=parseInt(id)+1;
    ModeRadio(0);
    autoseitch_init_sync_queries();
};
var ModeRadio=function(id)
{
    if(id==0)
    {
        $("#Mode_radio").hide();
        $("#Mode_checkbox").hide();
    }
    else if(id==1)
    {
        $("#Mode_radio").show();
        $("#Mode_checkbox").hide();
    }
    else if(id==2)
    {
        $("#Mode_radio").hide();
        $("#Mode_checkbox").show();
    }
    else
    {
        $("#Mode_radio").hide();
        $("#Mode_checkbox").hide();
    }
};
var SetModeRadio=function(value)
{
    var str="MTX-MODE "+OutButton+",";
    if(value==0)
    {
        str +=0;
    }
    else if(value==1)
    {
        str +=2;
    }
    else if(value==2)
    {
        str +=1;
    }
    else
    {
        str +=0;
    }
    sendAndWaitCommand(str);
};
/*切换模式的选择*/
var AutoSwitchSettingsRadio = function(){
    var type;
    var content = "<table>";
    content +="<div><input name='mode' id='RadioMode0' style='width: 10px' type='radio' checked='true' onclick='SetModeRadio(0) '>Manual</div>";
    content +="<div><input name='mode' id='RadioMode2' style='width: 10px' type='radio' onclick='SetModeRadio(2)'>Priority</div>";
    content +="<div><input name='mode' id='RadioMode1' style='width: 10px' type='radio' onclick='SetModeRadio(1)'>Last connected<div>";
    content += "</table>";
    return content;
};
var AutoSwitchSettingsText = function(){

    var content="";
    var i;
    content +="<div id='Mode_radio'>";
    content += "<table>";
    content +="<tr><td>Last connected auto-switching forces AFV mode</td></tr>";
    /*最后一次连接模式*/
    for(i=0;i<ligObject.InputCounts;++i)
    {
        content +="<tr>";

        content +="<td><input type='checkbox'  id='auto_checkbox"+i+"' onclick='Setlastcheckbox(\"" + i +"\")'>"+(i+1);
        content +="</td></tr>";
    }
    content += "</table>";
    content += "</div>";
    /*优先级模式*/
    content +="<div id='Mode_checkbox'>";
    //content +="<p>In this mode only supports Audio Fllow Video model</p>";
    content +=vaSettings_addPriority();

    content += "</div>";
    return content;
};
var vaSettings_addPriority=function()
{

    var content="";
    content +="<table>";
    content+="<tr>";
    content+="<td></td>";
    content+="<td><div style='font-size: 16px;'>Priority auto-switching forces AFV mode</div></td>";
    content+="</tr>";
    content +="<tr><td>";
    content+="<table style='font-size: 11px; height: 370px;'>";
    content+="<tr><td style='vertical-align: top; padding-top: 15px;'>HIGH</td></tr>";
    content+="<tr><td style='vertical-align: bottom; padding-bottom: 15px;'>LOW</td></tr>";
    content+="</table>";
    content+="</td>";
    content+="<td>";
    content+="<div><ul class='sortableListDiv' id='sortable'>";
    for(var b=0;b<ligObject.InputCounts;b++)
    {
        var c=PriarityStatues[b];
        isNaN(c)||(content+="<li id='plIndex"+c+"' data-index='"+c+"'><div>"+_switchInputTableNames[c-1]+"</div></li>");
    }
    content+="</ul></div>";
    content+="</td>";
    content+="</tr>";
    content+="<tr>";
    content+="<td></td>";
    content+="<td><div style='font-size: 11px;'>Drag to change the priority</div></td>";
    content+="</tr>";
    content+="</table>";

    return content;
};
var ASSPriority=function()
{
    var str,a=[];
    $("#sortable li").each(function(b)
    {
        var c=parseInt($(this).attr("data-index"));
        a[b]=c;
    });
    str="EXT-PRIORITY 1,"+OutButton+","+ a.toString();
    sendAndWaitCommand(str);
};
var Setlastcheckbox=function(id)
{
    var i=id;
    var str="EXT-SM-LC-LIST "+OutButton+",";
    i="auto_checkbox"+i;
    var val=document.getElementById(i).checked;
    if(val==true)
    {
        LastConnectedStatues[id]=parseInt(id)+1;
    }
    else
    {
        LastConnectedStatues[id]=0;
    }
    str=str+setlastconnect();
    console.log("setlastconnect="+setlastconnect());
    if(setlastconnect()=="")
    {

    }
    else
    {
        sendAndWaitCommand(str);
    }
};
var autoseitch_init_sync_queries=function()
{
    httpComm.setCommunicationEnabled(false);
    httpComm.Settings.NumberOfCommandsSendInGroup =4;//<24
    httpComm.addHandler("MTX-MODE", AtuoModeHandler);
    httpComm.addHandler("EXT-SM-LC-LIST", AtuoLastHandler);
    httpComm.addHandler("EXT-PRIORITY", AtuoPriorityHandler);
    httpComm.addHandler("LOCK-FP",AllLockModeHander);
    httpComm.SyncQueriesList.Init();
    httpComm.SyncQueriesList.Add("MTX-MODE? "+OutButton);
    httpComm.SyncQueriesList.Add("EXT-SM-LC-LIST? "+OutButton);
    httpComm.SyncQueriesList.Add("EXT-PRIORITY? 1,"+OutButton);
    httpComm.SyncQueriesList.Add("LOCK-FP?");//AFV模式
    httpComm.setCommunicationEnabled(true);
    refreshCommands();
};

var vaSettings_sortable=null;
var AtuoModeHandler=function(reply)
{
    var rep = reply.parameters.split(',');
    var mode=parseInt(parseInt($.trim(rep[1])));
    var data;

    if(mode==0)
    {
        data=document.getElementById("RadioMode0");
        if(data!=null)
        {
            data.checked=true;
        }
        ModeRadio(0);

    }
    else if(mode==1)
    {
        data=document.getElementById("RadioMode2");
        if(data!=null)
        {
            data.checked=true;
        }
        ModeRadio(2);
    }
    else if(mode==2)
    {
        data=document.getElementById("RadioMode1");
        if(data!=null)
        {
            data.checked=true;
        }
        ModeRadio(1);
    }

};
var AtuoLastHandler=function(reply)
{
    var b=reply.parameters.split(" ")[1].split(",");
    var btn;
    LastConnectedStatues=[0,0,0,0,0,0,0,0];
    for(var e=1;e<b.length;e++)
    {
        LastConnectedStatues[parseInt(b[e])-1]=parseInt(b[e]);
    }
    for(var i=0;i<ligObject.InputCounts;i++)
    {
        btn=document.getElementById("auto_checkbox"+i);
        if(btn!=null)
        {
            if(LastConnectedStatues[i]!=0)
            {
                btn.checked=true;
            }
            else
            {
                btn.checked=false;
            }
        }
    }
};
var AtuoPriorityHandler=function(reply)
{
    if(!ligObject.starttouch)
    {
        var b=reply.parameters.split(" ")[1].split(",");
        if(b.length==(ligObject.InputCounts+2))
        {
            for(var e=2;e<b.length;e++)
            {
                PriarityStatues[e-2]=b[e];
            }
            $("#Mode_checkbox").html(vaSettings_addPriority());
            null!=vaSettings_sortable&&vaSettings_sortable.destroy();
            b=document.getElementById("sortable");
            vaSettings_sortable=new Sortable
            (b,
                {
                    onUpdate:function(a)
                    {
                        ASSPriority();

                    }
                }
            )
        }
    }
};
var setlastconnect=function()
{
    var str=new Array();

    for(var i=0;i<LastConnectedStatues.length;i++)
    {
        str[i]=LastConnectedStatues[i];
    }
    str=str.sort();
    str=str.slice(str.lastIndexOf(0)+1);
    str=str.join();
    return str;
};
