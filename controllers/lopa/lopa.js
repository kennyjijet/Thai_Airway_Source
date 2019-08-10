//**********************************************
//* Main *//
//**********************************************
var args = arguments[0] || {};
var isPostedLayout = false;
var query_lib = require('query_lib');
var lopa_lib = require('lopa_lib');
var utility_lib = require('utility_lib');
var component = require('component_lib');
var lopaWindow = '';
var optionDialogHeight = "50%";
var flightInformation;
var lopa = '';
var lopaPosition;
var gapCol = 0;
var gapRow = 0;
var plusValue = 0;
var countAllIncident = 0;
var typeTemp = '';
var closeFlag = 0;
var enabledEventButton = false;
var dialog = '';
var isSingleSelection = true;
var stackSelected = [];
var tempStackSelected = [];
var lopaPosition = '';
var incidentData = [];
var incidentDataLAVG = [];
var imagePathSelected = '/images/select.png';
var toEnabledButton = true;
var intializedLOPA = false;
var zoneLOPA = '';
var maxColLopa = '';
var lopaTemp = '';
var floor = '';
var zone = '';
var helpTexts = ["OCCUPIED", "AVAILABLE", "TECHNICAL BLOCKED", "MALFUNCTION", "ROP GOLD", "ROP PLATINUM", "ROP GOLD BLOCKED", "ROP PLATINUM BLOCKED", "OCCUPIED BLOCKED", "ROP GOLD MALFUNCTION", "ROP PLATINUM MALFUNCTION", "OCCUPIED MALFUNCTION", "INTERNAL BLOCKED", "SELECT", "INCIDENT"];
var lopa = '';
Alloy.Globals.initializeApp = true;
Alloy.Globals.lopaId = '';
var lopaIdTemp = '';
var openOptionalDialogue = false;
var openNewView = false;
var win2;
var posExtracted = [];

if (OS_ANDROID) {

	$.showHelp.width = utility_lib.dpiConverter(40);
	$.showHelp.height = utility_lib.dpiConverter(40);
	$.showLopaList.width = utility_lib.dpiConverter(40);
	$.showLopaList.height = utility_lib.dpiConverter(40);

	$.btnSelectZone.width = utility_lib.dpiConverter(75);
	$.btnSelectZone.height = utility_lib.dpiConverter(75);
	$.gapper.height = utility_lib.dpiConverter(50) + '%';
	
	$.selectionHeaderView.height = "80";
	
	$.imageFlightLopa.left = "5";
	$.imageFloorLopa.left = "10";

	$.imageFlightLopa.width = "35";
	$.imageFloorLopa.width = "35";
	$.leftHeaderView.width = "50%";
	
	
	
	$.aircraft_type.top = "0";
	$.aircraftRegistration.top = "0";
	$.titleName.top = "0";
	
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
	
	$.leftTextLine.top = 0;
	$.leftTextLine.left = "5";
	$.leftTextLine.width = "220";
	

	$.titleLabel.top = 0;
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
	
	
	//$.rightTextLine.top = 0;
	//$.rightTextLine.left = "0";
	//$.rightTextLine.width = "1000";

	$.anActIndicatorView.hide();
}

function renderNotificationIncident() {
	var imageIncident = Titanium.UI.createView({
		backgroundImage : '/images/ic_incident_lopa.png',
		width : utility_lib.dpiConverter(26),
		height : utility_lib.dpiConverter(25),
		top : utility_lib.dpiConverter(8),
		type : 'incident'
	});
	return imageIncident;
}

