var _MODEL_NAME = "";
var _CURRENT_MENU_ = "";
var isMobile="";
var myScroll;
var av_sw_time_flag="";
var DHCPMODEFLAG=true;
var ligObject=new Object();
ligObject.netsetflag=[false,false,false,false,false];
ligObject.DVIEdid=false;
ligObject.ModelName="";
ligObject.updatafile="";
function init()
{
	$("#errorDiv").hide();
	chooseFormat(1);
	commInit();
	$(window).resize(function() {
		arrangeWindows();
	});
	setTimeout("SetStandByModeNoFade();",200);
	setTimeout("arrangeWindows();",200);
}

var arrangeWindows = function(){
	centerContent();
};

var chooseFormat = function(format){
	setCookie("formatType",""+format,365);

	if(format == 1)
	{
		LoadFileRetry("body", GetFileNameNoCache("init_browser.html"), function(){loadDeviceInfo();});
        setTimeout("SetStandByModeNoFade();",200);
	} else {
		LoadFileRetry("#bodyDiv", GetFileNameNoCache("init_mobile.html"), function(){loadDeviceInfo();});
	}
};
var GetDeviceInfo=function () {
    var value=getGeneralValue(sendAndWaitCommand("EXT-DEV-STATU?")).split(" ")[1];//EXT-DEV-STATU
    value=value.split(",");
    if(value.length>=3)
    {
        ligObject.InputCounts=parseInt(value[0]);
        ligObject.OutputCounts=parseInt(value[1]);
        ligObject.Haveaudio=parseInt(value[2])!=0;
    }
};
function loadDeviceInfo(){
    // GetDeviceInfo();
	loadXmlFile(GetFileNameNoCache("device.xml"), function(xml){
		deviceXML = xml;
        ligObject.ModelName=getGeneralModelName();
        var p_title="Kramer "+ligObject.ModelName+" Controller";
        $("#pageTitle").html(p_title);
        GetDeviceInfo();
        if((ligObject.InputCounts==null)||(ligObject.OutputCounts==null)||(ligObject.Haveaudio==null))
		{
			console.log("Get error");
            $("#contentBox").html("Error loading resources.");
            return false;
		}

        // $(xml).find("general").find("characteristic").each(function () {
        //     console.log("init");
        //     ligObject.OutputCounts=parseInt($(this).attr("Output"));
        //     ligObject.InputCounts=parseInt($(this).attr("Input"));
        //     ligObject.Haveaudio=($(this).attr("HaveAudio"))==="true"?true:false;
        // });
		var menu = "";
		var i = 0;
		var firstType = "";
		var firstValue = "";
		$(deviceXML).find('main').find('item').each(function(){
			var name = $(this).attr('name');
			var type = $(this).attr('type');
			var value = $(this).attr('value');
			if(i==0)
			{
				firstType = type;
				firstValue = value;
			}
			menu += "<div id='selectionMenu_"+i+"' class='selection' onclick='selectionClick(\""+type+"\",\""+value+"\","+i+");' >"+name+"</div>";
			i++;
		});
		$("#menuDiv").html(menu);
        showDialogBox(false);
		selectionClick(firstType,firstValue,"0");

	});
}

var chooseTheme = function(theme)
{
	setCookie("themeType",""+theme,365);
	if(theme == 1)
		$("link").attr("href",GetFileNameNoCache("white.css"));
	else
		$("link").attr("href",GetFileNameNoCache("black_blue.css"));
};


var loadStyle = function(fileName)
{
	$("link").attr("href",GetFileNameNoCache(fileName+".css"));
};

var deleteCookies = function()
{
	delCookie("formatType");
	delCookie("themeType");
	alert("Cookies was deleted");
};


