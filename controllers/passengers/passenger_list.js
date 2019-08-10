// exam use
// var crewlist = Alloy.createController("/passengers/passenger_list", {flightId : "TG778"}).getView();
// crewlist.open();
var model = require('query_lib');
var component = require('component_lib');
var utility_lib = require('utility_lib');
var model = require('query_lib');
var args = arguments[0] || {};
var flightId = currentFlightId;
var nameSort = "bySeat";
var dataFromModel;
var tempDataFromModel;
var btn1;
var rowBtn1;
var btn2;
var rowBtn2;
var btn3;
var rowBtn3;
//lazy load
var currentSize = 0;
var overlap = 50;
var scrolling = false;
var initialTableSize;
var hasMoreData = true;
var offset = 0;
var limit = 15;
var isLoading=false;
var isLoadingSearch=false;
var searchText="";
var keyboardTimeout;
var isPostedLayout = false;
var dataFromModel = '';
var tableData = [];
var openedToOtherView = false;
if(OS_ANDROID)
{
	var softInput = Titanium.UI.Android.SOFT_INPUT_STATE_ALWAYS_HIDDEN | Ti.UI.Android.SOFT_INPUT_ADJUST_PAN;
	$.win.windowSoftInputMode = softInput;	
	$.customSearchBar.height = utility_lib.dpiConverter(60);
	$.searchSec.height = utility_lib.dpiConverter(80);
	
	$.searchImg.width = utility_lib.dpiConverter(50);
	$.searchImg.height = utility_lib.dpiConverter(50);

	$.clearTextBtn.width = utility_lib.dpiConverter(28);
	$.clearTextBtn.height = utility_lib.dpiConverter(28);
	
	$.customSearchBar.font = {
		fontSize : utility_lib.dpiConverter(18)
	};
	
	$.customSearchBar.top = utility_lib.dpiConverter(15) + '%';
	$.customSearchBar.bottom = utility_lib.dpiConverter(40) + '%';
	$.customSearchBar.left = utility_lib.dpiConverter(10) + '%';
	$.customSearchBar.backgroundColor = "#000";
	
	$.anActIndicatorView.hide();
}


function PassengerList(data) {
	
	//$.headerSSRList.removeAllChildren();
	//$.tableView.setData([]);
	//$.tableView.removeAllChildren();
	
	tableData = [];
		
	for (var ii = 0; ii < data.length; ii++) {
		var row = new Alloy.createController("common/rowPassengerList", {
				id : data[ii].id,
				seat : data[ii].bookingSeat,
				name : data[ii].name,
				ropTier : data[ii].rop,
				paxClass : data[ii].bookingClass,
				infantName : data[ii].infantName,
				infantAge : data[ii].infantAge,
				destination : data[ii].offPoint,
				hasInfant : data[ii].hasInfant,
				isStaff : data[ii].isStaff
		}).getView();
		
		row.addEventListener("click", function(e) {
			
			Ti.API.info('passengerId ' + e.row.passengerId);
			if(OS_IOS)
			{
				
				viewDetail(e.row.passengerId);	
			}
			
			if(OS_ANDROID)
			{
				$.anActIndicatorView.show();
				//e.row.backgroundColor = "#ffffff";
				/*
				this.backgroundColor = "#FFFFFF";
				setTimeout(function() {
			    	this.backgroundColor = "transparent";
    			}, 200);
				*/
				
				viewDetail(e.row.passengerId);
				
				//$.win.close();
				//$.win = null;
			}
			
		});
		
		currentSize += 100;
		tableData.push(row);
	} // comment it out
	$.tableView.appendRow(tableData);
	// model = null;
	data = null;
	offset += limit;
	if(OS_IOS) { Alloy.Globals.activityIndicator.hide(); }
	
}

