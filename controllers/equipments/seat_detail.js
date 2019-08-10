//**********************************************
//* Require
//**********************************************
var query = require('query_lib');
var utility = require('utility_lib');
var component = require('component_lib');

//**********************************************
//* Variable Declaration
//**********************************************
var args = arguments[0] || {};
var LOPAPositionId = args.LOPAPositionId;
var LOPAPositionType = args.LOPAPositionType;

var accountId = args.accountId;
var passengerId = args.passengerId;
var paxKey = args.paxKey;
var doFunction = args.doFunction;
var fromWhere = args.fromWhere;
var irreName = args.irreName;
var incId = args.incId;
var irreName = args.irreName;
var incId = args.incId;
var upgradeCode = args.upgradeCode;
var isFromLopa = args.isFromLopa;

const GENERAL_INCIDENT = 1;
const EMERGENCY_INCIDENT = 2;
const ROP_APPLICATIN_INCIDENT = 3;
var incidents = [];
var closeFlag = 0;
var flightInformation;
var acReg;

var windowWidth=0;
var isPostedLayout = false;

//**********************************************
//* Function
//**********************************************
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

function getData(id) {
    var seatDetailData = query.getIncidentSeatDetail(id);
    var positionDetail = query.getLOPAPositionDetailByLopaId(LOPAPositionId);

    flightInformation = query.getFlight(currentFlightId);
    if (flightInformation != null) {
        acReg = flightInformation.aircraftRegistration;
    }
    if(OS_IOS)
    {
    	incidents = query.getIncidentsByPassengerOrPosition(null, null, null, positionDetail.position, acReg);
    	
    }
	if(OS_ANDROID)
	{
		incidents = query.getIncidentsByPassengerOrPosition("", "", "", positionDetail.position, acReg);
    	
	}
    $.seatAndClass.text = (seatDetailData.position != null ? seatDetailData.position : "") + " " + (seatDetailData.classSeat != null ? "Class"+ " " + seatDetailData.classSeat : "");
    $.floorAndZone.text = (seatDetailData.floor != null ?  seatDetailData.floor : "") + " - " + (seatDetailData.zone != null ? "Zone" + seatDetailData.zone : "");
    showIncidentList(incidents);
}

function init() {
    
    if(doFunction == UPGRADE_SEAT_FUNCTION || doFunction == CHANGE_SEAT_FUNCTION) {
         $.multiFunctionBtn.image = "/images/btn_select_seat.png";       
    } else {
         $.multiFunctionBtn.image = "/images/btn_create_incident2.png";               
    }
    
    if(LOPAPositionType == 'galley')
    {
    	$.image.image = "/images/ic_galley2.png";
    }
    else if(LOPAPositionType == 'lavatory')
    {
    	$.image.image = "/images/ic_lavatory2.png";	
    }
    else if(LOPAPositionType == 'seat')
    {
    	$.image.image = "/images/ic_seat2.png";	
    }

    getData(LOPAPositionId);
    showIncidentList(incidents);
}

function showIncidentList(dataAgr) {
    $.incidentListTableView1.removeAllChildren();
    tableData1 = [];

    for (var i = 0; i < dataAgr.length; i++) {
        tableData1.push(initializeIncidentRow(dataAgr[i], i));
    }
    $.incidentListTableView1.setData(tableData1);
    $.incidentListTableView1.selectionStyle = "none";
    tableData1 = null;
    dataAgr = null;
}

