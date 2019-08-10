// Arguments passed into this controller can be accessed via the `$.args` object directly or:
//************************************
//* Require
//************************************
var homeQuery = require('query_lib');
var deleteQuery = require('delete_data');
var component = require('component_lib');
var sync = require('sync_lib');
var force = require('force');
var util = require('utility_lib');
var user_lib = require('user_lib');
var apps_link_lib = require('apps_link_lib');

//**********************************************
//* Variable Declaration
//**********************************************
var user;
var flight = null;
var passengers = [];
var firstClass = 0;
var businessClass = 0;
var preEcoClass = 0;
var economyClass = 0;
var incidents = [];
var draftIncident = 0;
var closeFlag = 0;
var interval;
var syncInterval;

var _logoutPromptView;
var _closeFlightPromptView;
var _submitIncidentPromptView;
var _syncDataPromptView;

var holdTime = 5000,
    timeout;
var _viewLogPrompt;
var openOptionalDialogue = false;
var clearFlag = 0;
var Ismultipied = false;

//************************************
//* Funtion
//************************************

if(OS_ANDROID)
{
  	$.anActIndicatorView.hide();
	
	$.btnLogout.height = util.dpiConverter(50);
	$.imgLogo.height = util.dpiConverter(115);
	$.btnSync.height = util.dpiConverter(50);
	
	$.flightSum.height = util.dpiConverter(50);
	$.closeFlight.height = util.dpiConverter(50);
	
	$.line5View.top = util.dpiConverter(10);
	$.takeOff.height = util.dpiConverter(50);
	
	$.imgDepart.height = util.dpiConverter(80);
	$.fullTime.height = util.dpiConverter(80);
	$.imgArrive.height = util.dpiConverter(80);
	
	$.imgLOPA.height = util.dpiConverter(120);
	$.imgPassenger.height = util.dpiConverter(120);
	$.imgAvailable.height = util.dpiConverter(120);
	$.imgCrewlist.height = util.dpiConverter(120);
	$.imgIncident.height = util.dpiConverter(120);
	$.imgSafety.height = util.dpiConverter(120);
	$.imgEdocument.height = util.dpiConverter(120);
	$.imgApps.height = util.dpiConverter(120);
	
}

// Ti.API.info('Alloy.Globals.initialSynced ' + Alloy.Globals.initialSynced);
function btnLogout() {
    // $.navGroupWin.openWindow(Alloy.createController("Profile").getView());
    // Alloy.Globals.navGroupWin = $.navGroupWin;

    // Ti.API.info(closeFlag);
    // Ti.API.info(flight);
    if (closeFlag || flight == null) {
        var unsyncIncidentCount = homeQuery.countUnsyncIncident();
        if (unsyncIncidentCount > 0) {
            _syncDataPromptView = new Alloy.createController("common/alertPrompt", {
                title : "Unsynced Incidents",
                message : "There are unsynced data. Please run synchronization before logging out.",
                okText : "Run Sync",
                cancelText : "Cancel",
                onOk : function() {
                    onRunSync();
                }
            }).getView();
            _syncDataPromptView.open();
        } else {
            _logoutPromptView = Alloy.createController("common/alertPrompt", {
                title : "Logout",
                message : "Are you sure you want to logout? All data will be deleted after logging out.",
                okText : "Logout",
                cancelText : "Cancel",
                onOk : function() {
                    onLogout();
                },
                disableCancel : false
            }).getView();
            _logoutPromptView.open();
        }
    } else {
        var dialog = Alloy.createController("common/alertPrompt", {
            message : "Please Close Flight prior to Log Out",
            title : 'Logout',
            okText : "OK",
            onOk : function() {
            },
            disableCancel : true
        }).getView();
        dialog.open();
    }
}

function onLogout() {
    Ti.API.info("on logOut");
    
    if(OS_IOS){
    	Alloy.Globals.activityIndicator.show();
    }
    
    if(OS_ANDROID)
    {
    	$.anActIndicatorView.show();
    }
    
    user_lib.deleteUser();
    deleteQuery.deleteUser();
    deleteQuery.deleteFlight();
    deleteQuery.deletePassenger();
    deleteQuery.deleteIncident();
    deleteQuery.deleteLOPA();
    deleteQuery.deleteEquipment();
    deleteQuery.deleteCrew();
    deleteQuery.deleteMiscellaneous();
    deleteQuery.deleteAuthentication();
    var loginView = Alloy.createController("index").getView();
    loginView.open();
	if(OS_IOS){
		$.navGroupWin.close();
    	$.navGroupWin = null;	
	}
    Alloy.Globals.initialSynced = false; 
    _logoutPromptView = null;
    
    if(OS_IOS){
    	Alloy.Globals.activityIndicator.hide();
    	
    }
    
    if(OS_ANDROID)
    {
    	$.anActIndicatorView.hide();
    }
    

}

function onRunSync() {
    btnSync();
    _syncDataPromptView = null;
    _viewLogPrompt = null;
}


function onViewLog() {
    if(OS_IOS){
    	 Alloy.Globals.navGroupWin.openWindow(Alloy.createController("log").getView());
      }else{
    	Alloy.createController("log").getView().open();
    }
}

function btnSync() {
    if (Titanium.Network.networkType != Titanium.Network.NETWORK_NONE) {
        var syncOpen = Alloy.createController("sync").getView();
        if(OS_IOS){
	        if (!sync.isSyncInprogress()) {
	            Alloy.Globals.navGroupWin.openWindow(syncOpen);
	        } else {
	            alert("background sync is in progress. please wait for it to complete before syncing again.");
	        }
        }else{
        	syncOpen.open();
        }
    } else {
        alert("No internet connectivity");
    }
}

