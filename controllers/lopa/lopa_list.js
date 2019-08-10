//**********************************************
//* Require
//**********************************************
var args = arguments[0] || {};
var query_lib = require('query_lib');
var utility_lib = require('utility_lib');
var lopa_lib = require('lopa_lib');
var component = require('component_lib');

//**********************************************
//* Variable Declaration
//**********************************************

var flightInformation = '';
var lopa = '';
var lopaList = '';
var lopaListAll = '';
var zoneLOPA;
var closeFlag = 0;
var passengerLopaList = [];
var availableLopaList = [];
var allLopaList = [];
var currentLopaList = [];
var isPostLayout = false;
var isSelectedSeat = false;
var enabledEventButton = true;
var currentIndex = 0;
var targetIndex = 20;
var initialTableSize = 0;
var currentSize = 0;
var isLoading = false;
var totalLoaded = 0;
var overlap = 50;
var listId;
var stackSelected = [];
var tempStackSelected = [];
var toEnabledButton = true;
var groupSelected = 'all';
var defaultColor = '#00000000';
var selectedColor = colorSelectedBtnHighlight;
var isSearching = false;
var openOptionalDialogue = false;
var clickedOnSearch = false;
var extraFontSize = 3;
//**********************************************
//* Function
//**********************************************

if(OS_ANDROID)
{
	$.tableViewBtn1.width = "33.5%";
	$.tableViewBtn2.width = "33.5%";
	$.tableViewBtn3.width = "33%";
	
	$.searchSec.height = utility_lib.dpiConverter(70);
	$.btnSelectZone.width = utility_lib.dpiConverter(75);
	$.btnSelectZone.height = utility_lib.dpiConverter(75);
	
	$.anActIndicatorView.hide();
	$.threeBtnGroup.top = 0;
	
	var softInput = Titanium.UI.Android.SOFT_INPUT_STATE_ALWAYS_HIDDEN | Ti.UI.Android.SOFT_INPUT_ADJUST_PAN;
	$.lopaListWindow.windowSoftInputMode = softInput;
	
	$.selectionHeaderView.height = "80";
	
	$.imageFlightLopa.left = "5";
	$.imageFloorLopa.left = "10";
	
	$.aircraft_type.left = "3";
	$.aircraft_type.font = {
		fontSize : Alloy.Globals.d_17pt,
		fontWeight : "bold"
	};
	
	$.aircraftRegistration.left = "3";
	$.aircraftRegistration.font = {
		fontSize : Alloy.Globals.d_17pt,
		fontWeight : "bold"
	};
	
	$.titleName.left = "3";
	$.titleName.font = {
		fontSize : Alloy.Globals.d_14pt,
		fontWeight : "bold"
	};
	
	$.imageFlightLopa.width = "35";
	$.imageFloorLopa.width = "35";
	$.leftHeaderView.width = "50%";
	
	$.leftTextLine.top = 0;
	$.leftTextLine.left = "5";
	$.leftTextLine.width = "220";
	
	$.titleLabel.font = {
		fontSize : Alloy.Globals.d_17pt,
		fontWeight : "bold"
	};
	
	$.total.font = {
		fontSize : Alloy.Globals.d_17pt,
		fontWeight : "bold"
	};
	
	$.currentPax.font = {
		fontSize : Alloy.Globals.d_17pt,
		fontWeight : "bold"
	};
	
	$.totalPA.font = {
		fontSize : Alloy.Globals.d_17pt,
		fontWeight : "bold"
	};
		
	
	$.allLabel.font = {
		fontSize : Alloy.Globals.d_17pt,
		fontWeight : "bold"
	};
	
	$.passengerLabel.font = {
		fontSize : Alloy.Globals.d_17pt,
		fontWeight : "bold"
	};
	
	$.availableLabel.font = {
		fontSize : Alloy.Globals.d_17pt,
		fontWeight : "bold"
	};
	
}

if(OS_IOS)
{
	$.anActIndicatorView.hide();
}

function changeClearFloorZone() {

	toEnabledButton = true;
	clearValue();
	disableButtons();

}

