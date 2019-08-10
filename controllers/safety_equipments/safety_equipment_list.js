// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var query_lib = require('query_lib');
var deck = "M";
var utility_lib = require('utility_lib');

if(OS_ANDROID)
{	

	//$.buttonView.top = 150;	
	//$.safetyList.top = 10;
	//$.view1.top = 20;
	$.safetyList.top = 30;
	$.anActIndicatorView.hide();
	
}

if(OS_IOS)
{
	$.anActIndicatorView.hide();
}

function openViewSafetyEquipmentLocation(e)
{
	var selView = Alloy.createController("safety_equipments/safety_equipment_location", {
		zone : e.source.name
	}).getView();
	
	if(OS_ANDROID)
	{
		$.anActIndicatorView.show();
	}
	
	if(OS_IOS){
		Alloy.Globals.activityIndicator.show();	
		Alloy.Globals.navGroupWin.openWindow(selView);	
	}else{
		selView.open();
	}
}

function setButton(){
	var flight = query_lib.getFlight(currentFlightId);
	if (flight != null){
		var hasUpper = query_lib.hasUpperdesk(flight.aircraftRegistration);
		if (hasUpper){
			var mainBtnView = Ti.UI.createView({
				width : "50%",
				height : "100%",
				borderColor : "white",
				borderWidth : 1,
				backgroundColor : "#80C6168D"
			});
			
			var mainLabel = $.UI.create("Label", {
				classes : ['fontBold20','colorWhite'],
				width : "100%",
				height : "100%",
				textAlign : "center",
				backgroundColor : "transparent",
				text : "Main Deck"
			});
			
			var upBtnView = Ti.UI.createView({
				width : "49.9%",
				height : "100%",
				borderColor : "white",
				borderWidth : 1
			});
			
			var upLabel = $.UI.create("Label", {
				classes : ['fontBold20','colorWhite'],
				width : "100%",
				height : "100%",
				textAlign : "center",
				backgroundColor : "transparent",
				text : "Upper Deck"
			});
			
			mainBtnView.add(mainLabel);
			upBtnView.add(upLabel);
			$.buttonView.add(mainBtnView);
			$.buttonView.add(upBtnView);
			mainBtnView.addEventListener('click', function(e){
				deck = "M";
				mainBtnView.backgroundColor = "#80C6168D";
				upBtnView.backgroundColor = "transparent";
				initialSafetyTable(deck);
			});
			
			upBtnView.addEventListener('click', function(e){
				deck = "U";
				mainBtnView.backgroundColor = "transparent";
				upBtnView.backgroundColor = "#80C6168D";
				initialSafetyTable(deck);
			});
			
			initialSafetyTable(deck);
		}else{
			var mainBtnView = Ti.UI.createView({
				width : "100%",
				height : "100%",
				borderColor : "white",
				borderWidth : 1,
				backgroundColor : "#80C6168D"
			});
			
			mainBtnView.backgroundColor = "#80C6168D";
			
			var mainLabel = $.UI.create("Label", {
				classes : ['fontBold20','colorWhite'],
				width : "100%",
				height : "100%",
				textAlign : "center",
				backgroundColor : "transparent",
				text : "Main Deck"
			});
			
			mainBtnView.add(mainLabel);
			$.buttonView.add(mainBtnView);
			initialSafetyTable(null);
		}
		
	}
}