function PassengerConnectingList(data) {
	
	//$.headerSSRList.removeAllChildren();
	//$.tableView.removeAllChildren();
	//$.tableView.setData([]);
	tableData = [];
		
	var flightDetail = model.getFlight(currentFlightId);
	var arrivalTime = flightDetail.ETALT != "" ? flightDetail.ETALT : flightDetail.STALT;
	
	for (var ii = 0; ii < data.length; ii++) {
		var row = new Alloy.createController("common/rowPaxConnectingList", {
				id : data[ii].id,
				seat : data[ii].bookingSeat,
				name : data[ii].name,
				ropTier : data[ii].rop,
				paxClass : data[ii].bookingClass,
				infantName : data[ii].infantName,
				infantAge : data[ii].infantAge,
				destination : data[ii].offPoint,
				hasInfant : data[ii].hasInfant,
				isStaff : data[ii].isStaff,
				conSTD : data[ii].conSTD,
				conSegment : data[ii].conSegment,
				conNumber : data[ii].conNumber,
				conDate : data[ii].conDate,
				arrivalLT : arrivalTime,
				conSTDtext : data[ii].conSTDtext
		}).getView();
		
		row.addEventListener("click", function(e) {
			if(OS_IOS)
			{
				viewDetail(e.row.passengerId);	
			}
			
			if(OS_ANDROID)
			{
				$.anActIndicatorView.show();
				viewDetail(e.row.passengerId);
			}
		});
		currentSize += 100;
		tableData.push(row);
	} // comment it out
	$.tableView.appendRow(tableData);
	// model = null;
	data = null;
	offset += limit;
	if(OS_IOS) { Alloy.Globals.activityIndicator.hide(); }
		
}

function find_duplicate_in_array(arra1) {
  var i,
      len=arra1.length,
      result = [],
      obj = {};

  for (i=0; i<len; i++)
  {
    obj[arra1[i]]=0;
  }
  for (i in obj) {
    result.push(i);
  }
  return result;
}

function PassengerListBySSR(data) {
	
	var HeadView = Ti.UI.createView({
		backgroundColor :"transparent",
		height : "50",
		width : "100%",
		layout : "horizontal",
		backgroundImage : bgHeaderSection
	});



	view1 = Ti.UI.createView({
		height : "50",
		width : "10%",
		layout : "vertical"
	});
	var label1 = Ti.UI.createLabel({
		text : "Seat",
		color : "white",
		height : "100%"

	});
	view1.add(label1);
	HeadView.add(view1);
	
	view1 = Ti.UI.createView({
		height : "50",
		width : "6%",
		layout : "vertical"
	});
	var label1 = Ti.UI.createLabel({
		text : "Type",
		color : "white",
		height : "100%"
	});
	view1.add(label1);
	HeadView.add(view1);
	

	view1 = Ti.UI.createView({
		height : "50",
		width : "32%",
		layout : "vertical",
	});
	var label1 = Ti.UI.createLabel({
		text : "PAX",
		color : "white",
		height : "100%"
	});
	view1.add(label1);
	HeadView.add(view1);

	

	view1 = Ti.UI.createView({
		height : "50",
		width : "23%",
		layout : "vertical"
	});
	var label1 = Ti.UI.createLabel({
		text : "Remark",
		color : "white",
		height : "100%"
	});
	view1.add(label1);
	HeadView.add(view1);

	view1 = Ti.UI.createView({
		height : "50",
		width : "20%",
		ledt : "2%",
		layout : "vertical"
	});
	var label1 = Ti.UI.createLabel({
		text : "Status",
		color : "white",
		height : "100%"
	});
	view1.add(label1);
	HeadView.add(view1);

	$.headerSSRList.add(HeadView);
	tableData = [];
	for (var ii = 0; ii < data.length; ii++) {
		var row = Ti.UI.createTableViewRow({
			className : 'row',
			objName : 'row',
			touchEnabled : true,
			height : 75,
			backgroundSelectedColor : "33ffffff",
			passengerId : data[ii].id
		});

		var ViewRow = Ti.UI.createView({
			rowID : 1,
			width : '100%',
			left : "0",
			height : '100%',
			layout : "horizontal",
			passengerId : data[ii].id
		});

		view1 = Ti.UI.createView({
			height : "100%",
			width : "10%",
			passengerId : data[ii].id,
			layout : "vertical"
		});
		var label1 = Ti.UI.createLabel({
			text : data[ii].bookingSeat,
			color : "white",
			height : "100%",
			font : {
				fontSize : utility_lib.dpiConverter(18),
				fontFamily : 'arial',
				fontWeight : 'bold'
			},
			passengerId : data[ii].id

		});
		view1.add(label1);
		ViewRow.add(view1);


		view1 = Ti.UI.createView({
			height : "100%",
			width : "8%",
			passengerId : data[ii].id,
			layout : "vertical"
		});
		label1 = Ti.UI.createLabel({
			text : data[ii].type,
			color : "#ffcb05", // "white", // edit color SSR.type
			height : "100%",
			left : "0",
			font : {
				fontSize : utility_lib.dpiConverter(18),
				fontFamily : 'arial',
				fontWeight : 'bold'
			},
			passengerId : data[ii].id
		});
		view1.add(label1);
		ViewRow.add(view1);
		
		
		view1 = Ti.UI.createView({
			height : "100%",
			width : "33%",
			left : "2%",
			passengerId : data[ii].id,
			layout : "vertical"
		});
		label1 = Ti.UI.createLabel({
			text : data[ii].name,
			color : "white",
			height : "100%",
			left : "0",
			font : {
				fontSize : utility_lib.dpiConverter(18),
				fontFamily : 'arial',
				fontWeight : 'bold'
			},
			passengerId : data[ii].id
		});
		view1.add(label1);
		ViewRow.add(view1);

		

		view1 = Ti.UI.createView({
			height : "100%",
			width : "27%",
			left : "0.5%",
			right : "0.5%",
			passengerId : data[ii].id,
			layout : "vertical"
		});
		label1 = Ti.UI.createLabel({
			text : data[ii].remark,
			color : "white",
			height : "100%",
			left : "0",
			font : {
				fontSize : utility_lib.dpiConverter(18),
				fontFamily : 'arial',
				fontWeight : 'bold'
			},
			passengerId : data[ii].id
		});
		view1.add(label1);
		ViewRow.add(view1);

		view1 = Ti.UI.createView({
			height : "100%",
			width : "18%",
			passengerId : data[ii].id
		});
		label1 = Ti.UI.createLabel({
			text : data[ii].status,
			color : "white",
			left : "0",
			font : {
				fontSize : utility_lib.dpiConverter(18),
				fontFamily : 'arial',
				fontWeight : 'bold'
			},
			passengerId : data[ii].id
		});
		view1.add(label1);
		ViewRow.add(view1);

		row.add(ViewRow);
		row.hasChild = true;
		row.addEventListener("click", function(e) {
			Ti.API.info('passengerId ' + e.row.passengerId);
			if(OS_IOS)
			{
				viewDetail(e.row.passengerId);	
			}
			
			if(OS_ANDROID)
			{
				$.anActIndicatorView.show();
				viewDetail(e.row.passengerId);
			}
			
			
			
		});
		currentSize += 75;
		tableData.push(row);
	}
	$.tableView.appendRow(tableData);
	offset += limit;
	if(OS_IOS) { Alloy.Globals.activityIndicator.hide(); }
}

