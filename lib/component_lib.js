var query = require('query_lib');
var utility = require('utility_lib');
 // @All Status of LOPA Seat :
 // 1. Occupied
 // 2. Available
 // 3. Block
 // 4. Malfunction
 // 5. Occupied + Gold
 // 6. Occupied + Platinum
 // 7. Block + Gold
 // 8. Block + Platinum
 // 9. Malfunction + Gold
 // 10. Malfunction + Platinum
 // 11. Malfunction + Occupied
 // 12. Block + Occupied
 // 13. Passenger Block
  exports.changeNewSeatStatusOfLopaPosition = function (oldStatusArg, paxRopTierArg) {
     var newStatus = "1";//oldStatusArg;
     if(paxRopTierArg != null) {
         switch (oldStatusArg) {
             case "1" : switch (paxRopTierArg.toLowerCase()) {
                            case "basic" : newStatus = "1";
                                break;
                            case "silver" : newStatus = "1";
                                break;
                            case "platinum" : newStatus = "6";
                                break;
                            case "gold" : newStatus = "5";
                                break;
                            }
                 break;
             case "2" : switch (paxRopTierArg.toLowerCase()) {
                            case "basic" : newStatus = "1";
                                break;
                            case "silver" : newStatus = "1";
                                break;
                            case "platinum" : newStatus = "6";
                                break;
                            case "gold" : newStatus = "5";
                                break;
                            default : newStatus = "1";
                                break;
                            }
                 break;
             case "3" : switch (paxRopTierArg.toLowerCase()) {
                            case "basic" : newStatus = "12";
                                break;
                            case "silver" : newStatus = "12";
                                break;
                            case "platinum" : newStatus = "8";
                                break;
                            case "gold" : newStatus = "7";
                                break;
                            default : newStatus = "12";
                                break;
                            }
                 break;
             case "4" : switch (paxRopTierArg.toLowerCase()) {
                            case "basic" : newStatus = "11";
                                break;
                            case "silver" : newStatus = "11";
                                break;
                            case "platinum" : newStatus = "10";
                                break;
                            case "gold" : newStatus = "9";
                                break;
                            default : newStatus = "11";
                                break;
                            }
                 break;
         }
         
     }
     
     return newStatus;
 };

 exports.changeOldSeatStatusOfLopaPosition = function (oldStatusArg) {
     var newStatus = "2"; // oldStatusArg;
     switch (oldStatusArg) {
         case "1" : newStatus = "2";
             break;
         case "5" : newStatus = "2";
             break;
         case "6" : newStatus = "2";
             break;
         case "7" : newStatus = "3";
             break;
         case "8" : newStatus = "3";
             break;
         case "9" : newStatus = "4";
             break;
         case "10" : newStatus = "4";
             break;
         case "11" : newStatus = "4";
             break;
         case "12" : newStatus = "3";
             break;
     }
     
     return newStatus;
 };

exports.updateChangeOrUpgradeSeatClassOfPassengerAndLOPA = function (seatDataArg, paxDataArg) {
    
    var upgradeSeatForPassengerData = {
        currentSeat : seatDataArg.fromSeat != null ? seatDataArg.fromSeat : "",
        currentClass : seatDataArg.fromClass != null ? seatDataArg.fromClass : "",
        newSeat : seatDataArg.toSeat != null ? seatDataArg.toSeat : "",
        newClass : seatDataArg.toClass != null ? seatDataArg.toClass : "",
        paxId : paxDataArg != null ? paxDataArg.paxId : "",
        accountId : paxDataArg != null ? paxDataArg.accountId : "",
        paxKey : paxDataArg != null ? paxDataArg.paxKey : ""                   
    };
    
    if(paxDataArg != null) {
        var ropDetail = query.getRop(paxDataArg.paxId);            
    }

    var dataForOldSeat = {
        newStatus : exports.changeOldSeatStatusOfLopaPosition(query.getLOPAPositionStatus(seatDataArg.fromSeat)),
        hasPax : false,
        position : seatDataArg.fromSeat,                      
        paxId : paxDataArg != null ? paxDataArg.paxId : "",
        accountId : paxDataArg != null ? paxDataArg.accountId : "",
        paxKey : paxDataArg != null ? paxDataArg.paxKey : ""                   
    };
    
    query.updateSeatStatusOnLOPA(dataForOldSeat);

    var dataForNewSeat = {
        newStatus : exports.changeNewSeatStatusOfLopaPosition(query.getLOPAPositionStatus(seatDataArg.toSeat), ropDetail.ropTier),
        hasPax : true,
        position : seatDataArg.toSeat,                      
        paxId : paxDataArg != null ? paxDataArg.paxId : "",
        accountId : paxDataArg != null ? paxDataArg.accountId : "",
        paxKey : paxDataArg != null ? paxDataArg.paxKey : ""                   
    };
    
    query.updateSeatStatusOnLOPA(dataForNewSeat);

    query.updatePassengerSeatClass(upgradeSeatForPassengerData);  
};

