function kvslider(id){
	this.id = id;
	this.positionTop = 0;
	this.positionLeft = 0;
	this.height = 310;
	this.width = 25;
	this.knoobPosition = 0;
	this.context = null;
	this.knoobImage = null;
	this.drawingCanvas = null;
	this.isMouseDown = false;
	this.isMuted = false;
	this.percent = 100;
	this.unit = "%";
	this.max = 100;
	this.min = 0;
	this.offset = 0;
	this.isOnOff = false;
	this.icon_on = "iconVolume";
	this.icon_off = "iconVolumeMuted";
	this.tooltip_on = "Click to mute";
	this.tooltip_off = "Click to unmute";
	this.sendEventOnMove = false;
	this.lastValueSended = 5;
	
	// EVENTS
	this.onVolumeChanged = null;
	this.onOnOffChanged = null;
	
	
	this.setPosition = function(top, left){
		this.positionTop = top;
		this.positionLeft = left;
	}
	
	this.createSlider = function(addToDiv, title){
		KSlider_registerSliders[this.id] = this;
		
		this.knoobImage = new Image();
		this.knoobImage.src="knoob.png";
		var htmlStr = "";
		htmlStr+= "<div id='"+id+"' class='kvslider kvslider_title'>";		
		htmlStr+= "<table>";
		htmlStr+= "<tr><td><div>"+title+"</div>";
		htmlStr+= "</td></tr>";
		htmlStr+= "<tr><td>";
		htmlStr+= "<canvas  width='"+this.width+"' height='"+this.height+"' id='canvas_"+id+"' ";
		htmlStr+= "onmousemove='KSlider_on_canvas_mousemove(\""+id+"\", event);' ";
		htmlStr+= "onmousedown='KSlider_on_canvas_mousedown(\""+id+"\", event);' ";
		htmlStr+= "onmouseup='KSlider_on_canvas_mouseup(\""+id+"\", true);' ";
		htmlStr+= "onmouseout='KSlider_on_canvas_mouseout(\""+id+"\");' ";
			
		htmlStr+= " class=''></canvas>";		
		htmlStr+= "</td></tr>";
		
		htmlStr+= "<tr><td><div id='percent_"+id+"'>100%</div>";
		htmlStr+= "</td></tr>";
		
		htmlStr+= "<tr><td><div id='mute_"+id+"' class='mousePointer tooltip "+this.icon_on+"' onClick='KSlider_on_mute_click(\""+id+"\");' data-title='"+this.tooltip_on+"'/>";
		htmlStr+= "</td></tr>";
		
		htmlStr+= "</table>";
		htmlStr+= "</div>";
	
		$("#"+addToDiv).append(htmlStr);
		
		this.drawingCanvas = document.getElementById('canvas_'+id);
		
		this.context = this.drawingCanvas.getContext('2d');
		this.draw();
		this.setPercent();
	}
	
	this.draw = function(){
		if(this.knoobPosition < 0) this.knoobPosition = 0;
		if(this.knoobPosition > this.height - 45)this.knoobPosition = this.height - 45;
		this.context.fillStyle = "#383838";
		this.context.roundRect(0,0,this.width,this.height,5);
		this.context.fill();		
		
		if(this.isMuted && !this.isOnOff)
			this.context.fillStyle = "#686868";
		else
			this.context.fillStyle = "#975697";
			
		this.context.roundRect(0,this.knoobPosition,25,45,5);
		this.context.fill();
		this.context.drawImage(this.knoobImage, 5, this.knoobPosition+10);
	}
	
	this.setPercent = function(){
		this.percent = this.getPercent() + this.offset;
		var val = "" + this.percent + this.unit;
		
		if(!this.isOnOff)
			if(this.isMuted)
				val="Muted";
			
		$("#percent_"+this.id).html(val);
	}
	
	this.getPercent = function(){
		var p = 0;
		p = parseInt(parseFloat(this.knoobPosition) / parseFloat(this.height-45) * this.max);		
		if(p < this.min) p = this.min;
		if(p > this.max) p = this.max;
		return this.max - p;
	}
	
	this.toggleMute = function(){
		this.isMuted = !this.isMuted;
		this.setPercent();
		this.draw();
	}
	
	this.setValue = function(value)
	{
		value = parseInt(value) - this.offset;
		this.knoobPosition = this.height-45 - parseInt(parseFloat(value) / parseFloat(this.max)  * parseFloat(this.height-45));
		this.setPercent();
		this.draw();
	}
}