function viewDetail(passengerId) {
    if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
    Ti.API.info("passengerId " + passengerId);
    var passengerDetailView = Alloy.createController("passengers/passenger_detail", {
            passengerId : passengerId,
            flightId : flightId
        }).getView();
        
    setTimeout(function() {
    	if(OS_IOS){
        	Alloy.Globals.navGroupWin.openWindow(passengerDetailView);
       	}else{
       		openedToOtherView = true;
       		passengerDetailView.open();
       	}
    }, 200);
}

function changeGroup(e) {
	
	$.headerSSRList.removeAllChildren();
	$.tableView.removeAllChildren();
	$.tableView.setData([]);
	$.addBt.removeAllChildren();

	$.customSearchBar.value="";
	Ti.API.info(e.source.idType);
	if(e.source.idType != null){
        idRow = e.source.idType;	    
	} else {
	    idRow = "bySeat";
	}
	
	
	$.customSearchBar.value="";
	searchText="";
	$.clearTextBtn.visible = false;
	if (idRow == "byRop") {
		clearAndQuery();
		setSelectHeader(idRow);
		$.addBt.removeAllChildren();
		$.addBt.height = "60";
		$.addBt.backgroundColor = "#806f01a7";
		if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
		if(OS_ANDROID){
			$.anActIndicatorView.show();
		}
		nameSort = "allrop";
        setTimeout(function() {
 			retrieveAndDisplayData();
            if(OS_IOS) { Alloy.Globals.activityIndicator.hide(); }
            if(OS_ANDROID){
				$.anActIndicatorView.hide();
			}
        }, 500);
        
		
		var viewRow = Ti.UI.createView({
			top : "7",
			bottom : "7",
			left : "15",
			right : "15",
			borderRadius : '10',
			borderColor : "white",
			borderWidth : "2",
		});

		var mainView = Ti.UI.createView({
			height : "100%",
			width : "100%",
			layout : "horizontal",
			backgroundColor : "transparent"
		});

		 btn1 = Ti.UI.createView({
			id : "allrop",
			width : "49.85%",
			scrollable : false,
			top : "0",
			bottom : "0",
			left : "0",
			id : "allrop1",
			backgroundColor : "#c6168d",
			btn:true
		});
		 rowBtn1 = Ti.UI.createView({
			touchEnabled : true,
			height : "100%",
			id : "allrop2",
			width : "100%",
			backgroundColor : "#33ffffff",
			btn:true
		});
		var label = Ti.UI.createLabel({
			text : "All ROP",
			textAlign : "Ti.UI.TEXT_ALIGNMENT_CENTER",
			id : "allrop3",
			height : "100%",
			color : "white",
			backgroundColor:"transparent"
		});
		
		
		
		btn1.add(rowBtn1);
		
		btn1.addEventListener('click', function(e) {
			btn1.backgroundColor="#c6168d";
			btn2.backgroundColor="transparent";
		$.customSearchBar.value="";
		if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
		if(OS_ANDROID){
			$.anActIndicatorView.show();
		}
		nameSort = "allrop";
		clearAndQuery();
		setTimeout(function() {
			retrieveAndDisplayData();
            if(OS_IOS) { Alloy.Globals.activityIndicator.hide(); }
            if(OS_ANDROID){
			$.anActIndicatorView.hide();
		}
        }, 500);
        
		
		});
		
		rowBtn1.add(label);
		mainView.add(btn1);
		var separator = Ti.UI.createView({
			width : "2",
			backgroundColor : 'white',

		});
		mainView.add(separator);

		 btn2 = Ti.UI.createView({
			id : "upgrade",
			objName : 'table',
			width : "49.85%",
			height : "100%",
			scrollable : false,
			btn : true,
			backgroundColor : "transparent"
		});
		rowBtn2 = Ti.UI.createView({
			id : "upgrade",
			className : 'row',
			objName : 'row',
			touchEnabled : false,
			height : "100%",
			width : "100%",
			backgroundColor : "#33ffffff",
			btn:true
		});
		label = Ti.UI.createLabel({
			textAlign : "Ti.UI.TEXT_ALIGNMENT_CENTER",
			id : "upgrade",
			text : "Eligible For Upgrade",
			height : "100%",
			color : "white",
			backgroundColor:"transparent"
		});
		
		//btn2.addEventListener("click", changeByRop);
		btn2.addEventListener('click', function(e) {
			btn1.backgroundColor="transparent";
			btn2.backgroundColor="#c6168d";
			$.customSearchBar.value="";
			if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
			if(OS_ANDROID){
			$.anActIndicatorView.show();
		}
			nameSort = "eligible";
			clearAndQuery();
			setTimeout(function() {
				retrieveAndDisplayData();
	            if(OS_IOS) { Alloy.Globals.activityIndicator.hide(); }
	            if(OS_ANDROID){
			$.anActIndicatorView.hide();
		}
	        }, 500);
		});
		rowBtn2.add(label);
		btn2.add(rowBtn2);
		mainView.add(btn2);
		viewRow.add(mainView);
		$.addBt.add(viewRow);
	} else if (idRow == "SSR") {
		clearAndQuery();
		setSelectHeader(idRow);
		$.addBt.removeAllChildren();
		$.addBt.backgroundColor = "#806f01a7";
		$.addBt.height = "60";
		
		nameSort = "all";
		if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
		if(OS_ANDROID){
			$.anActIndicatorView.show();
		}
		setTimeout(function() {
 			retrieveAndDisplayData();
            if(OS_IOS) { Alloy.Globals.activityIndicator.hide(); }
        	if(OS_ANDROID){
				$.anActIndicatorView.hide();
			}
        }, 500);
        
		var viewRow = Ti.UI.createView({
			top : "7",
			bottom : "7",
			left : "15",
			right : "15",
			borderRadius : '10',
			borderColor : "white",
			borderWidth : "2",
		});

		var mainView = Ti.UI.createView({
			height : "100%",
			width : "100%",
			layout : "horizontal",
			backgroundColor : "transparent",

		});

		 btn1 = Ti.UI.createView({
			id : "all",
			width : "33%",
			scrollable : false,
			top : "0",
			bottom : "0",
			left : "0",
			id : "allrop",
			backgroundColor : "#c6168d"
		});

		var row = Ti.UI.createView({
			id : "all",
			touchEnabled : true,
			height : "100%",
			width : "100%",
			backgroundColor : "#33ffffff",
		});

		var label = Ti.UI.createLabel({
			text : "All",
			textAlign : "Ti.UI.TEXT_ALIGNMENT_CENTER",
			id : "all",
			height : "100%",
			color : "White",
			backgroundColor : "transparent"
		});
		
		btn1.add(row);
		btn1.addEventListener('click', function(e) {
			btn1.backgroundColor="#c6168d";
			btn2.backgroundColor="transparent";
			btn3.backgroundColor="transparent";
		$.customSearchBar.value="";
		
		nameSort = "all";
		clearAndQuery();
		if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
		if(OS_ANDROID){
			$.anActIndicatorView.show();
		}
		setTimeout(function() {
			retrieveAndDisplayData();
            if(OS_IOS) { Alloy.Globals.activityIndicator.hide(); }
            if(OS_ANDROID){
			$.anActIndicatorView.hide();
		}
        }, 500);
        
		});
		
		row.add(label);

		mainView.add(btn1);
		var separator = Ti.UI.createView({
			width : "2",
			backgroundColor : 'white',

		});
		mainView.add(separator);

		btn2 = Ti.UI.createView({
			id : "specialMeal",
			width : "33%",
			scrollable : false,
			top : "0",
			bottom : "0",
			left : "0",
			id : "allrop",
			backgroundColor : "transparent"
		});

		row = Ti.UI.createView({
			className : 'row',
			objName : 'row',
			id : "specialMeal",
			touchEnabled : true,
			height : "100%",
			width : "100%",
			backgroundColor : "#33ffffff",
		});
		label = Ti.UI.createLabel({
			textAlign : "Ti.UI.TEXT_ALIGNMENT_CENTER",
			id : "specialMeal",
			text : "Special Meal",
			height : "100%",
			color : "white",
			backgroundColor : "transparent"
		});
		
		btn2.add(row);
		btn2.addEventListener('click', function(e) {
			btn2.backgroundColor="#c6168d";
			btn1.backgroundColor="transparent";
			btn3.backgroundColor="transparent";
		// var model = require('query_lib');
		$.customSearchBar.value="";
		if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
		if(OS_ANDROID){
			$.anActIndicatorView.show();
		}
		
		nameSort = "specialMeal";
		clearAndQuery();
		setTimeout(function() {
			retrieveAndDisplayData();
            if(OS_IOS) { Alloy.Globals.activityIndicator.hide(); }
            if(OS_ANDROID){
			$.anActIndicatorView.hide();
		}
        }, 500);
		
		});
		row.add(label);
		mainView.add(btn2);
		var separator = Ti.UI.createView({
			width : "2",
			backgroundColor : 'white'
		});
		mainView.add(separator);

		btn3 = Ti.UI.createView({
			id : "other",
			width : "33%",
			scrollable : false,
			top : "0",
			bottom : "0",
			left : "0",
			id : "allrop",
			separatorColor : "#ffffff",
			backgroundColor : "transparent"
		});

		row = Ti.UI.createView({
			className : 'row',
			id : "other",
			objName : 'row',
			touchEnabled : true,
			height : "100%",
			width : "100%",
			backgroundSelectedColor : "#33ffffff",
			backgroundColor : "transparent"
		});
		label = Ti.UI.createLabel({
			textAlign : "Ti.UI.TEXT_ALIGNMENT_CENTER",
			id : "other",
			text : "Other",
			height : "100%",
			color : "white",
			backgroundColor : "transparent"
		});
		
		btn3.add(row);
		
		btn3.addEventListener('click', function(e) {
			btn3.backgroundColor="#c6168d";
			btn1.backgroundColor="transparent";
			btn2.backgroundColor="transparent";
		// var model = require('query_lib');
		$.customSearchBar.value="";
		if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
		if(OS_ANDROID){
			$.anActIndicatorView.show();
		}
		nameSort = "other";
		clearAndQuery();
		setTimeout(function() {
			retrieveAndDisplayData();
            if(OS_IOS) { Alloy.Globals.activityIndicator.hide(); }
           if(OS_ANDROID){
				$.anActIndicatorView.hide();
			}
        	}, 500);
		});
		
		row.add(label);
		mainView.add(btn3);
		viewRow.add(mainView);
		$.addBt.add(viewRow);
	} else if (idRow == "bySeat") {
		setSelectHeader(idRow);
		nameSort = "bySeat";
		clearAndQuery();
		$.addBt.removeAllChildren();
		$.addBt.height = "0";
		if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
		if(OS_ANDROID){
			$.anActIndicatorView.show();
		}
		setTimeout(function() {
			retrieveAndDisplayData();
            if(OS_IOS) { Alloy.Globals.activityIndicator.hide(); }
            if(OS_ANDROID){
			$.anActIndicatorView.hide();
		}
        }, 500);
        
		
	} else if (idRow == "byName") {
		setSelectHeader(idRow);
		nameSort = "byName";
		clearAndQuery();
		$.addBt.removeAllChildren();
		$.addBt.height = "0";
		
		/* Assignment to TOP  */
		if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
		if(OS_ANDROID){
			$.anActIndicatorView.show();
		}
		setTimeout(function() {
 			retrieveAndDisplayData();
            if(OS_IOS) { Alloy.Globals.activityIndicator.hide(); }
            if(OS_ANDROID){
			$.anActIndicatorView.hide();
		}
        }, 500);
        
	} else if (idRow == "minimal") {
		// component.alertUnderConstruction();
		setSelectHeader(idRow);
		nameSort = "Connect";
		clearAndQuery();
		$.addBt.removeAllChildren();
		$.addBt.height = "0";

		if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
		if(OS_ANDROID){
			$.anActIndicatorView.show();
		}
		setTimeout(function() {
 			retrieveAndDisplayData();
            if(OS_IOS) { Alloy.Globals.activityIndicator.hide(); }
            if(OS_ANDROID){
			$.anActIndicatorView.hide();
		}
        }, 500);
	}
};


