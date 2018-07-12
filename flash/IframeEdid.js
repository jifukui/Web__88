parent.edidscriptToLoadReties = 3;
parent.edidscriptToLoadIndex=0;
function loaded ()
{
    parent.httpComm.setCommunicationEnabled(false);
    console.log("start load");
    $.ajaxSetup({cache:false});
    $.getScript(parent.edidscriptload[parent.edidscriptToLoadIndex], function(){
        parent.edidscriptToLoadReties = 3;
        parent.edidscriptToLoadIndex++;
        if(parent.edidscriptToLoadIndex==parent.edidscriptload.length)
        {
            $("#jifukui").append("<div style='margin: 0px 7px' >Outputs</div>");
            for(var i=0;i<parent.ligObject.OutputCounts;i++)
            {
                var id="outputs_"+i;
                $("#jifukui").append("<div  id='"+id+"' style='cursor: pointer'/>");
                var rb = new jifukui_routeButton("rb_outputs"+i);
                rb.index = (i+1);
                rb.showExpanded = false;
                rb.labelInfoList[0] = "";
                var text="";
                text +="<td class='routeControlTextLabel1'>"+"Output"+(parseInt(i)+1)+"</td>";
                rb.actionButtonList[0] =text;

                rb.groupId = "outputs";
                rb.onAction =parent.edid_outputsOnSelection;
                rb.create(id);
            }
            $("#jifukui").append("<div style='margin: 0px 7px' >Inputs</div>");
            for(var i=0;i<parent.ligObject.InputCounts;i++)//parent.inputsCount
            {
                var id="inputs_"+i;
                $("#jifukui").append("<div id='"+id+"' style='cursor: pointer'/>");
                var rb = new jifukui_routeButton("rb_inputs"+i);
                rb.index = (i+1);
                rb.showExpanded = false;
                rb.labelInfoList[0] = "Input"+(parseInt(i)+1);
                rb.labelInfoList[1] = "~HDMI";
                rb.groupId = "inputs";
                rb.onAction =parent.edid_inputsOnSelection;
                rb.create(id);
            }
            myScrolledid = new IScroll('#edidscrolldiv', {
                scrollbars: true,
                mouseWheel: true,
                interactiveScrollbars: true,
                shrinkScrollbars: 'scale',
                fadeScrollbars: true
            });
            parent.edid_init_sync_queries();
        }
        else {
            loaded();
        }
    }).fail(function(jqXHR, textStatus, errorThrown){
        console.log("fail jqxhr "+jqXHR.readyState);
        console.log("fail jqxhr "+jqXHR.status);
        console.log("fail jqxhr "+jqXHR.statusText);
        console.log("fail jqxhr "+jqXHR.responseText);
        console.log("fail textStatus"+textStatus);
        console.log("fail errorThrown"+errorThrown);
        parent.edidscriptToLoadReties--;
        if(parent.edidscriptToLoadReties >= 0)
            loaded();
        else
        {
            console.log("load error "+parent.edidscriptload[parent.edidscriptToLoadIndex]);
            parent.edid_init_sync_queries();
        }
    });
}