	// exam use
// $.navGroupWin.openWindow(Alloy.createController("passengers/passenger_single_select", [
// testData,
// {
// flightId : "a00N000000EvK6mIAF"
// }]).getView());
// Alloy.Globals.navGroupWin = $.navGroupWin;
// function testData(value){
// }
var model = require('query_lib');
var args = arguments[0] || {};
var flightId = args[1].flightId;
var callBackFunction = args[0];
var nameSort = "bySeat";
var dataFromModel = [];
var arrayDataForReturn = [];
var statusSearch = false;
var currentSize = 0;
var overlap = 50;
var scrolling = false;
var initialTableSize;
var hasMoreData = true;
var offset = 0;
// var limit = 20;
var keyboardTimeout;
var isTimeout = false;
var limit = 15;
var isLoading=false;
var isLoadingSearch=false;
var searchText="";
var isPostedLayout = false;
var isTablePostedLayout = false;

function PassengerList(data) {
	var tableData = [];
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
		currentSize += 100;
		tableData.push(row);
	}
	$.tableView.appendRow(tableData);
	arrayDataForReturn=arrayDataForReturn.concat(data);
	model = null;
	data = null;
	offset += limit;
	if(OS_IOS) { Alloy.Globals.activityIndicator.hide(); }
}
// 

function changeGroup(e) {

    arrayDataForReturn = [];
    var idRow = e.source.id;
    $.customSearchBar.value = "";
    searchText="";
    $.clearTextBtn.visible = false;
    if (idRow == "byRop" || idRow == "byRopImage") {
        nameSort = "allrop";
        
        if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
        clearAndQuery();
        setTimeout(function() {
 			retrieveAndDisplayData();
            if(OS_IOS) { Alloy.Globals.activityIndicator.hide(); }
        }, 500);
    } else if (idRow == "bySeat" || idRow == "bySeatImage") {
        nameSort = "bySeat";
        if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
        clearAndQuery();
        setTimeout(function() {
 			retrieveAndDisplayData();
            if(OS_IOS) { Alloy.Globals.activityIndicator.hide(); }
        }, 500);        
    } else if (idRow == "byName" || idRow == "byNameImage") {
        nameSort = "byName";
        
         if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
         clearAndQuery();
        setTimeout(function() {
 		 	retrieveAndDisplayData();
            if(OS_IOS) { Alloy.Globals.activityIndicator.hide(); }
        }, 500);       
    }
    setSelectHeader(nameSort);
};

$.bySeat.addEventListener('click', function(e) {
	changeGroup(e);
});

$.byName.addEventListener('click', function(e) {
	changeGroup(e);
});

$.byRop.addEventListener('click', function(e) {
	changeGroup(e);
});

$.bySeatImage.addEventListener('click', function(e) {
	changeGroup(e);
});

$.byNameImage.addEventListener('click', function(e) {
	changeGroup(e);
});

$.byRopImage.addEventListener('click', function(e) {
	changeGroup(e);
});


function first() {
    $.clearTextBtn.visible = false;
    $.bySeat.backgroundColor = colorSelectedBtnHighlight;
    $.passengerSingleId.backgroundImage = bgGeneral;
    $.tableView.separatorColor = colorSeparatorTableRow;    
}


$.tableView.addEventListener('click', function(e) {
	Ti.API.info("Test:");
    callBackFunction(arrayDataForReturn[e.index]);
    $.passengerSingleId.close();
});

$.customSearchBar.addEventListener('touchstart', function(e) {
	
    if ($.customSearchBar.value == "") {
 		$.customSearchBar.hintText = " (Name),(Dest),Class (Y),(ROP),Infant,Staff,(Main,Upper),(Zone 1)";
        $.clearTextBtn.visible = false;
    } else {
        $.clearTextBtn.visible = true;
    }
});

$.customSearchBar.addEventListener('change', function(e) {
    if(keyboardTimeout) {
        clearTimeout(keyboardTimeout);
        keyboardTimeout = null;
    }
    arrayDataForReturn = [];		
	keyboardTimeout = setTimeout(function(){
		if ($.customSearchBar.value == "")//Back to List Before Search
		{
			searchText="";
			$.clearTextBtn.visible = false;
			$.customSearchBar.hintText = " (Name),(Dest),Class (Y),(ROP),Infant,Staff,(Main,Upper),(Zone 1)";
			clearAndQuery();
            if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
                setTimeout(function() {
                    retrieveAndDisplayData();
                    if(OS_IOS) { Alloy.Globals.activityIndicator.hide(); }
                }, 20);
		} else {
			$.clearTextBtn.visible = true;
			clearAndQuery();
			searchText=$.customSearchBar.value;
			retrieveAndDisplayData();
		}
	}, 1000);
});

