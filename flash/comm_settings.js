var jifukui_dhcp_mode=0;
var DHCPMODEFLAG_COM=0;
var ipflag=false;
var flag_factory=false;
var getComunicationDHCP = function()
{
    var data=getGeneralValue(sendAndWaitCommand("NET-DHCP?")).split(" ")[1];
    DHCPMODEFLAG_COM=data.indexOf(1);
    var hdcpvalue=document.getElementById("xmlcheck_dhcp");
    if(hdcpvalue!=null)
    {
        if(data==1)
        {
            hdcpvalue.checked=true;
        }
        else
        {
            hdcpvalue.checked=false;
        }
    }
};

var ComunicationDHCP = function()
{
    var str="NET-DHCP ";
    var hdcpvalue=document.getElementById("xmlcheck_dhcp").checked;
    if(hdcpvalue!=null)
    {

        if(hdcpvalue==1)
        {
            str+=1;
        }
        else
        {
            str+=0;
        }
    }

    $('#kDialogBtnCancel').hide();
    $('#kDialogBtnOk').show();
    showDialogBox(true,true,"Warning","The IP Address was changed, please reload the WEB Page with a new IP Address.","hideDialogBox");
    sendMessageNoWait(str);
    showLoading(false);
};

var FactoryReset=function()
{
    flag_factory=true;
    document.getElementById("kDialogBtnCancel").innerHTML="CANCEL";
    $('#kDialogBtnCancel').show();
    $('#kDialogBtnOk').show();
    showDialogBox(true, true, "All the settings will be restored to defaults.<br>After this action, current WEB session will be disconnected.<br>In order to proceed please reload the WEB with the default IP Address:192.168.1.39", "Do you want to continue?", "ComunicationReset" );
};

var ComunicationReset=function(event)
{
    if(!flag_factory)
    {
        return false;
    }
    if(event=="OK")
    {
        sendMessageNoWait("FACTORY");
    }
    flag_factory=false;
    showDialogBox(false,false);
};

var getComunicationEthIp = function()
{
    var ret=getGeneralValue(sendAndWaitCommand("NET-IP?")).split(" ")[1];
	if(DHCPMODEFLAG_COM!=-1)
    {
        ret += "_DISABLED_";
        jifukui_dhcp_mode=1;
    }
    else
    {
        jifukui_dhcp_mode=0;
    }
	return ret;
};

var comunicationIpValue = "";

var setComunicationEthIp = function(value)
{
    document.getElementById('kDialogBtnOk').style.visibility="visible";
    if(jifukui_dhcp_mode==0)
    {
        comunicationIpValue = value;
        if(fnValidateIPAddress(value, false)){
            netsetflag[0]=0;
            ipflag=true;
            return 0;
        }
        else
        {
            netsetflag[0]=1;
            netsetstr+="Invalid IP address";
            return 1;
        }

    }
    return 2;
};

var CommunicationIpSet = function()
{
    setTimeout("sendAndWaitCommand(\"WEB-NET-IP \"+comunicationIpValue);", 500);
};

var getComunicationEthTCPPort = function()
{
    return  getGeneralValue(sendAndWaitCommand("ETH-PORT? 0")).split(",")[1];
};

var getComunicationEthUDPPort = function()
{
    return  getGeneralValue(sendAndWaitCommand("ETH-PORT? 1")).split(",")[1];
};

var comunicationTCPPortValue = "";

var setComunicationEthTCPPort = function(value)
{
    document.getElementById('kDialogBtnOk').style.visibility="visible";
    comunicationTCPPortValue = value;
    if((value>=2000) && (value<=65535))
    {
        netsetflag[3]=0;
        return 0;
    }
    else
    {
        netsetflag[3]=1;
        netsetstr +="Invalid TCP Port";
        return 1;
    }
};

var comunicationUDPPortValue = "";

var setComunicationEthUDPPort = function(value)
{
    document.getElementById('kDialogBtnOk').style.visibility="visible";
    comunicationUDPPortValue = value;
    if((value>=2000) && (value<=65535))
    {
        netsetflag[4]=0;
        return 0;
    }
    else
    {
        netsetflag[4]=1;
        netsetstr +="Invalid UDP Port";
        return 1;
    }
};

var CommunicationTCPPortSet = function(){
    setTimeout("sendAndWaitCommand(\"WEB-ETH-PORT 0,\"+comunicationTCPPortValue);", 500);
};

var CommunicationUDPPortSet = function(){
    setTimeout("sendAndWaitCommand(\"WEB-ETH-PORT 1,\"+comunicationUDPPortValue);", 500);
};

var getComunicationEthMask = function()
{
    var ret=getGeneralValue(sendAndWaitCommand("NET-MASK?")).split(" ")[1];
	if(DHCPMODEFLAG_COM!=-1)
    {
        ret += "_DISABLED_";
        jifukui_dhcp_mode=1;
    }
    else
    {
        jifukui_dhcp_mode=0;
    }
	return ret;
};