exports.incidentCategoryArray = function(i) {
    var data = ["other", "passenger", "service", "safety", "maintenance", "other", "emergency"];
    return data[i];

};

exports.incidentCategoryData = function() {
    var data = [[PASSENGER, "Passenger", "/images/ic_passenger.png"], 
                [SERVICE_EQUIPMENT, "In-Flight Service Equipment & Incident", "/images/ic_service.png"], 
                [SAFETY_EQUIPMENT, "Safety Equipment", "/images/ic_safety.png"], 
                [AC_MAINTENANCE, "Cabin Defect (Cabin Log/ FLT Deck Log)", "/images/ic_maintenance.png"], 
                [OTHER, "Other (Inspection, Unruly, Delay, ETC...)", "/images/ic_other.png"], 
                [EMERGENCY, "Emergency Report", "/images/ic_emergency.png"]];
    return data;
};

exports.incidentReportTypeData = function() {
    var data = [["complaint", "Complaint"], 
                ["commendation", "Commendation"], 
                ["suggestion", "Suggestion"], 
                ["information", "Information"]];
    return data;
};

exports.cameraMenuData = function() {
    var data = [[1, "Take a Photo"], 
                [2, "Select Image"], 
                [3, "View Image"], 
                [4, "Video Recorder"] , 
                [5, "Select Video"] , 
                [6, "Play Video"]];
    return data;
};

exports.createLabel = function(btnName, leftAlign, textColorArg) {
    var label = Ti.UI.createLabel({
        text : btnName,
        //color : textColorArg!=null?textColorArg:"#007AFF",
        color : textColorArg!=null?textColorArg:"#007AFF",
        font : {
            fontSize : utility.dpiConverter(20),
            fontWeight : 'bold'
        },
        left : leftAlign,
        //        top : "40%"
    });
    return label;
};

exports.createIcon = function(imgPathName, leftAlign) {
    var icon = Ti.UI.createImageView({
        image : imgPathName,
        left : leftAlign,
        height : 35,
        width : 35,
        //        top : 15
    });
    return icon;
};

exports.createHasChild = function(imgPathName, leftAlign) {
    var icon = Ti.UI.createImageView({
        image : imgPathName,
        left : leftAlign,
        height : 15,
        width : 15,
        //        top : 15
    });
    return icon;
};

exports.createLabelTitle = function(name, fontColor, leftAlign, topAlign, size, widthArg) {
    var label = Ti.UI.createLabel({
        text : name,
        left : leftAlign,
        top : topAlign,
        height : utility.dpiConverter(size == null ? 18 : size) ,
        width : widthArg,
        font : {
//            fontWeight : "bold",
            fontSize : utility.dpiConverter(size == null ? 18 : size)
        },
        color : fontColor
    });
    return label;
};


exports.createLabelValue = function(name, fontColor, leftAlign, topAlign, size, widthArg) {
    var label = Ti.UI.createLabel({
        text : name,
        left : leftAlign,
        top : topAlign,
        height : size == null ? 20 : size,//utility.dpiConverter(size == null ? 18 : size),
        width : widthArg,
        font : {
            fontWeight : "bold",
            fontSize : utility.dpiConverter(size == null ? 18 : size)
        },
        color : fontColor
    });
    return label;
};

