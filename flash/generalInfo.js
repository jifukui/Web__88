var getGeneralModelName = function(){
    var value=getGeneralValue(sendAndWaitCommand("MODEL?"));
    value=value.slice(value.indexOf(" "),value.length);
		return  value;
};

var getGeneralVersion = function(){
    return  getGeneralValue(sendAndWaitCommand("VERSION?")).split(" ")[1];
};

var getGeneralSerialNumber = function(){
	return  getGeneralValue(sendAndWaitCommand("SN?")).split(" ")[1];
};

/* WIFI */
var fnc_wifiRefresh = function(){
	alert("REFRESH");
};

var fnc_wifi_savechanges = function(){
	alert("SAVE CHANGES");
};

var getWifi_enable = function(){
	return "ON";
};

var setWifi_enable = function(value){
	//alert("SET "+value);
	/*var err = sendAndWaitCommand("net-gate "+value);	
	checkForErrors(err);*/
};


var getWifi_autoConect = function(){
	return "ON";
};

var setWifi_autoConect = function(value){
	//alert("SET "+value);
	/*var err = sendAndWaitCommand("net-gate "+value);	
	checkForErrors(err);*/
};

var getConnectedClients = function(){
	var list=new Array();
	for(var i=0;i<5;i++)
	{
		list[i] = new Array();
		list[i][0]="192.168.1.10"+i;
		list[i][1]="Port"+i;
		list[i][2]="Wired Ethernet";
		list[i][3]=i;
	}
	return list;
};

var getWifiStatus = function(){
	var list=new Array();
	for(var i=0;i<10;i++)
	{
		list[i] = new Array();
		list[i][0]="Network "+i;
		list[i][1]=""+(Math.floor(Math.random()*5)+1);
		list[i][2]="Disconnected";	
		list[i][3]="0";
		
		if(i == 0) {			
			list[i][1]="5";	
			list[i][2]="Connected";	
			list[i][3]="1";	
		}
	}
	return list;
};
