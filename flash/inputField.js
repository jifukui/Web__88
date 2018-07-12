/*****************************
* Project: Generic Web
* File: inputField.js
* Author: Leonardo Severini
* Last modify: 27/02/2013
******************************/

/*****************************
* inputField Class
*******************************/
function inputField(a,b)
{
    this.id=a;
    this.enabled=!0;
    this.putOnDiv=this.oldValue=this.value="";
    this.funcToRun=b;
    this.error=!1;
    this.InputType="text";
    this.refreshAfterSet=this.rightAlign=!1;
    inputField.INPUT_OBJECT_ARRAY[inputField.INPUT_COUNT]=this;
    inputField.INPUT_COUNT++;
    this.create=function(a)
    {
        this.putOnDiv=a;
        this.refresh()
    };
    this.setValue=function(a)
    {
        this.value=a;
        this.refresh()
    };
    this.refresh=function()
    {
        var a,d="",e="onclick='inputField.INPUT_SET_FUNC(\""+this.id+'", "'+b+"\");'";
        this.enabled||(d="disabled",e="");
        var h=this.rightAlign?"alignToRigth":"";a=""+("<div class='divInputField' id='"+this.id+"'>");
        a=a+"<table><tr>"+("<td ><input "+d+" class='"+h+"' type='"+this.InputType+"' id='input_value_"+this.id+"' value='"+this.value+"' oninput='inputField.INPUT_LOSEFOCUS(\""+this.id+"\");'/></td>");
        a+="<td style='display: none'><div id='input_setbtn_"+this.id+"' class='setButton setButtonDisable' "+e+">SET<div></td>";a+="</tr></table>";
        a+="</div>";
        $("#"+this.putOnDiv).html(a)
    }
}
inputField.INPUT_COUNT=0;
inputField.INPUT_OBJECT_ARRAY=[];
inputField.INPUT_CLEAR= function()
{
    inputField.INPUT_COUNT=0;
    inputField.INPUT_OBJECT_ARRAY.length=0
};
inputField.GET_INDEX_BY_ID=function(a)
{
    for(var b in inputField.INPUT_OBJECT_ARRAY)
        if(inputField.INPUT_OBJECT_ARRAY[b].id==a)
            return b;
    return null
};
inputField.GET_INPUT_BY_ID=function(a)
{
    a=inputField.GET_INDEX_BY_ID(a);
    return null!=a?inputField.INPUT_OBJECT_ARRAY[a]:null
};
//
inputField.INPUT_LOSEFOCUS=function(a)
{
    var b=inputField.GET_INDEX_BY_ID(a);
    if(inputField.INPUT_OBJECT_ARRAY[b].value!=$("#input_value_"+a).val())
    {
        ligObject.netsetflag[b]=true;
    }
    else
    {
        ligObject.netsetflag[b]=false;
    }
    for(var i=0;i<ligObject.netsetflag.length;i++)
    {
        if(ligObject.netsetflag[i]==true)
        {
            console.log(ligObject.netsetflag[i]);
            $("#actionId_setnet").addClass("actionButton");
            return true;
        }
    }
    $("#actionId_setnet").removeClass("actionButton");
};
inputField.setEnable=function(a,b)
{
    this.enabled=b;
    var c=inputField.GET_INDEX_BY_ID(a),c=inputField.INPUT_OBJECT_ARRAY[c];
    c.enabled=b;
    c.refresh();
};
inputField.INPUT_SET_FUNC=function(id)
{
    var value = $("#input_value_"+id).val();

    for (var i in inputField.INPUT_OBJECT_ARRAY)
    {
        var objectId = inputField.INPUT_OBJECT_ARRAY[i].id;
        if(objectId == id)
        {
            $("#input_setbtn_"+id).addClass("setButtonDisable");
            var err = callFunction( inputField.INPUT_OBJECT_ARRAY[i].funcToRun, value );
            var hasErr = checkForErrors(err);
            inputField.INPUT_SET_ERROR(id, hasErr);
            if(!hasErr)
            {
                inputField.INPUT_OBJECT_ARRAY[i].value = value;
                inputField.INPUT_OBJECT_ARRAY[i].oldValue=value;
            }

            if(inputField.INPUT_OBJECT_ARRAY[i].refreshAfterSet)
            {
                inputField.INPUT_CLEAR();
                openPropertiesDiv(_CURRENT_MENU_);
            }
        }
    }
};
inputField.INPUT_LAST_VALUE=function(a)
{
    var b=inputField.GET_INDEX_BY_ID(a);
    null!=b&&$("#input_value_"+a).value(inputField.INPUT_OBJECT_ARRAY[b].oldValue)
};
inputField.INPUT_SET_ERROR=function(a,b)
{
    var c=inputField.GET_INDEX_BY_ID(a);
    null!=c&&(b?
        ($("#input_value_"+a).addClass("inputError"),$("#input_value_"+a).val(inputField.INPUT_OBJECT_ARRAY[c].oldValue),inputField.INPUT_OBJECT_ARRAY[c].value=inputField.INPUT_OBJECT_ARRAY[c].oldValue,$("#actionId_setnet").removeClass("actionButton")):
        ($("#input_value_"+a).removeClass("inputError"),inputField.INPUT_OBJECT_ARRAY[c].oldValue=inputField.INPUT_OBJECT_ARRAY[c].value));


};
inputField.INPUT_SET_VALUE=function(a,b)
{
    var c=inputField.GET_INDEX_BY_ID(a);
    null!=c&&(inputField.INPUT_OBJECT_ARRAY[c].oldValue=""==inputField.INPUT_OBJECT_ARRAY[c].oldValue?
        b:
        inputField.INPUT_OBJECT_ARRAY[c].value,inputField.INPUT_OBJECT_ARRAY[c].value=b,$("#input_value_"+a).val(b))
};

//@ sourceURL=inputField.js