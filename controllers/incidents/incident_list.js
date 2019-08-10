//**********************************************
//* Require
//**********************************************
var query = require('query_lib');
var utility = require('utility_lib');
var component = require('component_lib');

//**********************************************
//* Variable Declaration
//**********************************************
// Global Variable
var headerData1 = [];
var headerData2 = [];
var headerData3 = [];

var draftIncidentList = [];
var draftIncidentIndex = 0;

var filterStatus = ALL;
var enabledBottomButtonFlag = false;
var draftIncidentQty = 0;
var submittedIncidentQty = 0;
var historyIncidentQty = 0;
var isLoadingSearch = false;
var keyboardTimeout;

var currentSize = 105;
var overlap = 50;
var scrolling = false;
var initialTableSize;
var hasMoreData = true;
var offset = 0;
var limit = 20;
var isLoading=false;
var isLoadingSearch=false;
var searchText="";
var windowWidth=0;
var isPostedLayout = false;
var isTablePostedLayout = false;
var isSearch = false;
var isFocus = false;

//**********************************************
//* Function
//**********************************************

if(OS_ANDROID)
{
	
	var softInput = Titanium.UI.Android.SOFT_INPUT_STATE_ALWAYS_HIDDEN | Ti.UI.Android.SOFT_INPUT_ADJUST_PAN;
	$.incidentListWindow.windowSoftInputMode = softInput;
	
	$.anActIndicatorView.hide();
	$.menuIncidentView.height = "60%";
	
	$.searchSecView.height = utility_lib.dpiConverter(120);
	
	$.searchSecSubView.height = utility_lib.dpiConverter(80);
	
	$.searchImg.width = utility_lib.dpiConverter(50);
	$.searchImg.height = utility_lib.dpiConverter(50);

	$.clearTextBtn.width = utility_lib.dpiConverter(28);
	$.clearTextBtn.height = utility_lib.dpiConverter(28);
	
	$.customSearchBar.font = {
		fontSize : utility_lib.dpiConverter(18)
	};
	
	$.customSearchBar.left = "11%";
	$.customSearchBar.height = utility_lib.dpiConverter(60);
	$.customSearchBar.top = utility_lib.dpiConverter(15) + '%';
	$.customSearchBar.bottom = utility_lib.dpiConverter(40) + '%';
	$.customSearchBar.left = utility_lib.dpiConverter(10) + '%';
	$.customSearchBar.backgroundColor = "#000";
	
	$.searchImgView.width = "10%";

    $.allSearchSecView.height = "15%";    
    $.bodyView.height = "78%";
    $.submitBtn.width = "45%";
    $.cancelBtn.width = "45%";
    $.menuIncidentView.height = "51%";
    $.searchSecView.height = "49%";
    $.viewClearTextBtn.width = "7%";
    $.viewClearTextBtn.height = "100%";
    $.clearTextBtn.top = 20;
    $.searchImgView.width = "10%";
    $.searchImgView.height = "100%";
    $.searchImgView.left = 0;
    $.searchImg.top = 10;
    $.customSearchBar.left = "10%";

    $.incidentListWindow.activity.onCreateOptionsMenu = function(e) { 
        var menuItem = e.menu.add({ 
        title: "Create Incident",  
        showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM 
    }); 
        menuItem.addEventListener("click", function(e) { 
            createIncidentBtnFunction();
        }); 
    };   
	
}

if(OS_IOS)
{
	$.anActIndicatorView.hide();
}

//* Dialog option for selecting incident category to create the new incident
function createOptionalBtn(dataAgr, indexArg) {
    var btnId = dataAgr[0];
    var btnName = dataAgr[1];
    var imgPathName = dataAgr[2];
    var pagePath;
    var textColor = null;

    var row = component.createOptionDialogBtn(btnId, 6, null, 71);
    row.add(component.createIcon(imgPathName, "7%"));
    if (btnId == EMERGENCY)
        row.add(component.createLabel(btnName + " (All Types)", "17%", textColor));
    else
        row.add(component.createLabel(btnName, "17%", textColor));

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
            isNew : true,
            incidentId : "",
            type : "",
        }).getView();
        
        isFocus = false;
        
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