exports.createLabelValue1 = function(name, fontColor, leftAlign, topAlign, size, widthArg) {
    var label = Ti.UI.createLabel({
        text : name,
        left : leftAlign,
        top : topAlign,
        height : 'auto',//size == null ? 18 : size,
        width : widthArg,
        font : {
            fontWeight : "bold",
            fontSize : utility.dpiConverter(size == null ? 18 : size)
        },
        color : fontColor
    });
    return label;
};


exports.createLabelFieldName = function(name, fontColor, leftAlign, topAlign) {
    var label = Ti.UI.createLabel({
        text : name,
        left : leftAlign,
        top : topAlign,
        height : 18,
        font : {
            //            fontWeight : "bold",
            fontSize : utility.dpiConverter(18)
        },
        color : fontColor
    });
    return label;
};

exports.createIcon1 = function(imgPathName, leftAlign, imgWidth, imgHeight, iconId) {
    var icon = Ti.UI.createImageView({
        image : imgPathName,
        left : leftAlign,
        height : imgHeight,
        width : imgWidth,
        id : iconId
        //        top : 15
    });
    // if(OS_ANDROID) {
    	// icon.top = 1;
    // }
    return icon;
};

exports.createImgBtn = function(imgPathName, leftAlign, rightAlign, topAlign, imgWidth, imgHeight, iconId) {
    var icon = Ti.UI.createImageView({
        image : imgPathName,
        top : topAlign,
        left : leftAlign,
        right : rightAlign,
        height : imgHeight,
        width : imgWidth,
        id : iconId
        //        top : 15
    });
    return icon;
};

exports.createTextFieldBox = function(alignTop, alignBottom, alignLeft, boxWidth, textAlign, textColor, textValue, textHorizontalAlign) {
    var textField = Ti.UI.createTextField({
        //        borderStyle : Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        borderRadius : 5,
        borderWidth : 1,
        borderColor : "#7B549C",
        color : '#336699',
        top : alignTop,
        bottom : alignBottom,
        left : alignLeft,
        width : boxWidth,
        backgroundColor : "#26000000",
        color : textColor,
        verticalAlign : textAlign,
        textAlign : textHorizontalAlign,
        value : textValue,
        font : {
            fontWeight : "bold",
            fontSize : utility.dpiConverter(18)
        },

    });
    return textField;
};

exports.createOptionDialogBtn = function(btnId, dataNumber, nameArg, rowHeightArg) {
    var rowHeight = Math.floor(100 / dataNumber);
    var rowHeightStr = rowHeight + "%";

    if(OS_ANDROID) {
        if(dataNumber == 2) {
            rowHeightStr = 123;         
        } else if (dataNumber == 3 || dataNumber == 4 || dataNumber == 5) {
            if(dataNumber == 4 && rowHeightArg != null) {
                rowHeightStr = rowHeightArg;                      
            } else {
                rowHeightStr = 82;                                      
            }
        } else if (dataNumber == 6) {
            rowHeightStr = 67;                      
        } else if(rowHeightArg != null) {
            rowHeightStr = rowHeightArg;
        } else {
            rowHeightStr = 0;
        }
    } 

    var row = Ti.UI.createTableViewRow({
        className : 'row',
        idType : "btnRow",
        height : rowHeightStr,
        width : "100%",
        touchEnable : true,
        hasChild : 'false',
        id : btnId,
        name : nameArg
    });
        
    rowHeight = null;
    btnId = null;
    return row;
};

exports.createOptionDialogWindow = function(data, topAlign, titleText) {
    var optionDialogWin = Ti.UI.createWindow({
    	
        fullscreen : false,
        backgroundColor : '#40000000',
    });
    
	if(OS_ANDROID)
	{
		optionDialogWin.title = titleText;
		optionDialogWin.theme = 'Theme.NoActionBar';
		
	}
	
    var view = Ti.UI.createView({
        top : topAlign,
        bottom : "1%",
        left : "10%",
        right : "10%",
        borderRadius : 20,
        backgroundColor : 'white',
        layout : "vertical"
    });

    var tableData = data;

    var tableView = Ti.UI.createTableView({
        height : "100%",
        width : "100%",
        data : tableData,
        
    });
    
    if(OS_ANDROID)
    {
    	tableView.separatorColor = "grey";	
    }
	
    view.add(tableView);

    optionDialogWin.add(view);
    data = null;
    tableData = null;
    view = null;

    return optionDialogWin;
};

