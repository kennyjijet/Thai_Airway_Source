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
var incidentId = args.incidentId;
var isSubmitted = args.isSubmitted;
var crewMaster = args.crewMaster;
//var isVoided = args.isVoided;

var isSubmiitedOrVoided = isSubmitted;

var paxGroupMem = args.paxGroupMem;
var crewGroupMem = args.crewGroupMem;
var staffGroupMem = args.staffGroupMem;

var paxMaster = args.paxMaster;

paxGroupMemGlobalTemp = [];
crewGroupMemGlobalTemp = [];
staffGroupMemGlobalTemp = [];

const paxType = 1;
const crewType = 2;
const staffType = 3;

var personType = paxType;
var maxHieght = "79%";

var isPostedLayout = false;

var changeState = 0;

var menuItem;

//**********************************************
//* Function
//**********************************************
//* Array container
Array.prototype.contains = function(obj) {
    return this.indexOf(obj) > -1;
};

//* Remove Array record
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

//* Select Person Involed Type | PASSENGER | CREW | STAFF
$.pasengerBtnMenu.addEventListener('click', function() {
	if(OS_IOS) {
	    Alloy.Globals.activityIndicator.show();		
	}
    setTimeout(function() {

        personType = paxType;
        if (!isSubmiitedOrVoided) {
            $.addPersonInvolvedBtnView1.height = 60;
            $.addPersonInvolvedBtnView2.height = 0;
            $.addPersonInvolvedBtnView3.height = 0;
        }
        btnPersonTypeSelected();
        showPersonInvolved();
		if(OS_IOS) {        
        	Alloy.Globals.activityIndicator.hide();
        }
    }, 50);
});

$.crewBtnMenu.addEventListener('click', function() {
	if(OS_IOS) {
	    Alloy.Globals.activityIndicator.show();		
	}
    setTimeout(function() {
        personType = crewType;
        if (!isSubmiitedOrVoided) {
            $.addPersonInvolvedBtnView1.height = 0;
            $.addPersonInvolvedBtnView2.height = 60;
            $.addPersonInvolvedBtnView3.height = 0;
        }
        btnPersonTypeSelected();
        showPersonInvolved();
		if(OS_IOS) {        
        	Alloy.Globals.activityIndicator.hide();
        }
    }, 50);

});

$.staffBtnMenu.addEventListener('click', function() {
	if(OS_IOS) {
	    Alloy.Globals.activityIndicator.show();		
	}
    setTimeout(function() {
        personType = staffType;
        if (!isSubmiitedOrVoided) {
            $.addPersonInvolvedBtnView1.height = 0;
            $.addPersonInvolvedBtnView2.height = 0;
            $.addPersonInvolvedBtnView3.height = 60;
        }
        btnPersonTypeSelected();
        showPersonInvolved();
		if(OS_IOS) {        
        	Alloy.Globals.activityIndicator.hide();
        }
    }, 50);
});

function btnPersonTypeSelected() {

    switch (personType) {
    case paxType:
        $.pasengerBtnMenu.backgroundColor = colorSelectedBtnHighlight;
        $.crewBtnMenu.backgroundColor = "transparent";
        $.staffBtnMenu.backgroundColor = "transparent";

        break;

    case crewType:
        $.pasengerBtnMenu.backgroundColor = "transparent";
        $.crewBtnMenu.backgroundColor = colorSelectedBtnHighlight;
        $.staffBtnMenu.backgroundColor = "transparent";
        break;

    case staffType:
        $.pasengerBtnMenu.backgroundColor = "transparent";
        $.crewBtnMenu.backgroundColor = "transparent";
        $.staffBtnMenu.backgroundColor = colorSelectedBtnHighlight;
        break;

    default :
        $.pasengerBtnMenu.backgroundColor = "transparent";
        $.crewBtnMenu.backgroundColor = "transparent";
        $.staffBtnMenu.backgroundColor = "transparent";
        break;
    }

}

//* Add Involved button
// Passenger
$.addPersonInvolvedBtnView1.addEventListener('click', function() {
	var passengerSingleSelectView = Alloy.createController("passengers/passenger_single_select", [getPersonDataFromPicklist, {
        flightId : currentFlightId
    }]).getView();
    
   	if(OS_IOS){
   		Alloy.Globals.navGroupWin.openWindow(passengerSingleSelectView);
    }else{
   		passengerSingleSelectView.open();
   	}
    			 
});

// Crew
$.addPersonInvolvedBtnView2.addEventListener('click', function() {
    var data = [];
    data = query.getCrewListSortBySeqNo(currentFlightId);
    var tableData = [];
    for (var i = 0; i < data.length; i++) {
        tableData.push(createOptDialogCrewList(data[i].rank + ". " + data[i].crewFirstName + " " + data[i].crewLastName, data[i].sfdcId, data.length));
    }
    var win2 = component.createOptionDialogWindow(tableData, "50%");
    data = null;
    tableData = null;
    win2.open();
    win2.addEventListener("click", function(e) {
        win2.close();
    });
});

