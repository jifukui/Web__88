/*創建onoffbutton函數*/
function onoffButton(id, funcToRun){
	this.id = id;
	this.enabled = false;
	this.isOn = true;
	this.putOnDiv = "";
	this.funcToRun = funcToRun;
	this.onName = "ON";
	this.offName = "OFF";
	this.value = "1";
	this.refreshAfterSet = false;
	
	onoffButton.ONOFF_OBJECT_ARRAY[onoffButton.ONOFF_COUNT] = this;
	onoffButton.ONOFF_COUNT++;
	
	this.create = function(putOnDiv){
		this.putOnDiv = putOnDiv;
		this.setOn(this.isOn);
		this.refresh();
	};
	
	this.setEnable = function(enable){
		this.enabled = enable;		
	};
	
	this.setOn = function(signal)
	{
		this.signal = signal;
		this.refresh();	
	};
	
	this.refresh = function(){
		var str = "";
		
		var isOnActive = this.isOn?"btnOnOffSelected":"";
		var isOffActive = this.isOn?"":"btnOnOffSelected";
		
		str +="<div class='divOnOff' id='"+this.id+"'>";
		str +="<table><tr>";
		str +="<td><div id='on_"+this.id+"' class='btnOnOff "+isOnActive+"' onclick='onoffButton.ONOFF_CLICK(\""+this.id+"\",\"ON\");'>"+this.onName+"</div></td>";
		str +="<td><div id='off_"+this.id+"' class='btnOnOff "+isOffActive+"' onclick='onoffButton.ONOFF_CLICK(\""+this.id+"\",\"OFF\");'>"+this.offName+"</div></td>";
		str +="</tr></table>";
		str +="</div>";
			
		$("#"+this.putOnDiv).html(str);		
	}
}

// STATIC 
onoffButton.ONOFF_COUNT = 0;
onoffButton.ONOFF_OBJECT_ARRAY = new Array();
onoffButton.ONOFF_CLEAR = function(){
	onoffButton.ONOFF_COUNT = 0;
	onoffButton.ONOFF_OBJECT_ARRAY.length = 0;
};

onoffButton.ONOFF_CLICK = function(id, onoff){
	if(onoff == "ON")
		onoffButton.ONOFF_SELECT(id, "1");		
	if(onoff == "OFF")
		onoffButton.ONOFF_SELECT(id, "0");		
	
	$("#btnSet_"+id).css("display", "block");
};

/**********
* OnOffSelect
***********************/
onoffButton.ONOFF_SELECT = function(id, value)
{
	if(value == "1"){
		$('#on_'+id).addClass("btnOnOffSelected");
		$('#off_'+id).removeClass("btnOnOffSelected");		
		
		onoffButton.ONOFF_SET_FUNC(id, 1);
	}
	
	if(value == "0"){
		$('#on_'+id).removeClass("btnOnOffSelected");
		$('#off_'+id).addClass("btnOnOffSelected");
		
		onoffButton.ONOFF_SET_FUNC(id, 0);
	}
};

onoffButton.ONOFF_SET_FUNC = function(id, value)
{
	for (var i in onoffButton.ONOFF_OBJECT_ARRAY)
	{
		var objectId = onoffButton.ONOFF_OBJECT_ARRAY[i].id;
		if(objectId == id)
		{
            ligObject.timeoutcurrentselect=i;
			onoffButton.ONOFF_OBJECT_ARRAY[i].value = value;
			callFunction( onoffButton.ONOFF_OBJECT_ARRAY[i].funcToRun, value );	
			
			// Refresh the current windows after set if is required
			if(onoffButton.ONOFF_OBJECT_ARRAY[i].refreshAfterSet)
			{
				showLoading(true);	
				onoffButton.ONOFF_CLEAR();							
				openPropertiesDiv(_CURRENT_MENU_);
			}			
		}
	}
};

onoffButton.ONOFF_GET_VALUE = function(id)
{
	for (var i in onoffButton.ONOFF_OBJECT_ARRAY)
	{
		var objectId = onoffButton.ONOFF_OBJECT_ARRAY[i].id;
		if(objectId == id)
		{
			return onoffButton.ONOFF_OBJECT_ARRAY[i].value;
		}
	}
};


//@ sourceURL=onoffbutton.js