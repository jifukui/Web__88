var routingDefineUartsGui = new Array();
routingDefineUartsGui[1] = 4; // Out 3 
routingDefineUartsGui[2] = 5; // Out 4
routingDefineUartsGui[3] = 9; // ARM - VS62
routingDefineUartsGui[4] = 1; // In 4
routingDefineUartsGui[5] = 2; // In 5
routingDefineUartsGui[6] = 3; // In 6
routingDefineUartsGui[7] = 6; // Local 1
routingDefineUartsGui[8] = 7; // Local 2
routingDefineUartsGui[9] = 8; // Data - RS0232

var routingDefineUarts = new Array();
routingDefineUarts[4] = 1; 
routingDefineUarts[5] = 2; 
routingDefineUarts[9] = 3; 
routingDefineUarts[1] = 4; 
routingDefineUarts[2] = 5; 
routingDefineUarts[3] = 6; 
routingDefineUarts[6] = 7; 
routingDefineUarts[7] = 8; 
routingDefineUarts[8] = 9; 

var _num_of_uart = routingDefineUarts.length;

var routingDivRowsNames = new Array();
routingDivRowsNames[0]= "In 4";
routingDivRowsNames[1]= "In 5";
routingDivRowsNames[2]= "In 6";
routingDivRowsNames[3]= "Out 1";
routingDivRowsNames[4]= "Out 2";
routingDivRowsNames[5]= "Local 1";
routingDivRowsNames[6]= "Local 2";
routingDivRowsNames[7]= "RS-232";
routingDivRowsNames[8]= "VS-62";

var routingDivColsNames = new Array();
routingDivColsNames[0]= "In 4";
routingDivColsNames[1]= "In 5";
routingDivColsNames[2]= "In 6";
routingDivColsNames[3]= "Out 1";
routingDivColsNames[4]= "Out 2";
routingDivColsNames[5]= "Local 1";
routingDivColsNames[6]= "Local 2";
routingDivColsNames[7]= "RS-232";
routingDivColsNames[8]= "VS-62";


var dataRoutingDisabledCells = new Array();
dataRoutingDisabledCells[0]  = "dataRoutind_1_1";
dataRoutingDisabledCells[1]  = "dataRoutind_2_2";
dataRoutingDisabledCells[2]  = "dataRoutind_3_3";
dataRoutingDisabledCells[3]  = "dataRoutind_4_4";
dataRoutingDisabledCells[4]  = "dataRoutind_5_5";
dataRoutingDisabledCells[5]  = "dataRoutind_6_6";
dataRoutingDisabledCells[6]  = "dataRoutind_7_7";
dataRoutingDisabledCells[7]  = "dataRoutind_8_8";
dataRoutingDisabledCells[8]  = "dataRoutind_9_9";

dataRoutingDisabledCells[9]  = "dataRoutind_1_2";
dataRoutingDisabledCells[10]  = "dataRoutind_2_1";
dataRoutingDisabledCells[11]  = "dataRoutind_1_3";
dataRoutingDisabledCells[12]  = "dataRoutind_3_1";
dataRoutingDisabledCells[13]  = "dataRoutind_2_3";
dataRoutingDisabledCells[14]  = "dataRoutind_3_2";


dataRoutingDisabledCells[17]  = "dataRoutind_4_5";
dataRoutingDisabledCells[18]  = "dataRoutind_5_4";

dataRoutingDisabledCells[19]  = "dataRoutind_6_7";
dataRoutingDisabledCells[20]  = "dataRoutind_7_6";



/*
dataRoutingDisabledCells[9]  = "dataRoutind_4_1";
dataRoutingDisabledCells[10]  = "dataRoutind_4_2";
dataRoutingDisabledCells[11]  = "dataRoutind_4_3";
dataRoutingDisabledCells[12]  = "dataRoutind_4_4";

dataRoutingDisabledCells[13]  = "dataRoutind_1_4";
dataRoutingDisabledCells[14]  = "dataRoutind_2_4";
dataRoutingDisabledCells[15]  = "dataRoutind_3_4";
dataRoutingDisabledCells[16]  = "dataRoutind_4_4";

dataRoutingDisabledCells[17]  = "dataRoutind_5_1";
dataRoutingDisabledCells[18]  = "dataRoutind_5_2";
dataRoutingDisabledCells[19]  = "dataRoutind_5_3";

dataRoutingDisabledCells[20]  = "dataRoutind_1_5";
dataRoutingDisabledCells[21]  = "dataRoutind_2_5";
dataRoutingDisabledCells[22]  = "dataRoutind_3_5";

dataRoutingDisabledCells[23]  = "dataRoutind_4_8";
dataRoutingDisabledCells[24]  = "dataRoutind_5_8";

dataRoutingDisabledCells[25]  = "dataRoutind_8_4";
dataRoutingDisabledCells[26]  = "dataRoutind_8_5";
*/

/*********************************
* openDataRoutingDiv
***********************************/
var openDataRoutingDiv=function(value){
	$("#contentDiv").load("linkdata.html", function(){		
		loadDataRoutingGird("Inputs", "routingCol2", "inputBtn", routingDivRowsNames, routingDivColsNames, function(){ 
				// BTN_selectInput("outputsBtn_0"); 
				httpComm.setCommunicationEnabled(false);
				httpComm.init();
				dataRouting_init_sync_queries();
				httpComm.setCommunicationEnabled(true);
				refreshCommands();				
				centerContent();
				for(var i=0;i<dataRoutingDisabledCells.length;i++)
				{
					$("#"+dataRoutingDisabledCells[i]).addClass("dataRoutingTableDisabled");
					$("#"+dataRoutingDisabledCells[i]).removeClass("mousePointer");
					
				}
				
				
				setTimeout("showLoading(false);", 500);
			}
		);
	});	
}

