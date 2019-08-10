//**********************************************
//* Require
//**********************************************
var args = arguments[0] || {};
var sync_lib = require('sync_lib');
var query_lib = require('query_lib');
var delete_data = require('delete_data');
var force = require('force');
var user_lib = require('user_lib');

//**********************************************
//* Variable Declaration
//**********************************************

var isError = false;
var dataIndex = 0;

var totalData = 19;

// Ti.API.info("Total data core:");
// Ti.API.info(totalData);

var _loginPromptView;

var emptyView = Ti.UI.createView({});
$.syncWindow.leftNavButton = emptyView;

var newStatusListOfLopaPosition = [];
var passengerListWhoHaveUpgradedOrChangedSeat = [];

var isComplete = true;

//var lopa = query_lib.testGetLOPA(flightInformation.id);

//**********************************************
//* Function
//**********************************************
function strForQuery(value) {
    return value != null ? value : "";
}

function boolForQuery(value) {
    if (value == null || !value) {
        return 0;
    } else {
        return 1;
    }
}

function startSync() {
	if (OS_IOS) {
		Titanium.App.idleTimerDisabled = true;
	} 
	isComplete = true;
	
	Ti.API.info('Start Sync to sfdc');
	Alloy.Globals.syncTimeNow = new Date();
	
	newStatusListOfLopaPosition = query_lib.getNewStatusListOfLopaPosition();
	passengerListWhoHaveUpgradedOrChangedSeat = query_lib.getPassengerListWhoHaveUpgradedOrChangedSeat();	
	//delete_data.deleteFlight();
	//delete_data.deleteUser();
	
	startSyncCrewDutyPost();
	
}

function startSyncCrewDutyPost() {
	$.progressText.text = 'Synchronizing Crew Duty Assignment...';
	setTimeout(function() {
		sync_lib.syncCrewDutyPost(function(length) {
			//$.salesVisitPb.max = length;
			//dummyCount = length;
			
		}, function(index) {
			//$.salesVisitPb.value = (1.0/dummyCount) * index;
		},
		finishSyncCrewDutyPost,
		syncError);
	}, 100);
}

function finishSyncCrewDutyPost() {

	dataIndex++;
	$.dataPb.value = dataIndex / totalData;
	startSyncPsychologyPost();
}

function startSyncPsychologyPost() {
	$.progressText.text = 'Synchronizing Passenger Psychology...';
	setTimeout(function() {
		sync_lib.syncPsychologyPost(function(length) {
			//$.salesVisitPb.max = length;
			//dummyCount = length;
		}, function(index) {
			//$.salesVisitPb.value = (1.0/dummyCount) * index;
		}, finishSyncPsychologyPost);
	}, 100);
}

function finishSyncPsychologyPost() {

	dataIndex++;
	$.dataPb.value = dataIndex / totalData;
	startSyncFlight();
}

function startSyncFlight() {
    // Ti.API.info(Alloy.Globals.instanceUrl);
    // Ti.API.info(Alloy.Globals.accessToken);
    
    $.progressText.text = 'Synchronizing Flight...';
    setTimeout(function() {
        sync_lib.syncFlight(function(length) {
        }, function(index) {
        }, 
        finishSyncFlight,
        syncError
        );
    }, 100);
}

function finishSyncFlight(isFinishedSync) {

    Ti.API.info('FinishSyncingFlight');
    Ti.API.info('isFinishedSync ' + isFinishedSync);
    dataIndex++;
    $.dataPb.value = dataIndex / totalData;     
    startSyncROPEnrollmentPost();
}

function startSyncROPEnrollmentPost() {
    $.progressText.text = 'Synchronizing Update ROP Enrollment...';
    setTimeout(function() {
        sync_lib.syncROPEnrollmentPost(function(length) {
            //$.salesVisitPb.max = length;
            //dummyCount = length;
        }, function(index) {
            //$.salesVisitPb.value = (1.0/dummyCount) * index;
        }, finishSyncROPEnrollmentPost);
    }, 100);
}

function finishSyncROPEnrollmentPost() {
    dataIndex++;
    $.dataPb.value = dataIndex / totalData;
//    startSyncROPEnrollmentGet();
    startSyncROPEnrollmentAttachment();
}

function startSyncROPEnrollmentAttachment() {
    $.progressText.text = 'Synchronizing ROP Enrollment Attachment...';
    setTimeout(function() {
        sync_lib.syncROPEnrollmentAttachment(function(length) {
        }, function(index) {
        }, finishSyncROPEnrollmentAttachment);
    }, 100);
}