var selectionClick = function(type, value, menuIndex)
{
	_CURRENT_MENU_ = value;
	if(httpComm != null)
		httpComm.SyncQueriesList.Init();

	httpComm.setCommunicationEnabled(false);

	try{ wifiSignal.WIFI_CLEAR(); } catch (e){}
	try{ onoffButton.ONOFF_CLEAR(); } catch (e){}
	try{ inputField.INPUT_CLEAR(); } catch (e){}
	try{ routeButton.ROUTE_BUTTON_CLEAR(); } catch (e){}

	for(var i=0;i<10;i++)
	{
		$("#selectionMenu_"+i).removeClass("selection_selected");
	}

	$("#selectionMenu_"+menuIndex).addClass("selection_selected");
	$("#loadingDiv").fadeIn(300, function(){
		switch(type)
		{
			case "properties":
				openPropertiesDiv(value);
				break;
			case "internal":
				callFunction(value);
				break;
			case "matrix":
				openMatrixDiv(value);
				break;
			case "scale":
				openScalerDiv(value);
				break;
			case "edid":
				openEdidDiv(value);
				break;
			case "about":
				openAboutDiv(value);
				break;
			case "datarouting":
				openDataRoutingDiv(value);
				break;
			case "routing":
				openRoutingDiv(value);
				break;
			case "firmware":
				openFirmwareDiv();
				break;
            case "setandrecall":
                opensetandrecallDiv();
                break;
            case "password":
                openpasswordDiv();
                break;
            case 'timeout':
                opentimeoutDiv();
                break;
            case 'audioswitch':
                openaudioswitchDiv();
                break;
            case 'stepin':
                openstepinDiv();
                break;
            case 'password':
                openpasswordDiv();
                break;
			default:
				break;
		}
	});
};