//* Event on +CREATE INCIDENT button
function createIncidentBtnFunction() {
    var data = [];
    data = component.incidentCategoryData();
    var tableData = [];
    for (var i = 0; i < data.length; i++) {
        tableData.push(createOptionalBtn(data[i], i));
    }
    var win2 = component.createOptionDialogWindow(tableData, "50%", "Incident List");
    data = null;
    tableData = null;

    win2.open();
    win2.addEventListener("click", function(e) {
        win2.close();
    });    
}

if(OS_IOS) {
    $.createIncidentBtn.addEventListener("click", function(e) {
        createIncidentBtnFunction();
    });    
}

//* Initial Table Row to view Incident data
function initializeIncidentRow(incident, index) {
    if (incident.isSubmitted || incident.isSynced || incident.isVoided) {
       var iconWidth = 0;
       var subtitleWidthPercentageOfScreen = 70;           
       if(OS_ANDROID) {
           var subtitleWidthPercentageOfScreen = 50;           
       } 
    } else {
        var iconWidth = 60;
        var subtitleWidthPercentageOfScreen = 65;           
        if(OS_ANDROID) {
            var subtitleWidthPercentageOfScreen = 45;           
        } 
  
        var icon = $.UI.create("ImageView", {
            image : !incident.seledtedFlag ? '/images/btn_button_off.png' : '/images/btn_button_on.png',
            left : 5,
            height : 60,
            width : iconWidth,
            isSelected : false,
            incidentId : incident.id,
            rowIndex : index,
            id : "iconId"
        });
        
        icon.addEventListener('click', function(e) {
            if (!e.source.isSelected) {
                if(draftIncidentList != null && draftIncidentList.length > 0) {
                    var isSubmitted = draftIncidentList[e.source.rowIndex].isSubmitted;
                    var cate = draftIncidentList[e.source.rowIndex].category;
                    var seqNumber = draftIncidentList[e.source.rowIndex].sequenceNumber;                    
                } else {
                    var isSubmitted = false;
                    var cate = 7;
                    var seqNumber = "";                    
                }
                
                if (!isSubmitted) {
                    if ((cate == AC_MAINTENANCE || cate == SAFETY_EQUIPMENT) && utility.isEmpty(seqNumber)) {
                        var _promptView = new Alloy.createController("common/alertPrompt", {
                            title : "Alert",
                            message : "Please enter the Cabin / FLT Deck Log No.",
                            okText : "Ok",
                            disableCancel : true,
                            onOk : function() {
                            }
                        }).getView();
                        _promptView.open();
                    } else {
                        e.source.isSelected = !e.source.isSelected;
                        draftIncidentList[e.source.rowIndex].isSelected = e.source.isSelected;
                        e.source.image = "/images/btn_button_on.png";
                        enabledBottomButtonFlag = true;
                        enalbleDisableButton();
                    }
                } 
            } else {
                var isSubmitted = draftIncidentList[e.source.rowIndex].isSubmitted;
                if (!isSubmitted) {
                    e.source.isSelected = !e.source.isSelected;
                    e.source.image = "/images/btn_button_off.png";
                    draftIncidentList[e.source.rowIndex].isSelected = e.source.isSelected;
                    checkMultiSelection();
                } 
            }
        });
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
    var salutation;
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
        firsNameStr = incident.passengerFirstName + " ";
    else
        firsNameStr = "";
    
    if (incident.salutation != null && incident.salutation.length > 0)
        salutation = incident.salutation ;
    else
        salutation = "";
        
    if ((seatName != null && seatName.length > 0) || (posName != null && posName.length > 0))
        seatStr = "Seat No. " + seatName + posName;
    else
        seatStr = "";
    if (incident.passengerBookingClass != null && incident.passengerBookingClass.length > 0)
        classStr = ", Class " + incident.passengerBookingClass + "   ";
    else
        classStr = "";

    var passengerStr = lastNameStr + firsNameStr + salutation + seatStr + classStr;
    if (passengerStr.length > 0) {
        var nameStr = lastNameStr + firsNameStr + salutation;
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
            else if(OS_ANDROID){
				$.anActIndicatorView.show();
			}
            setTimeout(function() {
            	var incidentDetailView = Alloy.createController("incidents/incident_detail", {
                    incidentCate : "",
                    isNew : false,
                    incidentId : e.source.parent.id == undefined ? e.source.id : e.source.parent.id,
                    type : ""
                }).getView();
                
                isFocus = false;
                
                if(OS_IOS){
    	 			Alloy.Globals.navGroupWin.openWindow(incidentDetailView);
      			}else{
    				incidentDetailView.open();
    			}
                
            }, 200);
        }
    });

    if (!incident.isSubmitted && !incident.isSynced && !incident.isVoided) {
       row.add(icon);        
    }
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