function finishSyncROPEnrollmentAttachment() {
    dataIndex++;
    $.dataPb.value = dataIndex / totalData; 
    startSyncROPEnrollmentGet();
}

function startSyncROPEnrollmentGet() {
    $.progressText.text = 'Synchronizing ROP Enrollment...';
    setTimeout(function() {
        sync_lib.syncROPEnrollmentGet(function(length) {

        }, function(index) {

        }, finishSyncROPEnrollmentGet);
    }, 100);
}

function finishSyncROPEnrollmentGet() {

    dataIndex++;
    $.dataPb.value = dataIndex / totalData;
    startSyncCrewApprailsalPost();
}

function startSyncCrewApprailsalPost() {
    $.progressText.text = 'Synchronizing Update Crew Appraisal...';
    setTimeout(function() {
        sync_lib.syncCrewAppraisalPost(function(length) {
        }, function(index) {
        }, finishSyncCrewApprailsalPost);
    }, 100);
}

function finishSyncCrewApprailsalPost() {

    dataIndex++;
    $.dataPb.value = dataIndex / totalData;
    startSyncUpgradeSeatPost();
}

function startSyncUpgradeSeatPost() {
    $.progressText.text = 'Synchronizing Upgrade Seat...';
    setTimeout(function() {
        sync_lib.syncUpgradeSeatPost(function(length) {
        }, function(index) {
        }, finishSyncUpgradeSeatPost);
    }, 100);
}

function finishSyncUpgradeSeatPost() {

    dataIndex++;
    $.dataPb.value = dataIndex / totalData;
    startSyncIncidentPost();
}

function startSyncIncidentPost() {
    $.progressText.text = 'Synchronizing Update Incidents...';
    setTimeout(function() {
        sync_lib.syncIncidentPost(function(length) {
            //$.salesVisitPb.max = length;
            //dummyCount = length;
        }, function(index) {
            //$.salesVisitPb.value = (1.0/dummyCount) * index;
        }, 
        false,
        finishSyncIncidentPost);
    }, 100);
}

function finishSyncIncidentPost() {

    dataIndex++;
    $.dataPb.value = dataIndex / totalData;
    startSyncIncidentCompensationAttachment();
}

//* change here.......
function startSyncIncidentCompensationAttachment() {
    $.progressText.text = 'Synchronizing Compensation Attachment...';
    setTimeout(function() {
        sync_lib.syncCompensationAttachment(function(length) {
        }, function(index) {
        }, finishSyncIncidentCompensationAttachment);
    }, 100);
}

function finishSyncIncidentCompensationAttachment() {
    dataIndex++;
    $.dataPb.value = dataIndex / totalData; 
    startSyncIncidentAttachment();
}

function startSyncIncidentAttachment() {
    $.progressText.text = 'Synchronizing Incident Attachment...';
    setTimeout(function() {
        sync_lib.syncIncidentAttachment(function(length) {
        }, function(index) {
        },
        false,
        finishSyncIncidentAttachment);
    }, 100);
}

function finishSyncIncidentAttachment() {
    dataIndex++;
    $.dataPb.value = dataIndex / totalData; 
    startSyncCompleteIncidents();
}

function startSyncCompleteIncidents() {
    $.progressText.text = 'Completing Incidents...';
    setTimeout(function() {
        sync_lib.syncCompleteIncidents(function(length) {
        }, function(index) {
        },
        false,
        finishSyncCompleteIncidents);
    }, 100);
}

function finishSyncCompleteIncidents() {
    dataIndex++;
    $.dataPb.value = dataIndex / totalData;
    startSyncIncidentGet();
}

function startSyncIncidentGet() {
    $.progressText.text = 'Synchronizing Incidents...';
    setTimeout(function() {
        sync_lib.syncIncidentGet(function(length) {

        }, function(index) {

        }, finishSyncIncidentGet);
    }, 100);
}

function finishSyncIncidentGet() {

    dataIndex++;
    $.dataPb.value = dataIndex / totalData;
    startSyncFeedback();
}

function startSyncFeedback() {
	// Ti.API.info(Alloy.Globals.instanceUrl);
	// Ti.API.info(Alloy.Globals.accessToken);
	
	$.progressText.text = 'Synchronizing Passenger Feedback...';
	setTimeout(function() {
		sync_lib.syncFeedback(function(length) {
		}, function(index) {
		}, 
		finishSyncFeedback,
		syncError
		);
	}, 100);
}