//* Initial Table Row to view Incident data
function initializeIncidentRow(incident, index) {
   var iconWidth = 0;
   var subtitleWidthPercentageOfScreen = 70;           
   if(OS_ANDROID) {
       var subtitleWidthPercentageOfScreen = 50;           
   } 

    var str2 = incident.category;
    if (str2 == null) {
        str2 = "";
    } else {
        str2 = str2.toString();
    }

    var icon2 = $.UI.create("ImageView", {
        image : (str2.length > 0) ? "/images/" + "ic_" + component.incidentCategoryArray(str2) + "1" + ".png" : "/images/ic_other1.png",
        left : iconWidth + 20,
        height : 40,
        width : 40,
    });
    str2 = null;

    var lastNameStr;
    var firsNameStr;
    var seatName = "";
    var posName = "";
    var seatStr = "";
    var classStr = "";
    var equipmentNameStr = "";
	
    if(incident.category == AC_MAINTENANCE || incident.category == SAFETY_EQUIPMENT) {
        for (var i = 0; i < incident.lopaPosition.length; i++) {
            if (incident.lopaPosition[i] != null && incident.lopaPosition[i].length > 0) {
                posName += ", " + incident.lopaPosition[i];
            } 
        }                
        posName = posName.substring(2, posName.length);
    } else {
        if (incident.passengerBookingSeat != null && incident.passengerBookingSeat.length) {
            seatName = incident.passengerBookingSeat;
        }        
    }

    if (incident.passengerLastName != null && incident.passengerLastName.length > 0)
        lastNameStr = incident.passengerLastName + " ";
    else
        lastNameStr = "";
    if (incident.passengerFirstName != null && incident.passengerFirstName.length > 0)
        firsNameStr = incident.passengerFirstName;
    else
        firsNameStr = "";
    if ((seatName != null && seatName.length > 0) || (posName != null && posName.length > 0))
        seatStr = "Seat No. " + seatName + posName;
    else
        seatStr = "";
    if (incident.passengerBookingClass != null && incident.passengerBookingClass.length > 0)
        classStr = ", Class " + incident.passengerBookingClass + "   ";
    else
        classStr = "";

    var passengerStr = lastNameStr + firsNameStr + seatStr + classStr;
    if (passengerStr.length > 0) {
        var nameStr = lastNameStr + firsNameStr;
    } else if (incident.category == EMERGENCY && (incident.emergencyType == CREW_DECEASE || incident.emergencyType == SEVERE_CREW_INJURY)) {
        var crewFirstName = !utility.isEmpty(incident.crewFirstName) ? incident.crewFirstName + " " : "";
        var crewLastName = !utility.isEmpty(incident.crewLastName) ? incident.crewLastName + " " : "";
        var crewRank = !utility.isEmpty(incident.crewRank) ? incident.crewRank + " " : "";
        var nameStr = crewRank + crewFirstName + crewLastName;
    } else {
        var nameStr = "";
    }

    if (incident.equipmentName != null && incident.equipmentName.length > 0)
        equipmentNameStr = incident.equipmentName;
    else
        equipmentNameStr = "";
    if (incident.condition != null && incident.condition.length > 0)
        conditionStr = " " + incident.condition;
    else
        conditionStr = "";
    var slashStr = "";
    
    if(nameStr.length > 0 && equipmentNameStr.length > 0) {
        slashStr = " - ";
    }
    
    var headerLabel = nameStr + slashStr;

    var subjectStr = "";
    if (incident.subject != null && incident.subject.length > 0) {
        subjectStr = incident.subject;        
    } else {
        subjectStr = "";        
    }
    
    var seatClassStr = seatStr + classStr;

    var title = $.UI.create("Label", {
        text : headerLabel,
        top : 7,
        left : iconWidth + icon2.width + 30,
        height : 17,
        classes : 'fontBold17',
        color : colorTextSubTitle
    });
    
    if(OS_ANDROID)
    {
        title.height = 25;
    }
    
    if(headerLabel.length > 0) {
       var titleWidth = title.toImage().width;        
    } else {
       var titleWidth = 0;        
    }
    
    var title2 = $.UI.create("Label", {
        text :equipmentNameStr + conditionStr,
        top : 7,
        left : iconWidth + icon2.width + titleWidth +30,
        height : 17,
        lines: 1,
        classes : 'fontBold17',
        color : colorTextValue
    });
    
    if(OS_ANDROID)
    {
        if(titleWidth > 0) {
            var titleWidthCalibration = utility.toImageCalibrationForAndroid(titleWidth);         
        } else {
            var titleWidthCalibration = titleWidth;         
        }
        title2.height = 22;
        title2.left = iconWidth + icon2.width + titleWidthCalibration + 30;
        title2.width = windowWidth - (iconWidth + icon2.width + titleWidthCalibration + 320);   
        title2.wordWrap = false;
        title2.ellipsize = true;
        
    } else {
        title2.width = windowWidth - (iconWidth + icon2.width + titleWidth + 140);        
    }
    
    var widthForSubtitle = 0;
    if(seatClassStr.length == 0) {
        widthForSubtitle = Math.floor((50/100) * windowWidth);
    } else {
        widthForSubtitle = null;        
    }

    var subtitle = $.UI.create("Label", {
        text : subjectStr,
        top : title.top + title.height + 5,
        left : iconWidth + icon2.width + 30,
        height : 16,
        lines : 1,
        width : widthForSubtitle,
        classes : 'fontLight16',
        color : colorTextValue
    });
    
    var subtitleWidth = subtitle.toImage();

    subtitleWidth = subtitleWidth.width;
    
    if(OS_ANDROID)
    {
        subtitle.height = 20;
        subtitle.wordWrap = false;
        subtitle.ellipsize = true;
        subtitleWidth = utility.toImageCalibrationForAndroid(subtitleWidth);       
    }

    if (subjectStr != null && subjectStr.length > 0) {
        subtitleWidth = iconWidth + icon2.width + 35 + subtitleWidth;
    } else {
        subtitleWidth = iconWidth + icon2.width + 30;
    }
            
    if((subtitleWidth > Math.floor((subtitleWidthPercentageOfScreen/100) * windowWidth)) && seatClassStr.length == 0) {
        subtitle.width = Math.floor((subtitleWidthPercentageOfScreen/100) * windowWidth);
    } else if((subtitleWidth > Math.floor((subtitleWidthPercentageOfScreen/100) * windowWidth)) && seatClassStr.length > 0){
        subtitle.width = Math.floor((subtitleWidthPercentageOfScreen/100) * windowWidth) - (iconWidth + icon2.width + 30);  
        subtitleWidth  = Math.floor((subtitleWidthPercentageOfScreen/100) * windowWidth);      
    } else {
        subtitle.width = subtitleWidth - (iconWidth + icon2.width + 35);
        subtitleWidth = subtitle.width + iconWidth + icon2.width + 35;  
        Ti.API.info(seatClassStr);
    }
       
    var subtitle1 = $.UI.create("Label", {
        text : seatClassStr,
        top : title.top + title.height + 5,
        left : subtitleWidth,
        width : windowWidth - (subtitleWidth + 140),
        height : 16,
        lines : 1,
        classes : 'fontLight16',
        color : colorTextSubTitle
    });
    
    if(OS_ANDROID)
        {
            subtitle1.width = Math.floor((15/100) * windowWidth);
            subtitle1.height = 20;
            subtitle1.wordWrap = false;
            subtitle1.ellipsize = true;

        }

    var str1;
    if (utility.isEmpty(incident.logGroup) && incident.category != AC_MAINTENANCE && incident.category != SAFETY_EQUIPMENT) {
        str1 = "";
    } else {
        if (incident.logGroup == CABIN_LOG) {
            str1 = "Cabin Log No. : " + incident.sequenceNumber;
        } else if (incident.logGroup == FLIGHT_DECK_LOG) {
            str1 = "FLT Deck Log No. : " + incident.sequenceNumber;
        } else {
            str1 = incident.sequenceNumber;
        }
    }
    var logNumber = $.UI.create("Label", {
        text : str1,
//        top : subtitle.top + subtitle.height + 5,
        bottom : 7,
        left : iconWidth + icon2.width + 30,
        classes : 'fontLight16',
        color : colorTextDesc
    });
    str1 = null;

    var flightNumber = $.UI.create("Label", {
        text : incident.flightNumber, //"TG628 / 8MAY2017",
        top : subtitle.top + subtitle.height + 5,
//        bottom : 7,
        left : iconWidth + icon2.width + 30,
        classes : 'fontLight16',
        color : colorTextDesc
    });
    
    var intStatus = "";

    if(incident.status == OPEN) {
        intStatus = "PENDING";
    } else if(incident.status == RESOLVED || incident.status == CLOSED) {
        intStatus = "RESOLVED";        
    } 
    
    var incidentStatusTop = 20;
    if(OS_ANDROID) {
        incidentStatusTop = 23;
    }

    var incidentStatus = $.UI.create("Label", {
        text : !incident.isVoided ? intStatus : "VOIDED",
        top : incidentStatusTop,
        right : 5,
        classes : 'fontLight16',
        color : colorTextValue
    });
    

    var reportedBy = $.UI.create("Label", {
        text : incident.reportedBy,
        bottom : 25,
        right : 5,
        classes : 'fontLight16',
        color : "#A3FFFFFF"
    });

    var createdDateTime = $.UI.create("Label", {
        text : utility.displayDateTime(incident.createDateTime),
        bottom : 7,
        right : 5,
        classes : 'fontLight16',
        color : colorTextDesc
    });

    var row = $.UI.create("TableViewRow", {
        selectedColor : 'transparent',
        hasChild : 'true',
        height : 100,
        touchEnabled : true,
        id : incident.id,
        idType : "btnRow"
    });
    
    if(OS_ANDROID)
    {
        row.left = 20;
        row.height = 110;
    }
    
    row.addEventListener("click", function(e) {
        if ((e.source.id == undefined || e.source.idType == "btnRow") && (e.source.id != "iconId")) {
            if(OS_IOS){ Alloy.Globals.activityIndicator.show(); }
            setTimeout(function() {
                var incidentDetailView = Alloy.createController("incidents/incident_detail", {
                    incidentCate : "",
                    isNew : false,
                    incidentId : e.source.parent.id == undefined ? e.source.id : e.source.parent.id,
                    type : ""
                }).getView();
                
                if(OS_IOS){
                    Alloy.Globals.navGroupWin.openWindow(incidentDetailView);
                }else{
                    $.anActIndicatorView.show();
                    incidentDetailView.open();
                }
                
            }, 200);
        }
    });

    row.add(title);
    row.add(title2);
    row.add(subtitle);
    row.add(subtitle1);
    row.add(reportedBy);
    row.add(createdDateTime);
    row.add(incidentStatus);
    row.add(icon2);
    row.add(logNumber);
    row.add(flightNumber);
    incident = null;
    headerLabe = null;
    return row;
}