function initializeLOPATable() {
	
	$.tableViewBtn1.backgroundColor = defaultColor;
	$.tableViewBtn2.backgroundColor = defaultColor;
	$.tableViewBtn3.backgroundColor = defaultColor;
	
	
	passengerLopaList = [];
	availableLopaList = [];
	allLopaList = [];

	allLopaList = lopaList;
	currentLopaList = allLopaList;
	
	for (var i = 0; i < lopaList.length; i++) {
		if (!(utility_lib.isEmpty(lopaList[i].name))) {
			passengerLopaList.push(lopaList[i]);
		}
	}
	passengerLopaList.sort(lopa_lib.sortByClass);
	for (var i = 0; i < lopaList.length; i++) {
		if ((utility_lib.isEmpty(lopaList[i].name))) {
			availableLopaList.push(lopaList[i]);
		}
	}

	grouping();
	
}

function searchingLOPATable(searchText) {

	var searchedList = [];
	var searchRender = [];
	var criteria = '';
	
	for (var index = 0; index < currentLopaList.length; index++) {
		var status = false;
		criteria = currentLopaList[index].name + ',' + currentLopaList[index].rop + ',' + currentLopaList[index].bookingSeat;
		var replacedCriteria = criteria.replace("null", "");
		if (replacedCriteria.trim().toLowerCase().indexOf(searchText) > -1) {
			status = true;
		}
		if (status) {
			searchedList.push(currentLopaList[index]);
		}
	}

	searchRender = drawTable(searchedList);
	return searchRender;
}

