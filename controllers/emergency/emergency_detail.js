// var emergencydetail = Alloy.createController("/emergency/emergency_detail", {emergencyId : emerid,flightId:flightId}).getView();
// $.emergency_list.close();
// emergencydetail.open();
			

var args = arguments[0] || {}; 
var emergencyId=args.emergencyId;
var flightId=args.flightId;
var model = require('In-flight_model');
var data=model.getEmergencyDetail(emergencyId);


		var MainView = Ti.UI.createView({
			className : "row",
		    backgroundColor:"#E5E4E2",
		    height:"70px",
		    width:"100%",
		    top:"3px",
		   	layout:"horizontal",
		   	emergencyId : data.id
		   	
		});
		
		var td1 = Ti.UI.createView({left:"1%", height:"100%", width:"100%"});
			var label1=Ti.UI.createLabel({ text: data.emergencyType });
			td1.add(label1);
		MainView.add(td1);
		
		
$.scrollView.add(MainView);

$.backToList.addEventListener("click", function(e)  {
			var emergencylist = Alloy.createController("emergency/emergency_list", {flightId : flightId}).getView();
			$.emergency_detail.close();
			emergencylist.open();
 		});

	
if(OS_ANDROID){
	$.emergencyDetailWin.addEventListener('android:back', function(e) {
	    Ti.API.info("Press Back button");
	    $.emergencyDetailWin.removeAllChildren();
		$.emergencyDetailWin.close();
	});
} 		
	