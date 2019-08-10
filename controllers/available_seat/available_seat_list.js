var args = arguments[0] || {};
var query_lib = require('query_lib');
var utility_lib = require('utility_lib');
var lopa_lib = require('lopa_lib');
//**********************************************
//* Variable Declaration
//**********************************************

var flightInformation;
var lopa;
var zoneLOPA;

var lopaList = '';
var lopaListAll = '';

var availableLopaList = [];
var allLopaList = [];
var currentLopaList = [];

var currentIndex = 0;
var targetIndex = 20;
//Cut Array;
// to keep track of content size on iOS
var initialTableSize = 0;
var currentSize = 0;
var isLoading = false;
var totalLoaded = 0;
var overlap = 50;
var listId;

var stackSelected = [];
var tempStackSelected = [];
var groupSelected = 'all';
var defaultColor = '#00000000';
var selectedColor = colorSelectedBtnHighlight;
var openOptionalDialogue = false;
var clickedOnSearch = false;
var user;
var extraFontSize = 3;
//**********************************************
//* Function
//**********************************************

if(OS_ANDROID)
{
	$.selectionHeaderView.top = "8";
	$.selectionHeaderView.height = "80";
	$.searchSec.height = utility_lib.dpiConverter(70);
	
	$.btnSelectZone.width = utility_lib.dpiConverter(75);
	$.btnSelectZone.height = utility_lib.dpiConverter(75);
	
	
	$.anActIndicatorView.hide();
	
	var softInput = Titanium.UI.Android.SOFT_INPUT_STATE_ALWAYS_HIDDEN | Ti.UI.Android.SOFT_INPUT_ADJUST_PAN;
	$.availWindow.windowSoftInputMode = softInput;
	
	$.imageFlightLopa.left = "5";
	$.imageFloorLopa.left = "10";
	
	$.imageFlightLopa.width = "35";
	$.imageFloorLopa.width = "35";
	$.leftHeaderView.width = "50%";
	
	$.leftTextLine.top = 0;
	$.leftTextLine.left = "5";
	$.leftTextLine.width = "220";
	
	$.aircraft_type.left = "3";
	$.aircraft_type.font = {
		fontSize : Alloy.Globals.d_17pt,
		fontWeight : "bold"
	};
	
	$.aircraftRegistration.left = "3";
	$.aircraftRegistration.font = {
		fontSize : Alloy.Globals.d_17pt,
		fontWeight : "bold"
	};
	
	$.userTitle.left = "3";
	$.userTitle.font = {
		fontSize : Alloy.Globals.d_14pt,
		fontWeight : "bold"
	};
	
	$.showDialogue.font = {
		fontSize : Alloy.Globals.d_17pt,
		fontWeight : "bold"
	};
	
	
	$.total.font = {
		fontSize : Alloy.Globals.d_17pt,
		fontWeight : "bold"
	};
	
	$.currentPax.font = {
		fontSize : Alloy.Globals.d_17pt,
		fontWeight : "bold"
	};
	
	$.totalPA.font = {
		fontSize : Alloy.Globals.d_17pt,
		fontWeight : "bold"
	};
	
}

if(OS_IOS)
{
	$.anActIndicatorView.hide();
}


function setVariable() {
	try{
		var userId = query_lib.getUserId();
		Ti.API.info('currentFlightId ' + currentFlightId);
		user = query_lib.getUserDetailsFromCrew(userId.id+"_"+currentFlightId);
		flightInformation = query_lib.getFlight(currentFlightId);
		$.aircraft_type.text = flightInformation.flightNumber + ' ' + flightInformation.airModel;
		$.aircraftRegistration.text = flightInformation.aircraftRegistration;
		lopa = query_lib.getLOPA(flightInformation.id);
		if (lopa.length <= 0 ){
			if(OS_IOS){
				Alloy.Globals.activityIndicator.hide();	
			}
			
			return;
		}else{
			lopa.sort(lopa_lib.sortFnByfloor);
			zoneLOPA = lopa[0];
			Alloy.Globals.lopaId = zoneLOPA.id;
		}
		Ti.API.info('getPassengerListLopa ');
		Ti.API.info('Alloy.Globals.lopaId ' + Alloy.Globals.lopaId);
		lopaList = query_lib.getPassengerListLopa(Alloy.Globals.lopaId);
	}catch (e) {
		Ti.API.info(e);
		
		if(OS_IOS){
			Alloy.Globals.activityIndicator.hide();	
		}
	}
}

function changeClearFloorZone() {
	clearValue();
}

