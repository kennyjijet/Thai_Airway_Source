// Arguments passed into this controller can be accessed via the `$.args` object directly or:
//************************************
//* Require
//************************************
var flightQuery = require('query_lib');
var component = require('component_lib');
var util = require('utility_lib');

//**********************************************
//* Variable Declaration
//**********************************************
var flightId = currentFlightId;
var tableData = [];
var tableFltData = [];
var flight;

var COMPLAINT = "Complaint";
var COMMEND = "Commendation";

var isClick = false;
var isPostLayout = true;

//************************************
//* Funtion
//************************************

function btnPassengerFB() {
	// component.alertUnderConstruction();
	if(OS_IOS){
		Alloy.Globals.activityIndicator.show();
	}else if(OS_ANDROID){
		$.anActIndicatorView.show();
	}
	setTimeout(function(){
		$.tableMain.data = [];
		setTextFeedback();
		$.flightView.backgroundColor = "transparent";
		$.feedView.backgroundColor = "#80C6168D";
		if(OS_IOS){
			Alloy.Globals.activityIndicator.hide();
		}else if(OS_ANDROID){
			$.anActIndicatorView.hide();
		}
	}, 300);
}

function btnFlight() {
	if(OS_IOS){
		Alloy.Globals.activityIndicator.show();
	}else if(OS_ANDROID){
		$.anActIndicatorView.show();
	}
	setTimeout(function(){
		$.tableMain.data = [];
		setTextFlight();
		$.flightView.backgroundColor = "#80C6168D";
		$.feedView.backgroundColor = "transparent";
		if(OS_IOS){
			Alloy.Globals.activityIndicator.hide();
		}else if(OS_ANDROID){
			$.anActIndicatorView.hide();
		}
	}, 300);
}

function setTextFeedback() {
	var flight = flightQuery.getFlight(currentFlightId);
	flightNo = flight.flightNumber;
	
	var complaintSecRow = Ti.UI.createTableViewRow({
		width : "100%",
		height : "40",
		touchEnabled : false,
		backgroundImage : "/images/bg_header_section.png"
	});
		
	var ttComplaintSec = $.UI.create("Label", {
		classes : ['fontBold20','colorWhite'],
		text : "Top Ten Complaints",
		left : "5%"
	});
	
	var today = new Date();
	var priorDate = new Date().setDate(today.getDate()-30);
	var dateFormat = new Date(priorDate);
	var monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
	var dateTime = dateFormat.getDate()+" "+
					monthNames[dateFormat.getMonth()]+" "+
					dateFormat.getFullYear()+" - "+
					today.getDate()+" "+
					monthNames[today.getMonth()]+" "+
					today.getFullYear();
					
	var daysComplaintSec = $.UI.create("Label", {
		classes : ['fontBold20','colorGold'],
		text : dateTime,
		right : "5%"
	});
	
	complaintSecRow.add(ttComplaintSec);
	complaintSecRow.add(daysComplaintSec);
	tableFltData.push(complaintSecRow);
	setItemInSection("Complaints",flightNo,COMPLAINT);
	
	var commendSecRow = Ti.UI.createTableViewRow({
		width : "100%",
		height : "40",
		touchEnabled : false,
		backgroundImage : "/images/bg_header_section.png"
	});
		
	var ttCommendSec = $.UI.create("Label", {
		classes : ['fontBold20','colorWhite'],
		text : "Top Ten Commendations",
		left : "5%"
	});
	
	var daysCommendSec = $.UI.create("Label", {
		classes : ['fontBold20','colorGold'],
		text : dateTime,
		right : "5%"
	});
	
	if(OS_ANDROID){
		daysComplaintSec.font = {fontSize:18};
		daysCommendSec.font = {fontSize:18};
	}
	
	commendSecRow.add(ttCommendSec);
	commendSecRow.add(daysCommendSec);
	tableFltData.push(commendSecRow);
	setItemInSection("Commendations",flightNo,COMMEND);
	$.tableMain.data = tableFltData;
	// $.tableMain.applyProperties({
		// separatorColor : colorSeparatorTableRow,
		// data : tableFltData
	// });
	
	tableFltData = [];
}

