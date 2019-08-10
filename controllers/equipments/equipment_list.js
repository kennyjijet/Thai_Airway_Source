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
var utility = require('utility_lib');

var args = arguments[0] || {};
var query = require('query_lib');
var functionReturn = args[0];
//var acRegi = args[1];
var equipmentTypeOrZone = args[1];
var eType = args[2];
var equipments = [];
var tempData;
var searchStatus = false;
var keyboardTimeout;
var isPostedLayout = false;

//**********************************************
//* Function
//**********************************************
function getDataEquipment() {
    if(equipmentTypeOrZone == null) {
        if(utility.isEmpty(eType)) {
            eType = "";
        }
        
        equipments = query.getServiceEquipments(eType);    
        setTable1(equipments);
    } else {
        equipments = query.getSafetyEquipmentsByZone(equipmentTypeOrZone);        
        setTable(equipments);
    }
}

function setTable(equipmentData) {
    var dataTable = [];
    $.tableView.removeAllChildren();

    for (var i = 0; i < equipmentData.length; i++) {
        var row = Ti.UI.createTableViewRow({
            height : "75",
            hasChild : equipmentData[i].havePart
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

        if(OS_IOS) {
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
            var label2 = Ti.UI.createLabel({
                text : equipmentData[i].zone + (equipmentData[i].location != "" ? (" - " + equipmentData[i].location) : ""),
                left : 0,
                top : 0,
                color : "white",
                font : {
                    fontSize : '18',
                },
            });

        } else {
            var label1 = Ti.UI.createLabel({
                text : equipmentData[i].name,
                left : "0",
                color : "white",
                height : 50,
                font : {
                    fontSize : '17',
                    fontWeight : 'bold'
                },
            });
            var label2 = Ti.UI.createLabel({
                text : equipmentData[i].zone + (equipmentData[i].location != "" ? (" - " + equipmentData[i].location) : ""),
                left : 0,
                top : 0,
                color : "white",
                font : {
                    fontSize : '16',
                },
            });
        }
                
        var row2 = Ti.UI.createView({
            className : "row",
            height : "50%",
            width : "100%",
        });

        row1.add(label1);
        row2.add(label2);
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
            title : i != equipmentData.length - 1 ? equipmentData[i].name : "UNCATEGORIZE",
            color : "white",
            hasChild : true,
            font : {
                fontSize : '20',
                fontWeight : 'bold'
            },            
        });
        dataTable.push(row);
     }
    $.tableView.setData(dataTable);
}

