var query_lib = require('query_lib');
var component = require('component_lib');
var utility_lib = require('utility_lib');

// exports.getIncidentCountPerZone = function(lopaId) {
//
//
// return query_lib.getCountIncidentPerZone(lopaId);
// };

exports.typeConvertFunction = function(type) {
	var typeConverted = '';
	if (type == 'GN' || type == 'GF' || type == 'GR') {
		typeConverted = 'galley';

	} else if (type == 'LA' || type == 'LAF' || type == 'LAR') {
		typeConverted = 'lavatory';
	} else {
		typeConverted = 'seat';
	}
	return typeConverted;
};

// function getIncidentCountPerZone(lopaId) {
// query_lib.getCountIncidentPerZone(lopaId);
//
// }

exports.convertToDeck = function(floor) {
	var floorStr = '';
	if (floor == '1') {
		floorStr = 'Main Deck';
	} else if (floor == '2') {
		floorStr = 'Upper Deck';
	}
	return floorStr;

};

function createIcon(imgPathName) {
	var icon = $.UI.create("ImageView", {
		image : imgPathName,
		left : "10%",
		height : 40,
		width : 40,
		top : 15
	});
	return icon;
}

function createLabel(btnName) {
	var label = Ti.UI.createLabel({
		text : btnName,
		color : "#007AFF",
		font : {
			fontSize : utility_lib.dpiConverter(20),
			fontWeight : 'bold'
		},
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		top : '35'

	});
	return label;
}

function createOptionalBtn(btnId, btnName, classText, sum, beginRow, endRow, maxCol, floor, zone) {

	var btnId_temp = btnId;
	var btnName_temp = btnName;
	var classText_temp = classText;
	var zoneLOPAId = btnId;
	var row = Ti.UI.createTableViewRow({
		
		className : 'row',
		idType : btnId,
		//height : "16%",
		height : utility_lib.dpiConverter(100),
		width : "100%",
		touchEnable : true,
		hasChild : 'false',
		layout : "vertical",
		maxColumn : maxCol,
		zoneLopa : zone, 
		floorLopa : floor
	});

	//row.backgroundSelectedColor = colorSelectedBtnHighlight;
	var incidentStr = 'Incident';

	//var gotincidentCounted = query_lib.getCountIncidentPerZone(zoneLOPAId);

	var gotincidentCounted = sum;
	if (gotincidentCounted > 1) {
		incidentStr = 'Incidents';
	}

	//var labelRow = createLabel(btnName_temp + ' (' + query_lib.getCountIncidentPerZone(zoneLOPAId) + ' ' + incidentStr + ') ');

	var labelRow = createLabel(btnName_temp + ', Rows ' + beginRow + '-' + endRow + ' (' + gotincidentCounted + ' ' + incidentStr + ')  ');

	//var labelRow = createLabel(btnName_temp + ' (' + '0' + ' ' + incidentStr + ') ');

	//labelRow.color = colorSelectedBtnHighlight;
	row.add(labelRow);
	//btnId_temp = null;
	return row;
}