function init() {
	clearRendering();
	if (!intializedLOPA) {
		isSingleSelection = true;
		$.multiple_selection_widget.msMultiSelection.image = '/images/btn_multipleselection_act.png';
		$.multiple_selection_widget.buttonRight.image = '/images/btn_cancel_dis.png';

		if (OS_ANDROID) {
			$.multiple_selection_widget.msMultiSelection.width = "60%";
			$.multiple_selection_widget.buttonRight.width = "60%";
		}

		flightInformation = query_lib.getFlight(currentFlightId);
		intializedLOPA = true;
		acReg = flightInformation.aircraftRegistration;

		if (lopa == '') {
			lopa = query_lib.getLOPA(flightInformation.id);
			if (lopa.length <= 0) {
				return;
			}
			lopa.sort(lopa_lib.sortFnByfloor);
			zoneLOPA = lopa[0];
			Alloy.Globals.lopaId = zoneLOPA.id;
		}
	}
	if (flightInformation != '') {
		if (OS_IOS) {
			$.lopaWindow.rightNavButton = $.UI.create('Button', {
				title : 'Create Incident'
			});
			$.lopaWindow.rightNavButton.addEventListener('click', createIncidentFunction);
		}

		if (OS_ANDROID) {
			$.lopaWindow.activity.onCreateOptionsMenu = function(e) {
				var menu = e.menu;
				var menuItem = menu.add({
					title : "Create Incident",
					showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM
				});
				menuItem.addEventListener("click", function(e) {
					createIncidentFunction();
				});
			};

		}

		$.multiple_selection_widget.msMultiSelection.image = '/images/btn_multipleselection_act.png';
		$.multiple_selection_widget.buttonRight.image = '/images/btn_cancel_dis.png';

		$.multiple_selection_widget.msMultiSelection.addEventListener('click', changeModeSelection);
		$.multiple_selection_widget.buttonRight.addEventListener('click', cancelFunction);

		if (!zoneLOPA) {
			return;
		}

		//Ti.API.info('Alloy.Globals.lopaId ' + Alloy.Globals.lopaId);

		lopaTemp = query_lib.getLOPAByLOPAId(Alloy.Globals.lopaId);
		maxColLopa = lopaTemp[0].maxColumn;
		floor = lopaTemp[0].floor;
		zone = lopaTemp[0].zone;

		flightInformation.airModel = flightInformation.airModel != null ? flightInformation.airModel : '';
		flightInformation.flightNumber = flightInformation.flightNumber != null ? flightInformation.flightNumber : '';
		$.total.text = 'Total :';
		$.aircraft_type.text = flightInformation.flightNumber + ' ' + flightInformation.airModel;
		$.aircraftRegistration.text = flightInformation.aircraftRegistration;
		$.currentPax.text = query_lib.getByZonePassengers(Alloy.Globals.lopaId);
		$.totalPA.text = "(" + query_lib.getByZoneSeats(Alloy.Globals.lopaId) + ")";
		$.titleLabel.text = floor + '-' + 'Zone' + zone;
		$.titleName.setText(lopa_lib.getCrewUser());
		countAllIncident = query_lib.getCountIncidentAll();
		lopaPosition = query_lib.getLOPAPosition(Alloy.Globals.lopaId);

		var rowTemp = -1;
		posExtracted = [];
		for (var index = 0; index < lopaPosition.length; index++) {
			posExtracted.push(lopaPosition[index].position);

		}

		incidentData = [];
		incidentDataLAVG = [];

		incidentData = query_lib.isIncidents(posExtracted, flightInformation.aircraftRegistration);
		incidentDataLAVG = query_lib.isIncidentsLAVG(flightInformation.aircraftRegistration);

		//posExtracted = null;
	} else {
		return;
	}
}

function createIncidentFunction() {

	lopaIdTemp = Alloy.Globals.lopaId;
	if (OS_ANDROID) {
		if (!openOptionalDialogue) {
			openOptionalDialogue = true;
		} else {
			return;
		}
	}

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
	if (stackSelected.length > 0) {
		if (isPax && !noPax) {
			
			data.splice(4, 1);
			data.splice(2, 1);
			data.splice(1, 1);
			
			rowNum = 3;
			optionDialogHeight = "70%";
		} else if (isPax && noPax) {
			rowNum = 4;
			optionDialogHeight = "60%";
			
			data.splice(4, 1);
			data.splice(1, 1);
			
		} else if (!isPax && noPax) {
			
			data.splice(4, 1);
			data.splice(1, 1);
			data.splice(0, 1);
			
			rowNum = 3;
			optionDialogHeight = "70%";
		}
	} else {
		rowNum = 6;
		optionDialogHeight = "50%";
	}
	Ti.API.info('Here');
	for (var i = 0; i < data.length; i++) {
		//Ti.API.info('data[i] ' + data[i]);
		tableData.push(createOptionalIncidentCateBtn(data[i], i, isPax, rowNum));
	}

	var win2 = component.createOptionDialogWindow(tableData, optionDialogHeight);

	data = null;
	tableData = null;
	win2.open();

	closeFlag = 1;
	win2.addEventListener("click", function(e) {
		win2.close();
		openOptionalDialogue = false;
	});

	if (OS_ANDROID) {
		win2.addEventListener('android:back', function(e) {
			openOptionalDialogue = false;
			win2.close();
		});
	}
	//}
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
		disableVariablesButton();
		isSingleSelection = true;
		$.multiple_selection_widget.msMultiSelection.image = '/images/btn_multipleselection_act.png';
	});

	btnId = null;
	pagePath = null;
	btnName = null;
	imgPathName = null;
	return row;
}

