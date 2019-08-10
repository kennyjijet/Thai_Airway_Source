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
var accountId = args.accountId;
var passengerId = args.passengerId;
var paxKey = args.paxKey;
var doFunction = args.doFunction;
var LOPAPositionId = args.LOPAPositionId;
var LOPAPositionType = args.LOPAPositionType;
var isFromLopa = args.isFromLopa;

var createdBy = "";
var seatDetailData;
var passenger;
var currentSeatClass = "";
var newSeatClass = "";
var menuType = 0;
const CAMERA = 1;
const PAYMENT_TYPE = 2;

const ATTACHMENT_SIZE_LIMIT = 4.5 * 1024 * 1024;

var attachment1 = [];
var cameraMenuIndex = 0;

var changeState = 0;

var isAvailableMileBurn = false;

var paymentTypeList = ["Mileage", "Cash", "Credit Card", "Debit Card", "E-Money"];

if(OS_ANDROID)
{
	
	
}

//**********************************************
//* Function
//**********************************************
function initialization() {
    $.amountTextField.keyboardType = Titanium.UI.KEYBOARD_TYPE_PHONE_PAD;
    seatDetailData = query.getIncidentSeatDetail(LOPAPositionId);
    var positionDetail = query.getLOPAPositionDetailByLopaId(LOPAPositionId);
    passenger = query.getPassengerDetailByIdOrAccountIdOrPaxKey(passengerId, accountId, paxKey);
    paymentTypeList = query.getPaymentType();
    paymentCurrencyList = query.getPaymentCurrency();
        
    if(passenger != null) {
        var upgradeCode = query.getUpgradeCode(passenger.upgradeCode);   
        switch(passenger.bookingClass) {
            case "Y" : currentSeatClass = "Economy";
                break;
            case "U" : currentSeatClass = "Premium Economy";
                break;
            case "C": currentSeatClass = "Business";
                break;
            case "F": currentSeatClass = "First";
                break;            
        }
        
    } else {
        var upgradeCode = null;
    }
    
    if(seatDetailData != null) {
        switch(seatDetailData.classSeat) {
            case "Y" : newSeatClass = "Economy";
                break;
            case "U" : newSeatClass = "Premium Economy";
                break;
            case "C": newSeatClass = "Business";
                break;
            case "F": newSeatClass = "First";
                break;            
        }
        
    }
    
    $.currentSeatLabel.text = (passenger.bookingSeat != null ? "Seat No. " + passenger.bookingSeat : "") + "  " + currentSeatClass + " Class";

    $.newSeatLabel.text = (seatDetailData.position != null ? "Seat No. " + seatDetailData.position : "") + "  " + newSeatClass + " Class";
    
    if(upgradeCode != null) {
        $.paymentTypeLabel.text = "Mileage";  
        $.amountTextField.value = upgradeCode.mile != null ? upgradeCode.mile+"" : ""; 
        $.paymentUnitLabel.text = "MILE";  
        isAvailableMileBurn = true; 
    } else {
        $.paymentTypeLabel.text = "Cash";
        $.paymentUnitLabel.color = "white";
        $.paymentUnitLabel.text = "USD";
        $.paymentUnitLabel.color = colorTextValue;
    }
    
    if($.paymentTypeLabel.text == "Mileage") {
        $.attachmentView1.height = "15%";
        $.paymentUnitArrowRight.hide();
        $.paymentUnitLabel.touchEnabled = false;
    } else {
        $.attachmentView1.height = 0;        
        $.paymentUnitArrowRight.show();
        $.paymentUnitLabel.touchEnabled = true;
    }
}

// Option dialog for data selection
function optionDialogWindow(data, topAlign, sideAlign) {	
    var optionDialogWin = Ti.UI.createWindow({
        fullscreen : false,
        backgroundColor : '#40000000',
    });
    
	if(OS_ANDROID) {
		topAlign = "70%";
		optionDialogWin.title = "Upgrade Seat Payment";
		optionDialogWin.theme = 'Theme.NoActionBar';
	}
    
    var view = Ti.UI.createView({
        top : topAlign,
        bottom : "1%",
        left : sideAlign,
        right : sideAlign,
        borderRadius : 20,
        backgroundColor : 'white',
        layout : "vertical"
    });

    var tableView = Ti.UI.createTableView({
        height : "100%",
        width : "100%",
        data : data
    });

    view.add(tableView);

    optionDialogWin.add(view);
    data = null;
    tableData = null;
    view = null;

    return optionDialogWin;
};