exports.createFullScreenImageWindow = function(imgPath) {
    var optionDialogWin = Ti.UI.createWindow({
        fullscreen : false,
        backgroundColor : '#40000000',
    });
    var view = Ti.UI.createView({
        top : "15%",
        bottom : "15%",
        left : "5%",
        right : "5%",
        borderRadius : 10,
        backgroundColor : 'white',
        layout : "vertical"
    });
    
    var imageView = Ti.UI.createImageView({
        image : imgPath,
    });
    
    if(OS_ANDROID) {
        var rowHeight = 610;
    } else {
        var rowHeight = "100%";        
    }

    var row = Ti.UI.createTableViewRow({
        height : rowHeight,
        width : "100%",
        touchEnable : true,
        hasChild : 'false',
        separatorStyle : "none"
    });
    
    row.add(imageView);

    tableData = [];
    tableData.push(row);
    var tableView = Ti.UI.createTableView({
        height : "100%",
        width : "100%",
        selectionStyle : false,
        scrollable : false,
        data : tableData
    });
 
    view.add(tableView);

    optionDialogWin.add(view);
    img = null;
    imageView = null;
    view = null;

    return optionDialogWin;
};

exports.createMenuBar = function(data, selectionStyleArg, winHeight) {
    var tableData = [];
    tableData.push(data);
    if (selectionStyleArg == 0) {
        selectionStyleArg = "none";
    } else {
        selectionStyleArg = 1;
    }
	if(OS_ANDROID) {
		var tableHeight = winHeight;
		
	} else {
		var tableHeight = "100%";
	}
	
    var table = Ti.UI.createTableView({
        backgroundColor : 'transparent',
        separatorStyle : 'none',
        //        separatorColor : "transparent",
        selectionStyle : selectionStyleArg,
        scrollable : false,
        left : 2,
        right : 2,
        top : 2,
        bottom : 2,
        data : tableData
    });

    tableData = null;

    var view = Ti.UI.createView({
        backgroundColor : 'transparent',
        layout : "vertical",
        height : tableHeight == null ? "100%" : tableHeight,
        width : "100%"
    });
    view.add(table);

    return view;

};

exports.createMenuBarNameIcon = function(menuHeader, name, fontColor, imgPathName, btnIdArg, hasChildArg, needBgImage, rowHeight, bgImage) {
    var btnId = btnIdArg;

    var name = Ti.UI.createLabel({
        text : menuHeader + " " + name,
        left : "3%",
        height : 18,
        //       classes : 'fontBold20',

        font : {
            //           fontWeight : "bold",
            fontSize : utility.dpiConverter(18)
        },
        color : fontColor
    });
    
    if(OS_ANDROID) {
    	var tableRowHeight = rowHeight;
    } else {
    	var tableRowHeight = "100%";    	
    }

    var row = Ti.UI.createTableViewRow({
        className : 'row',
        idType : "btnRow",
        id : btnIdArg,
        backgroundImage : needBgImage == true ? bgHeaderSection : null,
        selectedColor : 'transparent',
        backgroundColor : 'transparent',
        hasChild : (imgPathName == null && hasChildArg == true) ? true : false,
        height : tableRowHeight != null ? tableRowHeight : "100%",
        backgroundSelectedColor : '#666',
        //       touchEnabled : true
    });

    row.add(name);

    if (imgPathName != null) {
        var icon = Ti.UI.createImageView({
            image : imgPathName,
            right : "15",
            height : 15,
            widht : 15
        });
        row.add(icon);
    }
    return row;
};