//* Table View Incident list
function viewListTable() {
    var tableData1 = [];
    var tableData2 = [];
    var tableData3 = [];
  
    var draftIndex = 0;
    var submittedIndex = 0;
    var draftIncedents = [];
    draftIncedents = query.getIncidentsLazyLoad(offset, limit, searchText, filterStatus, false, false);
    var submittedIncedents = [];
    var historyIncedents = [];
    var currentOffset = 0;

    if(headerData1.length > 0) {
        $.incidentListTableView.appendRow(headerData1);        
    }

    if(draftIncedents != null && draftIncedents.length > 0) {
        for (var i = 0; i < draftIncedents.length; i++) {
            tableData1.push(initializeIncidentRow(draftIncedents[i], draftIncidentIndex));
            draftIncidentList.push(draftIncedents[i]);
            draftIncidentIndex ++;
            currentSize += 75;            
        }       
        $.incidentListTableView.appendRow(tableData1);
    } 

    if(headerData2.length > 0) {
        $.incidentListTableView.appendRow(headerData2);        
    }

    if(draftIncedents.length < limit) {
        submittedIncedents = query.getIncidentsLazyLoad(offset, limit-draftIncedents.length, searchText, filterStatus, true, false);
        if(submittedIncedents != null && submittedIncedents.length > 0) {
            for (var i = 0; i < submittedIncedents.length; i++) {
                tableData2.push(initializeIncidentRow(submittedIncedents[i], i));
                currentSize += 75;            
            }        
            $.incidentListTableView.appendRow(tableData2);
        }       
    } 
    
    if(headerData3.length > 0) {
        $.incidentListTableView.appendRow(headerData3);        
    }
    
    if((draftIncedents.length + submittedIncedents.length) < limit) {
        historyIncedents = query.getIncidentsLazyLoad(offset, limit-draftIncedents.length-submittedIncedents.length, searchText, filterStatus, null, true);
        if(historyIncedents != null && historyIncedents.length > 0) {
            for (var i = 0; i < historyIncedents.length; i++) {
                tableData3.push(initializeIncidentRow(historyIncedents[i], i));
                currentSize += 75;            
            }        
            $.incidentListTableView.appendRow(tableData3);
        }                
    }
    
    if(draftIncedents.length == 0 && submittedIncedents.length == 0 && historyIncedents.length == 0) {
        hasMoreData = false;
    }
    
    tableData1 = null;
    tableData2 = null;
    tableData3 = null;
    headerData1 = [];
    headerData2 = [];
    headerData3 = [];
    
    offset += limit;
    viewQuantityOfDraftAndSubmittedIncident();
    if(OS_IOS){ Alloy.Globals.activityIndicator.hide(); }
    else { $.anActIndicatorView.hide(); }
}