function initializeLOPATable() {

	availableLopaList = [];

	for (var i = 0; i < lopaList.length; i++) {
		if ((utility_lib.isEmpty(lopaList[i].name))) {
			availableLopaList.push(lopaList[i]);
		}
	}
	
	$.currentPax.text = availableLopaList.length;
	currentLopaList = availableLopaList;
	lopaListAll = availableLopaList;
	$.lopaItem.setData(drawTable(currentLopaList));

	
}

$.custom_searchbar.clearTextBtn.addEventListener('click', function() {
		resetSearchTextBar();
		$.lopaItem.setData(drawTable(currentLopaList));
		$.custom_searchbar.clearTextBtn.hide();
		
		isSearching = false;
		$.custom_searchbar.customSearchBar.hintText = 'Search by Seat...';
		if(OS_ANDROID)
		{
			$.custom_searchbar.customSearchBar.setTouchEnabled = true;
			clickedOnSearch = false;
		}
});

$.custom_searchbar.customSearchBar.addEventListener('click', function(e)
{
	$.custom_searchbar.customSearchBar.hintText = "";
	$.custom_searchbar.clearTextBtn.show();
	if(OS_ANDROID){
		clickedOnSearch = true;
		$.custom_searchbar.customSearchBar.setTouchEnabled = false;	
	}
	
});

function searchingLOPATable(searchText) {

	var searchedList = [];
	var searchRender = [];
	var criteria = '';

	//// Search by lopaListAll.
	for (var index = 0; index < lopaListAll.length; index++) {
		var status = false;
		criteria = lopaListAll[index].name + ',' + lopaListAll[index].rop + ',' + lopaListAll[index].bookingClass + ',' + lopaListAll[index].bookingSeat;
		var replacedCriteria = criteria.replace("null", "");
		if (replacedCriteria.toLowerCase().indexOf(searchText) > -1 || replacedCriteria.toUpperCase().indexOf(searchText) > -1) {
			status = true;
		}
		if (status) {
			searchedList.push(lopaListAll[index]);
		}
	}
	searchRender = drawTable(searchedList);
	return searchRender;
}

function drawTable(paraLopaList) {

	var tableData = [];
	for (var i = 0; i < paraLopaList.length; i++) {
		
		var classText = '';
		//var isPax = false;
		if (paraLopaList[i].bookingClass != null) {
			classText = "Class" + " " + paraLopaList[i].bookingClass;
		}
		var pax = paraLopaList[i].bookingSeat + " " + "Class " + paraLopaList[i].bookingClass;
		var pos = paraLopaList[i].floor + " - " + "Zone" + paraLopaList[i].zone;

		var buttonIconPath = '/images/btn_button_off.png';
		var ropImagePath = '/images/ic_seat.png';

		//var imageClass = 'viewPaxImage';
		var ropImage;		
		ropImage = $.UI.create("ImageView", {
			classes : ['viewPaxImageNoRop'],
			image : ropImagePath,
			left : 50,
			top : 18
		});
		
		if(OS_ANDROID)
		{
			ropImage.width = utility_lib.dpiConverter(50);
			ropImage.height = utility_lib.dpiConverter(50);
		}
			
		

		//ropImage.image = ropImagePath;

		var paxName;
		var zone;
		
		
		if(OS_IOS)
		{
			paxName = $.UI.create("Label", {
				classes : ['fontBold20'],
				text : pax,
				color : 'white',
				type : 'label',
				left : 50,
				top : 20,
			});

			zone = $.UI.create("Label", {
				classes : ['fontLight16'],
				text : pos,
				color : 'white',
				type : 'label',
				left : 50
			});
		}
		
		
		
		if(OS_ANDROID)
		{
			paxName = $.UI.create("Label", {
				classes : ['fontBold20'],
				text : pax,
				color : 'white',
				type : 'label',
				left : 50,
				minimumFontSize : 7,
				top : 20,
			});
			
			paxName.minimumFontSize = utility_lib.dpiConverter(7);
			paxName.top = utility_lib.dpiConverter(15);
			zone = $.UI.create("Label", {
				classes : ['fontLight16'],
				text : pos,
				color : 'white',
				type : 'label',
				left : 50
			});
			zone.top = utility_lib.dpiConverter(20);	
		}
		
		
		var typeConverted = lopa_lib.typeConvertFunction(paraLopaList[i].type);
		
		var row = $.UI.create("TableViewRow", {
			id : paraLopaList[i].id,
			typeC : typeConverted,
			bool_checked : false,
			className : 'row',
			hasChild : true,
			backgroundSelectedColor : '#dcdcdc',
			height : '80',
			type : 'tableRow'

		});
		
		var viewText = Ti.UI.createView({
			width : "80%",
			layout : "vertical"
		});
		
		var viewInrow = Ti.UI.createView({
			width : "100%",
			layout : "horizontal"
		});

		row.backgroundSelectedColor = colorSeparatorTableRow;
		viewText.add(paxName);
		viewText.add(zone);
		viewInrow.add(ropImage);
		viewInrow.add(viewText);
		row.add(viewInrow);

		row.addEventListener('click', function(e) {
			//TI.API.info(e.source.type);
			var rowObj = e.row;
			if (rowObj.type == "check" || rowObj.type == "view") {
				return;
			}

			if (e.row.type != "tableRow") {
				rowObj = e.row.parent;
			} else {
				rowObj = e.row;
			}

			//Ti.API.info('rowObj.type ' + rowObj.type);
			var detailView;
			var isPaxOnSeat = query_lib.issetPaxLopa(rowObj.id);

			
			if (isPaxOnSeat) {
				detailView = Alloy.createController("passengers/passenger_detail", {"LOPAPositionId" : rowObj.id}).getView();
			} else {
				detailView = Alloy.createController("equipments/seat_detail", {
					LOPAPositionId : rowObj.id,
					LOPAPositionType : rowObj.typeC
					}
		
				).getView();
			}

			if (OS_IOS) {
				Alloy.Globals.navGroupWin.openWindow(detailView);

			} else {
				detailView.open();
			}
			clearValue();
		});
		//tableData.push(row);
		tableData.push(row);
		// if (OS_IOS) {
		// currentSize += row.toImage().height;
		// }
	}
	paraLopaList = null;
	return tableData;
}