function first() {
	$.clearTextBtn.visible = false;
	$.tableView.backgroundColor = "transparent";
	$.tableView.separatorColor=colorSeparatorTableRow;
	$.win.backgroundImage = bgGeneral;
}

$.customSearchBar.addEventListener('click', function(e) {
	//$.clearTextBtn.visible = true;
	if($.customSearchBar.value.length>0){
		$.customSearchBar.hintText="";
	}
	
});
$.customSearchBar.addEventListener('change', function(e) {
    if(keyboardTimeout) {
        clearTimeout(keyboardTimeout);
        keyboardTimeout = null;
    }
		keyboardTimeout = setTimeout(function(){
    	    if ($.customSearchBar.value == "")//Back to List Before Search
    		{
    			searchText="";
    			$.clearTextBtn.visible = false;
    			//$.clearTextBtn.hide();
    			changeHintText();
                if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
                if(OS_ANDROID){
					$.anActIndicatorView.show();
				}
                setTimeout(function() {
                    clearAndQuery();
                    retrieveAndDisplayData();
                    if(OS_IOS) { Alloy.Globals.activityIndicator.hide(); }
                    if(OS_ANDROID){
						$.anActIndicatorView.hide();
					}
                }, 20);
    		} else {
    			//$.clearTextBtn.show();
				$.clearTextBtn.visible = true;
				
				$.tableView.removeAllChildren();
				$.tableView.setData([]);
				$.headerSSRList.removeAllChildren();
				offset = 0;
				hasMoreData = true;
				currentSize = 0;
				searchText="";
				//clearAndQuery();
				searchText=$.customSearchBar.value;
				retrieveAndDisplayData();
				scrolling = false;
    		}
		}, 500);
});

