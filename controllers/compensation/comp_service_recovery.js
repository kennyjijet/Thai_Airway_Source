// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = arguments[0] || {};
var isFood = args.isFood;
var irreType = args.irreType;
var passengerId = args.passengerId;
var paxKey = args.paxKey;
var accountId = args.accountId;
var incId = args.incidentId;
var compensationGroup = args.compensationMem;
var isUpgrade = args.isSeatUpgraded;

var query = require('query_lib');

function btnUpSeat(){
	if(!isUpgrade){
		if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
		
		var upgradeSeatView = Alloy.createController("upgrade_seat/upgrade_seat_lopa", {
	        accountId : accountId,
	        passengerId : passengerId,
	        paxKey : paxKey,
	        doFunction : UPGRADE_SEAT_FUNCTION,
	        fromWhere : INCIDENT_DETAIL, 
	        irreName : irreType,
	        incId : incId                       
	    }).getView();
	    
	    if(OS_IOS){
    	 Alloy.Globals.navGroupWin.openWindow(upgradeSeatView);
      }else{
    	upgradeSeatView.open();
    	}
	    
    }else{
    	var dialog = Alloy.createController("common/alertPrompt", {
            message : "Passenger already upgraded.",
            title : 'Alert',
            okText : "OK",
            onOk : function() {
            },
            disableCancel : true
        }).getView();
        dialog.open();
    }
}

function btnMile(){
	if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
	
	var compDetailMileView = Alloy.createController("compensation/comp_details", {
		type : COMP_MILE,
		irreName : irreType,
		passengerId : passengerId,
		paxKey : paxKey,
		accountId : accountId,
		incidentId : incId,
		compensationMem : compensationGroup
	}).getView();
	
	if(OS_IOS){
    	 Alloy.Globals.navGroupWin.openWindow(compDetailMileView);
     }else{
    	compDetailMileView.open();
    }
}

function btnMPD(){
	if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
	
	var comp_detail_MPD_view = Alloy.createController("compensation/comp_details", {
		type : COMP_MPD,
		irreName : irreType,
		passengerId : passengerId,
		paxKey : paxKey,
		accountId : accountId,
		incidentId : incId,
		compensationMem : compensationGroup
	}).getView();
	
	if(OS_IOS){
    	 Alloy.Globals.navGroupWin.openWindow(comp_detail_MPD_view);
     }else{
    	comp_detail_MPD_view.open();
    }
	
}

function btnUpCer(){
	if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
	
	var compDetailUpcerView = Alloy.createController("compensation/comp_details", {
		type : COMP_UPCER,
		irreName : irreType,
		passengerId : passengerId,
		paxKey : paxKey,
		accountId : accountId,
		incidentId : incId,
		compensationMem : compensationGroup
	}).getView();
	if(OS_IOS){
    	 Alloy.Globals.navGroupWin.openWindow(compDetailUpcerView);
     }else{
    	compDetailUpcerView.open();
    }
	
}

function btnDuty(){
	if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
	
    var pagePathView = Alloy.createController("compensation/duty_free", {
        type : COMP_DUTY,
        irreName : irreType,
        passengerId : passengerId,
        paxKey : paxKey,
        accountId : accountId,
        incidentId : incId,
        compensationMem : compensationGroup
    }).getView();

	if(OS_IOS){
    	 Alloy.Globals.navGroupWin.openWindow(pagePathView);
     }else{        
        pagePathView.open();
    }
	
}

function btnOther(){
	if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
	var compDetailOtherView = Alloy.createController("compensation/comp_details", {
		type : COMP_OTHER,
		irreName : irreType,
		passengerId : passengerId,
		paxKey : paxKey,
		accountId : accountId,
		incidentId : incId,
		compensationMem : compensationGroup
	}).getView();
	
	if(OS_IOS){
    	 Alloy.Globals.navGroupWin.openWindow(compDetailOtherView);
     }else{
    	compDetailOtherView.open();
    }
	
}

setTimeout(function(){
	var flightDetail = query.getFlight(currentFlightId);
	if(isFood){
		$.table.deleteRow(0);
		$.table.deleteRow(2);
		if(flightDetail.region == "Domestic"){
			$.table.deleteRow(2);
		}
	}
	if(flightDetail.region == "Domestic"){
		$.table.deleteRow(4);
	}
	if(isUpgrade == null){
		isUpgrade = false;
	}
	if(isUpgrade){
		$.upSeat.children[0].color = "gray";
	}
	if(OS_IOS) { Alloy.Globals.activityIndicator.hide(); }
},10);

$.compService.addEventListener('focus', function(){
	setTimeout(function(){
		if(compensationFlag){
			$.compService.close();
		}
	},10);
});

if(OS_ANDROID){
	$.compService.addEventListener('android:back', function(e) {
	    Ti.API.info("Press Back button");
		$.compService.close();
	});
}