exports.createPassengerRowDetail = function(bgImage, rowHeight, hasChild) {
    
    if(OS_ANDROID) {
    	var tableRowHeight = rowHeight;
    } else {
    	var tableRowHeight = "100%";    	
    }

    var row = Ti.UI.createTableViewRow({
        idType : "btnRow",
        backgroundImage : bgImage,
        selectedColor : 'transparent',
        backgroundColor : 'transparent',
        hasChild : false,
        height : tableRowHeight != null ? tableRowHeight : "100%",
        backgroundSelectedColor : '#666',
    });

	if(hasChild) {
	    var icon = Ti.UI.createImageView({
	        image : "/images/ic_arrow_right.png",
	        right : "15",
	        height : 15,
	        widht : 15
	    });
	    
	    row.add(icon);		
	}

    return row;
};

//*****************************************************
exports.createLabel1 = function(textTitle, leftAlign, topAlign) {
    var label = Ti.UI.createLabel({
        text : textTitle,
        color : colorTextTitle,
        font : {
            fontSize : utility.dpiConverter(18),
            fontWeight : 'bold'
        },
        left : leftAlign,
        top : topAlign
    });
    return label;
};

exports.createMenuBarNameIcon1 = function(menuHeader, name, fontColor, imgPathName, btnIdArg, hasChildArg, needBgImage, leftAlign) {
    var btnId = btnIdArg;

    var name = Ti.UI.createLabel({
        text : menuHeader + " " + name,
        left : leftAlign,
        height : 18,
        //       classes : 'fontBold20',

        font : {
            fontWeight : "bold",
            fontSize : utility.dpiConverter(18)
        },
        color : fontColor
    });
    
    if(OS_ANDROID) {
	    var rowHeight = 65;    	
    } else {
	    var rowHeight = "100%";    	    	
    }

    var row = Ti.UI.createTableViewRow({
        className : 'row',
        idType : "btnRow",
        id : btnIdArg,
        backgroundImage : needBgImage == true ? bgHeaderSection : null,
        selectedColor : 'transparent',
        backgroundColor : 'transparent',
        hasChild : (imgPathName == null && hasChildArg == true) ? true : false,
        width : "100%",
        height : rowHeight,
        backgroundSelectedColor : '#666',
        //       touchEnabled : true
    });

    row.add(name);

    if (imgPathName != null) {
        var icon = Ti.UI.createImageView({
            image : imgPathName,
            right : "15",
            height : 30,
            widht : 30
        });
        row.add(icon);
    }
    return row;
};

exports.createMenuBar1 = function(data, selectionStyleArg, viewHeight) {
    var tableData = [];
    tableData.push(data);
    if (selectionStyleArg == 0) {
        selectionStyleArg = "none";
    } else {
        selectionStyleArg = 1;
    }

    var table = Ti.UI.createTableView({
        backgroundColor : 'transparent',
        separatorStyle : 'none',
        //        separatorColor : "transparent",
        selectionStyle : selectionStyleArg,
        scrollable : false,
        left : 2,
        right : 2,
        top : 2,
        bottom : 2,
        // height : "100%",
        // width : "100%",
        data : tableData
    });

    tableData = null;

    var view = Ti.UI.createView({
        backgroundColor : 'transparent',
        layout : "vertical",
        height : viewHeight,
        width : "100%"
    });
    view.add(table);

    return view;

};

exports.createTextFieldBox1 = function(alignTop, alignLeft, boxWidth, boxheight, textAlign, textColor, textValue, textHorizontalAlign) {
    var textField = Ti.UI.createTextField({
        borderRadius : 5,
        borderWidth : 1,
        borderColor : "#7B549C",
        color : '#336699',
        top : alignTop,
        //        bottom : alignBottom,
        height : boxheight,
        left : alignLeft,
        width : boxWidth,
        backgroundColor : "#26000000",
        color : colorTextTitle,
        verticalAlign : textAlign,
        textAlign : textHorizontalAlign,
        value : textValue,
        font : {
            fontWeight : "bold",
            fontSize : utility.dpiConverter(18)
        },

    });
    return textField;
};