$.clearTextBtn.addEventListener('click', function(e) {
	$.customSearchBar.value="";
	searchText="";
	changeHintText();
	$.clearTextBtn.visible = false;
	clearAndQuery();
	if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
	// if(OS_ANDROID){
			// $.anActIndicatorView.show();
	// }
	setTimeout(function() {
		retrieveAndDisplayData();
        if(OS_IOS) { Alloy.Globals.activityIndicator.hide(); }
        // if(OS_ANDROID){
			// $.anActIndicatorView.hide();
		// }
    }, 20);
	
});
function setSelectHeader(type) {

	$.bySeat.backgroundColor = "transparent";
	$.bySeatImg.image = "/images/btn_seat.png";
	$.byName.backgroundColor = "transparent";
	$.byNameImg.image = "/images/btn_name.png";
	$.byRop.backgroundColor = "transparent";
	$.byRopImg.image = "/images/btn_rop.png";
	$.SSR.backgroundColor = "transparent";
	$.SSRImg.image = "/images/btn_ssr.png";
	$.minimal.backgroundColor = "transparent";
	$.minimalImg.image = "/images/btn_connecting_flt.png";

	if (type == "bySeat") {
		$.bySeat.backgroundColor = colorSelectedBtnHighlight;
		$.bySeatImg.image = "/images/btn_seat_ac.png";
	} else if (type == "byName") {
		$.byName.backgroundColor = colorSelectedBtnHighlight;
		$.byNameImg.image = "/images/btn_name_ac.png";
	} else if (type == "byRop") {
		$.byRop.backgroundColor = colorSelectedBtnHighlight;
		$.byRopImg.image = "/images/btn_rop_ac.png";
	} else if (type == "SSR") {
		$.SSR.backgroundColor = colorSelectedBtnHighlight;
		$.SSRImg.image = "/images/btn_ssr_ac.png";
	} else if (type == "minimal") {
		$.minimal.backgroundColor = colorSelectedBtnHighlight;
		$.minimalImg.image = "/images/btn_connecting_flt_ac.png";
	}

}

