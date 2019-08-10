// Arguments passed into this controller can be accessed via the `$.args` object directly or:
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

var attachment1 = [];

var flight = model.getFlight(currentFlightId);

var changeState = 0;

var typeForCondition = type;

var menuItem = null;

function initialView(type, irName, isEdit) {
    var passenger = model.getPassengerDetail(passengerId);
    var paxClass = passenger.bookingClass;
    var dataTable = [];

    var ttMandatory = $.UI.create("Label", {
        classes : ['fontLargeBold'],
        color : "#FF9F33",
        text : "*",
        left : 0,
        width : 10,
        height : "100%"
        
    });

    switch(type) {
    case COMP_MILE:
        //ROP Mileages
        $.compDetail.title = "ROP Mileages";

        var row1 = Ti.UI.createView({
            top : 0,
            height : 70,
            width : "100%",
            layout : "horizontal",
            backgroundImage : "/images/bg_header_section.png"
        });

        var ttIrreType = $.UI.create("Label", {
            classes : ['fontLight18', 'colorWhite'],
            text : "Problem: ",
            left : "5%",
            width : "15%",
            height : "100%"
        });

        var textIrreType = $.UI.create("Label", {
            classes : ['fontBold20', 'colorGold'],
            text : irName,
            left : 0,
            height : "100%"
        });

        row1.add(ttIrreType);
        row1.add(textIrreType);

        var row2 = Ti.UI.createView({
            height : 70,
            width : "100%",
            layout : "horizontal",
            backgroundImage : "/images/bg_header_section.png"
        });

        var ttNumber = $.UI.create("Label", {
            classes : ['fontLight18', 'colorWhite'],
            text : "No. of miles compensated: ",
            left : "5%",
            width : "29%",
            height : "100%"
        });

        if (OS_ANDROID) {
            ttNumber.width = "36%";
        }

        var textFieldNumber = Ti.UI.createTextField({
            backgroundColor : "#26000000",
            borderColor : "#7B549C",
            borderWidth : "1",
            borderRadius : "5",
            color : "#FFCB05",
            paddingLeft : 5,
            hintText : "0",
            hintTextColor : "#A6A6A5",
            keyboardType : Ti.UI.KEYBOARD_TYPE_NUMBER_PAD,
            font : {
                fontSize : "18",
                fontWeight : 'bold'
            },
            left : "2%",
            width : "25%",
            top : "15%",
            bottom : "15%"
        });

        if (OS_ANDROID) {
            textFieldNumber.width = "20%";
        }

        var textAmount = model.getAmountByMileage(COMP_MILE, irName, paxClass, flight.region);
        var textNumber = $.UI.create("Label", {
            classes : ['fontBold20'],
            text : "[Up to " + textAmount + " miles]",
            color : "red",
            left : "1%"
        });

        if (OS_ANDROID) {
            textNumber.right = "5%";
        }

        row2.add(ttNumber);
        row2.add(ttMandatory);
        row2.add(textFieldNumber);
        row2.add(textNumber);

        var row3 = Ti.UI.createView({
            height : 280,
            width : "100%",
            layout : "vertical",
            bottom : 40
        });

        var ttDetail = $.UI.create("Label", {
            classes : ['fontLight18', 'colorWhite'],
            text : "Detail: ",
            left : "5%",
            top : "5%",
            height : "10%"
        });

        var textFieldDetail = Ti.UI.createTextArea({
            backgroundColor : "#26000000",
            borderColor : "#7B549C",
            borderWidth : "2",
            borderRadius : "5",
            color : "#FFCB05",
            font : {
                fontSize : "18",
                fontWeight : 'bold'
            },
            left : "5%",
            top : "3%",
            width : "90%",
            height : "80%"
        });

        if (isEdit) {
            textFieldNumber.value = compensationGlobalTemp[compIndex].amount;
            textFieldDetail.value = compensationGlobalTemp[compIndex].detail;
        }

        row3.add(ttDetail);
        row3.add(textFieldDetail);

        var bodyView = Ti.UI.createView({
            backgroundColor : "transparent",
            height : Ti.UI.SIZE,
            width : "100%",
            layout : "vertical"
        });

        bodyView.add(row1);
        bodyView.add(row2);
        bodyView.add(row3);
        $.mainView.add(bodyView);

        // $.mainView.addEventListener('click', function() {
            // textFieldDetail.blur();
            // textFieldNumber.blur();
        // });

        textFieldNumber.addEventListener('change', function() {
            if (OS_IOS) {
                textFieldNumber.value = util.checkInputKeyMustBeNumber(textFieldNumber.value);
            } else {
                if (!this.value) {
                    return;
                }

                if (changeState == 0) {
                    Titanium.API.warn("Step 1 -> " + this.value);

                    changeState = 1;
                    textFieldNumber.setValue(util.checkInputKeyMustBeNumber(this.value));
                } else {
                    if (changeState == 1) {
                        Titanium.API.warn("Step 2 -> " + this.value);

                        changeState = 2;
                        var len = textFieldNumber.getValue().length;
                        textFieldNumber.setSelection(len, len);
                    } else {
                        Titanium.API.warn("Step 3 -> " + this.value);
                        changeState = 0;
                    }
                }

            }
        });

        $.btnSave.addEventListener('click', function() {
            // var textValue = parseInt($.mainView.children[0].data[0].rows[1].children[1].value);
            var textValue = parseInt(textFieldNumber.value);
            if (textFieldNumber.value != "") {
                if (textValue > textAmount) {
                    var dialog = Alloy.createController("common/alertPrompt", {
                        message : "The compensated value is over limit " + textAmount + " miles.",
                        title : 'Alert',
                        okText : "OK",
                        onOk : function() {
                        },
                        disableCancel : true
                    }).getView();
                    dialog.open();
                } else {
                    if (util.isNumber(textFieldNumber.value)) {
                        var dialog = Alloy.createController("common/alertPrompt", {
                            title : "CONFIRM",
                            message : "Are you sure you want to save?",
                            okText : "Yes",
                            cancelText : "No",
                            onOk : function() {
                                if (compIndex != null) {
                                    compensationGlobalTemp[compIndex].detail = textFieldDetail.value;
                                    compensationGlobalTemp[compIndex].amount = textFieldNumber.value;
                                } else {
                                    compensationGlobalTemp.push({
                                        detail : textFieldDetail.value,
                                        type : COMP_MILE,
                                        problem : irName,
                                        amount : textFieldNumber.value,
                                        incidentId : incId,
                                        currency : null,
                                        upgradeCer : null,
                                        iscFormNumber : null,
                                        codeNumber : null,
                                        fromSeat : null,
                                        fromClass : null,
                                        toSeat : null,
                                        toClass : null,
                                        compensationId : null,
                                        compAttachment : null,
                                    });
                                }
                                if (isEdit) {
                                    compensationRefresh = 1;
                                } else {
                                    compensationFlag = 1;
                                }
                                $.compDetail.close();
                            }
                        }).getView();
                        dialog.open();
                    } else {
                        var dialog = Alloy.createController("common/alertPrompt", {
                            message : "Please enter only number type for value",
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
                    message : "Please enter miles before saving.",
                    title : 'Alert',
                    okText : "OK",
                    onOk : function() {
                    },
                    disableCancel : true
                }).getView();
                dialog.open();
            }
        });

        $.btnCancel.addEventListener('click', function() {
            $.compDetail.close();
        });

        $.condition.addEventListener('click', function() {
            var detail = model.getConditionMileOrMPD("MileageCondition");
            var type = [];
            var description = [];
            for (var i = 0; i < detail.length; i++) {
                type.push(detail[i].type);
                description.push(detail[i].description);
            }
            showCondition(type, description, 1);
        });
        break;
    case COMP_MPD:
        // MPD
        $.compDetail.title = "MPD";

        var row1 = Ti.UI.createView({
            top : 0,
            height : 70,
            width : "100%",
            layout : "horizontal",
            backgroundImage : "/images/bg_header_section.png"
        });

        var ttIrreType = $.UI.create("Label", {
            classes : ['fontLight18', 'colorWhite'],
            text : "Problem: ",
            left : "5%",
            height : "100%",
            width : "15%",
        });

        var textIrreType = $.UI.create("Label", {
            classes : ['fontBold20', 'colorGold'],
            text : irName,
            left : 0,
            height : "100%"
        });

        row1.add(ttIrreType);
        row1.add(textIrreType);

        var row2 = Ti.UI.createView({
            height : 70,
            width : "100%",
            layout : "horizontal",
            backgroundImage : "/images/bg_header_section.png"
        });

        var ttAmount = $.UI.create("Label", {
            classes : ['fontLight18', 'colorWhite'],
            text : "MPD Item Amount: ",
            left : "5%",
            width : "20%",
            height : "100%"
        });

        var textFieldAmount = Ti.UI.createTextField({
            backgroundColor : "#26000000",
            borderColor : "#7B549C",
            borderWidth : "1",
            borderRadius : "5",
            color : "#FFCB05",
            paddingLeft : 5,
            hintText : "0",
            hintTextColor : "#A6A6A5",
            keyboardType : Ti.UI.KEYBOARD_TYPE_NUMBER_PAD,
            font : {
                fontSize : "18",
                fontWeight : 'bold'
            },
            left : "2%",
            width : "25%",
            top : "15%",
            bottom : "15%"
        });
        
        if(OS_ANDROID) {
            ttAmount.width = "27%";
            textFieldAmount.width = "20%";
        }

        var textAmount = model.getAmountAndCurrency(COMP_MPD, irName, paxClass, flight.region);
        var ttTextAmount = $.UI.create("Label", {
            classes : ['fontBold20'],
            text : "[Up to " + textAmount.currency + " " + textAmount.amount + ".-]",
            color : "red",
            left : "1%",
            height : "100%"
        });

        row2.add(ttAmount);
        row2.add(ttMandatory);
        row2.add(textFieldAmount);
        row2.add(ttTextAmount);
        dataTable.push(row2);

        var row3 = Ti.UI.createView({
            height : 280,
            width : "100%",
            layout : "vertical",
            bottom : 40
        });

        var ttDetail = $.UI.create("Label", {
            classes : ['fontLight18', 'colorWhite'],
            text : "Detail: ",
            left : "5%",
            top : "5%",
            height : "10%"
        });

        var textFieldDetail = Ti.UI.createTextArea({
            backgroundColor : "#26000000",
            borderColor : "#7B549C",
            borderWidth : "2",
            borderRadius : "5",
            color : "#FFCB05",
            font : {
                fontSize : "18",
                fontWeight : 'bold'
            },
            left : "5%",
            top : "2%",
            width : "90%",
            height : "80%"
        });

        if (isEdit) {
            textFieldAmount.value = compensationGlobalTemp[compIndex].amount;
            textFieldDetail.value = compensationGlobalTemp[compIndex].detail;
        }

        row3.add(ttDetail);
        row3.add(textFieldDetail);

        var bordyView = Ti.UI.createView({
            backgroundColor : "transparent",
            height : Ti.UI.SIZE,
            layout : 'vertical',
            width : '100%'
        });

        bordyView.add(row1);
        bordyView.add(row2);
        bordyView.add(row3);
        
        $.mainView.add(bordyView);

        // $.mainView.addEventListener('click', function() {
            // textFieldDetail.blur();
            // textFieldAmount.blur();
        // });

        textFieldAmount.addEventListener('change', function() {
            if (OS_IOS) {
                textFieldAmount.value = util.checkInputKeyMustBeNumber(textFieldAmount.value);
            } else {
                if (!this.value) {
                    return;
                }

                if (changeState == 0) {
                    Titanium.API.warn("Step 1 -> " + this.value);

                    changeState = 1;
                    textFieldAmount.setValue(util.checkInputKeyMustBeNumber(this.value));
                } else {
                    if (changeState == 1) {
                        Titanium.API.warn("Step 2 -> " + this.value);

                        changeState = 2;
                        var len = textFieldAmount.getValue().length;
                        textFieldAmount.setSelection(len, len);
                    } else {
                        Titanium.API.warn("Step 3 -> " + this.value);
                        changeState = 0;
                    }
                }

            }
        });

        $.btnSave.addEventListener('click', function() {
            // var textValue = parseInt($.mainView.children[0].data[0].rows[1].children[1].value);
            var textValue = parseFloat(textFieldAmount.value);
            if (textFieldAmount.value != "") {
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
                    if (util.isNumber(textFieldAmount.value)) {
                        var dialog = Alloy.createController("common/alertPrompt", {
                            title : "CONFIRM",
                            message : "Are you sure you want to save?",
                            okText : "Yes",
                            cancelText : "No",
                            onOk : function() {
                                if (compIndex != null) {
                                    compensationGlobalTemp[compIndex].detail = textFieldDetail.value;
                                    compensationGlobalTemp[compIndex].amount = textFieldAmount.value;
                                } else {
                                    compensationGlobalTemp.push({
                                        detail : textFieldDetail.value,
                                        type : COMP_MPD,
                                        problem : irName,
                                        amount : textFieldAmount.value,
                                        incidentId : incId,
                                        currency : textAmount.currency,
                                        upgradeCer : null,
                                        iscFormNumber : null,
                                        codeNumber : null,
                                        fromSeat : null,
                                        fromClass : null,
                                        toSeat : null,
                                        toClass : null,
                                        compensationId : null,
                                        compAttachment : null,
                                    });
                                }
                                if (isEdit) {
                                    compensationRefresh = 1;
                                } else {
                                    compensationFlag = 1;
                                }
                                $.compDetail.close();
                            }
                        }).getView();
                        dialog.open();
                    } else {
                        var dialog = Alloy.createController("common/alertPrompt", {
                            message : "Please enter only number type for value",
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
                    message : "Please enter amount before saving.",
                    title : 'Alert',
                    okText : "OK",
                    onOk : function() {
                    },
                    disableCancel : true
                }).getView();
                dialog.open();
            }
        });

        $.btnCancel.addEventListener('click', function() {
            $.compDetail.close();
        });

        $.condition.addEventListener('click', function() {
            var detail = model.getConditionMileOrMPD("MPDCondition");
            var type = [];
            var description = [];
            for (var i = 0; i < detail.length; i++) {
                type.push(detail[i].type);
                description.push(detail[i].description);
            }
            showCondition(type, description, 2);
        });
        break;
    case COMP_UPCER:
        // Upgrade Certificate
        $.compDetail.title = "Upgrade Certificate";

        var row1 = Ti.UI.createView({
            height : 70,
            width : "100%",
            layout : "horizontal",
            backgroundImage : "/images/bg_header_section.png"
        });

        var ttIrreType = $.UI.create("Label", {
            classes : ['fontLight18', 'colorWhite'],
            text : "Problem: ",
            left : "5%",
            width : "15%",
            height : "100%"
        });

        var textIrreType = $.UI.create("Label", {
            classes : ['fontBold20', 'colorGold'],
            text : irName,
            left : "1%",
            height : "100%"
        });

        row1.add(ttIrreType);
        row1.add(textIrreType);

        var row2 = Ti.UI.createView({
            height : 70,
            width : "100%",
            layout : "horizontal",
            backgroundImage : "/images/bg_header_section.png"
        });

        var ttUpCer = $.UI.create("Label", {
            classes : ['fontLight18', 'colorWhite'],
            text : "Upgrade Certificate:",
            left : "5%",
            width : "22%",
            height : "100%"
        });

        var textUpCer = $.UI.create("Label", {
            classes : ['fontBold20', 'colorGold'],
            text : "",
            left : "1%",
            height : "100%",
            width : "65%"
        });

        if(OS_ANDROID) {
            ttUpCer.width = "29%";
            textUpCer.width = "57%";
        }

        var iconArrow = Ti.UI.createImageView({
            image : "/images/arrow_down.png",
            left : 15,
            height : 15,
            widht : 15
        });

        row2.add(ttUpCer);
        row2.add(ttMandatory);
        row2.add(textUpCer);
        row2.add(iconArrow);

        var row3 = Ti.UI.createView({
            height : 280,
            width : "100%",
            layout : 'vertical',
            bottom : "40"
        });

        var ttDetail = $.UI.create("Label", {
            classes : ['fontLight18', 'colorWhite'],
            text : "Detail: ",
            left : "5%",
            top : "5%",
            height : "10%"
        });

        var textFieldDetail = Ti.UI.createTextArea({
            backgroundColor : "#26000000",
            borderColor : "#7B549C",
            borderWidth : "2",
            borderRadius : "5",
            color : "#FFCB05",
            font : {
                fontSize : "18",
                fontWeight : 'bold'
            },
            left : "5%",
            top : "2%",
            width : "90%",
            height : "80%"
        });

        if (isEdit) {
            textUpCer.text = compensationGlobalTemp[compIndex].upgradeCer;
            textFieldDetail.value = compensationGlobalTemp[compIndex].detail;
        }

        row3.add(ttDetail);
        row3.add(textFieldDetail);

        var bodyView = Ti.UI.createView({
            backgroundColor : "transparent",
            height : Ti.UI.SIZE,
            layout : 'vertical',
            width : '100%'
        });
        
        bodyView.add(row1);
        bodyView.add(row2);
        bodyView.add(row3);
        
        var subType = model.getTypeUpCertificate(COMP_UPCER, irName, paxClass, flight.region);
        row2.addEventListener('click', function(e) {
            var tableData = [];
            for (var i = 0; i < subType.length; i++) {
                tableData.push(createOptDialogBtn(subType[i], subType.length, textUpCer));
            }
            var win2 = optionDialogWindow(tableData, "70%", "10%", subType.length);
            tableData = null;
            win2.open();
            win2.addEventListener("click", function() {
                win2.close();
            });
        });

        $.mainView.add(bodyView);

        // $.mainView.addEventListener('click', function() {
            // textFieldDetail.blur();
        // });

        $.btnSave.addEventListener('click', function() {
            if (textUpCer.text == "") {
                var dialog = Alloy.createController("common/alertPrompt", {
                    message : "Please select upgrade certificate before saving.",
                    title : 'Alert',
                    okText : "OK",
                    onOk : function() {
                    },
                    disableCancel : true
                }).getView();
                dialog.open();
            } else {
                var dialog = Alloy.createController("common/alertPrompt", {
                    title : "CONFIRM",
                    message : "Are you sure you want to save?",
                    okText : "Yes",
                    cancelText : "No",
                    onOk : function() {
                        if (compIndex != null) {
                            compensationGlobalTemp[compIndex].detail = textFieldDetail.value;
                            compensationGlobalTemp[compIndex].upgradeCer = textUpCer.text;
                        } else {
                            compensationGlobalTemp.push({
                                detail : textFieldDetail.value,
                                type : COMP_UPCER,
                                problem : irName,
                                amount : null,
                                incidentId : incId,
                                currency : null,
                                upgradeCer : textUpCer.text,
                                iscFormNumber : null,
                                codeNumber : null,
                                fromSeat : null,
                                fromClass : null,
                                toSeat : null,
                                toClass : null,
                                compensationId : null,
                                compAttachment : null,
                            });
                        }
                        if (isEdit) {
                            compensationRefresh = 1;
                        } else {
                            compensationFlag = 1;
                        }
                        $.compDetail.close();
                    }
                }).getView();
                dialog.open();
            }
        });

        $.btnCancel.addEventListener('click', function() {
            $.compDetail.close();
        });

        $.condition.addEventListener('click', function() {
            var detail = model.getConditionUpCer();
            showCondition(null, detail, 3);
        });
        break;
    case COMP_DUTY:
        // Duty Free
        break;
    case COMP_OTHER:
        // Others
        $.compDetail.title = "Others";

        if (OS_IOS) {
            $.compDetail.setRightNavButton(null);
        }

        var row1 = Ti.UI.createView({
            height : 70,
            width : "100%",
            layout : "horizontal",
            backgroundImage : "/images/bg_header_section.png"
        });

        var ttIrreType = $.UI.create("Label", {
            classes : ['fontLight18', 'colorWhite'],
            text : "Problem: ",
            left : "5%",
            width : "15%",
            height : "100%"
        });

        var textIrreType = $.UI.create("Label", {
            classes : ['fontBold20', 'colorGold'],
            text : irName,
            left : "2%",
            height : "100%"
        });

        row1.add(ttIrreType);
        row1.add(textIrreType);

        var row2 = Ti.UI.createView({
            height : 280,
            width : "100%",
            bottom : 40,
            layout : 'vertical'
        });
        
        var view1 = Ti.UI.createView({
            height : "15%",
            width : "100%",
            layout : "horizontal"
        });

        var ttDetail = $.UI.create("Label", {
            classes : ['fontLight18', 'colorWhite'],
            text : "Detail: ",
            left : "5%",
            height : "100%"
        });

        var ttMandatory2 = $.UI.create("Label", {
            classes : ['fontLargeBold'],
            color : "#FF9F33",
            text : "*",
            left : 3,
            height : "100%",
            width : 10
        });
        
        view1.add(ttDetail);
        view1.add(ttMandatory2);

        var textFieldDetail = Ti.UI.createTextArea({
            backgroundColor : "#26000000",
            borderColor : "#7B549C",
            borderWidth : "3",
            borderRadius : "5",
            color : "#FFCB05",
            font : {
                fontSize : "18",
                fontWeight : 'bold'
            },
            left : "5%",
            top : "2%",
            width : "90%",
            height : "75%"
        });

        if (isEdit) {
            textFieldDetail.value = compensationGlobalTemp[compIndex].detail;
        }

        row2.add(view1);
        row2.add(textFieldDetail);

        var bodyView = Ti.UI.createView({
            backgroundColor : "transparent",
            height : Ti.UI.SIZE,
            layout : 'vertical',
            width : '100%'
        });

        bodyView.add(row1);
        bodyView.add(row2);
        
        $.mainView.add(bodyView);
        data = [];

        // $.mainView.addEventListener('click', function() {
            // textFieldDetail.blur();
        // });

        $.btnSave.addEventListener('click', function() {
            if (textFieldDetail.value == "") {
                var dialog = Alloy.createController("common/alertPrompt", {
                    message : "Please type detail before saving.",
                    title : 'Alert',
                    okText : "OK",
                    onOk : function() {
                    },
                    disableCancel : true
                }).getView();
                dialog.open();
            } else {
                var dialog = Alloy.createController("common/alertPrompt", {
                    title : "CONFIRM",
                    message : "Are you sure you want to save?",
                    okText : "Yes",
                    cancelText : "No",
                    onOk : function() {
                        if (compIndex != null) {
                            compensationGlobalTemp[compIndex].detail = textFieldDetail.value;
                        } else {
                            compensationGlobalTemp.push({
                                detail : textFieldDetail.value,
                                type : COMP_OTHER,
                                problem : irName,
                                amount : null,
                                incidentId : incId,
                                currency : null,
                                upgradeCer : null,
                                iscFormNumber : null,
                                codeNumber : null,
                                fromSeat : null,
                                fromClass : null,
                                toSeat : null,
                                toClass : null,
                                compensationId : null,
                                compAttachment : null
                            });
                        }
                        if (isEdit) {
                            compensationRefresh = 1;
                        } else {
                            compensationFlag = 1;
                        }
                        $.compDetail.close();
                    }
                }).getView();
                dialog.open();
            }
        });

        $.btnCancel.addEventListener('click', function() {
            $.compDetail.close();
        });
        break;
    }
}

function optionDialogWindow(data, topAlign, sideAlign, rowNum) {
    var optionDialogWin = Ti.UI.createWindow({
        fullscreen : false,
        backgroundColor : '#40000000',
    });
    var view = Ti.UI.createView({
        top : rowNum == 2 ? topAlign : "85%",
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

function createOptDialogBtn(dataArg, rowNum, textLabel) {
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
        textLabel.text = e.source.text;
    });

    row.add(label);

    rowHeightStr = null;
    rowHeight = null;

    return row;
}

function showCondition(type, description, conditionType) {
    var win2 = Ti.UI.createWindow({
        id : "win2Id",
        fullscreen : false,
        backgroundColor : '#40000000',
    });

    var view = Ti.UI.createView({
        top : "7%",
        bottom : "7%",
        left : "7%",
        right : "7%",
        borderColor : "white",
        borderWidth : "1",
        borderRadius : 20,
        backgroundImage : bgGeneral,
        layout : "vertical"
    });

    var viewRowClose = Ti.UI.createView({
        height : "7%",
        width : "100%"
    });

    var labelClose = Ti.UI.createLabel({
        text : "X",
        color : "white",
        font : {
            fontSize : '25sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        right : "5%"
    });

    switch(conditionType) {
    case 1:
        var viewRow1 = Ti.UI.createView({
            height : "4%",
            width : "94%",
            layout : "vertical"
        });

        var viewRow2 = Ti.UI.createView({
            height : "5%",
            width : "94%",
            layout : "horizontal",
            borderWidth : "1",
            borderColor : "white",
            backgroundColor : "#80C6168D"
            // backgroundImage : "/images/bg_header_section.png"
        });

        var viewRow3 = Ti.UI.createView({
            height : "14%",
            width : "94%",
            layout : "horizontal",
            borderWidth : "1",
            borderColor : "white"
        });

        for (var i = 0; i < type.length; i++) {
            var label = Ti.UI.createLabel({
                text : type[i],
                color : "white",
                textAlign : "center",
                height : "100%",
                width : "50%",
                borderWidth : "1",
                borderColor : "white",
                font : {
                    fontSize : '22',
                    fontWeight : 'bold'
                }
            });
            viewRow2.add(label);
        }

        for (var i = 0; i < description.length; i++) {
            var label = Ti.UI.createLabel({
                text : description[i],
                color : "white",
                height : "100%",
                width : "50%",
                textAlign : "center",
                borderWidth : "1",
                borderColor : "white",
                font : {
                    fontSize : '20',
                    fontWeight : 'bold'
                }
            });
            viewRow3.add(label);
        }

        var label1 = Ti.UI.createLabel({
            text : "Condition for ROP Mileage",
            color : "white",
            font : {
                fontSize : '22',
                fontFamily : 'arial',
                fontWeight : 'bold'
            }
        });

        viewRowClose.add(labelClose);
        viewRow1.add(label1);

        view.add(viewRowClose);
        view.add(viewRow1);
        view.add(viewRow2);
        view.add(viewRow3);
        break;
    case 2:
        var viewRow1 = Ti.UI.createView({
            height : "4%",
            width : "94%",
            layout : "vertical"
        });

        var viewRow2 = Ti.UI.createView({
            height : "5%",
            width : "94%",
            layout : "horizontal",
            borderWidth : "1",
            borderColor : "white",
            backgroundColor : "#80C6168D"
            // backgroundImage : "/images/bg_header_section.png"
        });

        var viewRow3 = Ti.UI.createView({
            height : "14%",
            width : "94%",
            layout : "horizontal",
            borderWidth : "1",
            borderColor : "white"
        });

        var viewRow4 = Ti.UI.createView({
            top : "5%",
            height : "70%",
            width : "94%",
            layout : "vertical"
        });

        for (var i = 0; i < 2; i++) {
            var label = Ti.UI.createLabel({
                text : type[i],
                color : "white",
                textAlign : "center",
                height : "100%",
                width : "50%",
                borderWidth : "1",
                borderColor : "white",
                font : {
                    fontSize : '22',
                    fontWeight : 'bold'
                }
            });
            viewRow2.add(label);
        }

        for (var i = 0; i < 2; i++) {
            var label = Ti.UI.createLabel({
                text : description[i],
                color : "white",
                height : "100%",
                width : "50%",
                textAlign : "center",
                borderWidth : "1",
                borderColor : "white",
                font : {
                    fontSize : '20',
                    fontWeight : 'bold'
                }
            });
            viewRow3.add(label);
        }

        var label1 = Ti.UI.createLabel({
            text : "Condition for MPD (Multi Purpose Document)",
            color : "white",
            font : {
                fontSize : '22',
                fontFamily : 'arial',
                fontWeight : 'bold'
            }
        });

        var label4 = Ti.UI.createLabel({
            text : type[2] + "\r" + description[2],
            color : "white",
            font : {
                fontSize : '20',
                fontFamily : 'arial',
                fontWeight : 'bold'
            }
        });

        viewRowClose.add(labelClose);
        viewRow1.add(label1);
        viewRow4.add(label4);

        view.add(viewRowClose);
        view.add(viewRow1);
        view.add(viewRow2);
        view.add(viewRow3);
        view.add(viewRow4);
        break;
    case 3:
        var viewRow1 = Ti.UI.createView({
            height : "4%",
            width : "94%",
            layout : "vertical"
        });

        var viewRow2 = Ti.UI.createView({
            top : "5%",
            height : "90%",
            width : "94%",
            layout : "vertical"
        });

        for (var i = 0; i < description.length; i++) {
            var label = Ti.UI.createLabel({
                text : i == 0 ? "1. Stand-by Upgrade Certificate\r" + description[i] : "2. Comfirmed Upgrade Certificate\r" + description[i],
                color : "white",
                font : {
                    fontSize : '20',
                    fontFamily : 'arial',
                    fontWeight : 'bold'
                }
            });
            if(OS_ANDROID) {
               label.font = {fontSize : 18}; 
            }
            viewRow2.add(label);
        }

        var label1 = Ti.UI.createLabel({
            text : "Condition for Upgrade Certificate",
            color : "white",
            font : {
                fontSize : '22',
                fontFamily : 'arial',
                fontWeight : 'bold'
            }
        });

        viewRowClose.add(labelClose);
        viewRow1.add(label1);

        view.add(viewRowClose);
        view.add(viewRow1);
        view.add(viewRow2);
        
        break;
    }

    var scrollView = Ti.UI.createScrollView({
        height : "100%",
        width : "100%",
    });

    scrollView.add(view);
    
    win2.add(scrollView);

    win2.open();

    win2.addEventListener("click", function(e) {
        if (e.source.id == "win2Id") {
            win2.close();
        }
    });

    labelClose.addEventListener("click", function(e) {
        win2.close();
    });
}

$.compDetail.addEventListener('postlayout', function() {
    if (OS_IOS) {
        Alloy.Globals.activityIndicator.hide();
    }
});


if (compIndex != null) {
    compensationGlobalTemp = compensationGroup;
    initialView(compensationGlobalTemp[compIndex].type, compensationGlobalTemp[compIndex].problem, true);
    typeForCondition = compensationGlobalTemp[compIndex].type;
} else {
    if (compensationGroup != null) {
        compensationGlobalTemp = compensationGroup;
    }
    initialView(type, irreName, false);
}

if (isSync || isSubmit) {
    $.btnSave.hide();
    $.btnCancel.hide();
    if (OS_IOS) {
        $.compDetail.touchEnabled = false;
    }
}

if (OS_ANDROID) {
    $.compDetail.addEventListener('android:back', function(e) {
        Ti.API.info("Press Back button");
        $.compDetail.close();
    });
    
    $.compDetail.activity.onCreateOptionsMenu = function(e) {
        menuItem = e.menu.add({
            title : typeForCondition != COMP_OTHER ? "Condition" : "",
            showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM
        });
        menuItem.addEventListener("click", function(e) {
            switch(typeForCondition) {
                case COMP_MILE: 
                    var detail = model.getConditionMileOrMPD("MileageCondition");
                    var type = [];
                    var description = [];
                    for (var i = 0; i < detail.length; i++) {
                        type.push(detail[i].type);
                        description.push(detail[i].description);
                    }
                    showCondition(type, description, 1);                   
                break;

                case COMP_MPD:
                    var detail = model.getConditionMileOrMPD("MPDCondition");
                    var type = [];
                    var description = [];
                    for (var i = 0; i < detail.length; i++) {
                        type.push(detail[i].type);
                        description.push(detail[i].description);
                    }
                    showCondition(type, description, 2);                
                break;
                
                case COMP_UPCER:
                    var detail = model.getConditionUpCer();
                    showCondition(null, detail, 3);                
                break;
            }
        });
    };

}