var openXmlAndPase = function(xmlFile, putOnDiv, callback)
{
	loadXmlFile(""+GetFileNameNoCache(xmlFile), function(xml){
		var runLater = new Array();
		runLater["WIFI"] = null;
		runLater["ONOFF"] = null;
		runLater["INPUT"] = null;
		var menu = "";
		$(xml).find('title').each(function(){
			menu += "<div class='txtTitle' >"+$(this).text()+"</div>";

		});
		menu += "<table width='100%' >";
        if(xmlFile=="comm_settings.xml"&&httpCommFrame.privilege<2&&(!isMobile.any))
        {
			ligObject.updatafile="";
            menu +="<tr>";
            menu +="<td></td>";
            menu +="<td></td>";
            menu +="<td width='232px' rowspan='5'>";
            menu +="<div class='firmwareUpdateDiv'>";
            menu +="<div id='firmwareUpdateDiv'>";
            menu +="<div class='txtSubtitle'>Firmware Upgrade</div>";
            menu +="<table>";
            menu +="<tbody>";
            menu +="<tr>";
            menu +="<td ><div style='max-width: 160px;word-break: break-all' id='fr_file_selected'>Choose a file</div></td>";
            menu +="<tr><td><div class='setButton' onclick='frupdate_browsefile();' style='width: 150px;margin-left: -0.5px;padding-top: 6px'>BROWSE</div></td></tr>";//margin-left: 10px;
            menu +="<tr><td><form id='HttpCommUploadIFrame' enctype='multipart/form-data' method='post'>";
            menu +="<input id='HttpCommBtnUpload' class='DisSetButton' type='submit' value='START UPGRADE' style='width: 154px;height: 30px;padding: 0px;margin-left: -0.5px;margin-top: 3px' onclick='jifukui_updatefile()'/>";//margin-left: 9px;
            menu +="<input id='HttpCommUploadFile' class='fr_input' type='file' name='myfile' style='display: none' onchange='fr_update_choosedFile()'/>";
            // menu +="<td id='fr_uploadId'>IDLE</td>";
            menu +="</from></td></tr>";
            menu +="</tr>";
            menu +="</tr>";
            menu +="</table>";
        }
		$(xml).find('item').each(function(){
			var id = $(this).attr('id');
			var type = $(this).attr('type');
			var name = $(this).attr('name');
			var source = $(this).attr('source');
			var funcToRun = $(this).attr('func');
			var value = $(this).attr('value');
			var onValue = $(this).attr('onValue');
			var offValue = $(this).attr('offValue');
			var rightAlign = $(this).attr('rightAlign');
			var refreshAfterSet = $(this).attr('refreshAfterSet');

			menu += "<tr>";
			var propValue = value;
			var propValueOrg;
			if(source=="external")
			{
				propValue = callFunction( "get" + funcToRun );
				propValueOrg = propValue;
				propValue = $.trim(propValue);
			}

			switch(type)
			{
			case "subtitle":
				menu += "<td class='txtSubtitle' id='"+id+"'>"+name+"</td>";
				break;
			case "separator":
				menu += "<td colspan='2'><div class='txtSeparator'/></td>";
				break;
			case "list":
				menu += "<td class='txtProperty' >"+name+"</td>";
				menu += "<td class='txtProperty' >";

				var func = $(this).attr('func');

				var optionList = "";
				$(this).find('option').each(function(){
					var option = $(this).attr('name');
					var valueList = $(this).attr('value');

					var selected = "";
					if(valueList == propValue)
						selected= "selected='selected'";
					optionList +="<option value='"+valueList+"' "+selected+">"+option+"</option>";
				});

				menu += "<select id='"+id+"' class='styled-select listControl txtList' onchange='set" + func +"(this);' >";
				menu += optionList;
				menu +="</select>";
				menu += "</td>";
				break;
			case "datapicker":
				menu += "<td class='txtProperty' >"+name+"</td>";
				menu += "<td class='txtProperty' >";
				menu += "<input name='"+ id +"'  id='"+ id +"' value='' onclick='displayDatePicker(\""+ id +"\", this);' readonly='true'/>";
				menu += "</td>";
			break;
			case "time":
				menu += "<td class='txtProperty' >"+name+"</td>";
				menu += "<td class='txtProperty' >";
				menu +="<table><tr>";
				menu += "<td><input class='inputTime' id='hour_"+ id +"' value='00' maxlength='2'/></td>";
				menu += "<td> : </td>";
				menu += "<td><input class='inputTime' id='minute_"+ id +"' value='00' maxlength='2'/></td>";
				menu +="</tr></table>";
				menu += "</td>";
			break;
			case "number":
			case "ip":
			case "text":
				menu += "<td class='txtProperty' >"+name+"</td>";
				menu +="<td>";
				var inputId = "inputField_"+id;
				menu +="<div id='"+inputId+"' />";
				menu +="</td>";
				var inputObject = new inputField(id);
				var isEnabled = true;
				isEnabled =(propValue.indexOf("_DISABLED_") == -1);
				propValue = propValue.toString().replace("_DISABLED_","");
				inputObject.funcToRun = "set" + funcToRun;
				inputObject.value = propValue;
				inputObject.oldValue = propValue;
				inputObject.rightAlign = (rightAlign == "true");
				inputObject.InputType = (type=="number")?"numeric":"text";
                // if(httpCommFrame.privilege!=0)
                // {
                //     inputObject.enabled = false;
                // }
                // else
                // {
                //     inputObject.enabled = isEnabled;
                // }
                inputObject.enabled = isEnabled;
				runLater["INPUT"] = createInputField;
			break;
			case "action":
                if(httpCommFrame.privilege>1)
                    break;
				var func = $(this).attr('func');
                var actionid="actionId_"+id;
				menu += "<td class='txtProperty' >"+name+"</td>";
                menu +="<td>";
                menu +="<table width='180px' ><tr>";
				if(func=="SetNet")
                {
                    menu += "<td id='"+actionid+"' class='setButtonDisable' onclick='"+func+"();'>"+value+"</td>";
                }
                else
                {
                    menu += "<td  class='actionButton' onclick='"+func+"();'>"+value+"</td>";
                }
                menu+="</tr>";
                menu +="</table>";
                menu+="</td>";
			break;
			case "actionIcon":
			var func = $(this).attr('func');
				menu += "<td class='txtProperty' >"+name+"</td>";
				menu += "<td onclick='"+func+"();' align='right'><img class='actionIcon' src='"+value+"'/></td>";
			break;
			case "table":
				propValue = propValueOrg;
				var cols = $(this).children();
				menu += "<tr><td class='txtProperty' colspan='2'>"+name+"</td></tr>";

				var table = "<table><tr>";
				// Title
				for(var c=0;c<cols.length;c++)
				{
					try
					{
						var colName = cols[c].attributes.getNamedItem('name').nodeValue;
						var colWidth = cols[c].attributes.getNamedItem('width').nodeValue;
						table +="<td width='"+colWidth+"px' class='txtTableTitle' align='center'>"+colName+"</td>";
					} catch (e) {}
				}

				table += "</tr></table>";
				table += "<div style='height: 350px; overflow: auto;'>";
				table += "<table><tr>";
				var rowClass = "txtTableValueOdd";
				for(var i=0;i<propValue.length;i++){
					table +="</tr><tr>";
					rowClass=(i%2==0)?"txtTableValueOdd":"txtTableValueEven";

					for(var c=0;c<cols.length;c++){
						try
						{
							var colType = cols[c].attributes.getNamedItem('type').nodeValue;
							var colWidth = cols[c].attributes.getNamedItem('width').nodeValue;

							if(colType=="text")
							{
								var colvalue = propValue[i][c];
								table +="<td width='"+colWidth+"px' class='txtTableValue "+rowClass+"'>"+colvalue+"</td>";
							}
							if(colType=="check")
							{
								var colvalue = propValue[i][c];
								table +="<td class='txtTableValue "+rowClass+"' align='center' ><input type='checkbox'/></td>";
							}
							if(colType=="wifi")
							{
								var colvalue = propValue[i][c];
								var wifiId = "wifiId_"+i;
								table +="<td class='txtTableValue "+rowClass+"' align='center' ><div id='"+wifiId+"' /></td>";
								var wifiObject = new wifiSignal("wifiObject_"+i);
								wifiObject.setSignalTo(colvalue);
								if(propValue[i][c+1]=="Connected")
									wifiObject.setEnable(true);
								else
									wifiObject.setEnable(false);

								runLater["WIFI"] = createWifi;
							}
							if(colType=="plus_minus"){
								var colvalue = propValue[i][c];
								var iconName = "minusIcon.png";
								if(colvalue=="1")
									iconName = "plusIcon.png";
								table +="<td class='txtTableValue "+rowClass+"' align='center' ><img src='"+iconName+"' /></td>";
							}
						} catch (e) {}
					}
				}

				table += "</tr></table>";
				table += "</div>";

				menu += "<td  colspan='2'>"+table+"</td>";
				break;
			case "OnOff":
				menu += "<td class='txtProperty' >"+name+"</td>";
				menu +="<td align='right'>";
				var onoffId = "onoffId_"+id;
				menu +="<div id='"+onoffId+"' />";
				menu +="</td>";

				var onoffObject = new onoffButton(id);

				if(onValue != null) onoffObject.onName = onValue;
				if(offValue != null) onoffObject.offName = offValue;
				onoffObject.isOn =(propValue.indexOf("1") != -1);
				onoffObject.funcToRun = "set" + funcToRun;
				if(refreshAfterSet)
					onoffObject.refreshAfterSet = true;

				runLater["ONOFF"] = createOnOff;

			    break;
                case "input":
				    menu += "<td class='txtProperty' >"+name+"</td>";
				    menu += "<td class='txtProperty'>";
				    menu += "<input id='"+id+"' value='"+propValue+"'/>";
				    menu += "</td>";
				    break;
                case "checkbox":
                    var checkid="xmlcheck_"+id;
                    var func = $(this).attr('func');
                    menu +="<td>"+name+"</td>";
                    menu +="<td style='padding-left: 0px'><input type='checkbox' onclick='"+func+"();' id='"+checkid+"'></td>";
                    break;
			default:
				menu += "<td class='txtProperty' >"+name+"</td>";
				menu += "<td class='txtProperty' id='"+id+"'>"+propValue+"</td>";
				break;
			}
			menu += "</tr>";
		});
		menu += "</table>";
		menu += "</div>";
		menu += "</div>";
		$("#"+putOnDiv).html(menu);

		if(runLater["WIFI"]!=null)
			runLater["WIFI"]();

		if(runLater["ONOFF"]!=null)
			runLater["ONOFF"]();

		if(runLater["INPUT"]!=null)
			runLater["INPUT"]();
	});
};

