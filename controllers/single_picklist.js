//**********************************************
//* Variable Declaration
//**********************************************
var query = require('query_lib');
var args = arguments[0] || {};
var functionReturn = args[0];
var arrayList = args[1];
$.singleSelectPicklistWindow.title = args[2];
var tempData;
var searchStatus = false;
var utility_lib = require('utility_lib');
//**********************************************
//* Function
//**********************************************
if(OS_ANDROID)
{
	var softInput = Titanium.UI.Android.SOFT_INPUT_STATE_ALWAYS_HIDDEN | Ti.UI.Android.SOFT_INPUT_ADJUST_PAN;
	$.singleSelectPicklistWindow.windowSoftInputMode = softInput;
		
	$.searchSecView.height = utility_lib.dpiConverter(70);
}

function setTable(dataArg) {
	var dataTable = [];
	$.tableView.removeAllChildren();

	for (var i = 0; i < dataArg.length; i++) {
		var row = Ti.UI.createTableViewRow({
			title : dataArg[i],
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
		functionReturn(arrayList[e.index]);
	}
	$.singleSelectPicklistWindow.close();
});

$.custom_searchbar.clearTextBtn.addEventListener('click', function() {
    tempData = [];
    $.custom_searchbar.customSearchBar.value = "";
    setTable(arrayList);
    searchStatus = false;
    $.custom_searchbar.clearTextBtn.hide();
    $.custom_searchbar.customSearchBar.hintText = "Search by name...";
});

$.custom_searchbar.customSearchBar.addEventListener('touchstart', function(e) {
        $.custom_searchbar.customSearchBar.hintText = "";
    if ($.custom_searchbar.customSearchBar.value == "") {
        tempData = [];
        setTable(arrayList);
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
		setTable(arrayList);
		searchStatus = false;
		$.custom_searchbar.clearTextBtn.hide();
        $.custom_searchbar.customSearchBar.hintText = "Search by name...";
	} else {
		searchStatus = true;
		searchData($.custom_searchbar.customSearchBar.value.trim().toLowerCase());
		$.custom_searchbar.clearTextBtn.show();
	}
});

function searchData(text) {
	tempData = [];
	for (var i = 0; i < arrayList.length; i++) {
		if (arrayList[i].trim().toLowerCase().indexOf(text) > -1) {
			tempData.push(arrayList[i]);
		}

	}
	setTable(tempData);
}

function init() {
	$.singleSelectPicklistWindow.backgroundImage = bgGeneral;
	$.tableView.separatorColor = colorSeparatorTableRow;
	$.custom_searchbar.clearTextBtn.hide();
    $.custom_searchbar.customSearchBar.hintText = "Search by name ...";
    setTable(arrayList);
}



//**********************************************
//* Main
//**********************************************
init();

if(OS_ANDROID){
	$.singleSelectPicklistWindow.addEventListener('android:back', function(e) {
	    Ti.API.info("Press Back button");
	    $.tableView.removeAllChildren();
	    $.tableView = null;
		$.singleSelectPicklistWindow.close();
		$.singleSelectPicklistWindow = null;
	});
	var softInput = Titanium.UI.Android.SOFT_INPUT_STATE_ALWAYS_HIDDEN | Ti.UI.Android.SOFT_INPUT_ADJUST_PAN;
	$.singleSelectPicklistWindow.windowSoftInputMode = softInput;
}