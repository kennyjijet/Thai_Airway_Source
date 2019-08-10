// exam use
// $.navGroupWin.openWindow(Alloy.createController("passengers/passenger_multi_select", [
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
var nameSort = "All";
var dataFromModel = [];
var filterDataFromModel = [];
var arrayDataForReturn = [];
var statusSearch = false;


function PassengerList(data) {
	$.tableView.removeAllChildren();
	var tableData = [];
	for (var ii = 0; ii < data.length; ii++) {
		var row = Ti.UI.createTableViewRow({
			className : 'row',
			objName : 'row',
			touchEnabled : true,
			height : 100,
			selectedBackgroundColor : "33ffffff",
			passengerId : data[ii].id,
			idn : "00000"
		});
		var MainView = Ti.UI.createView({
			className : "row",
			height : "100%",
			width : "100%",
			layout : "horizontal",
			passengerId : data[ii].id,
			idn : "11111"
		});

		var checkBoxView = Ti.UI.createView({
			height : "100%",
			width : "10%",
			idn : "2222"
		});

		var checkBoxImg = Ti.UI.createImageView({
			image : "images/btn_button_off.png",
			height : checkBoxView.width / 2,
			width : checkBoxView.width / 2,
			idn : "3333"
		});

		var view1 = Ti.UI.createView({
			height : "100%",
			width : "15%",
			idn : "444444"
		});

		if (nameSort == "All") {
			var img = Ti.UI.createImageView({
				image : "images/ICON_SEAT.png",
				height : "60px",
				width : "60px"
			});
			view1.add(img);

		} else if (nameSort == "bySeat") {
			var img = Ti.UI.createImageView({
				image : "images/ICON_SEAT.png",
				height : "60px",
				width : "60px"
			});
			view1.add(img);

		} else if (nameSort == "allrop") {
			if (data[ii].rop.toLowerCase().indexOf("gold") > -1) {
				var img = Ti.UI.createImageView({
					image : "images/ICON_ROP GOLD.png",
					height : "60px",
					width : "60px"
				});
				view1.add(img);

			} else if (data[ii].rop.toLowerCase().indexOf("platinum") > -1) {
				var img = Ti.UI.createImageView({
					image : "images/ICON_ROP PLATINUM.png",
					height : "60px",
					width : "60px"
				});
				view1.add(img);
			}

		}

		var view2 = Ti.UI.createView({
			className : "row",
			height : "100%",
			width : "70%",
			layout : "vertical"
		});
		var row1 = Ti.UI.createView({
			className : "row",
			height : "50%",
			width : "100%"
		});

		var dataText = data[ii].bookingSeat + " " + (data[ii].bookingClass != "" ? "Class " + data[ii].bookingClass : "") + " " + data[ii].name + " " + data[ii].rop;

		var label1 = Ti.UI.createLabel({
			text : dataText,
			left : "0",
			bottom : "2px",
			color : "white",
			font : {
				fontSize : '18sp',
				fontFamily : 'arial',
				fontWeight : 'bold'
			}
		});
		row1.add(label1);

		var row2 = Ti.UI.createView({
			className : "row",
			height : "50%",
			width : "100%"
		});

		label1 = Ti.UI.createLabel({
			text : (data[ii].floor != "" ? data[ii].floor + " - " + data[ii].zone : ""),
			left : "0",
			top : "2px",
			color : "white",
			font : {
				fontSize : '16sp',
				fontFamily : 'arial'
			}
		});
		row2.add(label1);
		view2.add(row1);
		//add row 1 to view2
		view2.add(row2);

		checkBoxView.add(checkBoxImg);

		MainView.add(checkBoxView);
		//add row 2 to view2
		MainView.add(view1);
		//add view1 to MainView
		MainView.add(view2);
		//add view2 to MainView

		row.add(MainView);
		row.hasChild = false;
		tableData.push(row);

	}
	$.tableView.setData(tableData);
	model = null;
	data = null;
}