var openPropertiesDiv = function(value)
{

	var menu = "<div id='propertiesBox'>";
    if(value=="comm_settings.xml"&&httpCommFrame.privilege<2&&(!isMobile.any))
    {
        menu += "<div id='contentBox' style='min-height: 578px;min-width: 645px'>";
    }
    else
    {
        menu += "<div id='contentBox' style='min-width: 409px;min-height: 467px'>";
    }
	menu += "<div/>";
	menu += "<div/>";
	$("#contentDiv").html(menu);

	openXmlAndPase(value, "contentBox");
    centerContent();
    setTimeout("Device_Settings_sync_queries()",100);
    showLoading(false);
};
var createOnOff = function(){
	for (var i in onoffButton.ONOFF_OBJECT_ARRAY)
	{
		var id = onoffButton.ONOFF_OBJECT_ARRAY[i].id;
		onoffButton.ONOFF_OBJECT_ARRAY[i].create("onoffId_"+id);
	}
};

var createWifi = function(){
	for (var i in wifiSignal.WIFI_OBJECT_ARRAY)
	{
		wifiSignal.WIFI_OBJECT_ARRAY[i].create("wifiId_"+i);
	}
};

var createInputField = function(){
	for (var i in inputField.INPUT_OBJECT_ARRAY)
	{
		var id = inputField.INPUT_OBJECT_ARRAY[i].id;
		inputField.INPUT_OBJECT_ARRAY[i].create("inputField_"+id);
	}
};