exports.showDialogueFunction = function(lopa, actionEvent, closeOptionalDialogue) {
	var tableDialog = [];
	var win2 = Ti.UI.createWindow({
		fullscreen : false,
		backgroundColor : '#40000000',
	});
	
	if(OS_ANDROID)
	{
		win2.title = 'Selecting Zone';
		win2.theme = 'Theme.NoActionBar';
		
	}
	
	var view = Ti.UI.createView({
		
		bottom : 10,
		borderRadius : 20,
		backgroundColor : 'white',
		layout : "vertical",
		width : "80%",
		height : "60%"
	});

	var title = Ti.UI.createLabel({
		color : '#000',
		top : 10,
		text : 'Select Zone',
		font : {
			fontSize : utility_lib.dpiConverter(20),
			fontWeight : 'bold'
		}
	});
	view.add(title);

	try {
        var flightInformation = query_lib.getFlight(currentFlightId);     
        var aircraftRegistration;   
        if(flightInformation != null) {
            aircraftRegistration = flightInformation.aircraftRegistration;
        }

		var sumList = query_lib.getCountIncidentPerZoneAll(lopa, aircraftRegistration);
		var rowValue = query_lib.getMaxMinRow();
		for (var index = 0; index < lopa.length; index++) 
		{
			lopa[index].floor = lopa[index].floor != null ? lopa[index].floor : "";
			lopa[index].zone = lopa[index].zone != null ? lopa[index].zone : "";
			var titleStr = lopa[index].floor + ', ' + 'Zone ' + lopa[index].zone;
			
			rowValue[index].minRow = rowValue[index].minRow != null ? rowValue[index].minRow : "";
			rowValue[index].maxRow = rowValue[index].maxRow != null ? rowValue[index].maxRow : "";
			lopa[index].cclass = lopa[index].cclass != null ? lopa[index].cclass : "";
			sumList[index] = sumList[index] != null ? sumList[index] : 0;  
			var row = createOptionalBtn(lopa[index].id, titleStr, lopa[index].cclass, sumList[index], rowValue[index].minRow, rowValue[index].maxRow, lopa[index].maxColumn, lopa[index].floor, lopa[index].zone);
			row.addEventListener('click', function(e) {
				actionEvent(e, win2);
				lopa = null;
				win2.close();
			});
			tableDialog.push(row);
		}
	} catch(e) {
		Ti.API.info(e);
		if(OS_IOS) { Alloy.Globals.activityIndicator.hide(); }
	}
	
	var viewRow2 = Ti.UI.createTableView({
		height : "95%",
		//height : Ti.UI.SIZE,
		width : "100%",
		layout : "vertical",
		contentHeight : 'auto',
		data : tableDialog,
		separatorColor : "grey",
		//separatorColor : "#5C27A1"
	});
	//tableData = null;
	view.add(viewRow2);
	win2.add(view);
	win2.open();
	win2.addEventListener("click", function(e) {
		lopa = null;
		closeOptionalDialogue();
		win2.close();
		
	});
	
	if(OS_ANDROID){
		win2.addEventListener('android:back', function(e) {
			closeOptionalDialogue();
			win2.close();
		});
	}
	
};

exports.sortFnByfloor = function(a, b) {
	if (a.floor < b.floor)
		return 1;
	if (a.floor > b.floor)
		return -1;
	if (a.floor == b.floor) {
		if (a.zone < b.zone)
			return -1;
		if (a.zone > b.zone)
			return 1;
	}
};

exports.sortFnByzone = function(a, b) {
	if (a.zone < b.zone)
		return -1;
	if (a.zone > b.zone)
		return 1;
};

exports.sortByClass = function(a, b) {
	/*
	 FirstClass = F
	 Premium Economy = U
	 Economy = Y
	 Business = C
	 */

	if (a.bookingClass == 'F' && b.bookingClass == 'C') {
		return 1;
	} else if (a.bookingClass == 'C' && b.bookingClass == 'F') {
		return -1;
	} else if (a.bookingClass == 'F' && b.bookingClass == 'U') {
		return 1;
	} else if (a.bookingClass == 'U' && b.bookingClass == 'F') {
		return -1;
	} else if (a.bookingClass == 'F' && b.bookingClass == 'Y') {
		return 1;
	} else if (a.bookingClass == 'Y' && b.bookingClass == 'F') {
		return -1;
	} else if (a.bookingClass == 'C' && b.bookingClass == 'U') {
		return 1;
	} else if (a.bookingClass == 'U' && b.bookingClass == 'C') {
		return -1;
	} else if (a.bookingClass == 'C' && b.bookingClass == 'Y') {
		return 1;
	} else if (a.bookingClass == 'Y' && b.bookingClass == 'C') {
		return -1;
	}
};

exports.getCrewUser = function() {

	var userId = query_lib.getUserId();
	user = query_lib.getUserDetailsFromCrew(userId.id + "_" + currentFlightId);
	var lastName = user.lastName.substring(0, 1) + ".";
	if (user.firstName != "") {
		var idUserCrew = user.id.split("_");
		//$.titleName.setText(user.rank+" "+user.firstName+" "+lastName+" ("+idUserCrew[0]+")");
		return user.rank + " " + user.firstName + " " + lastName + " (" + idUserCrew[0] + ")";
	} else {
		//$.titleName.setText("");
		return "";
	}

	return "";
};