function clearRendering() {
	$.seatView.removeAllChildren();
	$.leftView.removeAllChildren();
	$.rightView.removeAllChildren();
	$.headerView.removeAllChildren();
	$.frontLag.removeAllChildren();
	$.backLag.removeAllChildren();
}

function resetSelectedItem() {

	for (var index = 0; index < tempStackSelected.length; index++) {
		tempStackSelected[index].remove(tempStackSelected[index].children[(tempStackSelected[index].children.length - 1)]);
	}
}

function changeModeSelection() {

	if (!enabledEventButton) {
		resetSelectedItem();
		stackSelected = [];
		tempStackSelected = [];
		typeTemp = '';
		isSingleSelection = false;
		toEnabledButton = true;
		enabledEventButton = true;
		$.multiple_selection_widget.msMultiSelection.image = '/images/btn_multipleselection_dis.png';
		$.multiple_selection_widget.buttonRight.image = '/images/btn_cancel_act.png';

	}
}

function enableEventButtons() {
	enabledEventButton = true;
}

function cancelFunction() {
	if (enabledEventButton) {
		toEnabledButton = true;
		resetSelectedItem();
		stackSelected = [];
		tempStackSelected = [];
		clearValue();
		disableVariablesButton();
		enabledEventButton = false;
		isSingleSelection = true;
		typeTemp = '';
		$.multiple_selection_widget.msMultiSelection.image = '/images/btn_multipleselection_act.png';
	}
}

function disableVariablesButton() {

	typeTemp = '';
	toEnabledButton = true;
	enabledEventButton = false;
	$.multiple_selection_widget.buttonRight.image = '/images/btn_cancel_dis.png';

}

function clearValue() {
	typeTemp = '';
	toEnabledButton = true;
	enabledEventButton = false;
	resetSelectedItem();
	stackSelected = [];
	tempStackSelected = [];
	disableVariablesButton();

}

function drawSmallLAVG(lopaPosition, imagePath, name) {

	var image = Titanium.UI.createImageView({
		type : 'image',
		backgroundImage : imagePath,
	});

	var imageBG = Titanium.UI.createView({
		type : 'imageBG',
		backgroundImage : '/images/bg_lavg.png',
		width : utility_lib.dpiConverter(80),
		height : utility_lib.dpiConverter(80)
	});

	var view = Ti.UI.createView({
		id : lopaPosition.id,
		position : lopaPosition.position,
		type : name,
		backgroundImage : '/images/bg_lavg_flat.png',
		borderColor : "#D3D3D3",
		borderWidth : '2',
		borderRadius : '2'

	});

	if (lopaPosition.width && lopaPosition.height) {

		if (lopaPosition.width > 2) {
			view.width = utility_lib.dpiConverter(lopaPosition.width * 50);
			view.height = utility_lib.dpiConverter(lopaPosition.height * 50);
		} else {
			view.width = utility_lib.dpiConverter(lopaPosition.width * 50);
			view.height = utility_lib.dpiConverter(lopaPosition.height * 50);
		}
	} else {
		view.width = utility_lib.dpiConverter(lopaPosition.width * 50);
		view.height = utility_lib.dpiConverter(lopaPosition.width * 50);
	}

	if (name == 'galley') {
		image.width = utility_lib.dpiConverter(45);
		image.height = utility_lib.dpiConverter(17);
		imageBG.width = utility_lib.dpiConverter(90);

	} else {
		image.width = utility_lib.dpiConverter(40);
		image.height = utility_lib.dpiConverter(30);
	}

	view.add(imageBG);
	view.add(image);
	return view;
}