function lazyload(_evt) {
	
	if (OS_IOS) {
		
		if (!scrolling) {
			scrolling = true;
			$.customSearchBar.blur();
		}
		
		if ((currentSize - overlap) < (_evt.contentOffset.y + initialTableSize)) {
			loadData();
			
		}
	} else {
		if (_evt.firstVisibleItem + _evt.visibleItemCount == _evt.totalItemCount) {
			loadData();
			
		}
	}
}

function retrieveAndDisplayData(){
	// var model = require('query_lib');
	if (nameSort == "bySeat") {
		changeHintText();
			dataFromModel = model.getPassengerListBySeatNewQry(flightId,offset,limit,searchText);
			if (dataFromModel.length == 0) { hasMoreData = false;}
			else{ PassengerList(dataFromModel);}
		}
		if (nameSort == "byName") {
			changeHintText();
			dataFromModel = model.getPassengerListByName(flightId,offset,limit,searchText);
			if (dataFromModel.length == 0) { hasMoreData = false;}
			else{PassengerList(dataFromModel);}
		}
		if (nameSort == "allrop") {
			changeHintText();
			dataFromModel = model.getPsgRopListEditNewQry(flightId,offset,limit,searchText);
			if (dataFromModel.length == 0) { hasMoreData = false;}
			else{PassengerList(dataFromModel);}
		}
		if (nameSort == "eligible") {
			changeHintText();
			dataFromModel = model.getPsgEligibleListEditNewQry(flightId,offset,limit,searchText);
			if (dataFromModel.length == 0) { hasMoreData = false;}
			else{PassengerList(dataFromModel);}
		}
		if (nameSort == "all") {
			changeHintText();
			dataFromModel = model.getPassengerSSRListEditNewQry(flightId,offset,limit,searchText);
			if (dataFromModel.length == 0) { hasMoreData = false;}
			else{PassengerListBySSR(dataFromModel);}
		}
		if (nameSort == "specialMeal") {
			changeHintText();
			dataFromModel = model.getPassengerSSRSpecailMealListEditNewQry(flightId,offset,limit,searchText);
			if (dataFromModel.length == 0) { hasMoreData = false;}
			else{PassengerListBySSR(dataFromModel);}
		}
		if (nameSort == "other") {
			changeHintText();
			dataFromModel = model.getPassengerSSROtherListEditNewQry(flightId,offset,limit,searchText);
			if (dataFromModel.length == 0) { hasMoreData = false;}
			else{PassengerListBySSR(dataFromModel);}
		}
		if (nameSort == "Connect") {
			changeHintText();
			dataFromModel = model.getPaxConnecting(flightId,offset,limit,searchText);
			if (dataFromModel.length == 0) { hasMoreData = false;}
			else{PassengerConnectingList(dataFromModel);}
		}
}