function createOptDialogBtn(dataArg, dataNumber, indexArg) {
    var rowHeight = 100 / dataNumber;
    var rowHeightStr = rowHeight.toString() + "%";
    
    if(OS_ANDROID) {
    	if(dataNumber == 2) {
	    	rowHeightStr = 121;    		
    	} else if (dataNumber == 3) {
	    	rowHeightStr = 80;    		    		
    	} else {
    		rowHeightStr = 0;
    	}
    } 

    var row = Ti.UI.createTableViewRow({
        height : rowHeightStr,
        width : "100%",
        touchEnable : true,
        hasChild : 'false',
    });

    var label = Ti.UI.createLabel({
        text : dataArg,
        btnId : indexArg,
        color : "#007AFF",
        font : {
            fontSize : '20',
            fontWeight : 'bold'
        },
        height : "100%",
        width : "100%",
        textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER
    });

    label.addEventListener("click", function(e) {
        switch (menuType) {
            case CAMERA:
                cameraMenuIndex = e.source.btnId;
                break;
            case PAYMENT_TYPE:
                $.paymentTypeLabel.text = e.source.text;
                if(e.source.text == "Mileage") {
                   $.paymentUnitLabel.text = "MILE"; 
                   $.paymentUnitLabel.color = colorTextValue; 
                } else {
                   $.paymentUnitLabel.text = "USD"; 
                   $.paymentUnitLabel.color = colorTextValue;             
                } 
                
                if($.paymentTypeLabel.text == "Mileage") {
                    $.attachmentView1.height = "15%";
                    $.paymentUnitArrowRight.hide();
                    $.paymentUnitLabel.touchEnabled = false;
                } else {
                    $.attachmentView1.height = 0;        
                    $.paymentUnitArrowRight.show();
                    $.paymentUnitLabel.touchEnabled = true;
                }
                
                break;
            }
        
    });

    row.add(label);

    rowHeightStr = null;
    rowHeight = null;

    return row;
}

$.amountTextField.addEventListener("change", function(e) {
	if(OS_IOS) {
	    $.amountTextField.value = utility.checkInputKeyMustBeNumberAndDot($.amountTextField.value);		
	} else {
        if(!this.value){
            return;
        }              
        if(changeState == 0){
            changeState = 1;
            $.amountTextField.setValue(utility.checkInputKeyMustBeNumber(this.value));
        }else{
            if(changeState == 1){
                changeState = 2;
                var len = $.amountTextField.getValue().length;
                $.amountTextField.setSelection(len, len);
            }else{
                changeState = 0;
            }
        }                               
	    
	}
});

$.paymentUnitLabel.addEventListener("click", function(e) {
	var singlePicklistWindow = Alloy.createController("single_picklist", [
        getPaymentCurrencyFormPicklist, 
        paymentCurrencyList,
        "Currency List"
    ]).getView();
    
    if(OS_IOS){
		Alloy.Globals.navGroupWin.openWindow(singlePicklistWindow);
	}else{
		singlePicklistWindow.open();
	}    
});

function getPaymentCurrencyFormPicklist(value) {
    $.paymentUnitLabel.text = value;
    $.paymentUnitLabel.color = colorTextValue;
}

$.paymentTypeView.addEventListener("click", function(e) {
    var tableData = [];
    
    menuType = PAYMENT_TYPE;
    
    paymentTypeList = query.getPaymentType();

    if(!isAvailableMileBurn) {
        paymentTypeList.remove(0);
    }

    for (var i = 0; i < paymentTypeList.length; i++) {
        tableData.push(createOptDialogBtn(paymentTypeList[i], paymentTypeList.length));
    }
    var win2 = optionDialogWindow(tableData, "60%", "20%");
    tableData = null;

    win2.open();
    win2.addEventListener("click", function(e) {
        win2.close();
    });
});

// Camera Function
function resizeImage(oldImage) {
    var oldWidth = oldImage.width;
    var oldHeight = oldImage.height;
    var aspectRatio = oldHeight / oldWidth;
    var limitSize = IMAGE_HIGH_SIZE;

    if (oldHeight > limitSize) {
        var newWidth,
            newHeight;
        if (oldWidth > oldHeight) {
            newWidth = limitSize;
            newHeight = newWidth * aspectRatio;
        } else {
            newHeight = limitSize;
            newWidth = newHeight / aspectRatio;
        }
        var resizedImage = oldImage.imageAsResized(newWidth, newHeight);
    } else {
        newHeight = oldHeight;
        newWidth = oldWidth;
        resizedImage = oldImage;
    }

    $.cameraBtn1.image = resizedImage;
    return resizedImage;
}

