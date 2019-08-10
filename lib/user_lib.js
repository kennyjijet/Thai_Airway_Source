var log = require("log_lib");

exports.authorize = function(args) {
	// Ti.API.info("authorizing user");
	
	var username = args.username;
	var password = args.password;
	
	var httpClient = Titanium.Network.createHTTPClient({
		timeout : 1000 * 30, // 30 seconds
		onerror : function(e) {
			//Ti.API.error(e);
			//Ti.API.error(this.responseText);
			//log.logError(this.responseText, "Authentication");
			
			//Alloy.Globals.activityIndicator.hide();
			if (args.error) {
				args.error(e);
			}
		},
		onload : function(e) {
			var data = this.responseText;
			try {
				// Search for org ID
				var orgSearchText = "<form action=\"";
				var orgSearchStartIndex = data.indexOf(orgSearchText) + orgSearchText.length;
				var orgSearchEndIndex = data.indexOf("\"", orgSearchStartIndex);
				
				// Parse SAML Token
				var searchText = "name=\"SAMLResponse\" type=\"hidden\" value=\"";
				var startIndex = data.indexOf(searchText) + searchText.length;
				var endIndex = data.indexOf("\"/>", startIndex);
				
				var instanceUrl = data.substring(orgSearchStartIndex, orgSearchEndIndex);
				var SAMLToken = data.substring(startIndex, endIndex);
				
				loginToSFDC({
					instanceUrl: instanceUrl,
					SAMLToken : SAMLToken,
					success: function(data) {
						var user = data;
						if (user != null) {
							user.username = username;
							user.password = password;
							
							if (args.success) {
								args.success(user);
							}
						}
					},
					error: function(err) {
						if (args.error) {
							args.error(err);
						}
					}
				});
				
			} catch (err) {
				Ti.API.error(err);
				log.logError(err, "Authentication");
				
				if (args.error) {
					args.error(err);
				}
			} finally {
				data = null;
			}
		}
	});

	//var url = "http://202.122.131.25/sts";
	//var url = "http://dev-wsgw.thaiairways.com/sts";
	var url = "https://wsgw.thaiairways.com/salesforce/SAML";
	
	var params = {
		"username" : username,
		"password" : password,
		"auth" : "auth",
		actionURL : "https://thaiairways.my.salesforce.com?so=00D28000001pvB9"
	};

	httpClient.open("POST", url);
	httpClient.setRequestHeader("content-type", "application/x-www-form-urlencoded");
	httpClient.send(params);
	
	params = null;
};

function loginToSFDC(args) {
	var sfdcHttpClient = Titanium.Network.createHTTPClient({
		timeout : 1000 * 30, // 30 seconds
		onerror : function(e) {
			//Ti.API.error(e);
			Ti.API.error(this.responseText);
			//log.logError(this.responseText, "Authentication");
			
			if (args.error) {
				args.error(e);
			}
		},
		onload : function(e) {
			var data;
			var user = null;
			try {
				data = JSON.parse(this.responseText);
					
				user = {
					username : null,
					password : null,
					instanceUrl : data.instance_url,
					accessToken : data.access_token,
					refreshToken : data.refresh_token
				};
				
				if (args.success) {
					args.success(user);
				}
				
			} catch (err) {
				Ti.API.error(err);
				log.logError(err, "Authentication");
				
				if (args.error) {
					args.error(err);
				}
			} finally {
				data = null;
			}
		}
	});
	
	var urlSplit = args.instanceUrl.split('?');
	var urlPath = urlSplit[0] + "/services/oauth2/token?" + urlSplit[1];
//	Ti.API.info("urlPath: " + urlPath);
	
	var params = {
		"grant_type" : "assertion",
		"assertion_type" : "urn:oasis:names:tc:SAML:2.0:profiles:SSO:browser",
		"assertion" : args.SAMLToken
	};
	
	sfdcHttpClient.open("POST", urlPath);
	sfdcHttpClient.setRequestHeader("content-type", "application/x-www-form-urlencoded");
	sfdcHttpClient.send(params);
	
	params = null;
}

exports.insertUpdateUserAuthen = function(user) {
	var db = Ti.Database.open(Alloy.Globals.dbName);
	
	try {
		var sql = "INSERT OR REPLACE INTO Authentication (id, username, password, instanceUrl, accessToken) VALUES (1," + 
					"'" + user.username + "'," +
					"'" + user.password + "'," + 
					"'" + user.instanceUrl + "'," + 
					"'" + user.accessToken + "'" +
					")"; 
		db.execute(sql);
	}
	catch (e) {
		log.logError(e, "Authentication");
	}
	db.close();
};

exports.getUser = function() {
	var user = null;
	
	var db = Ti.Database.open(Alloy.Globals.dbName);
	var sql = "SELECT username, password, instanceUrl, accessToken FROM Authentication WHERE id=1";
	var rs = db.execute(sql);
	if (rs != null) {
		if (rs.isValidRow()) {
			user = {
				username : rs.getFieldByName("username"),
				password : rs.getFieldByName("password"),
				instanceUrl : rs.getFieldByName("instanceUrl"),
				accessToken : rs.getFieldByName("accessToken")
			};
		}
		
		rs.close();
	}
	db.close();
	
	return user;
};

exports.deleteUser = function() {
	var db = Ti.Database.open(Alloy.Globals.dbName);
	db.execute("DELETE FROM Authentication");
	db.close();
};