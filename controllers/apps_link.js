var args = arguments[0] || {};

Titanium.Platform.openURL(args.url);


if (OS_ANDROID) {
	$.webWindow.addEventListener("android:back", function(e) {
		$.webWindow.close();
	});
}



/*
$.webView.url = args.url;
Ti.App.fireEvent('show_indicator');
//Alloy.Globals.activityIndicator.show();

var self = $.webWindow;

function cancel() {
	self.close();
}

if (Ti.Platform.osname !== 'android') {
	var b = Ti.UI.createButton({
		title : 'Cancel',
		style : Ti.UI.iOS.SystemButtonStyle.PLAIN
	});
	//self.setRightNavButton(b);
	b.addEventListener('click', cancel);
} else {
	self.addEventListener('android:back', cancel);
	self.addEventListener('open', function() {
		//Also, do a special activity indicator for android
		ind = Ti.UI.createActivityIndicator({
			location : Ti.UI.ActivityIndicator.STATUS_BAR,
			type : Ti.UI.ActivityIndicator.DETERMINANT,
			message : 'Loading...',
		});
	});
}

$.webView.addEventListener('load', function(e) {
	var cookies = $.webView.evalJS("document.cookie").split(";");
	for ( i = 0; i <= cookies.length - 1; i++) {
	}

	if (e.url == 'https://thaiairways--uat.lightning.force.com/one/one.app') {
		Ti.App.fireEvent('hide_indicator');
		//Alloy.Globals.activityIndicator.hide();
	} else if (e.url == 'http://www2.thaiairways.com/cse/SalesforceLogin.html') {
		Ti.App.fireEvent('hide_indicator');
		//Alloy.Globals.activityIndicator.hide();
	} else {
		Ti.App.fireEvent('show_indicator');
		//Alloy.Globals.activityIndicator.show();
	}
});

$.webView.addEventListener('error', function(e) {
	//Alloy.Globals.activityIndicator.hide();
	alert(String.format('Error: "%s". Url: "%s"', e.message, e.url));
});
*/