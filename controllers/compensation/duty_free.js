var args = arguments[0] || {};
var type = args.type;
var irreName = args.irreName;
var passengerId = args.passengerId;
var incId = args.incidentId;
var compIndex = args.compIndex;
var compensationGroup = args.compensationMem;
var isSync = args.isSynced;
var isSubmit = args.isSubmitted;

var model = require('query_lib');
var util = require('utility_lib');
var component = require('component_lib');

// Variable
var incident = null;
var passenger = null;
var paxClass = null;
var flight = null;
var region = null;
var compId = null;
var attachment1 = [];
var textAmount = null;

var canEdit = true;

var cameraMenuIndex = 0;

var changeState = 0;

var isPostedLayout = false;


// Local function
function init() {
    incident = model.getIncidentDetail(incId);
    passenger = model.getPassengerDetail(passengerId);
    flight = model.getFlight(currentFlightId);
    $.itemCodeNoTextField.keyboardType = Ti.UI.KEYBOARD_TYPE_NUMBER_PAD;
    $.unitPriceTextField.keyboardType = Ti.UI.KEYBOARD_TYPE_NUMBER_PAD;

    if (incident != null && incident != undefined) {
        canEdit = !(incident.isSynced || incident.isSubmitted || incident.isVoid);
    }

    if (passenger != null && passenger != undefined) {
        paxClass = passenger.bookingClass;
    }

    if (flight != null && flight != undefined) {
        region = flight.region;
    }

    if (compIndex != null && compensationGroup.length > 0) {
        compensationGlobalTemp = compensationGroup;
        compId = compensationGlobalTemp[compIndex].id;

        $.problemLabel.text = compensationGlobalTemp[compIndex].problem;
        $.iscFormNoTextField.value = compensationGlobalTemp[compIndex].iscFormNumber;
        $.itemCodeNoTextField.value = compensationGlobalTemp[compIndex].codeNumber;
        $.unitPriceTextField.value = compensationGlobalTemp[compIndex].amount;

        textAmount = model.getAmountAndCurrency(COMP_DUTY, compensationGlobalTemp[compIndex].problem, paxClass, region);
        if (textAmount != null) {
            $.upToUnitPriceLabel.text = "[Up to " + textAmount.currency + " " + textAmount.amount + ".-]";
        }

        if (compensationGlobalTemp[compIndex].compAttachment.length > 0) {
            attachment1.push(compensationGlobalTemp[compIndex].compAttachment[0]);
            $.cameraBtn1.image = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "compensationAttachment" + Ti.Filesystem.separator + compensationGlobalTemp[compIndex].compAttachment[0].name;
            $.attachmentTextField1.value = compensationGlobalTemp[compIndex].compAttachment[0].detail;
        }

        $.detailTextArea.value = compensationGlobalTemp[compIndex].detail;

    } else {
        $.problemLabel.text = irreName;
        textAmount = model.getAmountAndCurrency(COMP_DUTY, irreName, paxClass, region);
        if (textAmount != null) {
            $.upToUnitPriceLabel.text = "[Up to " + textAmount.currency + " " + textAmount.amount + ".-]";
        }
        if (compensationGroup.length > 0) {
            compensationGlobalTemp = compensationGroup;            
            compId = util.generateCompensationGUID();
        } else {
            compId = util.generateCompensationGUID();
        }
    }

}

$.cameraBtn1.addEventListener('click', function(e) {
    // menuType = CAMERA;

    var tableData = [];
    var cameraMenu = ["Take a Photo", "Select Image", "View Image"];

    if ($.cameraBtn1.image) {
    } else {
        cameraMenu.remove(2);
    }

    for (var i = 0; i < cameraMenu.length; i++) {
        tableData.push(createOptDialogBtnCamera(cameraMenu[i], cameraMenu.length, i + 1));
    }
    var win2 = optionCameraDialogWindow(tableData, "70%", "20%");
    data = null;
    tableData = null;

    win2.open();
    win2.addEventListener("click", function(e) {
        win2.close();
        cameraFunction(cameraMenuIndex, $.cameraBtn1, compId);
        cameraMenuIndex = 0;
    });
});

function optionCameraDialogWindow(data, topAlign, sideAlign) {
    var optionDialogWin = Ti.UI.createWindow({
        fullscreen : false,
        backgroundColor : '#40000000',
    });
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
}