var centerContent = function()
{
    if(1660>$(window).height()&&0<$("#propertiesBox").children().length&&1130>$(window).width())
    {
        if(isMobile.any)
        {
            $("#propertiesBox").css({"max-height":$(window).height()-100+"px","max-width":$(window).width()+"px","overflow":"hidden"});
            myscroll=new IScroll("#propertiesBox",{click:!0,mouseWheel:!0,tap:!0,scrollX:true,zoom:true});
        }
        else
        {
            $("#propertiesBox").css({"max-height":$(window).height()-100+"px","max-width":$(window).width()+"px","overflow-y":"auto","overflow-x":"auto"});
        }
    }
    if(1660>$(window).height() && (0<$("#propertiesBox").children().length) && (1130<=$(window).width()))
    {
        if(isMobile.any)
        {
            $("#propertiesBox").css({"max-height":$(window).height()-100+"px",overflow:"hidden"});
            myscroll=new IScroll("#propertiesBox",{click:!0,mouseWheel:!0,tap:!0,zoom:true});
        }
        else
        {
            $("#propertiesBox").css({"max-height":$(window).height()-100+"px","overflow-y":"auto","overflow-x":"hidden","max-width":"none"});
        }
    }
    if(1130>$(window).width()&&0<$("#propertiesBox").children().length&& ((1660<=$(window).height())))
    {
        if(isMobile.any)
        {
            $("#propertiesBox").css({"max-width":$(window).width()+"px",overflow:"hidden"});
            myscroll=new IScroll("#propertiesBox",{click:!0,mouseWheel:!0,tap:!0,scrollX:true,zoom:true});
        }
        else
        {
            $("#propertiesBox").css({"max-width":$(window).width()+"px","overflow-x":"auto","overflow-y":"hidden"});
        }
    }
    if(((1660<=$(window).height())) && (1130<=$(window).width())&&0<$("#propertiesBox").children().length)
    {
        $("#propertiesBox").css({"max-height":"none","max-width":"none",overflow:"visible"}),$("#contentBox").css({transform:"inherit"});
    }
    $("#propertiesBox").css({left:"50%",top:"50%"});
    $("#kDialogBox").css({"left":($(window).width()- $("#kDialogBox").width())/2+"px","top":($(window).height()- $("#kDialogBox").height())/2+"px"});
    centerDiv("propertiesBox",window);
};
var centerDiv=function(a,b)
{
    var c=$("#"+a).position();
    if(void 0!=c)
    {
        var d=c.left-$("#"+a).width()/2,e=c.top-$("#"+a).height()/2,h=$(b).height(),c=$(b).width(),e=100*(e/h)+"%",d=100*(d/c)+"%";
        $("#"+a).css({left:d,top:e})
    }
};

var fnc_clearWebOptions = function(){
	$('#kDialogBtnOk').show();
	$('#kDialogBtnCancel').hide();
	showDialogBox(true, true, "This action will delete the web information", "Do you want to continue?", "fnc_clearWebOptionsClick" );
};

var fnc_clearWebOptionsClick = function(evnt){
	if(evnt=="OK"){
		deleteCookies();
 		window.applicationCache.update();
		window.location.reload();
	}

	showDialogBox(false);
};

var chooseThemeList = function(obj){
	$(obj).find('option').each(function(){
		if($(this).attr('selected') == "selected")
		{
			chooseTheme($(this).attr('value'));
		}
	});
};

var openAboutDiv = function (file){
    netstate_init_sync_queries();
	$("#contentDiv").load(file, function(){centerContent(); showLoading(false);	});
};

var openEdidDiv = function(file){
	$("#contentDiv").load(file, function(){
		var edidData = sendAndWaitCommand("gedid 0,1");
		$("#edidContent").html(edidData);
		centerContent();
		showLoading(false);
	});
};