function btnSummary() {
    if(OS_IOS){
    	Alloy.Globals.activityIndicator.show();
    }else if(OS_ANDROID)
	{
		$.anActIndicatorView.show();
	}
    setTimeout(function() {
    	var summaryView = Alloy.createController("flight_summary").getView();
    	if(OS_IOS){
    		Alloy.Globals.navGroupWin.openWindow(summaryView);
    		//$.navGroupWin.openWindow(summaryView);
        	//Alloy.Globals.navGroupWin = $.navGroupWin;	
    	}else{
    		summaryView.open();
    	}
    	
    }, 10);
}

function btnClose() {

    if (closeFlightEnabled) {
        var incompleteText = "";
        var checkIncidentFlag = 1;
        if (draftIncident.draft > 0) {
            checkIncidentFlag = 0;

            _submitIncidentPromptView = new Alloy.createController("common/closeFlightAlertPrompt", {
                title : "Close Flight",
                message : "Please submit all incidents in order to Close Flight.",
                okText : "View Incidents",
                cancelText : "Cancel",
                onOk : function() {
                    onViewIncidents();
                },
                disableCancel : false
            }).getView();
            _submitIncidentPromptView.open();
            /*
             var dialog = Ti.UI.createAlertDialog({
             yes : 0,
             buttonNames: ['Yes', 'No'],
             message: "Please submit all incidents in order to Close Flight",
             title: 'CLOSE FLIGHT'
             });
             dialog.addEventListener('click', function(e){
             if (e.index == e.source.yes){
             Alloy.Globals.activityIndicator.show();

             $.navGroupWin.openWindow(Alloy.createController("incidents/incident_list").getView());
             Alloy.Globals.navGroupWin = $.navGroupWin;
             }

             });
             dialog.show();
             */
        }

        if (checkIncidentFlag == 1) {
            _closeFlightPromptView = new Alloy.createController("common/alertPrompt", {
                title : "Close Flight",
                message : "Are you sure you want to close flight? Your next flight (if available) will be retrieved.",
                okText : "Close Flight",
                cancelText : "Cancel",
                onOk : function() {
                    onCloseFlight();
                },
                disableCancel : false
            }).getView();
            _closeFlightPromptView.open();

            /*
             var dialog2 = Ti.UI.createAlertDialog({
             yes: 0,
             buttonNames: ['Yes', 'No'],
             title: 'CLOSE FLIGHT',
             message: 'Are you sure you want to close flight?'
             });
             dialog2.addEventListener('click', function(evt){
             if (evt.index == evt.source.yes){
             closeFlag = 1;
             }
             });
             dialog2.show();
             */
        }
    } else {
        var _promptView = new Alloy.createController("common/alertPrompt", {
            title : "Alert",
            message : "Unable to close flight now. Because the current time has not yet reached the original scheduled STA/ETA time.",
            okText : "OK",
            disableCancel : true,
            onOk : function() {
            }
        }).getView();
        _promptView.open();
    }
    
}

function onViewIncidents() {
	var viewIncident = Alloy.createController("incidents/incident_list").getView();
	
	if(OS_ANDROID)
	{
		$.anActIndicatorView.show();
	}
	if(OS_IOS){
    	Alloy.Globals.navGroupWin.openWindow(viewIncident);	
    	
	}else{
		viewIncident.open();
	}
    
    if(OS_ANDROID)
	{
		$.anActIndicatorView.hide();
	}
    //Alloy.Globals.navGroupWin = $.navGroupWin;
    _submitIncidentPromptView = null;
}

function onCloseFlight() {
    closeFlag = 1;
    _closeFlightPromptView = null;

    //refresherFunction();
    flight = homeQuery.getNextFlight();
    Ti.API.info("onCloseFlight flight: " + flight);
    if(OS_IOS)
    {
    	Alloy.Globals.activityIndicator.show();	
    }
    
    if(OS_ANDROID)
	{
		$.anActIndicatorView.show();
	}
	
    setTimeout(function() {
    	deleteQuery.clearDataWithCurrentFlight();
        if (flight != null) {
            homeQuery.updateCurrentFlight(currentFlightId, flight.id);
            currentFlightId = flight.id;
            flightExternalId = flight.flightExternalId;
            var userId = homeQuery.getUserId();
            user = homeQuery.getUserDetailsFromCrew(userId.id + "_" + currentFlightId);
            closeFlag = 0;
            setText();
        } else {
            homeQuery.updateCurrentFlight(currentFlightId, null);
            closeFlag = 0;
            clearText();
        }
        
        if(OS_IOS){
        	Alloy.Globals.activityIndicator.hide();	
        }
        if(OS_ANDROID)
		{
			$.anActIndicatorView.hide();
		}
    }, 500);
}

function btnLOPA() {
    //$.navGroupWin.openWindow(Alloy.createController("/lopa/lopa_list").getView());
   	
   	//var lopaView = Alloy.createController("upgrade_seat/upgrade_seat_lopa").getView();
    var lopaView = Alloy.createController("lopa/lopa").getView();
    if(OS_IOS)
    {
    	Alloy.Globals.navGroupWin.openWindow(lopaView);
    }else{
    	lopaView.open();
    }
}