function addAttachment(name, detail, type) {

    var attachment = {
        name : name,
        detail : "",
        incidentId : ""
    };

    attachment1.push(attachment);
}

function cameraFunction(menuIndex) {
    if (menuIndex == 1) {// Take photo
        Ti.Media.showCamera({
            success : function(event) {
                var image = event.media;
                if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
                    var image = event.media;
                    var incidentAttachment = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'incidentAttachment');
                    if (!incidentAttachment.exists()) {
                        incidentAttachment.createDirectory();
                    }

                    var filename = "image" + "_" + passenger.paxKey + "_" + utility.getDateTimeForImageName() + '.jpg';
                    var imageFile = Ti.Filesystem.getFile(incidentAttachment.resolve(), filename);
                    var resizeImg = resizeImage(image);

                        if (attachment1 != null && attachment1.length > 0)
                            if (attachment1[0].name.length > 0) {
                                var attachmentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment1[0].name);
                                attachmentFile.deleteFile();
                                attachment1.remove(0);
                            }

                    if (imageFile.write(resizeImg) === false) {
                        // handle write error
                    } else {

                    }
                    addAttachment(filename, "", "photo");
                }
            },
            cancel : function() {
                //getting image from camera was cancelled
            },
            error : function(error) {
                var a = Ti.UI.createAlertDialog({
                    title : 'Camera'
                });
                if (error.code == Ti.Media.NO_CAMERA) {
                    a.setMessage('Device does not have image recording capabilities');
                } else {
                    a.setMessage('Unexpected error: ' + error.code);
                }
                a.show();
            },
            allowImageEditing : true,
            saveToPhotoGallery : true
        });
    } else if (menuIndex == 2) {// Select image
        Ti.Media.openPhotoGallery({
            success : function(event) {
                var image = event.media;
                var incidentAttachment = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'incidentAttachment');
                if (!incidentAttachment.exists()) {
                    incidentAttachment.createDirectory();
                }

                var filename = "image" + "_" + passenger.paxKey + "_" + utility.getDateTimeForImageName() + '.jpg';
                var imageFile = Ti.Filesystem.getFile(incidentAttachment.resolve(), filename);
                var resizeImg = resizeImage(image);

                if (attachment1 != null && attachment1.length > 0)
                    if (attachment1[0].name.length > 0) {
                        var attachmentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment1[0].name);
                        attachmentFile.deleteFile();
                        attachment1.remove(0);
                    }

                if (imageFile.write(resizeImg) === false) {
                } else {

                }

                addAttachment(filename, "", "photo");
            },
            cancel : function() {
            },
            mediaTypes : Ti.Media.MEDIA_TYPE_PHOTO
        });
    } else if (menuIndex == 3) {// View Image
            if (attachment1 != null && attachment1.length > 0 && attachment1 != undefined) {
                fullpath = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment1[0].name;
                viewFullScreenImage(fullpath);
            }
    } 
}

function viewFullScreenImage(imgPath) {
    var win1 = component.createFullScreenImageWindow(imgPath);
    img = null;
    imgHeight = null;
    imgWidth = null;

    win1.open();
    win1.addEventListener("click", function(e) {
        win1.close();
    });
}



// Camera button
$.cameraBtn1.addEventListener('click', function(e) {
    menuType = CAMERA;
    var tableData = [];
    var cameraMenu = ["Take a Photo", "Select Image", "View Image"];

    if ($.cameraBtn1.image) {
    } else {
        cameraMenu.remove(2);
    }

    for (var i = 0; i < cameraMenu.length; i++) {
        tableData.push(createOptDialogBtn(cameraMenu[i], cameraMenu.length, i+1));
    }
    var win2 = optionDialogWindow(tableData, "70%", "20%");
    data = null;
    tableData = null;

    win2.open();
    win2.addEventListener("click", function(e) {
        win2.close();
        cameraFunction(cameraMenuIndex);
        cameraMenuIndex = 0;
    });
});



