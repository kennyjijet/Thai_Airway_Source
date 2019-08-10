//**********************************************
//* Variable Declaration
//**********************************************
var query = require('query_lib');
var args = arguments[0] || {};
var functionReturn = args[0];
var equipment = args[1];
var equipmentWindow=args[2];
var part;
var tempData;
var searchStatus = false;
var keyboardTimeout;
var isPostedLayout = false;

//**********************************************
//* Function
//**********************************************
function getDataEquipmentPart() {
    part = query.getEquipmentPartByEquipmentId(equipment.id);
	setTable(part);
}
function setTable(equipmentData) {
	var dataTable = [];
	$.tableView.removeAllChildren();

	for (var i = 0; i < equipmentData.length; i++) {
		var row = Ti.UI.createTableViewRow({
			title : equipmentData[i].name,
			height : "75",
			color : "white",
			hasChild : false,
			font : {
				fontSize : "20",
				fontFamily : 'Lucida Grande-Bold',
				fontWeight : 'bold'
			}
		});
		dataTable.push(row);
	}

	$.tableView.setData(dataTable);
}

$.tableView.addEventListener('click', function(e) {
	if (searchStatus) {
		equipment.equipmentPart=tempData[e.index];
		
	} else {
		equipment.part=part[e.index];
	}
	functionReturn(equipment);
	equipmentWindow.close();
	$.partListWindow.close();
});

$.custom_searchbar.clearTextBtn.addEventListener('click', function() {
    tempData = [];
    $.custom_searchbar.customSearchBar.value = "";
    searchStatus = false;
    $.custom_searchbar.clearTextBtn.hide();
    $.custom_searchbar.customSearchBar.hintText = "Search by Part namce...";
    if(OS_IOS) {
        Alloy.Globals.activityIndicator.show();
    }
    setTimeout(function() {
    setTable(part);
	    if(OS_IOS) {
	        Alloy.Globals.activityIndicator.hide();
	    }
    }, 20);
});

$.custom_searchbar.customSearchBar.addEventListener('touchstart', function(e) {
    if ($.custom_searchbar.customSearchBar.value == "") {
        tempData = [];
        searchStatus = false;
        $.custom_searchbar.customSearchBar.hintText = "Search by Part namce...";
        $.custom_searchbar.clearTextBtn.hide();
//        setTable(part);
    } else {
        $.custom_searchbar.clearTextBtn.show();
        searchData($.custom_searchbar.customSearchBar.value.trim().toLowerCase());
    }

});

$.custom_searchbar.customSearchBar.addEventListener('change', function(e) {
    if(keyboardTimeout) {
        clearTimeout(keyboardTimeout);
        keyboardTimeout = null;
    }
    keyboardTimeout = setTimeout(function(){
        if ($.custom_searchbar.customSearchBar.value.trim() == "") {
            tempData = [];
            searchStatus = false;
            $.custom_searchbar.clearTextBtn.hide();
            $.custom_searchbar.customSearchBar.hintText = "Search by Part name...";
            setTable(part);
        } else {
            $.custom_searchbar.clearTextBtn.show();
            searchData($.custom_searchbar.customSearchBar.value.trim().toLowerCase());
        }
    }, 1000);        
});

function searchData(text) {
	tempData = [];
	for (var i = 0; i < part.length; i++) {
		if (part[i].name.trim().toLowerCase().indexOf(text) > -1) {
			tempData.push(part[i]);
		}

	}
	setTable(tempData);
}

function init() {
	$.partListWindow.backgroundImage = bgGeneral;
	$.tableView.separatorColor = colorSeparatorTableRow;
	$.custom_searchbar.clearTextBtn.hide();
    $.custom_searchbar.customSearchBar.hintText = "Search by Part name...";

}

//**********************************************
//* Main
//**********************************************
init();
getDataEquipmentPart();


if(OS_ANDROID){
	$.partListWindow.addEventListener('android:back', function(e) {
	    Ti.API.info("Press Back button");
		$.partListWindow.close();
	});
	var softInput = Titanium.UI.Android.SOFT_INPUT_STATE_ALWAYS_HIDDEN | Ti.UI.Android.SOFT_INPUT_ADJUST_PAN;
	$.partListWindow.windowSoftInputMode = softInput;	
}