var KSlider_registerSliders = new Array();

var KSlider_on_canvas_mousemove = function(id, evt){
	var kslider = KSlider_registerSliders[id];
	if(!kslider.isMuted || kslider.isOnOff)
	{
		
		drawingCanvas = document.getElementById("canvas_"+id);
		var mousePos = getMousePos(drawingCanvas, evt);
		
		if(kslider.isMouseDown){
			if(mousePos !="error"){
				kslider.knoobPosition = mousePos.y - 22;
				kslider.setPercent();
				kslider.draw();
				
				if(kslider.sendEventOnMove)
				{
					kslider.lastValueSended--;
					
					if(kslider.lastValueSended == 0){
						kslider.lastValueSended  = 5;
				
						KSlider_on_canvas_mouseup(id, true, true);
					}
				}
					
			}
		}
		
		if((mousePos.y > kslider.knoobPosition) && (mousePos.y < kslider.knoobPosition+46))
		{
			$("#canvas_"+id).addClass("mousePointer");
		} else {
			$("#canvas_"+id).removeClass("mousePointer");
		}
		
	}
}

var KSlider_on_canvas_mousedown = function(id, evt){
	var kslider = KSlider_registerSliders[id];
	drawingCanvas = document.getElementById("canvas_"+id);
	var mousePos = getMousePos(drawingCanvas, evt);
	
	if((mousePos.y > kslider.knoobPosition) && (mousePos.y < kslider.knoobPosition+46))
	{
		KSlider_registerSliders[id].isMouseDown = true;
	}
}

var KSlider_on_canvas_mouseup = function(id, sendEvent, notReleaseMouse){
	var kslider = KSlider_registerSliders[id];	
	kslider.getPercent();
	
	if(!notReleaseMouse)
		kslider.isMouseDown = false;
		
	if(sendEvent)
		if(kslider.onVolumeChanged != null)
		{
			kslider.onVolumeChanged(id, kslider.percent);			
		}
}

var KSlider_on_canvas_mouseout = function(id){
	var kslider = KSlider_registerSliders[id];
	if(kslider.isMouseDown)
	{
		KSlider_on_canvas_mouseup(id, true);
	}
	else
		KSlider_on_canvas_mouseup(id, false);
	
	kslider.isMouseDown = false;
}

var KSlider_set_mute = function(id, mute){
	var kslider =KSlider_registerSliders[id];
	kslider.isMuted = mute;
	kslider.setPercent();
	kslider.draw();
	
	if(mute)
	{
		$("#mute_"+id).removeClass(kslider.icon_on);	
		$("#mute_"+id).addClass(kslider.icon_off);			
		$("#mute_"+id).attr("data-title",kslider.tooltip_off);
	}
	else
	{
		$("#mute_"+id).removeClass(kslider.icon_off);	
		$("#mute_"+id).addClass(kslider.icon_on);	
		$("#mute_"+id).attr("data-title",kslider.tooltip_on);		
	}
}

var KSlider_on_mute_click = function(id){
	var kslider =KSlider_registerSliders[id];
	kslider.toggleMute();
	
	if(kslider.isMuted)
	{
		$("#mute_"+id).removeClass(kslider.icon_on);	
		$("#mute_"+id).addClass(kslider.icon_off);			
		$("#mute_"+id).attr("data-title",kslider.tooltip_off);
		if(kslider.onOnOffChanged!=null)
			kslider.onOnOffChanged(id,false);
	}
	else
	{
		$("#mute_"+id).removeClass(kslider.icon_off);	
		$("#mute_"+id).addClass(kslider.icon_on);	
		$("#mute_"+id).attr("data-title",kslider.tooltip_on);
		if(kslider.onOnOffChanged!=null)
			kslider.onOnOffChanged(id,true);
	}
}
//@ sourceURL=kslider.js