function finishSyncFeedback(isFinishedSync) {

	Ti.API.info('FinishSyncingFeedback');
	Ti.API.info('isFinishedSync ' + isFinishedSync);
	dataIndex++;
	$.dataPb.value = dataIndex / totalData;		
	startSyncPassenger();
}


function startSyncPassenger() {
	$.progressText.text = 'Synchronizing Passengers...';
	setTimeout(function() {
		sync_lib.syncPassengers(function(length) {
			//$.salesVisitPb.max = length;
			//dummyCount = length;
		}, function(index) {
			//$.salesVisitPb.value = (1.0/dummyCount) * index;
		}, finishSyncingPassenger
		);
	}, 100);
}

function finishSyncingPassenger(isFinishedSync) {

	Ti.API.info("FinishSyncingPassenger");
	Ti.API.info("isFinishedSync " + isFinishedSync);
	dataIndex++;
	$.dataPb.value = dataIndex / totalData;
	
	startSyncLOPA();
}

function startSyncLOPA() {
	$.progressText.text = 'Synchronizing LOPA...';
	setTimeout(function() {
		sync_lib.syncLOPA(function(length) {
			//$.salesVisitPb.max = length;
			//dummyCount = length;
		}, function(index) {
			//$.salesVisitPb.value = (1.0/dummyCount) * index;
		}, finishSyncLOPA
		);
	}, 100);
}

function finishSyncLOPA(isFinishedSync) {

	Ti.API.info("finishSyncLOPA");
	Ti.API.info("isFinishedSync " + isFinishedSync);
	dataIndex++;
	$.dataPb.value = dataIndex / totalData;
	startSyncMasterData();
}

function startSyncMasterData() {
    $.progressText.text = 'Synchronizing Master Data...';
    setTimeout(function() {
        sync_lib.syncMasterData(function(length) {
        }, function(index) {
        }, finishSyncMasterData
        );
    }, 100);
}

function finishSyncMasterData(isFinishedSync) {

    Ti.API.info("finishSyncMasterData");
    Ti.API.info("isFinishedSync " + isFinishedSync);
    dataIndex++;
    $.dataPb.value = dataIndex / totalData;
    startSyncCrewImages();
}

function startSyncCrewImages() {
	$.progressText.text = 'Synchronizing Crew Images...';
	setTimeout(function() {
		sync_lib.syncCrewImages(function(length) {
			//$.salesVisitPb.max = length;
			//dummyCount = length;
		}, function(index) {
			//$.salesVisitPb.value = (1.0/dummyCount) * index;
		}, finishSyncCrewImages);
	}, 100);
}

function finishSyncCrewImages(crewImages) {
	dataIndex++;
	$.dataPb.value = dataIndex / totalData;	
	startSyncEDocument();
}

function startSyncEDocument() {
	$.progressText.text = 'Synchronizing E-Document...';
	setTimeout(function() {
		sync_lib.syncEdocumentGet(function(length) {

		}, function(index) {

		}, finishSyncEDocument);
	}, 100);
}

function finishSyncEDocument(documents) {
	dataIndex++;
	$.dataPb.value = dataIndex / totalData;
	try {
		if (documents) {
			
		}
	} catch(e) {
		Ti.API.error(e);
	}
	syncComplete();
}

function syncComplete() {

	Ti.API.info("syncComplete");
	sync_lib.syncComplete();
	Alloy.Globals.syncFinished = 1;

    query_lib.updateNewStatusOfLopaPosition(newStatusListOfLopaPosition);
    query_lib.updatePassengerWhoHaveUpgradedOrChangedSeat(passengerListWhoHaveUpgradedOrChangedSeat);	
	setTimeout(function(e) {
		//var lopaView = Alloy.createController("/lopa/lopa", {}).getView();
		//lopaView.open();
		if(isComplete){
			if(!Alloy.Globals.initialSynced){
				Alloy.Globals.initialSynced = true;
				var homeView = Alloy.createController("home", {}).getView();
				homeView.open();
			}
			$.syncWindow.close();
			if(OS_ANDROID){
				$.syncWindow.removeAllChildren();
				$.syncWindow = null;
			}
			isComplete = false;
		}
	}, 100);
	homeIsRefreshFromSync = true;
}

