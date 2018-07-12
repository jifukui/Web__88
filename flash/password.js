var flag_secure=true;
ligObject.AdminPassWord=false;
ligObject.securitySetting=false;
ligObject.dissecuritySetting=false;
var openpasswordDiv=function()
{
    flag_secure=sendAndWaitCommand("SECUR?");
    flag_secure=flag_secure.lastIndexOf("1")>5;
    netstate_init_sync_queries();
    var str = "<div id='propertiesBox'>";
    str += "<div id='contentBox' style='min-height: 240px;min-width: 574px'>";
    str += "<div class='txtTitle'>Password Settings</div>";
    str += "<div>";
    str += "<table width='100%'><tr>";
    str += "<td style='width:200px'>"+"</td>";
    str += "</tr></table>";
    str += "</div>";
    str += "</tr>";

    str += "<tr>";
    str += "<td>";
    str += "<div id= 'RoutingDiv' class= 'contentBoxFilAFV'>";

    str+=Password();
    str += "</div>";
    str += "</td>";
    str += "<td style='vertical-align:top'>";
    str += "</td>";
    str += "		</tr>";
    str += "	</div>";
    str += "</div>";

    $("#contentDiv").html(str);
    setTimeout("showLoading(false);", 1500);
    var onoffObject=new onoffButton("onoffId_sc_activate");
    onoffObject.onName ="ON";
    onoffObject.offName = "OFF";
    onoffObject.isOn =flag_secure;
    onoffObject.funcToRun="security_securityEnable";
    onoffObject.create("sc_activate");
};
var Password=function()
{
    var str="";
    str +="<table>";
    str +="<tr><td style='min-width: 120px;padding: 10px'>Activate Security</td><td style='min-width: 150px;padding: 10px'><div id='sc_activate'>Hello</div></td><td style='min-width: 50px;padding: 10px'></td></tr>";
    if(flag_secure)
    {
        if(httpCommFrame.privilege==0)
        {
            str +="<tr>";
            str +="<td style='min-width: 120px;padding: 10px'>Admin password</td>";
            str +="<td style='min-width: 150px;padding: 10px'><input type='password' id='Adminpassword' size='15' maxlength='15'><input type='password' id='RAdminpassword' size='15' maxlength='15'></td>";
            str +="<td style='min-width: 50px;padding: 10px'><div class='iconSave' onclick='Admin_steeing()'></div></td>";
            str +="</tr>";
        }
        // str +="<tr>";
        // str +="<td style='min-width: 120px;padding: 10px'>User password</td>";
        // str +="<td style='min-width: 150px;padding: 10px'><input type='password' id='Userpassword' size='15' maxlength='15'><input type='password' id='RUserpassword' size='15' maxlength='15'></td>";
        // str +="<td style='min-width: 50px;padding: 10px'><div class='iconSave' onclick='User_setting()'></div></td>";
        // str +="</tr>";
    }
    str +="</tr>";
    return str;
};
var Admin_steeing=function()
{
    var id=document.getElementById("Adminpassword").value;
    var rid=document.getElementById("RAdminpassword").value;
    ligObject.PassWorld=id;
    // if(id.length>15)
    // {
    //     $('#kDialogBtnCancel').hide();
    //     $('#kDialogBtnOk').show();
    //     showDialogBox(true,true,"Warning","The password is limited to a maximum of 15  characters .","hideDialogBox");
    //     return false;
    // }
    if(id===rid)
    {
        console.log("password:"+id);
        ligObject.AdminPassWord=true;
        document.getElementById("kDialogBtnCancel").innerHTML="CANCEL";
        $('#kDialogBtnCancel').show();
        $('#kDialogBtnOk').show();
        showDialogBox(true,true,"This operation will change the current password and reload the web page.","Do you want to continue?","ChangePassWord");
    }
    else
    {

        $('#kDialogBtnCancel').hide();
        $('#kDialogBtnOk').show();
        showDialogBox(true,true,"Warning","You entered different passwords.","hideDialogBox");
        return false;
    }
    return true;

};
var User_setting=function()
{
    var id=document.getElementById("Userpassword").value;
    var rid=document.getElementById("RUserpassword").value;
    var flag=/[0-9A-Za-z]{0,15}/;
    var FlagError;
    if(flag.exec(id)==null)
    {
        $('#kDialogBtnCancel').hide();
        $('#kDialogBtnOk').show();
        showDialogBox(true,true,"Warning","The password is limited to a maximum of 15 alphanumeric characters and must not contain spaces.","hideDialogBox");
        return false;
    }
    if(flag.exec(rid)==null)
    {
        $('#kDialogBtnCancel').hide();
        $('#kDialogBtnOk').show();
        showDialogBox(true,true,"Warning","The password is limited to a maximum of 15 alphanumeric characters and must not contain spaces.","hideDialogBox");
        return false;
    }
    if(id===rid)
    {
        FlagError=sendAndWaitCommand("PASS 0,"+id);
        if(FlagError)
        {
            alert("Set password success!");
            if(httpCommFrame.privilege==0)
            {
                return;
            }
            else
            {
                httpComm.setCommunicationEnabled(false);
                window.location.reload();
            }
        }
        else
        {
            alert("Set password failed!");
        }
    }
    else
    {
        $('#kDialogBtnCancel').hide();
        $('#kDialogBtnOk').show();
        showDialogBox(true,true,"Warning","The password is limited to a maximum of 15 alphanumeric characters and must not contain spaces.","hideDialogBox");
        return false;
    }
    return true;
};

