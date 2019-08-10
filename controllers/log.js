// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var log_lib = require('log_lib');

var logs = [];
/*---- Function declarations --- */
function displayLogs() {
	logs = [];
	logs = log_lib.retrieveLogs();
	if (logs != null && logs.length > 0) {
		
		var tableData = [];
		for (var i = 0; i < logs.length; i++) {
			var log = logs[i];
			
			var color = "black";
			if (log.type == 2) {
				color = "blue";
			}
			else if (log.type == 3) {
				color = "red";
			}
			
			var title = $.UI.create("Label", {
				text: log.module + ", " + log.timestamp,
				top: 5,
				left: 15,
				height: Ti.UI.SIZE,
				classes: ["fontBold16"],
				color: color
			});
			
			var desc = $.UI.create("Label", {
				text: log.description,
				//top : 5,
				left: 15,
				bottom: 5,
				classes: ["fontLight14"],
				color: color
			});
			
			var row = $.UI.create("TableViewRow", {
				className: "row",
				layout: 'vertical',
				height: Ti.UI.SIZE
			});
			
			row.add(title);
			row.add(desc);
			
			tableData.push(row);
		}
		
		$.logTableView.setData(tableData);
		
		tableData = null;
		logs = null;
	}

}

function onClearLog() {
	log_lib.clearErrorLog();
	$.logTableView.removeAllChildren();
	$.logTableView.setData([]);
	setTimeout(function() {
		displayLogs();
	}, 100);
}

/*---- End function declarations --- */

if(OS_IOS) { 
	Alloy.Globals.activityIndicator.show(); 
}else{
	$.anActIndicatorView.show();	
}
setTimeout(function() {
	displayLogs();
	if(OS_IOS) { 
		Alloy.Globals.activityIndicator.hide(); 
		
	}else{
		$.anActIndicatorView.hide();
	}
	
}, 100);


if(OS_ANDROID){
	$.logWin.activity.onCreateOptionsMenu = function(e) { 
        var menuItem = e.menu.add({ 
        title: "Clear Log",  
        showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM 
    }); 
        menuItem.addEventListener("click", function(e) { 
            onClearLog();
        }); 
    };
	$.logWin.addEventListener('android:back', function(e) {
	    Ti.API.info("Press Back button");
		$.logWin.close();
	});
}