function drawTable(paraLopaList) {

	var tableData = [];
	for (var i = 0; i < paraLopaList.length; i++) {

		var classText = '';
		if (paraLopaList[i].bookingClass != "") {
			classText = "Class" + " " + paraLopaList[i].bookingClass;
		} else {
			classText = '';
		}
		var pax = paraLopaList[i].bookingSeat + " " + classText + " " + paraLopaList[i].name + "  " + paraLopaList[i].rop;

		var pos = paraLopaList[i].floor + " - " + "Zone" + paraLopaList[i].zone;

		var buttonIconPath = '/images/btn_button_off.png';
		var ropImagePath = '/images/ic_seat.png';

		var ropImage;
		if (paraLopaList[i].name.length > 0) {
			ropImagePath = '';
			if (paraLopaList[i].rop.toLowerCase().indexOf('gold') > -1) {
				ropImagePath = '/images/rop_gold.png';
				if(OS_ANDROID)
				{
					ropImagePath = '/images/rop_gold_resized.png';	
				}
				ropImage = $.UI.create("ImageView", {
					classes : ['viewPaxImageRop'],
					image : ropImagePath
				});
				
				if(OS_ANDROID)
				{
					ropImage.width = utility_lib.dpiConverter(80);
					ropImage.height = utility_lib.dpiConverter(50);
				}
				//lowercase.
			} else if (paraLopaList[i].rop.toLowerCase().indexOf('platinum') > -1) {
				ropImagePath = '/images/rop_platinum.png';
				if(OS_ANDROID)
				{
					ropImagePath = '/images/rop_platinum_resized.png';	
				}
				ropImage = $.UI.create("ImageView", {
					classes : ['viewPaxImageRop'],
					image : ropImagePath
				});
				if(OS_ANDROID)
				{
					ropImage.width = utility_lib.dpiConverter(80);
					ropImage.height = utility_lib.dpiConverter(50);
				}
			} else if (paraLopaList[i].rop.toLowerCase().indexOf('silver') > -1) {
				ropImagePath = '';

				ropImage = $.UI.create("ImageView", {
					classes : ['viewPaxImageRop'],
					image : ropImagePath
				});
				if(OS_ANDROID)
				{
					ropImage.width = utility_lib.dpiConverter(80);
					ropImage.height = utility_lib.dpiConverter(50);
				}
			} else if (paraLopaList[i].rop.toLowerCase().indexOf('basic') > -1) {
				ropImagePath = '';

				ropImage = $.UI.create("ImageView", {
					classes : ['viewPaxImageRop'],
					image : ropImagePath
				});
				if(OS_ANDROID)
				{
					ropImage.width = utility_lib.dpiConverter(80);
					ropImage.height = utility_lib.dpiConverter(50);
				}
			} else {
				ropImagePath = '';
				ropImage = $.UI.create("ImageView", {

					classes : ['viewPaxImageRop'],
					image : ropImagePath
				});
				if(OS_ANDROID)
				{
					ropImage.width = utility_lib.dpiConverter(80);
					ropImage.height = utility_lib.dpiConverter(50);
				}
			}
		} else {
			ropImage = $.UI.create("ImageView", {
				classes : ['viewPaxImageNoRop'],
				image : ropImagePath
			});
			
			if(OS_ANDROID)
			{
				ropImage.width = utility_lib.dpiConverter(50);
				ropImage.height = utility_lib.dpiConverter(50);
			}
		}


		var checkedIndex = stackSelected.indexOf(paraLopaList[i].bookingSeat);
		if (checkedIndex > -1) {
			buttonIconPath = '/images/btn_button_on.png';
		}

		var view = Ti.UI.createView({
			textAlign : Ti.UI.TEXT_ALIGNMENT_LEFT,
			left : '0',
			width : '80',
			height : '80',
			type : 'view',
		});
		
		if(OS_ANDROID)
		{
			view.width = utility_lib.dpiConverter(80);
			view.height = utility_lib.dpiConverter(80);
		}

		var checkImage = $.UI.create("ImageView", {
			classes : ['viewPaxImage'],
			image : buttonIconPath,
			type : 'check'

		});
		
		if(OS_ANDROID)
		{
			checkImage.width = utility_lib.dpiConverter(50);
			checkImage.height = utility_lib.dpiConverter(50);
		}

		var paxName;
		var zone;
		
		if(OS_IOS)
		{
			paxName = $.UI.create("Label", {
				classes : ['fontBold20', 'viewPax'],
				text : pax,
				type : 'label',
				minimumFontSize : 7,
				height : 'auto',
				width : 'auto'
			});
			
			zone = $.UI.create("Label", {
				classes : ['fontLight16', 'viewPos'],
				text : pos,
				type : 'label'
			});
		}
		
		if(OS_ANDROID)
		{
			paxName = $.UI.create("Label", {
				classes : ['fontBold20', 'viewPax'],
				text : pax,
				type : 'label',
				minimumFontSize : 7,
				height : 'auto',
				width : 'auto'
			});	
			
			paxName.left = utility_lib.dpiConverter(200);
			
			paxName.font = {
				fontSize : Alloy.Globals.d_17pt,
				fontWeight : "bold"
			};
			
			paxName.minimumFontSize = utility_lib.dpiConverter(7);
			paxName.top = utility_lib.dpiConverter(15);
			zone = $.UI.create("Label", {
				classes : ['fontLight16', 'viewPos'],
				text : pos,
				type : 'label'
			});
			zone.top = utility_lib.dpiConverter(65);
			
			zone.left = utility_lib.dpiConverter(200);
		}
		
		var typeConverted = lopa_lib.typeConvertFunction(paraLopaList[i].type);
		var row = $.UI.create("TableViewRow", {
			id : paraLopaList[i].id,
			typeC : typeConverted,
			position : paraLopaList[i].bookingSeat,
			bool_checked : false,
			className : 'row',
			hasChild : true,
			backgroundSelectedColor : '#dcdcdc',
			height : '80',
			type : 'tableRow'

		});

		view.add(checkImage);

		row.backgroundSelectedColor = colorSeparatorTableRow;
		row.add(view);
		row.add(checkImage);
		row.add(ropImage);
		row.add(paxName);
		row.add(zone);

		checkImage.addEventListener('touchstart', function(e) {
			checkBoxSelection(e.source, e.source.parent);
		});
		row.addEventListener('click', function(e) {
			var rowObj = e.source;
			if (rowObj.type == "check" || rowObj.type == "view") {
				return;
			}

			if (e.source.type != "tableRow") {
				rowObj = e.source.parent;
			} else {
				rowObj = e.source;
			}

			var detailView;
			var isPaxOnSeat = query_lib.issetPaxLopa(rowObj.id);
			
			if(OS_ANDROID)
			{
				$.anActIndicatorView.show();
			}
			
			if (isPaxOnSeat) {
				detailView = Alloy.createController("passengers/passenger_detail", {
					LOPAPositionId : rowObj.id,
                    LOPAPositionPos : rowObj.position
				}).getView();
			} else {
				detailView = Alloy.createController("equipments/seat_detail", {
					LOPAPositionId : rowObj.id,
                    LOPAPositionPos : rowObj.position,
					LOPAPositionType : rowObj.typeC
				}).getView();
			}

			if (OS_IOS) {

				Alloy.Globals.navGroupWin.openWindow(detailView);

			} else {
				detailView.open();
			}
			clearValue();
			disableButtons();
			if(!isSearching){
				resetSearchTextBar();
			}else{
				$.custom_searchbar.customSearchBar.blur();
			}
			
		});
		tableData.push(row);
	}
	paraLopaList = null;
	return tableData;
	$.lopaItem.addEventListener('click', function(e) {
	 	$.custom_searchbar.customSearchBar.blur();
	});
}