function btnIncident() {
	var incidentView = Alloy.createController("incidents/incident_list").getView();
	if(OS_IOS)
	{
		Alloy.Globals.navGroupWin.openWindow(incidentView);	
	}else{
		incidentView.open();	
	}
    
    //Alloy.Globals.navGroupWin = $.navGroupWin;
}

function btnPassengerlist() {
	
	var passengerListView = Alloy.createController("passengers/passenger_list").getView();
	if(OS_IOS)
	{
		Alloy.Globals.navGroupWin.openWindow(passengerListView);
		
	}else{
		passengerListView.open();	
	}
	
    //Alloy.Globals.navGroupWin = $.navGroupWin;
}

function btnCrewlist() {
	
	var crewListView = Alloy.createController("crew/crew_list").getView();
	if(OS_IOS)
	{
		Alloy.Globals.navGroupWin.openWindow(crewListView);
	}else
	{
		crewListView.open();
	}
    
    //Alloy.Globals.navGroupWin = $.navGroupWin;
}

function btnAvailableseat() {
	
	var availableSeat = Alloy.createController("available_seat/available_seat_list").getView();
	if(OS_IOS)
	{
		Alloy.Globals.navGroupWin.openWindow(availableSeat);	
		
	}else
	{
		availableSeat.open();	
	}
	
    //Alloy.Globals.navGroupWin = $.navGroupWin;
}

function btnSafety() {
	
	var saftyView = Alloy.createController("safety_equipments/safety_equipment_list").getView();
	if(OS_IOS)
	{
		Alloy.Globals.navGroupWin.openWindow(saftyView);
		
	}else
	{
		saftyView.open();	
	}
	
    // Alloy.Globals.navGroupWin = $.navGroupWin;
    // component.alertUnderConstruction();
}

function btnEdocument() {
	
	var edocumentView = Alloy.createController("edocument/edocument_list").getView();
	if(OS_IOS)
	{
		Alloy.Globals.navGroupWin.openWindow(edocumentView);
	}else
	{
		edocumentView.open();	
	}
   
}

function actionEvent(e, win2) {

    var uniformResourceLocator = e.source.uniformResourceLocator;
    var name = e.source.name;
    if (uniformResourceLocator == undefined) {
        uniformResourceLocator = e.source.parent.uniformResourceLocator;
    }

    if (name == undefined) {
        name = e.source.parent.name;
    }
    
    Titanium.Platform.openURL(uniformResourceLocator);
	
}

function btnApps() {
    Alloy.Globals.UrlSalesforce = '';
    if (Titanium.Network.networkType != Titanium.Network.NETWORK_NONE) {
        setTimeout(function() {
            // Ti.API.info('URL ' + Alloy.Globals.instanceUrl);
            // Ti.API.info('Alloy.Globals.accessToken ' + Alloy.Globals.accessToken);
            var link = [{
                name : 'iCARE',
                url : 'http://thaisquare.thaiairways.com/ThaiSquare'
            },
            {
                name : 'Chatter',
                url : 'salesforce1://'
            }];
            apps_link_lib.showDialogueLinkAppsFunction(link, actionEvent, closeOptionalDialogue);
        }, 100);
    } else {
        component.alertBtnApp();
        openOptionalDialogue = false;
    }
}

