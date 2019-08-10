//**********************************************
//* Variable Declaration
//**********************************************
var query = require('query_lib');
var args = arguments[0] || {};
var functionReturn = args[0];
var zone;
var tempData;
var searchStatus = false;
var isPostedLayout = false;

//**********************************************
//* Function
//**********************************************
function getDataEquipmentZoneList() {
zone = query.getEquipmentZoneList();
	setTable(zone);
}
function setTable(zoneData) {
	var dataTable = [];
	$.tableView.removeAllChildren();

	for (var i = 0; i < zoneData.length; i++) {
		var row = Ti.UI.createTableViewRow({
			title : zoneData[i],
			height : "75",
			color : "white",
			hasChild : false,
			font : {
				fontSize : "20",
				fontWeight : 'bold'
			}
		});
		dataTable.push(row);
	}

	$.tableView.setData(dataTable);
}

$.tableView.addEventListener('click', function(e) {
	if (searchStatus) {
		functionReturn(tempData[e.index]);
		
	} else {
		functionReturn(zone[e.index]);
	}
	$.zoneListWindow.close();
});

$.custom_searchbar.clearTextBtn.addEventListener('click', function() {
    tempData = [];
    $.custom_searchbar.customSearchBar.value = "";
    setTable(zone);
    searchStatus = false;
    $.custom_searchbar.clearTextBtn.hide();
    $.custom_searchbar.customSearchBar.hintText = "Search by zone...";
});

$.custom_searchbar.customSearchBar.addEventListener('touchstart', function(e) {
        $.custom_searchbar.customSearchBar.hintText = "";
    if ($.custom_searchbar.customSearchBar.value == "") {
        tempData = [];
        setTable(zone);
        searchStatus = false;
        $.custom_searchbar.clearTextBtn.hide();
    } else {
        searchStatus = true;
        searchData($.custom_searchbar.customSearchBar.value.trim().toLowerCase());
        $.custom_searchbar.clearTextBtn.show();
    }

});

$.custom_searchbar.customSearchBar.addEventListener('change', function(e) {
	if ($.custom_searchbar.customSearchBar.value.trim() == "") {
		tempData = [];
		setTable(zone);
		searchStatus = false;
		$.custom_searchbar.clearTextBtn.hide();
        $.custom_searchbar.customSearchBar.hintText = "Search by zone...";
	} else {
		searchStatus = true;
		searchData($.custom_searchbar.customSearchBar.value.trim().toLowerCase());
		$.custom_searchbar.clearTextBtn.show();
	}
});

function searchData(text) {
	tempData = [];
	for (var i = 0; i < zone.length; i++) {
		if (zone[i].trim().toLowerCase().indexOf(text) > -1) {
			tempData.push(zone[i]);
		}

	}
	setTable(tempData);
}

function init() {
	$.zoneListWindow.backgroundImage = bgGeneral;
	$.tableView.separatorColor = colorSeparatorTableRow;
	$.custom_searchbar.clearTextBtn.hide();
    $.custom_searchbar.customSearchBar.hintText = "Search by zone ...";

}

//**********************************************
//* Main
//**********************************************
init();
getDataEquipmentZoneList();

if(OS_ANDROID){
	$.zoneListWindow.addEventListener('android:back', function(e) {
	    Ti.API.info("Press Back button");
		$.zoneListWindow.close();
	});
	
	var softInput = Titanium.UI.Android.SOFT_INPUT_STATE_ALWAYS_HIDDEN | Ti.UI.Android.SOFT_INPUT_ADJUST_PAN;
	$.zoneListWindow.windowSoftInputMode = softInput;		
}