// Staff
$.addPersonInvolvedBtnView3.addEventListener('click', function() {
    var staffTemp = {
        personnelId : "",
        role : "",
        detail : "",
        name : "",
        incidentId : incidentId
    };
    staffGroupMem.push(staffTemp);
    showPersonInvolved();
});

//* Add PAX involed table row
function getPersonDataFromPicklist(value) {
    if (value != null && value.id.length > 0) {
        var isSame = false;
        if (paxMaster != null) {
            if (value.paxKey != paxMaster.paxKey ) {
                if (paxGroupMem != null && paxGroupMem.length > 0) {
                    for (var i = 0; i < paxGroupMem.length; i++) {
                        if (value.id == paxGroupMem[i].id) {
                            isSame = true;
                            break;
                        }
                    }
                    if (!isSame)
                        paxGroupMem.push(value);
                    else {//alert ("This person already selected.");
                        var _promptView = new Alloy.createController("common/alertPrompt", {
                            title : "Alert",
                            message : "This person already selected.",
                            okText : "OK",
                            disableCancel : true,
                            onOk : function() {
                            }
                        }).getView();
                        _promptView.open();
                    }
                } else {
                    paxGroupMem.push(value);
                }
            } else {
                var _promptView = new Alloy.createController("common/alertPrompt", {
                    title : "Alert",
                    message : "This person already selected on Passenger section.",
                    okText : "OK",
                    disableCancel : true,
                    onOk : function() {
                    }
                }).getView();
                _promptView.open();
            }
        } else {
            if (paxGroupMem != null && paxGroupMem.length > 0) {
                for (var i = 0; i < paxGroupMem.length; i++) {
                    if (value.id == paxGroupMem[i]) {
                        isSame = true;
                        break;
                    }
                }
                if (!isSame)
                    paxGroupMem.push(value);
                else {
                    //alert ("This person already selected.");
                    var _promptView = new Alloy.createController("common/alertPrompt", {
                        title : "Alert",
                        message : "This person already selected.",
                        okText : "OK",
                        disableCancel : true,
                        onOk : function() {
                        }
                    }).getView();
                    _promptView.open();
                }
            } else {
                paxGroupMem.push(value);
            }
        }
        showPersonInvolved();
    }
}

function addPaxInvolvedName(dataArg) {
    var indexArg = dataArg.index;
    var paxIdArg = dataArg.paxId;
    var nameArg = dataArg.name;
    var seatArg = dataArg.bookingSeat;
    var classArg = dataArg.bookingClass;
    var floorArg = dataArg.floor;

	if(OS_ANDROID) {
		var frontHeight = 21;
	} else {
		var frontHeight = 18;		
	}
    //    Name Header section
    var btnName = Ti.UI.createLabel({
        text : "Name : ",
        left : "3%",
        height : frontHeight,

        font : {
            fontWeight : "bold",
            fontSize : 18
        },
        color : colorTextTitle
    });
    if (nameArg == null || nameArg.length < 1) {
        nameArg = "";
    } else {
        nameArg += " ";
    }
    if (seatArg == null || seatArg.length < 1) {
        seatArg = "";
    } else {
        seatArg = "Seat NO: " + seatArg;
    }
    if (classArg == null || classArg.length < 1) {
        classArg = "";
    } else {
        classArg = " Class " + classArg;
    }
    if (floorArg == null || floorArg.length < 1) {
        floorArg = "";
    } else {
        floorArg = " Floor " + floorArg;
    }

    var firstNamelastName = Ti.UI.createLabel({
        text : nameArg + "  " + seatArg + " " + classArg + " " + floorArg,
        left : "15%",
        height : "100%",
        width : "75%",
        font : {
            fontWeight : "bold",
            fontSize : 18
        },
        color : colorTextValue
    });

    // Remove Button on header section
    var removeBtn = Ti.UI.createImageView({
        image : "/images/ic_remove.png",
        right : "15",
        height : 30,
        widht : 30,
        index : indexArg,
        id : "revmoveBtn" + indexArg
    });

    removeBtn.addEventListener('click', function(e) {
        var _syncDataPromptView = new Alloy.createController("common/alertPrompt", {
            title : 'Confirm',
            message : 'Do you want to delete?',
            okText : "Yes",
            cancelText : "No",
            onOk : function() {
                var passenger = query.getPassengerDetail(paxGroupMem[e.source.index].id);
                if (passenger != null)
                    if (passenger.bookingSeat != null && passenger.bookingSeat.length > 0)
                        paxPositionMemRemovedTemp.push(passenger.bookingSeat);
                        
                paxGroupMem.remove(e.source.index);
                showPersonInvolved();
            }
        }).getView();
        _syncDataPromptView.open();

    });

	if(OS_ANDROID) {
		var rowHeight = 65;
	} else {
		var rowHeight = "8%";
	}
    // Header section
    var rowHeader = Ti.UI.createTableViewRow({
        idType : "btnRow",
        //        id : btnIdAgr,
        backgroundImage : bgHeaderSection,
        selectedColor : 'transparent',
        backgroundColor : 'transparent',
        hasChild : false,
        width : "100%",
        height : rowHeight,
        selectedBackgroundColor : '#666',
        index : indexArg,
        id : "row" + indexArg
    });

    rowHeader.add(btnName);
    rowHeader.add(firstNamelastName);
    if (!isSubmiitedOrVoided)
        rowHeader.add(removeBtn);

    return rowHeader;
    rowHeader = null;

}

