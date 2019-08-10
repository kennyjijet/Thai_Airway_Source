//**********************************************
//* Require
//**********************************************
var query = require('query_lib');
var utility = require('utility_lib');
var component = require('component_lib');
//
//**********************************************
//* Variable Declaration
//**********************************************
var args = arguments[0] || {};
var isNew = args.isNew;
var passenger;
var incidentId = args.incidentId;
var category = args.incidentCate;
var reportType = args.reportType;
var crewId = args.crewId;
var passengerId = args.passengerId;
var seatId = args.seatId;
var lopaPos = args.lopaPos;
var paxConcern = args.paxConcern;
var equipmentId = args.equipmentId;
var zoneName = args.zoneName;
var locationName = args.locationName;
var fromWhere = args.fromWhere;

paxGroupMemGlobalTemp = [];
crewGroupMemGlobalTemp = [];
staffGroupMemGlobalTemp = [];

var emergencyType = args.emergencyType;

var positionGroupMem = [];
var paxGroupMem = [];
var crewGroupMem = [];
var staffGroupMem = [];
var attachementMem = [];
var compensationMem = [];
var paxInvolvedMem = [];
var crewInvolvedMem = [];
var changeSeatMem = [];
var changeGroupMemTempForRemove = [];

var attachmentData = [];
var attachment1 = [];
var attachment2 = [];
var attachment3 = [];
var cameraData = [];
var cameraMenuIndex = 0;
var attachmentCount = 0;
var attachmentIndex = 0;
var attachment1isDeleted = false;
var attachment2isDeleted = false;
var attachment3isDeleted = false;
var attachment1NameDeleted = "";
var attachment2NameDeleted = "";
var attachment3NameDeleted = "";

var flightId;
var flightNumber;
var aircraftRegistration;
var sector;
var subject;
var equipment;
var part;
var ataChapter;
var condition = "";
var equipmentPartStr = "";
var conditionForSFDC;
var safetyZone;
var logGroup;
var sequenceNumber;
var detail;
var createdBy;
var reportedBy;
var reportedByData;
var createDateTime;
var updateDateTime;
var incidentStatus;
var ropEnrollment;

var conditionLabelHeight = 0;
var equipmentPartLabelHeight = 0;

var isLog;
var isMulti;
var isSubmitted;
var isVoided;
var isSynced;
var isSkippedPhoneAndMail;

var crew = [];
var positionGlobal;
var positionForFilterEquipment = null;
var seat = [];

var incident = [];
var flightDetail = [];
var conditionList = [];
var selectedConditionList = [];

var acReg = "";
var seqNo = "";
var logType = "";
var logDate = "";
var isResolved = false;
var isPending = false;
var isIncidentDetailEdited = false;
var isAlreadyChangedSeat = false;
var isSeatUpgraded = false;

var paxHasChild = true;

var paxOldSeat = "";

var isPostedLayout = false;

var canEdit = true;

var changeState = 0;

var isVoidedAction = false;

var menuItem;

//Const Declaration
var BIG_ROW_HEIGHT = "17%";
var MID_ROW_HEIGHT = "15%";
var SMALL_ROW_HEIGHT = "7%";
var SMALLESS_ROW_HEIGHT = "5%";

if (OS_ANDROID) {
    BIG_ROW_HEIGHT = 155;
    MID_ROW_HEIGHT = 140;
    SMALL_ROW_HEIGHT = 65;
    SMALLESS_ROW_HEIGHT = 40;
}

const ZERO_ROW_HEIGHT = 0;

const ASTERISK_TEXT_COLOR = "#FF9F33";

const leftTitleTextAlign = 175;
const ATTACHMENT_SIZE_LIMIT = 4.5 * 1024 * 1024;
const CABIN_LOG_NUMBER_LIMIT = 100;
const FLIGHT_LOG_NUMBER_LIMIT = 150;

//**********************************************
//* Function
//**********************************************
Array.prototype.contains = function(obj) {
    return this.indexOf(obj) > -1;
};

Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

//* Incident Category
function categorySection() {
    $.categoryLabel.text = component.incidentCateSeclection(category);
}

//* Safety Zone Section
function safetyZoneSection() {
    showSafetyZone();
    $.safetyZoneView.addEventListener("click", function(e) {
        if (canEdit) {
            var zoneListView = Alloy.createController("equipments/zone_list", [getSafetyZoneFromPicklist, {
                flightId : currentFlightId
            }]).getView();
            if (OS_IOS) {
                Alloy.Globals.navGroupWin.openWindow(zoneListView);
            } else {
                zoneListView.open();
            }
        }
    });
}

function getSafetyZoneFromPicklist(value) {
    isIncidentDetailEdited = true;
    safetyZone = value;
    showSafetyZone();
}

function showSafetyZone() {
    if (isSubmitted || isVoided || isSynced) {
        $.zoneHasChildArrowDown.visible = false;
        $.zoneHasChildArrowDown.width = 0;
    } else {
        $.zoneHasChildArrowDown.visible = true;
        $.zoneHasChildArrowDown.width = 15;
    }

    $.zoneLabel.text = safetyZone != null ? safetyZone : "";
}

//* Report Type
function createOptDialogReportTypeBtn(dataArg) {
    var btnId = dataArg[0];
    var btnName = dataArg[1];
    var incidentCatenName;
    var row = component.createOptionDialogBtn(btnId, 4, null, 62);
    row.add(component.createLabel(btnName, null));

    row.addEventListener("click", function(e) {
        if (e.source.id == undefined || e.source.idType == "btnRow") {
            if (e.source.parent.id == undefined) {
                btnId = e.source.id;
            } else {
                btnId = e.source.parent.id;
            }
            isIncidentDetailEdited = true;
            reportType = component.reportTypeSelection(btnId);
            $.typeLabel.text = reportType;
        }
    });
    btnId = null;
    btnName = null;
    imgPathName = null;
    return row;
}

function typeSection() {
    if (isSubmitted || isVoided || isSynced || category == OTHER || category == SERVICE_EQUIPMENT) {
        $.typeHasChildArrowDown.visible = false;
    } else {
        $.typeHasChildArrowDown.visible = true;
    }

    if (category != OTHER && category != SERVICE_EQUIPMENT) {
        $.mandatoryTypeSymbolLabel.width = 15;
    } else {
        $.mandatoryTypeSymbolLabel.width = 0;
    }

    $.typeLabel.text = reportType;

    $.typeView.addEventListener("click", function(e) {
        if (canEdit) {
            var data = [];
            data = component.incidentReportTypeData();
            var tableData = [];
            for (var i = 0; i < data.length; i++) {
                tableData.push(createOptDialogReportTypeBtn(data[i]), 4);
            }
            var win2 = component.createOptionDialogWindow(tableData, "70%", "Create New Incident");
            data = null;
            tableData = null;

            win2.open();
            win2.addEventListener("click", function(e) {
                win2.close();
            });
        }
    });
}

//* Subject
function subjectSection() {
    if (subject != null && subject.length > 0)
        $.subjectTextField.value = subject;
    else
        $.subjectTextField.value = "";
}

$.subjectTextField.addEventListener("change", function(e) {
    isIncidentDetailEdited = true;
});

//* Crew Section
function createOptDialogCrewListForEmergency(dataArg, id, count) {
    var btnId = id;
    var btnName = dataArg;
    var incidentCatenName;
    var row = component.createOptionDialogBtn(btnId, 8, btnName, 61);
    row.add(component.createLabel(btnName, null));

    row.addEventListener("click", function(e) {
        if (e.source.id == undefined || e.source.idType == "btnRow") {
            if (e.source.parent.id == undefined) {
                btnId = e.source.id;
                crewId = e.source.id;
                if (crewId != null && crewId.length > 0) {
                    var crewTemp = {
                        crewId : crewId,
                        role : "",
                        detail : "",
                        incidentId : incidentId,
                        name : e.source.name,
                        type : PERSON_MASTER
                    };
                    isIncidentDetailEdited = true;
                    crewGroupMem.push(crewTemp);
                    crew = query.getCrewDetailBySfdcId(crewId);
                    crewSection();
                } else {
                    $.crewLabel = "";
                }
            } else {
                btnId = e.source.parent.id;
                crewId = e.source.parent.id;
                if (crewId != null && crewId.length > 0) {
                    var crewTemp = {
                        crewId : crewId,
                        role : "",
                        detail : "",
                        incidentId : incidentId,
                        name : e.source.name,
                        type : PERSON_MASTER
                    };
                    isIncidentDetailEdited = true;
                    crewGroupMem.push(crewTemp);
                    crew = query.getCrewDetailBySfdcId(crewId);
                    crewSection();
                } else {
                    $.crewLabel = "";
                }
            }
        }
    });
    btnId = null;
    btnName = null;
    imgPathName = null;
    return row;
}

$.crewView.addEventListener('click', function(e) {
    if (canEdit) {
        var data = [];
        data = query.getCrewListSortBySeqNo(currentFlightId);

        var tableData = [];
        for (var i = 0; i < data.length; i++) {
            tableData.push(createOptDialogCrewListForEmergency(data[i].rank + ". " + data[i].crewFirstName + " " + data[i].crewLastName, data[i].sfdcId, data.length));
        }
        var win2 = component.createOptionDialogWindow(tableData, "50%");
        data = null;
        tableData = null;

        win2.open();
        win2.addEventListener("click", function(e) {
            win2.close();
        });
    }
});

$.crewView1.addEventListener('click', function(e) {
    if (canEdit) {
        var data = [];
        data = query.getCrewListSortBySeqNo(currentFlightId);

        var tableData = [];
        for (var i = 0; i < data.length; i++) {
            tableData.push(createOptDialogCrewListForEmergency(data[i].rank + ". " + data[i].crewFirstName + " " + data[i].crewLastName, data[i].sfdcId, data.length));
        }
        var win2 = component.createOptionDialogWindow(tableData, "50%");
        data = null;
        tableData = null;

        win2.open();
        win2.addEventListener("click", function(e) {
            win2.close();
        });
    }
});

function crewSection() {
    var crewLastName = "";
    var crewFirstName = "";
    var crewPersonalId = "";
    var crewRank = "";

    if (crew != null) {
        if (crew.crewLastName != null && crew.crewLastName.length > 0) {
            crewLastName = crew.crewLastName;
        }
        if (crew.crewFirstName != null && crew.crewFirstName.length > 0) {
            crewFirstName = crew.crewFirstName;
        }
        if (crew.crewId != null && crew.crewId.length > 0) {
            crewPersonalId = crew.crewId;
        }
        if (crew.rank != null && crew.rank.length > 0) {
            crewRank = crew.rank;
        }
        $.crewLabel.text = crewRank + " " + crewFirstName + " " + crewLastName + "  (" + crewPersonalId + ")";
        $.crewLabel1.text = crewRank + " " + crewFirstName + " " + crewLastName + "  (" + crewPersonalId + ")";
    } else {
        $.crewLabel.text = "";
        $.crewLabel1.text = "";
    }
}

//* Passenger
function showNoPassenger() {
    $.paxPhoneView.height = 0;
    $.paxEmailView.height = 0;
    $.skipPaxEmailAndPhoneView.height = 0;
    $.passengerView.removeAllChildren();
    $.passengerView.height = SMALL_ROW_HEIGHT;
    $.passengerView.backgroundImage = "/images/bg_header_section.png";
    var paxHeaderLabel = Ti.UI.createLabel({
        text : "Passenger",
        left : "3%",
        height : "100%",
        width : 95,
        font : {
            fontSize : 18,
        },
        color : "white"
    });
    var semiColon = Ti.UI.createLabel({
        text : ":",
        left : 0,
        height : "100%",
        width : 40,
        font : {
            fontSize : 18,
        },
        color : "white"
    });

    $.passengerView.add(paxHeaderLabel);
    if (category == PASSENGER || category == EMERGENCY) {
        var asteriskLabel = Ti.UI.createLabel({
            text : "*",
            left : 0,
            height : "100%",
            width : 15,
            font : {
                fontWeight : "bold",
                fontSize : 22,
            },
            color : ASTERISK_TEXT_COLOR
        });
        $.passengerView.add(asteriskLabel);
    } else {
        semiColon.width += 15;
    }
    $.passengerView.add(semiColon);
    if (!isSynced && !isSubmitted && !isVoided) {
        if (OS_IOS) {
            $.passengerView.add(component.createHasChild("/images/ic_arrow_right.png", "73%"));
        } else {
            $.passengerView.add(component.createHasChild("/images/ic_arrow_right.png", "66%"));
        }
    }
    $.passengerView.show();
}

function passengerRemoved(posArg) {
    paxGroupMem = [];
    isIncidentDetailEdited = true;
    showNoPassenger();
}

function getPassengerData(value) {
    var isSame = false;
    for ( i = 0; i < paxInvolvedMem.length; i++) {
        if (paxInvolvedMem[i] != null)
            if (paxInvolvedMem[i].id == value.id) {
                isSame = true;
                break;
            }
    }
    if (!isSame) {
        if(paxGroupMem.length > 0) {
            if(paxGroupMem[0] != null) {
                if(paxGroupMem[0].paxId != value.id) {
                    changeSeatMem = [];
                    reasonForChangeSeatTemp = "";
                    $.chageSeatLabel.text = "";
                    query.deleteChangeSeatByIncidentId(incidentId);
                }                                        
            }
        }
        paxGroupMem = [];
        var passenger = query.getPassengerDetailByIdOrAccountIdOrPaxKey(value.id);
        if (passenger != null) {
            var paxTemp = {
                paxId : passenger.id,
                accountId : passenger.accountId,
                paxKey : passenger.paxKey,
                role : "",
                detail : "",
                type : PERSON_MASTER
            };
            paxGroupMem.push(paxTemp);
        }

        var index = null;

        for (var i = 0; i < positionGroupMem.length; i++) {
            if (positionGroupMem[i] == paxOldSeat) {
                var index = i;
            }
        }
        if (index != null) {
            positionGroupMem.remove(index);
        }

        if (passenger != null) {
            if (passenger.bookingSeat != null && passenger.bookingSeat.length > 0) {
                if (!positionGroupMem.contains(passenger.bookingSeat)) {
                    positionGroupMem.push(passenger.bookingSeat);
                    showPosition();
                }
            }
        }
        isIncidentDetailEdited = true;
        passengerSelected();
    } else {
        var _promptView = new Alloy.createController("common/alertPrompt", {
            title : "Alert",
            message : "This passenger already selected in person involved.",
            okText : "OK",
            disableCancel : true,
            onOk : function() {
            }
        }).getView();
        _promptView.open();
    }
}

function passengerSelected() {
    if (paxGroupMem != null && paxGroupMem.length > 0) {
        $.passengerView.height = BIG_ROW_HEIGHT;
        $.passengerView.backgroundImage = "/images/bg_rop.png";

        passenger = null;
        if (paxGroupMem != null && paxGroupMem.length > 0) {
            if (paxGroupMem[0] != null) {
                if (paxGroupMem[0].type != PERSON_INVOLVED) {
                    passenger = query.getPassengerDetailByIdOrAccountIdOrPaxKey(paxGroupMem[0].paxId, paxGroupMem[0].accountId, paxGroupMem[0].paxKey);
                }
            }
        }
        showPassengerDetail(passenger);
    }
}

function showPassengerDetail(passenger) {
    $.passengerView.removeAllChildren();
    $.passengerView.backgroundImage = null;
    if (isSubmitted || isVoided || isSynced) {
        var needHasChild = false;
    } else {
        var needHasChild = true;
    }
    var isRop = false;
    var tableRowData = [];
    var seatPosition;
    var passengerImageBackgroundPath = null;
    if (passenger != null) {
        if (passenger.id.length > 0) {
            $.paxPhoneView.height = SMALL_ROW_HEIGHT;
            $.paxEmailView.height = SMALL_ROW_HEIGHT;
            $.skipPaxEmailAndPhoneView.height = SMALLESS_ROW_HEIGHT;

            var ropdetail = query.getRop(passenger.memberId);

            if (ropdetail) {
                switch (ropdetail.ropTier) {
                case "BASIC" :
                    passengerImageBackgroundPath = "/images/bg_rop.png";
                    isRop = true;
                    break;
                case "SILVER" :
                    passengerImageBackgroundPath = "/images/bg_silver.png";
                    isRop = true;
                    break;
                case "PLATINUM" :
                    passengerImageBackgroundPath = "/images/bg_platinum.png";
                    isRop = true;
                    break;
                case "GOLD" :
                    passengerImageBackgroundPath = "/images/bg_gold.png";
                    isRop = true;
                    break;
                default :
                    passengerImageBackgroundPath = null;
                    isRop = true;
                    break;
                }
            }
        }
    }
    var imgPath;
    var paxName = "";
    var seatNumber = "";
    var seatClass = "";
    var floorZone = "Floor  -  Zone";
    var zone = "Zone ";
    var birthday = "";
    var gender = "";
    var nationality = "";
    var imgPath = "/images/user_man.png";
    var floor = "Floor - ";
    var zone = "Zone";

    if (passenger != null) {
        paxName = passenger.lastName + " " + passenger.firstName + " " + passenger.salutation;
        seatNumber = passenger.bookingSeat;
        seatClass = passenger.bookingClass;
        seatPosition = passenger.bookingSeat;
        paxOldSeat = passenger.bookingSeat;

        if (passenger.floor != null && passenger.floor.length > 0)
            floor = passenger.floor + " - ";
        if (passenger.zone != null && passenger.zone.length > 0)
            zone = "Zone " + passenger.zone;
        floorZone = floor + zone;

        birthday = passenger.dateOfBirth;
        gender = passenger.gender;
        nationality = passenger.nationality;
        if (passenger.gender.substring(0, 1).toLowerCase() == "f")
            imgPath = "/images/user_woman.png";
        else
            imgPath = "/images/user_man.png";
    }

    if (OS_IOS) {
        tableRowData = component.createPassengerRowDetail(passengerImageBackgroundPath, null, needHasChild);
        tableRowData.add(component.createIcon1(imgPath, "3%", 120, 120));
        tableRowData.add(component.createLabelValue(paxName, colorTextValue, leftTitleTextAlign, "5%", 20, "60%"));
        tableRowData.add(component.createLabelValue("Seat No. ", colorTextTitle, leftTitleTextAlign, "20%", 19));
        tableRowData.add(component.createLabelValue(seatNumber, colorTextValue, leftTitleTextAlign + 80, "20%", 19));
        tableRowData.add(component.createLabelValue("Class ", colorTextTitle, leftTitleTextAlign + 120, "20%", 19));
        tableRowData.add(component.createLabelValue(seatClass, colorTextValue, leftTitleTextAlign + 175, "20%", 19));
        tableRowData.add(component.createLabelValue(floorZone, colorTextValue, leftTitleTextAlign, "35%", 19));
        tableRowData.add(component.createLabelFieldName("Date of Birth : ", colorTextTitle, leftTitleTextAlign, "65%"));
        tableRowData.add(component.createLabelFieldName("Gender : ", colorTextTitle, "60%", "65%")); //60%
        tableRowData.add(component.createLabelValue(birthday, colorTextValue, "40%", "65%"));
        tableRowData.add(component.createLabelValue(gender, colorTextValue, "70%", "65%")); //70%
        tableRowData.add(component.createLabelFieldName("Nationality : ", colorTextTitle, leftTitleTextAlign, "82%"));
        tableRowData.add(component.createLabelValue(nationality, colorTextValue, "40%", "82%"));
    } else {
        tableRowData = component.createPassengerRowDetail(passengerImageBackgroundPath, BIG_ROW_HEIGHT, needHasChild);
        tableRowData.add(component.createIcon1(imgPath, "3%", 120, 120));
        tableRowData.add(component.createLabelValue(paxName, colorTextValue, leftTitleTextAlign, "5%", 23, "60%"));
        tableRowData.add(component.createLabelValue("Seat No. ", colorTextTitle, leftTitleTextAlign, "20%", 21));
        tableRowData.add(component.createLabelValue(seatNumber, colorTextValue, leftTitleTextAlign + 80, "20%", 21));
        tableRowData.add(component.createLabelValue("Class ", colorTextTitle, leftTitleTextAlign + 120, "20%", 21));
        tableRowData.add(component.createLabelValue(seatClass, colorTextValue, leftTitleTextAlign + 175, "20%", 21));
        tableRowData.add(component.createLabelValue(floorZone, colorTextValue, leftTitleTextAlign, "35%", 21));
        tableRowData.add(component.createLabelFieldName("Date of Birth : ", colorTextTitle, leftTitleTextAlign, "65%"));
        tableRowData.add(component.createLabelValue(birthday, colorTextValue, "45%", "65%"));
        tableRowData.add(component.createLabelFieldName("Nationality : ", colorTextTitle, leftTitleTextAlign, "82%"));
        tableRowData.add(component.createLabelValue(nationality, colorTextValue, "45%", "82%"));
        tableRowData.add(component.createLabelFieldName("Gender : ", colorTextTitle, "57%", "65%")); //57%
        tableRowData.add(component.createLabelValue(gender, colorTextValue, "67%", "65%")); //67%
    }
    var notConcernBtn = component.createImgBtn("/images/btn_no_concern_pax.png", null, 35, "23%", 140, 45, "notConcernBtnId");
    var ropBtnImagePath = "/images/btn_apply_for_rop.png";
    if (passenger != null) {
        ropEnrollment = query.getROPEnrollment(passenger.accountId, passenger.paxKey);
    }

    if (ropEnrollment != null) {
        var flightDerail = query.getFlightDetails(currentFlightId);
        if (flightDerail != null) {
            var flightNumberTemp = flightDerail.flightExternalId.replace(/_/gi, "");
            var flightNumber = flightNumberTemp.substring(0, flightNumberTemp.length - 1);
            if (ropEnrollment.flightNumber != flightNumber && ropEnrollment.status == VOIDED) {
                ropBtnImagePath = "/images/btn_apply_for_rop.png";
            } else if (ropEnrollment.flightNumber != flightNumber && ropEnrollment.status != VOIDED) {
                ropBtnImagePath = "/images/btn_applied.png";
            } else if (ropEnrollment.flightNumber == flightNumber && ropEnrollment.status == VOIDED) {
                ropBtnImagePath = "/images/btn_applied.png";
            } else if (ropEnrollment.flightNumber == flightNumber && ropEnrollment.status != VOIDED) {
                ropBtnImagePath = "/images/btn_applied.png";
            }
        }
    }

    var applyForRopBtn = component.createImgBtn(ropBtnImagePath, null, 35, "60%", 140, 45, "applyForRopBtnId");
    applyForRopBtn.addEventListener("click", function(e) {
        if (e.source.id == "applyForRopBtnId" && e.source.parent.id != "passengerView") {
            ropEnrollment = query.getROPEnrollment(passenger.accountId, passenger.paxKey);
            if (ropEnrollment != null) {
                var flightDerail = query.getFlightDetails(currentFlightId);
                if (flightDerail != null) {
                    var flightNumberTemp = flightDerail.flightExternalId.replace(/_/gi, "");
                    var flightNumber = flightNumberTemp.substring(0, flightNumberTemp.length - 1);

                    if (ropEnrollment.flightNumber != flightNumber && ropEnrollment.status == VOIDED) {
                        closeFlag = 1;
                        var ropEnrollmentFormView = Alloy.createController("rop_enrollment/rop_enrollment_form", {
                            passengerId : passenger.id,
                            isNew : true
                        }).getView();
						isFromIncidentDetail = true;
                        if (OS_IOS) {
                            Alloy.Globals.navGroupWin.openWindow(ropEnrollmentFormView);
                        } else {
                            ropEnrollmentFormView.open();
                        }

                    } else {
                        closeFlag = 1;
                        showRopDetail(ropEnrollment, passenger);
                    }
                }
            } else {
                closeFlag = 1;
                var ropEnrollmentFormView = Alloy.createController("rop_enrollment/rop_enrollment_form", {
                    passengerId : passenger.id,
                    isNew : true
                }).getView();
				isFromIncidentDetail = true;
                if (OS_IOS) {
                    Alloy.Globals.navGroupWin.openWindow(ropEnrollmentFormView);
                } else {
                    ropEnrollmentFormView.open();
                }
            }
        }
    });

    if (!isRop && category != EMERGENCY && passenger.staff != "STAFF") {
        tableRowData.add(applyForRopBtn);
    }

    if (!isSubmitted && category != PASSENGER && category != EMERGENCY && !isVoided && !isSynced) {
        tableRowData.add(notConcernBtn);
    }

    var _syncDataPromptView = new Alloy.createController("common/alertPrompt", {
        title : 'Remove Not Concern PAX',
        message : 'Are you sure to remove the passenger from this incident?',
        okText : "Yes",
        cancelText : "No",
        onOk : function() {
            passengerRemoved(seatPosition);
        }
    }).getView();

    notConcernBtn.addEventListener("click", function(e) {
        if (e.source.id == "notConcernBtnId") {
            _syncDataPromptView.open();
        }
    });

    notConcernBtn = null;
    applyForRopBtn = null;

    $.passengerView.add(component.createMenuBar(tableRowData, 0, $.passengerView.height));
    tableRowData = null;

}