function checkBoxSelection(image, parent) {

	for (var index = 0; index < stackSelected.length; index++) {
		if (stackSelected[index] == parent.position) {
			image.image = '/images/btn_button_off.png';
			stackSelected.splice(index, 1);
			tempStackSelected[index].image = '/images/btn_button_off.png';
			tempStackSelected.splice(index, 1);
			if (stackSelected.length <= 0) {
				disableButtons();
			}
			return;
		}
	}
	
	image.image = '/images/btn_button_on.png';
	
	if (toEnabledButton) {
		enableButtons();
	}
	stackSelected.push(parent.position);
	tempStackSelected.push(image);
}

function changeGroup(e) {
	$.tableViewBtn1.backgroundColor = defaultColor;
	$.tableViewBtn2.backgroundColor = defaultColor;
	$.tableViewBtn3.backgroundColor = defaultColor;
	closeFlag = 1;
	var btnId;
	
	if (e.source.idType == undefined) {
		btnId = e.source.parent.idType;
	} else {
		btnId = e.source.idType;
	}
	groupSelected = btnId;
	grouping();
}

function grouping() {
	$.lopaItem.setData([]);
	clearValue();

	
	//$.tableViewBtn1.backgroundColor = defaultColor;
	//$.tableViewBtn2.backgroundColor = defaultColor;
	//$.tableViewBtn3.backgroundColor = defaultColor;

	if (groupSelected == 'all') {
		$.tableViewBtn1.backgroundColor = defaultColor;
		$.tableViewBtn2.backgroundColor = defaultColor;
		$.tableViewBtn3.backgroundColor = defaultColor;
		
		currentLopaList = allLopaList;
		setTimeout(function() {
			$.tableViewBtn1.backgroundColor = selectedColor;
			$.tableViewBtn2.backgroundColor = defaultColor;
			$.tableViewBtn3.backgroundColor = defaultColor;

		}, 100);

	} else if (groupSelected == 'byPassenger') {

		currentLopaList = passengerLopaList;
		$.tableViewBtn1.backgroundColor = defaultColor;
		$.tableViewBtn2.backgroundColor = defaultColor;
		$.tableViewBtn3.backgroundColor = defaultColor;
		setTimeout(function() {

			$.tableViewBtn1.backgroundColor = defaultColor;
			$.tableViewBtn2.backgroundColor = selectedColor;
			$.tableViewBtn3.backgroundColor = defaultColor;

		}, 100);

	} else if (groupSelected == 'byAvailable') {

		currentLopaList = availableLopaList;
		$.tableViewBtn1.backgroundColor = defaultColor;
		$.tableViewBtn2.backgroundColor = defaultColor;
		$.tableViewBtn3.backgroundColor = defaultColor;
		setTimeout(function() {

			$.tableViewBtn1.backgroundColor = defaultColor;
			$.tableViewBtn2.backgroundColor = defaultColor;
			$.tableViewBtn3.backgroundColor = selectedColor;

		}, 100);
	}
	
	resetSearchTextBar();
	$.lopaItem.setData(drawTable(currentLopaList));

	disableButtons();
	if(OS_IOS)
	{
		Alloy.Globals.activityIndicator.hide();	
	}
	if(OS_ANDROID)
	{
		//Alloy.Globals.anActIndicatorView.hide();
		$.anActIndicatorView.hide();
		clickedOnSearch = false;
	}

}


function renderTitleView(titleStr) {
	$.titleLabel.text = "";
	setTimeout(function() {
		$.titleLabel.text = titleStr;
	}, 100);
}

function searching() {
	
	$.custom_searchbar.customSearchBar.addEventListener("change", function(e) {
			if(OS_ANDROID){
				if(!clickedOnSearch)
				{
					return;
				}	
			}
			
		$.lopaItem.setData(searchingLOPATable(e.value.trim().toLowerCase()));
		$.custom_searchbar.clearTextBtn.show();
		$.custom_searchbar.customSearchBar.hintText = "";
		if (e.value.length == 0) {
			isSearching = false;
		} else if (e.value.length >= 1) {
			isSearching = true;
		}
	});
}

