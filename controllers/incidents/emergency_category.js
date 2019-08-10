var args = arguments[0] || {};
var newFlag = args.newFlag;
var incidentCate = args.incidentCate;
var incidentId = args.incidentId;
var personType = args.personType;
var passengerId = args.passengerId;
var seatId = args.seatId;
var lopaPos = args.lopaPos;

var dataEmerCateName = ["Passenger Decease", "Crew Decease", "Severe Passenger Injury", "Severe Crew Injury", "Severe Turbulence", "Slide Deployment"];
var dataEmerCateId = [PASSENGER_DECEASE, CREW_DECEASE, SEVERE_PASSENGER_INJURY, SEVERE_CREW_INJURY, SEVERE_TURBULENCE, SLIDER_DEPLOYMENT];
var emerTypeArray = [PASSENGER_DECEASE, CREW_DECEASE, SEVERE_PASSENGER_INJURY, SEVERE_CREW_INJURY, SEVERE_TURBULENCE, SLIDER_DEPLOYMENT];
//
//***************************
function createEmergencyTableRow(emergencyCateName, emergencyCateId, emerTypeArg) {
    var title = $.UI.create("Label", {
        text : emergencyCateName,
        left : 20,
//        height : 20,
        //    color : "#007AFF",
        color : "white",
        font : {
            //       fontWeight : "bold",
            fontSize : 20
        },
        emerType : emerTypeArg
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
        emerType : emerTypeArg,
        emergencyName: emergencyCateName
    });
    var emergencyCateNameTemp = emergencyCateName;
    
    row.addEventListener("click", function(e) {
        if (e.source.id == undefined || e.source.idType == "btnRow") {
            
            var incidentDetailView = Alloy.createController("incidents/incident_detail", {
                incidentCate : EMERGENCY,
                isNew : true,
                incidentId : "",
                reportType : emergencyCateNameTemp,
                personType : "",
                emergencyType : e.source.emerType,
                passengerId : passengerId,
                seatId : seatId,
                lopaPos : lopaPos

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
$.emergencyCateWindow.backgroundImage = bgGeneral;
$.emergencyCategoryListTableView.separatorColor = colorSeparatorTableRow;
tableData = [];
for (var i = 0; i < dataEmerCateName.length; i++) {
    tableData.push(createEmergencyTableRow(dataEmerCateName[i], dataEmerCateId[i], emerTypeArray[i]));
}
$.emergencyCategoryListTableView.setData(tableData);
$.emergencyCategoryListTableView.selectionStyle = 1;
tableData = null;

$.emergencyCateWindow.addEventListener('focus', function(e) {
    if (incidentListIsRefresh) {// && e.source.id != "incidentListWindow") {
        $.emergencyCateWindow.close();
    }
});

if(OS_ANDROID){
	$.emergencyCateWindow.addEventListener('android:back', function(e) {
		Ti.API.info("Press Back button");
		$.emergencyCateWindow.close();	
	});
}