function loadData() {
	if (!isLoading && hasMoreData) {
		isLoading = true;
//		showActivityIndicator();
        if(OS_IOS){
        	Alloy.Globals.activityIndicatorLazyLoading.show();
		}
		if(OS_ANDROID)
		{
			$.anActIndicatorView.show();
		}
		
		setTimeout(function(){
			retrieveAndDisplayData();
//			hideActivityIndicator();
        if(OS_IOS){
        	Alloy.Globals.activityIndicatorLazyLoading.hide();
        }
        if(OS_ANDROID)
		{
			$.anActIndicatorView.hide();	
		}
    			isLoading = false;
		}, 300);
	}
}

function clearAndQuery() {
	
	$.tableView.removeAllChildren();
	$.tableView.setData([]);
	$.headerSSRList.removeAllChildren();
	offset = 0;
	hasMoreData = true;
	currentSize = 0;
	searchText="";
	$.clearTextBtn.visible = false;
}

// function showActivityIndicator() {
	// activityIndicator.show();
// }
// 
// function hideActivityIndicator() {
	// activityIndicator.hide();
// }

function changeHintText(){
	if (nameSort == "all" || nameSort == "specialMeal" || nameSort == "other") {
		$.customSearchBar.hintText=" (Name),(Dest),Class (Y),(ROP),Infant,Staff,(Main,Upper),(Zone 1),(SSR Type),(SSR Status)";
		if(OS_ANDROID){
			$.customSearchBar.font = {
				fontSize : utility_lib.dpiConverter(16)
			};
		}
	}else
	{
		$.customSearchBar.hintText=" (Name),(Dest),Class (Y),(ROP),Infant,Staff,(Main,Upper),(Zone 1)";
		if(OS_ANDROID){
			$.customSearchBar.font = {
				fontSize : utility_lib.dpiConverter(18)
			};
		}
	}
	
}
/////////////////////////////////
//		Call function
/////////////////////////////////