function resetSearchTextBar() {

	$.custom_searchbar.customSearchBar.value = '';
	$.custom_searchbar.customSearchBar.blur();
	$.custom_searchbar.clearTextBtn.hide();
	$.custom_searchbar.customSearchBar.hintText = "(Name), (ROP), (Seat)";

}

function cleanUp() {

	args = null;
	listId = null;
	searchText = null;
	tableData = null;
	lopaList = null;
	stackSelected = null;
	tempStackSelected = null;
}

function clearValue() {
	resetSelectedItem();
	stackSelected = [];
	tempStackSelected = [];

}

function resetSelectedItem() {

	for (var index = 0; index < tempStackSelected.length; index++) {
		tempStackSelected[index].image = '/images/btn_button_off.png';
	}
}

function createIncidentFunction() {
    closeFlag = 1;
    if(enabledEventButton){
        var data = [];
        data = component.incidentCategoryData();
        var tableData = [];
    
        var isPax = false;
        var noPax = false;
        var paxQr = null;
    
        if (stackSelected != null && stackSelected.length > 0) {
            for (var i = 0; i < stackSelected.length; i++) {
                paxQr = query_lib.getPassengerDetailByLopaPosition(stackSelected[i]);
                if (paxQr != null) {
                    isPax = true;
                } else {
                    noPax = true;
                }
            }
        }
        
        var rowNum = 6;
        if(stackSelected.length > 0) {
            if (isPax && !noPax) {
                if(OS_IOS){
                	data.remove(4);
                	data.remove(2);
               		data.remove(1);
               	}
                data.splice(4,1);
                data.splice(2,1);
                data.splice(1,1);
                rowNum = 3;
                optionDialogHeight = "70%";
            } else if(isPax && noPax){
                rowNum = 4;
                optionDialogHeight = "60%";
                if(OS_IOS){
                	data.remove(4);
               		data.remove(1);
               	}
                data.splice(4,1);
                data.splice(1,1);
            } else if(!isPax && noPax){
                if(OS_IOS){
                	data.remove(4);
                	data.remove(1);
                	data.remove(0);   
                }
                data.splice(4,1);
                data.splice(1,1);
                data.splice(0,1);   
                rowNum = 3;             
                optionDialogHeight = "70%";
            }                   
        } else {
            rowNum = 6;             
            optionDialogHeight = "50%";            
        }
    
        for (var i = 0; i < data.length; i++) {
            tableData.push(createOptionalIncidentCateBtn(data[i], i, isPax, rowNum));
        }
    
        var win2 = component.createOptionDialogWindow(tableData, optionDialogHeight);
        data = null;
        tableData = null;
    
        win2.open();
        closeFlag = 1;
        
        win2.addEventListener("click", function(e) {
        	openOptionalDialogue = false;
            win2.close();
        });
        
        if(OS_ANDROID){
		win2.addEventListener('android:back', function(e) {
				openOptionalDialogue = false;
				win2.close();	
			});
		}
    }
}

//* Dialog option for selecting incident category to create the new incident
function createOptionalIncidentCateBtn(dataAgr, indexArg, isPaxArg, rowNumArg) {
    var btnId = dataAgr[0];
    var btnName = dataAgr[1];
    var imgPathName = dataAgr[2];
    var pagePath;
    var textColor;
    var isPax = isPaxArg;
    var rowNum = rowNumArg;
    
    textColor = null;
    var row = component.createOptionDialogBtn(btnId, rowNum);
    row.add(component.createIcon(imgPathName, "7%"));

    if (btnId == EMERGENCY)
        row.add(component.createLabel(btnName + " (ALL TYPES)", "17%", textColor));
    else
        row.add(component.createLabel(btnName, "17%", textColor));

    row.addEventListener("click", function(e) {
        if (e.source.id == undefined || e.source.idType == "btnRow") {
            if (e.source.parent.id == undefined) {
                btnId = e.source.id;
            } else {
                btnId = e.source.parent.id;
            }
        }

        if (btnId == EMERGENCY) {
            pagePath = "incidents/emergency_category";
        } else {
            pagePath = "incidents/incident_detail";
        }
            closeFlag = 4;
            if(OS_ANDROID)
			{
				$.anActIndicatorView.show();
			}
            Alloy.Globals.initializeApp = false;
            var incidentDetail = Alloy.createController(pagePath, {
                incidentCate : btnId,
                isNew : true,
                incidentId : "",
                type : "",
                lopaPos : stackSelected,
                paxConcern : isPax ? null : NOT_CONCERN_PAX
            }).getView();
            if (OS_IOS) {

                Alloy.Globals.navGroupWin.openWindow(incidentDetail);
            } else {

                incidentDetail.open();
            }
            clearValue();
            disableButtons();            
            isSingleSelection = true;
    });

    btnId = null;
    pagePath = null;
    btnName = null;
    imgPathName = null;
    return row;
}

