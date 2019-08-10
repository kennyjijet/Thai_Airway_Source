var query_lib = require('query_lib');
//var component = require('component_lib');

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
			fontSize : 20,
			fontWeight : 'bold'
		},
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		top : '40'

	});
	return label;
}

function createOptionalLinkApps(linkList) {
	var row = Ti.UI.createTableViewRow({
		className : 'row',
		//idType : btnId,
		//height : "16%",
		height : "130",
		width : "100%",
		touchEnable : true,
		hasChild : 'false',
		layout : "vertical",
		name : linkList.name,
		uniformResourceLocator : linkList.url 
	
	});
	if(OS_ANDROID)
	{
		row.height = "95";
	}
	var labelRow = createLabel(linkList.name);
	row.add(labelRow);
	return row;

};

exports.showDialogueLinkAppsFunction = function(linkList, actionEvent, closeOptionalDialogue) 
{
	var tableDialog = [];
	var win2 = Ti.UI.createWindow({
		fullscreen : false,
		backgroundColor : '#40000000',
	});
	
	if(OS_ANDROID)
	{
		win2.title = 'Apps ';
		win2.theme = 'Theme.NoActionBar';
		
	}


	var view = Ti.UI.createView({
		//top : "40%",
		//bottom : "1%",
		//left : "15%",
		//right : "15%",
		bottom : 10,
		borderRadius : 20,
		backgroundColor : 'white',
		layout : "vertical",
		width : "80%",
		height : "20%"
	});
	
	if(OS_ANDROID)
	{
		view.height = "22%";
	}
	
	// var title = Ti.UI.createLabel({
		// color : '#000',
		// top : 10,
		// text : 'APPs',
		// font : {
			// fontSize : 25,
			// fontWeight : 'bold'
		// }
	// });
	// view.add(title);

	for (var index = 0; index < linkList.length; index++) {
		var row = createOptionalLinkApps(linkList[index]);
		row.addEventListener('click', function(e) 
		{	
			actionEvent(e, win2);
			lopa = null;
			win2.close();
		});
		tableDialog.push(row);
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
			lopa = null;
			closeOptionalDialogue();
			win2.close();
		});
	}
}; 