var commInit =function(){
	httpComm  = GetHttpCommObj();
	// registerDeviceMessages();
	httpComm.addHandShakeErrorHandler(handShakeErrorHandler);
	httpComm.addNoResponseErrorHandler(noResponseErrorHandler);
	httpComm.addHandShakeSuccessHandler(handShakeSuccessHandler);
	httpComm.Settings.NumberOfCommandsSendInGroup = 8;
	httpComm.init();
	httpComm.setCommunicationEnabled(false);
};

/**********
* handShakeErrorHandler
***********************/
var handShakeErrorHandler = function(error_text)
{
	LogPrint("ERROR " + error_text);
};

var handShakeSuccessHandler = function(){
	$("#errorDiv").hide();
};

var  noResponseErrorHandler = function(error_text)
{
	$("#errorDiv").show();
	LogPrint("ERROR " + error_text);
};

var selectInput = function(type, input, channel, toSendCommand)
{
	input--;
	channel--;
	if( routing_actualOutput == channel)
	{
		if(type == "Video"){
			BTN_selectVideo("inputBtn_" + input);
		}
		else if(type == "Audio")
		{
			BTN_selectAudio("inputBtn_" + input);
		}
	}

	if(toSendCommand && httpComm)
	{
		if(type == "Video")
			httpComm.sendMessage("vid " + input.toString() + ">" + channel.toString());
		else if(type == "Audio")
			httpComm.sendMessage("aud " + input.toString() + ">" + channel.toString());
	}
};

var showDialogBox = function(show, waring, title , subtitle, callback){
	if(!$("#kDialogBox").html()&&$("#kDialogDiv").html())
	{
		console.log("error");
		var kdbox="";
		kdbox +="<div id='kDialogBox' style='display: none;background-color: #975697 '>";
		kdbox +="<table> <tbody><tr><td>";
		kdbox +="<div class='txtSubtitle' id='kDialogBoxTitle'>Are you sure?</div><table>";
		kdbox +="<tbody><tr></tr>";
		kdbox +="<tr style='display: none'></tr>";
		kdbox +="</tbody></table>";
		kdbox +="</td></tr>";
		kdbox +="<tr style='background-color:#484646'><td>";
		kdbox +="<table> <tbody><tr>";
		kdbox +="<td><div class='txtProperty' id='kDialogBoxSubTitle' colspan='2'>Are you sure?</div></td>";
		kdbox +="</tr> <tr><td>";
		kdbox +="<table>";
		kdbox +="<tbody><tr>";
		kdbox +="<td align='right'><div class='actionButton mousePointer' id='kDialogBtnOk' style='visibility: visible' align='right'>OK</div></td>";
		kdbox +="<td align='right'><div class='actionButton mousePointer' id='kDialogBtnCancel' align='right'>CLOSE</div></td>";
		kdbox +="</tr>";
		kdbox +="<tr style='display: none'></tr>";
		kdbox +="</tbody></table>";
		kdbox +="</td></tr>";
		kdbox +="</tbody></table>";
		kdbox +="</td></tr>";
		kdbox +="</tbody></table></div>";
		$("#kDialogDiv").after(kdbox);
	}
	if(show){
		$("#kDialogBoxTitle").html(title);
		$("#kDialogBoxSubTitle").html(subtitle);
		$("#kDialogBtnOk").click(function(){callFunction(callback,"OK")});
		$("#kDialogBtnCancel").click(function(){callFunction(callback,"CANCEL")});

		$("#kDialogDiv").fadeIn(200, function(){
			$("#kDialogBox").fadeIn(200);
		});
	} else {
		$("#kDialogBox").fadeOut(200, function(){
			$("#kDialogDiv").fadeOut(200);
		});
	}
	if(waring)
	{
		$('#kDialogIconWaring').show();
	}else
	{
		$('#kDialogIconWaring').hide();
	}
};

var hideDialogBox = function(){
	showDialogBox(false);
};

var SetStandByMode = function(show)
{
	if(show)
	{
		$("#StandByBackgroundDiv").fadeIn(200,function(){
			$("#StandByDiv").fadeIn(200);
		});
	} else {
		$("#StandByDiv").fadeOut(200,function(){
			$("#StandByBackgroundDiv").fadeOut(200);
		});
	}
};