function createOptionalBtn(dataAgr , indexArg) {
    var btnId = dataAgr[0];
    var btnName = dataAgr[1];
    var imgPathName = dataAgr[2];
    var pagePath;
    var textColor;
    
    if(indexArg == 1 || indexArg == 4) textColor = "gray"; else textColor = null;
    var row = component.createOptionDialogBtn(btnId, 6);
    row.add(component.createIcon(imgPathName, "7%"));
    
    if (btnId == EMERGENCY) 
        row.add(component.createLabel(btnName+" (ALL TYPES)", "17%",textColor));
    else
        row.add(component.createLabel(btnName, "17%",textColor));

    row.addEventListener("click", function(e) {
        if (e.source.id == undefined || e.source.idType == "btnRow") {
            if (e.source.parent.id == undefined) {
                btnId = e.source.id;
            } else {
                btnId = e.source.parent.id;
            }
        }
        if (btnId == EMERGENCY) {
            pagePath = "incidents/emergency_category";
        } else {
            pagePath = "incidents/incident_detail";
        }
        if (btnId == SERVICE_EQUIPMENT || btnId == OTHER) {
        	closeFlag = 1;
           component.alertUnderConstruction();
        } else {
			closeFlag = 4;
			if(OS_ANDROID)
			{
				$.anActIndicatorView.show();
			}
			var incidentDetail = Alloy.createController(pagePath, {
				incidentCate : btnId,
				isNew : true,
				incidentId : "",
				type : "",
			}).getView();
			
			if (OS_IOS) {
					Alloy.Globals.navGroupWin.openWindow(incidentDetail);
				} else {
					incidentDetail.open();
			}
		}
    });
    
    btnId = null;
    pagePath = null;
    btnName = null;
    imgPathName = null;
    return row;
}

function cancelFunction() {
	clearValue();
	disableButtons();
}

function enableButtons() {
	$.buttonCancel.image = "/images/btn_cancel_act.png";
	$.buttonCreateIncident.image = "/images/btn_create_incident_act.png";
	enabledEventButton = true;
	toEnabledButton = false;
	
}

function disableButtons() {
	$.buttonCancel.image = "/images/btn_cancel_dis.png";
	$.buttonCreateIncident.image = "/images/btn_create_incident_dis.png";

	enabledEventButton = false;
	toEnabledButton = true;
}