$.win.touchEnabled=false;
first();
setSelectHeader(nameSort);
$.tableView.addEventListener("scroll", lazyload);

//run first in page
$.win.addEventListener('postlayout', function() {
	if(!isPostedLayout){
		retrieveAndDisplayData();
		if(OS_IOS) { Alloy.Globals.activityIndicator.hide(); }
		
		setTimeout(function(){
			$.win.touchEnabled=true;
			if(OS_ANDROID){
				$.anActIndicatorView.hide();
			}
		}, 300);
		initialTableSize = $.tableView.rect.height;
		isPostedLayout = true;
	}
});


if(OS_ANDROID){
	$.anActIndicatorView.show();
}
	
$.win.addEventListener('focus', function(e) {
	Ti.API.info('focus');
	if(openedToOtherView)
	{
		if(OS_ANDROID){
			$.anActIndicatorView.hide();
		}
		openedToOtherView = false;
	}
	
    if(passengerListIsRefresh) {
        passengerListIsRefresh = 0;
        $.win.touchEnabled=false;
        // if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
        setTimeout(function(){
           if(OS_IOS){
           		nameSort = "bySeat";
           		setSelectHeader(nameSort);
           		changeGroup(e);
           }
           if(OS_ANDROID){
				$.anActIndicatorView.hide();
			}
           $.win.touchEnabled=true;
        }, 300);
    }
});

if(OS_IOS){
	$.tableView.addEventListener('postlayout', function(){
		initialTableSize = $.tableView.rect.height;
	});
}
	
if(OS_ANDROID)
{
	$.win.addEventListener('android:back', function(e) {
	    Ti.API.info("Press Back button");
	    $.tableView.removeAllChildren();
		$.tableView = null;
		$.headerSSRList.removeAllChildren();
		$.headerSSRList = null;
		$.win.removeAllChildren();
		$.win.close();
	});
}