var SetStandByModeNoFade= function(){
	$("#StandByDiv").hide();
	$("#StandByBackgroundDiv").hide();
};

var netstate_init_sync_queries=function(){
    httpComm.setCommunicationEnabled(false);
    httpComm.Settings.NumberOfCommandsSendInGroup =1;//<24
    httpComm.addHandler("LOCK-FP",AllLockModeHander);
    httpComm.SyncQueriesList.Init();
    httpComm.SyncQueriesList.Add("LOCK-FP?");//AFV模式
    routing_debug_query_count=0;
    httpComm.setCommunicationEnabled(true);
    refreshCommands();
};
var Device_Settings_sync_queries=function()
{
    httpComm.setCommunicationEnabled(false);
    httpComm.Settings.NumberOfCommandsSendInGroup =12;//<24
    httpComm.addHandler("MODEL", ModeelHandler);
    httpComm.addHandler("NAME", DnsName_Handler);
    httpComm.addHandler("SN", SNHandler);
    httpComm.addHandler("NET-MAC", NetmacHandler);
    httpComm.addHandler("VERSION", VersionHandler);
    httpComm.addHandler("NET-DHCP", NetdhcpHandler);
    httpComm.addHandler("NET-IP", NetipHandler);
    httpComm.addHandler("NET-MASK", NetmaskHandler);
    httpComm.addHandler("NET-GATE", NetgateHandler);
    httpComm.addHandler("ETH-PORT 0,", NetTCPportHandler);
    httpComm.addHandler("ETH-PORT 1,", NetUDPportHandler);
    httpComm.addHandler("LOCK-FP",AllLockModeHander);
    httpComm.SyncQueriesList.Init();
    httpComm.SyncQueriesList.Add("MODEL?");
    httpComm.SyncQueriesList.Add("NAME?");
    httpComm.SyncQueriesList.Add("SN?");
    httpComm.SyncQueriesList.Add("NET-MAC?");
    httpComm.SyncQueriesList.Add("VERSION?");
    httpComm.SyncQueriesList.Add("NET-DHCP?");
    httpComm.SyncQueriesList.Add("NET-IP?");
    httpComm.SyncQueriesList.Add("NET-MASK?");
    httpComm.SyncQueriesList.Add("NET-GATE?");
    httpComm.SyncQueriesList.Add("ETH-PORT? 0");
    httpComm.SyncQueriesList.Add("ETH-PORT? 1");
    httpComm.SyncQueriesList.Add("LOCK-FP?");//AFV模式
    httpComm.setCommunicationEnabled(!0);
    refreshCommands();
};
var Av_sw_timeout_flag='';
var Av_sw_timeoutHandler=function(reply)
{
    var rep = reply.parameters;
    var value = $.trim(rep);
    var data=document.getElementById('input_value_sycn');
    if(data!=null)
    {
        if(Av_sw_timeout_flag==value)
        {
        }
        else
        {
            data.value=value;
        }
    }
    Av_sw_timeout_flag=value;
};
var DnsName_Handler=function(reply)
{
    var rep = reply.parameters;
    document.getElementById("Unit").innerHTML=rep;
};
var SNHandler=function(reply)
{
    var rep = reply.parameters;
    document.getElementById("GeneralSerialNumber").innerHTML=rep;
};
var ModeelHandler=function(reply)
{
    var rep = reply.parameters;
    var Modelflag=document.getElementById("GeneralModelName");
    if(Modelflag==null)
    {
        console.log("沒有加載啊啊");
        return false;
    }
    else
    {
        Modelflag.innerHTML=rep;
    }
};
var NetmacHandler=function(reply)
{
    var rep = reply.parameters;
    document.getElementById("MAC").innerHTML=rep;
};
var VersionHandler=function(reply)
{
    var rep = reply.parameters;
    document.getElementById("GeneralVersion").innerHTML=rep;
};
var Ip_flag="";
var NetipHandler=function(reply)
{
    var rep = reply.parameters;

    var value = $.trim(rep);
    var data=document.getElementById('input_value_IPaddress');
    if(data!=null)
    {
        inputField.INPUT_OBJECT_ARRAY[0].oldValue=value;
        inputField.INPUT_OBJECT_ARRAY[0].value=value;
        if(Ip_flag==value)
        {
        }
        else
        {
            Ip_flag=value;
            data.value=Ip_flag;
        }
    }
};