//*************************************
exports.createBtn = function(imgPathName, btnName, fontColor) {
    var btnId;

    var icon = Ti.UI.createImageView({
        image : imgPathName,
        left : "25%",
        height : 35,
        widht : 35
    });

    var name = Ti.UI.createLabel({
        text : btnName,
        left : "45%",
        height : 17,
        //       verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
        font : {
            fontWeight : "bold",
            fontSize : utility.dpiConverter(17)
        },
        color : fontColor
    });

    var row = Ti.UI.createTableViewRow({
        className : 'row',
        //        idType : btnName,
        selectedColor : 'transparent',
        backgroundColor : 'white',
        scrollable : "true",
        hasChild : 'false',
        height : "100%",
        backgroundSelectedColor : '#666',
        //       touchEnabled : true
    });

    row.add(icon);
    row.add(name);
    return row;
};

exports.createBtnNoIcon = function(btnName, fontColor) {
    var btnId;

    var name = Ti.UI.createLabel({
        text : btnName,
//        left : "45%",
        height : 17,
        //       verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
        font : {
            fontWeight : "bold",
            fontSize : utility.dpiConverter(17)
        },
        color : fontColor
    });

    var row = Ti.UI.createTableViewRow({
        className : 'row',
        //        idType : btnName,
        selectedColor : 'transparent',
        backgroundColor : 'white',
        scrollable : "true",
        hasChild : 'false',
        textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER,
        height : "100%",
        backgroundSelectedColor : '#666',
        //       touchEnabled : true
    });

    row.add(name);
    return row;
};


exports.reportTypeSelection = function(reportTypeArg) {
    var reportTypeText;
    switch (reportTypeArg) {
    case "complaint" :
        {
            reportTypeText = "Complaint";
        }
        break;
    case "commendation" :
        {
            reportTypeText = "Commendation";
        }
        break;
    case "suggestion" :
        {
            reportTypeText = "Suggestion";
        }
        break;
    case "information" :
        {
            reportTypeText = "Information";
        }
        break;
    }
    return reportTypeText;
};

exports.cameraMenu = function(menuArg) {
    var menuText;
    if (menuArg == 1) {
        menuText = "Camera";
    } else if (menuArg == 2) {
        menuText = "Select Image";
    } else if (menuArg == 3) {
        menuText = "Cancel";
    }
    return menuText;
};

exports.incidentCateSeclection = function(incidentCateArg) {
    var incidentCateText="";
    switch (incidentCateArg) {
    case PASSENGER :
        {
            incidentCateText = "Passenger";
        }
        break;
    case SERVICE_EQUIPMENT :
        {
            incidentCateText = "In-Flight Sevice Equipment & Incident";
        }
        break;
    case SAFETY_EQUIPMENT :
        {
            incidentCateText = "Safety Equipment";
        }
        break;
    case AC_MAINTENANCE :
        {
            incidentCateText = "Cabin Defect (Cabin Log / FLT Deck Log)";
        }
        break;
    case OTHER :
        {
            incidentCateText = "Other (Inspection, Unruly, Delay, ETC...)";
        }
        break;
    case EMERGENCY :
        {
            incidentCateText = "Emergency Report";
        }
        break;
    }
    return incidentCateText;
};


exports.alertUnderConstruction = function() {
	/*
	var dialog = Ti.UI.createAlertDialog({
    		message: "Under Construction",
    		ok: 'OK'
  		});
  	dialog.show();
  	*/
  	var alertView = new Alloy.createController("common/alertPrompt", {
			title : "Alert",
			message: "Under Construction",
			okText: "Ok",
			onOk: function() {
					//onViewIncidents();
			},
			disableCancel : true
		}).getView();
		alertView.open();
		alertView = null;
};

exports.alertBtnApp = function() {
	var alertView = new Alloy.createController("common/alertPrompt", {
			title : "Alert",
			message: "Your internet is not available, please check your internet connection",
			okText: "Ok",
			onOk: function() {
					//onViewIncidents();
			},
			disableCancel : true
		}).getView();
		alertView.open();
		alertView = null;
};