function PassengerListByName(data) {
	$.tableView.removeAllChildren();
	var tableData = [];
	for (var ii = 0; ii < data.length; ii++) {
		var row = Ti.UI.createTableViewRow({
			className : 'row',
			objName : 'row',
			touchEnabled : true,
			height : 100,
			passengerId : data[ii].id
		});
		var MainView = Ti.UI.createView({
			className : "row",
			height : "100%",
			width : "100%",
			layout : "horizontal",
			passengerId : data[ii].id
		});

		var checkBoxView = Ti.UI.createView({
			height : "100%",
			width : "10%",
		});

		var checkBoxImg = Ti.UI.createImageView({
			image : "images/btn_button_off.png",
			height : checkBoxView.width / 2,
			width : checkBoxView.width / 2 ,
		});

		var view1 = Ti.UI.createView({
			height : "100%",
			width : "15%"
		});
		var img = Ti.UI.createImageView({
			image : "images/ICON_NAME.png",
			height : "60px",
			width : "60px"
		});
		view1.add(img);
		var view2 = Ti.UI.createView({
			className : "row",
			height : "100%",
			width : "70%",
			layout : "vertical"
		});
		var row1 = Ti.UI.createView({
			className : "row",
			height : "50%",
			width : "100%"
		});

		var dataText = data[ii].name + " " + data[ii].rop + " " + data[ii].bookingSeat + " " + (data[ii].bookingClass != "" ? "Class " + data[ii].bookingClass : "");

		var label1 = Ti.UI.createLabel({
			text : dataText,
			left : "0",
			bottom : "2px",
			color : "white",
			font : {
				fontSize : '18sp',
				fontFamily : 'arial',
				fontWeight : 'bold'
			}
		});
		row1.add(label1);

		var row2 = Ti.UI.createView({
			className : "row",
			height : "50%",
			width : "100%"
		});

		label1 = Ti.UI.createLabel({
			text : (data[ii].floor != "" ? data[ii].floor + " - " + data[ii].zone : ""),
			left : "0",
			top : "2px",
			color : "white",
			font : {
				fontSize : '16sp',
				fontFamily : 'arial'
			}
		});
		row2.add(label1);
		view2.add(row1);
		//add row 1 to view2
		view2.add(row2);

		checkBoxView.add(checkBoxImg);

		MainView.add(checkBoxView);
		//add row 2 to view2
		MainView.add(view1);
		//add view1 to MainView
		MainView.add(view2);
		//add view2 to MainView

		row.add(MainView);

		row.hasChild = false;
		tableData.push(row);

	}
	$.tableView.setData(tableData);
	model = null;
	data = null;
}

function changeGroup(e) {
	clearSelected();
	arrayDataForReturn = [];
	var idRow = e.source.idType;
	var model = require('query_lib');
	$.search.value = "";
	if (idRow == "byRop") {
		$.byRop.backgroundColor = '#33ffffff';
		nameSort = "allrop";
		var model = require('query_lib');
		dataFromModel = model.getPassengerRopList(flightId);
		PassengerList(dataFromModel);

	} else if (idRow == "All") {
		$.All.backgroundColor = '#33ffffff';
		nameSort = "All";
		dataFromModel = model.getPassengerListByAll(flightId);
		PassengerList(dataFromModel);

	} else if (idRow == "bySeat") {
		$.bySeat.backgroundColor = '#33ffffff';
		nameSort = "bySeat";
		dataFromModel = model.getPassengerListBySortSeat(flightId);
		PassengerList(dataFromModel.sort(sortFnBySeat));
	} else if (idRow == "byName") {
		$.byName.backgroundColor = '#33ffffff';
		nameSort = "byName";
		dataFromModel = model.getPassengerListByName(flightId);
		PassengerListByName(dataFromModel);
	}
};

function first() {

	dataFromModel = model.getPassengerListByAll(flightId);
	PassengerList(dataFromModel);
	//$.All.backgroundColor = '#33ffffff';
	enalbleDisableButton();
}

function search1(textSearch) {
	filterDataFromModel = [];
	if (dataFromModel.length > 0) {
		for (var i = 0; i < dataFromModel.length; i++) {
			var status = false;
			var str = dataFromModel[i].rop + "," + dataFromModel[i].name + "," + dataFromModel[i].bookingSeat + "," + dataFromModel[i].bookingClass + "," + dataFromModel[i].floor + "," + dataFromModel[i].zone;
			str = (str.replace("null", "")).toLowerCase();
			if (str.indexOf(textSearch) > -1) {
				status = true;
			}
			if (status) {
				filterDataFromModel.push(dataFromModel[i]);
			}
		}

		if (nameSort == "byName") {
			PassengerListByName(filterDataFromModel);
		} else {
			PassengerList(filterDataFromModel);
		}

	}
}

function searchText(textSearch) {//Function Search
	search1(textSearch.trim().toLowerCase());
}

$.search.addEventListener('change', function(e) {
	arrayDataForReturn = [];
	if ($.search.value == "")//Back to List Before Search
	{
		statusSearch = false;
		if (nameSort == "byName") {
			PassengerListByName(dataFromModel);
		} else {
			PassengerList(dataFromModel);
		}

	} else {
		statusSearch = true;
		searchText($.search.value);
		//Call Function Search
	}

});

$.tableView.addEventListener('click', function(e) {

	e.row.selected = !e.row.selected;
	if (e.row.selected) {
		$.tableView.fireEvent('onrowselect', e);
	} else {
		$.tableView.fireEvent('onrowunselect', e);
	}
	enalbleDisableButton();
});