var Mask_flag="";
var NetmaskHandler=function(reply)
{
    var rep = reply.parameters;
    var value = $.trim(rep);
    var data=document.getElementById('input_value_Mask');
    if(data!=null)
    {
        inputField.INPUT_OBJECT_ARRAY[1].oldValue=value;
        inputField.INPUT_OBJECT_ARRAY[1].value=value;
        if(Mask_flag==value)
        {
        }
        else
        {
            Mask_flag=value;
            data.value=Mask_flag;
        }
    }
};

var Getaway_flag="";
var NetgateHandler=function(reply)
{
    var rep = reply.parameters;
    var value = $.trim(rep);
    var data=document.getElementById('input_value_Gateway');
    if(data!=null)
    {
        inputField.INPUT_OBJECT_ARRAY[2].oldValue=value;
        inputField.INPUT_OBJECT_ARRAY[2].value=value;
        if(Getaway_flag==value)
        {
        }
        else
        {
            Getaway_flag=value;
            data.value=Getaway_flag;
        }
    }
};

var NetTCPport_flag="";
var NetTCPportHandler=function(reply)
{

    var value =$.trim(reply.parameters.split(',')[1]);
    var data=document.getElementById('input_value_TCPPort');
    if(data!=null)
    {
        inputField.INPUT_OBJECT_ARRAY[3].oldValue=value;
        inputField.INPUT_OBJECT_ARRAY[3].value=value;
        if(NetTCPport_flag==value)
        {
        }
        else
        {
            NetTCPport_flag=value;
            data.value=NetTCPport_flag;
        }
    }
};

var NetUDPport_flag="";
var NetUDPportHandler=function(reply)
{

    var value =$.trim(reply.parameters.split(',')[1]);
    var data=document.getElementById('input_value_UDPPort');
    if(data!=null)
    {
        inputField.INPUT_OBJECT_ARRAY[4].oldValue=value;
        inputField.INPUT_OBJECT_ARRAY[4].value=value;
        if(NetUDPport_flag==value)
        {
        }
        else
        {
            NetUDPport_flag=value;
            data.value=NetUDPport_flag;
        }
    }
};

var NetdhcpHandler=function(reply)
{
    var rep=parseInt(reply.parameters);
    var hdcpvalue=document.getElementById("xmlcheck_dhcp");
    if(hdcpvalue!=null)
    {
        if(rep==1)
        {
            DHCPMODEFLAG=true;
            hdcpvalue.checked=true;
        }
        else
        {
            DHCPMODEFLAG=false;
            hdcpvalue.checked=false;
        }
    }
};

var toggleMenuDiv=function()
{
    $("#menuContainer").is(":visible")?$("#menuContainer").animate({marginLeft:"-200px"},300,
        function()
        {
            $("#menuContainer").hide();
            $("#imgOpenMenu").addClass("icon_open");
            $("#imgOpenMenu").removeClass("icon_close");
        }):($("#menuContainer").show(),$("#menuContainer").animate({marginLeft:"0px"},300,
        function()
        {
            $("#imgOpenMenu").addClass("icon_close");
            $("#imgOpenMenu").removeClass("icon_open")
        }))
};

var jifukui_button_select=function(str,id,num)
{
    var i=0;
    var buttonid;
    for(i;i<num;i++)
    {
        buttonid="#"+str+i;
        if($(buttonid).hasClass("jifukui_setbutton"))
        {
            $(buttonid).removeClass("jifukui_setbutton");
        }
        else
        {
        }
    }
    buttonid="#"+str+id;
    $(buttonid).addClass("jifukui_setbutton");
};

var fr_update_choosedFile=function()
{
    var a=$("#HttpCommUploadIFrame #HttpCommUploadFile").val();
    var file_name = document.forms['HttpCommUploadIFrame']['HttpCommUploadFile'].files[0];
    if(""==a)
        $("#fr_file_selected").html("Choose a file");
    else
    {
        $("#HttpCommBtnUpload").removeClass("DisSetButton");
        $("#HttpCommBtnUpload").addClass("SetButton");
		ligObject.updatafile=a;
        $("#fr_file_selected").html(file_name.name);
    }
};
var CommandStatus=function(value)
{
    return value.search(/err\d+/i)==-1?true:false;
};

//@ sourceURL=init.js