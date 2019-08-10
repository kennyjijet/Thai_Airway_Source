/*
 * Log Type
 * 1 = info
 * 2 = debug
 * 3 = error
 * 4 = onError
 * 5 = onLoad
 */

exports.clearErrorLog = function() {
	var db = Ti.Database.open(Alloy.Globals.dbName);
	db.execute("DELETE FROM ErrorLog");
	db.close();
};

exports.logError = function(description, module, type) {
	var db = Ti.Database.open(Alloy.Globals.dbName);
	db.execute("BEGIN");
	db.execute("INSERT INTO ErrorLog (description, module, logType) VALUES (?,?,?)", description.toString(), module, type);
	db.execute("COMMIT");
	db.close();
};

exports.retrieveLogs = function() {
	var db = Ti.Database.open(Alloy.Globals.dbName);
	var rs = db.execute("SELECT id, description, module, timestamp, logType FROM ErrorLog ORDER BY timestamp DESC");
	var logs = null;
	if (rs != null) {
		logs = [];
		while (rs.isValidRow()) {
			var log = {
				id : rs.fieldByName("id"),
				description: rs.fieldByName("description"),
				module: rs.fieldByName("module"),
				timestamp: rs.fieldByName("timestamp"),
				type: rs.fieldByName("logType")
			};
			
			logs.push(log);
			rs.next();
		}
		
		rs.close();
	}
	
	db.close();
	
	return logs;
};