function updatePassengerCount()
{
	 var countedClass = [];
	 countedClass = homeQuery.getCountClass();
	 var seatClass = flight.aircraftConfiguration.split(" ");
        var classList;
        var maxSeat;

        $.line2View.removeAllChildren();

		var imgLeft;
        var imgTop;
        var labelLeft;
        var labelTop;
        if (OS_IOS) {
        	imgLeft = "0%";
        	imgTop = "3%";
        	labelLeft = "3%";
        	labelTop = "20%";
        }else{
        	$.line3View.height = "11%";
        	$.line2View.height = "7%";
        	imgLeft = "0%";
        	imgTop = "3%";
        	labelLeft = "3%";
        	labelTop = "15%";
        }
        
        Ti.API.info('seatClass.length ' + seatClass.length);
        switch (seatClass.length) {
        case 2:
            var total = 0;
            var maxTotal = 0;
            for (var i = 0; i < seatClass.length; i++) {
            	
                classList = seatClass[i].substring(0, 1);
                maxSeat = seatClass[i].substring(1, seatClass[i].length);
				
                //var classCount = homeQuery.countClass(classList, currentFlightId);
                //var infClass = homeQuery.countInfant(classList, currentFlightId); // Flag from Gas.
                var classCount = 0;
                var infClass = 0;
                
                
                if(classList == "Y"){
                	infClass = countedClass[0];
                	classCount= countedClass[4];
                	total += parseInt(classCount) + parseInt(infClass);
                }else if(classList == "U")
                {
                	infClass = countedClass[1];
                	classCount = countedClass[5];
                	total += parseInt(classCount) + parseInt(infClass);
                	
                }else if(classList == "C")
                {
                	infClass = countedClass[2];
                	classCount = countedClass[6];
                	total += parseInt(classCount) + parseInt(infClass);
                	
                }else if(classList == "F")
                {
                	infClass = countedClass[3];
                	classCount = countedClass[7];
                	total += parseInt(classCount) + parseInt(infClass);
                }
                
                
                //total += parseInt(classCount) + parseInt(infClass);
                
                maxTotal += parseInt(maxSeat);
                if (infClass != 0 || infClass != "0") {
                    classCount = classCount + "+" + infClass;
                } else {
                    classCount = classCount;
                }

                var view = Ti.UI.createView({
                    width : "33%",
                    layout : "horizontal"
                });

                var image = Ti.UI.createImageView({
                    top : imgTop,
                    left : "10%",
                    image : "/images/" + getImageClass(classList),
                    height : 40
                });

                var label = $.UI.create("Label", {
                    left : labelLeft,
                    top : labelTop,
                    classes : ['fontNormalBold', 'colorGold']
                });
                label.text = classCount;

                var maxLabel = $.UI.create("Label", {
                    left : labelLeft,
                    top : labelTop,
                    classes : ['fontNormalBold', 'colorWhite']
                });
                maxLabel.text = " (" + maxSeat + ")";
				if(OS_ANDROID)
				{
					// image.width = util.dpiConverter(50);
					// image.height = util.dpiConverter(50);
				}
                view.add(image);
                view.add(label);
                view.add(maxLabel);
                $.line2View.add(view);
            }

            var view = Ti.UI.createView({
                width : "33%",
                layout : "horizontal"
            });

            var image = Ti.UI.createImageView({
                top : imgTop,
                left : "10%",
                image : "/images/ic_ttl.png",
                height : 40
            });

            var label = $.UI.create("Label", {
                left : labelLeft,
                top : labelTop,
                classes : ['fontNormalBold', 'colorGold']
            });
            label.text = total;

            var maxLabel = $.UI.create("Label", {
                left : labelLeft,
                top : labelTop,
                classes : ['fontNormalBold', 'colorWhite']
            });
            maxLabel.text = " (" + maxTotal + ")";
            
            if(OS_ANDROID)
			{
				//image.width = util.dpiConverter(50);
				//image.height = util.dpiConverter(50);
			}
			
			
            view.add(image);
            view.add(label);
            view.add(maxLabel);
            $.line2View.add(view);

            break;
        case 3:
            var total = 0;
            var maxTotal = 0;
            for (var i = 0; i < seatClass.length; i++) {
                classList = seatClass[i].substring(0, 1);
                maxSeat = seatClass[i].substring(1, seatClass[i].length);

               // var classCount = homeQuery.countClass(classList, currentFlightId);
               // var infClass = homeQuery.countInfant(classList, currentFlightId);
                //total += parseInt(classCount) + parseInt(infClass);
                
                
                if(classList == "Y"){
                	infClass = countedClass[0];
                	classCount= countedClass[4];
                	total += parseInt(classCount) + parseInt(infClass);
                }else if(classList == "U")
                {
                	infClass = countedClass[1];
                	classCount = countedClass[5];
                	total += parseInt(classCount) + parseInt(infClass);
                	
                }else if(classList == "C")
                {
                	infClass = countedClass[2];
                	classCount = countedClass[6];
                	total += parseInt(classCount) + parseInt(infClass);
                	
                }else if(classList == "F")
                {
                	infClass = countedClass[3];
                	classCount = countedClass[7];
                	total += parseInt(classCount) + parseInt(infClass);
                }
                
                
                
                maxTotal += parseInt(maxSeat);

                if (infClass != 0 || infClass != "0") {
                    classCount = classCount + "+" + infClass;
                } else {
                    classCount = classCount;
                }

                var view = Ti.UI.createView({
                    width : "25%",
                    layout : "horizontal"
                });

                var image = Ti.UI.createImageView({
                    top : imgTop,
                    left : imgLeft,
                    image : "/images/" + getImageClass(classList),
                    height : 40
                });

                var label = $.UI.create("Label", {
                    left : labelLeft,
                    top : labelTop,
                    classes : ['fontNormalBold', 'colorGold']
                });
                label.text = classCount;

                var maxLabel = $.UI.create("Label", {
                    left : labelLeft,
                    top : labelTop,
                    classes : ['fontNormalBold', 'colorWhite']
                });
                maxLabel.text = " (" + maxSeat + ")";

				if(OS_ANDROID)
				{
					//image.left = "4%";
					// image.width = util.dpiConverter(25);
					// image.height = util.dpiConverter(25);
				}
				
                view.add(image);
                view.add(label);
                view.add(maxLabel);
                $.line2View.add(view);
            }

            var view = Ti.UI.createView({
                width : "24%",
                layout : "horizontal"
            });

            var image = Ti.UI.createImageView({
                top : imgTop,
                left : imgLeft,
                image : "/images/ic_ttl.png",
                height : 40
            });

            var label = $.UI.create("Label", {
                left : labelLeft,
                top : labelTop,
                classes : ['fontNormalBold', 'colorGold']
            });
            label.text = total;

            var maxLabel = $.UI.create("Label", {
                left : labelLeft,
                top : labelTop,
                classes : ['fontNormalBold', 'colorWhite']
            });
            maxLabel.text = " (" + maxTotal + ")";
			
			if(OS_ANDROID)
			{
				// image.width = util.dpiConverter(25);
				// image.height = util.dpiConverter(25);
			}
			
            view.add(image);
            view.add(label);
            view.add(maxLabel);
            $.line2View.add(view);

            break;
        case 4:
            var total = 0;
            var maxTotal = 0;
            for (var i = 0; i < seatClass.length; i++) {
                classList = seatClass[i].substring(0, 1);
                maxSeat = seatClass[i].substring(1, seatClass[i].length);

                //var classCount = homeQuery.countClass(classList, currentFlightId);
                //var infClass = homeQuery.countInfant(classList, currentFlightId);
                //total += parseInt(classCount) + parseInt(infClass);
                Ti.API.info('classList ' + classList);
                
                
                
                if(classList == "Y"){
                	infClass = countedClass[0];
                	classCount= countedClass[4];
                	total += parseInt(classCount) + parseInt(infClass);
                }else if(classList == "U")
                {
                	infClass = countedClass[1];
                	classCount = countedClass[5];
                	total += parseInt(classCount) + parseInt(infClass);
                	
                }else if(classList == "C")
                {
                	infClass = countedClass[2];
                	classCount = countedClass[6];
                	total += parseInt(classCount) + parseInt(infClass);
                	
                }else if(classList == "F")
                {
                	infClass = countedClass[3];
                	classCount = countedClass[7];
                	total += parseInt(classCount) + parseInt(infClass);
                }
               
                maxTotal += parseInt(maxSeat);
                if (infClass != 0 || infClass != "0") {
                    classCount = classCount + "+" + infClass;
                }

                var view = Ti.UI.createView({
                    width : "21%",
                    layout : "horizontal"
                });

                var image = Ti.UI.createImageView({
                    top : "12%",
                    left : imgLeft,
                    image : "/images/" + getImageClass(classList),
                    height : 40
                });

                var viewVert = Ti.UI.createView({
                    width : "70%",
                    layout : "horizontal"
                });

                var label = $.UI.create("Label", {
                    left : labelLeft,
                    top : labelTop,
                    classes : ['fontNormalBold', 'colorGold']
                });
                label.text = classCount;

                var labelTotal = $.UI.create("Label", {
                    left : labelLeft,
                    top : labelTop,
                    classes : ['fontNormalBold', 'colorWhite']
                });
                labelTotal.text = "(" + maxSeat + ")";
				
				if(OS_ANDROID)
				{	
					//image.left = "5%";
					// image.width = util.dpiConverter(30);
					image.height = util.dpiConverter(35);
				}
				
                view.add(image);
                viewVert.add(label);
                viewVert.add(labelTotal);
                view.add(viewVert);
                $.line2View.add(view);
            }

            var view = Ti.UI.createView({
                width : "14%",
                layout : "horizontal"
            });

            var image = Ti.UI.createImageView({
                top : "12%",
                //left : 10,
                image : "/images/ic_ttl.png",
                height : 40
            });

            var viewVert = Ti.UI.createView({
                width : "60%",
                layout : "vertical"
            });

            var label = $.UI.create("Label", {
                left : labelLeft,
                top : labelTop,
                classes : ['fontNormalBold', 'colorGold']
            });
            label.text = total;

            var labelTotal = $.UI.create("Label", {
                left : labelLeft,
                classes : ['fontNormalBold', 'colorWhite']
            });
            labelTotal.text = "(" + maxTotal + ")";
            
            // if(OS_IOS)
            // {
            	// image.left = 10;
            // }
            
			if(OS_ANDROID)
			{
				// image.width = util.dpiConverter(25);
				image.height = util.dpiConverter(35);
			}
            view.add(image);
            viewVert.add(label);
            viewVert.add(labelTotal);
            view.add(viewVert);
            $.line2View.add(view);

            break;
        }
}