function passengerSection() {
    if (paxGroupMem != null && paxGroupMem.length > 0) {
        $.passengerView.height = BIG_ROW_HEIGHT;
        passenger = null;
        if (paxGroupMem != null && paxGroupMem.length > 0) {
            if (paxGroupMem[0] != null) {
                if (paxGroupMem[0].type != PERSON_INVOLVED) {
                    passenger = query.getPassengerDetailByIdOrAccountIdOrPaxKey(paxGroupMem[0].paxId, paxGroupMem[0].accountId, paxGroupMem[0].paxKey);
                }
            }
        }

        showPassengerDetail(passenger);

        $.passengerView.addEventListener("click", function(e) {
            if (canEdit) {
                if (e.source.id != "notConcernBtnId" && e.source.id != "applyForRopBtnId") {
                    var passengerSingleSelectView = Alloy.createController("passengers/passenger_single_select", [getPassengerData, {
                        flightId : currentFlightId
                    }]).getView();

                    if (OS_IOS) {
                        Alloy.Globals.navGroupWin.openWindow(passengerSingleSelectView);
                    } else {
                        passengerSingleSelectView.open();
                    }
                }
            }
        });

    } else {
        $.passengerView.addEventListener("click", function(e) {
            if (canEdit) {
                if (e.source.id != "notConcernBtnId" && e.source.id != "applyForRopBtnId") {
                    var passengerSingleSelectView = Alloy.createController("passengers/passenger_single_select", [getPassengerData, {
                        flightId : currentFlightId
                    }]).getView();
                    if (OS_IOS) {
                        Alloy.Globals.navGroupWin.openWindow(passengerSingleSelectView);
                    } else {
                        passengerSingleSelectView.open();
                    }
                }
            }
        });
        showNoPassenger();
    }
}

// Passenger's Phone and Email
function skipPaxEmailAndPhoneSection() {
    if (!isSkippedPhoneAndMail) {
        $.skipPaxEmailAndPhoneBtn.image = "/images/btn_button_off.png";
        $.paxPhoneView.touchEnabled = true;
        $.paxEmailView.touchEnabled = true;

        $.phoneTitleLabel.color = "white";
        $.phoneStarLabel.color = "#FF9F33";
        $.phoneColonLabel.color = "white";
        $.paxPhoneTextField.color = colorTextValue;

        $.emailTitleLabel.color = "white";
        $.emailStarLabel.color = "#FF9F33";
        $.emailColonLabel.color = "white";
        $.paxEmailTextField.color = colorTextValue;
        $.skipPaxEmailAndPhoneLabel.color = "gray";

    } else {
        $.skipPaxEmailAndPhoneBtn.image = "/images/btn_button_on.png";
        $.paxPhoneView.touchEnabled = false;
        $.paxEmailView.touchEnabled = false;

        $.phoneTitleLabel.color = "gray";
        $.phoneStarLabel.color = "gray";
        $.phoneColonLabel.color = "gray";
        $.paxPhoneTextField.color = "gray";

        $.emailTitleLabel.color = "gray";
        $.emailStarLabel.color = "gray";
        $.emailColonLabel.color = "gray";
        $.paxEmailTextField.color = "gray";
        $.skipPaxEmailAndPhoneLabel.color = "white";
    }
}

$.skipPaxEmailAndPhoneBtn.addEventListener("click", function(e) {
    if (canEdit) {
        isSkippedPhoneAndMail = !isSkippedPhoneAndMail;
        isIncidentDetailEdited = true;
        skipPaxEmailAndPhoneSection();
    }
});

if (OS_IOS) {
    $.paxPhoneTextField.keyboardType = Titanium.UI.KEYBOARD_TYPE_PHONE_PAD;
} else {
    $.paxPhoneTextField.keyboardType = Titanium.UI.KEYBOARD_NUMBER_PAD;
}