function setItemInSection(title, number, issueType) {
	var count = 0;
	
	var allRow = Ti.UI.createTableViewRow({
		type : issueType,
		fClass : "all",
		flightNum : number,
		height : 60,
	});
	
	var allLabel = $.UI.create("Label", {
		classes : ['fontBold20','colorWhite'],
		left : "5%",
		text : "Top Ten "+ title +" All Class"
	});
	
	var iconAll = Ti.UI.createImageView({
        image : "/images/arrow_down.png",
        right : "15",
        height : 15,
        widht : 15
    });
    
    var bgViewAll = Ti.UI.createLabel({
		left : 0,
		top : 0,
		height : 60,
		backgroundColor : "#0Dffffff",
		width : "100%"
	});
	
	var fbItemAll = flightQuery.countFeedbackWithClass(flightNo,"all",issueType);
	if (fbItemAll == 0) {
		allRow.touchEnabled = false;
		allRow.selectionStyle = "none";
		allLabel.color = "gray";
	}
	
	allRow.add(bgViewAll);
	allRow.add(allLabel);
	allRow.add(iconAll);
	// allRow.add(qtyALLLabel);
	tableFltData.push(allRow);
	
	allRow.addEventListener('click', function(e){
		if (e.row.height == 60) {
			var feedbackItem = flightQuery.getFeedbackListByType(flightNo,"all",e.row.type);
			e.row.children[2].hide();
			
			if(feedbackItem.length > 0){
				isClick = true;
				if(OS_IOS){
					Alloy.Globals.activityIndicator.show();
				}else if(OS_ANDROID){
					$.anActIndicatorView.show();
				}
				var rowHeight = 0;
				for (var i=0;i<feedbackItem.length;i++){
					var itemHeight = 50*(i+1);
					if(OS_ANDROID){
						itemHeight = 60*(i+1);
					}
					
					var allItemLabel = $.UI.create("Label", {
						classes : ['fontLight18','colorWhite'],
						left : "7%",
						top : itemHeight,
						text : feedbackItem[i].type,
						visible : false
					});
					if(OS_ANDROID){
						allItemLabel.width = "80%";
						allItemLabel.wordWrap = true;
						allItemLabel.ellipsize = false;
					}
					
					var allQtyLabel = $.UI.create("Label", {
						classes : ['fontLight18','colorGold'],
						right : "5%",
						top : itemHeight,
						text : feedbackItem[i].total,
						visible : false
					});
					
					e.row.add(allItemLabel);
					e.row.add(allQtyLabel);
					rowHeight = itemHeight;
				}
				// Ti.API.info('chk height : '+allRow.height);
				// Ti.API.info('chk child : '+allRow.children.length);
				e.row.height = rowHeight+50;
				e.row.backgroundColor = "#3D1A6F";
				e.row.children[1].top = 12;
				e.row.children[0].top = 0;
				e.row.children[0].left = 0;
				e.row.children[0].height = 40;
				e.row.children[0].backgroundColor = "#0Dffffff";
				e.row.bottom = 10;
			}else{
				e.row.children[2].show();
				e.row.children[1].top = null;
				e.row.children[1].verticalAlign = Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP;
				e.row.children[0].height = 60;
				e.row.children[0].backgroundColor = "#0Dffffff";
			}
		}else{
			Ti.API.info('chk child : '+e.row.children.length);
			e.row.height = 60;
			e.row.children[1].show();
			if(OS_IOS){
				e.row.removeAllChildren();
				e.row.add(bgViewAll);
				e.row.add(allLabel);
				e.row.add(iconAll);
			}else if(OS_ANDROID){
				for(var i=0;i<e.row.children.length;i++){
					if(!(i == 0 || i == 1)){
						e.row.children[i].text = "";
						// var child = e.row.children[i].slice(0);
						// e.row.remove(child);
					}
				}
			}
			e.row.backgroundColor = "transparent";
			e.row.children[2].show();
			e.row.children[0].top = 0;
			e.row.children[0].left = 0;
			e.row.children[0].height = 60;
			e.row.children[0].backgroundColor = "#0Dffffff";
			e.row.children[1].top = null;
			e.row.children[1].verticalAlign = Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP;
		}
		
		if(isClick){
			setTimeout(function() {
				for (var i=3;i<e.row.children.length;i++){
					e.row.children[i].visible = true;
				}
				isClick = false;
				if(OS_IOS){
					Alloy.Globals.activityIndicator.hide();
				}else if(OS_ANDROID){
					$.anActIndicatorView.hide();
				}
			},100);
		}
	});
	
	var fRow = Ti.UI.createTableViewRow({
		type : issueType,
		fClass : "F",
		flightNum : number,
		height : 60,
		scrollable : false
	});
	
	var fLabel = $.UI.create("Label", {
		classes : ['fontBold20','colorWhite'],
		left : "5%",
		text : "Top Ten "+ title +" F Class"
	});
	
	var iconF = Ti.UI.createImageView({
        image : "/images/arrow_down.png",
        right : "15",
        height : 15,
        widht : 15
    });
    
    var bgViewF = Ti.UI.createLabel({
		left : 0,
		top : 0,
		height : 60,
		backgroundColor : "#0Dffffff",
		width : "100%"
	});
	
	var fbItemF = flightQuery.countFeedbackWithClass(flightNo,"F",issueType);
	if (fbItemF == 0) {
		fRow.touchEnabled = false;
		// fRow.selectionStyle = "none";
		fLabel.color = "gray";
	}
	
	fRow.add(bgViewF);
	fRow.add(fLabel);
	fRow.add(iconF);
	// fRow.add(qtyFLabel);
	tableFltData.push(fRow);
	
	fRow.addEventListener('click', function(e){
		if (e.row.height == 60) {
			var feedbackItem = flightQuery.getFeedbackListByType(flightNo,"F",e.row.type);
			e.row.children[2].hide();
			
			if(feedbackItem.length > 0){
				isClick = true;
				if(OS_IOS){
					Alloy.Globals.activityIndicator.show();
				}else if(OS_ANDROID){
					$.anActIndicatorView.show();
				}
				var rowHeight = 0;
				for (var i=0;i<feedbackItem.length;i++){
					var itemHeight = 50*(i+1);
					if(OS_ANDROID){
						itemHeight = 60*(i+1);
					}
					
					var fItemLabel = $.UI.create("Label", {
						classes : ['fontLight18','colorWhite'],
						left : "7%",
						top : itemHeight,
						text : feedbackItem[i].type,
						visible : false
					});
					if(OS_ANDROID){
						fItemLabel.width = "80%";
						fItemLabel.wordWrap = true;
						fItemLabel.ellipsize = false;
					}
					
					var fQtyLabel = $.UI.create("Label", {
						classes : ['fontLight18','colorGold'],
						right : "5%",
						top : itemHeight,
						text : feedbackItem[i].total,
						visible : false
					});
					
					e.row.add(fItemLabel);
					e.row.add(fQtyLabel);
					rowHeight = itemHeight;
				}
				e.row.height = rowHeight+50;
				e.row.backgroundColor = "#3D1A6F";
				e.row.children[1].top = 12;
				e.row.children[0].top = 0;
				e.row.children[0].left = 0;
				e.row.children[0].height = 40;
				e.row.children[0].backgroundColor = "#0Dffffff";
				e.row.children[1].top = 12;
				e.row.bottom = 10;
			}else{
				e.row.children[2].show();
				e.row.children[1].top = null;
				e.row.children[1].verticalAlign = Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP;
				e.row.children[0].height = 60;
				e.row.children[0].backgroundColor = "#0Dffffff";
			}
		}else{
			e.row.height = 60;
			if(OS_IOS){
				e.row.removeAllChildren();
				e.row.add(bgViewF);
				e.row.add(fLabel);
				e.row.add(iconF);
			}else if(OS_ANDROID){
				for(var i=0;i<e.row.children.length;i++){
					if(!(i == 0 || i == 1)){
						e.row.children[i].text = "";
					}
				}
			}
			e.row.backgroundColor = "transparent";
			e.row.children[2].show();
			e.row.children[0].top = 0;
			e.row.children[0].left = 0;
			e.row.children[0].height = 60;
			e.row.children[0].backgroundColor = "#0Dffffff";
			e.row.children[1].top = null;
			e.row.children[1].verticalAlign = Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP;
		}
		
		if(isClick){
			setTimeout(function() {
				for (var i=3;i<e.row.children.length;i++){
					e.row.children[i].visible = true;
				}
				isClick = false;
				if(OS_IOS){
					Alloy.Globals.activityIndicator.hide();
				}else if(OS_ANDROID){
					$.anActIndicatorView.hide();
				}
			},100);
		}
	});
	
	var cRow = Ti.UI.createTableViewRow({
		type : issueType,
		fClass : "C",
		flightNum : number,
		height : 60,
		// scrollable : false
	});
	
	var cLabel = $.UI.create("Label", {
		classes : ['fontBold20','colorWhite'],
		left : "5%",
		text : "Top Ten "+ title +" C Class"
	});
    
    var iconC = Ti.UI.createImageView({
        image : "/images/arrow_down.png",
        right : "15",
        height : 15,
        widht : 15
    });
    
    var bgViewC = Ti.UI.createLabel({
		left : 0,
		top : 0,
		height : 60,
		backgroundColor : "#0Dffffff",
		width : "100%"
	});
	
	var fbItemC = flightQuery.countFeedbackWithClass(flightNo,"C",issueType);
	if (fbItemC == 0) {
		cRow.touchEnabled = false;
		cRow.selectionStyle = "none";
		cLabel.color = "gray";
	}
	
	cRow.add(bgViewC);
	cRow.add(cLabel);
	cRow.add(iconC);
	// cRow.add(qtyCLabel);
	tableFltData.push(cRow);
	
	cRow.addEventListener('click', function(e){
		if (e.row.height == 60) {
			var feedbackItem = flightQuery.getFeedbackListByType(flightNo,"C",e.row.type);
			e.row.children[2].hide();
			
			if(feedbackItem.length > 0){
				isClick = true;
				if(OS_IOS){
					Alloy.Globals.activityIndicator.show();
				}else if(OS_ANDROID){
					$.anActIndicatorView.show();
				}
				var rowHeight = 0;
				for (var i=0;i<feedbackItem.length;i++){
					var itemHeight = 50*(i+1);
					if(OS_ANDROID){
						itemHeight = 60*(i+1);
					}
					
					var cItemLabel = $.UI.create("Label", {
						classes : ['fontLight18','colorWhite'],
						left : "7%",
						top : itemHeight,
						text : feedbackItem[i].type,
						visible : false
					});
					if(OS_ANDROID){
						cItemLabel.width = "80%";
						cItemLabel.wordWrap = true;
						cItemLabel.ellipsize = false;
					}
					
					var cQtyLabel = $.UI.create("Label", {
						classes : ['fontLight18','colorGold'],
						right : "5%",
						top : itemHeight,
						text : feedbackItem[i].total,
						visible : false
					});
					
					e.row.add(cItemLabel);
					e.row.add(cQtyLabel);
					rowHeight = itemHeight;
				}
				e.row.height = rowHeight+50;
				e.row.backgroundColor = "#3D1A6F";
				e.row.children[1].top = 12;
				e.row.children[0].top = 0;
				e.row.children[0].left = 0;
				e.row.children[0].height = 40;
				e.row.children[0].backgroundColor = "#0Dffffff";
				e.row.children[1].top = 12;
				e.row.bottom = 10;
			}else{
				e.row.children[2].show();
				e.row.children[1].top = null;
				e.row.children[1].verticalAlign = Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP;
				e.row.children[0].height = 60;
				e.row.children[0].backgroundColor = "#0Dffffff";
			}
		}else{
			e.row.height = 60;
			if(OS_IOS){
				e.row.removeAllChildren();
				e.row.add(bgViewC);
				e.row.add(cLabel);
				e.row.add(iconC);
			}else if(OS_ANDROID){
				for(var i=0;i<e.row.children.length;i++){
					if(!(i == 0 || i == 1)){
						e.row.children[i].text = "";
					}
				}
			}
			e.row.backgroundColor = "transparent";
			e.row.children[2].show();
			e.row.children[0].top = 0;
			e.row.children[0].left = 0;
			e.row.children[0].height = 60;
			e.row.children[0].backgroundColor = "#0Dffffff";
			e.row.children[1].top = null;
			e.row.children[1].verticalAlign = Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP;
		}
		
		if(isClick){
			setTimeout(function() {
				for (var i=3;i<e.row.children.length;i++){
					e.row.children[i].visible = true;
				}
				isClick = false;
				if(OS_IOS){
					Alloy.Globals.activityIndicator.hide();
				}else if(OS_ANDROID){
					$.anActIndicatorView.hide();
				}
			},100);
		}
	});
	
	var uRow = Ti.UI.createTableViewRow({
		type : issueType,
		fClass : "U",
		flightNum : number,
		height : 60,
		// scrollable : false
	});
	
	var uLabel = $.UI.create("Label", {
		classes : ['fontBold20','colorWhite'],
		left : "5%",
		text : "Top Ten "+ title +" U Class"
	});
    
    var iconU = Ti.UI.createImageView({
        image : "/images/arrow_down.png",
        right : "15",
        height : 15,
        widht : 15
    });
    
    var bgViewU = Ti.UI.createLabel({
		left : 0,
		top : 0,
		height : 60,
		backgroundColor : "#0Dffffff",
		width : "100%"
	});
	
	var fbItemU = flightQuery.countFeedbackWithClass(flightNo,"U",issueType);
	if (fbItemU == 0) {
		uRow.touchEnabled = false;
		uRow.selectionStyle = "none";
		uLabel.color = "gray";
	}
	
	uRow.add(bgViewU);
	uRow.add(uLabel);
	uRow.add(iconU);
	// uRow.add(qtyULabel);
	tableFltData.push(uRow);
	
	uRow.addEventListener('click', function(e){
		if (e.row.height == 60) {
			var feedbackItem = flightQuery.getFeedbackListByType(flightNo,"U",e.row.type);
			e.row.children[2].hide();
			
			if(feedbackItem.length > 0){
				isClick = true;
				if(OS_IOS){
					Alloy.Globals.activityIndicator.show();
				}else if(OS_ANDROID){
					$.anActIndicatorView.show();
				}
				var rowHeight = 0;
				for (var i=0;i<feedbackItem.length;i++){
					var itemHeight = 50*(i+1);
					if(OS_ANDROID){
						itemHeight = 60*(i+1);
					}
					
					var uItemLabel = $.UI.create("Label", {
						classes : ['fontLight18','colorWhite'],
						left : "7%",
						top : itemHeight,
						text : feedbackItem[i].type,
						visible : false
					});
					if(OS_ANDROID){
						uItemLabel.width = "80%";
						uItemLabel.wordWrap = true;
						uItemLabel.ellipsize = false;
					}
					
					var uQtyLabel = $.UI.create("Label", {
						classes : ['fontLight18','colorGold'],
						right : "5%",
						top : itemHeight,
						text : feedbackItem[i].total,
						visible : false
					});
					
					e.row.add(uItemLabel);
					e.row.add(uQtyLabel);
					rowHeight = itemHeight;
				}
				e.row.height = rowHeight+50;
				e.row.backgroundColor = "#3D1A6F";
				e.row.children[1].top = 12;
				e.row.children[0].top = 0;
				e.row.children[0].left = 0;
				e.row.children[0].height = 40;
				e.row.children[0].backgroundColor = "#0Dffffff";
				e.row.children[1].top = 12;
				e.row.bottom = 10;
			}else{
				e.row.children[2].show();
				e.row.children[1].top = null;
				e.row.children[1].verticalAlign = Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP;
				e.row.children[0].height = 60;
				e.row.children[0].backgroundColor = "#0Dffffff";
			}
		}else{
			e.row.height = 60;
			if(OS_IOS){
				e.row.removeAllChildren();
				e.row.add(bgViewU);
				e.row.add(uLabel);
				e.row.add(iconU);
			}else if(OS_ANDROID){
				for(var i=0;i<e.row.children.length;i++){
					if(!(i == 0 || i == 1)){
						e.row.children[i].text = "";
					}
				}
			}
			e.row.backgroundColor = "transparent";
			e.row.children[2].show();
			e.row.children[0].top = 0;
			e.row.children[0].left = 0;
			e.row.children[0].height = 60;
			e.row.children[0].backgroundColor = "#0Dffffff";
			e.row.children[1].top = null;
			e.row.children[1].verticalAlign = Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP;
		}
		
		if(isClick){
			setTimeout(function() {
				for (var i=3;i<e.row.children.length;i++){
					e.row.children[i].visible = true;
				}
				isClick = false;
				if(OS_IOS){
					Alloy.Globals.activityIndicator.hide();
				}else if(OS_ANDROID){
					$.anActIndicatorView.hide();
				}
			},100);
		}
	});
	
	var yRow = Ti.UI.createTableViewRow({
		type : issueType,
		fClass : "Y",
		flightNum : number,
		height : 60,
		// scrollable : false
	});
	
	var yLabel = $.UI.create("Label", {
		classes : ['fontBold20','colorWhite'],
		left : "5%",
		text : "Top Ten "+ title +" Y Class"
	});
	
	var iconY = Ti.UI.createImageView({
        image : "/images/arrow_down.png",
        right : "15",
        height : 15,
        widht : 15
    });
    
    var bgViewY = Ti.UI.createLabel({
		left : 0,
		top : 0,
		height : 60,
		backgroundColor : "#0Dffffff",
		width : "100%"
	});
	
	var fbItemY = flightQuery.countFeedbackWithClass(flightNo,"Y",issueType);
	if (fbItemY == 0) {
		yRow.touchEnabled = false;
		// yRow.selectionStyle = "none";
		yLabel.color = "gray";
	}
	
	yRow.add(bgViewY);
	yRow.add(yLabel);
	yRow.add(iconY);
	// yRow.add(qtyYLabel);
	tableFltData.push(yRow);
	
	yRow.addEventListener('click', function(e){
		if (e.row.height == 60) {
			var feedbackItem = flightQuery.getFeedbackListByType(flightNo,"Y",e.row.type);
			e.row.children[2].hide();
			
			if(feedbackItem.length > 0){
				isClick = true;
				if(OS_IOS){
					Alloy.Globals.activityIndicator.show();
				}else if(OS_ANDROID){
					$.anActIndicatorView.show();
				}
				var rowHeight = 0;
				for (var i=0;i<feedbackItem.length;i++){
					var itemHeight = 50*(i+1);
					if(OS_ANDROID){
						itemHeight = 60*(i+1);
					}
					
					var yItemLabel = $.UI.create("Label", {
						classes : ['fontLight18','colorWhite'],
						left : "7%",
						top : itemHeight,
						text : feedbackItem[i].type,
						visible : false
					});
					if(OS_ANDROID){
						yItemLabel.width = "80%";
						yItemLabel.wordWrap = true;
						yItemLabel.ellipsize = false;
					}
					
					var yQtyLabel = $.UI.create("Label", {
						classes : ['fontLight18','colorGold'],
						right : "5%",
						top : itemHeight,
						text : feedbackItem[i].total,
						visible : false
					});
					
					e.row.add(yItemLabel);
					e.row.add(yQtyLabel);
					rowHeight = itemHeight;
				}
				e.row.height = rowHeight+50;
				e.row.backgroundColor = "#3D1A6F";
				e.row.children[1].top = 12;
				e.row.children[0].top = 0;
				e.row.children[0].left = 0;
				e.row.children[0].height = 40;
				e.row.children[0].backgroundColor = "#0Dffffff";
				e.row.children[1].top = 12;
				e.row.bottom = 10;
			}else{
				e.row.children[2].show();
				e.row.children[1].top = null;
				e.row.children[1].verticalAlign = Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP;
				e.row.children[0].height = 60;
				e.row.children[0].backgroundColor = "#0Dffffff";
			}
		}else{
			e.row.height = 60;
			if(OS_IOS){
				e.row.removeAllChildren();
				e.row.add(bgViewY);
				e.row.add(yLabel);
				e.row.add(iconY);
			}else if(OS_ANDROID){
				for(var i=0;i<e.row.children.length;i++){
					if(!(i == 0 || i == 1)){
						e.row.children[i].text = "";
					}
				}
			}
			e.row.backgroundColor = "transparent";
			e.row.children[2].show();
			e.row.children[0].top = 0;
			e.row.children[0].left = 0;
			e.row.children[0].height = 60;
			e.row.children[0].backgroundColor = "#0Dffffff";
			e.row.children[1].top = null;
			e.row.children[1].verticalAlign = Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP;
		}
		
		if(isClick){
			setTimeout(function() {
				for (var i=3;i<e.row.children.length;i++){
					e.row.children[i].visible = true;
				}
				isClick = false;
				if(OS_IOS){
					Alloy.Globals.activityIndicator.hide();
				}else if(OS_ANDROID){
					$.anActIndicatorView.hide();
				}
			},100);
		}
	});
	
	var noneRow = Ti.UI.createTableViewRow({
		type : issueType,
		fClass : null,
		flightNum : number,
		height : 60,
		// scrollable : false
	});
	
	var noneLabel = $.UI.create("Label", {
		classes : ['fontBold20','colorWhite'],
		left : "5%",
		text : "Top Ten "+ title +" None Class"
	});
	
	var iconNone = Ti.UI.createImageView({
        image : "/images/arrow_down.png",
        right : "15",
        height : 15,
        widht : 15
    });
	
	var bgViewNone = Ti.UI.createLabel({
		left : 0,
		top : 0,
		height : 60,
		backgroundColor : "#0Dffffff",
		width : "100%"
	});
	
	var fbItemNONE = flightQuery.countFeedbackWithClass(flightNo,null,issueType);
	if (fbItemNONE == 0) {
		noneRow.touchEnabled = false;
		// noneRow.selectionStyle = "none";
		noneLabel.color = "gray";
	}
	
	noneRow.add(bgViewNone);
	noneRow.add(noneLabel);
	noneRow.add(iconNone);
	// noneRow.add(qtyNONELabel);
	tableFltData.push(noneRow);
	
	noneRow.addEventListener('click', function(e){
		if (e.row.height == 60) {
			var feedbackItem = flightQuery.getFeedbackListByType(flightNo,null,e.row.type);
			e.row.children[2].hide();
			
			if(feedbackItem.length > 0){
				isClick = true;
				if(OS_IOS){
					Alloy.Globals.activityIndicator.show();
				}else if(OS_ANDROID){
					$.anActIndicatorView.show();
				}
				var rowHeight = 0;
				for (var i=0;i<feedbackItem.length;i++){
					var itemHeight = 50*(i+1);
					if(OS_ANDROID){
						itemHeight = 60*(i+1);
					}
					
					var noneItemLabel = $.UI.create("Label", {
						classes : ['fontLight18','colorWhite'],
						left : "7%",
						top : itemHeight,
						text : feedbackItem[i].type
					});
					if(OS_ANDROID){
						noneItemLabel.width = "80%";
						noneItemLabel.wordWrap = true;
						noneItemLabel.ellipsize = false;
					}
					
					var noneQtyLabel = $.UI.create("Label", {
						classes : ['fontLight18','colorGold'],
						right : "5%",
						top : itemHeight,
						text : feedbackItem[i].total
					});
					
					e.row.add(noneItemLabel);
					e.row.add(noneQtyLabel);
					rowHeight = itemHeight;
				}
				e.row.height = rowHeight+50;
				e.row.backgroundColor = "#3D1A6F";
				e.row.children[1].top = 12;
				e.row.children[0].top = 0;
				e.row.children[0].left = 0;
				e.row.children[0].height = 40;
				e.row.children[0].backgroundColor = "#0Dffffff";
				e.row.children[1].top = 12;
				e.row.bottom = 10;
			}else{
				e.row.children[2].show();
				e.row.children[1].top = null;
				e.row.children[1].verticalAlign = Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP;
				e.row.children[0].height = 60;
				e.row.children[0].backgroundColor = "#0Dffffff";
			}
		}else{
			e.row.height = 60;
			if(OS_IOS){
				e.row.removeAllChildren();
				e.row.add(bgViewNone);
				e.row.add(noneLabel);
				e.row.add(iconNone);
			}else if(OS_ANDROID){
				for(var i=0;i<e.row.children.length;i++){
					if(!(i == 0 || i == 1)){
						e.row.children[i].text = "";
					}
				}
			}
			e.row.backgroundColor = "transparent";
			e.row.children[2].show();
			e.row.children[0].top = 0;
			e.row.children[0].left = 0;
			e.row.children[0].height = 60;
			e.row.children[0].backgroundColor = "#0Dffffff";
			e.row.children[1].top = null;
			e.row.children[1].verticalAlign = Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP;
		}
		
		if(isClick){
			setTimeout(function() {
				for (var i=3;i<e.row.children.length;i++){
					e.row.children[i].visible = true;
				}
				isClick = false;
				if(OS_IOS){
					Alloy.Globals.activityIndicator.hide();
				}else if(OS_ANDROID){
					$.anActIndicatorView.hide();
				}
			},100);
		}
	});
}

