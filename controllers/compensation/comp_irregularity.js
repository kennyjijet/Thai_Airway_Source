// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = arguments[0] || {};
var incId = args.incidentId;
var compensationGroup = args.compensationMem;
var passengerId = args.passengerId;
var paxKey = args.paxKey;
var accountId = args.accountId;
var isUpgrade = args.isSeatUpgraded;

function btnBasic(){
	if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
	
	var compServiceRecBasicView = Alloy.createController("compensation/comp_service_recovery", {
		isFood : false,
		irreType : $.basic.children[0].text,
		passengerId : passengerId,
		paxKey : paxKey,
		accountId : accountId,
		incidentId : incId,
		compensationMem : compensationGroup,
		isSeatUpgraded : isUpgrade
	}).getView();
	
	
	if(OS_IOS){
    	 Alloy.Globals.navGroupWin.openWindow(compServiceRecBasicView);
      }else{
    	compServiceRecBasicView.open();
    }
	
}

function btnDefect(){
	if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
	
	var compServiceRecDefectView = Alloy.createController("compensation/comp_service_recovery", {
		isFood : false,
		irreType : $.defect.children[0].text,
		passengerId : passengerId,
		paxKey : paxKey,
		accountId : accountId,
		incidentId : incId,
		compensationMem : compensationGroup,
		isSeatUpgraded : isUpgrade
	}).getView();
	
	
	if(OS_IOS){
    	 Alloy.Globals.navGroupWin.openWindow(compServiceRecDefectView);
      }else{
    	compServiceRecDefectView.open();
    }
	
}

function btnFood(){
	if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
	
	var compServiceRecFoodView = Alloy.createController("compensation/comp_service_recovery", {
		isFood : true,
		irreType : $.food.children[0].text,
		passengerId : passengerId,
		paxKey : paxKey,
		accountId : accountId,
		incidentId : incId,
		compensationMem : compensationGroup
	}).getView();
	
	if(OS_IOS){
    	 Alloy.Globals.navGroupWin.openWindow(compServiceRecFoodView);
      }else{
    	compServiceRecFoodView.open();
    }
}

function btnOther(){
	if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
	var compServiceRecOtherView = Alloy.createController("compensation/comp_service_recovery", {
		isFood : false,
		irreType : $.other.children[0].text,
		passengerId : passengerId,
		paxKey : paxKey,
		accountId : accountId,
		incidentId : incId,
		compensationMem : compensationGroup,
		isSeatUpgraded : isUpgrade
	}).getView();
	
	if(OS_IOS){
    	 Alloy.Globals.navGroupWin.openWindow(compServiceRecOtherView);
      }else{
    	compServiceRecOtherView.open();
    }
}

$.compIrre.addEventListener('focus', function(){
	setTimeout(function(){
		if(compensationFlag){
			compensationFlag = 0;
			compensationRefresh = 1;
			$.compIrre.close();
		}
	},10);
});

if(OS_ANDROID){
	$.compIrre.addEventListener('android:back', function(e) {
	    Ti.API.info("Press Back button");
		$.compIrre.close();
	});
}