function addPaxInvolvedRoleDetails(dataArg) {
    var indexArg = dataArg.index;
    var paxIdArg = dataArg.paxId;
    var roleArg = dataArg.role;
    var detailsArg = dataArg.detail;

    //    Name Header section
    if (roleArg == null || roleArg.length < 1) {
        roleArg = "";
    }
    if (detailsArg == null || detailsArg.length < 1) {
        detailsArg = "";
    }

	if(OS_ANDROID) {
		var frontHeight = 21;
	} else {
		var frontHeight = 18;		
	}

    // Role: Text Title
    var role = Ti.UI.createLabel({
        text : "Role :",
        left : "3%",
        top : "3%",
        height : frontHeight,

        font : {
            fontWeight : "bold",
            fontSize : 18
        },
        color : colorTextTitle
    });

    // Role detail text area
    var textAreaRole = Ti.UI.createTextArea({
        borderRadius : 5,
        borderWidth : 1,
        borderColor : "#7B549C",
        color : '#336699',
        top : "10%",
        //        bottom : alignBottom,
        height : "15%",
        left : "3%",
        width : "94%",
        backgroundColor : "#26000000",
        color : colorTextValue,
        verticalAlign : Titanium.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
        textAlign : Titanium.UI.TEXT_ALIGNMENT_LEFT,
        value : roleArg, //textValue,
        font : {
            fontWeight : "bold",
            fontSize : 18
        },
        index : indexArg,
        id : "role" + indexArg,
        touchEnabled : isSubmiitedOrVoided ? false : true

    });

    textAreaRole.addEventListener('change', function(e) {
        paxGroupMem[e.source.index].role = e.source.value;
    });

    // Details: Text title
    var detail = Ti.UI.createLabel({
        text : "Details :",
        left : "3%",
        top : "30%",
        height : frontHeight,

        font : {
            fontWeight : "bold",
            fontSize : 18
        },
        color : colorTextTitle
    });
    // Detail text area
    var textAreaDetail = Ti.UI.createTextArea({
        borderRadius : 5,
        borderWidth : 1,
        borderColor : "#7B549C",
        color : '#336699',
        top : "41%",
        bottom : "5%",
        //        height : "40%",
        left : "3%",
        width : "94%",
        backgroundColor : "#26000000",
        color : colorTextValue,
        verticalAlign : Titanium.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
        textAlign : Titanium.UI.TEXT_ALIGNMENT_LEFT,
        value : detailsArg, //textValue,
        font : {
            fontWeight : "bold",
            fontSize : 18
        },
        index : indexArg,
        id : "details" + indexArg,
        touchEnabled : isSubmiitedOrVoided ? false : true
    });

    textAreaDetail.addEventListener('change', function(e) {
        paxGroupMem[e.source.index].detail = e.source.value;
    });

	if(OS_ANDROID) {
		var rowHeight = 325;
	} else {
		var rowHeight = "40%";		
	}
	
    var rowDetail = Ti.UI.createTableViewRow({
        //        className : 'row',
        idType : "btnRow",
        index : indexArg,
        //        id : btnIdAgr,
        backgroundImage : null,
        selectedColor : 'transparent',
        backgroundColor : 'transparent',
        hasChild : false,
        width : "100%",
        height : rowHeight,
        selectedBackgroundColor : '#666',
        //       touchEnabled : true
    });

    rowDetail.add(role);
    rowDetail.add(textAreaRole);
    rowDetail.add(detail);
    rowDetail.add(textAreaDetail);

    return rowDetail;
    rowDetail = null;

}