function createOptDialogBtnCamera(dataArg, rowNum, indexArg) {
    cameraMenuIndex = indexArg;
    var rowHeight = 100 / rowNum;
    var rowHeightStr = rowHeight.toString() + "%";

    if (OS_ANDROID) {
        if (rowNum == 2) {
            rowHeightStr = 122;
        } else if (rowNum == 3) {
            rowHeightStr = 82;
        } else {
            rowHeightStr = 0;
        }
    }

    var row = Ti.UI.createTableViewRow({
        height : rowHeightStr,
        width : "100%",
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
        cameraMenuIndex = e.source.btnId;
    });

    row.add(label);

    rowHeightStr = null;
    rowHeight = null;

    return row;
}

function cameraFunction(menuIndex, cameraObj, compId) {
    if (menuIndex == 1) {// Take photo
        Ti.Media.showCamera({
            success : function(event) {
                Ti.API.info("Test:1");
                var image = event.media;
                if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
                    var image = event.media;
                    var incidentAttachment = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'compensationAttachment');
                    if (!incidentAttachment.exists()) {
                        incidentAttachment.createDirectory();
                    }

                    var filename = "image" + "_" + "df" + "_" + util.getDateTimeForImageName() + '.jpg';
                    var imageFile = Ti.Filesystem.getFile(incidentAttachment.resolve(), filename);
                    var resizeImg = resizeImage(image, cameraObj);

                    if (attachment1.length > 0) {
                        var attachmentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "compensationAttachment" + Ti.Filesystem.separator + attachment1[0].name);
                        attachmentFile.deleteFile();
                    }

                    if (imageFile.write(resizeImg) === false) {
                        // handle write error
                        //                        Ti.API.info("Error writing incident image : " + incidentId);
                    } else {

                    }
                    if (attachment1.length == 0) {
                        addAttachment(filename, "", "photo", compId);
                    } else {
                        attachment1[0].name = filename;
                    }
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
                var incidentAttachment = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'compensationAttachment');
                if (!incidentAttachment.exists()) {
                    incidentAttachment.createDirectory();
                }

                var filename = "image" + "_" + "df" + "_" + util.getDateTimeForImageName() + '.jpg';
                var imageFile = Ti.Filesystem.getFile(incidentAttachment.resolve(), filename);
                var resizeImg = resizeImage(image, cameraObj);

                if (attachment1.length > 0) {
                    var attachmentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "compensationAttachment" + Ti.Filesystem.separator + attachment1[0].name);
                    attachmentFile.deleteFile();
                }

                if (imageFile.write(resizeImg) === false) {
                } else {

                }

                if (attachment1.length == 0) {
                    addAttachment(filename, "", "photo", compId);
                } else {
                    attachment1[0].name = filename;
                }
            },
            cancel : function() {
            },
            mediaTypes : Ti.Media.MEDIA_TYPE_PHOTO
        });
    } else if (menuIndex == 3) {// View Image
        if (attachment1 != null && attachment1.length > 0 && attachment1 != undefined) {
            fullpath = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "compensationAttachment" + Ti.Filesystem.separator + attachment1[0].name;
            viewFullScreenImage(fullpath);
        }
    }
}

function resizeImage(oldImage, cameraObj) {
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

    cameraObj.image = resizedImage;
    return resizedImage;
}