$.paxPhoneTextField.addEventListener("change", function() {
    if (!isSkippedPhoneAndMail) {
        if (OS_IOS) {
            $.paxPhoneTextField.value = utility.checkInputKeyMustBeNumber($.paxPhoneTextField.value);
        } else {
            if (!this.value) {
                return;
            }
            if (changeState == 0) {
                changeState = 1;
                $.paxPhoneTextField.setValue(utility.checkInputKeyMustBeNumber(this.value));
            } else {
                if (changeState == 1) {
                    changeState = 2;
                    var len = $.paxPhoneTextField.getValue().length;
                    $.paxPhoneTextField.setSelection(len, len);
                } else {
                    changeState = 0;
                }
            }

        }
        isIncidentDetailEdited = true;
    }
});
// Apply ROP
function showRopDetail(dataArg, passengerArg) {

    var win2 = Ti.UI.createWindow({
        fullscreen : false,
        backgroundColor : '#40000000',
    });
    var view = Ti.UI.createView({
        top : "10%",
        bottom : "10%",
        left : "10%",
        right : "10%",
        borderColor : "white",
        borderWidth : "1",
        borderRadius : 20,
        backgroundImage : bgGeneral,
        layout : "vertical"
    });

    var viewRowClose = Ti.UI.createView({
        height : "10%",
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
    viewRowClose.add(labelClose);

    var viewRow1 = Ti.UI.createView({
        height : "10%",
        width : "100%",
        layout : "vertical"
    });
    var viewRow2 = Ti.UI.createView({
        height : "70%",
        width : "100%",
        layout : "vertical"
    });

    label1 = Ti.UI.createLabel({
        text : "ROP Information",
        color : "white",
        font : {
            fontSize : '25sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        }
    });
    viewRow1.add(label1);

    //Saluation
    var subViewRow = Ti.UI.createView({
        height : "12%",
        width : "100%",
        layout : "horizontal"
    });
    label1 = Ti.UI.createLabel({
        text : "Salutation / Title",
        color : "white",
        font : {
            fontSize : '18sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "30%",
        left : "10%"
    });
    var label2 = Ti.UI.createLabel({
        text : dataArg.saluation,
        color : colorTextValue,
        font : {
            fontSize : '20sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "50%",
        left : "1%"
    });
    subViewRow.add(label1);
    subViewRow.add(label2);
    viewRow2.add(subViewRow);

    //first name
    var subViewRow = Ti.UI.createView({
        height : "12%",
        width : "100%",
        layout : "horizontal"
    });
    label1 = Ti.UI.createLabel({
        text : "First Name",
        color : "white",
        font : {
            fontSize : '18',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "30%",
        left : "10%"
    });
    var label2 = Ti.UI.createLabel({
        text : dataArg.firstName,
        color : colorTextValue,
        font : {
            fontSize : '20sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "50%",
        left : "1%"
    });
    subViewRow.add(label1);
    subViewRow.add(label2);
    viewRow2.add(subViewRow);

    //last name
    subViewRow = Ti.UI.createView({
        height : "12%",
        width : "100%",
        layout : "horizontal"
    });
    label1 = Ti.UI.createLabel({
        text : "Last Name",
        color : "white",
        font : {
            fontSize : '18sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "30%",
        left : "10%"
    });
    label2 = Ti.UI.createLabel({
        text : dataArg.lastName,
        color : colorTextValue,
        font : {
            fontSize : '20sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "50%",
        left : "1%"
    });
    subViewRow.add(label1);
    subViewRow.add(label2);
    viewRow2.add(subViewRow);

    //birth date
    subViewRow = Ti.UI.createView({
        height : "12%",
        width : "100%",
        layout : "horizontal"
    });
    label1 = Ti.UI.createLabel({
        text : "Birth Date",
        color : "white",
        font : {
            fontSize : '18sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "30%",
        left : "10%"
    });
    label2 = Ti.UI.createLabel({
        text : dataArg.dateOfBirth,
        color : colorTextValue,
        font : {
            fontSize : '20sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "50%",
        left : "1%"
    });
    subViewRow.add(label1);
    subViewRow.add(label2);
    viewRow2.add(subViewRow);

    //Gender
    subViewRow = Ti.UI.createView({
        height : "12%",
        width : "100%",
        layout : "horizontal"
    });
    label1 = Ti.UI.createLabel({
        text : "Gender",
        color : "white",
        font : {
            fontSize : '18sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "30%",
        left : "10%"
    });
    label2 = Ti.UI.createLabel({
        text : dataArg.gender,
        color : colorTextValue,
        font : {
            fontSize : '20sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "50%",
        left : "1%"
    });
    subViewRow.add(label1);
    subViewRow.add(label2);
    viewRow2.add(subViewRow);

    //Nationality
    subViewRow = Ti.UI.createView({
        height : "12%",
        width : "100%",
        layout : "horizontal"
    });
    label1 = Ti.UI.createLabel({
        text : "Nationality",
        color : "white",
        font : {
            fontSize : '18sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "30%",
        left : "10%"
    });

    var natinalityFullName = query.getFullNameNationality(dataArg.nationality);
    label2 = Ti.UI.createLabel({
        text : natinalityFullName != null ? natinalityFullName.fullname : "",
        color : colorTextValue,
        font : {
            fontSize : '20sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "50%",
        left : "1%"
    });
    subViewRow.add(label1);
    subViewRow.add(label2);
    viewRow2.add(subViewRow);

    //Phone
    subViewRow = Ti.UI.createView({
        height : "12%",
        width : "100%",
        layout : "horizontal"
    });
    label1 = Ti.UI.createLabel({
        text : "Phone",
        color : "white",
        font : {
            fontSize : '18sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "30%",
        left : "10%"
    });
    label2 = Ti.UI.createLabel({
        text : dataArg.countryCode + " " + dataArg.areaCode + " " + dataArg.phoneNumber,
        color : colorTextValue,
        font : {
            fontSize : '20sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "50%",
        left : "1%"
    });
    subViewRow.add(label1);
    subViewRow.add(label2);
    viewRow2.add(subViewRow);

    //Email
    subViewRow = Ti.UI.createView({
        height : "12%",
        width : "100%",
        layout : "horizontal"
    });
    label1 = Ti.UI.createLabel({
        text : "Email",
        color : "white",
        font : {
            fontSize : '18sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "30%",
        left : "10%"
    });
    label2 = Ti.UI.createLabel({
        text : dataArg.email,
        color : colorTextValue,
        font : {
            fontSize : '20sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "50%",
        left : "1%"
    });
    subViewRow.add(label1);
    subViewRow.add(label2);
    viewRow2.add(subViewRow);

    view.add(viewRowClose);
    view.add(viewRow1);
    view.add(viewRow2);

    ropEnrollment = query.getROPEnrollment(passengerArg.accountId, passengerArg.paxKey);
    var isEdit = false;
    if (ropEnrollment != null) {
        var flightDerail = query.getFlightDetails(currentFlightId);
        if (flightDerail != null) {
            var flightNumberTemp = flightDerail.flightExternalId.replace(/_/gi, "");
            var flightNumber = flightNumberTemp.substring(0, flightNumberTemp.length - 1);

            if (ropEnrollment.flightNumber != flightNumber && ropEnrollment.status == VOIDED) {
            } else if (ropEnrollment.flightNumber != flightNumber && ropEnrollment.status != VOIDED) {
            } else if (ropEnrollment.flightNumber == flightNumber && ropEnrollment.status == VOIDED) {
            } else if (ropEnrollment.flightNumber == flightNumber && ropEnrollment.status != VOIDED && ropEnrollment.isSynced) {
                isEdit = false;
            } else if (ropEnrollment.flightNumber == flightNumber && ropEnrollment.status != VOIDED && !ropEnrollment.isSynced) {
                isEdit = true;
            }
        }
    }

    var td1 = Ti.UI.createView({
        height : "10%",
        width : "100%",
        layout : "horizontal"
    });

    var editBtnView = Ti.UI.createView({
        height : "100%",
        width : isEdit ? "50%" : "0%",
        layout : "vertical"
    });

    var voidBtnView = Ti.UI.createView({
        height : "100%",
        width : isEdit ? "50%" : "100%",
        layout : "vertical"
    });

    var btnEdit = Ti.UI.createImageView({
        image : "/images/btn_edit.png",
        height : "50",
        width : "150",
        borderRadius : '2px'
    });

    var btnVoid = Ti.UI.createImageView({
        image : "/images/btn_void.png",
        height : "50",
        width : "150",
        borderRadius : '2px'
    });

    var labelVoided = Ti.UI.createLabel({
        text : "This Enrollment is voided.",
        color : "#F540FE",
        font : {
            fontSize : '25',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "100%",
        height : "100%",
        textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER
    });

    var labelReason = Ti.UI.createLabel({
        text : "",
        color : "#F540FE",
        font : {
            fontSize : '25',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "100%",
        height : "100%",
        textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER
    });

    btnVoid.addEventListener("click", function(e) {
        closeFlag = 1;
        var _syncDataPromptView = new Alloy.createController("common/alertPrompt", {
            title : 'Confirm',
            message : 'Do you want to void this Enrollment?',
            okText : "Yes",
            cancelText : "No",
            onOk : function() {
                query.voidROPEnrollment(passengerArg.paxKey);
                ropEnrollment = query.getROPEnrollment(passengerArg.accountId, passengerArg.paxKey);
                if (ropEnrollment != null) {
                    if (ropEnrollment.status == VOIDED) {
                        td1.removeAllChildren();
                        voidBtnView.add(labelVoided);
                        td1.add(voidBtnView);
                    } else {
                        voidBtnView.add(btnVoid);
                        td1.add(voidBtnView);
                    }
                }
            }
        }).getView();
        _syncDataPromptView.open();
    });

    btnEdit.addEventListener("click", function(e) {
        closeFlag = 1;
        Ti.API.info(passenger);
        var ropEnrollmentFormView = Alloy.createController("rop_enrollment/rop_enrollment_form", {
            passengerId : passenger.id,
            isNew : false
        }).getView();
        isFromIncidentDetail = true;
        if (OS_IOS) {
            Alloy.Globals.navGroupWin.openWindow(ropEnrollmentFormView);
        } else {
            ropEnrollmentFormView.open();
        }
    });

    if (ropEnrollment != null) {
        if (flightDerail != null) {
            var flightNumberTemp = flightDerail.flightExternalId.replace(/_/gi, "");
            var flightNumber = flightNumberTemp.substring(0, flightNumberTemp.length - 1);

            if (ropEnrollment.flightNumber != flightNumber && ropEnrollment.status == VOIDED) {
            } else if (ropEnrollment.flightNumber != flightNumber && ropEnrollment.status != VOIDED) {
            } else if (ropEnrollment.flightNumber == flightNumber && ropEnrollment.status == VOIDED) {
                td1.removeAllChildren();
                voidBtnView.add(labelVoided);
                td1.add(voidBtnView);
            } else if (ropEnrollment.flightNumber == flightNumber && ropEnrollment.status != VOIDED && ropEnrollment.isSynced) {
                voidBtnView.add(btnVoid);
                td1.add(voidBtnView);
            } else if (ropEnrollment.flightNumber == flightNumber && ropEnrollment.status != VOIDED && !ropEnrollment.isSynced) {
                editBtnView.add(btnEdit);
                voidBtnView.add(btnVoid);
                td1.add(editBtnView);
                td1.add(voidBtnView);
            }
        }
    }

    view.add(td1);

    win2.add(view);

    closeFlag = 1;
    win2.open();

    win2.addEventListener("click", function(e) {
        win2.close();
    });
    labelClose.addEventListener("click", function(e) {
        win2.close();
    });

}

//* Position
function positionSection() {
    showPosition();
    $.positionView.addEventListener("click", function(e) {
        if (canEdit) {
            if (OS_IOS) {
                Alloy.Globals.activityIndicator.show();
            }
            positionList = query.getLOPAPositionForPicklist();
            var zoneListTemp = query.getEquipmentZoneList();

            var data = [];
            var data1 = [];

            if (category == SAFETY_EQUIPMENT && zoneListTemp != null && zoneListTemp.length > 0) {
                for (var i = 0; i < zoneListTemp.length; i++) {
                    data.push({
                        name : zoneListTemp[i]
                    });
                }
            }

            if (positionList != null && positionList.length > 0) {
                for (var i = 0; i < positionList.length; i++) {
                    data.push({
                        name : positionList[i].position
                    });
                }
            }

            for (var i = 0; i < positionGroupMem.length; i++) {
                data1.push({
                    name : positionGroupMem[i]
                });
            }

            var positionPickList = Alloy.createController("position_pick_list", [getPositionOfLOPAFromPicklist, data, "SELECT POSITION", 1, true, data1]).getView();
            if (OS_IOS) {
                Alloy.Globals.navGroupWin.openWindow(positionPickList);
            } else {
                positionPickList.open();
            }

            data = null;
            data1 = null;
        }
    });
}

function getPositionOfLOPAFromPicklist(positionArg) {
    positionGroupMem = [];
    for (var i = 0; i < positionArg.length; i++) {
        positionGroupMem.push(positionArg[i].name);
    }
    showPosition();
    isIncidentDetailEdited = true;
    positionArg = null;
}

function showPosition() {
    var positionStr = "";

    if (positionGroupMem != null && positionGroupMem.length > 0) {
        if (positionGroupMem[0] != null) {
            positionForFilterEquipment = query.getEquipmentTypeByPosition(positionGroupMem[0]);
            if (!utility.isEmpty(positionForFilterEquipment)) {
                positionForFilterEquipment = positionForFilterEquipment.substring(0, 1).toUpperCase();
            }
        }
        if (positionGroupMem.length == 1) {
            if (positionGroupMem[0] != null)
                positionStr = positionGroupMem[0].length > 0 ? positionGroupMem[0] : "";
        } else {
            for (var i = 0; i < positionGroupMem.length - 1; i++) {
                if (positionGroupMem[i] != null && positionGroupMem[i].length > 0) {
                    positionStr += positionGroupMem[i] + ", ";
                } else {
                    positionStr += "";
                }
            }
            if (positionGroupMem[positionGroupMem.length - 1] != null && positionGroupMem[positionGroupMem.length - 1].length > 0) {
                positionStr += positionGroupMem[positionGroupMem.length - 1] != null ? positionGroupMem[positionGroupMem.length - 1] : "";
            }
        }
    }

    $.positionLabel.text = positionStr;

    if (isSubmitted || isVoided || isSynced) {
        $.positionHasChildArrowDown.visible = false;
    } else {
        $.positionHasChildArrowDown.visible = true;
    }
}

//* Equpment / Part
function showEquipmentPart() {
    if (isSubmitted || isVoided || isSynced) {
        $.equipmentHasChildArrowDown.visible = false;
    } else {
        $.equipmentHasChildArrowDown.visible = true;
    }
    var equipmentStr = "";
    var partStr = "";
    var equipmentStr = "";
    if (equipment != null) {
        if (equipment.name != null && equipment.name.length > 0) {
            equipmentStr = equipment.name;
        }
    }
    var partStr = "";
    if (part != null) {
        if (part.name != null && part.name.length > 0) {
            partStr = " / " + part.name;
        }
    }

    equipmentPartStr = equipmentStr + partStr;
    $.equipmentPartLabel.text = equipmentPartStr;

}

// $.equipmentPartLabel.addEventListener('postlayout', function() {
    // if (equipmentPartStr.length > 0) {
        // var rowHeight = $.equipmentPartView.toImage().height;
        // if ($.equipmentPartLabel.toImage().height + 10 > rowHeight) {
            // rowHeight = $.equipmentPartLabel.toImage().height + 10;
            // $.equipmentPartHeaderLabel.height = rowHeight;
        // }
    // } else {
    // }
// });

function equipmentPartSection() {
    showEquipmentPart();
    $.equipmentPartView.addEventListener("click", function(e) {
        if (canEdit) {
            if (OS_IOS) {
                Alloy.Globals.activityIndicator.show();
            }
            setTimeout(function() {
                if (category == SAFETY_EQUIPMENT) {

                    var equipmentCategoryView = Alloy.createController("equipments/equipment_category", [getEquipmentAndPartFromPicklist, "", ""]).getView();
                    if (OS_IOS) {
                        Alloy.Globals.navGroupWin.openWindow(equipmentCategoryView);
                    } else {
                        equipmentCategoryView.open();
                    }

                } else if (category == AC_MAINTENANCE) {
                    var equipmentCategoryView = Alloy.createController("equipments/equipment_list", [getEquipmentAndPartFromPicklist, null, positionForFilterEquipment]).getView();
                    if (OS_IOS) {
                        Alloy.Globals.navGroupWin.openWindow(equipmentCategoryView);
                    } else {
                        equipmentCategoryView.open();
                    }
                } else {

                }
            }, 200);
        }

    });
}

function getEquipmentAndPartFromPicklist(value) {
    if (value != null) {
        equipment = value;
        part = value.part;
        ataChapter = value.ataChapter;
        ataChapterSection();
        equipmentPartSelected();
        $.subjectTextField.value = $.subjectTextField.value + " " + ataChapter;
        isIncidentDetailEdited = true;
    }
}

function equipmentPartSelected() {
    showEquipmentPart();
}

//* ATA Chapter
function ataChapterSection() {
    $.ataChapterLabel.text = ataChapter;
}

//* Condition
function showCondition() {
    if (condition != null && condition != "") {
        if (condition.indexOf(',') != -1) {
            var curConditionList = condition.split(',');
            for (var j = 0; j < curConditionList.length; j++) {
                selectedConditionList.push({
                    name : curConditionList[j].trim()
                });
            }
        } else {
            selectedConditionList[0] = {
                name : condition.trim()
            };
        }
    }

    if (isSubmitted || isVoided || isSynced) {
        $.conditionHasChildArrowDown.visible = false;
    } else {
        $.conditionHasChildArrowDown.visible = true;
    }

    $.conditionLabel.text = condition;
}

// $.conditionLabel.addEventListener('postlayout', function() {
    // if (condition.length > 0) {
        // var conditionValueToImage = $.conditionLabel.toImage();
        // var rowHeight = $.conditionView.toImage().height;
        // if (conditionValueToImage.height + 10 > rowHeight) {
            // rowHeight = conditionValueToImage.height + 10;
            // $.conditionHeaderLabel.height = rowHeight;
        // }
    // } else {
    // }
// });

function getConditionOfEquipmentFromPicklist(conditionArg) {
    selectedConditionList = conditionArg;

    var strForShow = "";
    var strForSFDC = "";
    if (conditionArg != null && conditionArg.length > 0) {
        for (var i = 0; i < conditionArg.length - 1; i++) {
            strForShow += conditionArg[i].name + ", ";
            strForSFDC += conditionArg[i].name + ";";
        }
        strForShow += conditionArg[conditionArg.length - 1].name;
        strForSFDC += conditionArg[conditionArg.length - 1].name;
        condition = strForShow;
        conditionForSFDC = strForSFDC;
    }

    showCondition();

    strForSFDC = null;
    strForShow = null;
    strForDB = null;
}

function conditionSection() {
    showCondition();
    $.conditionView.addEventListener("click", function(e) {
        if (canEdit) {
            if (OS_IOS) {
                Alloy.Globals.activityIndicator.show();
            }
            conditionList = query.getConditionList();
            var pickListView = Alloy.createController("pick_list", [getConditionOfEquipmentFromPicklist, conditionList, "SELECT CONDITION", 1, true, selectedConditionList]).getView();
            if (OS_IOS) {
                Alloy.Globals.navGroupWin.openWindow(pickListView);
            } else {
                pickListView.open();
            }
            conditionList = null;
        }
    });
}

//* Cabin / Flight Log
function cabinFlightLogGroupSection() {
    var flightLogBtnImagePath;
    var cabinLogBtnImagePath;
    if (logGroup == FLIGHT_DECK_LOG) {
        flightLogBtnImagePath = '/images/btn_button_on.png';
        cabinLogBtnImagePath = '/images/btn_button_off.png';
    } else if (logGroup == CABIN_LOG) {
        flightLogBtnImagePath = '/images/btn_button_off.png';
        cabinLogBtnImagePath = '/images/btn_button_on.png';
    } else {
        if (category == SAFETY_EQUIPMENT) {
            flightLogBtnImagePath = '/images/btn_button_on.png';
            cabinLogBtnImagePath = '/images/btn_button_off.png';
        } else if (category == AC_MAINTENANCE) {
            cabinLogBtnImagePath = '/images/btn_button_on.png';
            flightLogBtnImagePath = '/images/btn_button_off.png';
        }
    }
    $.flightLogBtn.image = flightLogBtnImagePath;
    $.cabinLogBtn.image = cabinLogBtnImagePath;

    $.cabinLogBtn.addEventListener("click", function(e) {
        if (canEdit) {
            $.cabinLogBtn.image = '/images/btn_button_on.png';
            $.flightLogBtn.image = '/images/btn_button_off.png';
            logGroup = CABIN_LOG;
            logType = "C";
            isIncidentDetailEdited = true;
            cabinFlightLogNoSection();
        }
    });

    $.flightLogBtn.addEventListener("click", function(e) {
        if (canEdit) {
            $.cabinLogBtn.image = '/images/btn_button_off.png';
            $.flightLogBtn.image = '/images/btn_button_on.png';
            logGroup = FLIGHT_DECK_LOG;
            logType = "F";
            isIncidentDetailEdited = true;
            cabinFlightLogNoSection();

            var _promptView = new Alloy.createController("common/alertPrompt", {
                title : "Alert",
                message : "Please get Flight Deck Log number from cockpit.",
                okText : "OK",
                disableCancel : true,
                onOk : function() {
                }
            }).getView();
            _promptView.open();
        }

    });

    flightLogBtnImagePath = null;
    cabinLogBtnImagePath = null;
    flightLogBtn = null;
    cabinLogBtn = null;
}

//* Cabin / Flight Deck Log Number
function splitSequenceNumber() {
    if (sequenceNumber != null && sequenceNumber.length == 12) {// Check log digit.
        acReg = sequenceNumber.substring(0, 2);
        seqNo = sequenceNumber.substring(2, 5);
        logType = sequenceNumber.substring(5, 6);
        logDate = sequenceNumber.substring(6);

        if (logType == "F") {
            logGroup = FLIGHT_DECK_LOG;
        } else if (logType == "C") {
            logGroup = CABIN_LOG;
        } else {
            logGroup = 0;
        }
    } else {
        var flight = query.getFlight(currentFlightId);
        if (flight != null) {
            var acRegFullName = flight.aircraftRegistration;
            if (acRegFullName != null && acRegFullName.length > 0)
                acReg = acRegFullName.substr(-2);
            else
                acReg = "";
        } else {
            acReg = "";
        }

        seqNo = !utility.isEmpty($.seqNoTextField.value) ? $.seqNoTextField.value + "" : "";
        if (logGroup == FLIGHT_DECK_LOG)
            logType = "F";
        else if (logGroup == CABIN_LOG)
            logType = "C";
        else {
            if (category == SAFETY_EQUIPMENT)
                logType = "F";
            else if (category == AC_MAINTENANCE)
                logType = "C";
        }
        logDate = utility.getDateDDMMYY();
    }
}

function cabinFlightLogNoSection() {
    //Titanium.UI.KEYBOARD_TYPE_NUMBERS_PUNCTUATION;
    $.acRegLabel.text = acReg;
    $.seqNoTextField.value = seqNo;
    $.logTypeLogDateLabel.text = logType + " " + logDate + " (UTC)";
    if (seqNo != null && seqNo.length == 3)
        sequenceNumber = acReg + seqNo + logType + logDate;
    else
        sequenceNumber = "";
}

$.seqNoTextField.addEventListener('change', function(e) {
    if (canEdit) {
        isIncidentDetailEdited = true;
        if (OS_IOS) {
            $.seqNoTextField.value = utility.checkInputKeyMustBeNumber($.seqNoTextField.value);
        } else {
            if (!this.value) {
                return;
            }
            if (changeState == 0) {
                changeState = 1;
                $.seqNoTextField.setValue(utility.checkInputKeyMustBeNumber(this.value));
            } else {
                if (changeState == 1) {
                    changeState = 2;
                    var len = $.seqNoTextField.getValue().length;
                    $.seqNoTextField.setSelection(len, len);
                } else {
                    changeState = 0;
                }
            }

        }

    }
});
if (OS_IOS) {
    $.seqNoTextField.keyboardType = Titanium.UI.KEYBOARD_TYPE_PHONE_PAD;
} else {
    $.seqNoTextField.keyboardType = Titanium.UI.KEYBOARD_NUMBER_PAD;
}

// Date of cabin/flight log
$.logTypeLogDateLabel.addEventListener("click", function(e) {
    if (canEdit) {
        isIncidentDetailEdited = true;
        var winDatePicker = Ti.UI.createWindow({
            fullscreen : false,
            backgroundColor : '#40000000',
        });

        var today = new Date();
        var year = today.getFullYear();
        var minYear = year - 1;
        var picker = Ti.UI.createPicker({
            type : Ti.UI.PICKER_TYPE_DATE,
            minDate : new Date(minYear, 0, 1),
            maxDate : new Date(),
            value : new Date(),
            bottom : "5%"
        });

        picker.addEventListener('change', function(e) {
            var day = new Date(e.value);
            var dd = day.getUTCDate();
            var mm = day.getUTCMonth() + 1;
            // Jan is Zero
            var yyyy = day.getUTCFullYear() + "";

            if (dd < 10) {
                dd = '0' + dd;
            } else {
                dd = dd + "";
            }
            if (mm < 10) {
                mm = '0' + mm;
            } else {
                mm = mm + "";
            }
            logDate = dd + mm + yyyy.substring(2, yyyy.length);
            $.logTypeLogDateLabel.text = logType + " " + logDate + " (UTC)";
        });

        winDatePicker.add(picker);
        winDatePicker.open();

        winDatePicker.addEventListener("click", function(e) {
            winDatePicker.close();
        });

    }
});

//* Person Involve
function personInvolveSection() {
    if ((paxInvolvedMem != null && paxInvolvedMem.length > 0) || (crewInvolvedMem != null && crewInvolvedMem.length > 0) || (staffGroupMem != null && staffGroupMem.length > 0)) {
        var needHasChild = true;
    } else {
        if (isSubmitted || isVoided || isSynced) {
            $.persontInvolvedHasChildArrowRight.visible = false;
            var needHasChild = false;
        } else {
            $.persontInvolvedHasChildArrowRight.visible = true;
            var needHasChild = true;
        }
    }

    var paxCount;
    var crewCount;
    var staffCount;
    if (paxInvolvedMem != null && paxInvolvedMem.length > 0) {
        paxCount = paxInvolvedMem.length;
    } else {
        paxCount = 0;
    }
    if (crewInvolvedMem != null && crewInvolvedMem.length > 0) {
        crewCount = crewInvolvedMem.length;
    } else {
        crewCount = 0;
    }
    if (staffGroupMem != null && staffGroupMem.length > 0) {
        staffCount = staffGroupMem.length;
    } else {
        staffCount = 0;
    }
    $.personInvolvedLabel.text = "Passenger " + "(" + paxCount + ")    " + "Crew " + "(" + crewCount + ")    " + "Staff " + "(" + staffCount + ")";
    if (needHasChild) {
        $.personInvolveView.addEventListener("click", function(e) {
            var paxMaster = [];
            if (paxGroupMem != null && paxGroupMem.length > 0) {
                if (paxGroupMem[0] != null)
                    if (paxGroupMem[0].type != PERSON_INVOLVED) {
                        paxMaster = paxGroupMem[0];
                    } else {
                        paxMaster = null;
                    }
            }
            isIncidentDetailEdited = true;
            if (crewGroupMem != null && crewGroupMem.length > 0) {
                var crewMaster = crewGroupMem[0];
            } else {
                var crewMaster = null;
            }

            var personInvolvedView = Alloy.createController("incidents/person_involved", {
                isNew : isNew,
                incidentId : incidentId,
                isSubmitted : isSubmitted || isVoided || isSynced,
                paxGroupMem : paxInvolvedMem,
                crewGroupMem : crewInvolvedMem,
                staffGroupMem : staffGroupMem,
                paxMaster : paxMaster,
                crewMaster : crewMaster
            }).getView();
            if (OS_IOS) {
                Alloy.Globals.navGroupWin.openWindow(personInvolvedView);
            } else {
                personInvolvedView.open();
            }
        });
    }
}

function showPersonInvolveQuantity() {
    if (isSubmitted || isVoided || isSynced) {
        var needHasChild = false;
    } else {
        var needHasChild = true;
    }

    var paxCount = 0;
    var crewCount = 0;
    var staffCount = 0;
    if (paxInvolvedMem != null && paxInvolvedMem.length > 0) {
        paxCount = paxInvolvedMem.length;
    } else {
        paxCount = 0;
    }
    if (crewInvolvedMem != null) {
        crewCount = crewInvolvedMem.length;
    } else {
        crewCount = 0;
    }
    if (staffGroupMem != null) {
        staffCount = staffGroupMem.length;
    } else {
        staffCount = 0;
    }
    $.personInvolvedLabel.text = "Passenger " + "(" + paxCount + ")    " + "Crew " + "(" + crewCount + ")    " + "Staff " + "(" + staffCount + ")";
}

//* Detail
function detailSection() {
    if (detail != null && detail.length > 0) {
        $.detailTextField.value = detail;
    } else {
        $.detailTextField.value = "";
    }
}

$.detailTextField.addEventListener("change", function(e) {
    isIncidentDetailEdited = true;
});

//* Attachment Image and Video
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

    switch (attachmentIndex) {
    case 1 :
        $.cameraBtn1.image = resizedImage;
        break;
    case 2 :
        $.cameraBtn2.image = resizedImage;
        break;
    case 3 :
        $.cameraBtn3.image = resizedImage;
        break;
    default :
        $.cameraBtn1.image = null;
        $.cameraBtn2.image = null;
        $.cameraBtn3.image = null;
        break;
    }

    return resizedImage;
}

function addAttachment(name, detail, type) {
    var attachment = {
        id : attachmentIndex,
        name : name,
        detail : "",
        incidentId : incidentId
    };

    switch (attachmentIndex) {
    case 1 :
        attachment1.push(attachment);
        break;
    case 2 :
        attachment2.push(attachment);
        break;
    case 3 :
        attachment3.push(attachment);
        break;
    default :
        attachment1 = [];
        attachment2 = [];
        attachment3 = [];
        break;
    }
}

function cameraFunction(menuIndex) {
    if (menuIndex == 1) {// Take photo
        //     menuIndex = 0;
        //from the camera
        Ti.Media.showCamera({
            success : function(event) {
                var image = event.media;
                if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
                    var image = event.media;
                    var incidentAttachment = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'incidentAttachment');
                    if (!incidentAttachment.exists()) {
                        incidentAttachment.createDirectory();
                    }

                    var filename = "image" + "_" + incidentId + "_" + utility.getDateTimeForImageName() + '.jpg';
                    var imageFile = Ti.Filesystem.getFile(incidentAttachment.resolve(), filename);
                    var resizeImg = resizeImage(image);

                    switch (attachmentIndex) {
                    case 1 :
                        if (attachment1 != null && attachment1.length > 0)
                            if (attachment1[0].name.length > 0) {
                                var attachmentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment1[0].name);
                                attachmentFile.deleteFile();
                                attachment1.remove(0);
                            }
                        break;
                    case 2 :
                        if (attachment2 != null && attachment2.length > 0)
                            if (attachment2[0].name.length > 0) {
                                var attachmentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment2[0].name);
                                attachmentFile.deleteFile();
                                attachment2.remove(0);
                            }
                        break;
                    case 3 :
                        if (attachment3 != null && attachment3.length > 0)
                            if (attachment3[0].name.length > 0) {
                                var attachmentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment3[0].name);
                                attachmentFile.deleteFile();
                                attachment3.remove(0);
                            }
                        break;
                    }

                    // Ti.API.info("Image Size:");
                    // Ti.API.info(resizeImg.getSize()); //518,400B
                    if (imageFile.write(resizeImg) === false) {
                        // handle write error
                        //                        Ti.API.info("Error writing incident image : " + incidentId);
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
        //     menuIndex = 0;
        //obtain an image from the gallery
        Ti.Media.openPhotoGallery({
            success : function(event) {
                var image = event.media;
                var incidentAttachment = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'incidentAttachment');
                if (!incidentAttachment.exists()) {
                    incidentAttachment.createDirectory();
                }

                var filename = "image" + "_" + incidentId + "_" + utility.getDateTimeForImageName() + '.jpg';
                var imageFile = Ti.Filesystem.getFile(incidentAttachment.resolve(), filename);
                var resizeImg = resizeImage(image);

                switch (attachmentIndex) {
                case 1 :
                    if (attachment1 != null && attachment1.length > 0)
                        if (attachment1[0].name.length > 0) {
                            var attachmentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment1[0].name);
                            attachmentFile.deleteFile();
                            attachment1.remove(0);
                        }
                    break;
                case 2 :
                    if (attachment2 != null && attachment2.length > 0)
                        if (attachment2[0].name.length > 0) {
                            var attachmentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment2[0].name);
                            attachmentFile.deleteFile();
                            attachment2.remove(0);
                        }
                    break;
                case 3 :
                    if (attachment3 != null && attachment3.length > 0)
                        if (attachment3[0].name.length > 0) {
                            var attachmentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment3[0].name);
                            attachmentFile.deleteFile();
                            attachment3.remove(0);
                        }
                    break;
                }

                if (imageFile.write(resizeImg) === false) {
                    // handle write error
                    //                    Ti.API.info("Error writing incident image : " + incidentId);
                } else {

                }

                addAttachment(filename, "", "photo");
            },
            cancel : function() {
                //user cancelled the action from within
                //the photo gallery
            },
            mediaTypes : Ti.Media.MEDIA_TYPE_PHOTO
        });
    } else if (menuIndex == 3) {// View Image
        //     menuIndex = 0;
        switch (attachmentIndex) {
        case 1 :
            if (attachment1 != null && attachment1.length > 0 && attachment1 != undefined) {
                fullpath = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment1[0].name;
                viewFullScreenImage(fullpath);
            }
            break;
        case 2 :
            if (attachment2 != null && attachment2.length > 0 && attachment2 != undefined) {
                fullpath = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment2[0].name;
                viewFullScreenImage(fullpath);
            }
            break;
        case 3 :
            if (attachment3 != null && attachment3.length > 0 && attachment3 != undefined) {
                fullpath = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment3[0].name;
                viewFullScreenImage(fullpath);
            }
            break;
        }
    } else if (menuIndex == 4) {// Video recorder
        var videoURL = null;
        //ios
        if (OS_IOS) {//(Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad') {
            //record for iphone
            Ti.Media.showCamera({
                success : function(event) {
                    var videoMedia = event.media;

                    var incidentAttachment = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'incidentAttachment');
                    if (!incidentAttachment.exists()) {
                        incidentAttachment.createDirectory();
                    }

                    var filename = "video" + "_" + incidentId + "_" + utility.getDateTimeForImageName() + '.mp4';
                    var videoFile = Ti.Filesystem.getFile(incidentAttachment.resolve(), filename);
                    switch (attachmentIndex) {
                    case 1 :
                        if (attachment1 != null && attachment1.length > 0)
                            if (attachment1[0].name.length > 0) {
                                var attachmentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment1[0].name);
                                attachmentFile.deleteFile();
                                attachment1.remove(0);
                            }
                        break;
                    case 2 :
                        if (attachment2 != null && attachment2.length > 0)
                            if (attachment2[0].name.length > 0) {
                                var attachmentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment2[0].name);
                                attachmentFile.deleteFile();
                                attachment2.remove(0);
                            }
                        break;
                    case 3 :
                        if (attachment3 != null && attachment3.length > 0)
                            if (attachment3[0].name.length > 0) {
                                var attachmentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment3[0].name);
                                attachmentFile.deleteFile();
                                attachment3.remove(0);
                            }
                        break;
                    }

                    // Ti.API.info("Video Size:");
                    // Ti.API.info(videoMedia.getSize()); //944,815B
                    if (videoFile.write(videoMedia) === false) {
                    } else {

                    }
                    addAttachment(filename, "", "video");
                    //                   Ti.API.info(incidentAttachment.nativePath);
                    switch (attachmentIndex) {
                    case 1 :
                        $.cameraBtn1.image = "/images/ic_video.png";
                        break;
                    case 2 :
                        $.cameraBtn2.image = "/images/ic_video.png";
                        break;
                    case 3 :
                        $.cameraBtn3.image = "/images/ic_video.png";
                        break;
                    default :
                        $.cameraBtn1.image = null;
                        $.cameraBtn2.image = null;
                        $.cameraBtn3.image = null;
                        break;
                    }
                },
                cancel : function() {

                },
                error : function(error) {
                    // create alert
                    var a = Ti.UI.createAlertDialog({
                        title : 'Video'
                    });
                    // set message
                    if (error.code == Ti.Media.NO_VIDEO) {
                        a.setMessage('Device does not have video recording capabilities');
                    } else {
                        a.setMessage('Unexpected error: ' + error.code);
                    }
                    a.show();
                    // show alert
                },
                mediaTypes : Ti.Media.MEDIA_TYPE_VIDEO,
                videoMaximumDuration : 10000,
                videoQuality : Ti.Media.QUALITY_MEDIUM
            });
        } else {//android
            // Start an activity with an intent to capture video
            // http://developer.android.com/reference/android/provider/MediaStore.html#ACTION_VIDEO_CAPTURE
            var intent = Titanium.Android.createIntent({
                action : 'android.media.action.VIDEO_CAPTURE'
            });
            intent.putExtra("android.intent.extra.videoQuality", 0);
            intent.putExtra("android.intent.extra.durationLimit", 10);
            // intent.putExtra("android.intent.extra.sizeLimit",0.05);

            $.incidentDetailWindow.getActivity();

            var activity = $.incidentDetailWindow.getActivity();

            activity.startActivityForResult(intent, function(e) {
                if (e.resultCode == Ti.Android.RESULT_OK) {
                    if (e.intent.data != null) {
                        // If everything went OK, save a reference to the video URI

                        var videoUri = e.intent.data;
                        var videoMedia = Ti.Filesystem.getFile(videoUri);

                        var incidentAttachment = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'incidentAttachment');
                        if (!incidentAttachment.exists()) {
                            incidentAttachment.createDirectory();
                        }

                        var filename = "video" + "_" + incidentId + "_" + utility.getDateTimeForImageName() + '.mp4';
                        var videoFile = Ti.Filesystem.getFile(incidentAttachment.resolve(), filename);

                        switch (attachmentIndex) {
                        case 1 :
                            if (attachment1 != null && attachment1.length > 0)
                                if (attachment1[0].name.length > 0) {
                                    var attachmentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment1[0].name);
                                    attachmentFile.deleteFile();
                                    attachment1.remove(0);
                                }
                            break;
                        case 2 :
                            if (attachment2 != null && attachment2.length > 0)
                                if (attachment2[0].name.length > 0) {
                                    var attachmentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment2[0].name);
                                    attachmentFile.deleteFile();
                                    attachment2.remove(0);
                                }
                            break;
                        case 3 :
                            if (attachment3 != null && attachment3.length > 0)
                                if (attachment3[0].name.length > 0) {
                                    var attachmentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment3[0].name);
                                    attachmentFile.deleteFile();
                                    attachment3.remove(0);
                                }
                            break;
                        }

                        videoMedia.copy(videoFile.nativePath);

                        addAttachment(filename, "", "video");
                        switch (attachmentIndex) {
                        case 1 :
                            $.cameraBtn1.image = "/images/ic_video.png";
                            break;
                        case 2 :
                            $.cameraBtn2.image = "/images/ic_video.png";
                            break;
                        case 3 :
                            $.cameraBtn3.image = "/images/ic_video.png";
                            break;
                        default :
                            $.cameraBtn1.image = null;
                            $.cameraBtn2.image = null;
                            $.cameraBtn3.image = null;
                            break;
                        }

                    } else {
                        Ti.API.error('Could not retrieve media URL!');
                    }
                } else if (e.resultCode == Ti.Android.RESULT_CANCELED) {
                    Ti.API.trace('User cancelled video capture session.');
                } else {
                    Ti.API.error('Could not record video!');
                }
            });
        }

    } else if (menuIndex == 5) {// Select Video
        if (OS_IOS)//ios
        {
            Ti.Media.openPhotoGallery({
                success : function(event) {
                    var videoMedia = event.media;

                    var incidentAttachment = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'incidentAttachment');
                    if (!incidentAttachment.exists()) {
                        incidentAttachment.createDirectory();
                    }

                    var filename = "video" + "_" + incidentId + "_" + utility.getDateTimeForImageName() + '.mp4';
                    var videoFile = Ti.Filesystem.getFile(incidentAttachment.resolve(), filename);

                    // Ti.API.info("Raw size:");
                    // Ti.API.info(videoMedia.getSize());
                    // if(videoMedia.getSize()) {
                    //
                    // }
                    if (videoMedia.getSize() < ATTACHMENT_SIZE_LIMIT) {
                        if (videoFile.write(videoMedia) === false) {
                        } else {
                            switch (attachmentIndex) {
                            case 1 :
                                if (attachment1 != null && attachment1.length > 0)
                                    if (attachment1[0].name.length > 0) {
                                        var attachmentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment1[0].name);
                                        attachmentFile.deleteFile();
                                        attachment1.remove(0);
                                    }
                                break;
                            case 2 :
                                if (attachment2 != null && attachment2.length > 0)
                                    if (attachment2[0].name.length > 0) {
                                        var attachmentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment2[0].name);
                                        attachmentFile.deleteFile();
                                        attachment2.remove(0);
                                    }
                                break;
                            case 3 :
                                if (attachment3 != null && attachment3.length > 0)
                                    if (attachment3[0].name.length > 0) {
                                        var attachmentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment3[0].name);
                                        attachmentFile.deleteFile();
                                        attachment3.remove(0);
                                    }
                                break;
                            }
                            addAttachment(filename, "", "video");
                            switch (attachmentIndex) {
                            case 1 :
                                $.cameraBtn1.image = "/images/ic_video.png";
                                break;
                            case 2 :
                                $.cameraBtn2.image = "/images/ic_video.png";
                                break;
                            case 3 :
                                $.cameraBtn3.image = "/images/ic_video.png";
                                break;
                            default :
                                $.cameraBtn1.image = null;
                                $.cameraBtn2.image = null;
                                $.cameraBtn3.image = null;
                                break;
                            }
                        }
                    } else {
                        var _promptView = new Alloy.createController("common/alertPrompt", {
                            title : "Alert",
                            message : "This video is over the limited size 6 MB.\nPlease select another one.",
                            okText : "OK",
                            disableCancel : true,
                            onOk : function() {
                            }
                        }).getView();
                        _promptView.open();
                    }

                },
                cancel : function() {
                    //user cancelled the action from within
                    //the photo gallery
                },
                mediaTypes : Ti.Media.MEDIA_TYPE_VIDEO
            });

        } else {// Android

            var intent = Titanium.Android.createIntent({
                action : Ti.Android.ACTION_PICK,
                type : "video/*"
            });
            //android.media.action.VIDEO_CAPTURE
            intent.addCategory(Ti.Android.CATEGORY_DEFAULT);

            $.incidentDetailWindow.activity.startActivityForResult(intent, function(e) {
                if (e.error) {
                    Ti.UI.createNotification({
                        duration : Ti.UI.NOTIFICATION_DURATION_SHORT,
                        message : 'Error: ' + e.error
                    }).show();
                } else {
                    if (e.resultCode === Titanium.Android.RESULT_OK) {
                        var videoUri = e.intent.data;
                        var videoMedia = Ti.Filesystem.getFile(videoUri);

                        var incidentAttachment = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'incidentAttachment');
                        if (!incidentAttachment.exists()) {
                            incidentAttachment.createDirectory();
                        }

                        var filename = "video" + "_" + incidentId + "_" + utility.getDateTimeForImageName() + '.mp4';
                        var videoFile = Ti.Filesystem.getFile(incidentAttachment.resolve(), filename);

                        switch (attachmentIndex) {
                        case 1 :
                            if (attachment1 != null && attachment1.length > 0)
                                if (attachment1[0].name.length > 0) {
                                    var attachmentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment1[0].name);
                                    attachmentFile.deleteFile();
                                    attachment1.remove(0);
                                }
                            break;
                        case 2 :
                            if (attachment2 != null && attachment2.length > 0)
                                if (attachment2[0].name.length > 0) {
                                    var attachmentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment2[0].name);
                                    attachmentFile.deleteFile();
                                    attachment2.remove(0);
                                }
                            break;
                        case 3 :
                            if (attachment3 != null && attachment3.length > 0)
                                if (attachment3[0].name.length > 0) {
                                    var attachmentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment3[0].name);
                                    attachmentFile.deleteFile();
                                    attachment3.remove(0);
                                }
                            break;
                        }

                        videoMedia.copy(videoFile.nativePath);

                        addAttachment(filename, "", "video");
                        switch (attachmentIndex) {
                        case 1 :
                            $.cameraBtn1.image = "/images/ic_video.png";
                            break;
                        case 2 :
                            $.cameraBtn2.image = "/images/ic_video.png";
                            break;
                        case 3 :
                            $.cameraBtn3.image = "/images/ic_video.png";
                            break;
                        default :
                            $.cameraBtn1.image = null;
                            $.cameraBtn2.image = null;
                            $.cameraBtn3.image = null;
                            break;
                        }
                    } else {
                        Ti.UI.createNotification({
                            duration : Ti.UI.NOTIFICATION_DURATION_SHORT,
                            message : 'Canceled!'
                        }).show();
                    }
                }
            });

        }

    } else if (menuIndex == 6) {// Play Video
        switch (attachmentIndex) {
        case 1 :
            if (attachment1 != null && attachment1.length > 0 && attachment1 != undefined) {
                fullpath = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment1[0].name;
                playVideo(fullpath);
            }
            break;
        case 2 :
            if (attachment2 != null && attachment2.length > 0 && attachment2 != undefined) {
                fullpath = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment2[0].name;
                playVideo(fullpath);
            }
            break;
        case 3 :
            if (attachment3 != null && attachment3.length > 0 && attachment3 != undefined) {
                fullpath = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment3[0].name;
                playVideo(fullpath);
            }
            break;
        }

    } else {

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

var videoWin = Titanium.UI.createWindow({
    title : 'Test',
    backgroundColor : '#fff',
    fullscreen : false,
    exitOnClose : true
});

function playVideo(videoPath) {

    var activeMovie = Titanium.Media.createVideoPlayer({
        url : videoPath,
        backgroundColor : '#B3000000',
        mediaControlStyle : Titanium.Media.VIDEO_CONTROL_FULLSCREEN,
        fullscreen : false,
        autoplay : true
    });

    var closeButton = Ti.UI.createButton({
        title : "Exit Video",
        top : 30,
        height : 50,
        left : 30,
        right : 30
    });

    closeButton.addEventListener('click', function() {
        if (OS_IOS) {
            activeMovie.hide();
            activeMovie.release();
        }
        activeMovie = null;
        videoWin.close();
    });

    // activeMovie.addEventListener('touchend', function() {
    // if(OS_IOS) {
    // activeMovie.hide();
    // activeMovie.release();
    // }
    // activeMovie = null;
    // videoWin.close();
    // });

    activeMovie.add(closeButton);

    videoWin.add(activeMovie);
    videoWin.open();
}

function attachmentSection1() {
    if ($.attachmentView1.height == 0 && attachment1 != null && attachment1.length > 0) {
        attachmentCount = 1;
        $.attachmentView1.height = MID_ROW_HEIGHT;
        if (attachment1 != null && attachment1.length > 0 && attachment1 != undefined) {
            if (attachment1 != null && attachment1.length > 0)
                if (attachment1[0].name.length > 0) {
                    var strTemp = attachment1[0].name.substr(-3);
                    if (strTemp.toLowerCase() == "png" || strTemp.toLowerCase() == "jpg") {
                        $.cameraBtn1.image = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment1[0].name;
                        $.attachmentTextField1.value = attachment1[0].detail;
                    } else {
                        $.cameraBtn1.image = "/images/ic_video.png";
                        $.attachmentTextField1.value = attachment1[0].detail;
                    }
                }

        } else {
            $.cameraBtn1.image = null;
            $.attachmentTextField1.value = "";
        }
    }
    if ($.attachmentView2.height == 0 && attachment2 != null && attachment2.length > 0) {
        attachmentCount = 2;
        $.attachmentView2.height = MID_ROW_HEIGHT;
        if (attachment2 != null && attachment2.length > 0 && attachment2 != undefined) {
            if (attachment2 != null && attachment2.length > 0)
                if (attachment2[0].name.length > 0) {
                    var strTemp = attachment2[0].name.substr(-3);
                    if (strTemp.toLowerCase() == "png" || strTemp.toLowerCase() == "jpg") {
                        $.cameraBtn2.image = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment2[0].name;
                        $.attachmentTextField2.value = attachment2[0].detail;
                    } else {
                        $.cameraBtn2.image = "/images/ic_video.png";
                        $.attachmentTextField2.value = attachment2[0].detail;
                    }
                }
        } else {
            $.cameraBtn2.image = null;
            $.attachmentTextField2.value = "";
        }
    }
    if ($.attachmentView3.height == 0 && attachment3 != null && attachment3.length > 0) {
        attachmentCount = 3;
        $.attachmentView3.height = MID_ROW_HEIGHT;
        if (attachment3 != null && attachment3.length > 0 && attachment3 != undefined) {
            if (attachment3 != null && attachment3.length > 0)
                if (attachment3[0].name.length > 0) {
                    var strTemp = attachment3[0].name.substr(-3);
                    if (strTemp.toLowerCase() == "png" || strTemp.toLowerCase() == "jpg") {
                        $.cameraBtn3.image = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment3[0].name;
                        $.attachmentTextField3.value = attachment3[0].detail;
                    } else {
                        $.cameraBtn3.image = "/images/ic_video.png";
                        $.attachmentTextField3.value = attachment3[0].detail;
                    }
                }
        } else {
            $.cameraBtn3.image = null;
            $.attachmentTextField3.value = "";
        }
    }

    $.imageNumberLabel.text = "(" + attachmentCount + "/3)";
}

function attachmentSection() {
    if (attachmentCount > 0) {
        if ($.attachmentView1.height == 0) {
            $.attachmentView1.height = MID_ROW_HEIGHT;
        } else if ($.attachmentView2.height == 0) {
            $.attachmentView2.height = MID_ROW_HEIGHT;
        } else if ($.attachmentView3.height == 0) {
            $.attachmentView3.height = MID_ROW_HEIGHT;
        }
    }
}

$.addImageBtn.addEventListener('click', function(e) {
    if (canEdit) {
        attachmentCount++;
        if (attachmentCount < 4) {
            isIncidentDetailEdited = true;
            $.imageNumberLabel.text = "(" + attachmentCount + "/3)";
            attachmentSection();
        } else {
            attachmentCount = 3;
            $.imageNumberLabel.text = "(" + attachmentCount + "/3)";
        }
    }
});

// Add attachment menu
function createOptDialogCameraMenuBtn(dataArg, rowNumber) {
    var btnId = dataArg[0];
    var btnName = dataArg[1];

    if (rowNumber == 4) {
        var rowHeight = 85;
    } else if (rowNumber == 5) {
        var rowHeight = 68;
    } else if (rowNumber == 6) {
        var rowHeight = 57;
    } else {
        var rowHeight = 0;
    }

    var row = component.createOptionDialogBtn(btnId, rowNumber, null, rowHeight);
    row.add(component.createLabel(btnName, null));

    row.addEventListener("click", function(e) {
        if (e.source.id == undefined || e.source.idType == "btnRow") {
            if (e.source.parent.id == undefined) {
                btnId = e.source.id;
            } else {
                btnId = e.source.parent.id;
            }
            cameraMenuIndex = btnId;
        }
    });
    btnId = null;
    btnName = null;
    imgPathName = null;
    return row;
}

$.cameraBtn1.addEventListener('click', function(e) {
    if (canEdit) {
        var data = [];
        var tableData = [];
        var menuRowNuber = 6;
        var menuHeight = "60%";
        var isActive = true;

        attachmentIndex = 1;
        data = component.cameraMenuData();

        if ($.cameraBtn1.image) {
            if (attachment1 != null && attachment1.length > 0)
                if (attachment1[0].name.length > 0) {
                    var strTemp = attachment1[0].name.substr(-3);
                    if (strTemp.toLowerCase() == "png" || strTemp.toLowerCase() == "jpg") {
                        data.remove(5);
                        if (isSubmitted || isVoided || isSynced) {
                            var dataTemp = component.cameraMenuData();
                            data = [];
                            data.push(dataTemp[2]);
                            menuRowNuber = 1;
                            menuHeight = "90%";
                        } else {
                            menuRowNuber = 5;
                        }
                    } else {
                        data.remove(2);
                        if (isSubmitted || isVoided || isSynced) {
                            var dataTemp = component.cameraMenuData();
                            data = [];
                            data.push(dataTemp[5]);
                            menuRowNuber = 1;
                            menuHeight = "90%";
                        } else {
                            menuRowNuber = 5;
                        }
                    }
                }
        } else {
            if (isSubmitted || isVoided || isSynced) {
                data = [];
                menuRowNuber = 0;
                isActive = false;
            } else {
                data.remove(2);
                data.remove(4);
                menuRowNuber = 4;
            }
        }

        if (isActive) {
            for (var i = 0; i < menuRowNuber; i++) {
                tableData.push(createOptDialogCameraMenuBtn(data[i], menuRowNuber));
            }

            var win2 = component.createOptionDialogWindow(tableData, menuHeight);
            data = null;
            tableData = null;

            win2.open();
            win2.addEventListener("click", function(e) {
                win2.close();
                cameraFunction(cameraMenuIndex);
                cameraMenuIndex = 0;
            });
        }

    }
});

$.cameraBtn2.addEventListener('click', function(e) {
    if (canEdit) {
        attachmentIndex = 2;
        var data = [];
        var menuHeight = "60%";
        var isActive = true;

        data = component.cameraMenuData();
        var tableData = [];

        if ($.cameraBtn2.image) {
            if (attachment2 != null && attachment2.length > 0)
                if (attachment2[0].name.length > 0) {
                    var strTemp = attachment2[0].name.substr(-3);
                    if (strTemp.toLowerCase() == "png" || strTemp.toLowerCase() == "jpg") {
                        data.remove(5);
                        if (isSubmitted || isVoided || isSynced) {
                            var dataTemp = component.cameraMenuData();
                            data = [];
                            data.push(dataTemp[2]);
                            menuRowNuber = 1;
                            menuHeight = "90%";
                        } else {
                            menuRowNuber = 5;
                        }
                    } else {
                        data.remove(2);
                        if (isSubmitted || isVoided || isSynced) {
                            var dataTemp = component.cameraMenuData();
                            data = [];
                            data.push(dataTemp[5]);
                            menuRowNuber = 1;
                            menuHeight = "90%";
                        } else {
                            menuRowNuber = 5;
                        }
                    }
                }
        } else {
            if (isSubmitted || isVoided || isSynced) {
                data = [];
                menuRowNuber = 0;
                isActive = false;
            } else {
                data.remove(2);
                data.remove(4);
                menuRowNuber = 4;
            }
        }

        if (isActive) {
            for (var i = 0; i < menuRowNuber; i++) {
                tableData.push(createOptDialogCameraMenuBtn(data[i], menuRowNuber));
            }
            var win2 = component.createOptionDialogWindow(tableData, menuHeight);
            data = null;
            tableData = null;

            win2.open();
            win2.addEventListener("click", function(e) {
                win2.close();
                cameraFunction(cameraMenuIndex);
                cameraMenuIndex = 0;
            });
        }

    }
});

$.cameraBtn3.addEventListener('click', function(e) {
    if (canEdit) {
        attachmentIndex = 3;
        var data = [];
        var menuHeight = "60%";
        var isActive = true;

        data = component.cameraMenuData();
        var tableData = [];

        if ($.cameraBtn3.image) {
            if (attachment3 != null && attachment3.length > 0)
                if (attachment3[0].name.length > 0) {
                    var strTemp = attachment3[0].name.substr(-3);
                    if (strTemp.toLowerCase() == "png" || strTemp.toLowerCase() == "jpg") {
                        data.remove(5);
                        if (isSubmitted || isVoided || isSynced) {
                            var dataTemp = component.cameraMenuData();
                            data = [];
                            data.push(dataTemp[2]);
                            menuRowNuber = 1;
                            menuHeight = "90%";
                        } else {
                            menuRowNuber = 5;
                        }
                    } else {
                        data.remove(2);
                        if (isSubmitted || isVoided || isSynced) {
                            var dataTemp = component.cameraMenuData();
                            data = [];
                            data.push(dataTemp[5]);
                            menuRowNuber = 1;
                            menuHeight = "90%";
                        } else {
                            menuRowNuber = 5;
                        }
                    }
                }
        } else {
            if (isSubmitted || isVoided || isSynced) {
                data = [];
                menuRowNuber = 0;
                isActive = false;
            } else {
                data.remove(2);
                data.remove(4);
                menuRowNuber = 4;
            }
        }

        if (isActive) {
            for (var i = 0; i < menuRowNuber; i++) {
                tableData.push(createOptDialogCameraMenuBtn(data[i], menuRowNuber));
            }
            var win2 = component.createOptionDialogWindow(tableData, menuHeight);
            data = null;
            tableData = null;

            win2.open();
            win2.addEventListener("click", function(e) {
                win2.close();
                cameraFunction(cameraMenuIndex);
                cameraMenuIndex = 0;
            });
        }

    }
});

// Remove image row
$.removeImageBtn1.addEventListener('click', function(e) {
    isIncidentDetailEdited = true;
    var _syncDataPromptView = new Alloy.createController("common/alertPrompt", {
        title : 'Confirm',
        message : 'Do you want to delete?',
        okText : "Yes",
        cancelText : "No",
        onOk : function() {
            if (attachmentCount > 0) {
                attachmentCount--;
                $.imageNumberLabel.text = "(" + attachmentCount + "/3)";
                $.cameraBtn1.image = null;
                $.attachmentTextField1.value = "";
                $.attachmentView1.height = 0;
                if (attachment1 != null && attachment1.length > 0)
                    if (attachment1[0].name.length > 0) {
                        // var attachmentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment1[0].name);
                        // attachmentFile.deleteFile();
                        attachment1NameDeleted = attachment1[0].name;
                        attachment1isDeleted = true;
                    }
                attachment1 = [];
            }
        }
    }).getView();
    _syncDataPromptView.open();

});

$.removeImageBtn2.addEventListener('click', function(e) {
    isIncidentDetailEdited = true;
    var _syncDataPromptView = new Alloy.createController("common/alertPrompt", {
        title : 'Confirm',
        message : 'Do you want to delete?',
        okText : "Yes",
        cancelText : "No",
        onOk : function() {
            if (attachmentCount > 0) {
                attachmentCount--;
                $.imageNumberLabel.text = "(" + attachmentCount + "/3)";
                $.cameraBtn2.image = null;
                $.attachmentTextField2.value = "";
                $.attachmentView2.height = 0;
                if (attachment2 != null && attachment2.length > 0)
                    if (attachment2[0].name.length > 0) {
                        // var attachmentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment2[0].name);
                        // attachmentFile.deleteFile();
                        attachment2NameDeleted = attachment2[0].name;
                        attachment2isDeleted = true;
                    }
                attachment2 = [];
            }
        }
    }).getView();
    _syncDataPromptView.open();
});

$.removeImageBtn3.addEventListener('click', function(e) {
    isIncidentDetailEdited = true;
    var _syncDataPromptView = new Alloy.createController("common/alertPrompt", {
        title : 'Confirm',
        message : 'Do you want to delete?',
        okText : "Yes",
        cancelText : "No",
        onOk : function() {
            if (attachmentCount > 0) {
                attachmentCount--;
                $.imageNumberLabel.text = "(" + attachmentCount + "/3)";
                $.cameraBtn3.image = null;
                $.attachmentTextField3.value = "";
                $.attachmentView3.height = 0;
                if (attachment3 != null && attachment3.length > 0)
                    if (attachment3[0].name.length > 0) {
                        // var attachmentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment3[0].name);
                        // attachmentFile.deleteFile();
                        attachment3NameDeleted = attachment3[0].name;
                        attachment3isDeleted = true;
                    }
                attachment3 = [];
            }
        }
    }).getView();
    _syncDataPromptView.open();
});

//* Change Seat
function changeSeatSection() {
    var tableRowData = [];
    if (isNew) {
        $.chageSeatLabel.text = "";
    } else {
        if (changeSeatMem != null && changeSeatMem.length > 0) {
            $.chageSeatLabel.text = "From seat No. " + (changeSeatMem[0].fromSeat != null ? changeSeatMem[0].fromSeat : "") + " class " + (changeSeatMem[0].fromClass != null ? changeSeatMem[0].fromClass : "") + " to seat No. " + (changeSeatMem[0].toSeat != null ? changeSeatMem[0].toSeat : "") + " class " + (changeSeatMem[0].toClass != null ? changeSeatMem[0].toClass : "") + " (" + "Reason for change: " + reasonForChangeSeatTemp + ")";
        }
    }
    $.changeSeatView.addEventListener("click", function(e) {
        if (canEdit) {
            if (e.source.id != "removeChangeSeatImage") {
                changSeatGlobalTemp = [];
                if (paxGroupMem != null && paxGroupMem.length > 0 && changeSeatMem.length == 0) {
                    var upgradeSeatLopaView = Alloy.createController("upgrade_seat/upgrade_seat_lopa", {
                        incId : incidentId,
                        isSubmitted : isSubmitted,
                        paxKey : paxGroupMem[0].paxKey,
                        passengerId : paxGroupMem[0].paxId,
                        accountId : paxGroupMem[0].accountId,
                        doFunction : CHANGE_SEAT_FUNCTION,
                        fromWhere : INCIDENT_DETAIL,
                    }).getView();
                    if (OS_IOS) {
                        Alloy.Globals.navGroupWin.openWindow(upgradeSeatLopaView);
                    } else {
                        upgradeSeatLopaView.open();
                    }

                } else {
                    var _promptView = new Alloy.createController("common/alertPrompt", {
                        title : "Alert",
                        message : changeSeatMem.length > 0 ? "Passenger already changed seat." : "Please select passenger before changing seat.",
                        okText : "OK",
                        disableCancel : true,
                        onOk : function() {
                        }
                    }).getView();
                    _promptView.open();
                }
            }

        }
    });
}

$.removeChangeSeatImage.addEventListener("click", function(e) {
    if (e.source.id != "changeSeatView") {
        var _syncDataPromptView = new Alloy.createController("common/alertPrompt", {
            title : 'Confirm',
            message : 'Do you want to remove change seat?',
            okText : "Yes",
            cancelText : "No",
            onOk : function() {
                changeGroupMemTempForRemove = [];
                changeGroupMemTempForRemove.push({
                    fromSeat : changeSeatMem[0].toSeat,
                    fromClass : changeSeatMem[0].toClass,
                    toSeat : changeSeatMem[0].fromSeat,
                    toClass : changeSeatMem[0].fromClass
                });
                changeSeatMem = [];
                $.chageSeatLabel.text = "";
                $.changeSeatRightArrowImage.left = 10;
                $.changeSeatRightArrowImage.width = 15;
                $.removeChangeSeatImage.width = 0;
            }
        }).getView();
        _syncDataPromptView.open();
    }
});

//* Compensation
function compensationSection() {
    if (isSubmitted || isVoided || isSynced) {
        $.compenRightArrowImage.hide();
    } else {
        $.compenRightArrowImage.show();
    }

    $.compensationView.addEventListener("click", function(e) {
        if (canEdit) {
            if (paxGroupMem != null && paxGroupMem.length > 0) {
                compensationGlobalTemp = compensationMem;
                isIncidentDetailEdited = true;
                var compIrregularityView = Alloy.createController("compensation/comp_irregularity", {
                    incidentId : incidentId,
                    isSubmitted : isSubmitted,
                    isSynced : isSynced,
                    isSeatUpgraded : isSeatUpgraded,
                    paxKey : paxGroupMem[0].paxKey,
                    passengerId : paxGroupMem[0].paxId,
                    accountId : paxGroupMem[0].accountId,
                    compensationMem : compensationMem
                }).getView();
                if (OS_IOS) {
                    Alloy.Globals.navGroupWin.openWindow(compIrregularityView);
                } else {
                    compIrregularityView.open();
                }
            } else {
                var _promptView = new Alloy.createController("common/alertPrompt", {
                    title : "Alert",
                    message : "Please select passenger before compensating.",
                    okText : "OK",
                    disableCancel : true,
                    onOk : function() {
                    }
                }).getView();
                _promptView.open();
            }

        }
    });

    compensationShow();
}

function compensationShow() {
    var len = $.compensationItemsView.children.length;
    for(var i = 0; i < len; i++) {
        $.compensationItemsView.remove($.compensationItemsView.children[0]);       
    }
    
    if (compensationMem != null && compensationMem.length > 0) {
        for (var i = 0; i < compensationMem.length; i++) {
            $.compensationItemsView.add(compensationItems(compensationMem[i], i));
        }
    }
    $.compensationItemsView.height = Ti.UI.SIZE; 
}

function compensationItems(dataArg, indexArg) {
    var i = indexArg;
    var type = dataArg.type;
    var detail = "";
    switch (type) {
    case "Upgrade Seat" :
        detail = "From seat No. " + (dataArg.fromSeat != null ? dataArg.fromSeat : "") + " class " + (dataArg.fromClass != null ? dataArg.fromClass : "") + " to seat No. " + (dataArg.toSeat != null ? dataArg.toSeat : "") + " class " + (dataArg.toClass != null ? dataArg.toClass : "");
        break;
    case "ROP Mileages" :
        detail = "Amount " + (dataArg.amount != null ? dataArg.amount : "") + " MILE";
        break;
    case "MPD" :
        detail = "Amount " + (dataArg.amount != null ? dataArg.amount : "") + " " + (dataArg.currency != null ? dataArg.currency : "");
        break;
    case "Upgrade Certificate" :
        detail = (dataArg.upgradeCer != null ? dataArg.upgradeCer : "");
        break;
    case "Duty Free" :
        detail = "ISC form No. " + (dataArg.iscFormNumber != null ? dataArg.iscFormNumber : "") + ", item code No. " + (dataArg.codeNumber != null ? dataArg.codeNumber : "") + " amount " + (dataArg.amount != null ? dataArg.amount : "") + " " + (dataArg.currency != null ? dataArg.currency : "");
        break;
    case "Others" :
        detail = (dataArg.detail != null ? dataArg.detail : "");
        break;
    }

    var itemView = Ti.UI.createView({
        layout : "horizontal",
        height : Ti.UI.SIZE,
        width : "100%",
        left : 0,
        index : i,
        id : "itemView",
        backgroundColor : "#26000000",
        type : type
    });

    itemView.addEventListener("click", function(e) {
        if (canEdit && e.source.id == "itemView") {
            if (e.source.type != "Upgrade Seat") {
                if (e.source.type == COMP_DUTY) {
                    var compDetailView = Alloy.createController("compensation/duty_free", {
                        incidentId : incidentId,
                        isSubmitted : isSubmitted,
                        isSynced : isSynced,
                        paxKey : paxGroupMem[0].paxKey,
                        passengerId : paxGroupMem[0].paxId,
                        accountId : paxGroupMem[0].accountId,
                        compensationMem : compensationMem,
                        compIndex : e.source.index
                    }).getView();
                    if (OS_IOS) {
                        Alloy.Globals.navGroupWin.openWindow(compDetailView);
                    } else {
                        compDetailView.open();
                    }

                } else {
                    var compDetailView = Alloy.createController("compensation/comp_details", {
                        incidentId : incidentId,
                        isSubmitted : isSubmitted,
                        isSynced : isSynced,
                        paxKey : paxGroupMem[0].paxKey,
                        passengerId : paxGroupMem[0].paxId,
                        accountId : paxGroupMem[0].accountId,
                        compensationMem : compensationMem,
                        compIndex : e.source.index
                    }).getView();
                    if (OS_IOS) {
                        Alloy.Globals.navGroupWin.openWindow(compDetailView);
                    } else {
                        compDetailView.open();
                    }

                }

            } else {
                var _promptView = new Alloy.createController("common/alertPrompt", {
                    title : "Alert",
                    message : "There is no detail view for upgrade seat compensation.",
                    okText : "OK",
                    disableCancel : true,
                    onOk : function() {
                    }
                }).getView();
                _promptView.open();
            }

        }
    });

    var typeLabel = Ti.UI.createLabel({
        text : type + " : ",
        left : "3%",
        height : 50,
        width : 200,

        font : {
            //            fontWeight : "bold",
            fontSize : 18
        },
        color : colorTextTitle,
        index : i,
        id : "itemView",
        type : type
    });

    var detailLabel = Ti.UI.createLabel({
        text : detail,
        left : 0,
        height : "auto",
        width : "63%",

        font : {
            fontWeight : "bold",
            fontSize : 18
        },
        color : colorTextValue,
        index : i,
        id : "itemView",
        wordWrap : true,
        type : type
    });

    if (OS_ANDROID) {
        // detailLabel.wordWrap = false;
        // detailLabel.ellipsize = true;
        detailLabel.width = "55%";
    }

    itemView.add(typeLabel);
    itemView.add(detailLabel);

    if (!isSubmitted && !isVoided && !isSynced) {
        var removeBtnView = Ti.UI.createView({
            layout : 'horizontal',
            height : 50,
            width :45,
            left : 5,
            index : i,
            id : "revmoveBtn"
        });
        
        var removeBtn = Ti.UI.createImageView({
            image : "/images/ic_remove.png",
            top : 11,
            left : 10,
            height : 27,
            widht : 27,
            index : i,
            id : "revmoveBtn",
            type : type
        });

        removeBtn.addEventListener('click', function(e) {
            if(e.source.id = "revmoveBtn")
            var _syncDataPromptView = new Alloy.createController("common/alertPrompt", {
                title : 'Confirm',
                message : 'Do you want to delete?',
                okText : "Yes",
                cancelText : "No",
                onOk : function() {
                    if (e.source.type == "Upgrade Seat") {
                        isSeatUpgraded = false;
                    }
                    compensationMem.remove(e.source.index);
                     $.compensationItemsView.remove($.compensationItemsView.children[e.source.index]);
                    if (compensationMem.length == 0) {
                        incidentStatus = OPEN;
                        statusSection();
                    }
                    compensationShow();
                }
            }).getView();
            _syncDataPromptView.open();

        });
        removeBtnView.addEventListener('click', function(e) {
            if(e.source.id = "revmoveBtn")
            var _syncDataPromptView = new Alloy.createController("common/alertPrompt", {
                title : 'Confirm',
                message : 'Do you want to delete?',
                okText : "Yes",
                cancelText : "No",
                onOk : function() {
                    if (e.source.type == "Upgrade Seat") {
                        isSeatUpgraded = false;
                    }
                    compensationMem.remove(e.source.index);
                     $.compensationItemsView.remove($.compensationItemsView.children[e.source.index]);
                    if (compensationMem.length == 0) {
                        incidentStatus = OPEN;
                        statusSection();
                    }
                    compensationShow();
                }
            }).getView();
            _syncDataPromptView.open();

        });
        
        removeBtnView.add(removeBtn);
        itemView.add(removeBtnView);
    }

    return itemView;
    itemView = null;
}

//* Report By and Date/Time
function createOptDialogCrewList(dataArg, id, count) {
    var btnId = id;
    var btnName = dataArg;
    var incidentCatenName;
    var row = component.createOptionDialogBtn(btnId, 8, btnName, 65);
    row.add(component.createLabel(btnName, null));

    row.addEventListener("click", function(e) {
        if (e.source.id == undefined || e.source.idType == "btnRow") {
            if (e.source.parent.id == undefined) {
                btnId = e.source.id;
                reportedBy = e.source.id;
                $.reportByTextField.text = e.source.name;
            } else {
                btnId = e.source.parent.id;
                reportedBy = e.source.parent.id;
                $.reportByTextField.text = e.source.parent.name;
            }
            isIncidentDetailEdited = true;
        }
    });
    btnId = null;
    btnName = null;
    imgPathName = null;
    return row;
}

$.reportByTextField.addEventListener('click', function(e) {
    if (canEdit) {
        var data = [];
        data = query.getCrewListSortBySeqNo(currentFlightId);
        var tableData = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].dutyCode.toLowerCase() == "fly")// Filter Acctive rank
                tableData.push(createOptDialogCrewList(data[i].rank + ". " + data[i].crewFirstName + " " + data[i].crewLastName, data[i].sfdcId, data.length));
        }
        var win2 = component.createOptionDialogWindow(tableData, "50%");
        data = null;
        tableData = null;

        win2.open();
        win2.addEventListener("click", function(e) {
            win2.close();
        });

    }
});