function initializeTitle()
{
	try {
		
		if(OS_ANDROID){
			
			$.buttonCreateIncident.width = "60%";
			$.buttonCancel.width = "60%";
			$.custom_searchbar.customSearchBar.blur();
			
		}
		
		flightInformation = query_lib.getFlight(currentFlightId); 
		if(flightInformation.flightNumber && flightInformation.airModel && flightInformation != ''){
			lopa = query_lib.getLOPA(flightInformation.id);
		
			lopa.sort(lopa_lib.sortFnByfloor);
			lopaList = query_lib.getPassengerListLopa(Alloy.Globals.lopaId);
			zoneLOPA = query_lib.getOneLOPA(Alloy.Globals.lopaId);
			$.custom_searchbar.clearTextBtn.hide();
			$.custom_searchbar.customSearchBar.hintText = "(Name), (ROP), (Seat)";
			$.total.text = 'Total :';		
			$.aircraft_type.text = flightInformation.flightNumber + ' ' + flightInformation.airModel;
			$.aircraftRegistration.text = flightInformation.aircraftRegistration;
			$.currentPax.text = query_lib.getByZonePassengers(Alloy.Globals.lopaId);
			$.totalPA.text = "(" + query_lib.getByZoneSeats(Alloy.Globals.lopaId) + ")";
			var sum = query_lib.getCountIncidentPerZone(Alloy.Globals.lopaId);
			var incidentText = "Total Incident : ";
			if(sum > 1)
			{
				incidentText = "Total Incidents : ";
			}
						
			renderTitleView(zoneLOPA.floor + '-' + 'Zone' + zoneLOPA.zone, zoneLOPA.cclass);
		
			$.tableViewBtn1.backgroundColor = defaultColor;
			$.tableViewBtn2.backgroundColor = defaultColor;
			$.tableViewBtn3.backgroundColor = defaultColor;
			
			$.titleName.setText(lopa_lib.getCrewUser());
			
		
			disableButtons();
			$.lopaListWindow.backgroundImage = bgGeneral;
			$.lopaItem.applyProperties({
				separatorColor : colorSeparatorTableRow
			});
			searching();
			initializeLOPATable();
			
			$.buttonCancel.addEventListener('click', cancelFunction);
			$.buttonCreateIncident.addEventListener('click', createIncidentFunction);
			
		}
		
	}catch(e)
	{
		if(OS_IOS){
			Alloy.Globals.activityIndicator.hide();	
		}
	}
}

function closeOptionalDialogue ()
{
	openOptionalDialogue = false; 
}

function lazyload(_evt) {
	$.custom_searchbar.customSearchBar.hintText = "(Name), (ROP), (Seat)";
}



function actionEvent(e, window) {
	
	
	closeFlag = 1;

	var btnId_temp;
	if (e.source.idType == "cancel") {
		window.close();
		return;
	}

	if (e.source.idType == undefined) {
		btnId_temp = e.source.parent.idType;
	} else {
		btnId_temp = e.source.idType;
	}

	if (Alloy.Globals.lopaId == btnId_temp) {
		window.close();
		return;
	}

	Alloy.Globals.lopaId = btnId_temp;
	if(OS_IOS)
	{
		Alloy.Globals.activityIndicator.show();	
	}
	
	
	$.tableViewBtn1.backgroundColor = defaultColor;
	$.tableViewBtn2.backgroundColor = defaultColor;
	$.tableViewBtn3.backgroundColor = defaultColor;
	
	if(OS_ANDROID)
	{
		//Alloy.Globals.anActIndicatorView.show();
		$.anActIndicatorView.show();
	}
	
	setTimeout(function() {
		lopaList = [];
		stackSelected = [];
		tempStackSelected = [];
		passengerLopaList = [];
		availableLopaList = [];
		allLopaList = [];
	 	currentLopaList = [];
		
		lopaList = query_lib.getPassengerListLopa(Alloy.Globals.lopaId);
		zoneLOPA = query_lib.getOneLOPA(Alloy.Globals.lopaId);
		renderTitleView(zoneLOPA.floor + '-' + 'Zone' + zoneLOPA.zone, zoneLOPA.cclass);
		
		initializeLOPATable();
		changeClearFloorZone();
		
		enabledEventButton = false;
		
		$.currentPax.text = query_lib.getByZonePassengers(Alloy.Globals.lopaId);
		$.totalPA.text = "(" + query_lib.getByZoneSeats(Alloy.Globals.lopaId) + ")";
		var sum = query_lib.getCountIncidentPerZone(Alloy.Globals.lopaId);
		var incidentText = "Total Incident : ";
		if(sum > 1)
		{
			incidentText = "Total Incidents : ";
		}
		
		if(OS_ANDROID)
		{
			$.anActIndicatorView.hide();
		}
		closeFlag = 0;
	}, 50);

	resetSearchTextBar();
	stackSelected = [];
	tempStackSelected = [];
	clearValue();
	window.close();
}

//**********************************************
//* Main
//**********************************************

initializeTitle();

$.custom_searchbar.clearTextBtn.addEventListener('click', function() {
	
	resetSearchTextBar();
	toEnabledButton = true;
	clearValue();
	disableButtons();
	$.lopaItem.setData(drawTable(currentLopaList));
	$.custom_searchbar.clearTextBtn.hide();
	isSearching = false;
	$.custom_searchbar.customSearchBar.hintText = "(Name), (ROP), (Seat)";
	if(OS_ANDROID)
	{
		$.custom_searchbar.customSearchBar.setTouchEnabled = true;
		clickedOnSearch = false;
	}
});