//* Confirm button
$.confirmBtn.addEventListener('click', function(e) {
    var isSave = true;
    
    if(utility.isEmpty($.paymentTypeLabel.text)) {
        isSave = false;
        var _promptView = new Alloy.createController("common/alertPrompt", {
            title : "Alert",
            message : "Please enter the payment type.",
            okText : "OK",
            disableCancel : true,
            onOk : function() {
            }
        }).getView();
        _promptView.open();                 
    } else if(utility.isEmpty($.amountTextField.value)) {
        isSave = false;
        var _promptView = new Alloy.createController("common/alertPrompt", {
            title : "Alert",
            message : "Please enter payment amount.",
            okText : "OK",
            disableCancel : true,
            onOk : function() {
            }
        }).getView();
        _promptView.open();                 
    } else if(utility.isEmpty($.paymentUnitLabel.text) || $.paymentUnitLabel.text == "Select Currency") {
        isSave = false;
        var _promptView = new Alloy.createController("common/alertPrompt", {
            title : "Alert",
            message : "Please enter the payment currency.",
            okText : "OK",
            disableCancel : true,
            onOk : function() {
            }
        }).getView();
        _promptView.open();                 
    } 
    
    if(!utility.isNumber($.amountTextField.value)) {
        isSave = false;
        var _promptView = new Alloy.createController("common/alertPrompt", {
            title : "Alert",
            message : "Please enter only number type for amount.",
            okText : "OK",
            disableCancel : true,
            onOk : function() {
            }
        }).getView();
        _promptView.open();                         
    }
    
    if(isSave) {
        if(!$.cameraBtn1.image && $.paymentTypeLabel.text == "Mileage") {
            isSave = false;
            var _promptView = new Alloy.createController("common/alertPrompt", {
                title : "Alert",
                message : "Please take a photo of the boading pass.",
                okText : "OK",
                disableCancel : true,
                onOk : function() {
                }
            }).getView();
            _promptView.open();         
        }        
    }
        
    if(isSave) {
            
        var _syncDataPromptView = new Alloy.createController("common/alertPrompt", {
            title : 'Confirm',
            message : 'Do you want to confirm this upgrade?',
            okText : "Yes",
            cancelText : "No",
            onOk : function() {
                var user = query.getUserDetail();
                var createdBy = "";
                if(user != null) {
                    createdBy = user.sfdcId;                
                }
                
                var aircraftRegistration = "";
                var flightNumber = "";
                var sector = "";
                var flightInformation = query.getFlight(currentFlightId);        
                if(flightInformation != null) {
                    aircraftRegistration = flightInformation.aircraftRegistration;
                    flightNumber = flightInformation.flightNumber;
                    sector = flightInformation.departureStation + "-" + flightInformation.arrivalStation;                        
                } 
        
                var createdDate = utility.createDateTimeForSFDC();
                var incidentId = utility.generateGUID();

                var upgradeSeatData = {
                    fromSeat : passenger != null ? passenger.bookingSeat : "",
                    fromClass : passenger != null ? passenger.bookingClass : "",
                    toClass : seatDetailData != null ? seatDetailData.classSeat : "",
                    toSeat : seatDetailData != null ? seatDetailData.position : "",
                    paxKey : passenger != null ? passenger.paxKey : "",
                    accountId : passenger != null ? passenger.accountId : "",
                    passengerId : passenger != null ? passenger.id : "",
                    upgradeCode : passenger != null ? passenger.upgradeCode : "",
                    paymentType : $.paymentTypeLabel.text,
                    paymentCurrency : $.paymentUnitLabel.text != "Select Currency" ? $.paymentUnitLabel.text : "",
                    amount : !utility.isEmpty($.amountTextField.value) ? parseFloat($.amountTextField.value) : 0,
                    detail : "From :   " + "Seat No. " + (passenger.bookingSeat != null ? passenger.bookingSeat : "") + " Class " + (passenger.bookingClass != null ? passenger.bookingClass : "") + "\n" + 
                             "To :     " + "Seat No. " + (seatDetailData.position != null ? seatDetailData.position : "") + " Class " + (seatDetailData.classSeat != null ? seatDetailData.classSeat : "") + "\n" +
                             "Amount : " + $.amountTextField.value + " " + $.paymentUnitLabel.text + "\n" +
                             $.detailTextArea.value,
                    flightId : currentFlightId,
                    createdBy : createdBy,
                    createdDate : createdDate,
                    incidentId : incidentId
                };

                query.insertUpgradeSeatData(upgradeSeatData);
                
                var upgradeSeatForPassengerData = {
                    currentSeat : passenger != null ? passenger.bookingSeat : "",
                    currentClass : passenger != null ? passenger.bookingClass : "",
                    newSeat : upgradeSeatData.toSeat,
                    newClass : upgradeSeatData.toClass,
                    paxId : passenger != null ? passenger.id : "",
                    accountId : passenger != null ? passenger.accountId : "",
                    paxKey : passenger != null ? passenger.paxKey : ""                   
                };
                
                var ropDetail = query.getRop(passenger.memberId);

                var dataForNewSeat = {
                    newStatus : component.changeNewSeatStatusOfLopaPosition(query.getLOPAPositionStatus(upgradeSeatData.toSeat), ropDetail.ropTier),
                    hasPax : true,
                    position : upgradeSeatData.toSeat,                      
                    paxId : passenger.id,
                    accountId : passenger.accountId,
                    paxKey : passenger.paxKey
                };
                
                query.updateSeatStatusOnLOPA(dataForNewSeat);

                var dataForOldSeat = {
                    newStatus : component.changeOldSeatStatusOfLopaPosition(query.getLOPAPositionStatus(passenger.bookingSeat)),
                    hasPax : false,
                    position : passenger.bookingSeat,                      
                    paxId : passenger.id,
                    accountId : passenger.accountId,
                    paxKey : passenger.paxKey
                };
                
                query.updateSeatStatusOnLOPA(dataForOldSeat);

                query.updatePassengerSeatClass(upgradeSeatForPassengerData);
                
                
                var incidentData = {
                    id : incidentId,
                    flightId : currentFlightId,
                    category : PASSENGER,
                    reportType : "Information",
                    emergencyType : null,
                    subject : "Upgrade Seat",
                    equipmentId : "",
                    partId : "",
                    ataChapter : "",
                    condition : "",
                    safetyZone : "",
                    logGroup : 0,
                    sequenceNumber : "",
                    detail : "From :   " + "Seat No. " + (passenger.bookingSeat != null ? passenger.bookingSeat : "") + " Class " + (passenger.bookingClass != null ? passenger.bookingClass : "") + "\n" + 
                             "To :     " + "Seat No. " + (seatDetailData.position != null ? seatDetailData.position : "") + " Class " + (seatDetailData.classSeat != null ? seatDetailData.classSeat : "") + "\n" +
                             "Amount : " + $.amountTextField.value + " " + $.paymentUnitLabel.text + "\n" + 
                             $.detailTextArea.value,
                    createdBy : createdBy,
                    reportedBy : "",
                    createDateTime : createdDate,
                    updateDateTime : createdDate,
                    incidentStatus : CLOSED,
                    isLog : false,
                    isMulti : false,
                    isSubmitted : true,
                    isVoided : false,
                    isSynced : true,
                    acReg : aircraftRegistration,
                    flightNumber : flightNumber,
                    sector : sector,
                    phone : "",
                    email : "",
                    isSkippenPhoneEmail : true,
                    upgradeChangeSeatType : "upgradeSeat"
                };
                                                                       
                query.insertIncident(incidentData);
                
                if(passenger != null) {
                    query.deletePaxGroupMembersByIncidentId(incidentData.id);
                    var passengerArg = {
                        paxId : passenger.id,
                        accountId : passenger.accountId,
                        paxKey : passenger.paxKey,
                        incidentId : incidentData.id,
                        role : "",
                        detail : "",
                        type : PERSON_MASTER
                    };
        
                    query.insertPaxGroupMember(passengerArg);                        
                }
                
                query.deleteAttachmentByIncidentId(incidentId);
                if (attachment1 != null && attachment1.length > 0) {
                    attachment1[0].detail = $.attachmentTextField1.value.length > 0 ? $.attachmentTextField1.value : "";
                    attachment1[0].incidentId = incidentId;
                    query.insertAttachment(attachment1[0]);
                }     

                passengerSeatClassIsRefresh = 1;
                passengerListIsRefresh = 1;
                if(isFromLopa) {
                    lopaIsRefresh = 1;                        
                }
                homeIsRefresh = 1; 
                $.upgradeSeatPaymentWindow.close();
            }
        }).getView();
        _syncDataPromptView.open();
    }    
    
});

//* Cancel button
$.cancelBtn.addEventListener('click', function(e) {
    var _syncDataPromptView = new Alloy.createController("common/alertPrompt", {
        title : 'Confirm',
        message : 'Do you want to discard this upgrade?',
        okText : "Yes",
        cancelText : "No",
        onOk : function() {
            passengerSeatClassIsRefresh = 1;
            $.upgradeSeatPaymentWindow.close();
        }
    }).getView();
    _syncDataPromptView.open();
});


//**********************************************
//* Main
//**********************************************
$.upgradeSeatPaymentWindow.backgroundImage = bgGeneral;
$.upgradeSeatPaymentWindow.touchEnabled = true;
initialization();

if(OS_ANDROID){
	$.upgradeSeatPaymentWindow.addEventListener('android:back', function(e) {
		Ti.API.info("Press Back button");
		$.upgradeSeatPaymentWindow.close();	
	});
	
	$.currentSeatLabel.width = "70%";
	$.newSeatLabel.width = "70%";
	$.paymentUnitLabel.width = "25%";
	$.paymentTypeLabel.width = "65%";
	$.attachmentTextField1.width = "52%";
}