function reportByDateTimeSection() {
    if (reportedByData != null) {
        if (reportedByData.id != null) {
            $.reportByTextField.text = " " + reportedByData.rank + ". " + reportedByData.crewFirstName + " " + reportedByData.crewLastName;
        } else {
            $.reportByTextField.text = "";
        }
    } else {
        $.reportByTextField.text = "";
    }

    if (!utility.isEmpty(createDateTime)) {
        $.createDateTimeLabel.text = utility.displayDateTime(createDateTime);
    } else {
        createDateTime = utility.createDateTimeForSFDC();
        $.createDateTimeLabel.text = utility.displayDateTime(createDateTime);
    }
}

//* Status
function statusSection() {
    if (incidentStatus == OPEN) {
        isReloved = false;
        isOpen = true;
        $.resovledBtn.image = '/images/btn_button_off.png';
        $.pendingBtn.image = '/images/btn_button_on.png';
    } else if (incidentStatus == CLOSED || incidentStatus == RESOLVED) {
        $.resovledBtn.image = '/images/btn_button_on.png';
        $.pendingBtn.image = '/images/btn_button_off.png';
        isReloved = true;
        isOpen = false;
    } else {
        $.resovledBtn.image = '/images/btn_button_off.png';
        $.pendingBtn.image = '/images/btn_button_off.png';
        isReloved = false;
        isOpen = false;
    }
}