$.custom_searchbar.customSearchBar.addEventListener('return', function(e) {
	
	if($.custom_searchbar.customSearchBar.value == ''){
		$.custom_searchbar.customSearchBar.hintText = "(Name), (ROP), (Seat)";
		$.custom_searchbar.clearTextBtn.hide();
	}
	
	
});


$.tableViewBtn1.addEventListener('click', function(e){
	if(OS_IOS)
	{
		Alloy.Globals.activityIndicator.show();	
	}
	
	if(OS_ANDROID)
	{
		$.anActIndicatorView.show();
		$.custom_searchbar.customSearchBar.blur();
	}
	
	setTimeout(function(){
		changeGroup(e);
	},300);
});

$.tableViewBtn2.addEventListener('click', function(e){
	if(OS_IOS)
	{
		Alloy.Globals.activityIndicator.show();	
	}
	if(OS_ANDROID)
	{
		$.anActIndicatorView.show();
		$.custom_searchbar.customSearchBar.blur();
		
	}
	setTimeout(function(){
		changeGroup(e);
	},300);
});
$.tableViewBtn3.addEventListener('click', function(e){
	if(OS_IOS)
	{
		Alloy.Globals.activityIndicator.show();	
	}
	if(OS_ANDROID)
	{
		$.anActIndicatorView.show();
		$.custom_searchbar.customSearchBar.blur();
	}
	setTimeout(function(){
		changeGroup(e);
	},300);
});

$.lopaListWindow.touchEnabled = false;
$.lopaItem.addEventListener('postlayout', function() {
	if(!isPostLayout){
		setTimeout(function() {	
			$.lopaListWindow.touchEnabled = true;
		},300);	
		isPostLayout = true;
	}
});

$.lopaListWindow.addEventListener('blur', function(e) {

	if (closeFlag != 0) {
		closeFlag = 0;
		return;
	}
	
	if(OS_IOS)
	{
		Alloy.Globals.activityIndicator.show();	
	}
	setTimeout(function() {
		if(OS_IOS)
		{
			Alloy.Globals.activityIndicator.hide();	
		}
		
		
	}, 500);
});

$.custom_searchbar.customSearchBar.addEventListener('click', function(e)
{
	$.custom_searchbar.customSearchBar.hintText = "";
	$.custom_searchbar.clearTextBtn.show();
	if(OS_ANDROID){
		clickedOnSearch = true;
		$.custom_searchbar.customSearchBar.setTouchEnabled = false;	
	}
	
});

//Deconstructor
$.cleanUp = function() {
	listId = null;
	searchText = null;
	tableData = null;
	lopaList = null;
	//isSingleSelection = null;
	stackSelected = null;
	tempStackSelected = null;
	groupSelected = null;
};

$.btnSelectZone.addEventListener("click", function(e) {
	
	if(OS_ANDROID){
        if(!openOptionalDialogue){
        	openOptionalDialogue = true;
        }
        else{
        	return;
        }
    }
	
	closeFlag = 1;
	var lopaTemp = lopa;
	
	if(OS_ANDROID)
	{
		$.btnSelectZone.backgroundColor = '#80d3d3d3';
		
	}
	
	if(OS_IOS){
		Alloy.Globals.activityIndicator.show();	
	}
	
	setTimeout(function() {
		lopa_lib.showDialogueFunction(lopaTemp, actionEvent, closeOptionalDialogue);
		if(OS_IOS){
			Alloy.Globals.activityIndicator.hide();
		}
		if(OS_ANDROID)
		{
			$.btnSelectZone.backgroundColor = '#00d3d3d3';
			
		}
	}, 5);
	
});

if(OS_ANDROID){
	$.lopaListWindow.addEventListener('android:back', function(e) {
	    Ti.API.info("Press Back button");
	    passengerLopaList = null;
		availableLopaList = null;
		allLopaList = null;
		currentLopaList = null;
		$.lopaItem = null;
		$.lopaListWindow.close();
	    $.anActIndicatorView.show();
	});
	
	$.lopaListWindow.addEventListener('focus', function(e) {
	    Ti.API.info("Press Back button");
	   	
	    $.anActIndicatorView.hide();
	});
}