//* Dialog option for selecting incident category to create the new incident
function createOptionalBtn(dataAgr , indexArg) {
    var btnId = dataAgr[0];
    var btnName = dataAgr[1];
    var imgPathName = dataAgr[2];
    var pagePath;
    var textColor;
    
    textColor = null;
    var row = component.createOptionDialogBtn(btnId, 2);
    row.add(component.createIcon(imgPathName, "7%"));
    row.add(component.createLabel(btnName, "17%",textColor));

    row.addEventListener("click", function(e) {
        if (e.source.id == undefined || e.source.idType == "btnRow") {
            if (e.source.parent.id == undefined) {
                btnId = e.source.id;
            } else {
                btnId = e.source.parent.id;
            }
        }
        if (btnId == EMERGENCY) {
            pagePath = "incidents/emergency_category";
        } else {
            pagePath = "incidents/incident_detail";
        }
        
    	var pagePathView = Alloy.createController(pagePath, {
            incidentCate : btnId,
            passengerId : null,
            seatId : LOPAPositionId,
            isNew : true,
            incidentId : "",
            type : "",
            paxConcern : NOT_CONCERN_PAX
        }).getView();
        
        if(OS_IOS){
    	 	Alloy.Globals.navGroupWin.openWindow(pagePathView);
      	}else{
    		pagePathView.open();
    	}
    
    });
    btnId = null;
    pagePath = null;
    btnName = null;
    imgPathName = null;
    return row;
}