function setText() {
    var lastName = user.lastName.substring(0, 1) + ".";
    if (user.firstName != "") {
        var idUserCrew = user.id.split("_");
        $.titleName.setText(user.rank + " " + user.firstName + " " + lastName + " (" + idUserCrew[0] + ")");
    } else {
        $.titleName.setText("");
    }
    // Convert date
    if (flight != null) {
        if (flight.origin == "BKK") {
            $.status.setText("Outbound");
        }
        if (flight.destination == "BKK") {
            $.status.setText("Inbound");
        }
        var flightDate = new Date(flight.flightDateLT);
        var monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        $.flightSummary.setText(flight.flightNumber + " | " + ("0" + flightDate.getDate()).slice(-2) + " " + monthNames[flightDate.getMonth()] + " " + flightDate.getFullYear() + " | " + flight.aircraftType + ' (' + flight.aircraftRegistration + ')');
        $.sourceAP.setText(flight.departureStation);
        $.sourceAPName.setText(flight.departureStationFull);
        $.destAP.setText(flight.arrivalStation);
        $.destAPName.setText(flight.arrivalStationFull);
       
		updatePassengerCount();
		
        var stdDate = new Date(flight.STDLT);
        var etdDate = new Date(flight.ETDLT);
        var staDate = new Date(flight.STALT);
        var etaDate = new Date(flight.ETALT);
        if (flight.STDLT != flight.ETDLT && flight.ETDLT != "") {
            $.ttDepartTime.setText("ETD");
            $.timeDepart.setText(("0" + etdDate.getUTCHours()).slice(-2) + ":" + ("0" + etdDate.getUTCMinutes()).slice(-2) + " LT");
        } else {
            
            $.ttDepartTime.setText("STD");
            $.timeDepart.setText(("0" + stdDate.getUTCHours()).slice(-2) + ":" + ("0" + stdDate.getUTCMinutes()).slice(-2) + " LT");
        	
        }

        var flightTimeHour = 0;
        var flightTimeMin = 0;
        if (flight.flyingTime != 0 && flight.flyingTime != "") {
            flightTimeHour = parseInt((flight.flyingTime / 60));
            flightTimeMin = (flight.flyingTime - (flightTimeHour * 60));
        }

        $.flightTime.setText(flightTimeHour + ":" + util.pad(flightTimeMin, 2));
        if (flight.STALT != flight.ETALT && flight.ETALT != "") {
            $.ttArriveTime.setText("ETA");
            $.timeArrive.setText(("0" + etaDate.getUTCHours()).slice(-2) + ":" + ("0" + etaDate.getUTCMinutes()).slice(-2) + " LT");
        } else {
            $.ttArriveTime.setText("STA");
            $.timeArrive.setText(("0" + staDate.getUTCHours()).slice(-2) + ":" + ("0" + staDate.getUTCMinutes()).slice(-2) + " LT");
        }

        if (Alloy.Globals.syncFinished == 1) {
            var syncTime = new Date();
            syncTime = Alloy.Globals.syncTimeNow;
            homeQuery.updateSyncTime(syncTime.toISOString());
            Alloy.Globals.syncFinished = 0;
        }
        
		if(flight.lastSync != ""){
        	var lastSyncDate = new Date(flight.lastSync);
        	$.lastSync.setText(("0" + lastSyncDate.getDate()).slice(-2) + "/" + ("0" + (lastSyncDate.getMonth() + 1)).slice(-2) + "/" + lastSyncDate.getFullYear() + " " + ("0" + lastSyncDate.getHours()).slice(-2) + ":" + ("0" + lastSyncDate.getMinutes()).slice(-2) + ":" + ("0" + lastSyncDate.getSeconds()).slice(-2));
        }else{
        	$.lastSync.setText("");
        }
        
        if(flight.lastModified != ""){
	        var lastModifiedDate = new Date(flight.lastModified);
	        // Ti.API.info('chl lastMod : '+lastModifiedDate);
        	$.lastModified.setText(("0" + lastModifiedDate.getDate()).slice(-2) + "/" + ("0" + (lastModifiedDate.getMonth() + 1)).slice(-2) + "/" + lastModifiedDate.getFullYear() + " " + ("0" + lastModifiedDate.getHours()).slice(-2) + ":" + ("0" + lastModifiedDate.getMinutes()).slice(-2) + ":" + ("0" + lastModifiedDate.getSeconds()).slice(-2));
        }else{
        	$.lastModified.setText("");
        }
    }
}