function drawLAVG(lopaPosition, imagePath, name) {

	var image = Titanium.UI.createImageView({
		type : 'image',
		backgroundImage : imagePath,
	});

	var nameTitle = Ti.UI.createLabel({
		type : 'nameTitle',
		font : {
			fontSize : utility_lib.dpiConverter(20),
			fontWeight : "bold"
		},
		color : '#D3D3D3',
		text : 'Galley'
	});

	var imageBG = Titanium.UI.createView({
		type : 'imageBG',
		backgroundImage : '/images/bg_lavg.png',
		width : utility_lib.dpiConverter(80),
		height : utility_lib.dpiConverter(80)
	});

	var view = Ti.UI.createView({
		id : lopaPosition.id,
		position : lopaPosition.position,
		type : name,
		backgroundImage : '/images/bg_lavg_flat.png',
		borderColor : "#D3D3D3",
		borderWidth : '2',
		borderRadius : '2'

	});

	if (lopaPosition.width > 2) {
		if (name == 'lavatory') {
			view.width = utility_lib.dpiConverter(lopaPosition.width * 45);
		} else if (name == 'galley') {
			view.width = utility_lib.dpiConverter(lopaPosition.width * 50);
		}
	} else if (lopaPosition.width == 2) {

		if (name == 'lavatory') {
			view.width = utility_lib.dpiConverter(lopaPosition.width * 55);
		} else if (name == 'galley') {
			view.width = utility_lib.dpiConverter(lopaPosition.width * 50);
		}
	} else if (lopaPosition.width == 1) {

		if (name == 'lavatory') {
			view.width = utility_lib.dpiConverter(lopaPosition.width * 55);
		} else if (name == 'galley') {
			view.width = utility_lib.dpiConverter(lopaPosition.width * 65);
		}
	}

	if (lopaPosition.height > 2) {
		view.height = utility_lib.dpiConverter(lopaPosition.height * 70);
	} else {
		view.height = utility_lib.dpiConverter(lopaPosition.height * 55);
	}

	var lagGap = utility_lib.dpiConverter(100 + (lopaPosition.height * 80) / 2);

	//view.top = utility_lib.dpiConverter((lopaPosition.row * lagGap));
	view.top = lopaPosition.row * lagGap;
	view.left = (lopaPosition.column * gapCol) + '%';
	if (name == 'galley') {

		image.width = utility_lib.dpiConverter(62);
		image.height = utility_lib.dpiConverter(23);
		imageBG.width = utility_lib.dpiConverter(90);

	} else {

		image.width = utility_lib.dpiConverter(50);
		image.height = utility_lib.dpiConverter(40);
	}

	view.add(imageBG);
	view.add(image);

	return view;
}

function drawHeader(strCut, tempHeader, lopaPosition, gapCol) {

	var checkedIndex = tempHeader.indexOf(strCut);
	if (checkedIndex > -1) {
		return;
	}
	tempHeader.push(strCut);

	var viewLabel = Ti.UI.createView({
		left : (lopaPosition.column * gapCol) + '%',
		width : gapCol + '%',
		height : "100%"
	});

	var label = Ti.UI.createLabel({

		color : '#000',
		text : strCut,
		font : {
			fontSize : utility_lib.dpiConverter(20)
		}

	});

	viewLabel.add(label);
	$.headerView.add(viewLabel);
}

function actionLAVG(e) {
	var objAction;
	if (e.source.type == 'nameTitle' || e.source.type == 'positionDes' || e.source.type == 'image' || e.source.type == 'imageBG' || e.source.type == 'select' || e.source.type == 'incident') {
		objAction = e.source.parent;
	} else {
		objAction = e.source;
	}
	actionSelectionFunction(objAction);

}

function actionSelectionFunction(objAction) {

	if (isSingleSelection) {
		lopaIdTemp = Alloy.Globals.lopaId;
		var detailView;
		closeFlag = 4;
		var isPaxOnSeat = query_lib.issetPaxLopa(objAction.id);
		if (OS_IOS) {
			Alloy.Globals.activityIndicator.show();
		}
		setTimeout(function() {
			
			if (OS_ANDROID) {
				$.anActIndicatorView.show();
			}
			
			if (isPaxOnSeat) {

				detailView = Alloy.createController("passengers/passenger_detail", {
					LOPAPositionId : objAction.id,
					LOPAPositionPos : objAction.position,
					isFromLopa : 1

				}).getView();
			} else {
				detailView = Alloy.createController("equipments/seat_detail", {
					LOPAPositionId : objAction.id,
					LOPAPositionPos : objAction.position,
					LOPAPositionType : objAction.type

				}).getView();
			}

			if (OS_IOS) {
				Alloy.Globals.navGroupWin.openWindow(detailView);

			} else {
				detailView.open();
			}
			clearValue();
		}, 50);
	} else {

		if (objAction.type != typeTemp) {
			if (typeTemp == '') {
				typeTemp = objAction.type;
			} else {
				return;
			}
		}

		for (var index = 0; index < stackSelected.length; index++) {
			if (stackSelected[index] == objAction.position) {

				tempStackSelected[index].remove(tempStackSelected[index].children[(tempStackSelected[index].children.length - 1)]);
				stackSelected.splice(index, 1);
				tempStackSelected.splice(index, 1);

				if (stackSelected.length <= 0) {
					typeTemp = '';
				}

				return;
			}
		}

		if (toEnabledButton) {
			toEnabledButton = false;
			enableEventButtons();
			$.multiple_selection_widget.buttonRight.image = '/images/btn_cancel_act.png';
		}

		stackSelected.push(objAction.position);

		var image = Ti.UI.createImageView({
			backgroundImage : '/images/select.png',
			top : '0',
			right : '0',
			width : utility_lib.dpiConverter(20),
			height : utility_lib.dpiConverter(20),
			type : 'select'

		});

		image.top = 1;
		image.right = 1;

		objAction.add(image);
		tempStackSelected.push(objAction);
		Alloy.Globals.isLOPAOpening = false;
	}
}

