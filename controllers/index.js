$.indexWindow.open();
$.activityIndicator.show();

var query_lib = require('query_lib');
var sync_lib = require('sync_lib');
var force = require('force');
var user_lib = require('user_lib');

var _logoutPromptView = null;

function loadingToLoginView() {
	query_lib.alterDB();
	if(OS_IOS){
		Alloy.Globals.activityIndicator.hide();
	}
	var user = user_lib.getUser();
	
	if (user == null) {
		var loginView = Alloy.createController("login").getView();
		loginView.open();
	}
	else {
		var home = Alloy.createController("home", {}).getView();
		home.open();
	}
}

function onLogin() {
	if(OS_IOS){
		Alloy.Globals.activityIndicator.show();
	}
	setTimeout(function() {
		loadingToLoginView();
	}, 500);
	
	_logoutPromptView = null;
}

function onCancel() {
	_logoutPromptView = null;
	
	$.activityIndicator.hide();
	$.loginButton.show();
	
	$.indexWindow.open();
}

function syncCheckAuthentication() {
	// Ti.API.info("checking authentication");
	var checkHttpClient = Titanium.Network.createHTTPClient({
		timeout : 5 * 1000, // 5 seconds
		onerror : function(e) {
			// Ti.API.error("authentication fail.");
			force.logout();

			Alloy.Globals.navGroupWin = null;
			var loginView = Alloy.createController("login").getView();
			loginView.open();
		},
		onload : function(e) {
			var home = Alloy.createController("home", {}).getView();
			home.open();

		}
	});
	var url = Alloy.CFG.instanceURL + "/services/apexrest/flight";
	// Ti.API.info(url);
	checkHttpClient.open("GET", url);
	checkHttpClient.setRequestHeader("content-type", "application/json");
	checkHttpClient.setRequestHeader("Authorization", "OAuth" + " " + Alloy.CFG.accessToken);
	checkHttpClient.send();

}

setTimeout(function() {
	loadingToLoginView();
	$.indexWindow.close();
}, 300);
