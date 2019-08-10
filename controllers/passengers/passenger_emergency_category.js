var args = arguments[0] || {};
//var newFlag = args.newFlag;
//var incidentCate = args.incidentCate;
//var incidentId = args.incidentId;
//var crewId=args.crewId;
var passengerId = args.passengerId;

var dataEmerCateName = ["Passenger Decease", "Severe Passenger Injury"];
var dataEmerCateId = [PASSENGER_DECEASE,  SEVERE_PASSENGER_INJURY];

//
//***************************
function createEmergencyTableRow(emergencyCateName, emergencyCateId) {
    var title = $.UI.create("Label", {
        text : emergencyCateName,
        //   top : 7,
        left : 20,
 //       height : 20,
        //    color : "#007AFF",
        color : "white",
        font : {
            //       fontWeight : "bold",
            fontSize : 20
        }
    });

    var row = $.UI.create("TableViewRow", {
        className : 'row',
        selectedColor : 'transparent',
        hasChild : 'true',
        height : 80,
        selectedBackgroundColor : 'gray',
        backgroundImage : bgHeaderSection,
        touchEnabled : true,
        id : emergencyCateId,
        idType : "btnRow",
        emergencyName: emergencyCateName
    });
    
    row.addEventListener("click", function(e) {
        if (e.source.id == undefined || e.source.idType == "btnRow") {
            var incidentDetailView = Alloy.createController("incidents/incident_detail", {
                incidentCate : EMERGENCY,
                isNew : true,
                incidentId : "",
                reportType : e.source.id != undefined ? e.source.emergencyName : e.source.parent.emergencyName,
                emergencyType : e.source.id != undefined ? e.source.id : e.source.parent.id,
                passengerId : passengerId
            }).getView();
            if(OS_IOS){
    	 		Alloy.Globals.navGroupWin.openWindow(incidentDetailView);
      		}else{
    			incidentDetailView.open();
    		}
        }
    });

    row.add(title);
    return row;
}

//
//******************************
$.paxEmergencyCateWindow.backgroundImage = bgGeneral;
$.emergencyCategoryListTableView.separatorColor = colorSeparatorTableRow;
tableData = [];
for (var i = 0; i < dataEmerCateName.length; i++) {
    tableData.push(createEmergencyTableRow(dataEmerCateName[i], dataEmerCateId[i]));
}
$.emergencyCategoryListTableView.setData(tableData);
$.emergencyCategoryListTableView.selectionStyle = 1;
tableData = null;

$.paxEmergencyCateWindow.addEventListener('focus', function(e) {
    if (incidentPassengerIsRefresh) {// && e.source.id != "incidentListWindow") {
        // Alloy.Globals.activityIndicator.show();
        // setTimeout(function() {
           // initialization();
           // Alloy.Globals.activityIndicator.hide();
        // },200);
 //       incidentListIsRefresh = 0;
        $.paxEmergencyCateWindow.close();
    }
});

if(OS_ANDROID){
	$.paxEmergencyCateWindow.addEventListener('android:back', function(e) {
	    Ti.API.info("Press Back button");
		$.paxEmergencyCateWindow.close();
	    
	});
}