function clearText() {
    $.titleName.setText("");
    $.flightSummary.setText("");
    $.sourceAP.setText("");
    $.sourceAPName.setText("");
    $.destAP.setText("");
    $.destAPName.setText("");

    $.line2View.removeAllChildren();

    $.ttDepartTime.setText("STD / ETD");
    $.timeDepart.setText("");

    $.flightTime.setText("");

    $.ttArriveTime.setText("STA / ETA");
    $.timeArrive.setText("");

    $.lastSync.setText("Last Sync: ");
    $.lastModified.setText("Last Updated: ");
    $.line5View.touchEnabled = false;
    $.line6View.touchEnabled = false;
    $.incomCircle.setVisible(false);
    $.crewCircle.setVisible(false);
    $.imgLOPA.image = "/images/btn_lopa_grey.png";
    $.imgPassenger.image = "/images/btn_passenger_grey.png";
    $.imgAvailable.image = "/images/btn_available_seat_grey.png";
    $.imgCrewlist.image = "/images/btn_crew_list_grey.png";
    $.imgIncident.image = "/images/btn_incident_grey.png";
    $.imgSafety.image = "/images/btn_safety_equipment_grey.png";
    $.imgEdocument.image = "/images/btn_e-document_grey.png";
    $.imgApps.image = "/images/btn_apps_grey.png";
    $.flightSum.image = "images/btn_flight_grey.png";
    $.closeFlight.image = "images/btn_close_grey.png";
    clearFlag = 1;
}

function getImageClass(classType) {
    switch(classType) {
    case 'F':
        return "ic_f.png";
        break;
    case 'C':
        return "ic_c.png";
        break;
    case 'U':
        return "ic_u.png";
        break;
    case 'Y':
        return "ic_y.png";
        break;
    }
}