$.resovledBtn.addEventListener('click', function(e) {
    if (canEdit) {
        isResolved = true;
        isPending = false;
        incidentStatus = RESOLVED;
        isIncidentDetailEdited = true;
        statusSection();
    }
});
$.pendingBtn.addEventListener('click', function(e) {
    if (canEdit) {
        isPending = true;
        isResolved = false;
        incidentStatus = OPEN;
        isIncidentDetailEdited = true;
        statusSection();
    }
});

//* Save, Void, Delete, and Cancel button
function saveIncident() {
    var isSave = true;
    var isAlertMandatoryField = false;
    var mandatoryFieldAlertStr = "";

    if (isNew) {
        isIncidentDetailEdited = false;
    }

    seqNo = $.seqNoTextField.value;

    if (seqNo != null && seqNo.length > 0) {
        if (seqNo.length == 2) {
            seqNo = "0" + seqNo;
            $.seqNoTextField.value = seqNo;
        } else if (seqNo.length == 1) {
            seqNo = "00" + seqNo;
            $.seqNoTextField.value = seqNo;
        }
    } else {
        seqNo = "";
    }

    if (seqNo.length == 3) {
        var seqNoSplit = seqNo.split("");
        if (seqNoSplit[0] < "0" || seqNoSplit[0] > "9" || seqNoSplit[1] < "0" || seqNoSplit[1] > "9" || seqNoSplit[2] < "0" || seqNoSplit[2] > "9") {
            seqNo = "";
            isSave = false;
            var _promptView = new Alloy.createController("common/alertPrompt", {
                title : "Alert",
                message : "This cabin log number is not the number, please re-enter it.",
                okText : "OK",
                disableCancel : true,
                onOk : function() {
                }
            }).getView();
            _promptView.open();

        } else {

            if (logGroup == CABIN_LOG) {
                if (parseInt(seqNo) > CABIN_LOG_NUMBER_LIMIT) {
                    isSave = false;
                    var _promptView = new Alloy.createController("common/alertPrompt", {
                        title : "Alert",
                        message : "The cabin log number is over 100, please re-enter it.",
                        okText : "OK",
                        disableCancel : true,
                        onOk : function() {
                        }
                    }).getView();
                    _promptView.open();
                }

            } else if (logGroup == FLIGHT_DECK_LOG) {
                if (parseInt(seqNo) > FLIGHT_LOG_NUMBER_LIMIT) {
                    isSave = false;
                    var _promptView = new Alloy.createController("common/alertPrompt", {
                        title : "Alert",
                        message : "The flight deck log number is over 150, please re-enter it.",
                        okText : "OK",
                        disableCancel : true,
                        onOk : function() {
                        }
                    }).getView();
                    _promptView.open();
                }
            }
        }
    }
    sequenceNumber = acReg + seqNo + logType + logDate;

    if (sequenceNumber != null && sequenceNumber.length == 12) {
        if (!isVoidedAction) {
            var seqNumber = query.getCabinLogNumberOfIncident(sequenceNumber);
            if (seqNumber != null) {
                if (sequenceNumber !== seqNumber.sequenceNumber) {
                    var seqNum = sequenceNumber;
                } else {
                    var _promptView = new Alloy.createController("common/alertPrompt", {
                        title : "Alert",
                        message : "This cabin log number: " + sequenceNumber + " already existed. Please enter the new one.",
                        okText : "OK",
                        disableCancel : true,
                        onOk : function() {
                        }
                    }).getView();
                    _promptView.open();

                    seqNum = "";
                    $.seqNoTextField.value = "";
                    isSave = false;
                }
            } else {
                seqNum = sequenceNumber;
            }
        } else {
            seqNum = sequenceNumber;
        }
    } else {
        seqNum = "";
        //        logGroup = 0;
    }
    if (($.paxPhoneTextField.value == null || $.paxPhoneTextField.value.length < 1) && ($.paxEmailTextField.value == null || $.paxEmailTextField.value.length < 1) && !isSkippedPhoneAndMail && (paxGroupMem != null && paxGroupMem.length > 0)) {
        isSave = false;
        isAlertMandatoryField = true;
        mandatoryFieldAlertStr += "Phone or Email\n";
    }

    if ($.subjectTextField.value == null || $.subjectTextField.value.length < 1) {
        isSave = false;
        isAlertMandatoryField = true;
        mandatoryFieldAlertStr += "Subject\n";
    }

    if ($.detailTextField.value == null || $.detailTextField.value.length < 1) {
        isSave = false;
        isAlertMandatoryField = true;
        mandatoryFieldAlertStr += "Detail\n";
    }

    if (reportType == null || reportType.length < 1) {
        isSave = false;
        isAlertMandatoryField = true;
        mandatoryFieldAlertStr += "Type\n";
    }

    equipmentId = "";
    if (equipment == null && (category == SAFETY_EQUIPMENT || category == AC_MAINTENANCE)) {
        isSave = false;
        isAlertMandatoryField = true;
        mandatoryFieldAlertStr += "Equipment\n";
        equipmentId = "";
    } else {
        equipmentId = equipment != null ? equipment.id : "";
    }

    if ((conditionForSFDC == null || !conditionForSFDC.length) && (category == SAFETY_EQUIPMENT || category == AC_MAINTENANCE)) {
        isSave = false;
        isAlertMandatoryField = true;
        conditionForSFDC = "";
        mandatoryFieldAlertStr += "Condition\n";
    } else {
        if (conditionForSFDC == null || !conditionForSFDC.length) {
            conditionForSFDC = "";
        }
    }

    if ((safetyZone == null || !safetyZone.length) && (category == EMERGENCY && emergencyType == SLIDER_DEPLOYMENT)) {
        isSave = false;
        isAlertMandatoryField = true;
        safetyZone = "";
        mandatoryFieldAlertStr += "Safety Zone\n";
    } else {
        if (safetyZone == null || !safetyZone.length) {
            safetyZone = "";
        }
    }

    if (!isSkippedPhoneAndMail && $.paxEmailTextField.value.length > 0) {
        isSave = utility.validateEmail($.paxEmailTextField.value);
    }

    var statusTemp = incidentStatus;
    if (category == OTHER || category == SERVICE_EQUIPMENT) {
        statusTemp = CLOSED;
    }

    if (changeSeatMem != null && changeSeatMem.length > 0) {
    }

    var incidentData = {
        id : incidentId,
        flightId : currentFlightId,
        category : category,
        reportType : reportType != null ? reportType : "",
        emergencyType : emergencyType,
        subject : $.subjectTextField.value,
        equipmentId : equipmentId,
        partId : part != null ? part.id : "",
        ataChapter : ataChapter,
        condition : conditionForSFDC,
        safetyZone : safetyZone,
        logGroup : logGroup,
        sequenceNumber : seqNum,
        detail : $.detailTextField.value,
        createdBy : createdBy,
        reportedBy : reportedBy,
        createDateTime : createDateTime,
        updateDateTime : utility.createDateTimeForSFDC(),
        incidentStatus : statusTemp,
        isLog : isLog,
        isMulti : isMulti,
        isSubmitted : category != EMERGENCY ? isSubmitted : true,
        isVoided : isVoided,
        isSynced : isSynced,
        acReg : aircraftRegistration,
        flightNumber : flightNumber,
        sector : sector,
        phone : !isSkippedPhoneAndMail ? $.paxPhoneTextField.value : "",
        email : !isSkippedPhoneAndMail ? $.paxEmailTextField.value : "",
        isSkippenPhoneEmail : isSkippedPhoneAndMail,
        upgradeChangeSeatType : null,
        reasonForChange : reasonForChangeSeatTemp
    };

    if (category == AC_MAINTENANCE || category == SAFETY_EQUIPMENT) {
        var positions = positionGroupMem;
        query.deletePositionGroupMembersByIncidentId(incidentId);
        if (positions != null && positions.length > 0) {
            for (var j = 0; j < positions.length; j++) {
                var position = positions[j];
                var posArg = {
                    positionId : position,
                    name : position,
                    incidentId : incidentId
                };

                query.insertPositionGroupMember(posArg);
            }
        } else if (category == SAFETY_EQUIPMENT || category == AC_MAINTENANCE) {
            isSave = false;
            isAlertMandatoryField = true;
            mandatoryFieldAlertStr += "Position\n";
        }
    }

    var passengers = paxGroupMem;
    query.deletePaxGroupMembersByIncidentId(incidentId);
    if (passengers != null && passengers.length > 0) {
        for (var j = 0; j < passengers.length; j++) {
            var passenger = passengers[j];
            var passengerArg = {
                paxId : passenger.paxId,
                accountId : passenger.accountId,
                paxKey : passenger.paxKey,
                incidentId : incidentId,
                role : passenger.role,
                detail : passenger.detail,
                type : passenger.type
            };

            query.insertPaxGroupMember(passengerArg);
        }
    } else {
        if (((category == EMERGENCY) && (emergencyType == PASSENGER_DECEASE || emergencyType == SEVERE_PASSENGER_INJURY)) || category == PASSENGER) {
            isSave = false;
            isAlertMandatoryField = true;
            mandatoryFieldAlertStr += "Passenger\n";
        }
    }

    passengers = paxInvolvedMem;
    if (passengers != null && passengers.length > 0) {
        for (var j = 0; j < passengers.length; j++) {
            var passenger = passengers[j];
            var passengerArg = {
                paxId : passenger.paxId,
                accountId : passenger.accountId,
                paxKey : passenger.paxKey,
                incidentId : incidentId,
                role : passenger.role,
                detail : passenger.detail,
                type : passenger.type
            };

            query.insertPaxGroupMember(passengerArg);
        }
    } else {
    }

    var crews = crewGroupMem;
    query.deleteCrewGroupMembersByIncidentId(incidentId);
    if (crews != null && crews.length > 0) {
        for (var j = 0; j < crews.length; j++) {
            var crew = crews[j];
            var crewArg = {
                crewId : crew.crewId,
                role : crew.role,
                detail : crew.detail,
                type : crew.type,
                incidentId : incidentId
            };

            query.insertCrewGroupMember(crewArg);
        }
    } else {
        if ((category == EMERGENCY) && (emergencyType == CREW_DECEASE || emergencyType == SEVERE_CREW_INJURY)) {
            mandatoryFieldAlertStr += "Crew\n";
            isAlertMandatoryField = true;
            isSave = false;
        }
    }

    crews = crewInvolvedMem;
    if (crews != null && crews.length > 0) {
        for (var j = 0; j < crews.length; j++) {
            var crew = crews[j];
            var crewArg = {
                crewId : crew.crewId,
                role : crew.role,
                detail : crew.detail,
                type : crew.type,
                incidentId : incidentId
            };

            query.insertCrewGroupMember(crewArg);
        }
    }

    var staffs = staffGroupMem;
    query.deleteStaffGroupMembersByIncidentId(incident.id);
    if (staffs != null && staffs.length > 0) {
        for (var j = 0; j < staffs.length; j++) {
            var staff = staffs[j];
            var staffArg = {
                personnelId : staff.personnelId,
                name : staff.name,
                role : staff.role,
                detail : staff.detail,
                incidentId : incidentId
            };

            query.insertStaffGroupMember(staffArg);
        }
    }

    var compensations = compensationMem;
    var isUpdated = false;
    query.deleteCompensationsByIncidentId(incidentId);
    query.deleteCompensationAttachmentByIncidentId(incidentId);
    if (compensations != null && compensations.length > 0) {
        for (var j = 0; j < compensations.length; j++) {
            query.insertCompensation(compensations[j]);
            if (compensations[j].type == "Upgrade Seat") {
                if ((changeSeatMem != null && changeSeatMem.length > 0)) {
                    var upgradeTime = new Date(compensations[j].createdDateTime);
                    var changeTime = new Date(changeSeatMem[0].createdDateTime);
                    if (changeTime < upgradeTime) {
                        component.updateChangeOrUpgradeSeatClassOfPassengerAndLOPA(compensations[j], paxGroupMem[0]);
                        isUpdated = true;
                    } else {
                        if (!isAlreadyChangedSeat) {
                            component.updateChangeOrUpgradeSeatClassOfPassengerAndLOPA(changeSeatMem[0], paxGroupMem[0]);
                            isUpdated = true;
                        }
                    }
                } else {
                    component.updateChangeOrUpgradeSeatClassOfPassengerAndLOPA(compensations[j], paxGroupMem[0]);
                    isUpdated = true;
                }
                if (fromWhere == PASSENGER_DETAIL) {
                    passengerSeatClassIsRefresh = 1;
                    passengerListIsRefresh = 1;
                }
            }
            if (compensations[j].type == "Duty Free") {
                query.insertCompensationAttachment(compensations[j].compAttachment[0]);
            }
        }
    }
    if (!isAlreadyChangedSeat) {
        if (changeSeatMem != null && changeSeatMem.length > 0) {
            query.deleteChangeSeatByIncidentId(incidentId);
            query.insertChangeSeatGroupMember(changeSeatMem[0]);
            changeGroupMemTempForRemove = [];
            if (!isUpdated) {
                component.updateChangeOrUpgradeSeatClassOfPassengerAndLOPA(changeSeatMem[0], paxGroupMem[0]);
                if (fromWhere == PASSENGER_DETAIL) {
                    passengerSeatClassIsRefresh = 1;
                    passengerListIsRefresh = 1;
                }
            }
        }
    }

    if (changeGroupMemTempForRemove != null && changeGroupMemTempForRemove.length > 0) {
        query.deleteChangeSeatByIncidentId(incidentId);
        component.updateChangeOrUpgradeSeatClassOfPassengerAndLOPA(changeGroupMemTempForRemove[0], paxGroupMem[0]);
        if (fromWhere == PASSENGER_DETAIL) {
            passengerSeatClassIsRefresh = 1;
            passengerListIsRefresh = 1;
        }
    }

    query.deleteAttachmentByIncidentId(incidentId);
    if ((attachment1 != null && attachment1.length > 0) || (attachment2 != null && attachment2.length > 0) || (attachment3 != null && attachment3.length > 0)) {
        if (attachment1 != null && attachment1.length > 0) {
            attachment1[0].detail = $.attachmentTextField1.value.length > 0 ? $.attachmentTextField1.value : "";
            query.insertAttachment(attachment1[0]);
        }
        if (attachment2 != null && attachment2.length > 0) {
            attachment2[0].detail = $.attachmentTextField2.value.length > 0 ? $.attachmentTextField2.value : "";
            query.insertAttachment(attachment2[0]);
        }
        if (attachment3 != null && attachment3.length > 0) {
            attachment3[0].detail = $.attachmentTextField3.value.length > 0 ? $.attachmentTextField3.value : "";
            query.insertAttachment(attachment3[0]);
        }
    }
    if (attachment1isDeleted) {
        var attachmentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment1NameDeleted);
        attachmentFile.deleteFile();
    }
    if (attachment2isDeleted) {
        var attachmentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment2NameDeleted);
        attachmentFile.deleteFile();
    }
    if (attachment3isDeleted) {
        var attachmentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment" + Ti.Filesystem.separator + attachment3NameDeleted);
        attachmentFile.deleteFile();
    }

    if (isSave) {
        incidentSeatDetailIsRefresh = 1;
        incidentPassengerIsRefresh = 1;
        if (!isNew) {
            if (isVoided) {
                var _syncDataPromptView = new Alloy.createController("common/alertPrompt", {
                    title : 'Confirm',
                    message : 'Do you want to void and submit this incident?',
                    okText : "Yes",
                    cancelText : "No",
                    onOk : function() {
                        query.insertIncident(incidentData);
                        incidentListIsRefresh = 1;
                        $.incidentDetailWindow.close();
                    }
                }).getView();
                _syncDataPromptView.open();
            } else {
                var _syncDataPromptView = new Alloy.createController("common/alertPrompt", {
                    title : 'Confirm',
                    message : 'Do you want to save the changes?',
                    okText : "Yes",
                    cancelText : "No",
                    onOk : function() {
                        query.insertIncident(incidentData);
                        incidentListIsRefresh = 1;
                        $.incidentDetailWindow.close();
                    }
                }).getView();
                _syncDataPromptView.open();
            }
        } else {//New Incident
            if (category == EMERGENCY) {
                var _syncDataPromptView = new Alloy.createController("common/alertPrompt", {
                    title : 'Confirm',
                    message : 'This report will be sent to management.\nConfirm Submission?',
                    okText : "Yes",
                    cancelText : "No",
                    onOk : function() {
                        query.insertIncident(incidentData);
                        incidentListIsRefresh = 1;
                        $.incidentDetailWindow.close();
                    }
                }).getView();
                _syncDataPromptView.open();
            } else if (isVoided) {
                var _syncDataPromptView = new Alloy.createController("common/alertPrompt", {
                    title : 'Confirm',
                    message : 'Do you want to void and submit this incident?',
                    okText : "Yes",
                    cancelText : "No",
                    onOk : function() {
                        query.insertIncident(incidentData);
                        incidentListIsRefresh = 1;
                        $.incidentDetailWindow.close();
                    }
                }).getView();
                _syncDataPromptView.open();
            } else {
                query.insertIncident(incidentData);
                incidentListIsRefresh = 1;
                $.incidentDetailWindow.close();
            }
        }

    } else {
        query.deleteGroupMembersByIncidentId(incidentId);
        query.deleteAttachmentByIncidentId(incidentId);
        if (isAlertMandatoryField) {
            var _promptView = new Alloy.createController("common/alertPrompt", {
                title : "Please enter mandatory field",
                message : mandatoryFieldAlertStr,
                okText : "OK",
                disableCancel : true,
                onOk : function() {
                }
            }).getView();
            _promptView.open();
        }
    }
}