function setTextFlight() {
	try{
		$.tableMain.data = [];
		var flightDate = new Date(flight.flightDateLT);
		var monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN","JUL","AUG", "SEP", "OCT", "NOV", "DEC"];
							
		var tableRow1 = Ti.UI.createTableViewRow({
			width : "100%",
			height : "60",
		});
		
		var viewInrow1 = Ti.UI.createView({
			width : "100%",
			layout : "horizontal"
		});
							
		var viewInrow1Left = Ti.UI.createView({
			width : "51%",
			layout : "horizontal"
		});
			
		var ttFltNo = $.UI.create("Label", {
			classes : ['fontNormal','colorWhite']
		});
		ttFltNo.text = "FLT No : ";
		
		var fltNo = $.UI.create("Label", {
			classes : ['fontBoldFltNo','colorGold']
		});
		fltNo.text = flight.flightNumber+" | "+flightDate.getDate()+" "+monthNames[flightDate.getMonth()]+" "+flightDate.getFullYear();
		
		var viewInrow1Right = Ti.UI.createView({
			width : "49%",
			layout : "horizontal"
		});
			
		var ttFlyTime = $.UI.create("Label", {
			classes : ['fontNormal','colorWhite']
		});
		ttFlyTime.text = "Flight Time : ";
		
		var flyTime = $.UI.create("Label", {
			classes : ['fontBold','colorGold']
		});
			
		var flyTimeHr = parseInt((flight.flyingTime / 60));
		var flyTimeMin = (flight.flyingTime-(flyTimeHr * 60));
		flyTime.text = flyTimeHr+":"+ flyTimeMin;
		
		var tableRow2 = Ti.UI.createTableViewRow({
			width : "100%",
			height : "60",
			touchEnabled : false,
			selectionStyle : "none"
		});
			
		var viewInrow2 = Ti.UI.createView({
			width : "100%",
			layout : "horizontal"
		});
			
		var stdDate = new Date(flight.STDLT);
		var etdDate = new Date(flight.ETDLT);
		var staDate = new Date(flight.STALT);
		var etaDate = new Date(flight.ETALT);
			
		var viewInrow2Left = Ti.UI.createView({
			width : "51%",
			layout : "horizontal"
		});
			
		var ttSTD = $.UI.create("Label", {
			classes : ['fontNormal','colorWhite']
		});
		ttSTD.text = "STD : ";
		
		var STD = $.UI.create("Label", {
			classes : ['fontBold','colorGold']
		});
		if (flight.STDLT != flight.ETDLT && flight.ETDLT != "") {
			ttSTD.text = "ETD : ";
			STD.text = ("0"+etdDate.getUTCHours()).slice(-2)+":"+("0"+etdDate.getUTCMinutes()).slice(-2)+" LT";
		}else{
			STD.text = ("0"+stdDate.getUTCHours()).slice(-2)+":"+("0"+stdDate.getUTCMinutes()).slice(-2)+" LT";
		}
		
		var viewInrow2Right = Ti.UI.createView({
			width : "49%",
			layout : "horizontal"
		});
			
		var ttSTA = $.UI.create("Label", {
			classes : ['fontNormal','colorWhite']
		});
		ttSTA.text = "STA : ";
		
		var STA = $.UI.create("Label", {
			classes : ['fontBold','colorGold']
		});
		if (flight.STALT != flight.ETALT && flight.ETALT != "") {
			ttSTA.text = "ETA : ";
			STA.text = ("0"+etaDate.getUTCHours()).slice(-2)+":"+("0"+etaDate.getUTCMinutes()).slice(-2)+" LT";
		}else{
			STA.text = ("0"+staDate.getUTCHours()).slice(-2)+":"+("0"+staDate.getUTCMinutes()).slice(-2)+" LT";
		}
		
		var tableRow3 = Ti.UI.createTableViewRow({
			width : "100%",
			height : "60",
			touchEnabled : false,
			selectionStyle : "none"
		});
			
		var viewInrow3 = Ti.UI.createView({
			width : "100%",
			layout : "horizontal"
		});
			
		var viewInrow3Left = Ti.UI.createView({
			width : "51%",
			layout : "horizontal"
		});
			
		var ttOrigin = $.UI.create("Label", {
			classes : ['fontNormal','colorWhite']
		});
		ttOrigin.text = "Origin : ";
		
		var origin = $.UI.create("Label", {
			classes : ['fontBold','colorGold']
		});
		origin.text = flight.origin;
		
		var viewInrow3Right = Ti.UI.createView({
			width : "49%",
			layout : "horizontal"
		});
			
		var ttDest = $.UI.create("Label", {
			classes : ['fontNormal','colorWhite']
		});
		ttDest.text = "Destination : ";
		
		var destination = $.UI.create("Label", {
			classes : ['fontBold','colorGold']
		});
		destination.text = flight.destination;
		
		var tableRow4 = Ti.UI.createTableViewRow({
			width : "100%",
			height : "60",
			touchEnabled : false,
			selectionStyle : "none"
		});
			
		var viewInrow4 = Ti.UI.createView({
			width : "100%",
			layout : "horizontal"
		});
			
		var viewInrow4Left = Ti.UI.createView({
			width : "51%",
			layout : "horizontal"
		});
			
		var ttAcName = $.UI.create("Label", {
			classes : ['fontNormal','colorWhite']
		});
		ttAcName.text = "A/C Name : ";
		
		var viewAcName = Ti.UI.createView({
			layout : "vertical"
		});
			
		var acNameTh = $.UI.create("Label", {
			classes : ['fontBoldName','colorGold']
		});
		acNameTh.text = flight.acNameTH;
		
		var acNameEng = $.UI.create("Label", {
			classes : ['fontBoldNameEng','colorGold']
		});
		if(OS_ANDROID){
			acNameTh.width = 250;
			acNameTh.worldWrap = false;
			acNameTh.ellipsize = true;
			acNameEng.width = 250;
			acNameEng.worldWrap = false;
			acNameEng.ellipsize = true;
		}
		acNameEng.text = "("+flight.acName+")";
		
		var viewInrow4Right = Ti.UI.createView({
			width : "49%",
			layout : "horizontal"
		});
			
		var ttAc = $.UI.create("Label", {
			classes : ['fontNormal','colorWhite']
		});
		ttAc.text = "A/C : ";
		
		var ac = $.UI.create("Label", {
			classes : ['fontBold','colorGold']
		});
		ac.text = flight.aircraftType+" ("+flight.aircraftRegistration + ")";
		
		var tableRow5 = Ti.UI.createTableViewRow({
			width : "100%",
			height : "60",
			touchEnabled : false,
			selectionStyle : "none"
		});
			
		var viewInrow5 = Ti.UI.createView({
			width : "100%",
			layout : "horizontal"
		});
			
		var viewInrow5Left = Ti.UI.createView({
			width : "51%",
			layout : "horizontal"
		});
			
		var ttAcceptPax = $.UI.create("Label", {
			classes : ['fontNormal','colorWhite']
		});
		ttAcceptPax.text = "Accept PAX : ";
		
		var acceptPaxText = "";
		
		if (flight.aircraftConfiguration != ""){
			var seatClass = flight.aircraftConfiguration.split(" ");
			var classList;
			for (var i=0;i<seatClass.length;i++){
				
				classList = seatClass[i].substring(0,1);
				var classCount = 0;
				var infClass = 0;
				
				//var classCount = flightQuery.countClass(classList,currentFlightId);
				//var infClass = flightQuery.countInfant(classList,currentFlightId);
				
				var countedClass = flightQuery.getCountClass();
                if(classList == "Y"){
                	infClass = countedClass[0];
                	classCount= countedClass[4];
                	
                }else if(classList == "U")
                {
                	infClass = countedClass[1];
                	classCount = countedClass[5];
                	
                	
                }else if(classList == "C")
                {
                	infClass = countedClass[2];
                	classCount = countedClass[6];
                	
                	
                }else if(classList == "F")
                {
                	infClass = countedClass[3];
                	classCount = countedClass[7];
                	
                }
                
				
				
				if(infClass != 0){
					acceptPaxText = acceptPaxText + classList + classCount + "+" + infClass + " ";
				}else{
					acceptPaxText = acceptPaxText + classList + classCount + " ";
				}
				
			}
		}else {
			acceptPaxText = flight.acceptedPax;
		}

		var acceptPax = $.UI.create("Label", {
			classes : ['fontBold','colorGold']
		});
		acceptPax.text = acceptPaxText;
		
		var viewInrow5Right = Ti.UI.createView({
			width : "49%",
			layout : "horizontal"
		});
			
		var ttBookPax = $.UI.create("Label", {
			classes : ['fontNormal','colorWhite']
		});
		ttBookPax.text = "Booking PAX : ";
		
		var bookPax = $.UI.create("Label", {
			classes : ['fontBold','colorGold']
		});
		bookPax.text = flight.bookingPax;
		
		var tableRow6 = Ti.UI.createTableViewRow({
			width : "100%",
			height : "60",
			touchEnabled : false,
			selectionStyle : "none"
		});
			
		var viewInrow6 = Ti.UI.createView({
			width : "100%",
			layout : "horizontal"
		});
			
		var ttAcCon = $.UI.create("Label", {
			classes : ['fontNormal','colorWhite']
		});
		ttAcCon.text = "A/C Config : ";
		
		var acCon = $.UI.create("Label", {
			classes : ['fontBold','colorGold']
		});
		acCon.text = flight.aircraftConfiguration;
		
		var tableRow7 = Ti.UI.createTableViewRow({
			width : "100%",
			height : "60",
			touchEnabled : false,
			selectionStyle : "none"
		});
			
		var viewInrow7 = Ti.UI.createView({
			width : "100%",
			layout : "horizontal"
		});
			
		var ttCodeShare = $.UI.create("Label", {
			classes : ['fontNormal','colorWhite']
		});
		ttCodeShare.text = "Codeshare : ";
		
		var codeShare = $.UI.create("Label", {
			classes : ['fontBold','colorGold']
		});
		codeShare.text = flight.codeShare;
		
		viewInrow1Left.add(ttFltNo);
		viewInrow1Left.add(fltNo);
		viewInrow1Right.add(ttFlyTime);
		viewInrow1Right.add(flyTime);
		viewInrow1.add(viewInrow1Left);
		viewInrow1.add(viewInrow1Right);
		viewInrow2Left.add(ttSTD);
		viewInrow2Left.add(STD);
		viewInrow2Right.add(ttSTA);
		viewInrow2Right.add(STA);
		viewInrow2.add(viewInrow2Left);
		viewInrow2.add(viewInrow2Right);
		viewInrow3Left.add(ttOrigin);
		viewInrow3Left.add(origin);
		viewInrow3Right.add(ttDest);
		viewInrow3Right.add(destination);
		viewInrow3.add(viewInrow3Left);
		viewInrow3.add(viewInrow3Right);
		viewInrow4Left.add(ttAcName);
		viewAcName.add(acNameTh);
		viewAcName.add(acNameEng);
		viewInrow4Left.add(viewAcName);
		viewInrow4Right.add(ttAc);
		viewInrow4Right.add(ac);
		viewInrow4.add(viewInrow4Left);
		viewInrow4.add(viewInrow4Right);
		viewInrow5Left.add(ttAcceptPax);
		viewInrow5Left.add(acceptPax);
		viewInrow5Right.add(ttBookPax);
		viewInrow5Right.add(bookPax);
		viewInrow5.add(viewInrow5Left);
		viewInrow5.add(viewInrow5Right);
		viewInrow6.add(ttAcCon);
		viewInrow6.add(acCon);
		viewInrow7.add(ttCodeShare);
		viewInrow7.add(codeShare);
		
		tableRow1.add(viewInrow1);
		tableRow2.add(viewInrow2);
		tableRow3.add(viewInrow3);
		tableRow4.add(viewInrow4);
		tableRow5.add(viewInrow5);
		tableRow6.add(viewInrow6);
		tableRow7.add(viewInrow7);
		
		tableFltData.push(tableRow1);
		tableFltData.push(tableRow2);
		tableFltData.push(tableRow3);
		tableFltData.push(tableRow4);
		tableFltData.push(tableRow5);
		tableFltData.push(tableRow6);
		tableFltData.push(tableRow7);
		makeCrewTable();
		makeNationalityTable();
		$.tableMain.data = tableFltData;
		// $.tableMain.applyProperties({
			// data : tableFltData
		// });
		
		tableFltData = [];
		
	}catch (e){
		// clearText();
		Ti.API.info('catch');
		Ti.API.info(e);
		
		if(OS_IOS){
			Alloy.Globals.activityIndicator.hide();
		}
	}
}