//* Event on +CREATE INCIDENT button / Select seat button
$.multiFunctionBtn.addEventListener("click", function(e) {
    if(doFunction == UPGRADE_SEAT_FUNCTION || doFunction == CHANGE_SEAT_FUNCTION) {
        
        var upgradeSeatDetailView = Alloy.createController("upgrade_seat/upgrade_seat_detail", {
            accountId : accountId,
            passengerId : passengerId,
            paxKey : paxKey,
            doFunction : doFunction,
            LOPAPositionId : LOPAPositionId,
            LOPAPositionType : LOPAPositionType,
            fromWhere : fromWhere,
            irreName : irreName,
            incId : incId,
            upgradeCode : upgradeCode,
            isFromLopa : args.isFromLopa
            
        }).getView();
        
        if(OS_IOS){
    	 	Alloy.Globals.navGroupWin.openWindow(upgradeSeatDetailView);
      	}else{
    		upgradeSeatDetailView.open();
    	}
    } else {
 //       e.source.image = "images/btn_create_incident2.png";
        var data = [];
        data = component.incidentCategoryData();
        data.remove(5);
        data.remove(4);
        data.remove(1);
        data.remove(0);
    
        var tableData = [];
        for (var i = 0; i < data.length; i++) {
            tableData.push(createOptionalBtn(data[i],i));
        }
        var win2 = component.createOptionDialogWindow(tableData, "70%");
        data = null;
        tableData = null;
        closeFlag = 1;
        win2.open();
        win2.addEventListener("click", function(e) {
            win2.close();
        });        
    }
});

//***********************************
//* Main
$.seatDetailWindow.backgroundImage = bgGeneral;
$.incidentListTableView1.separatorColor = colorSeparatorTableRow;
$.incidentListTableView1.backgroundColor = "transparent";
$.incidentListTableView1.selectedBackgroundColor = "#33ffffff";

$.seatDetailWindow.addEventListener('focus', function(e) {
    if (incidentSeatDetailIsRefresh) {// && e.source.id != "incidentListWindow") {
        if(OS_IOS){ Alloy.Globals.activityIndicator.hide(); }
        init();
        getData(LOPAPositionId);
        showIncidentList(incidents);
        incidentListIsRefresh = 0;
        incidentPassengerIsRefresh = 0;
        incidentSeatDetailIsRefresh = 0;
    }
    if(passengerSeatClassIsRefresh == 1 || compensationFlag == 1 || changeSeatFromIncidentDetailIsRefresh == 1 || isBackToLopa == 1) {
        isBackToLopa = 0;
        $.seatDetailWindow.close();            
    }

});

$.seatDetailWindow.addEventListener('postlayout', function(e) {
	
	if(!isPostedLayout){
		if(OS_IOS){ Alloy.Globals.activityIndicator.hide(); }
		isPostedLayout = true;
        windowWidth = $.seatDetailView.toImage().width; 
        init();
	}
});

$.seatDetailWindow.addEventListener('blur', function(e) {
    if (closeFlag != 0) {
		closeFlag = 0;
		return;
	}	
});

if(OS_ANDROID){
	$.seatDetailWindow.addEventListener('android:back', function(e) {
	    Ti.API.info("Press Back button");
	    $.incidentBtn = null;
	    $.seatDetailView = null;
		$.seatDetailWindow.close();
	});
}


