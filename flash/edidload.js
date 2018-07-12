/**
 * Created by jifukui on 2016/8/9.
 */
function loaded ()
{
    console.log("start load");
    $.ajaxSetup({cache:false});
    $.getScript(parent.edidscriptload[parent.edidscriptToLoadIndex], function(){
        parent.edidscriptToLoadReties = 3;
        parent.edidscriptToLoadIndex++;
        if(parent.edidscriptToLoadIndex==parent.edidscriptload.length)
        {
            $("#jifukui").append("<div style='margin: 0px 7px' >Outputs</div>");
            var i;
            for(i=0;i<parent.ligObject.OutputCounts;i++)
            {
                var id="outputs_"+i;
                $("#jifukui").append("<div  id='"+id+"' style='cursor: pointer'/>");
                var rb = new jifukui_routeButton("rb_outputs"+i);
                rb.index = (i+1);
                rb.showExpanded = false;

                // Labels
                var text="";
                text +="<td class='routeControlTextLabel1'>"+"Output"+(parseInt(i)+1)+"</td>";
                rb.actionButtonList[0] =text;
                rb.groupId = "outputs";
                rb.onAction =parent.edid_outputsOnSelection;
                rb.create(id);
            }
            // AddInputs
            $("#jifukui").append("<div style='margin: 0px 7px' >Inputs</div>");
            for(i=0;i<parent.ligObject.InputCounts;i++)
            {
                var id="inputs_"+i;
                $("#jifukui").append("<div id='"+id+"' style='cursor: pointer'/>");
                var rb = new jifukui_routeButton("rb_inputs"+i);
                rb.index = (i+1);
                rb.showExpanded = false;

                // Labels

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
            console.log("end load");
            parent.edid_init_sync_queries();
        }
        else {
            loaded();
        }
    }).fail(function(){
        parent.edidscriptToLoadReties--;
        if(parent.edidscriptToLoadReties != 0)
            loaded();
        else
            console.log("load error "+parent.edidscriptload[parent.edidscriptToLoadIndex]);
    });

}