//* Filter Incident by Category
$.allBtn.addEventListener("click", function(e) {
    if(OS_IOS){ Alloy.Globals.activityIndicator.show(); }
    else { $.anActIndicatorView.show(); }
    setTimeout(function() {
        $.customSearchBar.value = "";
        $.customSearchBar.hintText = " (Name), (Equipment), (Part), (Cabin/FLT Deck Log), (Subject)";
        $.clearTextBtn.visible = false;
        if(OS_ANDROID){
        	isSearch = false;
        }     
        $.allBtn.backgroundColor = colorSelectedBtnHighlight;
        $.passengerBtn.backgroundColor = "transparent";
        $.serviceEquipmentBtn.backgroundColor = "transparent";
        $.safetyEquipmentBtn.backgroundColor = "transparent";
        $.aircraftMaintenanceBtn.backgroundColor = "transparent";
        $.otherBtn.backgroundColor = "transparent";
        $.emergencyBtn.backgroundColor = "transparent";
        filterStatus = ALL;
        initialHeaderSection();
        viewListTable();
    }, 20);
});
$.passengerBtn.addEventListener("click", function(e) {
    if(OS_IOS){ Alloy.Globals.activityIndicator.show(); }
    else { $.anActIndicatorView.show(); }
    setTimeout(function() {
        $.customSearchBar.value = "";
        $.customSearchBar.hintText = " (Name), (Equipment), (Part), (Cabin/FLT Deck Log), (Subject)";
        $.clearTextBtn.visible = false;
        if(OS_ANDROID){
        	isSearch = false;
        }
        $.passengerBtn.backgroundColor = colorSelectedBtnHighlight;
        $.allBtn.backgroundColor = "transparent";
        $.serviceEquipmentBtn.backgroundColor = "transparent";
        $.safetyEquipmentBtn.backgroundColor = "transparent";
        $.aircraftMaintenanceBtn.backgroundColor = "transparent";
        $.otherBtn.backgroundColor = "transparent";
        $.emergencyBtn.backgroundColor = "transparent";
        filterStatus = PASSENGER;
        initialHeaderSection();
        viewListTable();
    }, 20);
});
$.serviceEquipmentBtn.addEventListener("click", function(e) {
    if(OS_IOS){ Alloy.Globals.activityIndicator.show(); }
    else { $.anActIndicatorView.show(); }
    setTimeout(function() {
        $.customSearchBar.value = "";
        $.customSearchBar.hintText = " (Name), (Equipment), (Part), (Cabin/FLT Deck Log), (Subject)";
        $.clearTextBtn.visible = false;
        if(OS_ANDROID){
        	isSearch = false;
        }
        $.serviceEquipmentBtn.backgroundColor = colorSelectedBtnHighlight;
        $.allBtn.backgroundColor = "transparent";
        $.passengerBtn.backgroundColor = "transparent";
        $.safetyEquipmentBtn.backgroundColor = "transparent";
        $.aircraftMaintenanceBtn.backgroundColor = "transparent";
        $.otherBtn.backgroundColor = "transparent";
        $.emergencyBtn.backgroundColor = "transparent";
        filterStatus = SERVICE_EQUIPMENT;
        initialHeaderSection();
        viewListTable();
    }, 20);
});
$.safetyEquipmentBtn.addEventListener("click", function(e) {
    if(OS_IOS){ Alloy.Globals.activityIndicator.show(); }
    else { $.anActIndicatorView.show(); }
    setTimeout(function() {
        $.customSearchBar.value = "";
        $.customSearchBar.hintText = " (Name), (Equipment), (Part), (Cabin/FLT Deck Log), (Subject)";
        $.clearTextBtn.visible = false;
        if(OS_ANDROID){
        	isSearch = false;
        }
        $.safetyEquipmentBtn.backgroundColor = colorSelectedBtnHighlight;
        $.allBtn.backgroundColor = "transparent";
        $.passengerBtn.backgroundColor = "transparent";
        $.serviceEquipmentBtn.backgroundColor = "transparent";
        $.aircraftMaintenanceBtn.backgroundColor = "transparent";
        $.otherBtn.backgroundColor = "transparent";
        $.emergencyBtn.backgroundColor = "transparent";
        filterStatus = SAFETY_EQUIPMENT;
        initialHeaderSection();
        viewListTable();
    }, 20);
});
$.aircraftMaintenanceBtn.addEventListener("click", function(e) {
    if(OS_IOS){ Alloy.Globals.activityIndicator.show(); }
    else { $.anActIndicatorView.show(); }
    setTimeout(function() {
        $.customSearchBar.value = "";
        $.customSearchBar.hintText = " (Name), (Equipment), (Part), (Cabin/FLT Deck Log), (Subject)";
        $.clearTextBtn.visible = false;
        if(OS_ANDROID){
        	isSearch = false;
        }
        $.aircraftMaintenanceBtn.backgroundColor = colorSelectedBtnHighlight;
        $.allBtn.backgroundColor = "transparent";
        $.passengerBtn.backgroundColor = "transparent";
        $.serviceEquipmentBtn.backgroundColor = "transparent";
        $.safetyEquipmentBtn.backgroundColor = "transparent";
        $.otherBtn.backgroundColor = "transparent";
        $.emergencyBtn.backgroundColor = "transparent";
        filterStatus = AC_MAINTENANCE;
        initialHeaderSection();
        viewListTable();
    }, 20);
});
$.otherBtn.addEventListener("click", function(e) {
    if(OS_IOS){ Alloy.Globals.activityIndicator.show(); }
    else { $.anActIndicatorView.show(); }
    setTimeout(function() {
        $.customSearchBar.value = "";
        $.customSearchBar.hintText = " (Name), (Equipment), (Part), (Cabin/FLT Deck Log), (Subject)";
        $.clearTextBtn.visible = false;
        if(OS_ANDROID){
        	isSearch = false;
        }
        $.otherBtn.backgroundColor = colorSelectedBtnHighlight;
        $.allBtn.backgroundColor = "transparent";
        $.passengerBtn.backgroundColor = "transparent";
        $.serviceEquipmentBtn.backgroundColor = "transparent";
        $.safetyEquipmentBtn.backgroundColor = "transparent";
        $.aircraftMaintenanceBtn.backgroundColor = "transparent";
        $.emergencyBtn.backgroundColor = "transparent";
        filterStatus = OTHER;
        initialHeaderSection();
        viewListTable();
    }, 20);
});
$.emergencyBtn.addEventListener("click", function(e) {
    if(OS_IOS){ Alloy.Globals.activityIndicator.show(); }
    else { $.anActIndicatorView.show(); }
    setTimeout(function() {
        $.customSearchBar.value = "";
        $.customSearchBar.hintText = " (Name), (Equipment), (Part), (Cabin/FLT Deck Log), (Subject)";
        $.clearTextBtn.visible = false;
        if(OS_ANDROID){
        	isSearch = false;
        }
        $.emergencyBtn.backgroundColor = colorSelectedBtnHighlight;
        $.allBtn.backgroundColor = "transparent";
        $.passengerBtn.backgroundColor = "transparent";
        $.serviceEquipmentBtn.backgroundColor = "transparent";
        $.safetyEquipmentBtn.backgroundColor = "transparent";
        $.aircraftMaintenanceBtn.backgroundColor = "transparent";
        $.otherBtn.backgroundColor = "transparent";
        filterStatus = EMERGENCY;
        initialHeaderSection();
        viewListTable();
    }, 20);
});