function renderLOPA() {
	if (lopaPosition.length <= 0)
		return;

	var divideRow = 17;
	if (OS_ANDROID) {
		multiplier = 0.8;
		// 50%
		gapRow = utility_lib.dpiConverter(65);
	}

	gapCol = 100 / maxColLopa;
	if (OS_IOS) {
		gapRow = Ti.Platform.displayCaps.platformHeight / divideRow;
	}
	var count = 0;
	var haederObject = [];
	var tempHeader = [];

	var rowTemp = -1;
	var rowCount = -1;
	var backgroundLeftNumberColor = '#d3d3d3';
	var gapLAVG = 0;
	var gapLAVGTemp = 0;
	var foundLAVG = false;

	//**********************************************
	//* Letters Header
	//**********************************************
	for (var index = 0; index < lopaPosition.length; index++) {
		var image;
		var lopaPos = lopaPosition[index];
		if (lopaPos.type == "seat") {
			var strCutColL = lopaPos.colL;
			drawHeader(strCutColL, tempHeader, lopaPos, gapCol);
		}

		//**********************************************
		// Front GAL
		//**********************************************
		if (lopaPos.type == "LAF") {
			var imagePath = '/images/ic_lavatory.png';
			image = drawLAVG(lopaPos, imagePath, 'lavatory');

			//// Detect Actions for adding event
			image.addEventListener('click', function(e) {
				actionLAVG(e);
			});

			if (incidentDataLAVG.indexOf(lopaPos.position) > -1) {
				image.add(renderNotificationIncident());
			}

			$.frontLag.add(image);
		} else if (lopaPos.type == "GF") {
			var imagePath = '/images/ic_galley.png';
			image = drawLAVG(lopaPos, imagePath, 'galley');
			//// Detect Actions for adding event
			image.addEventListener('click', function(e) {
				actionLAVG(e);
			});

			if (incidentDataLAVG.indexOf(lopaPos.position) > -1) {
				image.add(renderNotificationIncident());
			}

			$.frontLag.add(image);
		}

		////// Seat Area...
		if (lopaPos.visibleFlag != 0) {
			if (lopaPos.type == "seat" || lopaPos.type == "LA" || lopaPos.type == "GN") {

				if (lopaPos.row % 2 == 0) {
					backgroundLeftNumberColor = '#D3D3D3';
				} else {
					backgroundLeftNumberColor = '#EDEDED';
				}

				if (rowTemp != lopaPos.row) {
					if (foundLAVG) {
						gapLAVG = gapLAVGTemp;
						gapLAVGTemp = 0;
						foundLAVG = false;
					}

					///Label Left View.
					rowCount++;
					//var str = lopaPos.position;
					//var strCut = str.substring(0, str.length - 1);
					var strCutRowL = lopaPos.rowL;
					var label = Ti.UI.createLabel({
						color : '#000',
						top : (rowCount * gapRow) + gapLAVG,
						text : strCutRowL,
						textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
						backgroundColor : backgroundLeftNumberColor,
						width : utility_lib.dpiConverter(50),
						height : utility_lib.dpiConverter(50)

					});

					$.leftView.add(label);
					var label = Ti.UI.createLabel({
						color : '#000',
						top : (rowCount * gapRow) + gapLAVG,
						text : strCutRowL,
						textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,
						backgroundColor : backgroundLeftNumberColor,
						width : utility_lib.dpiConverter(50),
						height : utility_lib.dpiConverter(50)
					});
					$.rightView.add(label);
					rowTemp = lopaPos.row;

				}

				var viewImg = Titanium.UI.createView({
					top : (rowCount * gapRow) + gapLAVG,
					left : (lopaPos.column * gapCol) + '%',
					width : gapCol + '%',
					height : gapRow,
				});

				if (lopaPos.type == "LA") {
					foundLAVG = true;
					var imagePath = '/images/ic_lavatory.png';
					image = drawSmallLAVG(lopaPos, imagePath, 'lavatory');
					//// Detect Actions for adding event
					image.addEventListener('click', function(e) {
						actionLAVG(e);
					});

					viewImg.width = image.width;
					viewImg.height = image.height;

					if (lopaPos.width == 0) {
						viewImg.width += 15;
					}
					if (OS_IOS) {
						gapLAVGTemp = ((lopaPos.height) * 50) + 10;
					}

					if (OS_ANDROID) {
						gapLAVGTemp = ((lopaPos.height)) + 10;
					}

				} else if (lopaPos.type == "GN") {

					foundLAVG = true;
					var imagePath = '/images/ic_galley.png';
					image = drawSmallLAVG(lopaPos, imagePath, 'galley');
					//// Detect Actions for adding event.
					image.addEventListener('click', function(e) {

						actionLAVG(e);
					});

					viewImg.width = image.width;
					viewImg.height = image.height;

					if (lopaPos.width == 0) {
						viewImg.width += 15;
					}

					gapLAVGTemp = ((lopaPos.height) * 50) + 10;
				} else if (lopaPos.type == "seat") {
					//var imagePath = '/images/' + lopaPos.status + '.png';
					var imagePath = '/images/' + (lopaPos.newStatus.length > 0 ? lopaPos.newStatus : lopaPos.status) + '.png';
					image = Titanium.UI.createView({
						id : lopaPos.id,
						type : lopaPos.type,
						position : lopaPos.position,
						backgroundImage : imagePath,
						top : 0,
						width : utility_lib.dpiConverter(50),
						height : utility_lib.dpiConverter(50)
					});

					/*
					 if(OS_ANDROID)
					 {
					 image.top = '0';
					 }
					 */
					
					if (incidentData.indexOf(lopaPos.position) > -1 || incidentDataLAVG.indexOf(lopaPos.position) > -1) {
						image.add(renderNotificationIncident());
					}

					image.addEventListener('click', function(e) {
						var objAction;
						if (e.source.type == 'incident' || e.source.type == 'select') {
							objAction = e.source.parent;

						} else {
							objAction = e.source;
						}

						actionSelectionFunction(objAction);

					});

					
				}
				viewImg.add(image);
				$.seatView.add(viewImg);
			}

			if (lopaPos.type == "LAR") {
				var imagePath = '/images/ic_lavatory.png';
				image = drawLAVG(lopaPos, imagePath, 'lavatory');
				image.addEventListener('click', function(e) {
					actionLAVG(e);
				});

				if (incidentDataLAVG.indexOf(lopaPos.position) > -1) {
					image.add(renderNotificationIncident());
				}
				$.backLag.add(image);
			} else if (lopaPos.type == "GR") {
				var imagePath = '/images/ic_galley.png';
				image = drawLAVG(lopaPos, imagePath, 'galley');

				image.addEventListener('click', function(e) {
					actionLAVG(e);
				});

				if (incidentDataLAVG.indexOf(lopaPos.position) > -1) {
					image.add(renderNotificationIncident());
				}

				$.backLag.add(image);
			}
		}
	}

	$.mainView.contentHeight = 'auto';

}