/*********************************
* dataRouting_init_sync_queries
***********************************/
var dataRouting_init_sync_queries = function()
{
	httpComm.addHandler("ROUTE \\d,\\d,\\d", dataRoutingChangeHandler); 
	
	for(var i=4;i<=_num_of_uart ;i++){
		var uartStr = "ROUTE? 3,"+i;
		httpComm.SyncQueriesList.Add(uartStr);
	}
}

/*********************************
* dataRoutingChangeHandler
***********************************/
var dataRoutingChangeHandler = function(reply){
	var rep = reply.parameters.split(',');
	var p1 = parseInt(rep[1].toString());
	var p2 = parseInt(rep[2].toString())
	var col = routingDefineUartsGui[p1];
	var row = routingDefineUartsGui[p2];
	
	//console.log("RECEIVED : "+p1+" "+p2);
	
	if(col == 0 && row != 0)
	{
		var id = "dataRoutind_"+row+"_"+row;
		dataroutingRemoveColAndRow(id);
	}
	else if(row == 0 && col != 0)
	{
		var id = "dataRoutind_"+col+"_"+col;
		dataroutingRemoveColAndRow(id);
	} 
	else 
	{
		var orgId = "dataRoutind_"+col+"_"+row;
		var simId = "dataRoutind_"+row+"_"+col;
		
		if(!$("#"+orgId).hasClass("dataRoutingTableDisabled"))
		{
			dataroutingRemoveColAndRow(orgId);
			dataroutingRemoveColAndRow(simId);
			$("#"+orgId).addClass("dataRoutingTableIconSelected");
			$("#"+simId).addClass("dataRoutingTableIconSelected");
		} 
	}
}

/*********************************
* loadDataRoutingGird
***********************************/
var loadDataRoutingGird = function(title, divtoadd, id, rowsNames, colsNames, callback){
	var cols = colsNames.length;
	var rows = rowsNames.length;
	
	var str = "<table>"
	
	for(var c = 0;c<cols+1;c++)
	{
		str +="<tr >";
		for(var r = 0;r<rows+1;r++)
		{
			str +="<td class='dataRoutingTable'>";
			if(c==0)
			{
				if(r>0)
					str +="<div id='dataRoutingTitleRow"+ r +"' class='dataRoutingTableText'>"+ rowsNames[r-1] +"</div>";
			}
			else if(r==0)
			{
				if(c>0)
					str +="<div id='dataRoutingTitleCol"+ c +"' class='dataRoutingTableText'>"+ colsNames[c-1]+"</div>";
			
			} else
				str += "<div id='dataRoutind_"+c+"_"+r+"' class='dataRoutingTableIcon mousePointer' onclick='dataroutingClick(\"dataRoutind_"+c+"_"+r+"\");' onmouseover='dataroutingSetTitle("+c+","+r+");'></div>";
			
			str +="</td>";
		}
		str +="</tr>";
	}
	str +="</table>";
	str +="<div  class='dataRoutingTableFooterText'>...</br>...</div>"
	$("#RoutingDiv").html(str);
	if(callback!=null)
		callback();
}

/***
* dataroutingSetTitle
*/
var dataroutingSetTitle = function(col, row){
	var cid = "dataRoutingTitleCol"+ col;
	var rid = "dataRoutingTitleRow"+ row;
	
	var cols = routingDivColsNames.length;
	var rows = routingDivRowsNames.length;
	
	for(var c = 0;c<cols+1;c++)
	{
		$("#dataRoutingTitleCol"+c).removeClass("dataRoutingTableTextSelected");
	}
	
	for(var r = 0;r<rows+1;r++)
	{
		$("#dataRoutingTitleRow"+r).removeClass("dataRoutingTableTextSelected");
	}
	
	$("#dataRoutingTitleCol"+col).addClass("dataRoutingTableTextSelected");
	$("#dataRoutingTitleRow"+row).addClass("dataRoutingTableTextSelected");
	
}

/*********************************
* dataroutingClick
***********************************/
var dataroutingClick = function(id)
{
	var col = routingDefineUarts[id.split("_")[1]];
	var row = routingDefineUarts[id.split("_")[2]];
	
	if(!$("#"+id).hasClass("dataRoutingTableDisabled"))
	{
		httpComm.sendMessage("ROUTE 3,"+col+","+row);
		refreshCommands();
	}
	
	/*
	if(!$("#"+id).hasClass("dataRoutingTableDisabled"))
	{	
		if($("#"+id).hasClass("dataRoutingTableIconSelected"))
			$("#"+id).removeClass("dataRoutingTableIconSelected");
		else
	}
	*/
}

/*********************************
* dataroutingRemoveColAndRow
***********************************/
var dataroutingRemoveColAndRow = function(id)
{
	var cols = routingDivColsNames.length;
	var rows = routingDivRowsNames.length;
	
	var col = id.split("_")[1];
	var row = id.split("_")[2];
	
	for(var c = 0; c<cols+1 ; c++ )
		$("#dataRoutind_"+c+"_"+row).removeClass("dataRoutingTableIconSelected");
		
	for(var r = 0; r<cols+1 ; r++ )
		$("#dataRoutind_"+col+"_"+r).removeClass("dataRoutingTableIconSelected");
}