function clearText() {
	Ti.API.info('clear');
	$.flightNum.setText("");
	$.acReg.setText("");
	$.STD.setText("");
	$.STA.setText("");
	$.acConfig.setText("");
	$.flyTime.setText("");
	$.acceptPax.setText("");
	$.bookingPax.setText("");
	$.acName.setText("");
	$.acNameTH.setText("");
	$.codeShare.setText("");
	$.origin.setText("");
	$.destination.setText("");
	$.cockpit.setText("");
	$.cabin.setText("");
	$.ge.setText("");
	$.passive.setText("");
	$.active.setText("");
	$.other.setText("");
}

function makeCrewTable() {
	var crewSum = [];
	crewSum = flightQuery.countCrewlistType();
	
	var crewSecRow = Ti.UI.createTableViewRow({
		width : "100%",
		height : "50",
		hasChild : true,
		backgroundImage : "/images/bg_header_section.png"
	});
		
	var ttCrewSec = Ti.UI.createLabel({
		text : "Crew Summary",
		color : "white",
		left : 20
	});
	
	crewSecRow.add(ttCrewSec);
	tableFltData.push(crewSecRow);
	
	crewSecRow.addEventListener('click', function(e){
		if(OS_IOS){
			Alloy.Globals.activityIndicator.show();
		}else if(OS_ANDROID){
			$.anActIndicatorView.show();
		}
		setTimeout(function() {
			var crewListView =  Alloy.createController("crew/crew_list").getView();
			if(OS_IOS)
    		{
    			Alloy.Globals.navGroupWin.openWindow(crewListView);
    		}else if(OS_ANDROID){
    			crewListView.open();
    		}  
		},10);
	});
	
	var crewRow1 = Ti.UI.createTableViewRow({
		width : "100%",
		height : "60",
		touchEnabled : false,
		selectionStyle : "none"
	});
	
	var ttCockpit = $.UI.create("Label", {
		classes : ['fontNormal','colorWhite'],
		text : "Cockpit : ",
		left : "4%",
	});
	
	var cockpitNum = $.UI.create("Label", {
		classes : ['fontBold','colorGold'],
		text : crewSum[0],
		left : "15%",
	});
	
	var ttCabin = $.UI.create("Label", {
		classes : ['fontNormal','colorWhite'],
		text : "Cabin : ",
		left : "40%",
	});
	
	var cabinNum = $.UI.create("Label", {
		classes : ['fontBold','colorGold'],
		text : crewSum[1],
		left : "50%",
	});
	
	var ttActive = $.UI.create("Label", {
		classes : ['fontNormal','colorWhite'],
		text : "Active : ",
		left : "75%",
	});
	
	var activeNum = $.UI.create("Label", {
		classes : ['fontBold','colorGold'],
		text : crewSum[4],
		left : "85%",
	});
	
	var crewRow2 = Ti.UI.createTableViewRow({
		width : "100%",
		height : "60",
		touchEnabled : false,
		selectionStyle : "none"
	});
	
	var ttGE = $.UI.create("Label", {
		classes : ['fontNormal','colorWhite'],
		text : "GE : ",
		left : "4%",
	});
	
	var geNum = $.UI.create("Label", {
		classes : ['fontBold','colorGold'],
		text : crewSum[2],
		left : "15%",
	});
	
	var ttPassive = $.UI.create("Label", {
		classes : ['fontNormal','colorWhite'],
		text : "Passive : ",
		left : "40%",
	});
	
	var passiveNum = $.UI.create("Label", {
		classes : ['fontBold','colorGold'],
		text : crewSum[3],
		left : "50%",
	});
	
	var ttOther = $.UI.create("Label", {
		classes : ['fontNormal','colorWhite'],
		text : "Other : ",
		left : "75%",
	});
	
	var otherNum = $.UI.create("Label", {
		classes : ['fontBold','colorGold'],
		text : crewSum[5],
		left : "85%",
	});
	
	crewRow1.add(ttCockpit);
	crewRow1.add(cockpitNum);
	crewRow1.add(ttCabin);
	crewRow1.add(cabinNum);
	crewRow1.add(ttActive);
	crewRow1.add(activeNum);
	tableFltData.push(crewRow1);
	
	crewRow2.add(ttGE);
	crewRow2.add(geNum);
	crewRow2.add(ttPassive);
	crewRow2.add(passiveNum);
	crewRow2.add(ttOther);
	crewRow2.add(otherNum);
	tableFltData.push(crewRow2);
}