$.clearTextBtn.addEventListener('click', function(e) {
    $.customSearchBar.value = "";
    $.clearTextBtn.visible = false;
    statusSearch = false;
    searchText="";
    $.customSearchBar.hintText = " (Name),(Dest),Class (Y),(ROP),Infant,Staff,(Main,Upper),(Zone 1)";
	clearAndQuery();
	if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
		setTimeout(function() {
			retrieveAndDisplayData();
            if(OS_IOS) { Alloy.Globals.activityIndicator.hide(); }
        }, 20);
});


function setSelectHeader(type) {

    $.bySeat.backgroundColor = "transparent";
    $.byName.backgroundColor = "transparent";
    $.byRop.backgroundColor = "transparent";

    if (type == "bySeat") {
        $.bySeat.backgroundColor = colorSelectedBtnHighlight;
    } else if (type == "byName") {
        $.byName.backgroundColor = colorSelectedBtnHighlight;
    } else if (type == "allrop") {
        $.byRop.backgroundColor = colorSelectedBtnHighlight;
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
	var model = require('query_lib');
	if (nameSort == "bySeat") {
			// dataFromModel = model.getPassengerListBySortSeat(flightId,offset,limit,searchText);
			dataFromModel = model.getPassengerListBySeatNewQry(flightId,offset,limit,searchText);
			if (dataFromModel.length == 0) { hasMoreData = false;}
			else{ PassengerList(dataFromModel);}
		}
		if (nameSort == "byName") {
			dataFromModel = model.getPassengerListByName(flightId,offset,limit,searchText);
			if (dataFromModel.length == 0) { hasMoreData = false;}
			// else{PassengerList(dataFromModel);}
			else{PassengerList(dataFromModel);}
		}
		if (nameSort == "allrop") {
			// dataFromModel = model.getPsgRopListEdit(flightId,offset,limit,searchText);
			dataFromModel = model.getPsgRopListEditNewQry(flightId,offset,limit,searchText);
			if (dataFromModel.length == 0) { hasMoreData = false;}
			else{PassengerList(dataFromModel);}
		}	
}

function loadData() {
	if (!isLoading && hasMoreData) {
		isLoading = true;
		if(OS_IOS) {
	        Alloy.Globals.activityIndicatorLazyLoading.show();			
		}
		setTimeout(function(){
			retrieveAndDisplayData();
			if(OS_IOS) {
	            Alloy.Globals.activityIndicatorLazyLoading.hide();
			}
			isLoading = false;
		}, 20);
	}
}

function clearAndQuery() {
	$.tableView.setData([]);
	offset = 0;
	hasMoreData = true;
	currentSize = 0;
}

first();

if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
$.passengerSingleId.addEventListener('postlayout', function() {		
    if(!isPostedLayout){
    	isPostedLayout = true;
		retrieveAndDisplayData();
		if(OS_IOS) { 
			Alloy.Globals.activityIndicator.hide(); 
		}
    }
});
	
$.tableView.addEventListener("scroll", lazyload);
$.tableView.addEventListener('postlayout', function(){
    if(!isTablePostedLayout) {
    	isTablePostedLayout = true;
		initialTableSize = $.tableView.rect.height;
    }
});

if(OS_ANDROID) {
	$.passengerSingleId.addEventListener('android:back', function(e) {
	    Ti.API.info("Press Back button");
		$.passengerSingleId.close();
	});

	var softInput = Titanium.UI.Android.SOFT_INPUT_STATE_ALWAYS_HIDDEN | Ti.UI.Android.SOFT_INPUT_ADJUST_PAN;
	$.passengerSingleId.windowSoftInputMode = softInput;

	$.menuFilterBtn.height = "8%";
	$.serchView.height = "7%";
	$.bodyView.height = "85%";
    $.clearTextBtn.top = 20;
    $.searchImgView.width = "10%";
    $.searchImgView.height = "100%";
    $.searchImgView.left = 0;
    $.searchImg.top = 10;
    $.tableView.height = "100%";
    $.bySeatImage.top = 5;
    $.byNameImage.top = 5;
    $.byRopImage.top = 5;

    $.customSearchBar.font = {
		fontSize : utility_lib.dpiConverter(18)
	};
     $.customSearchBar.left = "10%";
	 $.customSearchBar.width = "89%";

}