//* Search Function
$.customSearchBar.addEventListener('touchstart', function(e) {
    scrolling = false;
    if ($.customSearchBar.value == "") {
        $.customSearchBar.hintText = " (Name), (Equipment), (Part), (Cabin/FLT Deck Log), (Subject)";
        $.clearTextBtn.visible = false;
    } else {
        searchText = $.customSearchBar.value.trim();
        initialHeaderSection();
        viewListTable();
        $.clearTextBtn.visible = true;
    }
});

if(OS_IOS){
	$.customSearchBar.addEventListener('change', function(e) {
	    if(keyboardTimeout) {
	        clearTimeout(keyboardTimeout);
	        keyboardTimeout = null;
	    }
	    keyboardTimeout = setTimeout(function(){
	        if ($.customSearchBar.value == "") {
	            searchText = "";
	            scrolling = false;
	            $.customSearchBar.hintText = " (Name), (Equipment), (Part), (Cabin/FLT Deck Log), (Subject)";
	            $.clearTextBtn.visible = false;
	            if(OS_IOS){ Alloy.Globals.activityIndicator.show(); }
	            else { $.anActIndicatorView.show(); }
	            setTimeout(function() {
	                initialHeaderSection();
	                viewListTable();
	                if(OS_IOS){ Alloy.Globals.activityIndicator.hide(); }
	                else { $.anActIndicatorView.hide(); }
	            }, 20);
	        } else {
	            searchText = $.customSearchBar.value;
	            scrolling = false;
	            initialHeaderSection();
	            viewListTable();
	            $.clearTextBtn.visible = true;
	        }
	    }, 500);        
	});
}

