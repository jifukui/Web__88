function routeButton(id, funcToRun){
	this.id = id;	
	this.enabled = false;
	this.putOnDiv = "";
	this.index = "0";
	this.labelInfoList = Array();
	this.actionButtonList = Array();
	this.indexActionButtonList = Array();
	this.isSelected = false;	
	this.groupId = "";
	this.expanded = false;
	this.showExpanded = true;
	this.showHandOnOver = true;
	this.showColorOnOver = true;
	
	this.onAction = null;
	
	// Create
	this.create = function(putOnDiv){
		routeButton.ROUTE_BUTTON_OBJECT_ARRAY[routeButton.ROUTE_BUTTON_COUNT] = this;
		routeButton.ROUTE_BUTTON_COUNT++;	
		
		this.putOnDiv = putOnDiv;
		this.refresh();
	};
	
	this.createHtml = function(){
		var expandedIcon = (this.expanded)?"iconMinus":"iconPlus";
		var tooltipText = (this.expanded)?"Collapse":"Expand ";
		var selected = (this.isSelected)?"routeControlDiv_Selected":"";
		var showHand = (this.showHandOnOver)?"mousePointer":"";
		var showColor = (this.showColorOnOver)?"":"routeControlDivNoHover";
	
		var str="<div id='"+this.id+"' class='routeControlDiv "+ selected + " "+ showHand +" "+showColor+"' onclick='routeButton.mouseClick(\""+this.id+"\");'>";
		str+="<table class='routeControlTable'>";
		str+="	<tr>";
		
		if(this.showExpanded)
			str+="		<td class='routeControlTextLabel1' onclick='routeButton.expand(\""+this.id+"\");'><div class='tooltip "+expandedIcon+" mousePointer' data-title='"+tooltipText+"' /></td>";
		else 
			str+="		<td></td>";
			
		str+="		<td class='routeControlTextLabel1'>"+this.labelInfoList[0]+"</td>";
		
		if(this.actionButtonList[0])
			str+="		<td >"+this.actionButtonList[0]+"</td>";
		else
			str+="		<td></td>";
		
		if(this.indexActionButtonList[0])
			str+="		<td >"+this.indexActionButtonList[0]+"</td>";
		else
			str+="		<td></td>";
		str+="	</tr>";
		str+="</table>";
		str+="</div>";
		return str;
	};
	
	this.refresh = function(){
        console.log(this.putOnDiv);
		$("#"+this.putOnDiv).html(this.createHtml());
        console.log("end");
	};
	
	this.doAction = function(){
		if(this.onAction!=null)
			this.onAction(this.id);
	}
}
//取消+-按钮
function jifukui_routeButton(id, funcToRun){
    this.id = id;
    this.enabled = false;
    this.putOnDiv = "";
    this.index = "0";
    this.labelInfoList = Array();
    this.actionButtonList = Array();
    this.indexActionButtonList = Array();
    this.isSelected = false;
    this.groupId = "";
    this.expanded = false;
    this.showExpanded = true;
    this.showHandOnOver = true;
    this.showColorOnOver = true;
    this.onAction = null;

    // Create
    this.create = function(putOnDiv){
        routeButton.ROUTE_BUTTON_OBJECT_ARRAY[routeButton.ROUTE_BUTTON_COUNT] = this;
        routeButton.ROUTE_BUTTON_COUNT++;
        this.putOnDiv = putOnDiv;
        this.refresh();
    };

    this.createHtml = function(){
        var selected = (this.isSelected)?"routeControlDiv_Selected":"";
        var showHand = (this.showHandOnOver)?"mousePointer":"";
        var showColor = (this.showColorOnOver)?"":"routeControlDivNoHover";

        var str="<div id='"+this.id+"' class='routeControlDiv "+ selected + " "+ showHand +" "+showColor+"' onclick='routeButton.mouseClick(\""+this.id+"\");'>";
        str+="<table class='routeControlTable'><tr><td>";

        str+="	<table>";
        str+="		<td></td>";
        str+="		<td class='routeControlTextLabel1'>"+this.labelInfoList[0]+"</td>";
        str+="</table></td></tr>";

        str+="<tr><td><table>";
        if(this.actionButtonList[0])
            str+=this.actionButtonList[0];
        else
            str+="		<td></td>";
        str+="</table></td></tr>";

        str+="<tr><td><table>";
        if(this.indexActionButtonList[0])
            str+=this.indexActionButtonList[0];
        else
            str+="		<td></td>";
        str+="</table></td></tr>";

        str+="</td></tr></table>";
        str+="</div>";
        return str;
    };
    this.refresh = function(){
        $("#"+this.putOnDiv).html(this.createHtml());
    };

    this.doAction = function(){
        if(this.onAction!=null)
            this.onAction(this.id);
    }
}
//******** STATICS ************
routeButton.onSelection = null;
routeButton.ROUTE_BUTTON_COUNT = 0;
routeButton.ROUTE_BUTTON_OBJECT_ARRAY = new Array();

routeButton.ROUTE_BUTTON_CLEAR = function(){
	routeButton.ROUTE_BUTTON_COUNT = 0;
	routeButton.ROUTE_BUTTON_OBJECT_ARRAY = new Array();
};

routeButton.mouseClick = function(id){
	if(!routeButton.expandWasClicked)
	{
        $("#browse").addClass("setButtonDisable");
        $("#default").addClass("setButtonDisable");
		var obj = routeButton.getObjById(id);
		obj.doAction(id);
	}
	routeButton.expandWasClicked = false;	
};
routeButton.expandWasClicked = false;
routeButton.expand= function(id){
	routeButton.expandWasClicked = true;
	var obj = routeButton.getObjById(id);
	obj.expanded = !obj.expanded;
	obj.refresh();
};

routeButton.getObjById = function(id){
	var fid = -1;
	for(var i=0;i<routeButton.ROUTE_BUTTON_COUNT;i++){
		var obj = routeButton.ROUTE_BUTTON_OBJECT_ARRAY[i];		
		if(obj.id == id)
			fid = i;
	}

	if(fid != -1)
		return routeButton.ROUTE_BUTTON_OBJECT_ARRAY[fid];	
	else 
		return null;
};

routeButton.togleSelected = function(id){		
	var obj = routeButton.getObjById(id);
	obj.isSelected = !obj.isSelected;
	obj.refresh();
};

routeButton.setSelected = function(id, selected){
	var obj = routeButton.getObjById(id);
	obj.isSelected = selected;
	obj.refresh();
};

routeButton.setSelectedAllGroup = function(groupId, selected){
	for(var i=0;i<routeButton.ROUTE_BUTTON_COUNT;i++)
	{
		var obj = routeButton.ROUTE_BUTTON_OBJECT_ARRAY[i];
		 if(obj.groupId == groupId)
		 {
			obj.isSelected = selected;
			obj.refresh();
		 }
	 }
};

routeButton.getAllGroup = function(groupId){
	var arr = new Array();
	for(var i=0;i<routeButton.ROUTE_BUTTON_COUNT;i++)
	{
		var obj = routeButton.ROUTE_BUTTON_OBJECT_ARRAY[i];
		 if(obj.groupId == groupId)
		 {
			arr.push(obj);
		 }
	 }
	 return arr;
};

routeButton.refreshAll = function()
{
	for(var i=0;i<routeButton.ROUTE_BUTTON_COUNT;i++)
		 routeButton.ROUTE_BUTTON_OBJECT_ARRAY[i].refresh();
};