function searching() {

	
	$.custom_searchbar.customSearchBar.addEventListener("change", function(e) {
			if(OS_ANDROID){
				if(!clickedOnSearch)
				{
					return;
				}
			}
			
		$.lopaItem.setData(searchingLOPATable(e.value.trim().toLowerCase()));
		$.custom_searchbar.clearTextBtn.show();
		$.custom_searchbar.customSearchBar.hintText = "";
		if (e.value.length == 0) {
			isSearching = false;
		} else if (e.value.length >= 1) {
			isSearching = true;
		}
	});
}

function resetSearchTextBar() {
	$.custom_searchbar.customSearchBar.value = '';
	$.custom_searchbar.customSearchBar.blur();
	$.custom_searchbar.clearTextBtn.hide();
}

function cleanUp() {

	args = null;
	listId = null;
	searchText = null;
	tableData = null;
	lopaList = null;
	//isSingleSelection = null;
	stackSelected = null;
	tempStackSelected = null;
}

function clearValue() {
	stackSelected = [];
	tempStackSelected = [];
}

function createIncidentFunction() {
	//TI.API.info(stackSelected);
	if (stackSelected.length > 0) {
		clearValue();
		groupSelected = 'all';
		//alert(stackSelected);
		var incidentDetail = Alloy.createController("incidents/incident_detail", {
			"incidentCate" : AC_MAINTENANCE,
			"isNew" : true,
			"reportType" : "",
			"lopaId" : stackSelected
		}).getView();
		if (OS_IOS) {
			Alloy.Globals.navGroupWin.openWindow(incidentDetail);
		} else {
			incidentDetail.open();
		}
	}
}

function cancelFunction() {
	clearValue();
}

function lazyload(_evt) {
	//////TI.API.info('scrolling action');
	resetSearchTextBar();
}

function createLabel(btnName) {
	var label = Ti.UI.createLabel({
		text : btnName,
		color : "#007AFF",
		font : {
			fontSize : '20sp',
			fontWeight : 'bold'
		},
		width : Ti.UI.SIZE,
		height : Ti.UI.SIZE,
		top : '35'

	});
	return label;
}

