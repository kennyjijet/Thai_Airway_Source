// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var sync = require("sync_lib");

var args = $.args;
var currentDateTimeMins = args.currentDateTimeMins;
var flightStdMins = args.flightStdMins;
var interval, waittime = 30;	// 30 seconds

function onSync() {
	clearInterval(interval);
	if (((flightStdMins - currentDateTimeMins) <= 180) && ((flightStdMins - currentDateTimeMins) > 90)) {
		sync.set3HrCompleted(true);
	}
	else if ((flightStdMins - currentDateTimeMins) <= 90) {
		sync.set1Hr30MinCompleted(true);
	}
	Alloy.Globals.navGroupWin.openWindow(Alloy.createController("sync").getView());
	$.syncPromptWin.close();
}

function onCancel(e, onCancelFunc) {
	sync.setSyncInprogress(false);
	$.syncPromptWin.close();
	
	clearInterval(interval);
}

function checkDisplaySyncTimeout() {
	waittime -= 1;
	if (waittime < 1) {
		onSync();
		clearInterval(interval);
	}
	else {
		$.countdownLabel.text = " (" + waittime + ")";
	}
	
}

$.countdownLabel.text = " (" + waittime + ")";
interval = setInterval(function() {
	checkDisplaySyncTimeout();
}, 1000);


if(OS_ANDROID){
	$.syncPromptWin.addEventListener('android:back', function(e) {
	    Ti.API.info("Press Back button");
		$.syncPromptWin.close();
	});
}