function addAttachment(name, dutyDetail, type, compensationId) {
    var attachment = {
        name : name,
        detail : dutyDetail.value,
        compensationId : compensationId,
        incidentId : incId
    };

    attachment1.push(attachment);
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

$.unitPriceTextField.addEventListener('change', function() {
    if (OS_IOS) {
        $.unitPriceTextField.value = util.checkInputKeyMustBeNumber($.unitPriceTextField.value);
    } else {
        if (!this.value) {
            return;
        }

        if (changeState == 0) {
            changeState = 1;
            $.unitPriceTextField.setValue(util.checkInputKeyMustBeNumber(this.value));
        } else {
            if (changeState == 1) {
                changeState = 2;
                var len = $.unitPriceTextField.getValue().length;
                $.unitPriceTextField.setSelection(len, len);
            } else {
                changeState = 0;
            }
        }

    }
});

$.itemCodeNoTextField.addEventListener('change', function() {
    if (OS_IOS) {
        $.itemCodeNoTextField.value = util.checkInputKeyMustBeNumber($.itemCodeNoTextField.value);
    } else {
        if (!this.value) {
            return;
        }

        if (changeState == 0) {
            changeState = 1;
            $.itemCodeNoTextField.setValue(util.checkInputKeyMustBeNumber(this.value));
        } else {
            if (changeState == 1) {
                changeState = 2;
                var len = $.itemCodeNoTextField.getValue().length;
                $.itemCodeNoTextField.setSelection(len, len);
            } else {
                changeState = 0;
            }
        }

    }
});


$.saveBtn.addEventListener('click', function() {
    var textValue = parseFloat($.unitPriceTextField.value);
    var mandatoryField = "";
    if ($.iscFormNoTextField.value == "") {
        mandatoryField += "ISC Form No.";
    }
    if ($.itemCodeNoTextField.value == "") {
        mandatoryField += "\nCode No.";
    }
    if ($.unitPriceTextField.value == "") {
        mandatoryField += "\nUnit Price";
    }
    if ($.cameraBtn1.image == undefined) {
        mandatoryField += "\nISC Form Image";
    }
    if (mandatoryField.length == 0) {
        if (textValue > parseFloat(textAmount.amount)) {
            var dialog = Alloy.createController("common/alertPrompt", {
                message : "The compensated value is over limit " + textAmount.currency + " " + textAmount.amount + ".-",
                title : 'Alert',
                okText : "OK",
                onOk : function() {
                },
                disableCancel : true
            }).getView();
            dialog.open();
        } else {
            if (util.isNumber($.itemCodeNoTextField.value) && util.isNumber($.unitPriceTextField.value)) {
                var dialog = Alloy.createController("common/alertPrompt", {
                    title : "CONFIRM",
                    message : "Do you want to save?",
                    okText : "Yes",
                    cancelText : "No",
                    onOk : function() {
                        if (compIndex != null) {
                            attachment1[0].detail = $.attachmentTextField1.value;
                            compensationGlobalTemp[compIndex].detail = $.detailTextArea.value;
                            compensationGlobalTemp[compIndex].amount = $.unitPriceTextField.value;
                            compensationGlobalTemp[compIndex].iscFormNumber = $.iscFormNoTextField.value;
                            compensationGlobalTemp[compIndex].codeNumber = $.itemCodeNoTextField.value;
                            compensationGlobalTemp[compIndex].compAttachment = attachment1;
                        } else {
                            attachment1[0].detail = $.attachmentTextField1.value;
                            compensationGlobalTemp.push({
                                detail : $.detailTextArea.value,
                                type : COMP_DUTY,
                                problem : irreName,
                                amount : $.unitPriceTextField.value,
                                incidentId : incId,
                                currency : textAmount.currency,
                                upgradeCer : null,
                                iscFormNumber : $.iscFormNoTextField.value,
                                codeNumber : $.itemCodeNoTextField.value,
                                fromSeat : null,
                                fromClass : null,
                                toSeat : null,
                                toClass : null,
                                compensationId : attachment1[0].compensationId,
                                compAttachment : attachment1
                            });
                        }
                        if (compIndex != null) {
                            compensationRefresh = 1;
                        } else {
                            compensationFlag = 1;
                        }
                        $.dutyFreeWindow.close();
                    }
                }).getView();
                dialog.open();
            } else {
                var dialog = Alloy.createController("common/alertPrompt", {
                    message : "Please enter only number type for Item Code/Unit Price",
                    title : 'Alert',
                    okText : "OK",
                    onOk : function() {
                    },
                    disableCancel : true
                }).getView();
                dialog.open();
            }
        }
    } else {
        var dialog = Alloy.createController("common/alertPrompt", {
            message : mandatoryField,
            title : 'Please enter mandatory field',
            okText : "OK",
            onOk : function() {
            },
            disableCancel : true
        }).getView();
        dialog.open();
    }
});

$.cancelBtn.addEventListener('click', function() {
    $.dutyFreeWindow.close();
});

//***********************************************
//* Main
//***********************************************
init();

if (OS_ANDROID) {
    $.dutyFreeWindow.addEventListener('android:back', function(e) {
        $.dutyFreeWindow.close();
    });

    var softInput = Titanium.UI.Android.SOFT_INPUT_STATE_ALWAYS_HIDDEN | Ti.UI.Android.SOFT_INPUT_ADJUST_PAN;
    $.dutyFreeWindow.windowSoftInputMode = softInput;
//    $.problemLabel.width = "60%";
    $.iscFormNoTextField.width = "65%";
    $.itemCodeNoTextField.width = "65%";
    $.unitPriceTextField.width = "20%";
    $.upToUnitPriceLabel.width = "35%";
    $.attachmentTextField1.width = "50%";
}

$.dutyFreeWindow.addEventListener('postlayout', function(e) {
    if(!isPostedLayout){
        if(OS_IOS) { Alloy.Globals.activityIndicator.hide(); $.anActIndicatorView.hide(); }
        else { $.anActIndicatorView.hide(); }
        isPostedLayout = true;
        init();
    }
});

