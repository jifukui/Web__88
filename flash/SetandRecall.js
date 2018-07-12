var SetandRecall_State_Set=[0,0,0,0,0,0];
var SetbtnCount = 8;
var RecallbtnCount = 8;
var SetCheckboxCount=6;
var opensetandrecallDiv=function()
{
    SetandRecall_State_Set=[0,0,0,0,0,0];
    SetandRecall_init_sync_queries();
    var str = "<div id='propertiesBox' style='width: 844px'>";
    str += "<div id='contentBox' style='min-width: 587px;min-height: 411px'>";
    str += "<div class='txtTitle'>Set and Recall</div>";
    str += "<div>";
    str += "<table width='100%'><tr>";
    str += "<td style='width:150px'>"+"</td>";
    str += "</tr></table>";
    str += "</div>";
    str += "</tr>";

    str += "<tr>";
    str += "<td>";
    str += "<div id= 'RoutingDiv' class= 'contentBoxFilAFV'>";

    str+=SetandRecall();
    str += "</div>";
    str += "</td>";
    str += "<td style='vertical-align:top'>";
    str += "</td>";
    str += "		</tr>";
    str += "	</div>";
    str += "</div>";

    $("#contentDiv").html(str);
    setandrecallspan();
    setTimeout("showLoading(false);", 1500);
}
var str_checkbox=["Switch","Device Settings","Timeout Settings","Auto Switch Settings","Step-In Settings","EDID"];
var SetandRecall=function()
{
    var str="", i,n;
    str +="<table>";

    str +="<tr>";
    str +="<td style='min-width: 80px;padding-left:  80px'><div class='iconPresetSet' ></div></td>";
    str +="<td style='min-width: 200px;padding: 10px'>";
    str +="<td padding: 10px'></td>";
    str +="<td style='min-width: 80px;padding-left:  80px'><div class='iconPresetRecall' ></div>";
    str +="</tr>"
    str +="<tr><td>"
    str +="<table>";
    for(i=0;i<SetbtnCount/2;i++)
    {
        var num1=i+ 1;
        var num2=num1+(SetbtnCount/2);
        n=parseInt(i+SetbtnCount/2);
        str +="<tr>";
        str +="<td style='min-width: 40px;padding: 10px 10px 10px 30px'><input style='margin-right: 15px' type='button' width='30px'id='Set_button"+i+"' onclick='Set_Steeing(\"" + i +"\")' value="+num1+"><input  type='button' width='30px'id='Set_button"+n+"' onclick='Set_Steeing(\"" + n +"\")' value="+num2+"></td>";
    }
    str +="</table></td>";
    str +="<td>"
    str +="<table>";
    for(i=0;i<SetCheckboxCount;i++)
    {
        num1=i+ 1;
        str +="<tr>";
        str +="<td style='min-width: 200px;padding: 10px'><input  type='checkbox' style='width: 15px'id='set_checkbox"+num1+"' onclick='Set_Checkbox()'>"+str_checkbox[i]+"</td>";
        str +="</tr>";
    }
    str +="</table></td>";
    str +="<td style='min-width: 24px'><div style='width: 24px;height: 260px'><canvas id='setandrecallspan'style='width: 24px;height:260px'></canvas></td>"
    str +="<td>";
    str +="<table>";
    for(i=0;i<SetbtnCount/2;i++)
    {
        num1=i+ 1;
        num2=num1+(SetbtnCount/2);
        n=parseInt(i+SetbtnCount/2);
        str +="<tr>";
        str +="<td style='min-width: 40px;padding: 10px 10px 10px 30px'>"+"<input style='margin-right: 15px' type='button' width='30px'id='Recall_button"+i+"' onclick='Recall_Setting(\"" + i +"\")'value="+num1+">"+"<input type='button' width='30px'id='Recall_button"+n+"' onclick='Recall_Setting(\"" + n +"\")'value="+num2+"></td>";
        str +="</tr>";
    }
    str +="</table></td>";
    str +="</tr>";
    str +="</table>";
    return str;
}
var setandrecallspan=function()
{
    var draw=document.getElementById("setandrecallspan");
    var ctx=draw.getContext("2d");
    ctx.fillStyle="#555555";
    ctx.fillRect(12,0,20,420);
}
var Set_Steeing=function(id)
{
    var value,str;
    if(setcallocstr()=="")
    {
        alert("please check");
    }
    else
    {
        jifukui_button_select("Set_button",id,SetbtnCount);
        var num="Set_button"+id;
        value=document.getElementById(num);
        str="EXT-PRST-STO "+(parseInt(id)+1)+","+setcallocstr();
        sendAndWaitCommand(str);
    }
}

var Set_Checkbox=function()
{
    var value;
    var id;
    var num;
    for(var i=0;i<SetandRecall_State_Set.length;i++)
    {
        id=parseInt(i)+1;
        num="set_checkbox"+id
        value=document.getElementById(num).checked;//=$(num).checked;
        if(value==true)
        {

            SetandRecall_State_Set[i]=id;
        }
        else
        {

            SetandRecall_State_Set[i]=0;
        }
    }
}

var Recall_Setting=function(id)
{
    var value,str;
    var num="Recall_button"+id;
    value=document.getElementById(num);
    str="PRST-RCL "+(parseInt(id)+1);
    if( $("#"+num).hasClass("jifukui_disablebutton"))
    {
        return false;
    }
    jifukui_button_select("Recall_button",id,RecallbtnCount);
    sendAndWaitCommand(str);
}
var SetandRecall_init_sync_queries=function()
{
    httpComm.setCommunicationEnabled(false);
    httpComm.Settings.NumberOfCommandsSendInGroup =2;//<24
    httpComm.addHandler("PRST-LST", MacallModeHandler);
    httpComm.addHandler("LOCK-FP",AllLockModeHander);
    httpComm.SyncQueriesList.Init();
    //httpComm.SyncQueriesList.Add("EXT-PRST-STO?");
    httpComm.SyncQueriesList.Add("PRST-LST?");
    httpComm.SyncQueriesList.Add("LOCK-FP?");//AFV模式
    routing_debug_query_count=0;
    httpComm.setCommunicationEnabled(true);
    refreshCommands();
}
var setcallocstr=function()
{
    var str=Array();
    for(var i=0;i<SetandRecall_State_Set.length;i++)
    {
        str[i]=SetandRecall_State_Set[i];
    }
    str=str.sort();
    str=str.slice(str.lastIndexOf(0)+1,6);
    str=str.join();
    return str;


}
var MacallModeHandler=function(reply)
{
    var rep = reply.parameters.split(',');
    var str;
    var flag;
    for(var i=0;i<rep.length;i++)
    {
        str="#Recall_button"+i;
        flag=$(str).hasClass("jifukui_disablebutton");//jifukui_setbutton
        if(rep[i]!=0)//set
        {
            if(flag)
            {
                $(str).removeClass("jifukui_disablebutton");
                $(str).addClass("mousePointer");
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
}