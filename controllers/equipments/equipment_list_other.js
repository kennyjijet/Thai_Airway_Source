// exam
// $.navGroupWin.openWindow(Alloy.createController("equipment_list", [callBackFunction,aircraftRegi,equipmentType]).getView());
// Alloy.Globals.navGroupWin = $.navGroupWin;
// exam Data Return
// [INFO] :   {
// [INFO] :       ataChapter = ataChapter1;
// [INFO] :       equipmentPart =     {
// [INFO] :           id = 1;
// [INFO] :           name = part1;
// [INFO] :       };
// [INFO] :       id = 1;
// [INFO] :       name = equipment1;
// [INFO] :   }
//**********************************************
//* Variable Declaration
//**********************************************
var args = arguments[0] || {};
var query = require('query_lib');
var functionReturn = args[0];
var equipments = args[1];
var equipmentListWindow = args[2];
var tempData;
var searchStatus = false;
var isPostedLayout = false;

//**********************************************
//* Function
//**********************************************


function setTable(equipmentData) {
    var dataTable = [];
    $.tableView.removeAllChildren();

    for (var i = 0; i < equipmentData.length; i++) {
        var row = Ti.UI.createTableViewRow({
            height : "75",
            hasChild : false,//equipmentData[i].havePart
        });

        var view2 = Ti.UI.createView({
            className : "row",
            height : "100%",
            width : "95%",
            left : "5%",
            layout : "vertical",
        });
        var row1 = Ti.UI.createView({
            className : "row",
            height : "50%",
            width : "100%",
        });

        var label1 = Ti.UI.createLabel({
            text : equipmentData[i].name,
            left : "0",
            bottom : "2",
            color : "white",
            font : {
                fontSize : '20',
                fontWeight : 'bold'
            },
        });
        row1.add(label1);

        var row2 = Ti.UI.createView({
            className : "row",
            height : "50%",
            width : "100%",
        });

        label1 = Ti.UI.createLabel({
            text : equipmentData[i].zone + (equipmentData[i].location != "" ? (" - " + equipmentData[i].location) : ""),
            left : "0",
            top : "2",
            color : "white",
            font : {
                fontSize : '18',
            },
        });
        row2.add(label1);
        view2.add(row1);
        view2.add(row2);

        row.add(view2);

        dataTable.push(row);
    }

    $.tableView.setData(dataTable);
}



function setTable1(equipmentData) {
    var dataTable = [];

    for (var i = 0; i < equipmentData.length; i++) {        
        var row = Ti.UI.createTableViewRow({
            height : "75",
            title :  equipmentData[i].name,
            color : "white",
            hasChild : false,
            font : {
                fontSize : '20',
                fontWeight : 'bold'
            },            
        });
        dataTable.push(row);
     }
    $.tableView.setData(dataTable);
}

$.tableView.addEventListener('click', function(e) {
    equipmentRefresh = 1;
    if (searchStatus) {
       
            var equip = {
                id : tempData[e.index].id,
                name : tempData[e.index].name,
                ataChapter : tempData[e.index].ataChapter,
                zone : tempData[e.index].zone,
                location : tempData[e.index].location,
                part : {
                    id : "",
                    name : ""
                }

            };
            functionReturn(equip);
            equipmentListWindow.close();
            $.equipmentListOtherWindow.close();
            
        
    } else {
        
            var equip = {
                id : equipments[e.index].id,
                name : equipments[e.index].name,
                ataChapter : equipments[e.index].ataChapter,
                zone : equipments[e.index].zone,
                location : equipments[e.index].location,
                part : {
                    id : "",
                    name : ""
                }

            };
            functionReturn(equip);
             equipmentListWindow.close();
            $.equipmentListOtherWindow.close();
           
        
    }
});

$.custom_searchbar.clearTextBtn.addEventListener('click', function() {
    tempData = [];
    $.custom_searchbar.customSearchBar.value = "";
    setTable(equipments);
    searchStatus = false;
    $.custom_searchbar.clearTextBtn.hide();
    $.custom_searchbar.customSearchBar.hintText = "Search by Equipmment namce...";
});

$.custom_searchbar.customSearchBar.addEventListener('touchstart', function(e) {
        $.custom_searchbar.customSearchBar.hintText = "";
    if ($.custom_searchbar.customSearchBar.value == "") {
        tempData = [];
        setTable(equipments);
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
        setTable(equipments);
        searchStatus = false;
        $.custom_searchbar.clearTextBtn.hide();
        $.custom_searchbar.customSearchBar.hintText = "Search by Equipmment name...";
    } else {
        searchStatus = true;
        searchData($.custom_searchbar.customSearchBar.value.trim().toLowerCase());
        $.custom_searchbar.clearTextBtn.show();
    }
});

function searchData(text) {
    tempData = [];

    for (var i = 0; i < equipments.length; i++) {
        if (equipments[i].name.trim().toLowerCase().indexOf(text) > -1) {
            tempData.push(equipments[i]);
        }

    }
    setTable(tempData);
}

function resetSearchTextBar() {

    $.custom_searchbar.customSearchBar.value = '';
    $.custom_searchbar.customSearchBar.blur();

}

function init() {
    $.custom_searchbar.clearTextBtn.hide();
    $.custom_searchbar.customSearchBar.hintText = "Search by Equipment Name...";
    $.equipmentListOtherWindow.backgroundImage = bgGeneral;
    $.tableView.separatorColor = colorSeparatorTableRow;
}

//**********************************************
//* Main
//**********************************************
init();
setTable(equipments);

$.equipmentListOtherWindow.addEventListener('postlayout', function() {
	if(!isPostedLayout) {
		isPostedLayout = true;
	    if(OS_IOS) {
	        Alloy.Globals.activityIndicator.hide();
	    }
   }
});

if(OS_ANDROID){
	$.equipmentListOtherWindow.addEventListener('android:back', function(e) {
	    Ti.API.info("Press Back button");
		$.equipmentListOtherWindow.close();
	});

	var softInput = Titanium.UI.Android.SOFT_INPUT_STATE_ALWAYS_HIDDEN | Ti.UI.Android.SOFT_INPUT_ADJUST_PAN;
	$.equipmentListOtherWindow.windowSoftInputMode = softInput;

}