function showCantReachAuthentication(error) {
	Ti.API.info(error);
	// var dialog = Titanium.UI.createAlertDialog({
	// buttonNames: ["Login", "Skip"],
	// title: 'Unable to reach Salesforce.com authentication service',
	// message: error.error_description
	// });
	// dialog.addEventListener('click',function(e) {
	// switch (e.index) {
	// case 0:
	// var loginView = Alloy.createController("Login", {}).getView();
	// loginView.open();
	// $.syncWindow.close();
	// $.syncWindow = null;
	// break;
	// case 1:
	// isError = false;
	// syncComplete();
	// break;
	// }
	// });
	// dialog.show();
}

function showSalesforceUnavailable(e) {
	Ti.API.info(e);
	// var dialog = Titanium.UI.createAlertDialog({
	// buttonNames: ["Retry", "Skip"],
	// title: 'Salesforce.com service is unavailable',
	// message: e.source.responseText.message
	// });
	// dialog.addEventListener('click',function(e) {
	// switch (e.index) {
	// case 0:
	// startSync();
	// break;
	// case 1:
	// isError = false;
	// syncComplete();
	// break;
	// }
	// });
	// dialog.show();
}

function syncError(e) {
	//isError = true;
	//syncComplete();
	Ti.API.error(e);
	if (e.code == 401 || e.source.status == 401) {
		var user = user_lib.getUser();
		if(user){
		user_lib.authorize({
			username: user.username,
			password: user.password,
			success: function(user) {
				delete_data.deleteAuthentication();
				user_lib.insertUpdateUserAuthen(user);
				Alloy.Globals.instanceUrl = user.instanceUrl;
				if(Alloy.Globals.instanceUrl.slice(-1) != "/")
				{
					Alloy.Globals.instanceUrl += "/";
				}
				Alloy.Globals.accessToken = user.accessToken;
				
				startSync();
			},
			error: function(err) {
				_loginPromptView = new Alloy.createController("common/alertPrompt", {
					title : "Authentication Problem",
					message: "There was a problem trying to reauthenticate your user. Retry or continue to work?",
					okText: "Retry",
					cancelText: "Continue",
					onOk: function() {
						onLogin();
					},
					onCancel: function() {
						onContinue();
					}
				}).getView();
				_loginPromptView.open();
			}
		});
		
		/*
		// Session expired. Refresh token
		force.refreshToken(
			function() {	
				// Refresh success. Rerun current function
				startSync();
			}, 
			function() {	// Refresh fail
				_loginPromptView = new Alloy.createController("common/alertPrompt", {
					title : "Session Expired",
					message: "Your session has expired. Re-login is required.",
					okText: "Login",
					cancelText: "Continue",
					onOk: function() {
						onLogin();
					},
					onCancel: function() {
						onContinue();
					}
				}).getView();
				_loginPromptView.open();
			}
		);
		*/
		}
	}
	else if (e.code == 403 || e.source.status == 403) {
		// Password expired
		
	}
	else if (e.code == -1 || e.code == -1001 || e.code == 500 || e.source.status == 0 || e.source.status == -1005 || e.source.status == -1100) {
		// Internal error
		// Do nothing but log the errors
	}
	else {
		// Do nothing
	}
}

function onLogin() {
	
	var loginView = Alloy.createController("login").getView();
	loginView.open();
	
	/*
	force.logout(function() {
		var loginView = Alloy.createController("login").getView();
		loginView.open();
	},
	function () {
		
	});
	*/
	
	$.syncWindow.close();
	_loginPromptView = null;
}

function onContinue() {
	var homeView = Alloy.createController("home", {}).getView();
	homeView.open();
	
	$.syncWindow.close();
	_loginPromptView = null;
}

//**********************************************
//* Main
//**********************************************

$.activityIndicator.show();
setTimeout(function(e) {
	Ti.API.info('Network' + Titanium.Network.networkType);
	Ti.API.info('None ' + Titanium.Network.NETWORK_NONE);
	startSync();
	// if (Titanium.Network.networkType != Titanium.Network.NETWORK_NONE) {
		// // Start synchronization process
		// Ti.API.info('Start Sync');
		// startSync();
	// } else {
		// Ti.API.info("Finish sync already!!!");
		// $.syncWindow.close();
		// //var home = Alloy.createController("Home", {}).getView();
		// //home.open();
	// }
}, 100);

if (OS_ANDROID) {
	$.syncWindow.addEventListener("android:back", function(e) {
		// do nothing
	});
}

//**********************************************
//* End Main
//**********************************************