function deleteBtn(touchEnabledArg, textColorArg) {
    var _syncDataPromptView = new Alloy.createController("common/alertPrompt", {
        title : 'Confirm',
        message : 'Do you want to delete this incident?',
        okText : "Yes",
        cancelText : "No",
        onOk : function() {
            query.deleteIncident(incidentId);
            query.deleteGroupMembersByIncidentId(incidentId);
            query.deleteAttachmentByIncidentId(incidentId);
            incidentListIsRefresh = 1;
            incidentPassengerIsRefresh = 1;
            incidentSeatDetailIsRefresh = 1;
            $.incidentDetailWindow.close();
        }
    }).getView();

    var deleteBtnRow = component.createBtnNoIcon("Delete", textColorArg);
    deleteBtnRow.addEventListener('click', function(e) {
        _syncDataPromptView.open();
    });

    var tableData = [];
    tableData.push(deleteBtnRow);
    var table = Ti.UI.createTableView({
        backgroundColor : 'transparent',
        separatorColor : "transparent",
        selectionStyle : 1,
        scrollable : false,
        borderRadius : "10",
        left : "0%",
        right : "0%",
        top : "25%",
        bottom : "25%",
        data : tableData
    });
    tableData = null;

    var widthStr = (100 / 3) + "%";

    var view = Ti.UI.createView({
        backgroundColor : 'transparent',
        layout : "vertical",
        height : "100%",
        left : "40%",
        right : "40%",
        touchEnabled : touchEnabledArg
    });

    view.add(table);
    $.saveDeleteCancelButtonView.add(view);
    $.saveDeleteCancelButtonView.show();
}

