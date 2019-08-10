var args = arguments[0] || {};
var model = require('query_lib');
var utility = require('utility_lib');
var crewId = args.crewId;
var bgGeneral = "images/bg_general.png";
var bgHome = "/images/bg_home.png";
var data;
var isAppraised = false;
var flightNumber;

var isPostlayout = true;

function crewDetail(crewId) {
	var flightDetail = model.getFlightDetails();
	data = model.getCrewDetail(crewId);

    if(flightDetail != null) {
        var flightNumberTemp = flightDetail.flightExternalId.replace(/_/gi, "");
        flightNumber = flightNumberTemp.substring(0, flightNumberTemp.length-1); 
    }
    
    isAppraised = data.isAppraised;  
     
    if(!isAppraised) {
        $.showCrewAppraisal.hide();
    }  

	var fullpath = "images/user_man.png";
	if (data.image != "") {
		fullpath = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "crew" + Ti.Filesystem.separator + data.image;
	}

	$.image.image = fullpath;
	var nameCrew=data.crewFirstName + "  " + data.crewLastName;
	$.crewNickname.text =data.crewNickName ;
	$.crewName.text =nameCrew ;
	var crewId=data.id!="" ? (data.id): "";
			if(crewId!=""){
				crewId=crewId.split("_");
				crewId=crewId[0];
			}
	$.crewPersonId.text =crewId ;
	$.crewLanguages.text = data.languages;

	//$.rtFlightAndDate.text = "FT Flight Code : " + utility.displayDateTime(data.rtFlightAndDate);
	var rtDate=data.rtFlightAndDate != "" ? formatDate(data.rtFlightAndDate) : "";
	var rtFlt=data.rtFltNo != "" ? data.rtFltNo : "";
	if(rtFlt!=""){
		if(rtDate!=""){
			rtFlt+="/"+rtDate;
		}
	}
	else{
		if(rtDate!=""){
			rtFlt=rtDate;
		}
	}
	$.rtFlightAndDate.text = rtFlt;
	$.rank.text = data.rank;
	$.duty.text = data.duty;
	//$.duty.text = "Duty : "+data.duty;
	
	/* check rank, passive for hiding */
	//$.lebelHeaderSection
	var chkRank = data.rank.charAt(0); // if F, G
	var chkDutyCode = data.dutyCode; // "TVL"
	var chkCrewType = data.crewType; // "Cockpit"
	
	if(chkRank=='F' || chkRank=='G' || 
		chkDutyCode == "TVL" || chkCrewType == "Cockpit"){
		$.lebelHeaderSectionOver.visible = "false";
	}

	$.dutyCode.text = data.dutyCode;
	$.actingRank.text =  data.actingRank;
	$.posFly.text = data.posFly;

	$.labelEmergency.addEventListener('click', function() {
		
        var crewEmergencyCatView = Alloy.createController("crew/crew_emergency_category", {
                newFlag : true,
                incidentCate : EMERGENCY,
                incidentId : "",
                crewId : data.sfdcId
            }).getView();
            
        if(OS_IOS)
    	{
    		Alloy.Globals.navGroupWin.openWindow(crewEmergencyCatView);
    	}else{
    		crewEmergencyCatView.open();
    	}    
	});	
}

function formatDate(date) {
	  var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
   // var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	
    var d = new Date(date);
       // var month = '' + d.getMonth();
       var month = d.getMonth();
      var  day = '' + d.getDate();
        var year = d.getFullYear();
    // if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [day, months[month], year].join(' ');
   // return day+" "+months[month];
}

function init() {
	$.crewDetailWindow.backgroundImage = bgGeneral;
}

init();
crewDetail(crewId);

$.crewDetailWindow.addEventListener('postlayout', function() {
	if(isPostlayout){
		if(OS_IOS) { Alloy.Globals.activityIndicator.hide(); $.anActIndicatorView.hide(); }
		else { $.anActIndicatorView.hide(); }
		isPostlayout = false;
	}
}); 

$.crewDetailWindow.addEventListener('focus', function(e) {
    if (incidentListIsRefresh) {// && e.source.id != "incidentListWindow") {
       incidentListIsRefresh = 0;
    }else{
    	if(!isPostlayout){
    		$.anActIndicatorView.hide();
    	}
    }
});

$.showCrewAppraisal.addEventListener("click", function(e){

    var crewApprasialView = Alloy.createController("crew_appraisal/crew_appraisal", {
        crewId : crewId,
    }).getView();        
    if(OS_IOS)
    {
    	Alloy.Globals.navGroupWin.openWindow(crewApprasialView);
    }else{
    	crewApprasialView.open();
    }    
});

if(OS_ANDROID){
	$.crewDetailWindow.addEventListener('android:back', function(e) {
	    Ti.API.info("Press Back button");
	    $.crewDetailWindow.removeAllChildren();
		$.crewDetailWindow.close();
	});
	$.image.left = "38%";
	$.labelEmergency.left = "7%";
	$.labelEmergency.width = Math.floor($.labelEmergency.width - ((12/100) * $.labelEmergency.width));
    $.labelEmergency.height = Math.floor($.labelEmergency.height - ((12/100) * $.labelEmergency.height));
}