function initialSafetyTable(deckTable){
	var zoneList = query_lib.getEquipmentZoneList();
	Ti.API.info('zoneList : '+ zoneList);
	if(!zoneList)
	{
		return;
	}
	var zoneData = [];
	var zoneCheck = null;
	
	$.safetyList.removeAllChildren();
	
	var mainView = Ti.UI.createView({
		width : "90%",
		height : Ti.UI.SIZE,
		//layout : "horizontal"
		layout : "vertical"
	});
	
	var centerMainView = Ti.UI.createView({
		width : "100%",
		height : Ti.UI.SIZE,
		layout : "vertical",
	});
	
	var leftRightView = Ti.UI.createView({
		width : "100%",
		top : -20,
		height : Ti.UI.SIZE,
		layout : "horizontal"
	});
	
	if(OS_IOS)
	{
		leftRightView.top = 0;
	}
	
	var leftMainView = Ti.UI.createView({
		width : "50%",
		height : Ti.UI.SIZE,
		layout : "vertical",
	});
	
	var rightMainView = Ti.UI.createView({
		width : "49.9%",
		height : Ti.UI.SIZE,
		layout : "vertical",
	});
	
	for (var i=0;i<zoneList.length;i++){
		if (deckTable != null) {
			if(zoneList[i].substring(2,3) == "L" && zoneList[i].substring(2,3) == "R"){
				var centerView = Ti.UI.createView({
					name : zoneList[i],
					width : "95%",
					height : "70",
					left : "2.5%",
					top : "5%",
					borderColor : "white",
					borderRadius : 10,
					borderWidth : 2
				});
				
				var centerBgView = Ti.UI.createView({
					width : "100%",
					height : "100%",
				});
					
				centerBgView.backgroundColor = "#80C6168D";
				centerView.add(centerBgView);
					
				
				var centerLabel = $.UI.create("Label", {
					classes : ['fontBold20','colorWhite'],
					name : zoneList[i],
					width : "100%",
					height : "100%",
					textAlign : "center",
					backgroundColor : "transparent",
					text : zoneList[i]
				});
				
				centerLabel.addEventListener('click', function(e){
					
					openViewSafetyEquipmentLocation(e);
					
				});
				
				
				centerView.add(centerLabel);
				centerMainView.add(centerView);
			}
		}else{
			if(zoneList[i].substring(1,2) != "L" && zoneList[i].substring(1,2) != "R"){
				var centerView = Ti.UI.createView({
					name : zoneList[i],
					width : "95%",
					height : "70",
					left : "2.5%",
					top : "5%",
					borderColor : "white",
					borderRadius : 10,
					borderWidth : 2
				});
				
				var centerLabel = $.UI.create("Label", {
					classes : ['fontBold20','colorWhite'],
					name : zoneList[i],
					width : "100%",
					height : "100%",
					textAlign : "center",
					backgroundColor : "transparent",
					text : zoneList[i]
				});
				
				
				var centerBgView = Ti.UI.createView({
					width : "100%",
					height : "100%",
				});
					
				centerBgView.backgroundColor = "#80C6168D";
				centerView.add(centerBgView);
					
				
				centerLabel.addEventListener('click', function(e){
					
					openViewSafetyEquipmentLocation(e);
					
				});
			
				centerView.add(centerLabel);
				centerMainView.add(centerView);
			}
		}
	}
	
	mainView.add(centerMainView);
	
	for (var i=0;i<zoneList.length;i++){
		if (deckTable != null) {
			if(zoneList[i].substring(0,1) == deckTable){
				if (zoneList[i].substring(2,3) == "L"){
					var leftView = Ti.UI.createView({
						name : zoneList[i],
						width : "90%",
						height : "70",
						right : "5%",
						top : "5%",
						//backgroundColor : "#80C6168D",
						borderRadius : 10,
						borderColor : "white",
						borderWidth : 2
					});
					
					var leftBgView = Ti.UI.createView({
						width : "100%",
						height : "100%",
					});
					
					leftBgView.backgroundColor = "#80C6168D";
					leftView.add(leftBgView);
					
					var leftLabel = $.UI.create("Label", {
						classes : ['fontBold20','colorWhite'],
						name : zoneList[i],
						width : "100%",
						height : "100%",
						textAlign : "center",
						backgroundColor : "transparent",
						text : zoneList[i]
					});
					
					leftLabel.addEventListener('click', function(e){
						openViewSafetyEquipmentLocation(e);
					});
					
					leftMainView.backgroundColor = "transparent";
					leftView.add(leftLabel);
					leftMainView.add(leftView);
					
				}else{
					var rightView = Ti.UI.createView({
						name : zoneList[i],
						width : "90%",
						height : "70",
						left : "5%",
						top : "5%",
						//backgroundColor : "#80C6168D",
						borderRadius : 10,
						borderColor : "white",
						borderRadius : 10,
						borderWidth : 2
					});
					
					
					var rightLabel = $.UI.create("Label", {
						classes : ['fontBold20','colorWhite'],
						name : zoneList[i],
						width : "100%",
						height : "100%",
						textAlign : "center",
						backgroundColor : "transparent",
						text : zoneList[i]
					});
					
					var rightBgView = Ti.UI.createView({
						width : "100%",
						height : "100%",
					});
					
					rightBgView.backgroundColor = "#80C6168D";
					rightView.add(rightBgView);
					
					rightLabel.addEventListener('click', function(e){
						openViewSafetyEquipmentLocation(e);
						
					});
					
					rightMainView.backgroundColor = "transparent";
					rightView.add(rightLabel);
					rightMainView.add(rightView);
				}
				
			}
		}else{
			if (zoneList[i].substring(1,2) == "L"){
				var leftView = Ti.UI.createView({
					name : zoneList[i],
					width : "90%",
					height : "70",
					right : "5%",
					top : "5%",
					//backgroundColor : "#80C6168D",
					borderRadius : 10,
					borderColor : "white",
					borderRadius : 10,
					borderWidth : 2
				});
				
				var leftBgView = Ti.UI.createView({
						width : "100%",
						height : "100%",
					});
					
				leftBgView.backgroundColor = "#80C6168D";
				leftView.add(leftBgView);
				
				var leftLabel = $.UI.create("Label", {
					classes : ['fontBold20','colorWhite'],
					name : zoneList[i],
					width : "100%",
					height : "100%",
					textAlign : "center",
					backgroundColor : "transparent",
					text : zoneList[i]
				});
				
				leftLabel.addEventListener('click', function(e){
					// Ti.API.info('Check click : '+e.source.name);
					openViewSafetyEquipmentLocation(e);
					
				});
				
				leftMainView.backgroundColor = "transparent";
				leftView.add(leftLabel);
				leftMainView.add(leftView);
			}else if (zoneList[i].substring(1,2) == "R"){
				var rightView = Ti.UI.createView({
					name : zoneList[i],
					width : "90%",
					height : "70",
					left : "5%",
					top : "5%",
					borderColor : "white",
					borderRadius : 10,
					borderWidth : 2
				});
				
				
				var rightBgView = Ti.UI.createView({
						width : "100%",
						height : "100%",
				});
					
				rightBgView.backgroundColor = "#80C6168D";
				rightView.add(rightBgView);
				
				var rightLabel = $.UI.create("Label", {
					classes : ['fontBold20','colorWhite'],
					name : zoneList[i],
					width : "100%",
					height : "100%",
					textAlign : "center",
					backgroundColor : "transparent",
					text : zoneList[i]
				});
				
				rightLabel.addEventListener('click', function(e){
					// Ti.API.info('Check click : '+e.source.name);
					openViewSafetyEquipmentLocation(e);
				});
				
				rightMainView.backgroundColor = "transparent";
				
				rightView.add(rightLabel);
				rightMainView.add(rightView);
			}
		}
	}
	
	leftRightView.add(leftMainView);
	leftRightView.add(rightMainView);
	mainView.add(leftRightView);
	$.safetyList.add(mainView);
}

setTimeout(function(){
		try{
			setButton();
			if(OS_IOS){
				Alloy.Globals.activityIndicator.hide();	
			}
		}catch (e) {
			Ti.API.info(e);
		if(OS_IOS){
			Alloy.Globals.activityIndicator.hide();	
			}
		}
},300);


if(OS_ANDROID){
	$.safetyWindow.addEventListener('focus', function() {
		if(OS_ANDROID)
    	{
    		$.anActIndicatorView.hide();
    	}
 	});
 	
	$.safetyWindow.addEventListener('android:back', function(e) {
	    Ti.API.info("Press Back button");
		$.safetyList = null;
		$.safetyWindow.close();
	    
	});
}