//* Void button
$.voidBtn.addEventListener("click", function(e) {
    isVoided = true;
    isSubmitted = true;
    isVoidedAction = true;
    saveIncident();
});

//* Save button
if (OS_IOS) {
    $.saveIncidentBtn.addEventListener('click', function(e) {
        if (canEdit) {
            saveIncident();
        }
    });
} else {
    $.incidentDetailWindow.activity.onCreateOptionsMenu = function(e) {
        menuItem = e.menu.add({
            title : "Save",
            showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM
        });
        menuItem.addEventListener("click", function(e) {
            if (canEdit) {
                saveIncident();
            }
        });
    };
}

//* Cancel button
if (OS_IOS) {
    $.cancelIncidentBtn.addEventListener('click', function(e) {
        cancelFunction();
    });

}

function cancelFunction() {
    if (isSubmitted || isVoided || isSynced) {
        $.incidentDetailWindow.close();
    } else {
        if (isNew && isIncidentDetailEdited) {
            var _syncDataPromptView = new Alloy.createController("common/alertPrompt", {
                title : 'Confirm',
                message : 'Do you want to discard the draft?',
                okText : "Yes",
                cancelText : "No",
                onOk : function() {
                    $.incidentDetailWindow.close();
                }
            }).getView();
            _syncDataPromptView.open();
        } else if (!isNew && isIncidentDetailEdited) {
            var _syncDataPromptView = new Alloy.createController("common/alertPrompt", {
                title : 'Confirm',
                message : 'Do you want to discard the changes?',
                okText : "Yes",
                cancelText : "No",
                onOk : function() {
                    $.incidentDetailWindow.close();
                }
            }).getView();
            _syncDataPromptView.open();
        } else {
            $.incidentDetailWindow.close();
        }
    }
}

//* Initial display
function viewIncidentDetailPage() {
    switch (category) {
    case PASSENGER :
        // Categorty
        $.categoryView.height = SMALL_ROW_HEIGHT;
        categorySection();

        // Type
        $.typeView.height = SMALL_ROW_HEIGHT;
        typeSection();

        // Passenger
        passengerSection();

        // Subject
        $.subjectView.height = SMALL_ROW_HEIGHT;
        subjectSection();

        // Crew
        $.crewView.height = ZERO_ROW_HEIGHT;

        // Position
        $.positionView.height = ZERO_ROW_HEIGHT;
        positionSection();

        //Equipment and Part
        $.equipmentPartView.height = ZERO_ROW_HEIGHT;
        // ATA Chapter
        $.ataChapterView.height = ZERO_ROW_HEIGHT;

        // Condition
        $.conditionView.height = ZERO_ROW_HEIGHT;
        $.crewView1.height = ZERO_ROW_HEIGHT;

        // Cabin log / Flight Deck log Number
        // Cabin log / Flight Deck log Group
        $.cabinFlightLogGroupView.height = ZERO_ROW_HEIGHT;
        $.cabinFlightLogNoView.height = ZERO_ROW_HEIGHT;

        // Person Involved
        $.personInvolveView.height = SMALL_ROW_HEIGHT;
        personInvolveSection();

        // Chagne Seat
        $.changeSeatView.height = Ti.UI.SIZE;
        changeSeatSection();

        // Compensation
        $.compensationView.height = SMALL_ROW_HEIGHT;
        compensationSection();

        $.statusView.height = SMALL_ROW_HEIGHT;
        statusSection();

        break;

    case EMERGENCY :
        $.incidentDetailWindow.title = reportType;

        // Categor
        $.categoryView.height = ZERO_ROW_HEIGHT;

        // Type
        $.typeView.height = ZERO_ROW_HEIGHT;

        // Subject
        $.subjectView.height = SMALL_ROW_HEIGHT;
        subjectSection();

        // Position
        $.positionView.height = ZERO_ROW_HEIGHT;

        //Equipment and Part
        $.equipmentPartView.height = ZERO_ROW_HEIGHT;
        // ATA Chapter
        $.ataChapterView.height = ZERO_ROW_HEIGHT;
        // Condition
        $.conditionView.height = ZERO_ROW_HEIGHT;
        // Cabin log / Flight Deck log Group
        $.cabinFlightLogGroupView.height = ZERO_ROW_HEIGHT;
        // Cabin log / Flight Deck log Number
        $.cabinFlightLogNoView.height = ZERO_ROW_HEIGHT;

        // Chagne Seat
        $.changeSeatView.height = ZERO_ROW_HEIGHT;

        // Compensation
        $.compensationView.height = ZERO_ROW_HEIGHT;

        $.statusView.height = ZERO_ROW_HEIGHT;

        if (emergencyType == PASSENGER_DECEASE || emergencyType == SEVERE_PASSENGER_INJURY) {
            $.passengerView.height = SMALL_ROW_HEIGHT;
            if ((passengerId != null && passengerId.length > 0) || (paxGroupMem != null && paxGroupMem.length > 0)) {
                $.passengerView.touchEnabled = false;
                paxHasChild = false;
            }
            // Passenger
            passengerSection();
            $.crewView.height = ZERO_ROW_HEIGHT;
            $.crewView1.height = ZERO_ROW_HEIGHT;
            // Crew
            $.personInvolveView.height = SMALL_ROW_HEIGHT;
            // Person Involved
            personInvolveSection();
        } else if (emergencyType == CREW_DECEASE || emergencyType == SEVERE_CREW_INJURY) {
            $.crewView.height = ZERO_ROW_HEIGHT;
            $.crewView1.height = SMALL_ROW_HEIGHT;
            if ((crewId != null && crewId.length > 0) || (crewGroupMem != null && crewGroupMem.length > 0)) {
                $.crewView1.touchEnabled = false;
                $.crewArrowDownImage.hide();
                $.crewArrowDownImage1.hide();
            }
            $.passengerView.height = ZERO_ROW_HEIGHT;
            crewSection();
            $.personInvolveView.height = SMALL_ROW_HEIGHT;
            // Person Involved
            personInvolveSection();
        } else if (emergencyType == SEVERE_TURBULENCE) {
            $.passengerView.height = ZERO_ROW_HEIGHT;
            $.crewView.height = ZERO_ROW_HEIGHT;
            $.crewView1.height = ZERO_ROW_HEIGHT;
            $.personInvolveView.height = ZERO_ROW_HEIGHT;
            // Person Involved
        } else if (emergencyType == SLIDER_DEPLOYMENT) {
            $.passengerView.height = ZERO_ROW_HEIGHT;
            $.safetyZoneView.height = SMALL_ROW_HEIGHT;
            safetyZoneSection();
            $.personInvolveView.height = SMALL_ROW_HEIGHT;
            // Person Involved
            personInvolveSection();
            $.crewView.height = ZERO_ROW_HEIGHT;
            $.crewView1.height = ZERO_ROW_HEIGHT;
        }
        break;

    case AC_MAINTENANCE :
        // Category
        $.categoryView.height = SMALL_ROW_HEIGHT;
        categorySection();

        // Type
        $.typeView.height = SMALL_ROW_HEIGHT;
        typeSection();

        // Subject
        $.subjectView.height = SMALL_ROW_HEIGHT;
        subjectSection();

        // Passenger
        if (paxConcern == NOT_CONCERN_PAX) {
            $.passengerView.height = ZERO_ROW_HEIGHT;
        } else {
            $.passengerView.height = SMALL_ROW_HEIGHT;
            passengerSection();
        }

        // Person Involved
        $.personInvolveView.height = SMALL_ROW_HEIGHT;
        personInvolveSection();

        // Crew
        $.crewView.height = ZERO_ROW_HEIGHT;
        $.crewView1.height = ZERO_ROW_HEIGHT;

        // Position
        $.positionView.height = SMALL_ROW_HEIGHT;
        positionSection();

        //Equipment and Part
        $.equipmentPartView.height = Ti.UI.SIZE;
        //SMALL_ROW_HEIGHT;
        equipmentPartSection();

        // ATA Chapter
        $.ataChapterView.height = SMALL_ROW_HEIGHT;
        ataChapterSection();

        // Condition
        $.conditionView.height = Ti.UI.SIZE;
        //SMALL_ROW_HEIGHT;
        conditionSection();

        // Cabin log / Flight Deck log Group
        $.cabinFlightLogGroupView.height = SMALL_ROW_HEIGHT;
        splitSequenceNumber();
        cabinFlightLogGroupSection();

        // Cabin log / Flight Deck log Number
        $.cabinFlightLogNoView.height = SMALL_ROW_HEIGHT;
        cabinFlightLogNoSection();

        // Chagne Seat
        $.changeSeatView.height = Ti.UI.SIZE;
        changeSeatSection();

        // Compensation
        $.compensationView.height = SMALL_ROW_HEIGHT;
        compensationSection();

        //       $.statusView.height = "5%";//SMALL_ROW_HEIGHT;
        statusSection();

        break;

    case SAFETY_EQUIPMENT :
        // Category
        $.categoryView.height = SMALL_ROW_HEIGHT;
        categorySection();

        // Type
        $.typeView.height = SMALL_ROW_HEIGHT;
        typeSection();

        // Subject
        $.subjectView.height = SMALL_ROW_HEIGHT;
        subjectSection();

        // Passenger
        if (paxConcern == NOT_CONCERN_PAX) {
            $.passengerView.height = ZERO_ROW_HEIGHT;
        } else {
            $.passengerView.height = SMALL_ROW_HEIGHT;
            passengerSection();
        }

        // Person Involved
        $.personInvolveView.height = SMALL_ROW_HEIGHT;
        personInvolveSection();

        // Crew
        $.crewView.height = ZERO_ROW_HEIGHT;
        $.crewView1.height = ZERO_ROW_HEIGHT;

        // Position
        $.positionView.height = SMALL_ROW_HEIGHT;
        positionSection();

        //Equipment and Part
        $.equipmentPartView.height = Ti.UI.SIZE;
        //SMALL_ROW_HEIGHT;
        equipmentPartSection();

        // ATA Chapter
        $.ataChapterView.height = SMALL_ROW_HEIGHT;
        ataChapterSection();

        // Condition
        $.conditionView.height = Ti.UI.SIZE;
        //SMALL_ROW_HEIGHT;
        conditionSection();

        // Cabin log / Flight Deck log Group
        $.cabinFlightLogGroupView.height = SMALL_ROW_HEIGHT;
        splitSequenceNumber();
        cabinFlightLogGroupSection();

        // Cabin log / Flight Deck log Number
        $.cabinFlightLogNoView.height = SMALL_ROW_HEIGHT;
        cabinFlightLogNoSection();

        // Chagne Seat
        $.changeSeatView.height = Ti.UI.SIZE;
        changeSeatSection();

        // Compensation
        $.compensationView.height = SMALL_ROW_HEIGHT;
        compensationSection();

        //       $.statusView.height = "5%";//SMALL_ROW_HEIGHT;
        statusSection();

        break;

    case OTHER :
        // Categor
        $.categoryView.height = SMALL_ROW_HEIGHT;
        categorySection();

        // Type
        $.typeView.height = SMALL_ROW_HEIGHT;
        $.typeView.touchEnabled = false;
        if (reportType == null || reportType.length == 0) {
            reportType = "Information";
        }
        typeSection();

        // Subject
        $.subjectView.height = SMALL_ROW_HEIGHT;
        subjectSection();

        // Passenger
        $.passengerView.height = ZERO_ROW_HEIGHT;
        //        passengerSection();

        // Crew
        $.crewView.height = ZERO_ROW_HEIGHT;

        // Position
        $.positionView.height = ZERO_ROW_HEIGHT;
        positionSection();

        //Equipment and Part
        $.equipmentPartView.height = ZERO_ROW_HEIGHT;
        // ATA Chapter
        $.ataChapterView.height = ZERO_ROW_HEIGHT;

        // Condition
        $.conditionView.height = ZERO_ROW_HEIGHT;
        $.crewView1.height = ZERO_ROW_HEIGHT;

        // Cabin log / Flight Deck log Number
        // Cabin log / Flight Deck log Group
        $.cabinFlightLogGroupView.height = ZERO_ROW_HEIGHT;
        $.cabinFlightLogNoView.height = ZERO_ROW_HEIGHT;

        // Person Involved
        $.personInvolveView.height = ZERO_ROW_HEIGHT;
        //       personInvolveSection();

        // Chagne Seat
        $.changeSeatView.height = ZERO_ROW_HEIGHT;
        //        changeSeatSection();

        // Compensation
        $.compensationView.height = ZERO_ROW_HEIGHT;
        //        compensationSection();

        $.statusView.height = ZERO_ROW_HEIGHT;
        //        statusSection();

        break;

    case SERVICE_EQUIPMENT :
        // Categor
        $.categoryView.height = SMALL_ROW_HEIGHT;
        categorySection();

        // Type
        $.typeView.height = SMALL_ROW_HEIGHT;
        $.typeView.touchEnabled = false;
        if (reportType == null || reportType.length == 0) {
            reportType = "Information";
        }
        typeSection();

        // Subject
        $.subjectView.height = SMALL_ROW_HEIGHT;
        subjectSection();

        // Passenger
        $.passengerView.height = ZERO_ROW_HEIGHT;
        //        passengerSection();

        // Crew
        $.crewView.height = ZERO_ROW_HEIGHT;

        // Position
        $.positionView.height = ZERO_ROW_HEIGHT;
        positionSection();

        //Equipment and Part
        $.equipmentPartView.height = ZERO_ROW_HEIGHT;
        // ATA Chapter
        $.ataChapterView.height = ZERO_ROW_HEIGHT;

        // Condition
        $.conditionView.height = ZERO_ROW_HEIGHT;
        $.crewView1.height = ZERO_ROW_HEIGHT;

        // Cabin log / Flight Deck log Number
        // Cabin log / Flight Deck log Group
        $.cabinFlightLogGroupView.height = ZERO_ROW_HEIGHT;
        $.cabinFlightLogNoView.height = ZERO_ROW_HEIGHT;

        // Person Involved
        $.personInvolveView.height = ZERO_ROW_HEIGHT;
        //       personInvolveSection();

        // Chagne Seat
        $.changeSeatView.height = ZERO_ROW_HEIGHT;
        //        changeSeatSection();

        // Compensation
        $.compensationView.height = ZERO_ROW_HEIGHT;
        //        compensationSection();

        $.statusView.height = ZERO_ROW_HEIGHT;
        //        statusSection();

        break;

    default :
        // Category
        $.categoryView.height = SMALL_ROW_HEIGHT;
        categorySection();

        // Type
        $.typeView.height = SMALL_ROW_HEIGHT;
        typeSection();

        // Subject
        $.subjectView.height = SMALL_ROW_HEIGHT;
        subjectSection();

        // Passenger
        if (paxConcern == NOT_CONCERN_PAX) {
            $.passengerView.height = ZERO_ROW_HEIGHT;
        } else {
            $.passengerView.height = SMALL_ROW_HEIGHT;
            passengerSection();
        }

        // Person Involved
        $.personInvolveView.height = SMALL_ROW_HEIGHT;
        personInvolveSection();

        // Crew
        $.crewView.height = ZERO_ROW_HEIGHT;
        $.crewView1.height = ZERO_ROW_HEIGHT;

        // Position
        $.positionView.height = ZERO_ROW_HEIGHT;

        //Equipment and Part
        $.equipmentPartView.height = ZERO_ROW_HEIGHT;

        // ATA Chapter
        $.ataChapterView.height = ZERO_ROW_HEIGHT;

        // Condition
        $.conditionView.height = ZERO_ROW_HEIGHT;

        // Cabin log / Flight Deck log Group
        $.cabinFlightLogGroupView.height = ZERO_ROW_HEIGHT;

        // Cabin log / Flight Deck log Number
        $.cabinFlightLogNoView.height = ZERO_ROW_HEIGHT;

        // Chagne Seat
        $.changeSeatView.height = Ti.UI.SIZE;
        changeSeatSection();

        // Compensation
        $.compensationView.height = SMALL_ROW_HEIGHT;
        compensationSection();

        //       $.statusView.height = "5%";//SMALL_ROW_HEIGHT;
        statusSection();

        break;
    }

    if (paxGroupMem != null && paxGroupMem.length > 0) {
        $.paxPhoneView.height = SMALL_ROW_HEIGHT;
        $.paxEmailView.height = SMALL_ROW_HEIGHT;
        if (!isSubmitted && !isVoided && !isSynced) {
            $.skipPaxEmailAndPhoneView.height = SMALLESS_ROW_HEIGHT;
        }
        skipPaxEmailAndPhoneSection();
    }

    $.detailView.height = BIG_ROW_HEIGHT;
    // Detail
    detailSection();

    $.attachmentBtnView.height = SMALLESS_ROW_HEIGHT;
    // Add Attachment Button
    $.attachmentView1.height = ZERO_ROW_HEIGHT;
    // Attachment 1
    $.attachmentView2.height = ZERO_ROW_HEIGHT;
    // Attachment 2
    $.attachmentView3.height = ZERO_ROW_HEIGHT;
    // Attachment 3
    attachmentSection1();

    $.reportDateTimeView.height = SMALL_ROW_HEIGHT;
    // Report By and Date time created
    reportByDateTimeSection();

    if (isNew) {
        $.saveDeleteCancelButtonView.height = 0;
    } else {
        $.saveDeleteCancelButtonView.height = "10%";
        if ((category == AC_MAINTENANCE || category == SAFETY_EQUIPMENT) && sequenceNumber != null && sequenceNumber.length == 12) {
            $.voidBtn.left = "40%";
            $.voidBtn.right = "40%";
            $.voidBtn.top = "25%";
            $.voidBtn.bottom = "25%";

        } else {
            //        $.voidBtn.hide();
            $.voidBtn.height = 0;
            $.voidBtn.width = 0;
            deleteBtn(true, "red");
        }
    }
    if (isVoided) {
        $.voidedStatusLabel.text = "Voided";
    } else {
        $.voidedStatusLabel.text = "";
    }

    if (isSubmitted || isVoided || isSynced) {
        canEdit = false;

        if (OS_ANDROID) {
            $.paxPhoneTextField.editable = false;
            $.paxEmailTextField.editable = false;
            $.seqNoTextField.editable = false;
            $.subjectTextField.editable = false;
            $.detailTextField.editable = false;
            menuItem.title = "";
        }

        $.skipPaxEmailAndPhoneView.height = 0;
        $.skipPaxEmailAndPhoneView.touchEnabled = false;
        $.paxPhoneView.touchEnabled = false;
        $.paxEmailView.touchEnabled = false;
        $.categoryView.touchEnabled = false;
        $.typeView.touchEnabled = false;
        $.subjectView.touchEnabled = false;
        $.subjectTextField.touchEnabled = false;
        $.safetyZoneView.touchEnabled = false;
        if (paxGroupMem != null && paxGroupMem.length > 0)
            $.passengerView.touchEnabled = true;
        else
            $.passengerView.touchEnabled = false;
        $.crewView.touchEnabled = false;
        $.crewView1.touchEnabled = false;
        $.positionView.touchEnabled = false;
        $.equipmentPartView.touchEnabled = false;
        $.ataChapterView.touchEnabled = false;
        $.conditionView.touchEnabled = false;
        $.cabinFlightLogGroupView.touchEnabled = false;
        $.cabinFlightLogNoView.touchEnabled = false;
        $.personInvolveView.touchEnabled = true;
        //        $.detailView.touchEnabled = false;
        $.attachmentBtnView.touchEnabled = false;
        // $.attachmentView1.touchEnabled = false;
        // $.attachmentView2.touchEnabled = false;
        // $.attachmentView3.touchEnabled = false;
        $.attachmentTextField1.touchEnabled = false;
        $.attachmentTextField2.touchEnabled = false;
        $.attachmentTextField3.touchEnabled = false;
        $.changeSeatView.touchEnabled = false;
        $.compensationView.touchEnabled = false;
        $.reportDateTimeView.touchEnabled = false;
        $.statusView.touchEnabled = false;
        $.saveDeleteCancelButtonView.touchEnabled = false;
        $.saveDeleteCancelButtonView.height = 0;
        $.scrollView.height = "100%";
        $.addImageBtn.hide();
        $.removeImageBtn1.hide();
        $.removeImageBtn2.hide();
        $.removeImageBtn3.hide();
        if (OS_IOS) {
            $.incidentDetailWindow.setRightNavButton(null);
        }
        $.crewArrowDownImage.hide();
        $.crewArrowDownImage1.hide();
        $.changeSeatRightArrowImage.hide();
        $.removeChangeSeatImage.hide();

        $.detailTextField.editable = false;
        // $.detailTextField.addEventListener("click", function(e) {
        // utility.showMoreDetail($.detailTextField.value);
        // });
        $.detailView.addEventListener("click", function(e) {
            utility.showMoreDetail($.detailTextField.value);
        });
    }

    if ((paxInvolvedMem != null && paxInvolvedMem.length > 0) || (crewInvolvedMem != null && crewInvolvedMem.length > 0) || (staffGroupMem != null && staffGroupMem.length > 0)) {
        $.personInvolveView.touchEnabled = true;
    } else {
        if (isSubmitted || isVoided || isSynced) {
            $.personInvolveView.touchEnabled = false;
        } else {
            $.personInvolveView.touchEnabled = true;
        }
    }
}