function actionEvent(e) {

	if (!e.source.idType) {
		e.source.idType = e.source.parent.idType;
	}

	if (!e.source.maxColumn) {
		e.source.maxColumn = e.source.parent.maxColumn;
	}

	if (!e.source.floorLopa) {
		e.source.floorLopa = e.source.parent.floorLopa;
	}

	if (!e.source.zoneLopa) {
		e.source.zoneLopa = e.source.parent.zoneLopa;
	}

	if (Alloy.Globals.lopaId == e.source.idType)
		return;
	closeFlag = 1;
	floor = e.source.floorLopa;
	zone = e.source.zoneLopa;
	clearRendering();
	Alloy.Globals.lopaId = e.source.idType;
	maxColLopa = e.source.maxColumn;
	if (OS_IOS) {
		Alloy.Globals.activityIndicator.show();
	}
	if (OS_ANDROID) {
		$.anActIndicatorView.show();
	}
	setTimeout(function() {
		init();
		renderLOPA();
		if (OS_IOS) {
			Alloy.Globals.activityIndicator.hide();
		}
		if (OS_ANDROID) {
			$.anActIndicatorView.hide();
		}
	}, 50);
	
	toEnabledButton = true;
	resetSelectedItem();
	stackSelected = [];
	tempStackSelected = [];
	clearValue();
	disableVariablesButton();
	enabledEventButton = false;
	isSingleSelection = true;
	typeTemp = '';
	$.multiple_selection_widget.msMultiSelection.image = '/images/btn_multipleselection_act.png';
	
}