var ComunicationEthMask;

var setComunicationEthMask = function(value){
    document.getElementById('kDialogBtnOk').style.visibility="visible";
    ComunicationEthMask=value;
    if(jifukui_dhcp_mode==0)
    {
        if(fnValidateMask(value))
        {
            netsetflag[1]=0;
            return 0;
        }
        else
        {
            netsetflag[1]=1;
            netsetstr +="Invalid Mask";
            return 1;
        }
    }
    return 2;
};

var MaskSet = function()
{
    setTimeout("sendAndWaitCommand(\"WEB-NET-MASK \"+ComunicationEthMask);", 500);
};

var ComunicationEthGateway;

var getComunicationEthGateway = function()
{
    var ret=getGeneralValue(sendAndWaitCommand("NET-GATE?")).split(" ")[1];
	if(DHCPMODEFLAG_COM!=-1)
    {
        ret += "_DISABLED_";
        jifukui_dhcp_mode=1;
    }
    else
    {
        jifukui_dhcp_mode=0;
    }
	return ret;
};

var setComunicationEthGateway = function(value)
{
    document.getElementById('kDialogBtnOk').style.visibility="visible";
    ComunicationEthGateway=value;
    if(jifukui_dhcp_mode==0)
    {
        if(fnValidateIPAddress(value, false))
        {
            netsetflag[2]=0;
            return 0;
        }
        else
        {
            netsetflag[2]=1;
            netsetstr +="Invalid Gateway address";
            return 1;
        }
    }
    return 2;
};

var GetwaySet = function(){
    setTimeout("sendAndWaitCommand(\"WEB-NET-GATE \"+ComunicationEthGateway);", 500);
};

var getComunicationEthMAC = function(){
	return  getGeneralValue(sendAndWaitCommand("NET-MAC?")).split(" ")[1];
};

var getComunicationUnitName = function(){
    return  getGeneralValue(sendAndWaitCommand("NAME?")).split(" ")[1];
};

var setComunicationDiscovery = function(value){
	var err = sendAndWaitCommand("NET-GATE "+value);	
	return err;
};

var frupdate_browsefile=function()
{
    $("#HttpCommUploadFile").trigger("click")
};

var netsetflag=[2,2,2,2,2];
var jionin=[];
var netsetstr="";

var SetNet=function() {
    netsetflag=[2,2,2,2,2];
    jionin=[];
    netsetstr="";
    if ($("#actionId_setnet").hasClass("actionButton"))
    {
        for (var i = 0; i < ligObject.netsetflag.length; i++)
        {
            if (ligObject.netsetflag[i] == true)
            {
                if (i == 0)
                {
                    inputField.INPUT_SET_FUNC("IPaddress","setComunicationEthIp");
                }
                else if (i == 1)
                {
                    inputField.INPUT_SET_FUNC("Mask","setComunicationEthMask");

                }
                else if (i == 2)
                {
                    inputField.INPUT_SET_FUNC("Gateway","setComunicationEthGateway");
                }
                else if (i == 3)
                {
                    inputField.INPUT_SET_FUNC("TCPPort","setComunicationEthTCPPort");
                }
                else if (i == 4)
                {
                    inputField.INPUT_SET_FUNC("UDPPort","setComunicationEthUDPPort");
                }
                else
                {
                    break;
                }
                jionin.push(i);
            }
        }
        if(netsetstr=="")
        {
            $('#kDialogBtnCancel').hide();
            for(var i=0;i<jionin.length;i++)
            {
                if(jionin[i]==0)
                {
                    CommunicationIpSet();
                }
                else if(jionin[i]==1)
                {
                    MaskSet();
                }
                else if(jionin[i]==2)
                {
                    GetwaySet();
                }
                else if(jionin[i]==3)
                {
                    CommunicationTCPPortSet();
                }
                else if(jionin[i]==4)
                {
                    CommunicationUDPPortSet();
                }
                else
                {
                    return false;
                }
            }
            setTimeout("sendMessageNoWait(\"WEB-RESET \");", 600);
            setTimeout("Device_Settings_sync_queries()",1000);
            if(ipflag)
            {
                setTimeout(IPchangeLog,500);
            }
        }
        else
        {
            $('#kDialogBtnCancel').hide();
            $('#kDialogBtnOk').show();
            showDialogBox(true, true, "ERROR", netsetstr, "NetSetClose" );
        }
        ligObject.netsetflag=[false,false,false,false,false];
        $("#actionId_setnet").removeClass("actionButton");
    }
};

var NetSetClose=function(event)
{
    showDialogBox(false, false);
};
var IPchangeLog=function () {
    $('#kDialogBtnCancel').hide();
    $('#kDialogBtnOk').show();
    showDialogBox(true,true,"Warning","The IP Address was changed, please reload the WEB Page with a new IP Address.","hideDialogBox");
};
//@ sourceURL=comm_settings.js