//* Initialize Incident Detail page
function initializeIncidentDetail() {
    if (isNew) {// Create New Incident
        $.incidentDetailWindow.title = "Create New Incident";
        $.saveDeleteCancelButtonView.height = 0;
        $.scrollView.height = "100%";
        paxGroupMem = [];
        positionGroupMem = [];
        crewGroupMem = [];
        staffGroupMem = [];
        compensationMem = [];
        attachementMem = [];
        paxInvolvedMem = [];

        incidentId = utility.generateGUID();
        reportType = category == EMERGENCY ? reportType : "";
        flightId = currentFlightId;
        var flightInformation = query.getFlight(currentFlightId);
        if (flightInformation != null) {
            aircraftRegistration = flightInformation.aircraftRegistration;
            var flightLocalDate = utility.getDateForFlightNumber(flightInformation.flightDateLT);
            flightNumber = flightInformation.flightNumber + " / " + flightLocalDate;

            sector = flightInformation.departureStation + "-" + flightInformation.arrivalStation;
        } else {
            aircraftRegistration = "";
            flightNumber = "";
            sector = "";
        }
        flightInformation = null;
        subject = category == EMERGENCY ? reportType : "";
        equipment = null;
        if (equipmentId != null && equipmentId.length > 0 && category == SAFETY_EQUIPMENT) {
            equipment = query.getEquipmentDetailById(equipmentId);
        }

        part = null;
        ataChapter = "";
        condition = "";
        safetyZone = "";
        if (category == SAFETY_EQUIPMENT) {
            logGroup = FLIGHT_DECK_LOG;
        } else if (category == AC_MAINTENANCE) {
            logGroup = CABIN_LOG;
        } else {
            logGroup = 0;
        }
        sequenceNumber = "";
        detail = "";

        var userId = query.getUserId();
        var user = query.getUserDetailsFromCrew(userId.id + "_" + currentFlightId);
        if (user != null) {
            $.reportByLabel.text = user.rank + ". " + user.firstName + " " + user.lastName;
            createdBy = user.sfdcId;
        } else {
            $.reportByLabel.text = "";
            createdBy = "";
        }

        // User
        reportedBy = "";
        createDateTime = utility.createDateTimeForSFDC();
        updateDateTime = utility.createDateTimeForSFDC();
        incidentStatus = OPEN;
        if (category == SAFETY_EQUIPMENT || category == AC_MAINTENANCE) {
            isLog = true;
        } else {
            isLog = false;
        }
        if (passengerId != null && passengerId.length > 0) {
            var passenger = query.getPassengerDetailByIdOrAccountIdOrPaxKey(passengerId);
            if (passenger != null) {
                if (passenger.bookingSeat != null && passenger.bookingSeat.length > 0) {
                    positionGroupMem.push(passenger.bookingSeat);
                }
                var passengerTemp = {
                    paxId : passengerId,
                    accountId : passenger.accountId,
                    paxKey : passenger.paxKey,
                    role : "",
                    detail : "",
                    incidentId : incidentId,
                    type : PERSON_MASTER
                };
                paxGroupMem.push(passengerTemp);
            }
        } else if (lopaPos != null && lopaPos.length > 0) {
            for (var i = 0; i < lopaPos.length; i++) {
                var paxQr = query.getPassengerDetailByLopaPosition(lopaPos[i]);
                if (i == 0) {
                    if (paxQr != null) {
                        var paxData = {
                            paxId : paxQr.id,
                            accountId : paxQr.accountId,
                            paxkey : paxQr.paxKey,
                            role : "",
                            detail : "",
                            type : PERSON_MASTER,
                            incidentId : incidentId,
                        };
                        paxGroupMem.push(paxData);
                    }
                } else {
                    if (paxQr != null) {
                        var paxData = {
                            paxId : paxQr.id,
                            accountId : paxQr.accountId,
                            paxkey : paxQr.paxKey,
                            role : "",
                            detail : "",
                            type : PERSON_MASTER,
                            incidentId : incidentId,
                        };
                        paxInvolvedMem.push(paxData);
                    }

                }
            }
        }

        if (seatId != null && seatId.length > 0) {
            positionGlobal = query.getLOPAPositionDetailByLopaId(seatId);
            if (positionGlobal != null)
                if (positionGlobal.position != null && positionGlobal.position.length > 0)
                    positionGroupMem.push(positionGlobal.position);
        } else if (lopaPos != null && lopaPos.length > 0) {
            for (var i = 0; i < lopaPos.length; i++) {
                positionGroupMem.push(lopaPos[i]);
            }
        } else {
            seatId = "";
            positionGlobal = null;
        }

        if (zoneName != null && zoneName.length > 0 && category == SAFETY_EQUIPMENT) {
            positionGroupMem.push(zoneName);
        }

        if (crewId != null && crewId.length > 0) {
            if ((emergencyType == CREW_DECEASE || emergencyType == SEVERE_CREW_INJURY) && category == EMERGENCY) {
                var crewTemp = {
                    crewId : crewId,
                    role : "",
                    detail : "",
                    incidentId : incidentId,
                    type : PERSON_MASTER
                };
                crewGroupMem.push(crewTemp);
                crew = query.getCrewDetailBySfdcId(crewId);
            } else {
                var crewTemp = {
                    crewId : crewId,
                    role : "",
                    detail : "",
                    incidentId : incidentId,
                    type : PERSON_INVOLVED
                };
                crewInvolvedMem.push(crewTemp);
                crew = null;
            }
        } else {
            crewId = "";
            crew = null;
        }

        isMulti = false;
        isSubmitted = false;
        isVoided = false;
        isSynced = false;
        isSkippedPhoneAndMail = false;
        reasonForChangeSeatTemp = "";

    } else {//View Incident Detail
        $.incidentDetailWindow.title = "Incident Detail";
        incident = query.getIncidentDetail(incidentId);

        if (incident != null) {
            if (incident.paxMem != null && incident.paxMem.length > 0) {
                if (incident.paxMem[0].type != PERSON_INVOLVED) {
                    paxGroupMem.push(incident.paxMem[0]);
                    for (var i = 1; i < incident.paxMem.length; i++) {
                        paxInvolvedMem.push(incident.paxMem[i]);
                    }
                } else {
                    for (var i = 0; i < incident.paxMem.length; i++) {
                        paxInvolvedMem.push(incident.paxMem[i]);
                    }
                }
            } else {
                paxGroupMem = [];
                paxInvolvedMem = [];
            }

            if (incident.posMem != null && incident.posMem.length > 0) {
                for (var i = 0; i < incident.posMem.length; i++) {
                    if (incident.posMem[i].positionId != null && incident.posMem[i].positionId.length > 0)
                        positionGroupMem.push(incident.posMem[i].positionId);
                    else if (incident.posMem[i].name != null && incident.posMem[i].name.length > 0)
                        positionGroupMem.push(incident.posMem[i].name);
                    else
                        positionGroupMem.push("");
                }
            } else {
                positionGroupMem = [];
            }

            if (incident.crewMem != null && incident.crewMem.length > 0) {
                if (incident.crewMem[0].type != PERSON_INVOLVED && incident.category == EMERGENCY && (incident.emergencyType == CREW_DECEASE || incident.emergencyType == SEVERE_CREW_INJURY)) {
                    crewGroupMem.push(incident.crewMem[0]);
                    crewId = crewGroupMem[0].crewId;
                    crew = query.getCrewDetailBySfdcId(crewId);
                    for (var i = 1; i < incident.crewMem.length; i++) {
                        crewInvolvedMem.push(incident.crewMem[i]);
                    }
                } else {
                    for (var i = 0; i < incident.crewMem.length; i++) {
                        crewInvolvedMem.push(incident.crewMem[i]);
                    }
                }
            } else {
                crewId = "";
                crew = null;
                crewGroupMem = [];
                crewInvolvedMem = [];
            }

            if (incident.staffMem != null && incident.staffMem.length > 0) {
                staffGroupMem = incident.staffMem;
            } else {
                staffGroupMem = [];
            }

            if (incident.compen != null && incident.compen.length > 0) {
                compensationMem = incident.compen;
            } else {
                compensationMem = [];
            }
            if (compensationMem != null && compensationMem.length > 0) {
                for (var j = 0; j < compensationMem.length; j++) {
                    if (compensationMem[j].type == "Upgrade Seat") {
                        isSeatUpgraded = true;
                    }
                    if (compensationMem[j].type == "Duty Free") {
                        compensationMem[j].compAttachment = query.getCompAttachment(compensationMem[j].compensationId, compensationMem[j].incidentId);
                    }
                }
            }

            if (incident.attachment != null && incident.attachment.length > 0) {
                attachementMem = incident.attachment;
                for (var i = 0; i < attachementMem.length; i++) {
                    var attachment = {
                        id : attachementMem[i].id,
                        name : attachementMem[i].name,
                        detail : attachementMem[i].detail,
                        incidentId : incidentId
                    };

                    if (i == 0) {
                        attachment1.push(attachment);
                    }
                    if (i == 1) {
                        attachment2.push(attachment);
                    }
                    if (i == 2) {
                        attachment3.push(attachment);
                    }
                }
            } else {
                attachementMem = [];
            }

            if (incident.changeSeatMem != null && incident.changeSeatMem.length > 0) {
                changeSeatMem = incident.changeSeatMem;
                isAlreadyChangedSeat = true;
                $.changeSeatRightArrowImage.left = 0;
                $.changeSeatRightArrowImage.width = 0;
                $.removeChangeSeatImage.width = 23;
                changeGroupMemTempForRemove = [];
            }

            incidentId = incident.id;
            category = incident.category;
            reportType = incident.reportType;
            flightId = currentFlightId;
            subject = incident.subject;
            $.paxPhoneTextField.value = incident.phone;
            $.paxEmailTextField.value = incident.email;
            isSkippedPhoneAndMail = incident.isSkippedPhoneEmail;

            if (incident.equipmentId != null && incident.equipmentId.length > 0) {
                equipment = query.getEquipmentDetailById(incident.equipmentId);
            } else {
                equipment = null;
            }

            if (incident.partId != null && incident.partId.length > 0) {
                part = query.getEquipmentPart(incident.partId);
            } else {
                part = null;
            }

            safetyZone = incident.safetyZone;

            if (equipment != null) {
                ataChapter = equipment.ataChapter;
            } else {
                ataChapter = "";
            }

            var conditionStr = incident.condition;
            if (conditionStr != null) {
                condition = conditionStr.replace(/;/gi, ", ");
                conditionForSFDC = conditionStr;
            } else {
                condition = "";
                conditionForSFDC = "";
            }

            logGroup = incident.logGroup;
            sequenceNumber = incident.sequenceNumber;
            detail = incident.detail;
            createdBy = incident.createdBy;
            if (createdBy != null && createdBy.length > 0) {
                var user = query.getCrewDetailBySfdcId(createdBy);
                if (user != null) {
                    $.reportByLabel.text = user.rank + ". " + user.crewFirstName + " " + user.crewLastName;
                    createdBy = user.sfdcId;
                } else {
                    $.reportByLabel.text = "";
                    createdBy = "";
                }
            } else {
                $.reportByLabel.text = "";
                createdBy = "";
            }

            reportedBy = incident.reportedBy;
            reportedByData = query.getCrewDetailBySfdcId(incident.reportedBy);
            createDateTime = incident.createDateTime;
            updateDateTime = incident.updateDateTime;
            incidentStatus = incident.incidentStatus;
            flightNumber = incident.flightNumber;
            isLog = incident.isLog;
            isMulti = incident.isMulti;
            isSubmitted = incident.isSubmitted;
            isVoided = incident.isVoided;
            isSynced = incident.isSynced;
            emergencyType = incident.emergencyType;
            aircraftRegistration = incident.acReg;
            reasonForChangeSeatTemp = incident.reasonForChangeSeat;
        }
    }

    viewIncidentDetailPage();
}

//**********************************************
//* Main
//**********************************************
$.incidentDetailWindow.backgroundImage = bgGeneral;
$.incidentDetailWindow.touchEnabled = false;

$.incidentDetailWindow.addEventListener('postlayout', function() {
    if (!isPostedLayout) {
        isPostedLayout = true;

        initializeIncidentDetail();
        if (OS_IOS) {
            Alloy.Globals.activityIndicator.hide();
        }
        setTimeout(function() {
            $.incidentDetailWindow.touchEnabled = true;
        }, 300);
    }
});

$.incidentDetailWindow.addEventListener('focus', function(e) {
    if (personInvolvedRefresh) {
        if ((paxGroupMemGlobalTemp != null && paxGroupMemGlobalTemp.length > 0) || (paxInvolvedMem != null && paxInvolvedMem.length > 0)) {
            paxInvolvedMem = [];
            if (paxGroupMemGlobalTemp != null && paxGroupMemGlobalTemp.length > 0)
                paxInvolvedMem = paxGroupMemGlobalTemp;

            for (var i = 0; i < paxGroupMemGlobalTemp.length; i++) {
                if (paxGroupMemGlobalTemp[i].position != null && paxGroupMemGlobalTemp[i].position.length > 0)
                    if (!positionGroupMem.contains(paxGroupMemGlobalTemp[i].position))
                        positionGroupMem.push(paxGroupMemGlobalTemp[i].position);
            }
            var posGroupTemp = positionGroupMem;
            for (var i = 0; i < positionGroupMem.length; i++) {
                if (positionGroupMem[i] != null && positionGroupMem[i].length > 0)
                    if (paxPositionMemRemovedTemp.contains(positionGroupMem[i]))
                        posGroupTemp[i] = null;
            }
            positionGroupMem = [];
            for (var i = 0; i < posGroupTemp.length; i++) {
                if (posGroupTemp[i] != null && posGroupTemp[i].length > 0)
                    positionGroupMem.push(posGroupTemp[i]);
            }
            posGroupTemp = null;
            paxPositionMemRemovedTemp = [];
        }
        showPosition();
        paxGroupMemGlobalTemp = [];

        if ((crewGroupMemGlobalTemp != null && crewGroupMemGlobalTemp.length > 0) || (crewInvolvedMem != null && crewInvolvedMem.length > 0)) {
            crewInvolvedMem = [];
            crewInvolvedMem = crewGroupMemGlobalTemp;
            crewGroupMemGlobalTemp = [];
        }

        if ((staffGroupMemGlobalTemp != null && staffGroupMemGlobalTemp.length > 0) || (staffGroupMem != null && staffGroupMem.length > 0)) {
            staffGroupMem = [];
            staffGroupMem = staffGroupMemGlobalTemp;
            staffGroupMemGlobalTemp = [];
        }
        personInvolvedRefresh = 0;
        showPersonInvolveQuantity();
        if (OS_IOS) {
            Alloy.Globals.activityIndicator.hide();
        }
    }

    if (compensationRefresh) {
        if (compensationGlobalTemp != null && compensationGlobalTemp.length > 0) {
            compensationMem = [];
            compensationMem = compensationGlobalTemp;
            if (compensationMem != null && compensationMem.length > 0) {
                for (var j = 0; j < compensationMem.length; j++) {
                    if (compensationMem[j].type == "Upgrade Seat") {
                        isSeatUpgraded = true;
                        break;
                    }
                }
            }

            compensationGlobalTemp = [];
            incidentStatus = RESOLVED;
            statusSection();
            compensationShow();
        } else {
            incidentStatus = OPEN;
            statusSection();
            compensationShow();
        }
        compensationRefresh = 0;
        if (OS_IOS) {
            Alloy.Globals.activityIndicator.hide();
        }
    }
    
    if (ropEnrollmentRefresh) {
        ropEnrollmentRefresh = 0;
        passengerSection();
    }

    if (changeSeatFromIncidentDetailIsRefresh) {
        changeSeatFromIncidentDetailIsRefresh = 0;
        changeSeatMem = changSeatGlobalTemp;
        if (changeSeatMem != null && changeSeatMem.length > 0) {
            $.chageSeatLabel.text = "From seat No. " + (changeSeatMem[0].fromSeat != null ? changeSeatMem[0].fromSeat : "") + " class " + (changeSeatMem[0].fromClass != null ? changeSeatMem[0].fromClass : "") + " to seat No. " + (changeSeatMem[0].toSeat != null ? changeSeatMem[0].toSeat : "") + " class " + (changeSeatMem[0].toClass != null ? changeSeatMem[0].toClass : "") + " (" + "Reason for change: " + reasonForChangeSeatTemp + ")";
            $.changeSeatRightArrowImage.left = 0;
            $.changeSeatRightArrowImage.width = 0;
            $.removeChangeSeatImage.width = 23;
            changeGroupMemTempForRemove = [];
        }
        changSeatGlobalTemp = [];
    }
});

if (OS_ANDROID) {
    $.incidentDetailWindow.addEventListener('android:back', function(e) {
        cancelFunction();
    });

    var softInput = Titanium.UI.Android.SOFT_INPUT_STATE_ALWAYS_HIDDEN | Ti.UI.Android.SOFT_INPUT_ADJUST_PAN;
    $.incidentDetailWindow.windowSoftInputMode = softInput;

    $.categoryLabel.width = "70%";
    $.typeLabel.width = "65%";
    $.paxPhoneTextField.width = "70%";
    $.paxEmailTextField.width = "70%";
    $.subjectTextField.width = "70%";
    $.personInvolvedLabel.width = "65%";
    $.addImageBtn.left = "55%";
    $.attachmentTextField1.width = "68%";
    $.attachmentTextField2.width = "68%";
    $.attachmentTextField3.width = "68%";
    $.chageSeatLabel.width = "65%";
    $.compensationLabel.width = "65%";
    $.dateTimeView.height = SMALLESS_ROW_HEIGHT;
    $.reportedByView.height = SMALLESS_ROW_HEIGHT;
    $.reportByTextField.width = "69%";
    $.positionLabel.width = "65%";
    $.equipmentPartLabel.width = "65%";
    $.conditionLabel.width = "65%";
    $.ataChapterLabel.width = "69%";
    $.crewLabel1.width = '65%';
    $.crewLabel.width = '65%';
    $.zoneLabel.width = "65%";
    $.pendingBtn.left = "4%";

    $.paxPhoneTextField.backgroundColor = '#2A0E4D';
    $.paxEmailTextField.backgroundColor = '#2A0E4D';
    $.subjectTextField.backgroundColor = '#2A0E4D';
    $.seqNoTextField.backgroundColor = '#2A0E4D';
    $.detailTextField.backgroundColor = '#2A0E4D';
    $.reportByTextField.backgroundColor = '#2A0E4D';

    $.attachmentTextField1.backgroundColor = '#2A0E4D';
    $.attachmentTextField2.backgroundColor = '#2A0E4D';
    $.attachmentTextField3.backgroundColor = '#2A0E4D';

}

