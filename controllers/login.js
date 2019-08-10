var force = require('force');
var user_lib = require('user_lib');
var log = require('log_lib');

var holdTime = 5000, timeout;
var isSFDCMode = false;

$.username.value = "";
$.password.value = "";


if(OS_IOS)
{
	$.anActIndicatorView.hide() ;
	
}

if(OS_ANDROID)
{
  	$.anActIndicatorView.hide() ;
		
}

if(OS_ANDROID)
{
	$.username.height = '55dp';
	$.password.height = '55dp';	
	$.loginButton.height = '55dp';
	
	$.username.font = {
    	fontSize : '20sp'
	};

	$.password.font = {
    	fontSize : '20sp'
	};
	
	$.loginButton.font = {
    	fontSize : '20sp'
	};
	
	/*
	var windowTitle = Ti.UI.createLabel({
    	color: '#fff',
    	font: {
        	fontSize: "20sp",
        	fontWeight: 'bold'
    	},
    	text: 'Login to THAI ssirways'
	});
		
	$.loginWindow.titleControl = windowTitle;
	*/
	
}


function onLogin() {
	//$.loginButton.setTouchEnabled(false);
	if ($.username.value == null || $.username.value == "" || $.password.value == null || $.password.value == "") {
		
		//$.loginButton.setTouchEnabled(true);
		if(OS_IOS){
			Alloy.Globals.activityIndicator.hide();
		}
		if(OS_ANDROID)
		{
		  	$.anActIndicatorView.hide() ;
				
		}
		$.errorMessage.text = "Please enter username and password";
	}
	else if (Titanium.Network.networkType == Titanium.Network.NETWORK_NONE) {
		if(OS_IOS){
			Alloy.Globals.activityIndicator.hide();	
		}
		if(OS_ANDROID)
		{
		  	$.anActIndicatorView.hide() ;
				
		}
		$.errorMessage.text = "No internet connection.";
	}
	else {
		if(OS_IOS){
			Alloy.Globals.activityIndicator.show();
		}
		if(OS_ANDROID)
		{
			Ti.API.info('Show indicator');
			$.anActIndicatorView.show() ;
				
		}
		$.errorMessage.text = "";
		
		user_lib.authorize({
			username : $.username.value,
			password : $.password.value,
			success : function(user) {
				//Ti.API.info('User ' + user);
				//Ti.API.info('user.instanceUrl ' + user.instanceUrl);
				//Ti.API.info('user.accessToken '+user.accessToken);
				
				if(user && user.instanceUrl && user.accessToken){
					user_lib.insertUpdateUserAuthen(user);
					Alloy.Globals.instanceUrl = user.instanceUrl;
					if(Alloy.Globals.instanceUrl.slice(-1) != "/")
					{
						Alloy.Globals.instanceUrl += "/";
					}
					Alloy.Globals.accessToken = user.accessToken;
					
					
					
					var syncView = Alloy.createController("sync", {}).getView();
					syncView.open();
					
					
					
					if(OS_IOS){
						Alloy.Globals.activityIndicator.hide();
					}
					
					if(OS_ANDROID)
					{
						setTimeout(function(e) {
							$.anActIndicatorView.hide() ;
								
							$.loginWindow.close();		
						}, 2000);
					}
					
					if(OS_IOS)
					{
						$.loginWindow.close();
					}
					
				}else{
					if(OS_IOS){
						Alloy.Globals.activityIndicator.hide();
					}
					
					Ti.API.error('User is Null');
				
				}
				
				if(OS_ANDROID)
				{
					setTimeout(function (){
						$.anActIndicatorView.hide();
					}, 2000);
				}
				
			},
			error: function(err) {
				Ti.API.error(err);
				log.logError(err, "Authentication");
				
				$.errorMessage.text = "Unable to login. Please check your username and password.";
				if(OS_IOS){
					Alloy.Globals.activityIndicator.hide();
				}
				if(OS_ANDROID)
				{
		  			$.anActIndicatorView.hide() ;
						
				}
			}
		});
		/*
		var httpClient = Titanium.Network.createHTTPClient({
			timeout : 1000 * 30, // 50 seconds
			onerror : function(e) {
				Ti.API.error(e);
				Ti.API.error(this.responseText);
				//log.logError(this.responseText, "GET Incident");
				//finishSyncing(null);
				
				Alloy.Globals.activityIndicator.hide();
			},
			onload : function(e) {
				var data = this.responseText;
				try {
					
					// Search for org ID
					var orgSearchText = "<form action=\"";
					var orgSearchStartIndex = data.indexOf(orgSearchText) + orgSearchText.length;
					var orgSearchEndIndex = data.indexOf("\"", orgSearchStartIndex);
					
					var searchText = "name=\"SAMLResponse\" value=\"";
					var startIndex = data.indexOf(searchText) + searchText.length;
					var endIndex = data.indexOf("\"/>", startIndex);
					
					var instanceUrl = data.substring(orgSearchStartIndex, orgSearchEndIndex);
					var SAMLToken = data.substring(startIndex, endIndex);
					Ti.API.info(SAMLToken);
					Ti.API.info(instanceUrl);
					
					loginToSFDC(instanceUrl, SAMLToken);
					
				} catch (err) {
					Ti.API.error(err);
					// logError(err, "user info", db);
				} finally {
					data = null;
				}
			}
		});
	
		var url = "http://202.122.131.25/sts";
		
		var params = {
			"username" : $.username.value,
			"password" : $.password.value,
			"auth" : "auth"
		};
	
		httpClient.open("POST", url);
		httpClient.setRequestHeader("content-type", "application/x-www-form-urlencoded");
		httpClient.send(params);
		
		*/
	}
}

function loginSFDCMode() {
	force.authorize({
		success : function() {
			//If we're logged in, create a very simple accounts UI
			//var ui = require('ui');
			//var w = ui.createAppWindow();
			//w.open();
			setTimeout(function(e) {
				// Ti.API.info('Login success, please open the menu view for me!!!!');
				var syncView = Alloy.createController("sync", {}).getView();
				syncView.open();
	
			}, 100);
		},
		error : function() {
			alert('error');
		},
		cancel : function() {
			alert('cancel');
		}
	});
}

$.version.setText("v."+Ti.App.version);

$.loginButton.addEventListener('touchstart', function(e) {
	timeout = setTimeout(function(e) {
		loginSFDCMode();
		isSFDCMode = true;
	}, holdTime);
});

$.loginButton.addEventListener('touchend', function(e) {
	
	
	if (!isSFDCMode) {
		onLogin();
	}
	
	if(OS_ANDROID)
	{
		$.username.blur();
		$.password.blur();
	}
	
	isSFDCMode = false;
	clearTimeout(timeout); 
});