// var emergencyList = Alloy.createController("/emergency/emergency_list", {flightId : "TG778_1" }).getView();
// $.index.close();
// emergencyList.open();

var args = arguments[0] || {}; 
var flightId=args.flightId;
var model = require('In-flight_model');
var data=model.getEmergencyList(flightId);


for(var ii=0;ii<data.length;ii++)
	{
		var MainView = Ti.UI.createView({
			className : "row",
		    backgroundColor:"#E5E4E2",
		    height:"70px",
		    width:"100%",
		    top:"3px",
		   	layout:"horizontal",
		   	emergencyId : data[ii].id
		   	
		});
		
		var td1 = Ti.UI.createView({left:"1%", height:"100%", width:"100%"});
			var label1=Ti.UI.createLabel({ text: data[ii].emergencyType });
			td1.add(label1);
		MainView.add(td1);
		
		
		MainView.addEventListener("click", function(e)  {
			var emerid=e.source.parent.emergencyId;
     
        	var emergencydetail = Alloy.createController("emergency/emergency_detail", {emergencyId : emerid,flightId:flightId}).getView();
			$.emergency_list.close();
			emergencydetail.open();
			
			
 		});
		$.scrollView.add(MainView);
	}
	
if(OS_ANDROID){
	$.emergencyListWin.addEventListener('android:back', function(e) {
	    Ti.API.info("Press Back button");
	    $.emergencyListWin.removeAllChildren();
		$.emergencyListWin.close();
	    
	});
}