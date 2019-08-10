//**********************************************
//* Variable Declaration
//**********************************************
var args = arguments[0] || {};
var query = require('query_lib');

var functionReturn = args[0];
var acRegi = args[1];
var eType = args[2];
var isPostedLayout = false;

function setTable(dataArg, typeArg) {
    var data = dataArg;
    var type = typeArg;

        // var label = Ti.UI.createLabel({
            // text : data,
            // left : "3%",
            // color : "white",
            // font : {
                // fontSize : '20',
                // fontFamily : 'arial',
                // fontWeight : 'bold'
            // },
        // });
        
        var row = Ti.UI.createTableViewRow({
            height : "75",
            title : data,
            color : "white",
            hasChild : true,
            font : {
                fontSize : '20',
 //               fontFamily : 'arial',
                fontWeight : 'bold'
            },            
            dataType : type,
        });

        row.addEventListener('click', function(e) {
            var equipmentListView = Alloy.createController("equipments/equipment_list", [
                functionReturn, 
                e.row.dataType, 
                $.equipmentCategoryWindow
                ]).getView();
                
        	if(OS_IOS){
    	 		Alloy.Globals.navGroupWin.openWindow(equipmentListView);
      		}else{
    			equipmentListView.open();
    		}
    
        });
        
        
        return row;

}

function initializeData () {
    var safetyEquipmentZones = query.getEquipmentZoneList();
    var tableData = [];
//    tableData.push(setTable("Aircraft Equipment", null));                    
    if (safetyEquipmentZones != null && safetyEquipmentZones.length > 0) {
        for(var i = 0; i < safetyEquipmentZones.length; i++) {
            tableData.push(setTable("Safety Equipment (Zone "+safetyEquipmentZones[i] + ")", safetyEquipmentZones[i]));                    
        }
    }
    
    $.equipmentCategoryTableView.setData(tableData); 
}

//**********************************************
//* Main
//**********************************************
$.equipmentCategoryWindow.backgroundImage = bgGeneral;
$.equipmentCategoryTableView.separatorColor = colorSeparatorTableRow,
initializeData();

$.equipmentCategoryWindow.addEventListener('postlayout', function() {
	if(!isPostedLayout) {
		isPostedLayout = true;
	    if(OS_IOS) {
	        Alloy.Globals.activityIndicator.hide();
	    }
	   }
});

$.equipmentCategoryWindow.addEventListener('focus', function(e) {
    if (equipmentRefresh) {// && e.source.id != "incidentListWindow") {
        equipmentRefresh = 0;
        $.equipmentCategoryWindow.close();
    }
});

if(OS_ANDROID){
	$.equipmentCategoryWindow.addEventListener('android:back', function(e) {
	    Ti.API.info("Press Back button");
		$.equipmentCategoryWindow.close();
	});

	var softInput = Titanium.UI.Android.SOFT_INPUT_STATE_ALWAYS_HIDDEN | Ti.UI.Android.SOFT_INPUT_ADJUST_PAN;
	$.equipmentCategoryWindow.windowSoftInputMode = softInput;

}


