var args = arguments[0] || {};
var newFlag = args.newFlag;
var incidentCate = args.incidentCate;
var incidentId = args.incidentId;
var crewId=args.crewId;
var dataEmerCateName = ["Crew Decease", "Severe Crew Injury"];
var dataEmerCateId = [ CREW_DECEASE,  SEVERE_CREW_INJURY];

//
//***************************
function createEmergencyTableRow(emergencyCateName, emergencyCateId) {
    var title = $.UI.create("Label", {
        text : emergencyCateName,
        left : 20,
        height : 50,
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
                crewId : crewId
            }).getView();
            
		        if(OS_IOS)
		    	{
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
$.crewEmergencyCateWindow.backgroundImage = bgGeneral;
$.emergencyCategoryListTableView.separatorColor = colorSeparatorTableRow;
tableData = [];
for (var i = 0; i < dataEmerCateName.length; i++) {
    tableData.push(createEmergencyTableRow(dataEmerCateName[i], dataEmerCateId[i]));
}
$.emergencyCategoryListTableView.setData(tableData);
$.emergencyCategoryListTableView.selectionStyle = 1;
tableData = null;
$.crewEmergencyCateWindow.addEventListener('focus', function(e) {
    if (incidentListIsRefresh) {// && e.source.id != "incidentListWindow") {
        $.crewEmergencyCateWindow.close();
    }
});


if(OS_ANDROID){
	$.crewEmergencyCateWindow.addEventListener('android:back', function(e) {
	    Ti.API.info("Press Back button");
		$.crewEmergencyCateWindow.close();
	});
}

