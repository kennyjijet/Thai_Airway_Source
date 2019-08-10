//**********************************************
//* VARIABLE DECLARATION
//**********************************************
var args = arguments[0] || {};
var accountId = args.accountId;
var passengerId = args.passengerId;
var paxKey = args.paxKey;
var doFunction = args.doFunction;
var fromWhere = args.fromWhere;
var irreName = args.irreName;
var incId = args.incId;
var isFromLopa = args.isFromLopa;

var upToClass = "";
var upgradeCode = "";

var isPostedLayout = false;
var query_lib = require('query_lib');
var lopa_lib = require('lopa_lib');
var utility_lib = require('utility_lib');
var component = require('component_lib');
var lopaWindow = '';
var optionDialogHeight = "50%";

var passenger;

var flightInformation;
var lopa = '';
var zoneLOPA;
var lopaPosition;

var gapCol = 0;
var gapRow = 0;
var plusValue = 0;
var countAllIncident = 0;
var maxColLopa;
var typeTemp = '';
var closeFlag = 0;

var enabledEventButton = false;
var dialog = '';
var isSingleSelection = true;
var stackSelected = [];
var tempStackSelected = [];
var imagePathSelected = '/images/select.png';
var toEnabledButton = true;
var intializedLOPA = false;
Alloy.Globals.initializeApp = true;
Alloy.Globals.lopaId = '';
var openOptionalDialogue = false;
var openNewView = false;
var win2;
var posExtracted = [];

//**********************************************
//* FUNCTION
//**********************************************
if(OS_ANDROID)
{

	$.showHelp.width = utility_lib.dpiConverter(40);
	$.showHelp.height = utility_lib.dpiConverter(40);
	
	$.btnSelectZone.width = utility_lib.dpiConverter(75);
	$.btnSelectZone.height = utility_lib.dpiConverter(75);
	$.gapper.height = utility_lib.dpiConverter(50) + '%';
	$.imageFlightLopa.left = "25";
	$.imageFloorLopa.left = "25";
	$.anActIndicatorView.hide();

}