var security_securityEnable=function(value)
{
    document.getElementById("kDialogBtnCancel").innerHTML="CLOSE";
    $('#kDialogBtnOk').show();
    $('#kDialogBtnCancel').show();
    if(value==1)
    {
        if(flag_secure)
        {
            return false;
        }
        ligObject.securitySetting=true;
        showDialogBox(true,true,"This operation will activate <br/>the security on the device<br/>and reload the web page.","Do you want to continue?","security_ActivateDialogResponse");
    }
    else
    {
        if(!flag_secure)
        {
            return false;
        }
        ligObject.dissecuritySetting=true;
        showDialogBox(true,true,"This operation will deactivate <br/>the security on the device<br/>and reload the web page.","Do you want to continue?","security_DeactivateDialogResponse");

    }
};

var security_ActivateDialogResponse=function(evnt)
{
    if(ligObject.securitySetting)
    {
        if(evnt=="OK")
        {
            sendAndWaitCommand("SECUR 1");
            showDialogBox(false,true);
            httpComm.setCommunicationEnabled(false);
            window.location.reload();
        }
        else
        {
            onoffButton.ONOFF_SELECT("onoffId_sc_activate","0");
            showDialogBox(false,true);
        }
        ligObject.securitySetting=false;
    }
};
/*安全驗證禁能*/
var security_DeactivateDialogResponse=function(evnt)
{
    if(ligObject.dissecuritySetting)
    {
        if(evnt=="OK")
        {
            sendAndWaitCommand("SECUR 0");
            showDialogBox(false,true);
            httpComm.setCommunicationEnabled(false);
            window.location.reload();

        }
        else
        {
            onoffButton.ONOFF_SELECT("onoffId_sc_activate","1");
            showDialogBox(false,true);
        }
        ligObject.dissecuritySetting=false;
    }
};

var ChangePassWord=function (evnt) {
    if(ligObject.AdminPassWord)
    {
        if(evnt=="OK")
        {
            ligObject.PassWorld=encodeURI(ligObject.PassWorld);
            FlagError=sendAndWaitCommand("PASS 1,"+PassWordURIEscaped(ligObject.PassWorld));
            if(FlagError)
            {
                httpComm.setCommunicationEnabled(false);
                window.location.reload();
            }
            else
            {

            }
        }
        else
        {
            showDialogBox(false,false);
        }
        ligObject.AdminPassWord=false;
    }
};
ligObject.URIchar="!#$&'()*+,-./:;=?@_~";
var PassWordURIEscaped=function (URIstr) {
    var encodestr=new String("");
    var i;
    for(i=0;i<URIstr.length;i++)
    {
        if(PassWordsearch(URIstr[i]))
        {
            encodestr+="%"+URIstr.charCodeAt(i).toString(16);
        }
        else
        {
            encodestr+=URIstr[i];
        }
    }
    return encodestr;
};
var PassWordsearch=function (value) {
    var i;
    var reson=false;
    for(i=0;i<ligObject.URIchar.length;i++)
    {
        if(value===ligObject.URIchar[i])
        {
            reson=true;
            break;
        }
    }
    return reson;
};