function refresherFunction() {

    draftIncident = homeQuery.countDraftSubmittedIncident(currentFlightId);
    var draft = 0;
    if (draftIncident != null) {
    	draft = parseInt(draftIncident.draft);
    }
    
    if (draft > 0) {
        $.incompleteNum.setText(draft);
        var incompleteNumToImage = $.incompleteNum.toImage();
        var topPosition = -95;
        var incompleteCircleWidthHeight = 0;

        incompleteCircleWidthHeight = incompleteNumToImage.width;
        if(incompleteNumToImage.width > incompleteNumToImage.height) {
            incompleteCircleWidthHeight = incompleteNumToImage.width;
        } else {
            incompleteCircleWidthHeight = incompleteNumToImage.height;            
        }
            
        if(OS_IOS){
	        $.incomCircle.applyProperties({
	            width : incompleteCircleWidthHeight,
	            height : incompleteCircleWidthHeight,
	            top : topPosition,
	            left : 100,
	            borderRadius : incompleteCircleWidthHeight/2,
	            visible : true
	        });
        } else {
        
            topPosition = -85;
    	    var incompleteCircleWidthHeightCalibration = util.toImageCalibrationForAndroid(incompleteCircleWidthHeight);
            $.incomCircle.width = incompleteCircleWidthHeightCalibration;
            $.incomCircle.height = incompleteCircleWidthHeightCalibration;
            $.incomCircle.top = topPosition;
            $.incomCircle.right = "34%";
            $.incomCircle.borderRadius = incompleteCircleWidthHeightCalibration / 2;
            $.incomCircle.visible = true;
        	
        }
    } else {
        $.incomCircle.setVisible(false);
    }
    
    var dutyUnsync = homeQuery.countDutyUnAssigned();    
    if (dutyUnsync > 0) {
        $.unsyncNum.setText(dutyUnsync);
        var unsyncNumToImage = $.unsyncNum.toImage();
        var unsyncNumCircleWidthHeight = 0;
        var topPosition = -95;
        
        unsyncNumCircleWidthHeight = unsyncNumToImage.width;
        if(unsyncNumToImage.width > unsyncNumToImage.height) {
            unsyncNumCircleWidthHeight = unsyncNumToImage.width;
        } else {
            unsyncNumCircleWidthHeight = unsyncNumToImage.height;            
        }   
        
		if(OS_IOS){
	        $.crewCircle.applyProperties({
	            width : unsyncNumCircleWidthHeight,
	            height : unsyncNumCircleWidthHeight,
	            top : topPosition,
	            left : 100,
	            borderRadius : unsyncNumCircleWidthHeight/2,
	            visible : true
	        });
       }
       
       if(OS_ANDROID)
       {
            topPosition = -85;
            var unsyncNumCircleWidthHeightCalibration = util.toImageCalibrationForAndroid(unsyncNumCircleWidthHeight);
            $.crewCircle.width = unsyncNumCircleWidthHeightCalibration;
            $.crewCircle.height = unsyncNumCircleWidthHeightCalibration;
            $.crewCircle.top = topPosition;
            $.crewCircle.right = "34%";
            $.crewCircle.borderRadius = unsyncNumCircleWidthHeightCalibration / 2;
            $.crewCircle.visible = true;
       }
       if(clearFlag == 1){
         $.incomCircle.setVisible(false);
         clearFlag = 0;
       }
       
    } else {
        $.crewCircle.setVisible(false);
    }
}

function checkDisplayHideSyncButton() {

    if (Titanium.Network.networkType == Titanium.Network.NETWORK_NONE) {
        $.btnSync.hide();
    } else {
        $.btnSync.show();
    }

    //Check show/hide close flight button
    var timeNow = new Date();
    var etaTime = null;
    if (flight != null) {
        if (flight.ETA != "") {
            etaTime = new Date(flight.ETA);
        } else {
            etaTime = new Date(flight.STA);
        }

        if (etaTime != null) {
            if (etaTime.getTime() > timeNow.getTime()) {
                //				$.closeFlight.hide();
                closeFlightEnabled = false;
                // closeFlightEnabled = true;
            } else {
                //				$.closeFlight.show();
                closeFlightEnabled = true;
            }
        }
    }
    timeNow = null;
    etaTime = null;

}

//************************************
//* Main begin
//************************************

// insertHomeDummy();
flight = homeQuery.getFlightDetails();
$.version.setText("v." + Ti.App.version);
if (flight != null) {
    currentFlightId = flight.id;
    flightExternalId = flight.flightExternalId;
    var userId = homeQuery.getUserId();
    user = homeQuery.getUserDetailsFromCrew(userId.id + "_" + currentFlightId);
    setText();
}else {
	// Ti.API.info('clear');
	clearText();
}

if (OS_IOS) {
    Alloy.Globals.navGroupWin = $.navGroupWin;
    var syncTimeInterval = Alloy.CFG.syncInterval;
	if (syncTimeInterval > 0 && !sync.isBackgroundSyncActivated()) {
	    syncInterval = setInterval(function() {
	    	if (Titanium.Network.networkType != Titanium.Network.NETWORK_NONE) {
	    		Ti.API.info("startSync: " + sync.startSync());
	    		if(sync.startSync()){
	    			sync.startSyncBackground();
	    		}
	    	}
	    }, syncTimeInterval * 1000);
	}
}

var testFile = Ti.Filesystem.applicationDataDirectory;
var DBPATH = testFile.replace('Documents/', 'Library/Private Documents/');

Ti.API.info('DB PATH : ', DBPATH);
// Ti.API.info('testFile : ', testFile);
function updateClassCount()
{
	if (flight != null) {
		updatePassengerCount();
		
	}else {
		// Ti.API.info('clear');
		clearText();
	}
	
}

$.homeWindow.addEventListener('focus', function() {
	if(logTemp.length > 0){
		var logMsg = "";
		var isInternet = false;
		var isWrong = false;
		var isTimeout = false;
		for(var i=0;i<logTemp.length;i++){
			switch(logTemp[i].type){
				case 1 :
					if(!isInternet){
						logMsg += "No internet connection.\nPlease connect to Wifi or cellular in order to sync data.";
						isInternet = true;
					}
					break;
				case 2 :
					if(!isWrong){
						logMsg += "Wrong internet connection. Please change or authenticate it.\nThen please try to re-sync.";
						isWrong = true;
					}
					break;
				case 3 :
					if(!isTimeout){
						logMsg += "Synced timeout.\nPlease try to re-sync.";
						isTimeout = true;
					}
					break;
			}
		}
		var _promptView = new Alloy.createController("common/alertPrompt", {
            title : "Error",
            message : logMsg,
            okText : "OK",
            disableCancel : true,
            onOk : function() {
            }
        }).getView();
        _promptView.open();
        logTemp = [];
	}
	
	
	if(homeIsRefreshFromSync){
		updateClassCount();
   		homeIsRefreshFromSync = false;
   		Ti.API.info('homeIsRefreshFromSync');
   		flight = homeQuery.getFlightDetails();
		if(flight.lastSync != ""){
        	var lastSyncDate = new Date(flight.lastSync);
        	$.lastSync.setText(("0" + lastSyncDate.getDate()).slice(-2) + "/" + ("0" + (lastSyncDate.getMonth() + 1)).slice(-2) + "/" + lastSyncDate.getFullYear() + " " + ("0" + lastSyncDate.getHours()).slice(-2) + ":" + ("0" + lastSyncDate.getMinutes()).slice(-2) + ":" + ("0" + lastSyncDate.getSeconds()).slice(-2));
        }else{
        	$.lastSync.setText("");
        }
        
        if(flight.lastModified != ""){
	        var lastModifiedDate = new Date(flight.lastModified);
	        $.lastModified.setText(("0" + lastModifiedDate.getDate()).slice(-2) + "/" + ("0" + (lastModifiedDate.getMonth() + 1)).slice(-2) + "/" + lastModifiedDate.getFullYear() + " " + ("0" + lastModifiedDate.getHours()).slice(-2) + ":" + ("0" + lastModifiedDate.getMinutes()).slice(-2) + ":" + ("0" + lastModifiedDate.getSeconds()).slice(-2));
        }else{
        	$.lastModified.setText("");
        }
   	}
    refresherFunction();
    interval = setInterval(function() {
        checkDisplayHideSyncButton();
    }, 1000);
    
    if(OS_ANDROID)
    {
    	$.anActIndicatorView.hide();
    }
    
});