function makeNationalityTable() {
	var nationality = flightQuery.getNationality(flightId);
	
	var nationSecRow = Ti.UI.createTableViewRow({
		width : "100%",
		height : "50",
		touchEnabled : false,
		selectionStyle : "none",
		backgroundImage : "/images/bg_header_section.png"
	});
	
	var ttNationSec = Ti.UI.createLabel({
		text : "Nationality Summary (Top Five)",
		color : "white",
		left : 20
	});
	
	nationSecRow.add(ttNationSec);
	tableFltData.push(nationSecRow);
	
	if (nationality != null || nationality.length > 0) {
		var dataTable = [];
		for (var i=0;i<nationality.length;i++){
			var tableRow = Ti.UI.createTableViewRow({
				width : "100%",
				height : 60,
				touchEnabled : false,
				selectionStyle : "none"
			});
	
			var viewInrow = Ti.UI.createView({
				width : "100%",
				layout : "horizontal"
			});
			
			var nationalityView = Ti.UI.createView({
				width : "25%"
			});
	
			var nameNationality = displayNationalityName(nationality[i]);
			var bookingClass = flightQuery.getClassFromPassenger(nationality[i], flightId);
			var nationalityText = Ti.UI.createLabel({
				left : 30,
				text : nameNationality,
				font : {
					fontSize : 22
				},
				color : "white"
			});
			
			var totalView = Ti.UI.createView({
				width : "9%"
			});
			var totalText = Ti.UI.createLabel({
				right : 0,
				text : +bookingClass[4]+":",
				font : {
					fontSize : 22
				},
				color : "#FFCB05"
			});
			
			var firstclassView = Ti.UI.createView({
				width : "9%"
			});
	
			var txtColor;
			if (bookingClass[0] == "0"){
				txtColor = "gray";
			}else{
				txtColor = "#FFCB05";
			}
			var firstclassText = Ti.UI.createLabel({
				font : {
					fontSize : 18,
					fontWeight : "Bold"
				},
				text : "F"+bookingClass[0],
				color : txtColor
			});
	
			var businessclassView = Ti.UI.createView({
				width : "9%"
			});
			
			if (bookingClass[1] == "0"){
				txtColor = "gray";
			}else{
				txtColor = "#FFCB05";
			}
			var businessclassText = Ti.UI.createLabel({
				text : "C"+bookingClass[1],
				font : {
					fontSize : 18,
					fontWeight : "Bold"
				},
				color : txtColor
			});
	
			var economicclassView = Ti.UI.createView({
				width : "9%"
			});
	
			if (bookingClass[2] == "0"){
				txtColor = "gray";
			}else{
				txtColor = "#FFCB05";
			}
			var economicclassText = Ti.UI.createLabel({
				text : "U"+bookingClass[2],
				font : {
					fontSize : 18,
					fontWeight : "Bold"
				},
				color : txtColor
			});
			
			var generalclassView = Ti.UI.createView({
				width : "9%"
			});
	
			if (bookingClass[3] == "0"){
				txtColor = "gray";
			}else{
				txtColor = "#FFCB05";
			}
			var generalclassText = Ti.UI.createLabel({
				text : "Y"+bookingClass[3],
				font : {
					fontSize : 18,
					fontWeight : "Bold"
				},
				color : txtColor
			});
			
			var cabinZone = flightQuery.getCabinZone(nationality[i], flightId);
			
			var cabinView = Ti.UI.createView({
				width : "29%",
				layout : "horizontal"
			});
			
			var textZone = "";
			if (cabinZone.floor != "" || cabinZone.floor != null){
				textZone = cabinZone.floor+" - Zone"+cabinZone.zone+" ("+cabinZone.count+")";
			}
			var cabinText = Ti.UI.createLabel({
				text : textZone,
				left : 5,
				font : {
					fontSize : 18,
					fontWeight : "Bold"
				},
				top : 20,
				color : "#FFCB05"
			});
			
			if(OS_ANDROID){
				nationalityText.font = {fontSize:20};
				totalText.font = {fontSize:16};
				firstclassText.font = {fontSize:16};
				businessclassText.font = {fontSize:16};
				economicclassText.font = {fontSize:16};
				generalclassText.font = {fontSize:16};
				cabinText.font = {fontSize:16};
			}
	
			nationalityView.add(nationalityText);
			totalView.add(totalText);
			firstclassView.add(firstclassText);
			businessclassView.add(businessclassText);
			economicclassView.add(economicclassText);
			generalclassView.add(generalclassText);
			cabinView.add(cabinText);
			viewInrow.add(nationalityView);
			viewInrow.add(totalView);
			viewInrow.add(firstclassView);
			viewInrow.add(businessclassView);
			viewInrow.add(economicclassView);
			viewInrow.add(generalclassView);
			viewInrow.add(cabinView);
			tableRow.add(viewInrow);
			tableFltData.push(tableRow);
		}
	}else {
		return;
	}
}