//* Add Staff involved table row
function addStaffInvolved(dataArg) {
    var indexArg = dataArg.index;
    var personnelIdArg = dataArg.personnelId;
    var nameArg = dataArg.name;

    // Remove Button on header section
    var removeBtn = Ti.UI.createImageView({
        image : "/images/ic_remove.png",
        right : "15",
        top : "3%",
        height : 30,
        widht : 30,
        index : indexArg,
        id : "revmoveBtn" + indexArg
    });

    removeBtn.addEventListener('click', function(e) {
        var _syncDataPromptView = new Alloy.createController("common/alertPrompt", {
            title : 'Confirm',
            message : 'Do you want to delete?',
            okText : "Yes",
            cancelText : "No",
            onOk : function() {
                staffGroupMem.remove(e.source.index);
                showPersonInvolved();
            }
        }).getView();
        _syncDataPromptView.open();

    });

	if(OS_ANDROID) {
		var frontHeight = 21;
	} else {
		var frontHeight = 18;		
	}
    // Personnel No. Text Title
    var role = Ti.UI.createLabel({
        text : "Personnel No.",
        left : "3%",
        top : "10%",
        height : frontHeight,

        font : {
            fontWeight : "bold",
            fontSize : 18
        },
        color : colorTextTitle
    });

    // Personal text area  text area
    var textAreaRole = Ti.UI.createTextField({
        borderRadius : 5,
        borderWidth : 1,
        borderColor : "#7B549C",
        color : '#336699',
        top : "25%",
        //        bottom : alignBottom,
        height : "20%",
        left : "3%",
        width : "94%",
        backgroundColor : "#26000000",
        color : colorTextValue,
        verticalAlign : Titanium.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
        textAlign : Titanium.UI.TEXT_ALIGNMENT_LEFT,
        value : personnelIdArg, //textValue,
        font : {
            fontWeight : "bold",
            fontSize : 18
        },
        index : indexArg,
        id : "role" + indexArg,
        touchEnabled : isSubmiitedOrVoided ? false : true

    });
    
    textAreaRole.addEventListener('change', function(e) {
    	if(OS_IOS){
	        e.source.value = utility.checkInputKeyMustBeNumber(e.source.value);    		
            staffGroupMem[e.source.index].personnelId = e.source.value;                
    	} else {
            if(!this.value){
                return;
            }              
            if(changeState == 0){
                changeState = 1;
                textAreaRole.setValue(utility.checkInputKeyMustBeNumber(this.value));
                staffGroupMem[e.source.index].personnelId = e.source.value;                
           }else{
                if(changeState == 1){
                    changeState = 2;
                    var len = textAreaRole.getValue().length;
                    textAreaRole.setSelection(len, len);
                }else{
                    changeState = 0;
                }
            }                               
    	    
    	}
    });

    if(OS_IOS) {
	    textAreaRole.keyboardType = Titanium.UI.KEYBOARD_TYPE_PHONE_PAD;    	
    } else {
	   	textAreaRole.keyboardType = Titanium.UI.KEYBOARD_NUMBER_PAD;
    }

    // Name: Text title
    var detail = Ti.UI.createLabel({
        text : "Name :",
        left : "3%",
        top : "55%",
        height : frontHeight,

        font : {
            fontWeight : "bold",
            fontSize : 18
        },
        color : colorTextTitle
    });
    // Name text area
    var textAreaDetail = Ti.UI.createTextArea({
        borderRadius : 5,
        borderWidth : 1,
        borderColor : "#7B549C",
        color : '#336699',
        top : "70%",
        //  bottom : "5%",
        height : "20%",
        left : "3%",
        width : "94%",
        backgroundColor : "#26000000",
        color : colorTextValue,
        verticalAlign : Titanium.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
        textAlign : Titanium.UI.TEXT_ALIGNMENT_LEFT,
        value : nameArg, //textValue,
        font : {
            fontWeight : "bold",
            fontSize : 18
        },
        index : indexArg,
        id : "details" + indexArg,
        touchEnabled : isSubmiitedOrVoided ? false : true

    });

    textAreaDetail.addEventListener('change', function(e) {
        staffGroupMem[e.source.index].name = e.source.value;
    });

	if(OS_ANDROID) {
		var rowHeight = 200;
	} else {
		var rowHeight = "25%";		
	}
    var rowDetail = Ti.UI.createTableViewRow({
        //        className : 'row',
        idType : "btnRow",
        index : indexArg,
        //        id : btnIdAgr,
        backgroundImage : null,
        selectedColor : 'transparent',
        backgroundColor : 'transparent',
        hasChild : false,
        width : "100%",
        height : rowHeight,
        selectedBackgroundColor : '#666',
        //       touchEnabled : true
    });
    if (!isSubmiitedOrVoided)
        rowDetail.add(removeBtn);
    rowDetail.add(role);
    rowDetail.add(textAreaRole);
    rowDetail.add(detail);
    rowDetail.add(textAreaDetail);

    return rowDetail;
    rowDetail = null;

}