$.clearTextBtn.addEventListener("click", function(e) {
    $.customSearchBar.value = "";
    searchText = "";
    scrolling = false;
    $.customSearchBar.hintText = " (Name), (Equipment), (Part), (Cabin/FLT Deck Log), (Subject)";
    $.clearTextBtn.visible = false;
    if(OS_IOS){ Alloy.Globals.activityIndicator.show(); }
    else { $.anActIndicatorView.show(); }
    setTimeout(function() {
        initialHeaderSection();
        viewListTable();
        if(OS_IOS){ Alloy.Globals.activityIndicator.hide(); }
        else { $.anActIndicatorView.hide(); }
    }, 20);
});

//* Number of Draft & Submitted Incidents
function viewQuantityOfDraftAndSubmittedIncident() {
    var draftAndSubmittedCount = query.countDraftSubmittedIncident(currentFlightId);
    var draftIncidentQty = draftAndSubmittedCount.draft;
    var submittedIncidentQty = draftAndSubmittedCount.submitted;
    var historyIncidentQty = draftAndSubmittedCount.history;
    $.draftIncidentNumber.text = draftIncidentQty.toString();
    $.submittedIncidentNumber.text = submittedIncidentQty.toString();
    $.historyIncidentNumber.text = historyIncidentQty.toString();
}

//* Submit and Cancel Button on Bottom Panel
function checkMultiSelection() {
    for (var i = 0; i < draftIncidentList.length; i++) {
        if (draftIncidentList[i].isSelected) {
            enabledBottomButtonFlag = true;
            break;
        } else {
            enabledBottomButtonFlag = false;
        }
    }
    enalbleDisableButton();
}

function submitIncidents() {
    _submitIncidentPromptView = new Alloy.createController("common/alertPrompt", {
        title : "Confirm",
        message : "Do you want to submit ?",
        okText : "Yes",
        cancelText : "No",
        onOk : function() {
            if(OS_IOS){ Alloy.Globals.activityIndicator.show(); }
            else { $.anActIndicatorView.show(); }
            setTimeout(function() {
                for (var i = 0; i < draftIncidentList.length; i++) {
                    if (draftIncidentList[i].category == AC_MAINTENANCE) {
                        if (draftIncidentList[i].isSelected && (!utility.isEmpty(draftIncidentList[i].sequenceNumber))) {
                            draftIncidentList[i].isSubmitted = true;
                            draftIncidentList[i].isSelected = false;
                            query.submitIncident(draftIncidentList[i].id);
                        }
                    } else {
                        if (draftIncidentList[i].isSelected) {
                            draftIncidentList[i].isSubmitted = true;
                            draftIncidentList[i].isSelected = false;
                            query.submitIncident(draftIncidentList[i].id);
                        }
                    }
                }
                initialHeaderSection();
                viewListTable();
                enabledBottomButtonFlag = false;
                enalbleDisableButton();
                if(OS_IOS){ Alloy.Globals.activityIndicator.hide(); }
                else { $.anActIndicatorView.hide(); }
            }, 20);
        }
    }).getView();
    _submitIncidentPromptView.open();
}

function cancelSelectedIncidents() {
    if(OS_IOS){ Alloy.Globals.activityIndicator.show(); }
    else { $.anActIndicatorView.show(); }
    setTimeout(function() {
        initialHeaderSection();
        viewListTable();
        enabledBottomButtonFlag = false;
        enalbleDisableButton();
    }, 20);
}

$.submitBtn.addEventListener('click', function(e) {
    if (enabledBottomButtonFlag) {
        submitIncidents();
    }
});

$.cancelBtn.addEventListener('click', function(e) {
    if (enabledBottomButtonFlag) {
        cancelSelectedIncidents();
    }
});