function displayNationalityName (fullName) {
	var name = fullName.split(', ');
	var krName;
	
	if (name[0] == "Korea"){
		switch (name[1].substring(0,1)){
			case "R":
				krName = 'Korea';
				break;
			case "D":
				// krName = 'Korea, Democratic...';
				krName = 'Korea, Democraticdqwdqwdpomd,ejrnvosrmpvomcawje';
				break;
		}
	}else {
		krName = name[0];
	}
	if (krName.length > 15){
		krName = krName.substring(0,15)+"...";
	}
	return krName;
	
}

//************************************
//* Main begin
//************************************
$.flightsumWindow.backgroundImage = bgGeneral;
$.flightsumWindow.touchEnabled = false;
$.tableMain.separatorColor = colorSeparatorTableRow;
$.flightsumWindow.addEventListener('focus', function() {
	if(!isPostLayout){
		if(OS_ANDROID){
			$.anActIndicatorView.hide();
		}
	}
});

$.flightsumWindow.addEventListener('postlayout', function() {
	if(isPostLayout){
		setTimeout(function(){
			flight = flightQuery.getFlightDetails(flightId);
			setTextFlight();
			$.flightsumWindow.touchEnabled = true;
			if(OS_IOS){
				Alloy.Globals.activityIndicator.hide();
			}else if(OS_ANDROID){
				$.anActIndicatorView.hide();
			}
		}, 300);
		isPostLayout = false;
	}
});

$.eDocument.addEventListener('click', function(){
	Alloy.Globals.navGroupWin.openWindow(Alloy.createController("edocument/edocument_list").getView());
});



if(OS_ANDROID){
	$.flightsumWindow.addEventListener('android:back', function(e) {
	    Ti.API.info("Press Back button");
		$.flightsumWindow.close();
	});
}



//************************************
//* Main end
//************************************