//* Add Crew involed table row
function createOptDialogCrewList(dataArg, id, count) {
    var btnId = id;
    var btnName = dataArg;
    var incidentCatenName;
    var row = component.createOptionDialogBtn(btnId, 8, btnName, 65);
    row.add(component.createLabel(btnName, null));

    row.addEventListener("click", function(e) {
        if (e.source.id == undefined || e.source.idType == "btnRow") {
            var isSame = false;
            if (e.source.parent.id == undefined) {
                btnId = e.source.id;
                crewId = e.source.id;
                
                var isSameMaster = false;
                var isSameInvolvedGroup = false;
                if (crewId != null && crewId.length > 0) {
                    if(crewMaster != null) {
                        if(crewMaster.crewId != crewId) {
                           isSameMaster = false; 
                        } else {
                           isSameMaster = true;                             
                        }                        
                    } else {
                        isSameMaster = false;
                    } 
                    
                    if (crewGroupMem != null && crewGroupMem.length > 0) {
                        for (var i = 0; i < crewGroupMem.length; i++) {
                            if (crewId == crewGroupMem[i].crewId) {
                                isSameInvolvedGroup = true;
                                break;
                            }
                        }
                    } else {
                        isSameInvolvedGroup = false;
                    }
                    
                    isSame = isSameMaster | isSameInvolvedGroup;
                    
                    if (!isSame) {
                        crew = query.getCrewDetailBySfdcId(crewId);
                        var crewTemp = {
                            crewId : crewId,
                            role : "",
                            detail : "",
                            incidentId : incidentId,
                            firstName : crew.crewFirstName,
                            lastName : crew.crewLastName,
                            rank : crew.rank,
                            personNumber : crew.id.substring(0, 5)
                        };
                        crewGroupMem.push(crewTemp);
                        showPersonInvolved();
                    } else {
                        var _promptView = new Alloy.createController("common/alertPrompt", {
                            title : "Alert",
                            message : "This person already selected.",
                            okText : "OK",
                            disableCancel : true,
                            onOk : function() {
                            }
                        }).getView();
                        _promptView.open();
                    }
                    

                }
            } else {
                btnId = e.source.parent.id;
                crewId = e.source.parent.id;
                var isSameMaster = false;
                var isSameInvolvedGroup = false;
                if (crewId != null && crewId.length > 0) {
                    if(crewMaster != null) {
                        if(crewMaster.crewId != crewId) {
                           isSameMaster = false; 
                        } else {
                           isSameMaster = true;                             
                        }                        
                    } else {
                        isSameMaster = false;
                    } 
                    
                    if (crewGroupMem != null && crewGroupMem.length > 0) {
                        for (var i = 0; i < crewGroupMem.length; i++) {
                            if (crewId == crewGroupMem[i].crewId) {
                                isSameInvolvedGroup = true;
                                break;
                            }
                        }
                    } else {
                        isSameInvolvedGroup = false;
                    }
                    
                    isSame = isSameMaster | isSameInvolvedGroup;
                    
                    if (!isSame) {
                        crew = query.getCrewDetailBySfdcId(crewId);
                        var crewTemp = {
                            crewId : crewId,
                            role : "",
                            detail : "",
                            incidentId : incidentId,
                            firstName : crew.crewFirstName,
                            lastName : crew.crewLastName,
                            rank : crew.rank,
                            personNumber : crew.id.substring(0, 5)
                        };
                        crewGroupMem.push(crewTemp);
                        showPersonInvolved();
                    } else {
                        var _promptView = new Alloy.createController("common/alertPrompt", {
                            title : "Alert",
                            message : "This person already selected.",
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
    });
    btnId = null;
    btnName = null;
    imgPathName = null;
    return row;
}

function addCrewInvolvedName(dataArg) {
    var indexArg = dataArg.index;
    var crewIdArg = dataArg.crewId;
    var firstNameArg = dataArg.firstName;
    var lastNameArg = dataArg.lastName;
    var rankArg = dataArg.rank;
    var personNumberArg = dataArg.personNumber;

	if(OS_ANDROID) {
		var frontHeight = 21;
	} else {
		var frontHeight = 18;		
	}
    //    Name Header section
    var btnName = Ti.UI.createLabel({
        text : "Name : ",
        left : "3%",
        height : frontHeight,

        font : {
            fontWeight : "bold",
            fontSize : 18
        },
        color : colorTextTitle
    });
    if (rankArg == null || rankArg.length < 1) {
        rankArg = "";
    } else {
        rankArg += " ";
    }
    if (firstNameArg == null || firstNameArg.length < 1) {
        firstNameArg = "";
    } else {
        firstNameArg = firstNameArg + " ";
    }
    if (lastNameArg == null || lastNameArg.length < 1) {
        lastNameArg = "";
    } else {
        lastNameArg = lastNameArg + " ";
    }
    if (personNumberArg == null || personNumberArg.length < 1) {
        personNumberArg = "";
    } else {
        personNumberArg = " (" + personNumberArg + ")";
    }

    var firstNamelastName = Ti.UI.createLabel({
        text : rankArg + firstNameArg + lastNameArg + personNumberArg,
        left : "15%",
        height : frontHeight,

        font : {
            fontWeight : "bold",
            fontSize : 18
        },
        color : colorTextValue
    });

    // Remove Button on header section
    var removeBtn = Ti.UI.createImageView({
        image : "/images/ic_remove.png",
        right : "15",
        height : 30,
        widht : 30,
        index : indexArg,
        id : "revmoveBtn" + indexArg
    });

    removeBtn.addEventListener('click', function(e) {
        var _syncDataPromptView = new Alloy.createController("common/alertPrompt", {
            title : 'Confirm',
            message : 'Do you want to delete?',
            okText : "Yes",
            cancelText : "No",
            onOk : function() {
                crewGroupMem.remove(e.source.index);
                showPersonInvolved();
            }
        }).getView();
        _syncDataPromptView.open();

    });

	if(OS_ANDROID) {
		var rowHeight = 65;
	} else {
		var rowHeight = "8%";		
	}
    // Header section
    var rowHeader = Ti.UI.createTableViewRow({
        idType : "btnRow",
        //        id : btnIdAgr,
        backgroundImage : bgHeaderSection,
        selectedColor : 'transparent',
        backgroundColor : 'transparent',
        hasChild : false,
        width : "100%",
        height : rowHeight,
        selectedBackgroundColor : '#666',
        index : indexArg,
        id : "row" + indexArg
    });

    rowHeader.add(btnName);
    rowHeader.add(firstNamelastName);
    if (!isSubmiitedOrVoided)
        rowHeader.add(removeBtn);

    return rowHeader;
    rowHeader = null;

}

//* Add Crew Involved
function addCrewInvolvedRoleDetails(dataArg) {
    var indexArg = dataArg.index;
    var crewIdArg = dataArg.crewId;
    var roleArg = dataArg.role;
    var detailsArg = dataArg.detail;

	if(OS_ANDROID) {
		var frontHeight = 21;
	} else {
		var frontHeight = 18;		
	}

    //    Name Header section
    if (roleArg == null || roleArg.length < 1) {
        roleArg = "";
    }
    if (detailsArg == null || detailsArg.length < 1) {
        detailsArg = "";
    }

    // Role: Text Title
    var role = Ti.UI.createLabel({
        text : "Role :",
        left : "3%",
        top : "3%",
        height : frontHeight,

        font : {
            fontWeight : "bold",
            fontSize : 18
        },
        color : colorTextTitle
    });

    // Role detail text area
    var textAreaRole = Ti.UI.createTextArea({
        borderRadius : 5,
        borderWidth : 1,
        borderColor : "#7B549C",
        color : '#336699',
        top : "10%",
        //        bottom : alignBottom,
        height : "15%",
        left : "3%",
        width : "94%",
        backgroundColor : "#26000000",
        color : colorTextValue,
        verticalAlign : Titanium.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
        textAlign : Titanium.UI.TEXT_ALIGNMENT_LEFT,
        value : roleArg, //textValue,
        font : {
            fontWeight : "bold",
            fontSize : 18
        },
        index : indexArg,
        id : "role" + indexArg,
        touchEnabled : isSubmiitedOrVoided ? false : true
    });

    textAreaRole.addEventListener('change', function(e) {
        crewGroupMem[e.source.index].role = e.source.value;
    });

    // Details: Text title
    var detail = Ti.UI.createLabel({
        text : "Details :",
        left : "3%",
        top : "30%",
        height : frontHeight,

        font : {
            fontWeight : "bold",
            fontSize : 18
        },
        color : colorTextTitle
    });
    // Detail text area
    var textAreaDetail = Ti.UI.createTextArea({
        borderRadius : 5,
        borderWidth : 1,
        borderColor : "#7B549C",
        color : '#336699',
        top : "41%",
        bottom : "5%",
        //        height : "40%",
        left : "3%",
        width : "94%",
        backgroundColor : "#26000000",
        color : colorTextValue,
        verticalAlign : Titanium.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
        textAlign : Titanium.UI.TEXT_ALIGNMENT_LEFT,
        value : detailsArg, //textValue,
        font : {
            fontWeight : "bold",
            fontSize : 18
        },
        index : indexArg,
        id : "details" + indexArg,
        touchEnabled : isSubmiitedOrVoided ? false : true
    });

    textAreaDetail.addEventListener('change', function(e) {
        crewGroupMem[e.source.index].detail = e.source.value;
    });

	if(OS_ANDROID) {
		var rowHeight = 320;
	} else {
		var rowHeight = "40%";		
	}

    var rowDetail = Ti.UI.createTableViewRow({
        //        className : 'row',
        idType : "btnRow",
        index : indexArg,
        //        id : btnIdAgr,
        backgroundImage : null,
        selectedColor : 'transparent',
        backgroundColor : 'transparent',
        hasChild : false,
        width : "100%",
        height : rowHeight,
        selectedBackgroundColor : '#666',
        //       touchEnabled : true
    });

    rowDetail.add(role);
    rowDetail.add(textAreaRole);
    rowDetail.add(detail);
    rowDetail.add(textAreaDetail);

    return rowDetail;
    rowDetail = null;

}

function showPersonInvolved() {
    switch (personType) {
    case paxType:
        var tableData = [];
        if (paxGroupMem != null && paxGroupMem.length > 0) {
            for (var i = 0; i < paxGroupMem.length; i++) {
                var paxData = {
                    index : i,
                    paxId : paxGroupMem[i].id,
                    name : paxGroupMem[i].name,
                    bookingSeat : paxGroupMem[i].bookingSeat,
                    bookingClass : paxGroupMem[i].bookingClass,
                    floor : paxGroupMem[i].floor,
                    role : paxGroupMem[i].role,
                    detail : paxGroupMem[i].detail
                };
                tableData.push(addPaxInvolvedName(paxData));
                tableData.push(addPaxInvolvedRoleDetails(paxData));
            }
        }

        $.paxInvolvedCountLabel.text = " (" + paxGroupMem.length + ")";

        var tableView = Ti.UI.createTableView({
            backgroundColor : 'transparent',
            separatorStyle : 'none',
            selectionStyle : "none",
            scrollable : true,
            left : 2,
            right : 2,
            top : 2,
            bottom : 2,
            height : "100%",
            width : "100%",
            data : tableData
        });

        $.personInvolvedItemsView.removeAllChildren();
        $.personInvolvedItemsView.add(tableView);
        $.personInvolvedItemsView.show();

        break;

    case crewType:
        var tableData = [];
        if (crewGroupMem != null && crewGroupMem.length > 0) {
            for (var i = 0; i < crewGroupMem.length; i++) {
                var crewData = {
                    crewId : crewGroupMem[i].crewId,
                    role : crewGroupMem[i].role,
                    detail : crewGroupMem[i].detail,
                    incidentId : incidentId,
                    firstName : crewGroupMem[i].firstName,
                    lastName : crewGroupMem[i].lastName,
                    rank : crewGroupMem[i].rank,
                    personNumber : crewGroupMem[i].personNumber,
                    index : i
                };
                tableData.push(addCrewInvolvedName(crewData));
                tableData.push(addCrewInvolvedRoleDetails(crewData));
            }
        }

        $.crewInvolvedCountLabel.text = " (" + crewGroupMem.length + ")";

        var tableView = Ti.UI.createTableView({
            backgroundColor : 'transparent',
            separatorStyle : 'none',
            selectionStyle : "none",
            scrollable : true,
            left : 2,
            right : 2,
            top : 2,
            bottom : 2,
            height : "100%",
            width : "100%",
            data : tableData
        });

        $.personInvolvedItemsView.removeAllChildren();
        $.personInvolvedItemsView.add(tableView);
        $.personInvolvedItemsView.show();

        break;

    case staffType:
        var tableData = [];
        if (staffGroupMem != null && staffGroupMem.length > 0) {
            for (var i = 0; i < staffGroupMem.length; i++) {
                var staffData = {
                    personnelId : staffGroupMem[i].personnelId,
                    role : staffGroupMem[i].role,
                    detail : staffGroupMem[i].detail,
                    incidentId : incidentId,
                    name : staffGroupMem[i].name,
                    index : i
                };
                tableData.push(addStaffInvolved(staffData));
            }
        }
        $.staffInvolvedCountLabel.text = " (" + staffGroupMem.length + ")";

        var tableView = Ti.UI.createTableView({
            backgroundColor : 'transparent',
            separatorStyle : 'none',
            selectionStyle : "none",
            scrollable : true,
            left : 2,
            right : 2,
            top : 2,
            bottom : 2,
            height : "100%",
            width : "100%",
            data : tableData
        });

        $.personInvolvedItemsView.removeAllChildren();
        $.personInvolvedItemsView.add(tableView);
        $.personInvolvedItemsView.show();

        break;

    default :
        break;
    }

}

//* Save Button
if(OS_IOS) {
	$.saveBtn.addEventListener('click', function(e) {
	    savePersonInvolved();
	});	
} else {
    $.personInvolvedWindow.activity.onCreateOptionsMenu = function(e) { 
        menuItem = e.menu.add({ 
        title: !isSubmiitedOrVoided ? "Done" : "",  
        showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM 
    }); 
        menuItem.addEventListener("click", function(e) { 
            if(!isSubmiitedOrVoided) {
                savePersonInvolved();                
            }
        }); 
    };   
	
}

function savePersonInvolved() {
    var passengers = paxGroupMem;
    paxGroupMemGlobalTemp = [];
    if (passengers != null && passengers.length > 0) {
        for (var j = 0; j < passengers.length; j++) {
            var passenger = passengers[j];
            var paxQr = query.getPassengerDetailByIdOrAccountIdOrPaxKey(passenger.id);
            if (passenger != null) {
                var passengerArg = {
                    paxId : passenger.id,
                    accountId : paxQr.accountId,
                    paxKey : paxQr.paxKey,
                    incidentId : incidentId,
                    role : passenger.role,
                    detail : passenger.detail,
                    type : PERSON_INVOLVED,
                    position : passenger.bookingSeat
                };
                paxGroupMemGlobalTemp.push(passengerArg);
            }
        }
    }

    var crews = crewGroupMem;
    crewGroupMemGlobalTemp = [];
    if (crews != null && crews.length > 0) {
        for (var j = 0; j < crews.length; j++) {
            var crew = crews[j];
            var crewArg = {
                crewId : crew.crewId,
                incidentId : incidentId,
                role : crew.role,
                detail : crew.detail,
                type : PERSON_INVOLVED
            };
            crewGroupMemGlobalTemp.push(crewArg);
        }
    }

    staffGroupMemGlobalTemp = [];
    staffGroupMemGlobalTemp = staffGroupMem;

    personInvolvedRefresh = 1;
    $.personInvolvedWindow.close();
}

//* Cancel Button
if(OS_IOS) {
	$.cancelBtn.addEventListener('click', function(e) {
		canclePersonInvolved();
	});	
}

function canclePersonInvolved() {
    if (isSubmiitedOrVoided) {
        paxGroupMem = [];
        crewGroupMem = [];
        staffGroupMem = [];
        $.personInvolvedWindow.close();
    } else {
        var _syncDataPromptView = new Alloy.createController("common/alertPrompt", {
            title : 'Confirm',
            message : 'Do you want to discard the changes?',
            okText : "Yes",
            cancelText : "No",
            onOk : function() {
                paxGroupMem = [];
                crewGroupMem = [];
                staffGroupMem = [];
                $.personInvolvedWindow.close();
            }
        }).getView();
        _syncDataPromptView.open();
    }	
}

//* Initialize window
function init() {
    var paxGroupMemTemp1 = paxGroupMem;
    paxGroupMem = [];
    if (paxGroupMemTemp1 != null && paxGroupMemTemp1.length > 0) {
        for (var i = 0; i < paxGroupMemTemp1.length; i++) {
            if (paxGroupMemTemp1[i] != null) {
                var passenger = query.getPassengerDetailByIdOrAccountIdOrPaxKey(paxGroupMemTemp1[i].paxId,paxGroupMemTemp1[i].accountId,paxGroupMemTemp1[i].paxKey);
                if(passenger != null) {
                    var paxData = {
                        index : i,
                        id : passenger != null ? passenger.id : "",
                        name : passenger != null ? passenger.lastName + " " + passenger.firstName + " " + (passenger.salutation != null ? passenger.salutation : "") : "",
                        bookingSeat : passenger != null ? passenger.bookingSeat : "",
                        bookingClass : passenger != null ? passenger.bookingClass : "",
                        floor : passenger != null ? passenger.floor : "",
                        role : paxGroupMemTemp1[i].role,
                        detail : paxGroupMemTemp1[i].detail,
                        type : paxGroupMemTemp1[i].type
                    };
                    paxGroupMem.push(paxData);                    
                }
            }
        }
    }

    var crewGroupMemTemp1 = crewGroupMem;
    crewGroupMem = [];
    if (crewGroupMemTemp1 != null && crewGroupMemTemp1.length > 0) {
        for (var i = 0; i < crewGroupMemTemp1.length; i++) {
            if (crewGroupMemTemp1[i] != null) {
                crew = query.getCrewDetailBySfdcId(crewGroupMemTemp1[i].crewId);
                var crewTemp = {
                    crewId : crewGroupMemTemp1[i].crewId,
                    role : crewGroupMemTemp1[i].role,
                    detail : crewGroupMemTemp1[i].detail,
                    incidentId : incidentId,
                    firstName : crew != null ? crew.crewFirstName : "",
                    lastName : crew != null ? crew.crewLastName : "",
                    rank : crew != null ? crew.rank : "",
                    personNumber : crew != null ? crew.id.substring(0, 5) : ""
                };
                crewGroupMem.push(crewTemp);
            }
        }
    }

    var staffGroupMemTemp1 = staffGroupMem;
    staffGroupMem = [];
    if (staffGroupMemTemp1 != null && staffGroupMemTemp1.length > 0) {
        for (var i = 0; i < staffGroupMemTemp1.length; i++) {
            if (staffGroupMemTemp1[i] != null) {
                var staffTemp = {
                    personnelId : staffGroupMemTemp1[i].personnelId,
                    role : staffGroupMemTemp1[i].role,
                    detail : staffGroupMemTemp1[i].detail,
                    name : staffGroupMemTemp1[i].name,
                    incidentId : incidentId
                };
                staffGroupMem.push(staffTemp);
            }
        }
    }

    btnPersonTypeSelected();
    showPersonInvolved();
    $.paxInvolvedCountLabel.text = " (" + paxGroupMem.length + ")";
    $.crewInvolvedCountLabel.text = " (" + crewGroupMem.length + ")";
    $.staffInvolvedCountLabel.text = " (" + staffGroupMem.length + ")";

    if (isSubmiitedOrVoided) {
        $.addPersonInvolvedBtnView1.touchEnabled = false;
        $.addPersonInvolvedBtnView2.touchEnabled = false;
        $.addPersonInvolvedBtnView3.touchEnabled = false;
        $.addPersonInvolvedBtnView1.height = 0;
        $.addPersonInvolvedBtnView2.height = 0;
        $.addPersonInvolvedBtnView3.height = 0;
        $.addPersonInvolvedBtn3.hide();
        if(OS_IOS) {
            $.personInvolvedWindow.setRightNavButton(null);            
        }
        maxHieght = "89%";
    } else {
    }

}

//**********************************************
//* Main
//**********************************************
$.personInvolvedWindow.backgroundImage = bgGeneral;
//$.saveCancelButtonView.backgroundColor = "#26000000";

if(OS_IOS) {
    Alloy.Globals.activityIndicator.show();		
}
setTimeout(function() {
    init();
	if(OS_IOS) {        
    	Alloy.Globals.activityIndicator.hide();
    }
}, 500);


if(OS_ANDROID){
	$.personInvolvedWindow.addEventListener('android:back', function(e) {
		Ti.API.info("Press Back button");
		$.personInvolvedWindow.close();	
	});
	var softInput = Titanium.UI.Android.SOFT_INPUT_STATE_ALWAYS_HIDDEN | Ti.UI.Android.SOFT_INPUT_ADJUST_PAN;
	$.personInvolvedWindow.windowSoftInputMode = softInput;
}