$.lopaWindow.backgroundImage = bgGeneral;

function closeOptionalDialogue() {
	openOptionalDialogue = false;
}

$.btnSelectZone.addEventListener("click", function(e) {

	if (OS_ANDROID) {
		if (!openOptionalDialogue) {
			openOptionalDialogue = true;
		} else {
			return;
		}
	}

	closeFlag = 1;
	if (OS_IOS) {
		Alloy.Globals.activityIndicator.show();
	}

	if (OS_ANDROID) {
		$.btnSelectZone.backgroundColor = '#80d3d3d3';

	}

	setTimeout(function() {
		lopa_lib.showDialogueFunction(lopa, actionEvent, closeOptionalDialogue);
		if (OS_IOS) {
			Alloy.Globals.activityIndicator.hide();
		}

		if (OS_ANDROID) {
			$.btnSelectZone.backgroundColor = '#00d3d3d3';

		}
	}, 5);

});

$.lopaWindow.addEventListener('focus', function(e) {
	// Ti.API.info('Focus');
	//Ti.API.info(closeFlag);
	//Ti.API.info(lopaIsRefresh);
	
	if (OS_ANDROID) {
		$.anActIndicatorView.hide();
	}
	openNewView = false;
	Ti.API.info('lopaIsRefresh ' + lopaIsRefresh);
	if (closeFlag != 0) {
		if (closeFlag == 4) {
			Alloy.Globals.lopaId = lopaIdTemp;
			if (lopaIsRefresh) {
				if(OS_IOS){
					Alloy.Globals.activityIndicator.show();	
				}
				if (OS_ANDROID) {
					$.anActIndicatorView.show();
				}
				lopaIsRefresh = 0;
				setTimeout(function() {
					countAllIncident = query_lib.getCountIncidentAll();
					toEnabledButton = true;
					isSingleSelection = true;
					enabledEventButton = false;
					$.multiple_selection_widget.msMultiSelection.image = '/images/btn_multipleselection_act.png';
					
					if(OS_IOS){
						Alloy.Globals.activityIndicator.hide();
					}
					if (OS_ANDROID) {
						$.anActIndicatorView.hide();
						init();
						renderLOPA();
					}
					
				}, 50);
				closeFlag = 0;
				return;
			}

			if (countAllIncident == query_lib.getCountIncidentAll()) {
				toEnabledButton = true;
				isSingleSelection = true;
				enabledEventButton = false;
				$.multiple_selection_widget.msMultiSelection.image = '/images/btn_multipleselection_act.png';
				return;
			}

			if (OS_IOS) {
				Alloy.Globals.activityIndicator.show();
			}
			
			if (OS_ANDROID) {
				$.anActIndicatorView.show();
			}
			setTimeout(function() {
				countAllIncident = query_lib.getCountIncidentAll();
				toEnabledButton = true;
				isSingleSelection = true;
				enabledEventButton = false;
				$.multiple_selection_widget.msMultiSelection.image = '/images/btn_multipleselection_act.png';

				if (OS_IOS) {
					Alloy.Globals.activityIndicator.hide();
				}
				
				if(OS_ANDROID){
					$.anActIndicatorView.hide();
					init();
					renderLOPA();
				}
				
			}, 50);
		}
		closeFlag = 0;
		// Ti.API.info('Init IN ');
		return;
	}

	// Ti.API.info('Init Out ');
	incidentData = [];
	incidentDataLAVG = [];
	posExtracted = [];

	init();
	renderLOPA();

});

$.lopaWindow.addEventListener('postlayout', function(e) {
	if (OS_IOS) {
		Alloy.Globals.activityIndicator.hide();
	}
});