function enalbleDisableButton() {
    if (enabledBottomButtonFlag) {
        $.submitBtn.backgroundImage = "/images/btn_submit_active.png";
        $.cancelBtn.backgroundImage = "/images/btn_cancel_active.png";
    } else {
        $.submitBtn.backgroundImage = "/images/btn_submit_inactive.png";
        $.cancelBtn.backgroundImage = "/images/btn_cancel_inactive.png";
    }
}

function initialHeaderSection () {
    clearAndQuery();

    headerData1 = [];
    headerData2 = [];
    headerData3 = [];

    var headerRow1 = $.UI.create("TableViewRow", {
        selectedColor : 'transparent',
        backgroundImage : bgHeaderSection,
        height : 35,
        width : "100%",
        touchEnabled : false,
        hasChild : false
    });

    var headerLabel1 = $.UI.create("Label", {
        text : "Draft",
        height : 20,
        top : 7,
        left : 15,
        font : {
            fontWeight : "bold",
            fontSize : Alloy.Globals.d_20pt
        },
        color : colorTextTitle
    });
    
    if(OS_ANDROID)
    {
    	headerLabel1.height = 25;
    }
    
    headerRow1.add(headerLabel1);
    headerData1.push(headerRow1);

    var headerRow2 = $.UI.create("TableViewRow", {
        selectedColor : 'transparent',
        backgroundImage : bgHeaderSection,
        height : 35,
        width : "100%",
        touchEnabled : false,
        hasChild : false
    });

    var headerLabel2 = $.UI.create("Label", {
        text : "Submitted",
        height : 20,
        top : 7,
        left : 15,
        font : {
            fontWeight : "bold",
            fontSize : Alloy.Globals.d_20pt
        },
        color : colorTextTitle
    });
    
    if(OS_ANDROID)
    {
    	headerLabel2.height = 25;
//    	headerLabel2.font.fontSize = utility.dpiConverter(20);
    }
    
    
    headerRow2.add(headerLabel2);
    headerData2.push(headerRow2);

    var headerRow3 = $.UI.create("TableViewRow", {
        selectedColor : 'transparent',
        backgroundImage : bgHeaderSection,
        height : 35,
        width : "100%",
        touchEnabled : false,
        hasChild : false
    });

    var headerLabel3 = $.UI.create("Label", {
        text : "History",
        height : 20,
        top : 7,
        left : 15,
        font : {
            fontWeight : "bold",
            fontSize : Alloy.Globals.d_20pt
        },
        color : colorTextTitle
    });
    
    if(OS_ANDROID)
    {
    	headerLabel3.height = 25;
//    	headerLabel3.font.fontSize = utility.dpiConverter(20);
    }
    
    headerRow3.add(headerLabel3);
    headerData3.push(headerRow3);    
}

function initialization() {
    $.allBtn.backgroundColor = colorSelectedBtnHighlight;
    $.passengerBtn.backgroundColor = "transparent";
    $.serviceEquipmentBtn.backgroundColor = "transparent";
    $.safetyEquipmentBtn.backgroundColor = "transparent";
    $.aircraftMaintenanceBtn.backgroundColor = "transparent";
    $.otherBtn.backgroundColor = "transparent";
    $.emergencyBtn.backgroundColor = "transparent";
    
    initialHeaderSection();
    filterStatus = ALL;
    windowWidth = $.incidentListView.toImage().width;        
    viewListTable();
    enabledBottomButtonFlag = false;
    enalbleDisableButton();
    $.clearTextBtn.visible = false;
}

function lazyload(_evt) {
    
    if (OS_IOS) {
        
        if (!scrolling) {
            scrolling = true;
            $.customSearchBar.blur();
        }
        
        if ((currentSize - overlap) < (_evt.contentOffset.y + initialTableSize)) {
            loadData();
            
        }
    } else {
        if (_evt.firstVisibleItem + _evt.visibleItemCount == _evt.totalItemCount) {
            loadData();
            
        }
    }
}