$.tableView.addEventListener('onrowselect', function(e) {

	if (statusSearch)
		arrayDataForReturn.push(filterDataFromModel[e.index]);
	else
		arrayDataForReturn.push(dataFromModel[e.index]);
	e.row.backgroundColor = '#33ffffff';
	e.row.children[0].children[0].children[0].image = 'images/btn_button_on.png';
	Ti.API.log('select' + e.index + "------------" + arrayDataForReturn.length);
});
$.tableView.addEventListener('onrowunselect', function(e) {

	if (statusSearch)
		removeArrayDataForReturn(filterDataFromModel[e.index].id);
	else
		removeArrayDataForReturn(dataFromModel[e.index].id);

	e.row.children[0].children[0].children[0].image = 'images/btn_button_off.png';
	e.row.backgroundColor = 'transparent';
	Ti.API.log('unselect' + e.index + "------------" + arrayDataForReturn.length);
});
function removeArrayDataForReturn(id) {
	for (var i = 0; i < arrayDataForReturn.length; i++) {
		if (arrayDataForReturn[i].id == id) {
			arrayDataForReturn.splice(i, 1);
		}
	}
}

function sortFnBySeat(a, b) {
	if (a.bookingSeat[a.bookingSeat.length - 1] < b.bookingSeat[b.bookingSeat.length - 1])
		return -1;
	if (a.bookingSeat[a.bookingSeat.length - 1] > b.bookingSeat[b.bookingSeat.length - 1])
		return 1;
	if (a.bookingSeat[a.bookingSeat.length - 1] == b.bookingSeat[b.bookingSeat.length - 1])
		return a.bookingSeat.slice(0, a.bookingSeat.length - 1) - b.bookingSeat.slice(0, b.bookingSeat.length - 1);
};

function clearSelected() {
	$.All.backgroundColor = "transparent";
	$.byName.backgroundColor = "transparent";
	$.bySeat.backgroundColor = "transparent";
	$.byRop.backgroundColor = "transparent";
}

function enalbleDisableButton() {
	if (arrayDataForReturn.length != 0) {
		tableData = [];
		tableData.push(createBtn("/images/submit.png", "SUBMIT", 'black'));
		$.submitBtnTable.setData(tableData);
		$.submitBtnTable.selectionStyle = 1;
		tableData = [];
		tableData.push(createBtn("/images/cancel.png", "CANCEL", 'black'));
		$.cancelBtnTable.setData(tableData);
		$.cancelBtnTable.selectionStyle = 1;
		tableData = null;
	} else {
		tableData = [];
		tableData.push(createBtn("/images/submit_gray.png", "SUBMIT", 'gray'));
		$.submitBtnTable.setData(tableData);
		$.submitBtnTable.selectionStyle = 'none';
		tableData = [];
		tableData.push(createBtn("/images/cancel_gray.png", "CANCEL", 'gray'));
		$.cancelBtnTable.setData(tableData);
		$.cancelBtnTable.selectionStyle = 'none';
		tableData = null;
	}
}
function createBtn(imgPathName, btnName, fontColor) {
    var btnId;
    var icon = $.UI.create("ImageView", {
        image : imgPathName,
        left : "15s%",
        height : 35,
        width : 35
    });
    var name = $.UI.create("Label", {
        text : btnName,
        left : "45%",
        height : 17,
        font : {
            fontWeight : "bold",
            fontSize : 17
        },
        color : fontColor
    });
    var row = $.UI.create("TableViewRow", {
        className : 'row',
        idType : btnName,
        selectedColor : 'transparent',
        scrollable : "false",
        separatorColor : "transparent",
        hasChild : 'false',
        height : "100%",
        selectedBackgroundColor : 'gray',
        //       touchEnabled : true
    });
    row.add(icon);
    row.add(name);

    row.addEventListener('click', function(e) {
        if (arrayDataForReturn.length != 0) {
            if (e.source.idType == undefined) {
                btnId = e.source.parent.idType;
            } else {
                btnId = e.source.idType;
            }
            if (btnId == "SUBMIT") {
                submitPassenger();
            } else if (btnId == "CANCEL") {
                cancelPassenger();
            }
        } else {
        }
    });
    return row;
}
function submitPassenger(){
	callBackFunction(arrayDataForReturn);
	$.passenger_multi_select.close();
}
function cancelPassenger(){
	arrayDataForReturn = [];
	if (statusSearch)//Back to List Before Search
	{
		if (nameSort == "byName") {
			PassengerListByName(filterDataFromModel);
		} else {
			PassengerList(filterDataFromModel);
		}

	} else {
		
		if (nameSort == "byName") {
			PassengerListByName(dataFromModel);
		} else {
			PassengerList(dataFromModel);
		}
	}
	
}

first();
//run first in page

if(OS_ANDROID){
	$.passenger_multi_win.addEventListener('android:back', function(e) {
	    Ti.API.info("Press Back button");
		$.passenger_multi_win.close();
	    
	});
}
