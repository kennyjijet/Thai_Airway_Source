//**********************************************
//* Require
//**********************************************
var query = require('query_lib');
var component = require('component_lib');
var utility = require('utility_lib');

//**********************************************
//* Variable Declaration
//**********************************************
var args = arguments[0] || {};
var accountId = args.accountId;
var passengerId = args.passengerId;
var paxKey = args.paxKey;
var LOPAPositionId = args.LOPAPositionId;
var LOPAPositionType = args.LOPAPositionType;
var doFunction = args.doFunction;
var fromWhere = args.fromWhere;
var irreName = args.irreName;
var incId = args.incId;
var upgradeCodeArg = args.upgradeCode;
var isFromLopa = args.isFromLopa;

var currentSeatClass = "";
var newSeatClass = "";
var seatDetailData = null;
var positionDetail = null;
var passenger = null;

//**********************************************
//* Function
//**********************************************
if(OS_ANDROID)
{
	$.seatClassLabel.height = '30';
	$.floorZoneLabel.height = '30';
	
	$.passengerNamelabel.height = '30';
	$.changeDetailValueFromLabel.height = '60';
	$.changeDetailValueToLabel.height = '60';
	
	$.changeFromViewId.height = '40';
	$.changeToViewId.height = '30';
	
	var softInput = Titanium.UI.Android.SOFT_INPUT_STATE_ALWAYS_HIDDEN | Ti.UI.Android.SOFT_INPUT_ADJUST_PAN;
    $.upgradeSeatDetailWindow.windowSoftInputMode = softInput;

}