function loadData() {
    if (!isLoading && hasMoreData) {
        isLoading = true;
        if(OS_IOS){
        	Alloy.Globals.activityIndicatorLazyLoading.show();
        }
        if(OS_ANDROID)
        {
        	$.anActIndicatorView.show();
        }
        setTimeout(function(){
            viewListTable();
            if(OS_IOS){
            	Alloy.Globals.activityIndicatorLazyLoading.hide();
            }
            if(OS_ANDROID)
        	{
        		$.anActIndicatorView.hide();
        	}
            isLoading = false;
        }, 300);
    }
}

function clearAndQuery() {
    $.incidentListTableView.setData([]);
    offset = 0;
    hasMoreData = true;
    currentSize = 105;
    draftIncidentList = [];
    draftIncidentIndex = 0;

}

//**********************************************
//* Main
//**********************************************
$.incidentListWindow.backgroundImage = bgGeneral;
$.incidentListTableView.selectionStyle = "none";
$.incidentListWindow.touchEnabled = false;

$.incidentListWindow.addEventListener('postlayout', function() {
    if(!isPostedLayout){
    	Ti.API.info('post layout');
    	if(OS_ANDROID){
			$.anActIndicatorView.show();
			isSearch = false;
		}
	    setTimeout(function() {
	    	initialization();
		    if(OS_IOS){ Alloy.Globals.activityIndicator.hide(); }
		    else if(OS_ANDROID){
				$.anActIndicatorView.hide();
			}
	        $.incidentListWindow.touchEnabled = true;
	    }, 300);
	   	isPostedLayout = true;
   }
});

$.incidentListWindow.addEventListener('focus', function(e) {
    if (incidentListIsRefresh) {
        if(OS_IOS){ Alloy.Globals.activityIndicator.show(); }
        else { 
        	$.anActIndicatorView.show(); 
        	isSearch = false;
        }
        incidentListIsRefresh = 0;
        incidentPassengerIsRefresh = 0;
        incidentSeatDetailIsRefresh = 0;
        setTimeout(function() {
            initialization();
        }, 50);
    } else {
        if(isTablePostedLayout){
        	if(!isFocus){
        		$.anActIndicatorView.hide();
        		isFocus = true;
        	}
    	}
    }
});

$.incidentListTableView.addEventListener('postlayout', function(){	
    if(!isTablePostedLayout) {
    	if(OS_ANDROID){
    		isSearch = false;
    	}
        initialTableSize = $.incidentListTableView.rect.height + 105; 
        isTablePostedLayout = true;      
    }
});


$.incidentListTableView.addEventListener("scroll", lazyload);

if(OS_ANDROID){
	$.customSearchBar.addEventListener('click', function(e) {
		isSearch = true;
	});
	
	$.customSearchBar.addEventListener('change', function(e) {
		if(keyboardTimeout) {
	        clearTimeout(keyboardTimeout);
	        keyboardTimeout = null;
	    }
	    keyboardTimeout = setTimeout(function(){
	        if ($.customSearchBar.value == "") {
	            searchText = "";
	            scrolling = false;
	            $.customSearchBar.hintText = " (Name), (Equipment), (Part), (Cabin/FLT Deck Log), (Subject)";
	            $.clearTextBtn.visible = false;
	            if(isSearch){ $.anActIndicatorView.show(); }
	            setTimeout(function() {
	                initialHeaderSection();
	                viewListTable();
	                if(isSearch){ $.anActIndicatorView.hide(); }
	            }, 20);
	        } else {
	            searchText = $.customSearchBar.value;
	            scrolling = false;
	            initialHeaderSection();
	            viewListTable();
	            $.clearTextBtn.visible = true;
	            $.anActIndicatorView.hide();
	        }
	    }, 500);
	});
	
	$.incidentListWindow.addEventListener('android:back', function(e) {
		$.incidentListTableView.removeAllChildren();
		$.incidentListTableView = null;
		$.menuIncidentView.removeAllChildren();
		$.menuIncidentView = null;
		$.incidentListWindow.removeAllChildren();
		$.incidentListWindow.close();	
	});
}

//**********************************************
//* End Main
//**********************************************