function setTable2(equipmentData) {
    var dataTable = [];

    for (var i = 0; i < equipmentData.length; i++) {        
        var row = Ti.UI.createTableViewRow({
            height : "75",
            title : equipmentData[i].name ,
            color : "white",
            hasChild : true,
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
if(equipmentTypeOrZone == null) {  
    if (searchStatus) {
    	if(e.row.title.indexOf("UNCATEGORIZE") == -1 ){ 
	        if (tempData[e.index].havePart) {
	            var partListView = Alloy.createController("equipments/part_list", [functionReturn, tempData[e.index], $.equipmentListWindow]).getView();	
	        	if(OS_IOS){
    	 			Alloy.Globals.navGroupWin.openWindow(partListView);
      			}else{
    				partListView.open();
    			}
	        } else {
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
	            $.equipmentListWindow.close();
	        }
        }else{
        	Ti.API.info(tempData[e.index]);
        	var equipmentListOther = Alloy.createController("equipments/equipment_list_other", [functionReturn, tempData[e.index], $.equipmentListWindow]).getView();
        	if(OS_IOS){
    	 			Alloy.Globals.navGroupWin.openWindow(equipmentListOther);
      			}else{
    				equipmentListOther.open();
    			}
        }
    } else {
    	if(e.row.title.indexOf("UNCATEGORIZE") == -1 ){ 
	        if (equipments[e.index].havePart) {
	        
	            var partListView = Alloy.createController("equipments/part_list", [functionReturn, equipments[e.index], $.equipmentListWindow]).getView();
	            if(OS_IOS){
    	 			Alloy.Globals.navGroupWin.openWindow(partListView);
      			}else{
    				partListView.open();
    			}
	        
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
	           
	            $.equipmentListWindow.close();
	            
	        }
	    }else{
	    	Ti.API.info(equipments[e.index]);
	    	var equipmentListOtherView = Alloy.createController("equipments/equipment_list_other", [functionReturn, equipments[e.index], $.equipmentListWindow]).getView();
	    	if(OS_IOS){
    	 		Alloy.Globals.navGroupWin.openWindow(equipmentListOtherView);
      		}else{
    			equipmentListOtherView.open();
    		}	
	    }
    }
}
else{
	
	if (searchStatus) {
	        if (tempData[e.index].havePart) {
	        	var partListView =  Alloy.createController("equipments/part_list", [functionReturn, tempData[e.index], $.equipmentListWindow]).getView();
	        	if(OS_IOS){
    	 			Alloy.Globals.navGroupWin.openWindow(partListView);
      			}else{
    				partListView.open();
    			}	
	        	
	        } else {
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
	             eType.close();
	            $.equipmentListWindow.close();
	        }
    } else {
    
	        if (equipments[e.index].havePart) {
	        	var partListView = Alloy.createController("equipments/part_list", [functionReturn, equipments[e.index], $.equipmentListWindow]).getView();
	        	if(OS_IOS){
    	 			Alloy.Globals.navGroupWin.openWindow(partListView);
      			}else{
    				partListView.open();
    			}	
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
	             eType.close();
	            $.equipmentListWindow.close();
	        }	   
    }    
}
});

$.custom_searchbar.clearTextBtn.addEventListener('click', function() {
    tempData = [];
    $.custom_searchbar.customSearchBar.value = "";
    searchStatus = false;
    $.custom_searchbar.clearTextBtn.hide();
    if(equipmentTypeOrZone == null) {   
        $.custom_searchbar.customSearchBar.hintText = "Search by Equipment Name...";
        if(OS_IOS) {
            Alloy.Globals.activityIndicator.show();
        }
        setTimeout(function() {
            setTable1(equipments);
            if(OS_IOS) {
                Alloy.Globals.activityIndicator.hide();
            }
        }, 20);
    } else {       
        $.custom_searchbar.customSearchBar.hintText = "Search by Equipment Name, Location, Zone...";
	    if(OS_IOS) {
	        Alloy.Globals.activityIndicator.show();
	    }
        setTimeout(function() {
            setTable(equipments);
            if(OS_IOS) {
                Alloy.Globals.activityIndicator.hide();
            }
        }, 20);
    }
});

$.custom_searchbar.customSearchBar.addEventListener('touchstart', function(e) {
//        $.custom_searchbar.customSearchBar.hintText = "";
    if ($.custom_searchbar.customSearchBar.value == "") {
        tempData = [];
        if(equipmentTypeOrZone == null) {   
//        	setTable1(equipments);
        	$.custom_searchbar.customSearchBar.hintText = "Search by Equipment Name...";
	    } else {       
//	        setTable(equipments);
	        $.custom_searchbar.customSearchBar.hintText = "Search by Equipment Name, Location, Zone...";
	    }
        searchStatus = false;
        $.custom_searchbar.clearTextBtn.hide();
    } else {
        searchStatus = true;
        searchData($.custom_searchbar.customSearchBar.value.trim().toLowerCase());
        $.custom_searchbar.clearTextBtn.show();
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
            if(equipmentTypeOrZone == null) {   
                $.custom_searchbar.customSearchBar.hintText = "Search by Equipment Name...";
                setTable1(equipments);
    	    } else {       
                $.custom_searchbar.customSearchBar.hintText = "Search by Equipment Name, Location, Zone...";
                setTable(equipments);
    	    }
        } else {
            searchStatus = true;
            $.custom_searchbar.clearTextBtn.show();
            searchData($.custom_searchbar.customSearchBar.value.trim().toLowerCase());
        }
    }, 500);
});

function searchData(text) {
    tempData = [];

    
    if(equipmentTypeOrZone == null) {
    	for (var i = 0; i < equipments.length-1; i++) {
	        if (equipments[i].name.trim().toLowerCase().indexOf(text) > -1) {
	            tempData.push(equipments[i]);
	        }
   		 }   
        	setTable2(tempData);
	    } else {   
	    	for (var i = 0; i < equipments.length; i++) {
	    		var equipmentsTextSearch=equipments[i].name.trim().toLowerCase()+","+equipments[i].location.trim().toLowerCase()+","+equipments[i].zone.trim().toLowerCase();
		        if (equipmentsTextSearch.indexOf(text) > -1) {
		            tempData.push(equipments[i]);
		        }
	   		 }    
	        setTable(tempData);
	    }
}

function resetSearchTextBar() {

    $.custom_searchbar.customSearchBar.value = '';
    $.custom_searchbar.customSearchBar.blur();

}

function init() {
    $.custom_searchbar.clearTextBtn.hide();
     	if(equipmentTypeOrZone == null) {   
	    	 $.custom_searchbar.customSearchBar.hintText = "Search by Equipment Name...";
	    } else {       
	         $.custom_searchbar.customSearchBar.hintText = "Search by Equipment Name, Location, Zone...";
	    }
    $.equipmentListWindow.backgroundImage = bgGeneral;
    $.tableView.separatorColor = colorSeparatorTableRow;
}

//**********************************************
//* Main
//**********************************************
init();
getDataEquipment();

$.equipmentListWindow.addEventListener('postlayout', function() {
	if(!isPostedLayout) {
		isPostedLayout = true;
	    if(OS_IOS) {
	        Alloy.Globals.activityIndicator.hide();
	    }
	}
});

if(OS_ANDROID){
	$.equipmentListWindow.addEventListener('android:back', function(e) {
	    Ti.API.info("Press Back button");
		$.equipmentListWindow.close();
	});
	var softInput = Titanium.UI.Android.SOFT_INPUT_STATE_ALWAYS_HIDDEN | Ti.UI.Android.SOFT_INPUT_ADJUST_PAN;
	$.equipmentListWindow.windowSoftInputMode = softInput;	
}