function init() {
	isSingleSelection = true;
	clearRendering();
	if(!intializedLOPA){
		isSingleSelection = true;
		flightInformation = query_lib.getFlight(currentFlightId);
		intializedLOPA = true;
		Ti.API.info(flightInformation.aircraftRegistration);
		acReg = flightInformation.aircraftRegistration;
		
		if(lopa == ''){
			lopa = query_lib.getLOPA(flightInformation.id);
			Ti.API.info('lopa ' + lopa);
			Ti.API.info('lopa.length ' + lopa.length);
			
			if(lopa.length <= 0 ){
				return;
			}
			lopa.sort(lopa_lib.sortFnByfloor);
			zoneLOPA = lopa[0];
			Alloy.Globals.lopaId = zoneLOPA.id;
		}
	}
	if (flightInformation != '') {
	
		
		if(!zoneLOPA)
		{	
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
		
		Ti.API.info('incidentData ');
		Ti.API.info(incidentData);
		
		Ti.API.info('incidentDataLAVG ');
		Ti.API.info(incidentDataLAVG);
		
		//posExtracted = null;
	} else {
		return;
	}
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
			view.width =  utility_lib.dpiConverter(lopaPosition.width * 50);
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
		if(name == 'lavatory')
		{
			view.width = utility_lib.dpiConverter(lopaPosition.width * 45);
		}
		else if(name == 'galley')
		{
			view.width = utility_lib.dpiConverter(lopaPosition.width * 50);
		}
	} else if (lopaPosition.width == 2)  {
		
		if(name == 'lavatory')
		{
			view.width = utility_lib.dpiConverter(lopaPosition.width * 55);
		}
		else if(name == 'galley')
		{
			view.width = utility_lib.dpiConverter(lopaPosition.width * 50);
		}
	}
	else if (lopaPosition.width == 1)  {
		
		if(name == 'lavatory')
		{
			view.width = utility_lib.dpiConverter(lopaPosition.width * 55);
		}
		else if(name == 'galley')
		{
			view.width = utility_lib.dpiConverter(lopaPosition.width * 65);
		}
	}
	
	if (lopaPosition.height > 2) {
		view.height = utility_lib.dpiConverter(lopaPosition.height * 70);
	}else{
		view.height = utility_lib.dpiConverter(lopaPosition.height * 55);
	}
	
	var lagGap = utility_lib.dpiConverter(100 + (lopaPosition.height * 80) / 2);
	
	//view.top = utility_lib.dpiConverter((lopaPosition.row * lagGap));
	view.top = lopaPosition.row * lagGap;
	if(lopaPosition.column == 'L'){
		view.left = 80;
	}
	else if(lopaPosition.column == 'LC'){
		view.left = (Ti.Platform.displayCaps.platformWidth / 2) - 150;	
	}
	else if(lopaPosition.column == 'C'){
		/// Do nothing.
	}
	else if(lopaPosition.column == 'RC'){
		view.right = (Ti.Platform.displayCaps.platformWidth / 2) - 150;
	}
	else if(lopaPosition.column == 'R'){
		view.right = 80;	
	}else{
		/// If column value is sent as number.
		//view.left = (lopaPosition.column * gapCol) + (view.width / 40) + '%';
		view.left = (lopaPosition.column * gapCol) + '%';
		/*
		if (lopaPosition.width > 2) {
			view.left = (lopaPosition.column * gapCol) + (view.width / 12) + '%';
		} else {
			view.left = (lopaPosition.column * gapCol) + (view.width / 9) + '%';
		}
		*/
	}

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

function renderTitleView(titleStr) {
	
	$.titleLabel.text = "";
	$.titleLabel.text = titleStr;
	

}


function renderNotificationIncident() {
	var imageIncident = Titanium.UI.createImageView({
		backgroundImage : '/images/ic_incident_lopa.png',
		width : utility_lib.dpiConverter(26),
		height : utility_lib.dpiConverter(25),
		top : utility_lib.dpiConverter(8),
		type : 'incident'
	});
	return imageIncident;
}

function renderLOPA() {

	
	if (lopaPosition.length <= 0)
		return;

	var divideRow = 17;
	if(OS_ANDROID){
		multiplier = 0.8; // 50%
		gapRow = utility_lib.dpiConverter(65);
	}

	    
	gapCol = 100 / maxColLopa;
	Ti.API.info('gapCol ' + gapCol);
	if(OS_IOS){
		Ti.API.info('Ti.Platform.displayCaps.platformHeight / divideRow ' + Ti.Platform.displayCaps.platformHeight / divideRow);
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

					gapLAVGTemp = ((lopaPos.height) * 50) + 10;

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
					
					//if(query_lib.isIncidents(lopaPos.position, flightInformation.aircraftRegistration)){
					//	image.add(renderNotificationIncident());
					//}
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

function actionSelectionFunction(objAction)
{
	if (isSingleSelection) {
		closeFlag = 4;
		var detailView;

        var isPaxOnSeat = query_lib.hasPax(objAction.position);
		if(OS_IOS){ Alloy.Globals.activityIndicator.show(); }
		setTimeout(function() {
			if (isPaxOnSeat || objAction.newStatus=="1") {
                var _promptView = new Alloy.createController("common/alertPrompt", {
                    title : "Alert",
                    message : "This seat is not available.",
                    okText : "OK",
                    disableCancel : true,
                    onOk : function() {
                    }
                }).getView();
                _promptView.open();                 
                if(OS_IOS){ Alloy.Globals.activityIndicator.hide(); }			    
			} else {
				detailView = Alloy.createController("equipments/seat_detail", {
					LOPAPositionId : objAction.id,
					LOPAPositionPos : objAction.position,
					LOPAPositionType : objAction.type,
                    accountId : accountId,
                    passengerId : passengerId,
                    paxKey : paxKey,
                    doFunction : doFunction,
                    fromWhere : fromWhere,
                    irreName : irreName,
                    incId : incId,
                    upgradeCode : upgradeCode,
                    isFromLopa : isFromLopa

				}).getView();
                if (OS_IOS) {
                    Alloy.Globals.navGroupWin.openWindow(detailView);
    
                } else {
                    detailView.open();
                }
			}
			clearValue();
		}, 50);
	} 
}

function closeWindow() {
	lopaWindow.close();
}

function actionEvent(e, window) {
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

    if(doFunction == CHANGE_SEAT_FUNCTION) {
        var lopaPosTemp = query_lib.getLOPAClassByLopaId(btnId_temp);
        
        // if(lopaPosTemp != null && passenger != null) {
          // if(lopaPosTemp.cclass != passenger.bookingClass) {
            // var _promptView = new Alloy.createController("common/alertPrompt", {
                // title : "Alert",
                // message : "Zone's class is not same as passenger's booking class!",
                // okText : "OK",
                // disableCancel : true,
                // onOk : function() {
                // }
            // }).getView();
            // _promptView.open();                 
//             
            // window.close();
            // return;          
          // }   
        // }
        
    }
    
    if(doFunction == UPGRADE_SEAT_FUNCTION && fromWhere == PASSENGER_DETAIL) {
        var lopaPosTemp = query_lib.getLOPAClassByLopaId(btnId_temp);
        
        if(lopaPosTemp != null && passenger != null) {
          if(lopaPosTemp.cclass != upToClass) {
            var _promptView = new Alloy.createController("common/alertPrompt", {
                title : "Alert",
                message : "Zone's class is unavialable to upgrade!",
                okText : "OK",
                disableCancel : true,
                onOk : function() {
                }
            }).getView();
            _promptView.open();                 
            
            window.close();
            return;          
          }   
        }        
    }
    
	if (Alloy.Globals.lopaId == btnId_temp) {
		window.close();
		return;
	}
	
	if(OS_ANDROID)
	{
		$.anActIndicatorView.show();
	}

	clearRendering();
	Alloy.Globals.lopaId = btnId_temp;

	if(OS_IOS){ Alloy.Globals.activityIndicator.show(); }
	setTimeout(function() {
		init();
		renderLOPA();
		$.currentPax.text = query_lib.getByZonePassengers(Alloy.Globals.lopaId);
		$.totalPA.text = "(" + query_lib.getByZoneSeats(Alloy.Globals.lopaId) + ")";
		if(OS_IOS){ Alloy.Globals.activityIndicator.hide(); }
		if(OS_ANDROID)
		{
			$.anActIndicatorView.hide();
		}
	}, 50);

	toEnabledButton = true;
	isSingleSelection = true;
	stackSelected = [];
	tempStackSelected = [];
	resetSelectedItem();
	disableVariablesButton();
	window.close();

}


function resetSelectedItem() {

	for (var index = 0; index < tempStackSelected.length; index++) {
		tempStackSelected[index].remove(tempStackSelected[index].children[(tempStackSelected[index].children.length - 1)]);
	}
}

function changeModeSelection() {

	if(!enabledEventButton){
		resetSelectedItem();
		stackSelected = [];
		tempStackSelected = [];
		typeTemp = '';
		enableEventButtons();
		isSingleSelection = false;
		toEnabledButton = true;
				
	}
}

function enableEventButtons() {
	enabledEventButton = true;
}

function disableVariablesButton() {
	typeTemp = '';
	toEnabledButton = true;
	enabledEventButton = false;
}

function clearRendering() {
	$.seatView.removeAllChildren();
	$.leftView.removeAllChildren();
	$.rightView.removeAllChildren();
	$.headerView.removeAllChildren();
	$.frontLag.removeAllChildren();
	$.backLag.removeAllChildren();
}

// End Logic
function clearValue() {
	typeTemp = '';
	toEnabledButton = true;
	enabledEventButton = false;
	resetSelectedItem();
	stackSelected = [];
	tempStackSelected = [];
	disableVariablesButton();
}

function cleanUp() {

	args = null;
	query_lib = null;
	flightInformation = null;
	lopa = null;
	zoneLOPA = null;
	lopaPosition = null;
	gapCol = null;
	gapRow = null;
	dialog = null;
	tempLopaIndex = null;
	isSingleSelection = null;
	stackSelected = null;

}

/*

 @􀌂􀇑earth􏿿
 @All Status of Seat :
 1. Occupied
 2. Available
 3. Block
 4. Malfunction
 5. Occupied + Gold
 6. Occupied + Platinum
 7. Block + Gold
 8. Block + Platinum
 9. Malfunction + Gold
 10. Malfunction + Platinum
 11. Malfunction + Occupied
 12. Block + Occupied
 13. Passenger Block

 */

var helpTexts = ["OCCUPIED", "AVAILABLE", "TECHNICAL BLOCKED", "MALFUNCTION", "ROP GOLD", "ROP PLATINUM", "ROP GOLD BLOCKED", "ROP PLATINUM BLOCKED", "OCCUPIED BLOCKED", "ROP GOLD MALFUNCTION", "ROP PLATINUM MALFUNCTION", "OCCUPIED MALFUNCTION", "INTERNAL BLOCKED", "SELECT", "INCIDENT"];

$.showHelp.addEventListener('click', function(e){
	
	if(OS_ANDROID){
        if(!openOptionalDialogue){
        	openOptionalDialogue = true;
        }
        else{
        	return;
        }
   	}
   	
   	if(OS_ANDROID)
	{
		$.showHelp.backgroundColor = '#80d3d3d3';	
		setTimeout(function() {
			$.showHelp.backgroundColor = '#00d3d3d3';
		}, 5);
	}
	
	closeFlag = 1;
	win2 = Ti.UI.createWindow({
		fullscreen : false,
		backgroundColor : '#40000000',
	});
	
	if(OS_ANDROID)
	{
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
			fontSize : 28,
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
	viewMain.add(labelTitle);
	viewMain.add(labelDes);

	var scrollView = Ti.UI.createScrollView({
		top : '50',
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
		left : 30
	});

	for (var index = 0; index < helpTexts.length; index++) {
		var viewVertical;

		viewVertical = Ti.UI.createView({
			width : '30%',
			height : Ti.UI.SIZE,
			layout : 'vertical',
			top : '20'
		});
		//}
		var labelDetail = Ti.UI.createLabel({
			classes : ['fontLight20'],
			text : helpTexts[index],
			color : "#FFFFFF",
			top : 10,
			textAlign : Ti.UI.TEXT_ALIGNMENT_CENTER,

		});

		var image = Ti.UI.createImageView({
			backgroundImage : '/images/' + 'help' + (index + 1) + '.png',
			width : '40',
			height : '40',
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
	
	if(OS_ANDROID){
		win2.addEventListener('android:back', function(e) {
			openOptionalDialogue = false;
			win2.close();	
		});
	}
	
});

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
	}
}

function initializeTitle() {
	try {
        passenger = query_lib.getPassengerDetailByIdOrAccountIdOrPaxKey(passengerId, accountId, paxKey);

		clearRendering();
		if (Alloy.Globals.initializeApp) {
			
			flightInformation = query_lib.getFlight(currentFlightId);
			if (flightInformation != '') {
				
				flightInformation.airModel = flightInformation.airModel != null ? flightInformation.airModel : '';
				flightInformation.flightNumber = flightInformation.flightNumber != null ? flightInformation.flightNumber : '';
				$.total.text = 'Seat :';
				$.aircraft_type.text = flightInformation.flightNumber + ' ' + flightInformation.airModel;
				$.aircraftRegistration.text = flightInformation.aircraftRegistration;
				
                lopa = query_lib.getLOPA(flightInformation.id);                                    
                lopa.sort(lopa_lib.sortFnByfloor);
                zoneLOPA = lopa[0];

				if(passenger != null) {
				    if(doFunction == UPGRADE_SEAT_FUNCTION) {
                        upToClass;
                        var upgradeCodeArray = [];
                        if(!utility_lib.isEmpty(passenger.upgradeCode)) {
                            upgradeCodeArray = passenger.upgradeCode.split(",");                            
                        }
                        if(upgradeCodeArray != null && upgradeCodeArray != undefined && upgradeCodeArray.length > 0) {
                           if(upgradeCodeArray.length == 1) {
                               var upgradeCodeData1 = query_lib.getUpgradeCode(upgradeCodeArray[0]);
                               upgradeCode = upgradeCodeArray[0];
                               if(upgradeCodeData1 != null && upgradeCodeData1 != undefined) {
                                   upToClass = upgradeCodeData1.toClass;
                               } else {
                               }
                           } else if(upgradeCodeArray.length == 2) {
                               var upgradeCodeData1 = query_lib.getUpgradeCode(upgradeCodeArray[0]);
                               var upgradeCodeData2 = query_lib.getUpgradeCode(upgradeCodeArray[1]);
                               if(upgradeCodeData1 != null && upgradeCodeData1 != undefined && upgradeCodeData2 != null && upgradeCodeData2 != undefined) {
                                   if(upgradeCodeData1.toClass == "C" && upgradeCodeData2.toClass == "U") {
                                     upToClass = upgradeCodeData1.toClass;  
                                     upgradeCode = upgradeCodeArray[0];
                                   } else if(upgradeCodeData1.toClass == "U" && upgradeCodeData2.toClass == "C") {
                                     upToClass = upgradeCodeData2.toClass;                                     
                                     upgradeCode = upgradeCodeArray[1];
                                   } else {
                                     upToClass = upgradeCodeData1.toClass;
                                     upgradeCode = upgradeCodeArray[0];
                                   }
                               } else {
                               }
                           } else if(upgradeCodeArray.length == 3) {
                           } else {
                               
                           }
                               
                        } else {
                            switch (passenger.bookingClass) {
                                case "Y" : upToClass = "C";
                                        break;
                                case "U" : upToClass = "C";
                                        break;
                                case "C" : upToClass = "F";
                                        break;          
                                default : upToClass = "C";
                                        break;          
                            }                            
                        }
                        
                        var lopaTemp = query_lib.getLOPAIdByClass(upToClass);
                        if(lopaTemp != null && lopaTemp.length > 0) {
                            Alloy.Globals.lopaId = lopaTemp[0].lopaId;                        
                        } else {
                            Alloy.Globals.lopaId = zoneLOPA.id;                                         
                        }                                   
				        
				    } else if(doFunction == CHANGE_SEAT_FUNCTION) {
                        var lopaTemp = query_lib.getLOPAIdByClass(passenger.bookingClass);
                        var lopaTempBySeat = query_lib.getLOPAPositionByBookingSeat(passenger.bookingSeat);
                        if(lopaTempBySeat != null && lopaTempBySeat.length > 0) {
                            Alloy.Globals.lopaId = lopaTempBySeat[0].lopaId;
                        } else {
                            if(lopaTemp != null && lopaTemp.length > 0) {
                                Alloy.Globals.lopaId = lopaTemp[0].lopaId;                        
                            } else {
                                Alloy.Globals.lopaId = zoneLOPA.id;                                         
                            }                                                                                       
                        }
				    } else {
                        Alloy.Globals.lopaId = zoneLOPA.id;                 				        
				    }
				} else {
                    Alloy.Globals.lopaId = zoneLOPA.id;				    
				}				
								
				$.currentPax.text = query_lib.getByZonePassengers(Alloy.Globals.lopaId);
				$.totalPA.text = "(" + query_lib.getByZoneSeats(Alloy.Globals.lopaId) + ")";

				renderTitleView(lopa[0].floor + '-' + 'Zone' + lopa[0].zone);
				$.titleName.setText(lopa_lib.getCrewUser());

				countAllIncident = query_lib.getCountIncidentAll();

			}
		}
	} catch(e) {
		if(OS_IOS){ Alloy.Globals.activityIndicator.hide(); }
	}
}

//**********************************************
//* Main
//**********************************************
initializeTitle();
changeSeatFromIncidentDetailIsRefresh = 0;
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
	if(OS_IOS){
		if(OS_IOS){ Alloy.Globals.activityIndicator.show(); }
	}
	
	if(OS_ANDROID)
	{
		$.btnSelectZone.backgroundColor = '#80d3d3d3';
		
	}
	setTimeout(function() {
		lopa_lib.showDialogueFunction(lopa, actionEvent, closeOptionalDialogue);
		if(OS_IOS){
			if(OS_IOS){ Alloy.Globals.activityIndicator.hide(); }
		}
		
		if(OS_ANDROID)
		{
			$.btnSelectZone.backgroundColor = '#00d3d3d3';
			
		}
	}, 5);
});


$.upgradeSeatLopaWindow.backgroundImage = bgGeneral;

function closeOptionalDialogue ()
{
	openOptionalDialogue = false;
}

$.upgradeSeatLopaWindow.addEventListener('blur', function(e) {
});

$.upgradeSeatLopaWindow.touchEnabled = false;

$.upgradeSeatLopaWindow.addEventListener('focus', function(e) {
	
	
    Ti.API.info('Focus Upgrade LOPA');
	Ti.API.info(closeFlag);
	if(passengerSeatClassIsRefresh == 1 || compensationFlag == 1 || changeSeatFromIncidentDetailIsRefresh ==1) {
        $.upgradeSeatLopaWindow.close();            
    }
	openNewView = false;
	if (closeFlag != 0) {
		if (closeFlag == 4) {
			Ti.API.info('lopaIsRefresh ' + lopaIsRefresh);
			if(lopaIsRefresh)
			{
				if(OS_IOS){ Alloy.Globals.activityIndicator.show(); }
				
				if (OS_ANDROID) {
					$.anActIndicatorView.show();
				}
				//lopaIsRefresh = 0;
				setTimeout(function() {
					countAllIncident = query_lib.getCountIncidentAll();
					toEnabledButton = true;
					isSingleSelection = true;
					enabledEventButton = false;
					if(OS_IOS){ Alloy.Globals.activityIndicator.hide(); }
					
				
					if(OS_ANDROID){
						init();
						renderLOPA();
						$.anActIndicatorView.hide();
					}
				
				}, 50);
				
				
				closeFlag = 0;
				return;
			}
			
			if (countAllIncident == query_lib.getCountIncidentAll()) {
				toEnabledButton = true;
				isSingleSelection = true;
				enabledEventButton = false;
				return;
			}
			
			if(OS_IOS){
				Alloy.Globals.activityIndicator.show();
			}
			setTimeout(function() {
				countAllIncident = query_lib.getCountIncidentAll();
				toEnabledButton = true;
				isSingleSelection = true;
				enabledEventButton = false;
				if(OS_IOS){ Alloy.Globals.activityIndicator.hide(); }
				
			}, 50);
		}

		closeFlag = 0;
		Ti.API.info('Init IN ');
		return;
	}
	
	Ti.API.info('Init Out ');
	incidentData = [];
	incidentDataLAVG = [];	
	posExtracted = [];
	init();
	renderLOPA();

    
    
});

$.upgradeSeatLopaWindow.addEventListener('postlayout', function(e) {
	if(!isPostedLayout){
		setTimeout(function() {
			if(OS_IOS){ Alloy.Globals.activityIndicator.hide(); }
			$.upgradeSeatLopaWindow.touchEnabled = true;
		}, 50);
			isPostedLayout = true;
	}
});

$.cleanUp = function() {
	args = null;
	query_lib = null;
	flightInformation = null;
	lopa = null;
	zoneLOPA = null;
	lopaPosition = null;
	gapCol = null;
	gapRow = null;
	dialog = null;
	tempLopaIndex = null;
	isSingleSelection = null;
	stackSelected = null;
	typeTemp = null;
	Alloy.Globals.tempWindow = {};
	Alloy.Globals.tempWindow = null;
	query_lib = null;
	flightInformation = null;
	tempStackSelected = null;
	tableDialog = null;
	imagePathSelected = null;
	toEnabledButton = null;
};

//**********************************************
//* End Main
//**********************************************


if(OS_ANDROID){
	$.upgradeSeatLopaWindow.addEventListener('android:back', function(e) {
		Ti.API.info("Press Back button");
		$.upgradeSeatLopaWindow.close();	
	});
}

//**********************************************
//* End Main
//**********************************************