$.homeWindow.addEventListener('blur', function() {
    clearInterval(interval);
});

/* --- Event listeners ---- */
$.imgLOPA.addEventListener('click', function() {
    if(OS_IOS){
    	Alloy.Globals.activityIndicator.show();	
    }
    
    if(OS_ANDROID)
    {
    	$.anActIndicatorView.show();
    }
    setTimeout(function() {
        btnLOPA();
        
    }, 10);
});

$.imgPassenger.addEventListener('click', function() {
    if(OS_IOS){
    	Alloy.Globals.activityIndicator.show();	
    }
    
    if(OS_ANDROID)
    {
    	$.anActIndicatorView.show();
    }
    setTimeout(function() {
        btnPassengerlist();
        
    }, 10);
});

$.imgAvailable.addEventListener('click', function() {
    if(OS_IOS){
    	Alloy.Globals.activityIndicator.show();	
    }
    if(OS_ANDROID)
    {
    	$.anActIndicatorView.show();
    }
    setTimeout(function() {
        btnAvailableseat();
        
    }, 10);
});

$.imgCrewlist.addEventListener('click', function() {
    if(OS_IOS){
    	Alloy.Globals.activityIndicator.show();	
    }
    
    if(OS_ANDROID)
    {
    	$.anActIndicatorView.show();
    }
    setTimeout(function() {
        btnCrewlist();
        
    }, 10);
});

$.imgIncident.addEventListener('click', function() {
    if(OS_IOS){
    	Alloy.Globals.activityIndicator.show();	
    }
    if(OS_ANDROID)
    {
    	$.anActIndicatorView.show();
    }
    setTimeout(function() {
        btnIncident();
    }, 10);
});

$.imgSafety.addEventListener('click', function() {
    if(OS_IOS){
    	Alloy.Globals.activityIndicator.show();	
    }
    if(OS_ANDROID)
    {
    	$.anActIndicatorView.show();
    }
    setTimeout(function() {
        btnSafety();
        
    }, 10);
});

$.imgEdocument.addEventListener('click', function() {
    if(OS_IOS){
    	Alloy.Globals.activityIndicator.show();	
    }
    if(OS_ANDROID)
    {
    	$.anActIndicatorView.show();
    }
    setTimeout(function() {
        btnEdocument();
        
    }, 10);
});

function closeOptionalDialogue()
{
	openOptionalDialogue = false;
}

$.imgApps.addEventListener('click', function() {
    
    if(OS_ANDROID){
        if(!openOptionalDialogue){
        	openOptionalDialogue = true;
        }
        else{
        	return;
        }
   	}
   	
    setTimeout(function() {
        btnApps();
    }, 10);
});

// Touch event to view log
var isViewLogMode = false;
$.btnLogout.addEventListener('touchstart', function(e) {
    timeout = setTimeout(function(e) {
        isViewLogMode = true;
        _viewLogPrompt = new Alloy.createController("common/logoutPrompt", {
            title : "View Log",
            message : "Would you like to view error log?",
            logoutText : "Logout",
            okText : "View Log",
            cancelText : "Cancel",
            onLogout : function() {
                onLogout();
            },
            onOk : function() {
                onViewLog();
            },
            onCancel : function() {
                // Do nothing
            }
        }).getView();
        _viewLogPrompt.open();
    }, holdTime);
});

$.btnLogout.addEventListener('touchend', function(e) {
    if (!isViewLogMode) {
        btnLogout();
    }

    isViewLogMode = false;
    clearTimeout(timeout);
});

if(OS_ANDROID){
	$.homeWindow.addEventListener('android:back', function(e) {
		Ti.API.info("Press Back button");
		// $.homeWindow.close();
	});
}

/*
if(OS_ANDROID){
	$.homeWindow.addEventListener('android:back', function(e) {
	    //e.cancelBubble = true;
		//Ti.API.info("Press Back button");
		if (!isViewLogMode) {
        	btnLogout();
	    }
	
	    isViewLogMode = false;
	    clearTimeout(timeout);
		
	    //Ti.App.fireEvent('android_back_button');
	});
}
*/

//************************************
//* Main end
//************************************