$.showHelp.addEventListener('click', function(e) {

	closeFlag = 1;
	win2 = Ti.UI.createWindow({
		fullscreen : false,
		backgroundColor : '#40000000',
	});

	if (OS_ANDROID) {
		if (!openOptionalDialogue) {
			openOptionalDialogue = true;
		} else {
			return;
		}
		$.showHelp.backgroundColor = '#80d3d3d3';
		setTimeout(function() {
			$.showHelp.backgroundColor = '#00d3d3d3';
		}, 5);
		win2.title = 'HELP';
		win2.theme = 'Theme.NoActionBar';

	}

	var viewMain = Ti.UI.createView({
		top : "10%",
		bottom : "10%",
		left : "10%",
		right : "10%",
		borderRadius : 10,
		backgroundColor : '#3D1A6F',
		layout : "vertical"
	});

	var labelTitle = Ti.UI.createLabel({
		classes : ['fontBold20'],
		top : '25',
		text : "HELP",
		color : "#FFCB05",
		font : {
			//		fontFamily : 'OceanSansStd',
			fontSize : utility_lib.dpiConverter(28),
			fontWeight : "bold"
		}

	});
	var labelDes = Ti.UI.createLabel({
		classes : ['fontLight18'],
		text : "LOPA color legend.",
		color : "#FFCB05",

	});
	var viewVertical = Ti.UI.createView({
		layout : 'vertical'
	});
	//viewMain.add(labelClose);
	viewMain.add(labelTitle);
	viewMain.add(labelDes);

	var scrollView = Ti.UI.createScrollView({
		top : utility_lib.dpiConverter(50),
		showVerticalScrollIndicator : true,
		showHorizontalScrollIndicator : false,
		height : '80%',
		width : '100%',
		layout : 'vertical',
		scrollType : 'vertical',
		contentWidth : "100%",
	});

	var viewHorizontal = Ti.UI.createView({
		width : '100%',
		height : '100%',
		layout : 'horizontal',
		left : utility_lib.dpiConverter(30)
	});

	for (var index = 0; index < helpTexts.length; index++) {
		var viewVertical;

		viewVertical = Ti.UI.createView({
			width : '30%',
			height : Ti.UI.SIZE,
			layout : 'vertical',
			top : utility_lib.dpiConverter(20)

		});
		var labelDetail = Ti.UI.createLabel({
			classes : ['fontLight20'],
			text : helpTexts[index],
			color : "#FFFFFF",
			top : utility_lib.dpiConverter(10),
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,

		});

		var image = Ti.UI.createImageView({
			backgroundImage : '/images/' + 'help' + (index + 1) + '.png',
			width : utility_lib.dpiConverter(40),
			height : utility_lib.dpiConverter(40),
		});

		viewVertical.add(image);
		viewVertical.add(labelDetail);
		viewHorizontal.add(viewVertical);

	}

	scrollView.add(viewHorizontal);
	viewMain.add(scrollView);
	win2.add(viewMain);
	win2.open();

	win2.addEventListener("click", function(e) {
		win2.close();
		openOptionalDialogue = false;
	});

	if (OS_ANDROID) {
		win2.addEventListener('android:back', function(e) {
			openOptionalDialogue = false;
			win2.close();
		});
	}
});

$.showLopaList.addEventListener('click', function(e) {
	//floor-Zone id lopa
	closeFlag = 0;
	lopaIdTemp = Alloy.Globals.lopaId;
	if (OS_IOS) {
		Alloy.Globals.activityIndicator.show();
	}

	if (OS_ANDROID) {
		$.anActIndicatorView.show();
		if (openNewView) {
			return;
		}
		openNewView = true;
		
		$.showLopaList.backgroundColor = '#80d3d3d3';
		setTimeout(function() {
			$.showLopaList.backgroundColor = '#00d3d3d3';
		}, 5);
	}
	
	setTimeout(function() {
		closeFlag = 0;
		Alloy.Globals.initializeApp = false;
		clearValue();
		var lopaList = Alloy.createController("lopa/lopa_list", {
			//"lopaId" : zoneLOPA.id
		}).getView();
		if (OS_IOS) {
			Alloy.Globals.navGroupWin.openWindow(lopaList);
		} else {
			lopaList.open();
		}

		//disableEventButtons();
		clearValue();
		disableVariablesButton();
		toEnabledButton = true;
		isSingleSelection = true;
		enabledEventButton = false;
		$.multiple_selection_widget.msMultiSelection.image = '/images/btn_multipleselection_act.png';
	}, 50);
});

if (OS_ANDROID) {
	$.lopaWindow.addEventListener('android:back', function(e) {
		Ti.API.info("Press Back button");
		posExtracted = null;
		incidentData = null;
		incidentDataLAVG = null;
		$.lopaWindow.close();
	});
}