function initialization() {
    if(doFunction == UPGRADE_SEAT_FUNCTION) {
        $.upgradeSeatDetailWindow.title = "Upgrade Seat Detail";    
        $.seatIcon.image = "/images/ic_upgrade_seat.png";        
        if(fromWhere == PASSENGER_DETAIL) {
            $.paymentBtn.height = 50;
            $.confirmSectionView.height = 0;             
        } else {
            $.paymentBtn.height = 0;
            if(OS_IOS)
            {
            	$.confirmSectionView.height = "15%";   
            }
            if(OS_ANDROID)
            {
            	$.confirmSectionView.height = "15%";   
            }          
        }
    } else if(doFunction == CHANGE_SEAT_FUNCTION) {
        $.upgradeSeatDetailWindow.title = "Change Seat Detail";    
        $.seatIcon.image = "/images/ic_change_seat.png";                
        $.paymentBtn.height = 0;
        if(OS_IOS)
        {
        	$.confirmSectionView.height = "15%";   
        	$.reasonForChangeView.height = "17%"; 
        }
        if(OS_ANDROID)
        {
        	$.confirmSectionView.height = "15%";   
        	$.reasonForChangeView.height = "17%"; 
        }
             
    } else {
        
    }

    seatDetailData = query.getIncidentSeatDetail(LOPAPositionId);
    positionDetail = query.getLOPAPositionDetailByLopaId(LOPAPositionId);
    if(OS_IOS){
    	passenger = query.getPassengerDetailByIdOrAccountIdOrPaxKey(passengerId, accountId, paxKey);	
    }
    if(OS_ANDROID)
    {
    	passenger = query.getPassengerDetailByIdOrAccountIdOrPaxKey(passengerId, accountId, paxKey, "");		
    }
    

    if(passenger != null) {
        var upgadeCode = query.getUpgradeCode(upgradeCodeArg);//passenger.upgradeCode);   
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
        var upgadeCode = null;
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
    

    $.seatClassLabel.text = (seatDetailData.position != null ? "Seat No. " + seatDetailData.position : "") + " - " + (seatDetailData.classSeat != null ? "Class"+ " " + seatDetailData.classSeat : "");
    $.floorZoneLabel.text = (seatDetailData.floor != null ?  "Floor " + seatDetailData.floor : "") + " - " + (seatDetailData.zone != null ? "Zone " + seatDetailData.zone : "");    
    
    $.passengerNamelabel.text = (passenger.lastName != null ? passenger.lastName : "") + " " + (passenger.firstName != null ? passenger.firstName : "") + " " + (passenger.salutation != null ? passenger.salutation : "");

    $.changeDetailTitleFromLabel.text = "From current seat : ";

    $.changeDetailValueFromLabel.text = "No. " + (passenger.bookingSeat != null ? passenger.bookingSeat : "") + 
                                 " " + currentSeatClass + " class";

    $.changeDetailTitleToLabel.text = "To new seat : ";

    $.changeDetailValueToLabel.text = "No. " +(seatDetailData.position != null ? seatDetailData.position : "") +
                               " " + newSeatClass + " class";

    if(upgadeCode != null && doFunction == UPGRADE_SEAT_FUNCTION) {
        $.amountTitleLabel.text = "Amount : ";
        $.amountLabel.text = upgadeCode.mile != null ? upgadeCode.mile + " Miles" : "";        
    } else {
        $.amountTitleLabel.text = "";
        $.amountLabel.text = "";
    }
}

//* Payment button
$.paymentBtn.addEventListener("click", function(e) {
	var upgradeSeatPaymentWindow = Alloy.createController("upgrade_seat/upgrade_seat_payment", {
            accountId : accountId,
            passengerId : passengerId,
            paxKey : paxKey,
            doFunction : UPGRADE_SEAT_FUNCTION,
            LOPAPositionId : LOPAPositionId,
            LOPAPositionType : LOPAPositionType,
            isFromLopa : isFromLopa
    }).getView();
    
    if(OS_IOS){
		Alloy.Globals.navGroupWin.openWindow(upgradeSeatPaymentWindow);
	}else{
		upgradeSeatPaymentWindow.open();
	}

});

//* Confirm button without payment
$.confirmBtn.addEventListener('click', function(e) {
    var isSave = true;
            
    if($.reasonForChangeTextArea.value == "") {
        isSave = false;
        var _promptView = new Alloy.createController("common/alertPrompt", {
            title : "Alert",
            message : "Please enter the reason for changing seat.",
            okText : "OK",
            disableCancel : true,
            onOk : function() {
            }
        }).getView();
        _promptView.open();        
    }
    
    if(isSave) {
        var _syncDataPromptView = new Alloy.createController("common/alertPrompt", {
            title : 'Confirm',
            message : doFunction == UPGRADE_SEAT_FUNCTION ? 'Do you want to confirm this upgrade?' : 'Do you want to confirm this change?',
            okText : "Yes",
            cancelText : "No",
            onOk : function() {
                var userId = query.getUserId();
                var user = query.getUserDetailsFromCrew(userId.id + "_" + currentFlightId);
                var createdBy = "";
                if (user != null) {
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
                
                if(fromWhere == PASSENGER_DETAIL && doFunction == CHANGE_SEAT_FUNCTION) {
                    var upgradeSeatForPassengerData = {
                        currentSeat : passenger != null ? passenger.bookingSeat : "",
                        currentClass : passenger != null ? passenger.bookingClass : "",
                        newSeat : seatDetailData.position,
                        newClass : seatDetailData.classSeat,
                        paxId : passenger != null ? passenger.id : "",
                        accountId : passenger != null ? passenger.accountId : "",
                        paxKey : passenger != null ? passenger.paxKey : ""                   
                    };
                    
                    var ropDetail = query.getRop(passenger.memberId);
     
                    var dataForNewSeat = {
                        newStatus : component.changeNewSeatStatusOfLopaPosition(query.getLOPAPositionStatus(seatDetailData.position), ropDetail.ropTier),
                        hasPax : true,
                        position : seatDetailData.position,                      
                        paxId : passenger != null ? passenger.id : "",
                        accountId : passenger != null ? passenger.accountId : "",
                        paxKey : passenger != null ? passenger.paxKey : ""                   
                    };
                    
                    query.updateSeatStatusOnLOPA(dataForNewSeat);
    
                    var dataForOldSeat = {
                        newStatus : component.changeOldSeatStatusOfLopaPosition(query.getLOPAPositionStatus(passenger.bookingSeat)),
                        hasPax : false,
                        position : passenger.bookingSeat,                      
                        paxId : passenger != null ? passenger.id : "",
                        accountId : passenger != null ? passenger.accountId : "",
                        paxKey : passenger != null ? passenger.paxKey : ""                   
                    };
                    
                    query.updateSeatStatusOnLOPA(dataForOldSeat);
    
                    query.updatePassengerSeatClass(upgradeSeatForPassengerData);
                              
                    var incidentData = {
                        id : utility.generateGUID(),
                        flightId : currentFlightId,
                        category : PASSENGER,
                        reportType : "Information",
                        emergencyType : null,
                        subject : "Change seat",
                        equipmentId : "",
                        partId : "",
                        ataChapter : "",
                        condition : "",
                        safetyZone : "",
                        logGroup : 0,
                        sequenceNumber : "",
                        detail : "From : " + "Seat No. " + (passenger.bookingSeat != null ? passenger.bookingSeat : "") + " Class " + (passenger.bookingClass != null ? passenger.bookingClass : "") + "\n" + 
                                 "To :   " + "Seat No. " + (seatDetailData.position != null ? seatDetailData.position : "") + " Class " + (seatDetailData.classSeat != null ? seatDetailData.classSeat : ""),
                        createdBy : createdBy,
                        reportedBy : "",
                        createDateTime : createdDate,
                        updateDateTime : createdDate,
                        incidentStatus : CLOSED,
                        isLog : false,
                        isMulti : false,
                        isSubmitted : true,
                        isVoided : false,
                        isSynced : false,
                        acReg : aircraftRegistration,
                        flightNumber : flightNumber,
                        sector : sector,
                        phone : "",
                        email : "",
                        isSkippenPhoneEmail : true,
                        upgradeChangeSeatType : "changeSeat",
                        reasonForChange : $.reasonForChangeTextArea.value
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
                    
                    changSeatData = {
                        detail : null,
                        type : "Change Seat",
                        problem : null,
                        amount : 0,
                        incidentId : incidentData.id,
                        currency : null,
                        upgradeCer : null,
                        iscFormNumber : null,
                        codeNumber : null,
                        fromSeat : passenger.bookingSeat,
                        fromClass : passenger.bookingClass,
                        toSeat : seatDetailData.position,
                        toClass : seatDetailData.classSeat,
                        createdDateTime : createdDate
                    };
                    query.insertChangeSeatGroupMember(changSeatData);

                    incidentPassengerIsRefresh = 1;
                    passengerSeatClassIsRefresh = 1;
                    passengerListIsRefresh = 1;
                    if(isFromLopa) {
                        lopaIsRefresh = 1;                        
                    }
                    homeIsRefresh = 1;
                    $.upgradeSeatDetailWindow.close();                
                    
                } else if(fromWhere == INCIDENT_DETAIL && doFunction == UPGRADE_SEAT_FUNCTION){
                    compensationGlobalTemp.push({
                        detail : null,
                        type : "Upgrade Seat",
                        problem : irreName,
                        amount : 0,
                        incidentId : incId,
                        currency : null,
                        upgradeCer : null,
                        iscFormNumber : null,
                        codeNumber : null,
                        fromSeat : passenger.bookingSeat,
                        fromClass : passenger.bookingClass,
                        toSeat : seatDetailData.position,
                        toClass : seatDetailData.classSeat,
                        createdDateTime : createdDate
                    });
                    if(isFromLopa) {
                        lopaIsRefresh = 1;                        
                    }
                    homeIsRefresh = 1;
                    compensationFlag = 1;  
                    $.upgradeSeatDetailWindow.close();                
                } else if(fromWhere == INCIDENT_DETAIL && doFunction == CHANGE_SEAT_FUNCTION){
                    changSeatGlobalTemp.push({
                        detail : null,
                        type : "Change Seat",
                        problem : null,
                        amount : 0,
                        incidentId : incId,
                        currency : null,
                        upgradeCer : null,
                        iscFormNumber : null,
                        codeNumber : null,
                        fromSeat : passenger.bookingSeat,
                        fromClass : passenger.bookingClass,
                        toSeat : seatDetailData.position,
                        toClass : seatDetailData.classSeat,
                        createdDateTime : createdDate
                    });
                    if(isFromLopa) {
                        lopaIsRefresh = 1;                        
                    }
                    homeIsRefresh = 1;
                    reasonForChangeSeatTemp = $.reasonForChangeTextArea.value;
                    changeSeatFromIncidentDetailIsRefresh = 1;
                    $.upgradeSeatDetailWindow.close();                                    
                }
            }
        }).getView();
        _syncDataPromptView.open();
    } else {
        
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
            isBackToLopa = 1;
            $.upgradeSeatDetailWindow.close();
        }
    }).getView();
    _syncDataPromptView.open();
});


//**********************************************
//* Main
//**********************************************
$.upgradeSeatDetailWindow.backgroundImage = bgGeneral;
$.upgradeSeatDetailWindow.touchEnabled = true;
initialization();

$.upgradeSeatDetailWindow.addEventListener('focus', function(e) {
    if(passengerSeatClassIsRefresh == 1) {
        $.upgradeSeatDetailWindow.close();            
    }
});

if(OS_ANDROID){
	$.upgradeSeatDetailWindow.addEventListener('android:back', function(e) {
		Ti.API.info("Press Back button");
		$.upgradeSeatDetailWindow.close();	
	});
	
	$.changeFromView.height = 35;
}
