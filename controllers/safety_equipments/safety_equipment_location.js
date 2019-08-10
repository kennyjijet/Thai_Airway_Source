// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = arguments[0] || {};
var zone = args.zone;
var query = require('query_lib');
var utility_lib = require('utility_lib');
var extraFontSize = 0;
if(OS_ANDROID)
{
	extraFontSize = 3;
	
	$.anActIndicatorView.hide();
}

if(OS_IOS)
{
	$.anActIndicatorView.hide();
}
function initialData(){
	var locations = query.getEquipmentLocationByZone(zone,currentFlightId);
	var allData = [];
	for (var i=0;i<locations.length;i++){
		
		var sectionRow = Ti.UI.createTableViewRow({
			height : 50,
			backgroundImage : "/images/bg_header_section.png",
			touchEnabled : false,
			selectionStyle : "none",
			scrollable : false
		});
		
		var sectionLabel = $.UI.create("Label", {
			classes : ['colorWhite'],
			color : "white",
			left : 20,
			text : locations[i],
			font : {
				fontSize : utility_lib.dpiConverter(20 + extraFontSize),
				fontWeight : "bold"
			}
		});
			
		sectionRow.add(sectionLabel);
		allData.push(sectionRow);
		
		var safetyList = query.getEquipmentNameByZoneAndLocation(zone,locations[i],currentFlightId);
		for (var j=0;j<safetyList.length;j++){
			var itemRow = Ti.UI.createTableViewRow({
				name : safetyList[j].name,
				desc : safetyList[j].desc,
				crewCheck : safetyList[j].crewCheck,
				total : safetyList[j].total,
				quantity : safetyList[j].quantity,
				sfdcId : safetyList[j].sfdcId,
				locationSE : locations[i],
				height : 50,
				hasChild : true,
				scrollable : false
			});
			
			var itemLabel = Ti.UI.createLabel({
				color : "white",
				left : 20,
				text : safetyList[j].name,
				font : {
					fontSize : utility_lib.dpiConverter(18 + extraFontSize),
				}
			});
			
			var qtyLabel = Ti.UI.createLabel({
				color : "#FFCB05",
				right : 20,
				text : "("+safetyList[j].quantity+")",
				font : {
					fontSize : utility_lib.dpiConverter(18 + extraFontSize),
				}
			});
		
			
			itemRow.addEventListener('click', function(e){
				var sedView = Alloy.createController("safety_equipments/safety_equipment_details", {
					name : e.row.name,
					desc : e.row.desc,
					crewCheck : e.row.crewCheck,
					total : e.row.total,
					quantity : e.row.quantity,
					equipmentId : e.row.sfdcId,
					zoneSE : zone,
					locationSE : e.row.locationSE
				}).getView();
				if(OS_ANDROID)
				{
					$.anActIndicatorView.show();
				}
				
				if(OS_IOS)
				{
					Alloy.Globals.activityIndicator.show();	
					Alloy.Globals.navGroupWin.openWindow(sedView);
				}else{
					sedView.open();
				}
			});
			
			itemRow.add(itemLabel);
			itemRow.add(qtyLabel);
			allData.push(itemRow);
		}
	}

	$.tableView.setData(allData);
	
}

setTimeout(function(){
	$.safetyLocalWindow.title = zone;
	initialData();
	if(OS_IOS)
	{
		Alloy.Globals.activityIndicator.hide();	
	}
},300);

if(OS_ANDROID){
	
	$.safetyLocalWindow.addEventListener('focus', function() {
		if(OS_ANDROID)
    	{
    		$.anActIndicatorView.hide();
    	}
 	});
	
	$.safetyLocalWindow.addEventListener('android:back', function(e) {
	    Ti.API.info("Press Back button");
		allData = null;
		$.tableView = null;
		$.safetyLocalWindow.close();
	    
	});
}