function actionEvent(e, window) {
	
	var btnId_temp;
	if (e.source.idType == "cancel") {
		window.close();
		return;
	}

	if (e.source.idType == undefined) {
		btnId_temp = e.source.parent.idType;
	} else {
		btnId_temp = e.source.idType;
	}

	//var floorStr = lopa_lib.convertToDeck(zoneLOPA.floor);
	if (Alloy.Globals.lopaId == btnId_temp) {
		//renderTitleView(floorStr + '-' + 'Zone' + zoneLOPA.zone, zoneLOPA.cclass);
		renderTitleView(zoneLOPA.floor + ' - ' + 'Zone' + zoneLOPA.zone, zoneLOPA.cclass);

		return;
	}

	Alloy.Globals.lopaId = btnId_temp;

	if(OS_IOS){
		Alloy.Globals.activityIndicator.show();	
	}
	
	if(OS_ANDROID)
	{
		//Alloy.Globals.anActIndicatorView.show();
		$.anActIndicatorView.show();
	}

	setTimeout(function() {
		lopaList = query_lib.getPassengerListLopa(Alloy.Globals.lopaId);
		zoneLOPA = query_lib.getOneLOPA(Alloy.Globals.lopaId);
		renderTitleView(zoneLOPA.floor + ' - ' + 'Zone' + zoneLOPA.zone, zoneLOPA.cclass);
		//renderTitleView(floorStr + '-' + 'Zone' + zoneLOPA.zone, zoneLOPA.cclass);

		initializeLOPATable();
		changeClearFloorZone();

		if(OS_IOS){
			Alloy.Globals.activityIndicator.hide();	
		}
		
		if(OS_ANDROID)
		{
			$.anActIndicatorView.hide();
		}
		
	}, 50);

	resetSearchTextBar();
	stackSelected = [];
	tempStackSelected = [];
	clearValue();
	window.close();
}

function renderTitleView(titleStr) {
	//$.titleLabel.text = "";
	$.showDialogue.title = "";
	setTimeout(function() {
		//$.titleLabel.text = titleStr;
		$.showDialogue.setText(titleStr);
	}, 100);
}

//**********************************************
//* Main
//**********************************************

setVariable();

$.availWindow.backgroundImage = bgGeneral;
$.availWindow.touchEnabled = false;
$.custom_searchbar.customSearchBar.hintText= 'Search by Seat...';
$.custom_searchbar.clearTextBtn.hide();

try {
		var titleStr = lopa[0].floor + ' - ' + 'Zone' + lopa[0].zone;
		$.showDialogue.setText(titleStr);
		
		$.lopaItem.applyProperties({
			separatorColor : colorSeparatorTableRow
		});
		
		searching();
		initializeLOPATable();
	
		//checkButtonOnOff();
		//$.lopaItem.addEventListener("scroll", lazyload);
	
		//Alloy.Globals.activityIndicator.hide();
		if (user.firstName != ""){
			var lastName = user.lastName.substring(0,1)+".";
			var idUserCrew = user.id.split("_");
			$.userTitle.setText(user.rank+" "+user.firstName+" "+lastName+" ("+idUserCrew[0]+")");
			
		}else {
			$.userTitle.setText("");
		}
	
		setTimeout(function() {
			if(OS_IOS){
				Alloy.Globals.activityIndicator.hide();	
			}
			$.availWindow.touchEnabled = true;
		}, 500);
	}catch(e) {
		if(OS_IOS){
				Alloy.Globals.activityIndicator.hide();	
			}
	}




$.lopaItem.addEventListener('postlayout', function() {
	if(OS_IOS){
		setTimeout(function() {	
			$.availWindow.touchEnabled = true;
		},300);	
	}
});

//Deconstructor
$.cleanUp = function() {
	listId = null;
	searchText = null;
	tableData = null;
	lopaList = null;
	//isSingleSelection = null;
	stackSelected = null;
	tempStackSelected = null;
	groupSelected = null;
};


function closeOptionalDialogue ()
{
	openOptionalDialogue = false; 
}

$.btnSelectZone.addEventListener("click", function() {
	if(OS_ANDROID){
        if(!openOptionalDialogue){
        	openOptionalDialogue = true;
        }
        else{
        	return;
        }
    }
	var lopaTemp = lopa;
	
	if(OS_ANDROID)
	{
		$.btnSelectZone.backgroundColor = '#80d3d3d3';
	}
	
	if(OS_IOS){
		Alloy.Globals.activityIndicator.show();	
	}
	setTimeout(function() {
		lopa_lib.showDialogueFunction(lopaTemp, actionEvent, closeOptionalDialogue);
		if(OS_IOS){
				Alloy.Globals.activityIndicator.hide();	
		}
		
		if(OS_ANDROID)
		{
			$.btnSelectZone.backgroundColor = '#00d3d3d3';
			
		}
	}, 5);

});


if(OS_ANDROID){
	$.availWindow.addEventListener('android:back', function(e) {
	    Ti.API.info("Press Back button");
		availableLopaList = null;
		allLopaList = null;
		lopaListAll = null;
		lopaList = null;
		currentLopaList = null;
		$.lopaItem = null;
		stackSelected = null;
		tempStackSelected = null;
		lopa = null;
		$.availWindow.close();
	    
	});
}