var utility = require("utility_lib");
  
//**********************************************
//* Home
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

exports.alterDB = function() {
	
    var db = Ti.Database.open(Alloy.Globals.dbName);
    try{
			
		var isAltered = true;
		var colCheck = db.execute("PRAGMA table_info('Incident')");
		while(colCheck.isValidRow()){
			
			if(colCheck.fieldByName("name") == "reasonForChangeSeat"){
				isAltered = false;
			}
			colCheck.next();
		}
		
		Ti.API.info('isAltered ' + isAltered );
		if(isAltered)
		{
			db.execute("ALTER TABLE Incident ADD COLUMN reasonForChangeSeat TEXT");	
		}
		
		
		var isAlteredtotalInfantClassY = true;
		var isAlteredtotalInfantClassU = true;
		var isAlteredtotalInfantClassC = true;
		var isAlteredtotalInfantClassF = true;
		
		var isAlteredtotalPassengerClassY = true;
		var isAlteredtotalPassengerClassU = true;
		var isAlteredtotalPassengerClassC = true;
		var isAlteredtotalPassengerClassF = true;
		
		var colCheck = db.execute("PRAGMA table_info('Flight')");
		while(colCheck.isValidRow()){
			
			if(colCheck.fieldByName("name") == "totalInfantClassY"){
				isAlteredtotalInfantClassY = false;
			}
			if(colCheck.fieldByName("name") == "totalInfantClassU"){
				isAlteredtotalInfantClassU = false;
			}
			if(colCheck.fieldByName("name") == "totalInfantClassC"){
				isAlteredtotalInfantClassC = false;
			}
			if(colCheck.fieldByName("name") == "totalInfantClassF"){
				isAlteredtotalInfantClassF = false;
			}
			
			if(colCheck.fieldByName("name") == "totalPassengerClassY"){
				isAlteredtotalPassengerClassY = false;
			}
			if(colCheck.fieldByName("name") == "totalPassengerClassU"){
				isAlteredtotalPassengerClassU = false;
			}
			if(colCheck.fieldByName("name") == "totalPassengerClassC"){
				isAlteredtotalPassengerClassC = false;
			}
			if(colCheck.fieldByName("name") == "totalPassengerClassF"){
				isAlteredtotalPassengerClassF = false;
			}
			
			colCheck.next();
		}
		
		Ti.API.info('isAlteredtotalInfantClassY ' + isAlteredtotalInfantClassY );
		if(isAlteredtotalInfantClassY)
		{
			db.execute("ALTER TABLE Flight ADD COLUMN totalInfantClassY INTEGER");	
		}
		Ti.API.info('isAlteredtotalInfantClassU ' + isAlteredtotalInfantClassU );
		if(isAlteredtotalInfantClassU)
		{
			db.execute("ALTER TABLE Flight ADD COLUMN totalInfantClassU INTEGER");	
		}
		Ti.API.info('isAlteredtotalInfantClassC ' + isAlteredtotalInfantClassC );
		if(isAlteredtotalInfantClassC)
		{
			db.execute("ALTER TABLE Flight ADD COLUMN totalInfantClassC INTEGER");	
		}
		Ti.API.info('isAlteredtotalInfantClassF ' + isAlteredtotalInfantClassF );
		if(isAlteredtotalInfantClassF)
		{
			db.execute("ALTER TABLE Flight ADD COLUMN totalInfantClassF INTEGER");	
		}
		
		Ti.API.info('isAlteredtotalPassengerClassY ' + isAlteredtotalPassengerClassY );
		if(isAlteredtotalPassengerClassY)
		{
			db.execute("ALTER TABLE Flight ADD COLUMN totalPassengerClassY INTEGER");	
		}
		Ti.API.info('isAlteredtotalPassengerClassU ' + isAlteredtotalPassengerClassU );
		if(isAlteredtotalPassengerClassU)
		{
			db.execute("ALTER TABLE Flight ADD COLUMN totalPassengerClassU INTEGER");	
		}
		Ti.API.info('isAlteredtotalPassengerClassC ' + isAlteredtotalPassengerClassC );
		if(isAlteredtotalPassengerClassC)
		{
			db.execute("ALTER TABLE Flight ADD COLUMN totalPassengerClassC INTEGER");	
		}
		Ti.API.info('isAlteredtotalPassengerClassF ' + isAlteredtotalPassengerClassF );
		if(isAlteredtotalPassengerClassF)
		{
			db.execute("ALTER TABLE Flight ADD COLUMN totalPassengerClassF INTEGER");	
		}
		
		
		var isAltersalutation = true;
		var colPassengerCheck = db.execute("PRAGMA table_info('Passenger')");
		while(colPassengerCheck.isValidRow()){
			
			if(colPassengerCheck.fieldByName("name") == "salutation"){
				isAltersalutation = false;
			}
		
			colPassengerCheck.next();
		}
		Ti.API.info('isAltersalutation ' + isAltersalutation );
		if(isAltersalutation)
		{
			db.execute("ALTER TABLE Passenger ADD COLUMN salutation TEXT");	
		}
			
	    }catch(e){
	    	Ti.API.info(e);
	}
	db.close();
};

exports.getCountClass = function(classAcReg) {
	var db = Ti.Database.open(Alloy.Globals.dbName);
	var Detail = db.execute("SELECT * FROM Flight WHERE id=? ", currentFlightId);
    var countedClass = [];
	if (Detail != null) {
         if(Detail.isValidRow()) {
         	
			countedClass.push(Detail.fieldByName("totalInfantClassY") != null ? Detail.fieldByName("totalInfantClassY") : 0); //0
        	countedClass.push(Detail.fieldByName("totalInfantClassU") != null ? Detail.fieldByName("totalInfantClassU") : 0);	//1
        	countedClass.push(Detail.fieldByName("totalInfantClassC") != null ? Detail.fieldByName("totalInfantClassC") : 0);	//2
        	countedClass.push(Detail.fieldByName("totalInfantClassF") != null ? Detail.fieldByName("totalInfantClassF") : 0);	//3
        	
        	countedClass.push(Detail.fieldByName("totalPassengerClassY") != null ? Detail.fieldByName("totalPassengerClassY") : 0);	//4
        	countedClass.push(Detail.fieldByName("totalPassengerClassU") != null ? Detail.fieldByName("totalPassengerClassU") : 0);	//5
        	countedClass.push(Detail.fieldByName("totalPassengerClassC") != null ? Detail.fieldByName("totalPassengerClassC") : 0);	//6
        	countedClass.push(Detail.fieldByName("totalPassengerClassF") != null ? Detail.fieldByName("totalPassengerClassF") : 0);	//7
        }
	}

	Detail.close();
	return countedClass;
};

exports.getUserDetail = function() {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT id, userFirstName, userLastName, flightNumber, accessToken, securityToken, instantURL, refreshToken, rank, actingRank, sfdcId FROM User");
    var user = '';
    if (Detail != null) {
        if (Detail.isValidRow()) {
            user = {
                id : Detail.fieldByName("id"),
                firstName : Detail.fieldByName("userFirstName"),
                lastName : Detail.fieldByName("userLastName"),
                flightNumber : Detail.fieldByName("flightNumber"),
                accessToken : Detail.fieldByName("accessToken"),
                securityToken : Detail.fieldByName("securityToken"),
                instantURL : Detail.fieldByName("instantURL"),
                refreshToken : Detail.fieldByName("refreshToken"),
                rank : Detail.fieldByName("rank"),
                actinRank : Detail.fieldByName("actingRank"),
                sfdcId : Detail.fieldByName("sfdcId")
            };
        }
        Detail.close();
    }
    db.close();
    return user;
};

exports.getUserId = function() {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT id FROM User");
    if (Detail != null) {
        var user = {
            id : Detail.fieldByName("id") != null ? Detail.fieldByName("id") : ""
        };
        Detail.close();
    }

    db.close();
    return user;
};

exports.updateAccessToken = function(accessToken) {
	var db = Ti.Database.open(Alloy.Globals.dbName);
	db.execute('UPDATE User SET accessToken=?', accessToken);
	db.close(); 
};

exports.updateSyncTime = function(syncTime) {
	var db = Ti.Database.open(Alloy.Globals.dbName);
	db.execute("UPDATE Flight SET lastSync=? WHERE id=?",syncTime, currentFlightId);
	db.close();
};

exports.clearCurrentFlight = function() {
	var db = Ti.Database.open(Alloy.Globals.dbName);
	db.execute("UPDATE Flight SET isCurrentFlight=0");
	db.close();
};

exports.countRecords = function() {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var sql = "SELECT " + 
                "(SELECT COUNT(*) FROM UpgradeSeat WHERE isSynced=0 AND amount<>0) + " +
                "(SELECT COUNT(*) FROM ROPEnrollment WHERE isSynced=0) + " +
                "(SELECT COUNT(*) FROM ROPEnrollAttachment WHERE isSynced=0) + " +
                "(SELECT COUNT(*) FROM CompensationAttachment JOIN Incident ON Incident.id = CompensationAttachment.incidentId WHERE Incident.isSubmitted=1 AND CompensationAttachment.isSynced=0) " +
                "AS SumCount";
    var Detail = db.execute(sql);
    var sumCount = 0;
    if(Detail != null) {
        if(Detail.isValidRow()) {
          sumCount = Detail.fieldByName("SumCount") != null ? Detail.fieldByName("SumCount") : 0;  
        }        
    }
    db.close();  
    return sumCount;
};

exports.getUserDetailsFromCrew = function(userId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var user;
    var Detail = db.execute("SELECT id, crewFirstName, crewLastName, rank, sfdcId FROM Crew WHERE Crew.id=?", userId);
    if (Detail != null) {
        if (Detail.isValidRow()) {
            user = {
                id : Detail.fieldByName("id") != null ? Detail.fieldByName("id") : "",
                firstName : Detail.fieldByName("crewFirstName") != null ? Detail.fieldByName("crewFirstName") : "",
                lastName : Detail.fieldByName("crewLastName") != null ? Detail.fieldByName("crewLastName") : "",
                rank : Detail.fieldByName("rank") != null ? Detail.fieldByName("rank") : "",
                sfdcId : Detail.fieldByName("sfdcId") != null ? Detail.fieldByName("sfdcId") : ""
            };
        } else {
            user = {
                id : "",
                firstName : "",
                lastName : "",
                rank : ""
            };
        }
    	Detail.close();
    }
    
    db.close();
    return user;
};

exports.getFlightExternalId = function() {

    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT flightExternalId FROM Flight");
    var flightExternalIds = [];
    if (Detail != null) {
        while (Detail.isValidRow()) {
            var flightExternal = {
                flightExternalId : Detail.fieldByName("flightExternalId"),
            };
            flightExternalIds.push(flightExternal);
            Detail.next();
        }
        Detail.close();
    }
    db.close();
    return flightExternalIds;

};

exports.getFlightDetails = function() {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT id, flightNumber, flightDateUTC, flightDateLT, origin, destination, "+
    						"legNumber, aircraftType, aircraftConfiguration, aircraftRegistration, "+
    						"departureStation, departureStationFull, arrivalStation, arrivalStationFull, "+
    						"STD, ETD, STA, ETA, flyingTime, gate, nextFlightNumber, nextFlightDateTime, "+
    						"departureDate, lastModified, lastSync, bookingPax, acceptedPax, status, "+
    						"flightExternalId, STDLT, ETDLT, STALT, ETALT, aircraftName, aircraftNameTH, codeShare "+
    						"FROM Flight "+
    						"WHERE isCurrentFlight=1");
    var flight = null;
    if (Detail != null && Detail.isValidRow()) {
        flight = {
            id : Detail.fieldByName("id") != null ? Detail.fieldByName("id") : "",
            flightNumber : Detail.fieldByName("flightNumber") != null ? Detail.fieldByName("flightNumber") : "",
            flightDateUTC : Detail.fieldByName("flightDateUTC") != null ? Detail.fieldByName("flightDateUTC") : "",
            flightDateLT : Detail.fieldByName("flightDateLT") != null ? Detail.fieldByName("flightDateLT") : "",
            origin : Detail.fieldByName("origin") != null ? Detail.fieldByName("origin") : "",
            destination : Detail.fieldByName("destination") != null ? Detail.fieldByName("destination") : "",
            aircraftType : Detail.fieldByName("aircraftType") != null ? Detail.fieldByName("aircraftType") : "",
            aircraftConfiguration : Detail.fieldByName("aircraftConfiguration") != null ? Detail.fieldByName("aircraftConfiguration") : "",
            aircraftRegistration : Detail.fieldByName("aircraftRegistration") != null ? Detail.fieldByName("aircraftRegistration") : "",
            departureStation : Detail.fieldByName("departureStation") != null ? Detail.fieldByName("departureStation") : "",
            departureStationFull : Detail.fieldByName("departureStationFull") != null ? Detail.fieldByName("departureStationFull") : "",
            arrivalStation : Detail.fieldByName("arrivalStation") != null ? Detail.fieldByName("arrivalStation") : "",
            arrivalStationFull : Detail.fieldByName("arrivalStationFull") != null ? Detail.fieldByName("arrivalStationFull") : "",
            STD : Detail.fieldByName("STD") != null ? Detail.fieldByName("STD") : "",
            ETD : Detail.fieldByName("ETD") != null ? Detail.fieldByName("ETD") : "",
            STA : Detail.fieldByName("STA") != null ? Detail.fieldByName("STA") : "",
            ETA : Detail.fieldByName("ETA") != null ? Detail.fieldByName("ETA") : "",
            flyingTime : Detail.fieldByName("flyingTime") != null ? Detail.fieldByName("flyingTime") : "",
            gate : Detail.fieldByName("gate") != null ? Detail.fieldByName("gate") : "",
            nextFlightNumber : Detail.fieldByName("nextFlightNumber") != null ? Detail.fieldByName("nextFlightNumber") : "",
            nextFlightDateTime : Detail.fieldByName("nextFlightDateTime") != null ? Detail.fieldByName("nextFlightDateTime") : "",
            departureDate : Detail.fieldByName("departureDate") != null ? Detail.fieldByName("departureDate") : "",
            lastModified : Detail.fieldByName("lastModified") != null ? Detail.fieldByName("lastModified") : "",
            lastSync : Detail.fieldByName("lastSync") != null ? Detail.fieldByName("lastSync") : "",
            bookingPax : Detail.fieldByName("bookingPax") != null ? Detail.fieldByName("bookingPax") : "",
            acceptedPax : Detail.fieldByName("acceptedPax") != null ? Detail.fieldByName("acceptedPax") : "",
            status : Detail.fieldByName("status") != null ? Detail.fieldByName("status") : "",
            flightExternalId : Detail.fieldByName("flightExternalId") != null ? Detail.fieldByName("flightExternalId") : "",
            STDLT : Detail.fieldByName("STDLT") != null ? Detail.fieldByName("STDLT") : "",
            ETDLT : Detail.fieldByName("ETDLT") != null ? Detail.fieldByName("ETDLT") : "",
            STALT : Detail.fieldByName("STALT") != null ? Detail.fieldByName("STALT") : "",
            ETALT : Detail.fieldByName("ETALT") != null ? Detail.fieldByName("ETALT") : "",
            acName : Detail.fieldByName("aircraftName") != null ? Detail.fieldByName("aircraftName") : "",
            acNameTH : Detail.fieldByName("aircraftNameTH") != null ? Detail.fieldByName("aircraftNameTH") : "",
            codeShare : Detail.fieldByName("codeShare") != null ? Detail.fieldByName("codeShare") : ""
        };
        Detail.close();
    }
    db.close();
    return flight;
};

exports.getCurrentFlightStd = function() {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var rs = db.execute('SELECT STD FROM Flight WHERE isCurrentFlight=1');
    var std = null;

    if (rs != null && rs.isValidRow()) {
        var tmpStd = rs.fieldByName('STD');
        std = new Date(tmpStd);

        rs.close();
    }
    db.close();

    return std;
};

exports.countClass = function(classType, flightId) {
	var db = Ti.Database.open(Alloy.Globals.dbName);
	var Detail = db.execute("SELECT "+
							"COUNT(CASE WHEN bookingClass=? THEN 1 END) AS count "+
							"FROM Passenger WHERE flightId=? AND bookingSeat IS NOT NULL", classType, flightId);
	
	var count = 0;
	if (Detail != null && Detail.isValidRow()) {
		count = Detail.fieldByName('count');
		
		Detail.close();
	}
	db.close();
	return count;
};

exports.countInfant = function(bookingClass, flightId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT " + 
    						"COUNT(CASE WHEN hasInfant=1 AND bookingSeat NOT NULL THEN 1 END) AS count " + 
    						"FROM Passenger WHERE bookingClass=? AND flightId=?", bookingClass, flightId);
    var count = 0;
    if (Detail != null && Detail.isValidRow()) {
        count = Detail.fieldByName('count');
        Detail.close();
    }

    db.close();
    return count;
};

exports.countDraftSubmittedIncident = function() {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT "+
    						"COUNT(CASE WHEN (isSubmitted = 0 AND isSynced = 0) THEN 1 END) AS draft, "+
    						"COUNT(CASE WHEN (isSubmitted = 1 AND isSynced = 0) THEN 1 END) AS submitted, "+
                            "COUNT(CASE WHEN isSynced = 1 THEN 1 END) AS history "+
    						"FROM Incident"
    					   );

    if (Detail != null && Detail.isValidRow()) {
        var count = {
            draft : Detail.fieldByName("draft"),
            submitted : Detail.fieldByName("submitted"),
            history : Detail.fieldByName("history")
        };
        Detail.close();
    }

    db.close();
    return count;
};

exports.getNextFlight = function() {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT * FROM Flight");
    var flight;
    if (Detail != null) {
    	while (Detail.isValidRow()){
	        if (Detail.fieldByName("isCurrentFlight") == 1) {
	            Detail.next();
	            var nextFlightId = Detail.fieldByName("id");
	            if (Detail.isValidRow() && nextFlightId != null) {
	                flight = {
	                    id : Detail.fieldByName("id") != null ? Detail.fieldByName("id") : "",
	                    flightNumber : Detail.fieldByName("flightNumber") != null ? Detail.fieldByName("flightNumber") : "",
	                    flightDateUTC : Detail.fieldByName("flightDateUTC") != null ? Detail.fieldByName("flightDateUTC") : "",
	                    flightDateLT : Detail.fieldByName("flightDateLT") != null ? Detail.fieldByName("flightDateLT") : "",
	                    origin : Detail.fieldByName("origin") != null ? Detail.fieldByName("origin") : "",
	                    destination : Detail.fieldByName("destination") != null ? Detail.fieldByName("destination") : "",
	                    aircraftType : Detail.fieldByName("aircraftType") != null ? Detail.fieldByName("aircraftType") : "",
	                    aircraftConfiguration : Detail.fieldByName("aircraftConfiguration") != null ? Detail.fieldByName("aircraftConfiguration") : "",
	                    aircraftRegistration : Detail.fieldByName("aircraftRegistration") != null ? Detail.fieldByName("aircraftRegistration") : "",
	                    departureStation : Detail.fieldByName("departureStation") != null ? Detail.fieldByName("departureStation") : "",
	                    departureStationFull : Detail.fieldByName("departureStationFull") != null ? Detail.fieldByName("departureStationFull") : "",
	                    arrivalStation : Detail.fieldByName("arrivalStation") != null ? Detail.fieldByName("arrivalStation") : "",
	                    arrivalStationFull : Detail.fieldByName("arrivalStationFull") != null ? Detail.fieldByName("arrivalStationFull") : "",
	                    STD : Detail.fieldByName("STD") != null ? Detail.fieldByName("STD") : "",
	                    ETD : Detail.fieldByName("ETD") != null ? Detail.fieldByName("ETD") : "",
	                    STA : Detail.fieldByName("STA") != null ? Detail.fieldByName("STA") : "",
	                    ETA : Detail.fieldByName("ETA") != null ? Detail.fieldByName("ETA") : "",
	                    flyingTime : Detail.fieldByName("flyingTime") != null ? Detail.fieldByName("flyingTime") : "",
	                    gate : Detail.fieldByName("gate") != null ? Detail.fieldByName("gate") : "",
	                    nextFlightNumber : Detail.fieldByName("nextFlightNumber") != null ? Detail.fieldByName("nextFlightNumber") : "",
	                    nextFlightDateTime : Detail.fieldByName("nextFlightDateTime") != null ? Detail.fieldByName("nextFlightDateTime") : "",
	                    departureDate : Detail.fieldByName("departureDate") != null ? Detail.fieldByName("departureDate") : "",
	                    lastModified : Detail.fieldByName("lastModified") != null ? Detail.fieldByName("lastModified") : "",
	                    lastSync : Detail.fieldByName("lastSync") != null ? Detail.fieldByName("lastSync") : "",
	                    bookingPax : Detail.fieldByName("bookingPax") != null ? Detail.fieldByName("bookingPax") : "",
	                    acceptedPax : Detail.fieldByName("acceptedPax") != null ? Detail.fieldByName("acceptedPax") : "",
	                    status : Detail.fieldByName("status") != null ? Detail.fieldByName("status") : "",
	                    flightExternalId : Detail.fieldByName("flightExternalId") != null ? Detail.fieldByName("flightExternalId") : "",
	                    STDLT : Detail.fieldByName("STDLT") != null ? Detail.fieldByName("STDLT") : "",
	                    ETDLT : Detail.fieldByName("ETDLT") != null ? Detail.fieldByName("ETDLT") : "",
	                    STALT : Detail.fieldByName("STALT") != null ? Detail.fieldByName("STALT") : "",
	                    ETALT : Detail.fieldByName("ETALT") != null ? Detail.fieldByName("ETALT") : "",
	                    acName : Detail.fieldByName("aircraftName") != null ? Detail.fieldByName("aircraftName") : "",
	                    acNameTH : Detail.fieldByName("aircraftNameTH") != null ? Detail.fieldByName("aircraftNameTH") : "",
           				codeShare : Detail.fieldByName("codeShare") != null ? Detail.fieldByName("codeShare") : ""
	                };
	                break;
	            }
	       }
	       Detail.next();
       }
       Detail.close();
    }
    
    db.close();
    return flight;
};

exports.updateCurrentFlight = function(currentFlight, nextFlight) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    if (nextFlight != null) {
        db.execute("UPDATE Flight SET isCurrentFlight=0 WHERE id=?", currentFlight);
        db.execute("UPDATE Flight SET isCurrentFlight=1 WHERE id=?", nextFlight);
    }else {
    	db.execute("UPDATE Flight SET isCurrentFlight=0 WHERE id=?", currentFlight);
    }
    db.close();
};

exports.updateCrewImagePath = function(crewId, filename) {
    var db = Ti.Database.open(Alloy.Globals.dbName);

    var sqlExe = "UPDATE Crew SET image='" + filename + "' WHERE id like '" + crewId + "%'";
    db.execute(sqlExe);
    db.close();
};

//**********************************************
//* Passenger Feedback
//**********************************************
exports.countFeedbackWithClass = function(flightNumber, fClass, type) {
	var db = Ti.Database.open(Alloy.Globals.dbName);
	var count = 0;
	var Details;
	if(fClass != null){
		if(fClass == "all"){
			Details = db.execute("SELECT COUNT(*) as count FROM PassengerFeedback WHERE flightNumber=? AND issueType=?",flightNumber,type);
		}else{
			Details = db.execute("SELECT COUNT(*) as count FROM PassengerFeedback WHERE flightNumber=? AND class=? AND issueType=?",flightNumber,fClass,type);
		}
	}else{
		Details = db.execute("SELECT COUNT(*) as count FROM PassengerFeedback WHERE flightNumber=? AND class IS NULL AND issueType=?",flightNumber,type);
	}
	if (Details != null && Details.length != 0) {
		count = Details.fieldByName('count');
	}
	db.close();
	return count;
};

exports.getFeedbackListByType = function(flightNumber, fClass, type) {
	var db = Ti.Database.open(Alloy.Globals.dbName);
	var List = [];
	var Details;
	if(fClass != null){
		if(fClass == "all"){
			Details = db.execute("SELECT type, SUM(total) as total FROM PassengerFeedback WHERE flightNumber=? AND issueType=? GROUP BY type ORDER BY total DESC LIMIT 10",flightNumber,type);
		}else{
			Details = db.execute("SELECT type, total FROM PassengerFeedback WHERE flightNumber=? AND class=? AND issueType=? ORDER BY PassengerFeedback.total DESC LIMIT 10",flightNumber,fClass,type);
		}
	}else{
		Details = db.execute("SELECT type, total FROM PassengerFeedback WHERE flightNumber=? AND class IS NULL AND issueType=? ORDER BY PassengerFeedback.total DESC LIMIT 10",flightNumber,type);
	}
	if (Details != null && Details.length != 0) {
		while(Details.isValidRow()){
			var feedback = {
				type : Details.fieldByName('type') != null ? Details.fieldByName('type') : "",
				total : Details.fieldByName('total')
			};
			List.push(feedback);
			Details.next();
		}
		Details.close();
	}
	db.close();
	return List;
};

//**********************************************
//* Safety Equipment
//**********************************************

exports.hasUpperdesk = function(aircraft) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var hasUpper = false;
    var sqlExe = db.execute("SELECT zone FROM Equipment WHERE acDesc=? AND zone LIKE 'U%'",aircraft);
    if (sqlExe != null && sqlExe.isValidRow()){
    	hasUpper = true;
    }
    sqlExe.close();
    db.close();
    
    return hasUpper;
};

//**********************************************
//* Crew Duty Assignment
//**********************************************

exports.getMasterDuty = function(flightId) {
	var db = Ti.Database.open(Alloy.Globals.dbName);
    var List = [];
    var Detail = db.execute("SELECT name " +
    						"FROM MasterDuty " +
    						"WHERE flightId=?",flightId);
    if(Detail != null){
    	while(Detail.isValidRow()){
    		List.push(Detail.fieldByName("name"));
    		Detail.next();
    	}
    	Detail.close();
    }
    db.close();
    return List;
};

exports.containsDuty = function(duty) {
	var db = Ti.Database.open(Alloy.Globals.dbName);
	var contains = false;
	var sql = "SELECT id " +
				"FROM Crew " +
				"WHERE duty='"+duty+"' "+
				"AND flightId='"+currentFlightId+"' "+
				"AND (LOWER(duty) IS NOT 'x' AND LOWER(duty) IS NOT 'dh')";
	
	var Detail = db.execute(sql);
	if(Detail != null && Detail.isValidRow()){
		contains = true;
		Detail.close();
	}
	db.close();
	return contains;
};

exports.assignCrewDuty = function(crewId, newDuty) {
	var extNoSplit = flightExternalId.split("_");
	var fltNo = extNoSplit[0]+"_"+extNoSplit[1];
	var dutySfdcId = crewId+"_"+flightExternalId;
	var db = Ti.Database.open(Alloy.Globals.dbName);
	var Detail = db.execute("SELECT * FROM CrewDutyAssignment " +
							"WHERE sfdcId LIKE '" + crewId +"%'" +
							"AND flightExtNo LIKE '" + fltNo +"%'" +
							"AND isSync='0'");
	if (Detail != null){
		if(Detail.isValidRow()){
			var sfdcId;
			var currentDuty;
			if(Detail.fieldByName("newDuty") != newDuty){
				while(Detail.isValidRow()){
					sfdcId = Detail.fieldByName("sfdcId");
					currentDuty = Detail.fieldByName("newDuty");
					db.execute("UPDATE CrewDutyAssignment SET oldDuty=? , newDuty=? , isSync=0 WHERE sfdcId=?",currentDuty,newDuty,sfdcId);
					Detail.next();
				}
				db.execute("UPDATE Crew SET duty='"+newDuty+"' WHERE id LIKE '"+crewId+"%' "+"AND flightExtNo LIKE '"+fltNo+"%'");
			}
			sfdcId = null;
			currentDuty = null;
		}else{
			var crewDetail = db.execute("SELECT * FROM Crew " +
										"WHERE id LIKE '" + crewId +"%'" +
										"AND flightExtNo LIKE '"+fltNo+"%'");
			if(crewDetail != null){
				if(crewDetail.isValidRow()){
					var currentDuty;
					var fltExtNo;
					if(crewDetail.fieldByName("duty") != newDuty){
						while(crewDetail.isValidRow()){
							currentDuty = crewDetail.fieldByName("duty");
							fltExtNo = crewDetail.fieldByName("flightExtNo");
							if(currentDuty != null){
								db.execute("INSERT OR REPLACE INTO CrewDutyAssignment (sfdcId, flightId, oldDuty, newDuty, perNo, status, flightExtNo, isSync) VALUES (?,?,?,?,?,?,?,?)",crewId+"_"+fltExtNo,currentFlightId,currentDuty,newDuty,crewId,"A",fltExtNo,0);
							}else{
								db.execute("INSERT OR REPLACE INTO CrewDutyAssignment (sfdcId, flightId, oldDuty, newDuty, perNo, status, flightExtNo, isSync) VALUES (?,?,?,?,?,?,?,?)",crewId+"_"+fltExtNo,currentFlightId,null,newDuty,crewId,"A",fltExtNo,0);
							}
							crewDetail.next();
						}
						db.execute("UPDATE Crew SET duty='"+newDuty+"' WHERE id LIKE '"+crewId+"%' "+"AND flightExtNo LIKE '"+fltNo+"%'");
					}
					currentDuty = null;
					fltExtNo = null;
				}
			}
			crewDetail.close();
		}
		Detail.close();
	}
	db.close();
};

exports.getCrewDutyAssignment = function() {
	var db = Ti.Database.open(Alloy.Globals.dbName);
	var List = [];
	var Detail = db.execute("SELECT sfdcId, flightId, oldDuty, newDuty, perNo, status "+
							"FROM CrewDutyAssignment WHERE isSync=0");
	if(Detail != null){
		while(Detail.isValidRow()){
			var assignDuties = {
				sfdcId : Detail.fieldByName("sfdcId"),
				fltId : Detail.fieldByName("flightId"),
				oldDuty : Detail.fieldByName("oldDuty"),
				newDuty : Detail.fieldByName("newDuty"),
				perno : Detail.fieldByName("perNo"),
				updtstatus : Detail.fieldByName("status")
			};
			List.push(assignDuties);
			Detail.next();
		}
		Detail.close();
	}
	db.close();
	
	return List;
};

exports.setDutySynced = function(){
	var db = Ti.Database.open(Alloy.Globals.dbName);
	db.execute("UPDATE CrewDutyAssignment SET isSync=1 WHERE isSync=0");
	db.close();
};

exports.countDutyUnSynced = function(){
	var db = Ti.Database.open(Alloy.Globals.dbName);
	var count = 0;
	var Details = db.execute("SELECT COUNT(*) as count FROM CrewDutyAssignment WHERE isSync=0");
	if(Details != null){
		count = Details.fieldByName('count');
		Details.close();
	}
	db.close();
	return count;
};

exports.countDutyUnAssigned = function(){
	var db = Ti.Database.open(Alloy.Globals.dbName);
	var count = 0;
	var Details = db.execute("SELECT COUNT(*) as count FROM Crew "+
							"WHERE flightId=? "+
							"AND Crew.dutyCode='FLY' AND Crew.rank NOT LIKE 'F%' AND "+
							"(Crew.crewType NOT LIKE 'GE' AND Crew.crewType NOT LIKE 'Other') AND "+
							"Crew.duty IS NULL",currentFlightId);
	if(Details != null){
		count = Details.fieldByName('count');
		Details.close();
	}
	
	db.close();
	return count;
};

exports.getCrewDuty = function(crewId){
	var db = Ti.Database.open(Alloy.Globals.dbName);
	var duty;
	var Details = db.execute("SELECT duty FROM Crew WHERE id=?",crewId);
	if(Details != null){
		duty = Details.fieldByName("duty") != null ? Details.fieldByName("duty") : "";
		Details.close();
	}
	db.close();
	return duty;
};

//**********************************************
//* E-Document
//**********************************************
exports.getDynamicLink = function(flightId){
	var db = Ti.Database.open(Alloy.Globals.dbName);
	var List = [];
	var Detail = db.execute("SELECT name, multiFlag, link, startWith "+
							"FROM DynamicLinkList WHERE flightId=? ORDER BY name ASC",flightId);
	
	if(Detail != null){
		while(Detail.isValidRow()){
			var dynamicLink = {
				name : Detail.fieldByName('name') != null ? Detail.fieldByName('name') : "",
				multiFlag : Detail.fieldByName('multiFlag'),
				link : Detail.fieldByName('link') != null ? Detail.fieldByName('link') : "",
				startWith : Detail.fieldByName('startWith') != null ? Detail.fieldByName('startWith') : ""
			};
			List.push(dynamicLink);
			Detail.next();
		}
		Detail.close();
	}
	db.close();
	return List;
};

//**********************************************
//* Passenger Psychology
//**********************************************
exports.updatePsychology = function(accountId, like , dislike , other) {
	var db = Ti.Database.open(Alloy.Globals.dbName);
	db.execute("UPDATE PassengerPsychology SET like=? , dislike=? , other=? , isSync=0 WHERE accountId=?", like, dislike, other, accountId);
	db.close();
};

exports.getPsychologyUnsynced = function() {
	var db = Ti.Database.open(Alloy.Globals.dbName);
	var List = [];
	var Detail = db.execute("SELECT accountId, paxKey, like, dislike, other, bySale, byGround "+
							"FROM PassengerPsychology WHERE isSync=0");
	if(Detail != null){
		while(Detail.isValidRow()){
			var psycho = {
				accId : Detail.fieldByName("accountId"),
				paxKey : Detail.fieldByName("paxKey"),
				pLike : Detail.fieldByName("like"),
				dislike : Detail.fieldByName("dislike"),
				byOther : Detail.fieldByName("other"),
				bySale : null,
				byGnd : null
			};
			List.push(psycho);
			Detail.next();
		}
		Detail.close();
	}
	
	db.close();
	
	return List;
};

//**********************************************
//* Compensation
//**********************************************

exports.getAmountByMileage = function(type, problem, paxClass, region) {
	var db = Ti.Database.open(Alloy.Globals.dbName);
	var amount = 0;
	var Detail = db.execute("SELECT amount FROM MasterCompensation "+
							"WHERE type=? AND problem=? AND class=? AND region=?",type,problem,paxClass,region);
	if(Detail != null){
		amount = Detail.fieldByName('amount');
		Detail.close();
	}
	db.close();
	
	return amount;
};

exports.getAmountAndCurrency = function(type, problem, paxClass, region) {
	var db = Ti.Database.open(Alloy.Globals.dbName);
	var amount;
	var Detail = db.execute("SELECT currency, amount FROM MasterCompensation "+
							"WHERE type=? AND problem=? AND class=? AND region=?",
							!utility.isEmpty(type) ? type : "Empty",
                            !utility.isEmpty(problem) ? problem : "Empty",
                            !utility.isEmpty(paxClass) ? paxClass : "Empty",
                            !utility.isEmpty(region) ? region : "Empty"
						   );
	if(Detail != null){
		amount = {
			amount : Detail.fieldByName('amount'),
			currency : Detail.fieldByName('currency'),
		};
		Detail.close();
	}
	db.close();
	
	return amount;
};

exports.getConditionMileOrMPD = function(type){
	var db = Ti.Database.open(Alloy.Globals.dbName);
	var List = [];
	var Detail = db.execute("SELECT description, type FROM "+type+" ORDER BY type ASC");
	if(Detail != null){
		while(Detail.isValidRow()){
			var mileCondition = {
				description : Detail.fieldByName('description'),
				type : Detail.fieldByName('type')
			};
			List.push(mileCondition);
			Detail.next();
		}
		Detail.close();
	}
	db.close();
	return List;
};

exports.getConditionUpCer = function(){
	var db = Ti.Database.open(Alloy.Globals.dbName);
	var List = [];
	var Detail = db.execute("SELECT description FROM UpgradeCertificateCondition ORDER BY type ASC");
	if(Detail != null){
		while(Detail.isValidRow()){
			List.push(Detail.fieldByName('description'));
			Detail.next();
		}
		Detail.close();
	}
	db.close();
	return List;
};

exports.getTypeUpCertificate = function(type, problem, paxClass, region){
	var db = Ti.Database.open(Alloy.Globals.dbName);
	var List = [];
	var Detail = db.execute("SELECT subType FROM MasterCompensation "+
							"WHERE type=? AND problem=? AND class=? AND region=?",type, problem, paxClass, region);
	if(Detail != null){
		while(Detail.isValidRow()){
			List.push(Detail.fieldByName('subType'));
			Detail.next();
		}
		Detail.close();
	}
	db.close();
	return List;
};

exports.getCompAttachment = function(compId, incidentId){
	var db = Ti.Database.open(Alloy.Globals.dbName);
	var attachment = [];
	var Detail = db.execute("SELECT * "+
							"FROM CompensationAttachment "+
							"WHERE compenId=? AND incidentId=?",compId, incidentId);
    	if(Detail != null && Detail.isValidRow()){
    		var compAttach = {
    			name : Detail.fieldByName('attachmentName'),
    			detail : Detail.fieldByName('detail'),
    			incidentId : Detail.fieldByName('incidentId'),
                compensationId : Detail.fieldByName('compenId'),
    		};
    		attachment.push(compAttach);
    		Detail.close();
    	}
	db.close();
	return attachment;
};

//**********************************************
//* Flight Summary
//**********************************************

exports.countCrewlistType = function() {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var List = [];
    var Detail = db.execute("SELECT " + 
    						"COUNT(CASE WHEN LOWER(rank) LIKE 'f%' AND LOWER(dutyCode) = 'fly' THEN 1 END) AS cockpit, " + 
    						"COUNT(CASE WHEN (LOWER(rank) LIKE 'a%' OR LOWER(rank) LIKE 'i%') AND LOWER(dutyCode) = 'fly' THEN 1 END) AS carbin, " +
    						"COUNT(CASE WHEN LOWER(rank) LIKE 'g%' THEN 1 END) AS ge, " +
    						"COUNT(CASE WHEN (LOWER(dutyCode) = 'tvl' AND (LOWER(rank) LIKE 'f%' OR LOWER(rank) LIKE 'a%' OR LOWER(rank) LIKE 'i%')) THEN 1 END) AS passive, "+
    						"COUNT(CASE WHEN (LOWER(dutyCode) = 'fly' AND (LOWER(rank) LIKE 'f%' OR LOWER(rank) LIKE 'a%' OR LOWER(rank) LIKE 'i%')) THEN 1 END) AS active, "+
    						"COUNT(CASE WHEN NOT (LOWER(rank) LIKE 'f%' OR LOWER(rank) LIKE 'a%' OR LOWER(rank) LIKE 'i%' OR LOWER(rank) LIKE 'g%') THEN 1 END) AS other "+
    						"FROM Crew " + "WHERE flightId=?", currentFlightId);
    if (Detail != null && Detail.isValidRow()) {
        List.push(Detail.fieldByName("cockpit"));
        List.push(Detail.fieldByName("carbin"));
        List.push(Detail.fieldByName("ge"));
        List.push(Detail.fieldByName("passive"));
    	List.push(Detail.fieldByName("active"));
    	List.push(Detail.fieldByName("other"));
    }
    
	Detail.close();
    db.close();
    return List;
};

exports.getNationality = function(flightId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var List = [];
    var Detail = db.execute("SELECT COUNT(*) AS count, nationality FROM Passenger WHERE bookingSeat IS NOT NULL AND nationality IS NOT NULL AND flightId=? GROUP BY nationality ORDER BY count DESC LIMIT 5", flightId);
    if (Detail != null) {
        while (Detail.isValidRow()) {
            List.push(Detail.fieldByName("nationality"));
            Detail.next();
        }
        Detail.close();
    }
    db.close();
    return List;
};

exports.getClassFromPassenger = function(nationality, flightId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var List = [];
    var Detail = db.execute("SELECT " +
    						"COUNT(CASE WHEN bookingClass = 'F' THEN 1 END) As firstClass, " +
    						"COUNT(CASE WHEN bookingClass = 'C' THEN 1 END) As businessClass, " +
    						"COUNT(CASE WHEN bookingClass = 'Y' THEN 1 END) As economicClass, " +
    						"COUNT(CASE WHEN bookingClass = 'U' THEN 1 END) As preEcoClass, " +
    						"COUNT(*) As count " +
    						"FROM Passenger " +
    						"WHERE nationality=? AND flightId=? AND bookingSeat IS NOT NULL", nationality, flightId);

    if (Detail != null) {
        List.push(Detail.fieldByName("firstClass"));
        List.push(Detail.fieldByName("businessClass"));
        List.push(Detail.fieldByName("preEcoClass"));
        List.push(Detail.fieldByName("economicClass"));
        List.push(Detail.fieldByName("count"));
        Detail.close();
    }

    db.close();
    return List;
};

exports.getCabinZone = function(nationality, flightId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT "+
    						"COUNT(Passenger.bookingSeat) As count, "+
    						"LOPAPosition.zone, LOPAPosition.floor "+
    						"FROM Passenger "+
    						"LEFT JOIN LOPAPosition ON Passenger.bookingSeat = LOPAPosition.position "+
    						"WHERE Passenger.bookingSeat IS NOT NULL "+
    						"AND Passenger.nationality = ? "+
    						"AND Passenger.flightId=? "+
    						"AND LOPAPosition.flightId=? "+
    						"GROUP BY LOPAPosition.zone, LOPAPosition.floor "+
    						"ORDER BY count DESC LIMIT 1",nationality, flightId, flightId);

    var cabinZone;
    if (Detail != null && Detail.isValidRow()) {
        cabinZone = {
            count : Detail.fieldByName("count") != null ? Detail.fieldByName("count") : "",
            zone : Detail.fieldByName("zone") != null ? Detail.fieldByName("zone") : "",
            floor : Detail.fieldByName("floor") != null ? Detail.fieldByName("floor") : ""
        };
        Detail.close();
    }
    db.close();
    return cabinZone;
};
//**********************************************
//* Compensation
//**********************************************
exports.getCompensation = function(incidentId, type) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT id, detail FROM Compensation WHERE incidentId=? AND type=?", incidentId, type);
    var comp;
    if (Detail != null) {
        comp = {
            id : Detail.fieldByName("id"),
            detail : Detail.fieldByName("detail")
        };
    } else {
        comp = {
            id : 0,
            detail : Detail.fieldByName("detail")
        };
    }
    Detail.close();
    db.close();
    return comp;
};

exports.getCompensationsByIncidentId = function(incidentId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var compenSql = "SELECT id, detail, type, quantity, amount FROM Compensation WHERE incidentId='" + incidentId + "'";
    var compenRs = db.execute(compenSql);
    var compensations = [];
    if (compenRs != null) {
        while (compenRs.isValidRow()) {
            var compensation = {
                id : compenRs.fieldByName("id"),
                detail : compenRs.fieldByName("detail"),
                type : compenRs.fieldByName("type"),
                quantity : compenRs.fieldByName("quantity"),
                amount : compenRs.fieldByName("amount"),
                incidentId : incidentId
            };
            compensations.push(compensation);
            compenRs.next();
        }
        compenRs.close();
    }
    db.close();
    return compensations;
};

//**********************************************
//* E-Document
//**********************************************
exports.getLinkEdocument = function(type) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT linkToSystem FROM EDocument WHERE type=?", type);
    var link;
    if (Detail != null) {
        link = Detail.fieldByName("linkToSystem") != null ? Detail.fieldByName("linkToSystem") : "";
    } else {
        link = "";
    }
    return link;
};

//**********************************************
//* Incident
//**********************************************
exports.countUnsyncIncident = function() {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    
    var count = 0;
    var Detail = db.execute("SELECT COUNT(*) AS count FROM Incident WHERE isSynced=0 OR isSynced IS NULL");
    if (Detail != null && Detail.isValidRow()) {
    	count = Detail.fieldByName('count');
    	Detail.close();
    }
    db.close();
    return count;
};

function getPassengerDetailByIncidentId(incidentId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT PaxGroupMember.id, Passenger.id AS passengerId, Passenger.firstName, Passenger.lastName, Passenger.bookingSeat, Passenger.bookingClass FROM PaxGroupMember " + 
    "LEFT JOIN Passenger ON PaxGroupMember.paxId = Passenger.id WHERE PaxGroupMember.incidentId=?", incidentId);
    var List = [];
    if (Detail != null) {
        while (Detail.isValidRow()) {

            var passenger = {
                id : Detail.fieldByName("passengerId"),
                firstName : Detail.fieldByName("firstName"),
                lastName : Detail.fieldByName("lastName"),
                bookingSeat : Detail.fieldByName("bookingSeat"),
                bookingClass : Detail.fieldByName("bookingClass"),
            };

            List.push(passenger);
            Detail.next();
        }
        Detail.close();
    }
    db.close();
    return List;

}

function getPositionDetailByIncidentId(incidentId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var posMemSql = "SELECT id, positionId, name FROM PositionGroupMember WHERE incidentId='" + incidentId + "'";
    var posMemRs = db.execute(posMemSql);
    var posMems = [];
    if (posMemRs != null) {
        while (posMemRs.isValidRow()) {
            var position = {
                positionId : posMemRs.fieldByName("positionId"),
                name : posMemRs.fieldByName("name")
            };
            posMems.push(position);
            posMemRs.next();
        }
        posMemRs.close();
    }
   db.close();
   return posMems;   
}

exports.checkSubmittedIncidentById = function(incidentId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT isSubmitted, category, sequenceNumber FROM Incident WHERE id=?", incidentId);
    var incident = {
        isSubmitted : Detail.fieldByName("isSubmitted"),
        category : Detail.fieldByName("category"),
        sequenceNumber : Detail.fieldByName("sequenceNumber"),
    };
    Detail.close();
    db.close();
    return incident;
};

exports.getIncidentsLazyLoad = function (offsetArg, limitArg, searchTextArg, categoryArg, isSubmittedArg, isSyncedArg) {
    var List = [];
    var db = Ti.Database.open(Alloy.Globals.dbName);

    var sql = "SELECT " +
        "Incident.id, Incident.flightId, Incident.equipmentId, Incident.subject," + 
        "Incident.createDateTime, Incident.updateDateTime, Incident.condition, " + 
        "Incident.category, Incident.emergencyType,Incident.isSubmitted,Incident.isVoided, " + 
        "Incident.sequenceNumber,Incident.logGroup,Incident.safetyZone,Incident.isSynced, " + 
        "Incident.reportedBy,Incident.createdBy,Incident.flightNumber,Incident.incidentStatus, " + 
//        "Passenger.id AS passengerId, Passenger.firstName, Passenger.lastName, Passenger.bookingSeat, Passenger.bookingClass, " +
        "Crew.rank, Crew.crewFirstName, Crew.crewLastName, Crew.crewNickName, Crew.sfdcId AS crewId, Crew.extId, " +        
        "Equipment.name AS equipmentName, Equipment.sfdcId AS equipmentId, " +
        "EquipmentPart.name AS partName " + 

        "FROM Incident " + 

        "LEFT JOIN Equipment ON Equipment.sfdcId = incident.equipmentId " +
        "LEFT JOIN PaxGroupMember ON PaxGroupMember.incidentId = incident.id " +
        "LEFT JOIN CrewGroupMember ON CrewGroupMember.incidentId = incident.id " +
        "LEFT JOIN Passenger ON (PaxGroupMember.paxId = Passenger.id OR PaxGroupMember.accountId = Passenger.accountId OR PaxGroupMember.paxKey = Passenger.paxKey) " +
        "LEFT JOIN EquipmentPart ON EquipmentPart.equipmentId = Equipment.sfdcId " +
        "LEFT JOIN Crew ON Crew.sfdcId = CrewGroupMember.crewId " +
        
        "WHERE ";
                
        if(searchTextArg != "") {
             sql += "(Passenger.firstName LIKE '%"+searchTextArg+"%' OR "+
             "Passenger.lastName LIKE '%"+searchTextArg+"%' OR "+
             "Passenger.bookingClass LIKE '%"+searchTextArg+"%' OR "+
             "Passenger.bookingSeat LIKE '%"+searchTextArg+"%' OR "+
             "Passenger.firstName LIKE '%"+searchTextArg+"%' OR "+
             "Passenger.salutation LIKE '%"+searchTextArg+"%' OR "+         
             "Equipment.name LIKE '%"+searchTextArg+"%' OR "+         
             "EquipmentPart.name LIKE '%"+searchTextArg+"%' OR "+         
             "Crew.rank LIKE '%"+searchTextArg+"%' OR "+         
             "Crew.crewFirstName LIKE '%"+searchTextArg+"%' OR "+         
             "Crew.crewLastName LIKE '%"+searchTextArg+"%' OR "+         
             "Incident.sequenceNumber LIKE '%"+searchTextArg+"%' OR "+         
             "Incident.subject LIKE '%"+searchTextArg+"%') AND ";         
         }
         
         if(categoryArg > 0 && categoryArg <7) {
             sql += "Incident.category = " + categoryArg + " AND ";  
         }
         
         if(!isSyncedArg && !isSubmittedArg) {  // Draft incidents           
             sql += "Incident.isSynced = 0 AND Incident.isSubmitted = 0 AND ";  
         } else if (!isSyncedArg && isSubmittedArg) { // Submitted incidents
             sql += "Incident.isSynced = 0 AND Incident.isSubmitted = 1 AND ";  
         } else if (isSyncedArg) { // History incidents
             sql += "Incident.isSynced = 1 AND ";  
         }
         
         sql += "Incident.upgradeChangeSeatType IS NULL ";
        
         sql += "GROUP BY Incident.id "; 
         
         sql += "ORDER BY Incident.createDateTime DESC ";
         
         sql += "LIMIT "+limitArg+" OFFSET "+offsetArg;
         
    var Detail = db.execute(sql);     

    var List = [];
    if (Detail != null) {
        while (Detail.isValidRow()) {

            var incident = {
                id : Detail.fieldByName("id"),
                flightId : Detail.fieldByName("flightId"),
                passengerFirstName : "", //Detail.fieldByName("firstName") != null ? Detail.fieldByName("firstName") : "",
                passengerLastName : "", //Detail.fieldByName("lastName") != null ? Detail.fieldByName("lastName") : "",
                passengerBookingSeat : "", //Detail.fieldByName("bookingSeat") != null ? Detail.fieldByName("bookingSeat") : "",
                passengerBookingClass : "", //Detail.fieldByName("bookingClass") != null ? Detail.fieldByName("bookingClass") : "",
                salutation : "",
                crewFirstName : Detail.fieldByName("crewFirstName") != null ? Detail.fieldByName("crewFirstName") : "",
                crewLastName : Detail.fieldByName("crewLastName") != null ? Detail.fieldByName("crewLastName") : "",
                crewNickName : Detail.fieldByName("crewNickName") != null ? Detail.fieldByName("crewNickName") : "",
                crewRank : Detail.fieldByName("rank") != null ? Detail.fieldByName("rank") : "",
                equipmentId : Detail.fieldByName("equipmentId") != null ? Detail.fieldByName("equipmentId") : "",
                equipmentName : Detail.fieldByName("equipmentName") != null ? Detail.fieldByName("equipmentName") : "",
                createDateTime : Detail.fieldByName("createDateTime") != null ? Detail.fieldByName("createDateTime") : "",
                updateDateTime : Detail.fieldByName("updateDateTime") != null ? Detail.fieldByName("updateDateTime") : "",
                condition : Detail.fieldByName("condition") != null ? Detail.fieldByName("condition") : "",
                subject : Detail.fieldByName("subject") != null ? Detail.fieldByName("subject") : "",
                sequenceNumber : Detail.fieldByName("sequenceNumber") != null ? Detail.fieldByName("sequenceNumber") : "",
                category : Detail.fieldByName("category") != null ? Detail.fieldByName("category") : "",
                emergencyType : Detail.fieldByName("emergencyType") != null ? Detail.fieldByName("emergencyType"):0,
                sequenceNumber : Detail.fieldByName("sequenceNumber") != null ? Detail.fieldByName("sequenceNumber") : "",
                flightNumber : Detail.fieldByName("flightNumber") != null ? Detail.fieldByName("flightNumber") : "",
                reportedBy : Detail.fieldByName("reportedBy") != null ? Detail.fieldByName("reportedBy") : "",
                createdBy : Detail.fieldByName("createdBy") != null ? Detail.fieldByName("createdBy") : "",
                status : Detail.fieldByName("incidentStatus"),
                isSubmitted : Detail.fieldByName("isSubmitted"),
                isVoided : Detail.fieldByName("isVoided"),
                isSynced : Detail.fieldByName("isSynced"),
                logGroup : Detail.fieldByName("logGroup") != null ? Detail.fieldByName("logGroup") : "",
                selectedFlag : false,
                lopaPosition : []
            };
                        
            var posMemSql = "SELECT id, positionId, name FROM PositionGroupMember WHERE incidentId='" + incident.id + "'";
            var posMemRs = db.execute(posMemSql);
            var posMems = [];
            if (posMemRs != null) {
                while (posMemRs.isValidRow()) {
                    posMems.push(posMemRs.fieldByName("positionId"));
                    posMemRs.next();
                }
                posMemRs.close();
            }

            if (posMems != null && posMems.length > 0) {
                incident.lopaPosition = posMems;
            }
            
            var paxMemSql = "SELECT Passenger.firstName,Passenger.salutation,Passenger.lastName, Passenger.bookingSeat, Passenger.bookingClass FROM PaxGroupMember LEFT JOIN Passenger ON Passenger.id = PaxGroupMember.paxId OR Passenger.accountId = PaxGroupMember.accountId OR Passenger.paxKey = PaxGroupMember.paxKey WHERE PaxGroupMember.incidentId='" + incident.id + "'";

            var paxMemRs = db.execute(paxMemSql);
            var passengerData = null;

            if (paxMemRs != null) {
                if (paxMemRs.isValidRow()) {
                    passengerData = {
                        passengerFirstName : paxMemRs.fieldByName("firstName") != null ? paxMemRs.fieldByName("firstName") : "",
                        passengerLastName : paxMemRs.fieldByName("lastName") != null ? paxMemRs.fieldByName("lastName") : "",
                        passengerBookingSeat : paxMemRs.fieldByName("bookingSeat") != null ? paxMemRs.fieldByName("bookingSeat") : "",
                        passengerBookingClass : paxMemRs.fieldByName("bookingClass") != null ? paxMemRs.fieldByName("bookingClass") : "",
                        salutation : paxMemRs.fieldByName("salutation") != null ? paxMemRs.fieldByName("salutation") : ""                                    
                    };
                }
                paxMemRs.close();
            }

            if (passengerData != null) {
                incident.passengerFirstName = passengerData.passengerFirstName;
                incident.passengerLastName = passengerData.passengerLastName;
                incident.passengerBookingSeat = passengerData.passengerBookingSeat;
                incident.passengerBookingClass = passengerData.passengerBookingClass;
                incident.salutation = passengerData.salutation;
                passengerData = null;
            }
            
            var reportedByDetailSql = "SELECT Crew.crewFirstName, Crew.crewLastName, Crew.rank FROM Crew WHERE Crew.sfdcId='" + incident.reportedBy + "'"; 
            var reportedByDetail = db.execute(reportedByDetailSql);

            var createdByDetailSql = "SELECT Crew.crewFirstName, Crew.crewLastName, Crew.rank FROM Crew WHERE Crew.sfdcId='" + incident.createdBy + "'";
            var createdByDetail = db.execute(createdByDetailSql);
                        
            if(reportedByDetail != null && reportedByDetail != undefined && reportedByDetail.isValidRow()) {
                var title = reportedByDetail.fieldByName("rank") != null ? reportedByDetail.fieldByName("rank") : "";
                var firstName = reportedByDetail.fieldByName("crewFirstName") != null ? reportedByDetail.fieldByName("crewFirstName") : "";
                var lastName = reportedByDetail.fieldByName("crewLastName") != null ? reportedByDetail.fieldByName("crewLastName") : "";                    
                
                incident.reportedBy = title + " " + firstName + " " + lastName;
                
            } else if(createdByDetail != null && createdByDetail != undefined && createdByDetail.isValidRow()) {
                var title = createdByDetail.fieldByName("rank") != null ? createdByDetail.fieldByName("rank") : "";
                var firstName = createdByDetail.fieldByName("crewFirstName") != null ? createdByDetail.fieldByName("crewFirstName") : "";
                var lastName = createdByDetail.fieldByName("crewLastName") != null ? createdByDetail.fieldByName("crewLastName") : "";

                incident.reportedBy = title + " " + firstName + " " + lastName;     
                           
            } else {
                incident.reportedBy = "";
            }

            List.push(incident);
            Detail.next();
        }
        Detail.close();                                   
    }
    
    db.close();
    return List;
    
};

exports.getCabinLogNumberOfIncident = function(seqNumber) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT Incident.id, Incident.flightId, Incident.sequenceNumber " + 
     "FROM Incident " + 
     "WHERE Incident.sequenceNumber=?", seqNumber);
    if (Detail != null) {
        if (Detail.isValidRow()) {

            var incident = {
                id : Detail.fieldByName("id"),
                flightId : Detail.fieldByName("flightId"),
                sequenceNumber : Detail.fieldByName("sequenceNumber") != null ? Detail.fieldByName("sequenceNumber") : "",
            };
        }
        Detail.close();
    } else {
        return null;        
    }
    db.close();
    
    return incident;
};

exports.getIncidentsByPassengerOrPosition = function(passengerIdArg, accountIdArg, paxKeyArg, positionArg, acRegArg) { 
    var List = [];
        
    var db = Ti.Database.open(Alloy.Globals.dbName);
    
    var sql = "SELECT " +  
        "Incident.id, Incident.flightId, Incident.equipmentId, Incident.subject," + 
        "Incident.createDateTime, Incident.updateDateTime, Incident.condition, " + 
        "Incident.category, Incident.emergencyType,Incident.isSubmitted,Incident.isVoided, " + 
        "Incident.sequenceNumber,Incident.logGroup,Incident.safetyZone,Incident.isSynced, " + 
        "Incident.reportedBy,Incident.createdBy,Incident.flightNumber,Incident.incidentStatus, " + 
        "Crew.rank, Crew.crewFirstName, Crew.crewLastName, Crew.crewNickName, Crew.sfdcId AS crewId, Crew.extId, " +        
        "Equipment.name AS equipmentName, Equipment.sfdcId AS equipmentId, " +
        "EquipmentPart.name AS partName " + 

        "FROM Incident " + 

        "LEFT JOIN Equipment ON Equipment.sfdcId = incident.equipmentId " +
        "LEFT JOIN PaxGroupMember ON PaxGroupMember.incidentId = incident.id " +
        "LEFT JOIN CrewGroupMember ON CrewGroupMember.incidentId = incident.id " +
        "LEFT JOIN Passenger ON (PaxGroupMember.paxId = Passenger.id OR PaxGroupMember.accountId = Passenger.accountId OR PaxGroupMember.paxKey = Passenger.paxKey) " +
        "LEFT JOIN EquipmentPart ON EquipmentPart.equipmentId = Equipment.sfdcId " +
        "LEFT JOIN Crew ON Crew.sfdcId = CrewGroupMember.crewId " +
        "LEFT JOIN PositionGroupMember ON PositionGroupMember.incidentId = Incident.id " +
        "LEFT JOIN ChangeSeatGroupMember ON ChangeSeatGroupMember.incidentId = Incident.id " +

        "WHERE ((PaxGroupMember.paxId = ? OR PaxGroupMember.accountId = ? OR PaxGroupMember.paxKey = ?) " + 
        "OR (PositionGroupMember.positionId = ? AND Incident.acReg = ?) " + 
        //"OR (ChangeSeatGroupMember.oldSeat = ? AND Incident.acReg = ?)) " + 
		" ) " +
		"AND Incident.upgradeChangeSeatType IS NULL " + 

        "GROUP BY Incident.id " + 
        
        "ORDER BY Incident.createDateTime DESC";
	
	var Detail = db.execute(sql,
        !utility.isEmpty(passengerIdArg) ? passengerIdArg : "Empty",
        !utility.isEmpty(accountIdArg) ? accountIdArg : "Empty", 
        !utility.isEmpty(paxKeyArg) ? paxKeyArg : "Empty",
        !utility.isEmpty(positionArg) ? positionArg : "Empty",
        !utility.isEmpty(acRegArg) ? acRegArg : "Empty"
        //!utility.isEmpty(positionArg) ? positionArg : "Empty",
        //!utility.isEmpty(acRegArg) ? acRegArg : "Empty"
        );
    
    if(Detail != null) {
        while(Detail.isValidRow()) {
            var incident = {
                id : Detail.fieldByName("id"),
                flightId : Detail.fieldByName("flightId"),
                passengerFirstName : "", //Detail.fieldByName("firstName") != null ? Detail.fieldByName("firstName") : "",
                passengerLastName : "", //Detail.fieldByName("lastName") != null ? Detail.fieldByName("lastName") : "",
                passengerBookingSeat : "", //Detail.fieldByName("bookingSeat") != null ? Detail.fieldByName("bookingSeat") : "",
                passengerBookingClass : "", //Detail.fieldByName("bookingClass") != null ? Detail.fieldByName("bookingClass") : "",
                crewFirstName : Detail.fieldByName("crewFirstName") != null ? Detail.fieldByName("crewFirstName") : "",
                crewLastName : Detail.fieldByName("crewLastName") != null ? Detail.fieldByName("crewLastName") : "",
                crewNickName : Detail.fieldByName("crewNickName") != null ? Detail.fieldByName("crewNickName") : "",
                crewRank : Detail.fieldByName("rank") != null ? Detail.fieldByName("rank") : "",
                equipmentId : Detail.fieldByName("equipmentId") != null ? Detail.fieldByName("equipmentId") : "",
                equipmentName : Detail.fieldByName("equipmentName") != null ? Detail.fieldByName("equipmentName") : "",
                createDateTime : Detail.fieldByName("createDateTime") != null ? Detail.fieldByName("createDateTime") : "",
                updateDateTime : Detail.fieldByName("updateDateTime") != null ? Detail.fieldByName("updateDateTime") : "",
                condition : Detail.fieldByName("condition") != null ? Detail.fieldByName("condition") : "",
                subject : Detail.fieldByName("subject") != null ? Detail.fieldByName("subject") : "",
                sequenceNumber : Detail.fieldByName("sequenceNumber") != null ? Detail.fieldByName("sequenceNumber") : "",
                category : Detail.fieldByName("category") != null ? Detail.fieldByName("category") : "",
                emergencyType : Detail.fieldByName("emergencyType") != null ? Detail.fieldByName("emergencyType"):0,
                sequenceNumber : Detail.fieldByName("sequenceNumber") != null ? Detail.fieldByName("sequenceNumber") : "",
                flightNumber : Detail.fieldByName("flightNumber") != null ? Detail.fieldByName("flightNumber") : "",
                reportedBy : Detail.fieldByName("reportedBy") != null ? Detail.fieldByName("reportedBy") : "",
                createdBy : Detail.fieldByName("createdBy") != null ? Detail.fieldByName("createdBy") : "",
                status : Detail.fieldByName("incidentStatus"),
                isSubmitted : Detail.fieldByName("isSubmitted"),
                isVoided : Detail.fieldByName("isVoided"),
                isSynced : Detail.fieldByName("isSynced"),
                logGroup : Detail.fieldByName("logGroup") != null ? Detail.fieldByName("logGroup") : "",
                lopaPosition : []
            };

            var posMemSql = "SELECT id, positionId, name FROM PositionGroupMember WHERE incidentId='" + incident.id + "'";
            var posMemRs = db.execute(posMemSql);
            var posMems = [];
            if (posMemRs != null) {
                while (posMemRs.isValidRow()) {
                    posMems.push(posMemRs.fieldByName("positionId"));
                    posMemRs.next();
                }
                posMemRs.close();
            }

            if (posMems != null && posMems.length > 0) {
                incident.lopaPosition = posMems;
            }
            
            var paxMemSql = "SELECT Passenger.firstName, Passenger.lastName, Passenger.bookingSeat, Passenger.bookingClass FROM PaxGroupMember LEFT JOIN Passenger ON Passenger.id = PaxGroupMember.paxId OR Passenger.accountId = PaxGroupMember.accountId OR Passenger.paxKey = PaxGroupMember.paxKey WHERE PaxGroupMember.incidentId='" + incident.id + "'";

            var paxMemRs = db.execute(paxMemSql);
            var passengerData = null;

            if (paxMemRs != null) {
                if (paxMemRs.isValidRow()) {
                    passengerData = {
                        passengerFirstName : paxMemRs.fieldByName("firstName") != null ? paxMemRs.fieldByName("firstName") : "",
                        passengerLastName : paxMemRs.fieldByName("lastName") != null ? paxMemRs.fieldByName("lastName") : "",
                        passengerBookingSeat : paxMemRs.fieldByName("bookingSeat") != null ? paxMemRs.fieldByName("bookingSeat") : "",
                        passengerBookingClass : paxMemRs.fieldByName("bookingClass") != null ? paxMemRs.fieldByName("bookingClass") : "",                                            
                    };
                }
                paxMemRs.close();
            }

            if (passengerData != null) {
                incident.passengerFirstName = passengerData.passengerFirstName;
                incident.passengerLastName = passengerData.passengerLastName;
                incident.passengerBookingSeat = passengerData.passengerBookingSeat;
                incident.passengerBookingClass = passengerData.passengerBookingClass; 
                passengerData = null;
            }
            
            var reportedByDetailSql = "SELECT Crew.crewFirstName, Crew.crewLastName, Crew.rank FROM Crew WHERE Crew.sfdcId='" + incident.reportedBy + "'"; 
            var reportedByDetail = db.execute(reportedByDetailSql);

            var createdByDetailSql = "SELECT Crew.crewFirstName, Crew.crewLastName, Crew.rank FROM Crew WHERE Crew.sfdcId='" + incident.createdBy + "'";
            var createdByDetail = db.execute(createdByDetailSql);
                        
            if(reportedByDetail != null && reportedByDetail != undefined && reportedByDetail.isValidRow()) {
                var title = reportedByDetail.fieldByName("rank") != null ? reportedByDetail.fieldByName("rank") : "";
                var firstName = reportedByDetail.fieldByName("crewFirstName") != null ? reportedByDetail.fieldByName("crewFirstName") : "";
                var lastName = reportedByDetail.fieldByName("crewLastName") != null ? reportedByDetail.fieldByName("crewLastName") : "";                    
                
                incident.reportedBy = title + " " + firstName + " " + lastName;
                
            } else if(createdByDetail != null && createdByDetail != undefined && createdByDetail.isValidRow()) {
                var title = createdByDetail.fieldByName("rank") != null ? createdByDetail.fieldByName("rank") : "";
                var firstName = createdByDetail.fieldByName("crewFirstName") != null ? createdByDetail.fieldByName("crewFirstName") : "";
                var lastName = createdByDetail.fieldByName("crewLastName") != null ? createdByDetail.fieldByName("crewLastName") : "";

                incident.reportedBy = title + " " + firstName + " " + lastName;     
                           
            } else {
                incident.reportedBy = "";
            }
    
            List.push(incident);
            Detail.next();            
        }
        Detail.close();
    }
    
    db.close();
    return List;
};

exports.getNewStatusListOfLopaPosition = function () {
    var List = [];
    var db = Ti.Database.open(Alloy.Globals.dbName);    
    var rs = db.execute("SELECT id, newStatus, flightId FROM LOPAPosition WHERE newStatus IS NOT NULL");
    if(rs != null) {
        while (rs.isValidRow()) {
            var positonData = {
                id : rs.fieldByName("id"),
                newStatus : rs.fieldByName("newStatus"),
                flightId : rs.fieldByName("flightId")                
            };
            List.push(positonData);
            rs.next();
        }       
        rs.close();
    }
    
    db.close();    
    return List;    
};

exports.updateNewStatusOfLopaPosition = function (dataArg) {
    if(dataArg != null && dataArg.length > 0) {
        var db = Ti.Database.open(Alloy.Globals.dbName);    
        for(var i = 0; i < dataArg.length; i++) {
            db.execute("BEGIN");
            db.execute("UPDATE LOPAPosition SET newStatus = ? WHERE id=? AND flightId=?", dataArg[i].newStatus, dataArg[i].id, dataArg[i].flightId);
            db.execute("COMMIT");            
        }
        db.close();            
    }
};

exports.getPassengerListWhoHaveUpgradedOrChangedSeat = function () {
    var List = [];
    var db = Ti.Database.open(Alloy.Globals.dbName);    
    var rs = db.execute("SELECT id, flightId, bookingSeat, bookingClass, oldSeat, oldClass FROM Passenger WHERE oldSeat IS NOT NULL");
    if(rs != null) {
        while (rs.isValidRow()) {
            var paxData = {
                id : rs.fieldByName("id"),
                flightId : rs.fieldByName("flightId"),                
                bookingSeat : rs.fieldByName("bookingSeat"),
                bookingClass : rs.fieldByName("bookingClass"),
                oldSeat : rs.fieldByName("oldSeat"),
                oldClass : rs.fieldByName("oldClass")
            };
            List.push(paxData);
            rs.next();
        }       
        rs.close();
    }
    
    db.close();    
    return List;    
};

exports.updatePassengerWhoHaveUpgradedOrChangedSeat = function (dataArg) {
    if(dataArg != null && dataArg.length > 0) {
        var db = Ti.Database.open(Alloy.Globals.dbName);    
        for(var i = 0; i < dataArg.length; i++) {
            db.execute("BEGIN");
            db.execute("UPDATE Passenger SET bookingSeat = ?, bookingClass = ?, oldSeat= ?, oldClass = ? WHERE id=? AND flightId=?", 
                dataArg[i].bookingSeat, 
                dataArg[i].bookingClass, 
                dataArg[i].oldSeat,
                dataArg[i].oldClass, 
                dataArg[i].id, 
                dataArg[i].flightId
            );
            db.execute("COMMIT");            
        }
        db.close();            
    }
};

exports.getChangeUpgradeSeatIncidentsByPassengerOrPosition = function(passengerId, accountId, paxKey, position, acReg, type) {    
    var paxDetail = [];
    var List = [];
    var db = Ti.Database.open(Alloy.Globals.dbName);    
    var Detail = db.execute(
        "SELECT Incident.id, Incident.detail, Incident.reasonForChangeSeat " + 

        "FROM Incident " + 
        "LEFT JOIN PositionGroupMember ON PositionGroupMember.incidentId = Incident.id " +
        "LEFT JOIN ChangeSeatGroupMember ON ChangeSeatGroupMember.incidentId = Incident.id " +
        "LEFT JOIN Compensation ON Compensation.incidentId = Incident.id " +
        "LEFT JOIN Equipment ON Incident.equipmentId = Equipment.sfdcId " + 
        "LEFT JOIN PaxGroupMember ON PaxGroupMember.incidentId = Incident.id " +
        "LEFT JOIN Passenger ON (Passenger.id = PaxGroupMember.paxId OR Passenger.paxKey = PaxGroupMember.paxKey OR Passenger.accountId = PaxGroupMember.accountId) " +

        "WHERE ((PaxGroupMember.paxId = ? OR PaxGroupMember.accountId = ? OR PaxGroupMember.paxKey = ?) " + 
        "OR (PositionGroupMember.positionId = ? AND Incident.acReg = ?) " + 
        "OR (Compensation.fromSeat = ? AND Incident.acReg = ?) " + 
        "OR (ChangeSeatGroupMember.oldSeat = ? AND Incident.acReg = ?)) " + 
                
        "AND Incident.upgradeChangeSeatType = ? " +

        "AND Incident.flightId = ? " +

        "GROUP BY Incident.id " + 
        
        "ORDER BY Incident.createDateTime DESC",
        
        !utility.isEmpty(passengerId) ? passengerId : "0", 
        !utility.isEmpty(accountId) ? accountId : "0", 
        !utility.isEmpty(paxKey) ? paxKey : "0",
        !utility.isEmpty(position) ? position : "0",
        !utility.isEmpty(acReg) ? acReg : "0",                         
        !utility.isEmpty(position) ? position : "0",
        !utility.isEmpty(acReg) ? acReg : "0",                         
        !utility.isEmpty(position) ? position : "0",
        !utility.isEmpty(acReg) ? acReg : "0",
        type,
        currentFlightId                         
    );
    
    if(Detail != null && Detail.isValidRow()) {
        while(Detail.isValidRow()) {
            var incident = {
                id : Detail.fieldByName("id"),
                detail : Detail.fieldByName("detail") != null ? Detail.fieldByName("detail") : "",
                reasonForChangeSeat : Detail.fieldByName("reasonForChangeSeat") != null ? Detail.fieldByName("reasonForChangeSeat") : "",
            };
    
            List.push(incident);
            Detail.next();            
        }
    }
    Detail.close();
    
    db.close();
    
    return List;
};


exports.updateIncidentPostReturn = function(incidents) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    
    try {
        if (incidents != null && incidents.length > 0) {
            for (var i = 0; i < incidents.length; i++) {
                db.execute("UPDATE Incident SET isSynced = 1, sfdcId = ? WHERE id=?",incidents[i].sfdcId, incidents[i].id);
            };
        }
    } catch(e) {
        Ti.API.error(e);
    }
    db.close();
};

function internalFuncGetUserId () {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT id FROM User");
    if (Detail != null) {
        var user = {
            id : Detail.fieldByName("id") != null ? Detail.fieldByName("id") : ""
        };
        Detail.close();
    }

    db.close();
    return user;
}

function internalFuncGetUserSfdcIdFromExtId (userId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var user;
    var Detail = db.execute("SELECT id, sfdcId FROM Crew WHERE Crew.id=?", userId+"_"+currentFlightId);
    if (Detail != null) {
        if (Detail.isValidRow()) {
            user = {
                id : Detail.fieldByName("id") != null ? Detail.fieldByName("id") : "",
                sfdcId : Detail.fieldByName("sfdcId") != null ? Detail.fieldByName("sfdcId") : ""
            };
        } else {
            user = null;
        }

        Detail.close();
    }
    db.close();
    return user;
}

exports.getSubmittedIncidentsByFlightIdForSync = function(flightId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);

    var select = "SELECT * ";

    var from = "FROM Incident ";

    var where = "WHERE isSubmitted=1 AND isSynced=0";

    var sql = select + from + where;

    var rs = db.execute(sql);

    var list = [];
    if (rs != null) {
        while (rs.isValidRow()) {
            var safetyZoneStr = rs.fieldByName("safetyZone");
            if(safetyZoneStr != null && safetyZoneStr.length > 0) {safetyZoneStr = "Safety zone is " + safetyZoneStr + ". ";}
            else {safetyZoneStr="";}
            
            var reportedTypeStr = rs.fieldByName("reportType");
            if(rs.fieldByName("category") == EMERGENCY) {
                reportedTypeStr = "Information";
            }
                         
            var incident = {
                id : rs.fieldByName("id"),
                fltId : rs.fieldByName("flightId"),
				creBy : utility.isEmpty(rs.fieldByName("createdBy"))? null : rs.fieldByName("createdBy"),
                repBy : utility.isEmpty(rs.fieldByName("reportedBy"))? null : rs.fieldByName("reportedBy"), //crew id (sfdcId)
                creDT : rs.fieldByName("createDateTime"), // text
                updDT : rs.fieldByName("updateDateTime"), // text
                equipId : utility.isEmpty(rs.fieldByName("equipmentId"))? null : rs.fieldByName("equipmentId"), // sfdcId
                partId : utility.isEmpty(rs.fieldByName("partId"))? null : rs.fieldByName("partId"), // sfdcId
                seqNo : utility.isEmpty(rs.fieldByName("sequenceNumber"))? null : rs.fieldByName("sequenceNumber"), // text
                condi : utility.isEmpty(rs.fieldByName("condition"))? null : rs.fieldByName("condition"), //text : xxx;xxx;xx;
                safetyZone : utility.isEmpty(rs.fieldByName("safetyZone"))? null : rs.fieldByName("safetyZone"), // text
                subject : utility.isEmpty(rs.fieldByName("subject"))? null : rs.fieldByName("subject"), // text
                descr : utility.isEmpty(rs.fieldByName("detail"))? null : rs.fieldByName("detail"), //text
                rptType : utility.isEmpty(reportedTypeStr)? null : reportedTypeStr, // text
                logType : rs.fieldByName("logGroup"), // text
                status : rs.fieldByName("incidentStatus"), //integer: 1=Open, 2=Resolved, 3=Closed
                inCate : rs.fieldByName("category"), // integer 1,2,3,4,5,6
                emerType : rs.fieldByName("category") == EMERGENCY ? rs.fieldByName("emergencyType") : null, // Integer
                isLog : rs.fieldByName("isLog"),
                isMulti : rs.fieldByName("isMulti"),
                isVoided : rs.fieldByName("isVoided"),
                acReg : rs.fieldByName("acReg"),
                phone : utility.isEmpty(rs.fieldByName("phone")) ? null : rs.fieldByName("phone"),
                email : utility.isEmpty(rs.fieldByName("email")) ? null : rs.fieldByName("email"),
                upChgType : rs.fieldByName("upgradeChangeSeatType"),
                reasonChangeSeat : rs.fieldByName("reasonForChangeSeat"),
                compen : [],
                posMem : [],
                paxMem : [],
                crewMem : [],
                staffMem : [],
                chSeat: []
            };

            // Query compensation items
            var compenSql = "SELECT * FROM Compensation WHERE incidentId='" + incident.id + "'";
            var compenRs = db.execute(compenSql);
            var compensations = [];
            if (compenRs != null) {
                while (compenRs.isValidRow()) {
                    var compensation = {
                        id : compenRs.fieldByName("compenId"),
                        detail : compenRs.fieldByName("detail"),
                        type : compenRs.fieldByName("type"), //"upgradeSeat”, "ropMileage”, "mpd", "upgradeCer", "dutyFree","other”
                        quantity : compenRs.fieldByName("quantity"),
                        amount : compenRs.fieldByName("amount"),
                        problem : compenRs.fieldByName("problem"),
                        currenc : compenRs.fieldByName("currency"),
                        upCer : compenRs.fieldByName("upgradeCer"),
                        iscFormNum : compenRs.fieldByName("iscFormNumber"),
                        itemCodeNum : compenRs.fieldByName("itemCodeNumber"),
                        fromSeat : compenRs.fieldByName("fromSeat"),
                        fromClass : compenRs.fieldByName("fromClass"),
                        toSeat : compenRs.fieldByName("toSeat"),
                        toClass : compenRs.fieldByName("toClass"),
                        creDT : compenRs.fieldByName("createdDateTime")
                    };

                    compensations.push(compensation);
                    compenRs.next();
                }
                compenRs.close();
            }
            incident.compen = compensations;

            // Query change seat
            var chSeatMemSql = "SELECT * FROM ChangeSeatGroupMember WHERE incidentId='" + incident.id + "'";
            var chSeatMemRs = db.execute(chSeatMemSql);
            var chSeatMems = [];
            if (chSeatMemRs != null) {
                while (chSeatMemRs.isValidRow()) {
                    var changeSeat = {
                        fromSeat : chSeatMemRs.fieldByName("oldSeat"),
                        fromClass : chSeatMemRs.fieldByName("oldClass"),
                        toSeat : chSeatMemRs.fieldByName("newSeat"),
                        toClass : chSeatMemRs.fieldByName("newClass"),
                        creDT : chSeatMemRs.fieldByName("createdDateTime")
                    };
                    chSeatMems.push(changeSeat);
                    chSeatMemRs.next();
                }
                chSeatMemRs.close();
            }
            incident.chSeat = chSeatMems;

            // Query positions
            var posMemSql = "SELECT id, positionId FROM PositionGroupMember WHERE incidentId='" + incident.id + "'";
            var posMemRs = db.execute(posMemSql);
            var posMems = [];
            if (posMemRs != null) {
                while (posMemRs.isValidRow()) {
                    var position = {
                        id : posMemRs.fieldByName("positionId")
                    };
                    posMems.push(position);
                    posMemRs.next();
                }
                posMemRs.close();
            }
            incident.posMem = posMems;

            // Query passengers
            var paxMemSql = "SELECT id, paxId, role, detail, accountId, paxKey FROM PaxGroupMember WHERE incidentId='" + incident.id + "'";
            var paxMemRs = db.execute(paxMemSql);
            var paxMems = [];
            if (paxMemRs != null) {
                while (paxMemRs.isValidRow()) {
                    var paxId = paxMemRs.fieldByName("paxId");
                    var changeSeat = chSeatMems[paxId];
                    var pax = {
                        id : paxId,
                        detail : paxMemRs.fieldByName("detail") != "" ? paxMemRs.fieldByName("detail") : null,
                        role: paxMemRs.fieldByName("role") != "" ? paxMemRs.fieldByName("role") : null,
                        accId: paxMemRs.fieldByName("accountId") != "" ? paxMemRs.fieldByName("accountId") : null,
                        paxKey: paxMemRs.fieldByName("paxKey") != "" ? paxMemRs.fieldByName("paxKey") : null
                    };
                    paxMems.push(pax);
                    paxMemRs.next();
                }
                paxMemRs.close();
            }
            incident.paxMem = paxMems;

            // Query crew members
            var crewMemSql = "SELECT id, crewId, role, detail FROM CrewGroupMember where incidentId='" + incident.id + "'";
            var crewMemRs = db.execute(crewMemSql);
            var crewMems = [];
            if (crewMemRs != null) {
                while (crewMemRs.isValidRow()) {
                    var crewMem = {
                        id : crewMemRs.fieldByName("crewId"),
                        role : crewMemRs.fieldByName("role"),
                        detail : crewMemRs.fieldByName("detail")
                    };
                    crewMems.push(crewMem);
                    crewMemRs.next();
                }
                crewMemRs.close();
            }
            incident.crewMem = crewMems;

            // Query staff members
            var staffMemSql = "SELECT id, name, personnelId, role, detail FROM StaffGroupMember where incidentId='" + incident.id + "'";
            var staffMemRs = db.execute(staffMemSql);
            var staffMems = [];
            if (staffMemRs != null) {
                while (staffMemRs.isValidRow()) {
                    var crewMem = {
                        id : staffMemRs.fieldByName("personnelId"),
                        staffName : staffMemRs.fieldByName("name"),
                        role : staffMemRs.fieldByName("role"),
                        detail : staffMemRs.fieldByName("detail")
                    };
                    staffMems.push(crewMem);
                    staffMemRs.next();
                }
                staffMemRs.close();
            }
            incident.staffMem = staffMems;

            list.push(incident);
            rs.next();
        }

        rs.close();
    }

    db.close();

    return list;
};

exports.getIsSubmittedCategorySeqNumber = function(incidentId){
    var db = Ti.Database.open(Alloy.Globals.dbName);

    var Detail = db.execute("SELECT isSubmitted, sequenceNumber, category FROM Incident WHERE id=?", incidentId + "");

    var incident = null;
    if (Detail != null) {
        if (Detail.isValidRow()) {
            incident = {
                category : Detail.fieldByName("category") != null ? Detail.fieldByName("category") : 7,
                sequenceNumber : Detail.fieldByName("sequenceNumber") != null ? Detail.fieldByName("sequenceNumber") : "",
                isSubmitted : Detail.fieldByName("isSubmitted") != null ? Detail.fieldByName("isSubmitted"):false
            };
        }
    }

    Detail.close();
    db.close();

    return incident;
    
};

exports.getIncidentDetail = function(incidentId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);

    var Detail = db.execute("SELECT * FROM Incident WHERE id=?",  !utility.isEmpty(incidentId) ? incidentId : "Empty");

	var incident = null;
    if (Detail != null) {
        if (Detail.isValidRow()) {
            incident = {
                id : Detail.fieldByName("id"),
                flightId : Detail.fieldByName("flightId") != null ? Detail.fieldByName("flightId"):"",
                flightNumber : Detail.fieldByName("flightNumber") != null ? Detail.fieldByName("flightNumber"):"",
                category : Detail.fieldByName("category") != null ? Detail.fieldByName("category"):0,
                reportType : Detail.fieldByName("reportType") != null ? Detail.fieldByName("reportType"):"",
                emergencyType : Detail.fieldByName("emergencyType") != null ? Detail.fieldByName("emergencyType"):0,
                subject : Detail.fieldByName("subject") != null ? Detail.fieldByName("subject"):"",
                safetyZone : Detail.fieldByName("safetyZone") != null ? Detail.fieldByName("safetyZone"):"",
                equipmentId : Detail.fieldByName("equipmentId") != null ? Detail.fieldByName("equipmentId"):"",
                partId : Detail.fieldByName("partId") != null ? Detail.fieldByName("partId"):"",
                ataChapter : Detail.fieldByName("ataChapter") != null ? Detail.fieldByName("ataChapter"):"",
                condition : Detail.fieldByName("condition") != null ? Detail.fieldByName("condition"):"",
                logGroup : Detail.fieldByName("logGroup") != null ? Detail.fieldByName("logGroup"):0,
                sequenceNumber : Detail.fieldByName("sequenceNumber") != null ? Detail.fieldByName("sequenceNumber"):"",
                detail : Detail.fieldByName("detail") != null ? Detail.fieldByName("detail"):"",
                changeSeat : Detail.fieldByName("changeSeat") != null ? Detail.fieldByName("changeSeat"):"",
                createdBy : Detail.fieldByName("createdBy") != null ? Detail.fieldByName("createdBy"):"",
                reportedBy : Detail.fieldByName("reportedBy") != null ? Detail.fieldByName("reportedBy"):"",
                createDateTime : Detail.fieldByName("createDateTime") != null ? Detail.fieldByName("createDateTime"):"",
                updateDateTime : Detail.fieldByName("updateDateTime") != null ? Detail.fieldByName("updateDateTime"):"",
                incidentStatus : Detail.fieldByName("incidentStatus") != null ? Detail.fieldByName("incidentStatus"):0,
                isLog : Detail.fieldByName("isLog") != null ? Detail.fieldByName("isLog"):false,
                isMulti : Detail.fieldByName("isMulti") != null ? Detail.fieldByName("isMulti"):false,
                isSubmitted : Detail.fieldByName("isSubmitted") != null ? Detail.fieldByName("isSubmitted"):false,
                isVoided : Detail.fieldByName("isVoided") != null ? Detail.fieldByName("isVoided"):false,
                isSynced : Detail.fieldByName("isSynced") != null ? Detail.fieldByName("isSynced"):false,
                acReg : Detail.fieldByName("acReg") != null ? Detail.fieldByName("acReg"):"",
                phone : Detail.fieldByName("phone") != null ? Detail.fieldByName("phone"):"",
                email : Detail.fieldByName("email") != null ? Detail.fieldByName("email"):"",
                isSkippedPhoneEmail : Detail.fieldByName("isSkippedPhoneEmail"),
                reasonForChangeSeat : Detail.fieldByName("reasonForChangeSeat"),
                changeSeatMem : [],
                compen : [],
                posMem : [],
                paxMem : [],
                crewMem : [],
                staffMem : [],
                attachment : []
            };
                                  
            // Query compensation items
            var compenSql = "SELECT * FROM Compensation WHERE incidentId='" + incident.id + "'";
            var compenRs = db.execute(compenSql);
            var compensations = [];
            if (compenRs != null) {
                while (compenRs.isValidRow()) {
                    var compensation = {
                        id : compenRs.fieldByName("id"),
                        detail : compenRs.fieldByName("detail"),
                        type : compenRs.fieldByName("type"),
                        quantity : compenRs.fieldByName("quantity"),
                        amount : compenRs.fieldByName("amount"),
                        problem : compenRs.fieldByName("problem"),
                        currency : compenRs.fieldByName("currency"),
                        upgradeCer : compenRs.fieldByName("upgradeCer"),
                        iscFormNumber : compenRs.fieldByName("iscFormNumber"),
                        codeNumber : compenRs.fieldByName("itemCodeNumber"),
                        fromSeat : compenRs.fieldByName("fromSeat"),
                        fromClass : compenRs.fieldByName("fromClass"),
                        toSeat : compenRs.fieldByName("toSeat"),
                        toClass : compenRs.fieldByName("toClass"),
                        createdDateTime : compenRs.fieldByName("createdDateTime"),
                        compensationId : compenRs.fieldByName("compenId"),
                        incidentId : incident.id,
                        compAttachment : []
                    };
                    compensations.push(compensation);
                    compenRs.next();
                }
                compenRs.close();
            }
            incident.compen = compensations;

            // Query change seat
            var chSeatMemSql = "SELECT * FROM ChangeSeatGroupMember WHERE incidentId='" + incident.id + "'";
            var chSeatMemRs = db.execute(chSeatMemSql);
            var chSeatMems = [];
            if (chSeatMemRs != null) {
                while (chSeatMemRs.isValidRow()) {
                    var changeSeat = {
                        fromSeat : chSeatMemRs.fieldByName("oldSeat"),
                        fromClass : chSeatMemRs.fieldByName("oldClass"),
                        toSeat : chSeatMemRs.fieldByName("newSeat"),
                        toClass : chSeatMemRs.fieldByName("newClass"),
                        createdDateTime : chSeatMemRs.fieldByName("createdDateTime")
                    };
                    chSeatMems.push(changeSeat);
                    chSeatMemRs.next();
                }
                chSeatMemRs.close();
            }
            incident.changeSeatMem = chSeatMems;

            // Query positions
            var posMemSql = "SELECT id, positionId, name FROM PositionGroupMember WHERE incidentId='" + incident.id + "'";
            var posMemRs = db.execute(posMemSql);
            var posMems = [];
            if (posMemRs != null) {
                while (posMemRs.isValidRow()) {
                    var position = {
                        positionId : posMemRs.fieldByName("positionId"),
                        name : posMemRs.fieldByName("name")
                    };
                    posMems.push(position);
                    posMemRs.next();
                }
                posMemRs.close();
            }
            incident.posMem = posMems;

            // Query passengers
            var paxMemSql = "SELECT id, paxId, accountId, paxKey, role, detail, type FROM PaxGroupMember WHERE incidentId='" + incident.id + "'";
            var paxMemRs = db.execute(paxMemSql);
            var paxMems = [];
            if (paxMemRs != null) {
                while (paxMemRs.isValidRow()) {
                    var pax = {
                        paxId : paxMemRs.fieldByName("paxId"),
                        accountId : paxMemRs.fieldByName("accountId"),
                        paxKey : paxMemRs.fieldByName("paxKey"),
                        role : paxMemRs.fieldByName("role"),
                        detail : paxMemRs.fieldByName("detail"),
                        type : paxMemRs.fieldByName("type")
                    };
                    paxMems.push(pax);
                    paxMemRs.next();
                }
                paxMemRs.close();
            }
            incident.paxMem = paxMems;

            // Query crew members
            var crewMemSql = "SELECT id, crewId, role, detail, type FROM CrewGroupMember where incidentId='" + incident.id + "'";
            var crewMemRs = db.execute(crewMemSql);
            var crewMems = [];
            if (crewMemRs != null) {
                while (crewMemRs.isValidRow()) {
                    var crewMem = {
                        crewId : crewMemRs.fieldByName("crewId"),
                        role : crewMemRs.fieldByName("role"),
                        detail : crewMemRs.fieldByName("detail"),
                        type : crewMemRs.fieldByName("type"),
                    };
                    crewMems.push(crewMem);
                    crewMemRs.next();
                }
                crewMemRs.close();
            }
            incident.crewMem = crewMems;

            // Query staff members
            var staffMemSql = "SELECT id, name, personnelId, role, detail FROM StaffGroupMember where incidentId='" + incident.id + "'";
            var staffMemRs = db.execute(staffMemSql);
            var staffMems = [];
            if (staffMemRs != null) {
                while (staffMemRs.isValidRow()) {
                    var staffMem = {
                        personnelId : staffMemRs.fieldByName("personnelId"),
                        name : staffMemRs.fieldByName("name"),
                        role : staffMemRs.fieldByName("role"),
                        detail : staffMemRs.fieldByName("detail")
                    };
                    staffMems.push(staffMem);
                    staffMemRs.next();
                }
                staffMemRs.close();
            }
            incident.staffMem = staffMems;

            // Query attachment
            var attachmentSql = "SELECT id, attachmentPath , detail FROM Attachment where incidentId='" + incident.id + "'";
            var attachmentRs = db.execute(attachmentSql);
            var attachments = [];
            if (attachmentRs != null) {
                while (attachmentRs.isValidRow()) {
                    var attachment = {
                        id : attachmentRs.fieldByName("id"),
                        name : attachmentRs.fieldByName("attachmentPath"),
                        detail : attachmentRs.fieldByName("detail")
                    };
                    attachments.push(attachment);
                    attachmentRs.next();
                }
                attachmentRs.close();
            }
            incident.attachment = attachments;

        }

        Detail.close();
    }
    db.close();

    return incident;
};

exports.deleteAttachmentByIncidentId = function(incidentId) {
    if (incidentId != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
        db.execute("DELETE FROM Attachment WHERE incidentId=?", incidentId);
        db.close();
    }
};

exports.insertIncident = function(dataArg) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    db.execute("INSERT OR REPLACE INTO Incident (id,flightId,category,reportType,equipmentId,partId,ataChapter,condition,logGroup,sequenceNumber," + 
        "detail,changeSeat,createdBy,reportedBy,createDateTime,updateDateTime,incidentStatus,isLog," + 
        "isMulti,isSubmitted,isVoided,isSynced,subject,emergencyType,safetyZone,acReg,flightNumber,sector,phone,email,isSkippedPhoneEmail,upgradeChangeSeatType,reasonForChangeSeat) "+
        "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", 
        dataArg.id, 
        dataArg.flightId, 
        dataArg.category, 
        dataArg.reportType, 
        dataArg.equipmentId, 
        dataArg.partId, 
        dataArg.ataChapter, 
        dataArg.condition, 
        dataArg.logGroup, 
        dataArg.sequenceNumber, 
        dataArg.detail, 
        dataArg.changeSeat, 
        dataArg.createdBy, 
        dataArg.reportedBy, 
        dataArg.createDateTime, 
        dataArg.updateDateTime, 
        dataArg.incidentStatus, 
        utility.convertBooleanToInt(dataArg.isLog), 
        utility.convertBooleanToInt(dataArg.isMulti), 
        utility.convertBooleanToInt(dataArg.isSubmitted), 
        utility.convertBooleanToInt(dataArg.isVoided), 
        utility.convertBooleanToInt(dataArg.isSynced), 
        dataArg.subject, 
        dataArg.emergencyType,
        dataArg.safetyZone,
        dataArg.acReg,
        dataArg.flightNumber,
        dataArg.sector,
        dataArg.phone,
        dataArg.email,
        utility.convertBooleanToInt(dataArg.isSkippenPhoneEmail),
        dataArg.upgradeChangeSeatType,
        dataArg.reasonForChange        
       );
    db.close();
};

exports.deleteIncident = function(incidentId) {
    if (incidentId != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
        db.execute("DELETE FROM Incident WHERE id=?", incidentId);
        db.close();
    }
};

exports.submitIncident = function(id) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    db.execute("UPDATE Incident SET isSubmitted = 1 WHERE id=?", id);
    db.close();
};

exports.voidIncident = function(id) {// For AC Maintenance Incident
    var db = Ti.Database.open(Alloy.Globals.dbName);
    db.execute("UPDATE Incident SET isVoided = 1 WHERE id=?", id);
    db.close();
};

exports.getCompleteIncidentIds = function() {
	
	var db = Ti.Database.open(Alloy.Globals.dbName);
	
	var incidentIds = new Array();
		
	var sql = 
		"SELECT Incident.id AS id, COUNT(Attachment.id) AS Attachments, COUNT(CASE WHEN Attachment.isSynced=1 THEN 1 END) AS SyncedAttachments " +
		"FROM Incident, Attachment " +
		"WHERE Incident.isSynced = 1 " +
			"AND Incident.isSubmitted = 1 " +
			"AND Incident.isCompleted = 0 " +
			"AND Incident.id = Attachment.incidentId " +
			"GROUP BY Incident.id " +
			"HAVING Attachments = SyncedAttachments " +
			"UNION ALL " +
			"SELECT Incident.id AS id, 0 AS Attachments, 0 AS SyncedAttachments " +
			"FROM Incident " + 
			"WHERE Incident.isSynced = 1 " +
			"AND Incident.isSubmitted = 1 " +
			"AND Incident.isCompleted = 0 " +
			"AND Incident.id NOT IN (SELECT incidentId FROM Attachment)";
	var rs = db.execute(sql);		
	if (rs != null) {
		while (rs.isValidRow()) {
			var attachmentCount = rs.fieldByName("Attachments");
			var syncedAttachmentCount = rs.fieldByName("SyncedAttachments");	
			incidentIds.push(rs.fieldByName("id"));			
			rs.next();
		}
		
		rs.close();
	}
	
	db.close();
	return incidentIds;
};

exports.updateIncidentsAsCompleted = function(completedIncidentIds) {
	var db = Ti.Database.open(Alloy.Globals.dbName);
	db.execute('BEGIN');
	if (completedIncidentIds != null && completedIncidentIds.length > 0) {
		for (var i = 0; i < completedIncidentIds.length; i++) {
			db.execute('UPDATE Incident SET isCompleted=1 WHERE id=?', completedIncidentIds[i]);
		}
	}
	db.execute('COMMIT');
	db.close();
};

exports.deletePaxGroupMembersByIncidentId = function(incidentId) {
    if (incidentId != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
        db.execute("DELETE FROM PaxGroupMember WHERE incidentId=?", incidentId);
        db.close();
    }
};

exports.deleteCrewGroupMembersByIncidentId = function(incidentId) {
    if (incidentId != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
        db.execute("DELETE FROM CrewGroupMember WHERE incidentId=?", incidentId);
        db.close();
    }
};

exports.deleteStaffGroupMembersByIncidentId = function(incidentId) {
    if (incidentId != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
        db.execute("DELETE FROM StaffGroupMember WHERE incidentId=?", incidentId);
        db.close();
    }
};

exports.deletePositionGroupMembersByIncidentId = function(incidentId) {
    if (incidentId != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
        db.execute("DELETE FROM PositionGroupMember WHERE incidentId=?", incidentId);
        db.close();
    }
};

exports.deleteCompensationsByIncidentId = function(incidentId) {
    if (incidentId != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
        db.execute("DELETE FROM Compensation WHERE incidentId=?", incidentId);
        db.close();
    }
};

exports.deleteGroupMembersByIncidentId = function(incidentId) {
    if (incidentId != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
        db.execute("DELETE FROM PaxGroupMember WHERE incidentId=?", incidentId);
        db.execute("DELETE FROM CrewGroupMember WHERE incidentId=?", incidentId);
        db.execute("DELETE FROM StaffGroupMember WHERE incidentId=?", incidentId);
        db.execute("DELETE FROM PositionGroupMember WHERE incidentId=?", incidentId);
        db.execute("DELETE FROM Compensation WHERE incidentId=?", incidentId);
        db.close();
    }
};

exports.insertPaxGroupMember = function(paxMember) {
    if (paxMember != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
        db.execute("INSERT OR REPLACE INTO PaxGroupMember (paxId, role, detail, incidentId, type, accountId, paxKey) VALUES (?,?,?,?,?,?,?)", paxMember.paxId, paxMember.role, paxMember.detail, paxMember.incidentId, paxMember.type, paxMember.accountId, paxMember.paxKey);
        db.close();
    }
};

exports.deleteChangeSeatByIncidentId = function(incidentId) {
    if (incidentId != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
        db.execute("DELETE FROM ChangeSeatGroupMember WHERE incidentId=?", incidentId);
        db.close();
    }
};

exports.deleteCompensationAttachmentByIncidentId = function(incidentId) {
    if (incidentId != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
        db.execute("BEGIN");
        db.execute("DELETE FROM CompensationAttachment WHERE incidentId=?", incidentId);
        db.execute("COMMIT");
        db.close();
    }
};

exports.insertChangeSeatGroupMember = function(changeSeatMember) {
    if (changeSeatMember != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
        db.execute("INSERT INTO ChangeSeatGroupMember (oldSeat, oldClass, newSeat, newClass, incidentId, createdDateTime) VALUES (?,?,?,?,?,?)", 
                   changeSeatMember.fromSeat,
                   changeSeatMember.fromClass,
                   changeSeatMember.toSeat,
                   changeSeatMember.toClass,
                   changeSeatMember.incidentId,
                   changeSeatMember.createdDateTime
                  );
        db.close();
    }
};

exports.insertOrReplacePaxIdAndIncidentIdGroupMember = function(paxMember) {
    if (paxMember != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
        db.execute("INSERT OR REPLACE INTO PaxGroupMember (paxId, incidentId) VALUES (?,?)", paxMember.paxId, paxMember.incidentId);
        db.close();
    }
};

exports.insertAttachment = function(attachment) {
    if (attachment != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
        db.execute("INSERT OR REPLACE INTO Attachment (attachmentPath, detail, incidentId) VALUES (?,?,?)", attachment.name, attachment.detail, attachment.incidentId);
        db.close();
    }
};

exports.insertPositionGroupMember = function(posMember) {
    if (posMember != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
        db.execute("INSERT OR REPLACE INTO PositionGroupMember (positionId,name, incidentId) VALUES (?,?,?)", posMember.positionId, posMember.name, posMember.incidentId);
        db.close();
    }
};

exports.insertCrewGroupMember = function(crewMember) {
    if (crewMember != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
        db.execute("INSERT OR REPLACE INTO CrewGroupMember (crewId, role, detail, incidentId, type) VALUES (?,?,?,?,?)", crewMember.crewId, crewMember.role, crewMember.detail, crewMember.incidentId, crewMember.type);
        db.close();
    }
};
exports.insertStaffGroupMember = function(staffMember) {
    if (staffMember != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
        db.execute("INSERT OR REPLACE INTO StaffGroupMember (personnelId, name, role, detail, incidentId) VALUES (?,?,?,?,?)", staffMember.personnelId, staffMember.name, staffMember.role, staffMember.detail, staffMember.incidentId);
        db.close();
    }
};

exports.insertCompensation = function(compenMember) {
    if (compenMember != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
            db.execute("INSERT INTO Compensation (detail, type, quantity, amount, incidentId, problem, currency, upgradeCer, iscFormNumber, itemCodeNumber, fromSeat, fromClass, toSeat, toClass, createdDateTime, compenId) "+
            "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", 
             compenMember.detail, 
             compenMember.type, 
             compenMember.quantity, 
             compenMember.amount, 
             utility.strForQuery(compenMember.incidentId),
             compenMember.problem,
             compenMember.currency,
             compenMember.upgradeCer,
             compenMember.iscFormNumber,
             compenMember.codeNumber,
             compenMember.fromSeat,
             compenMember.fromClass,
             compenMember.toSeat,
             compenMember.toClass,
             compenMember.createdDateTime,
             compenMember.compensationId
             );
        db.close();
    }
};

exports.insertCompensationAttachment = function(attachment) {  
    if (attachment != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
        db.execute("INSERT INTO CompensationAttachment (compenId, incidentId, attachmentName, detail) VALUES (?,?,?,?)", attachment.compensationId, attachment.incidentId, attachment.name, attachment.detail);
        db.close();
    }
};

exports.getSubmittedIncidentCompensationAttachments = function() {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var sql = "SELECT CompensationAttachment.id, CompensationAttachment.compenId, CompensationAttachment.incidentId, CompensationAttachment.attachmentName, CompensationAttachment.detail, Incident.sfdcid " + 
                "FROM CompensationAttachment " + 
                "JOIN Incident ON Incident.id = CompensationAttachment.incidentId " + 
                "WHERE Incident.isSynced=1 AND CompensationAttachment.isSynced=0";
    var rs = db.execute(sql);

    var attachments = [];
    if (rs != null) {
        while (rs.isValidRow()) {
            var attachment = {
                id : rs.fieldByName("id"),
                compensationId : rs.fieldByName("compenId"),
                path : rs.fieldByName("attachmentName"),
                detail : rs.fieldByName("detail"),
            };

            attachments.push(attachment);
            rs.next();
        }

        rs.close();
    }

    db.close();
    return attachments;
};

exports.updateCompensationAttachmentSyncStatusCompleted = function(sfid, compensationId) {
    if (compensationId != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
        db.execute("UPDATE CompensationAttachment SET sfdcId=?, isSynced=1 WHERE compenId=?", sfid, compensationId);
        db.close();
    }
};


exports.getSubmittedIncidentAttachments = function(isBackgroundArg) {
    if(isBackgroundArg) {
        var sql = "SELECT Attachment.id, Attachment.incidentId, Attachment.attachmentPath, Attachment.detail, Incident.sfdcid " + 
                    "FROM Attachment " + 
                    "JOIN Incident ON Incident.id = Attachment.incidentId " + 
                    "WHERE Incident.isSubmitted=1 AND Attachment.isSynced=0 AND Incident.upgradeChangeSeatType IS NULL";
    } else {
        var sql = "SELECT Attachment.id, Attachment.incidentId, Attachment.attachmentPath, Attachment.detail, Incident.sfdcid " + 
                    "FROM Attachment " + 
                    "JOIN Incident ON Incident.id = Attachment.incidentId " + 
                    "WHERE Incident.isSynced=1 AND Attachment.isSynced=0";
    }
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var rs = db.execute(sql);

    var attachments = [];
    if (rs != null) {
        while (rs.isValidRow()) {
            var attachment = {
                id : rs.fieldByName("id"),
                incidentId : rs.fieldByName("incidentId"),
                incidentSfdcId : rs.fieldByName("sfdcid"),
                path : rs.fieldByName("attachmentPath"),
                detail : rs.fieldByName("detail"),
            };

            attachments.push(attachment);
            rs.next();
        }

        rs.close();
    }

    db.close();
    return attachments;
};

exports.updateAttachmentSyncStatusCompleteById = function(sfid, attachmentId) {
    if (attachmentId != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
        db.execute("UPDATE Attachment SET sfdcId=?, isSynced=1 WHERE id=?", sfid, attachmentId);
        db.close();
    }
};

//******************************************************

exports.getIncidentSeatDetail = function(LOPAPositionId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var seatDetailArray;
    var seatDetail = db.execute("SELECT LOPAPosition.position,LOPAPosition.class,LOPAPosition.floor,LOPAPosition.zone From LOPAPosition Where LOPAPosition.id= ?", LOPAPositionId + "");
    if (seatDetail != null && seatDetail.isValidRow()) {
        seatDetailArray = {
            position : seatDetail.fieldByName("position"),
            classSeat : seatDetail.fieldByName("class"),
            floor : seatDetail.fieldByName("floor"),
            zone : seatDetail.fieldByName("zone"),
            incident : []
        };
        
        seatDetail.close();
    }
    
	
	db.close();
    return seatDetailArray;
};
//**********************************************
//* Incident Group Member
exports.getPaxGroupMembersByIncidentId = function(incidentId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT * FROM PaxGroupMember WHERE PaxGroupMember.incidentId=?", incidentId);
    var List = [];

    if (Detail != null) {
        while (Detail.isValidRow()) {
            var incident = {
                id : Detail.fieldByName("id"),
                passengerId : Detail.fieldByName("paxId"),
                role : Detail.fieldByName("role"),
                detail : Detail.fieldByName("detail")
            };
            List.push(incident);
            Detail.next();
        }
        Detail.close();
    }
    
    db.close();
    return List;
};

exports.issetPaxLopa = function(LOPAPositionId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var hasPax = false;
    var Detail = db.execute("SELECT Passenger.id FROM Passenger join LOPAPosition on LOPAPosition.position=Passenger.bookingSeat WHERE LOPAPosition.id=? and Passenger.flightId=?", LOPAPositionId + "", currentFlightId);
    if (Detail != null) {
    	hasPax = Detail.isValidRow();
    }
    Detail.close();
    db.close();
    return hasPax;
};

exports.hasPax = function(positionArg) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var hasPax = false;
    var Detail = db.execute("SELECT Passenger.id FROM Passenger WHERE Passenger.bookingSeat=? AND Passenger.flightId=?", positionArg + "", currentFlightId);
    if (Detail != null) {
        hasPax = Detail.isValidRow();
    }
    Detail.close();    
    db.close();

    return hasPax;    
};

exports.getCrewDetail = function(CrewId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT rtFltNo,id,flightId,legNumber,image,crewTitle,crewFirstName,crewLastName,crewNickName,crewType,rank,actingRank,spcSpecial,duty,dutyCode,languages,rtFlightAndDate,posFly,sfdcId,extId,gender,isAppraised FROM Crew WHERE id=? ", CrewId + "");
    var crewDetail = null;
    if (Detail != null && Detail.isValidRow()) {
        crewDetail = {
            id : Detail.fieldByName("id") != null ? Detail.fieldByName("id") : "",
            flightId : Detail.fieldByName("flightId") != null ? Detail.fieldByName("flightId") : "",
            legNumber : Detail.fieldByName("legNumber") != null ? Detail.fieldByName("legNumber") : "",
            image : Detail.fieldByName("image") != null ? Detail.fieldByName("image") : "",
            crewTitle : Detail.fieldByName("crewTitle") != null ? Detail.fieldByName("crewTitle") : "",
            crewFirstName : Detail.fieldByName("crewFirstName") != null ? Detail.fieldByName("crewFirstName") : "",
            crewLastName : Detail.fieldByName("crewLastName") != null ? Detail.fieldByName("crewLastName") : "",
            crewNickName : Detail.fieldByName("crewNickName") != null ? Detail.fieldByName("crewNickName") : "",
            crewType : Detail.fieldByName("crewType") != null ? Detail.fieldByName("crewType") : "",
            rank : Detail.fieldByName("rank") != null ? Detail.fieldByName("rank") : "",
            actingRank : Detail.fieldByName("actingRank") != null ? Detail.fieldByName("actingRank") : "",
            spcSpecial : Detail.fieldByName("spcSpecial") != null ? Detail.fieldByName("spcSpecial") : "",
            duty : Detail.fieldByName("duty") != null ? Detail.fieldByName("duty") : "",
            dutyCode : Detail.fieldByName("dutyCode") != null ? Detail.fieldByName("dutyCode") : "",
            languages : Detail.fieldByName("languages") != null ? Detail.fieldByName("languages") : "",
            rtFlightAndDate : Detail.fieldByName("rtFlightAndDate") != null ? Detail.fieldByName("rtFlightAndDate") : "",
            posFly : Detail.fieldByName("posFly") != null ? Detail.fieldByName("posFly") : "",
            sfdcId : Detail.fieldByName("sfdcId") != null ? Detail.fieldByName("sfdcId") : "",
            rtFltNo : Detail.fieldByName("rtFltNo") != null ? Detail.fieldByName("rtFltNo") : "",
            crewExtId : Detail.fieldByName("extId") != null ? Detail.fieldByName("extId") : "",
            gender : Detail.fieldByName("gender") != null ? Detail.fieldByName("gender") : "",
            isAppraised : Detail.fieldByName("isAppraised")
        };
    	Detail.close();
    } 
    
	db.close();
    return crewDetail;
};

exports.getCrewDetailByCrewExtId = function(CrewId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT rtFltNo,id,flightId,legNumber,image,crewTitle,crewFirstName,crewLastName,crewNickName,crewType,rank,actingRank,spcSpecial,duty,dutyCode,languages,rtFlightAndDate,posFly,sfdcId,extId FROM Crew WHERE crewId = ? ", CrewId + "");
    var crewDetail = null;
    if (Detail != null && Detail.isValidRow()) {
        crewDetail = {
            id : Detail.fieldByName("id") != null ? Detail.fieldByName("id") : "",
            flightId : Detail.fieldByName("flightId") != null ? Detail.fieldByName("flightId") : "",
            legNumber : Detail.fieldByName("legNumber") != null ? Detail.fieldByName("legNumber") : "",
            image : Detail.fieldByName("image") != null ? Detail.fieldByName("image") : "",
            crewTitle : Detail.fieldByName("crewTitle") != null ? Detail.fieldByName("crewTitle") : "",
            crewFirstName : Detail.fieldByName("crewFirstName") != null ? Detail.fieldByName("crewFirstName") : "",
            crewLastName : Detail.fieldByName("crewLastName") != null ? Detail.fieldByName("crewLastName") : "",
            crewNickName : Detail.fieldByName("crewNickName") != null ? Detail.fieldByName("crewNickName") : "",
            crewType : Detail.fieldByName("crewType") != null ? Detail.fieldByName("crewType") : "",
            rank : Detail.fieldByName("rank") != null ? Detail.fieldByName("rank") : "",
            actingRank : Detail.fieldByName("actingRank") != null ? Detail.fieldByName("actingRank") : "",
            spcSpecial : Detail.fieldByName("spcSpecial") != null ? Detail.fieldByName("spcSpecial") : "",
            duty : Detail.fieldByName("duty") != null ? Detail.fieldByName("duty") : "",
            dutyCode : Detail.fieldByName("dutyCode") != null ? Detail.fieldByName("dutyCode") : "",
            languages : Detail.fieldByName("languages") != null ? Detail.fieldByName("languages") : "",
            rtFlightAndDate : Detail.fieldByName("rtFlightAndDate") != null ? Detail.fieldByName("rtFlightAndDate") : "",
            posFly : Detail.fieldByName("posFly") != null ? Detail.fieldByName("posFly") : "",
            sfdcId : Detail.fieldByName("sfdcId") != null ? Detail.fieldByName("sfdcId") : "",
            rtFltNo : Detail.fieldByName("rtFltNo") != null ? Detail.fieldByName("rtFltNo") : "",
            crewId : Detail.fieldByName("extId") != null ? Detail.fieldByName("extId") : "",
        };
        Detail.close();
    } 
    
    db.close();
    return crewDetail;
};

exports.getCrewDetailBySfdcId = function(sfdcId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT id,flightId,legNumber,image,crewTitle,crewFirstName,crewLastName,crewNickName,crewType,rank,actingRank,spcSpecial,duty,dutyCode,languages,rtFlightAndDate,posFly,sfdcId,extId FROM Crew WHERE sfdcId=? ", 
    						  !utility.isEmpty(sfdcId) ? sfdcId : "Empty"
    					   );
	var crewDetail = null;    
    if (Detail != null && Detail.isValidRow()) {
        crewDetail = {
            id : Detail.fieldByName("id") != null ? Detail.fieldByName("id") : "",
            flightId : Detail.fieldByName("flightId") != null ? Detail.fieldByName("flightId") : "",
            legNumber : Detail.fieldByName("legNumber") != null ? Detail.fieldByName("legNumber") : "",
            image : Detail.fieldByName("image") != null ? Detail.fieldByName("image") : "",
            crewTitle : Detail.fieldByName("crewTitle") != null ? Detail.fieldByName("crewTitle") : "",
            crewFirstName : Detail.fieldByName("crewFirstName") != null ? Detail.fieldByName("crewFirstName") : "",
            crewLastName : Detail.fieldByName("crewLastName") != null ? Detail.fieldByName("crewLastName") : "",
            crewNickName : Detail.fieldByName("crewNickName") != null ? Detail.fieldByName("crewNickName") : "",
            crewType : Detail.fieldByName("crewType") != null ? Detail.fieldByName("crewType") : "",
            rank : Detail.fieldByName("rank") != null ? Detail.fieldByName("rank") : "",
            actingRank : Detail.fieldByName("actingRank") != null ? Detail.fieldByName("actingRank") : "",
            spcSpecial : Detail.fieldByName("spcSpecial") != null ? Detail.fieldByName("spcSpecial") : "",
            duty : Detail.fieldByName("duty") != null ? Detail.fieldByName("duty") : "",
            dutyCode : Detail.fieldByName("dutyCode") != null ? Detail.fieldByName("dutyCode") : "",
            languages : Detail.fieldByName("languages") != null ? Detail.fieldByName("languages") : "",
            rtFlightAndDate : Detail.fieldByName("rtFlightAndDate") != null ? Detail.fieldByName("rtFlightAndDate") : "",
            posFly : Detail.fieldByName("posFly") != null ? Detail.fieldByName("posFly") : "",
            sfdcId : Detail.fieldByName("sfdcId") != null ? Detail.fieldByName("sfdcId") : "",
            crewId : Detail.fieldByName("extId") != null ? Detail.fieldByName("extId") : ""
        };
    	Detail.close();
    } 
    
    db.close();
    return crewDetail;
};

exports.getCrewList = function(flightId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var modelCrewList = [];
    var crewTypes = [{
        crewType : "Cockpit",
        CrewList : []
    }, {
        crewType : "Cabin",
        CrewList : []
    }, {
        crewType : "GE",
        CrewList : []
    }, {
        crewType : "Passive",
        CrewList : []
    }, {
        crewType : "Other",
        CrewList : []
    }];
    var Detail = db.execute("SELECT rtFltNo,languages,id,appraisalNo,flightId,legNumber,image,crewFirstName,crewLastName,crewNickName,crewType,rank,spcSpecial,duty, dutyCode,rtFlightAndDate,seqNumber,sfdcId,extId,shouldAppraise,isAppraised FROM Crew WHERE flightId= ? Order by seqNumber ASC", flightId + "");
    if (Detail != null ) {
        while (Detail.isValidRow()) {
            var crew = {
                id : Detail.fieldByName("id") != null ? Detail.fieldByName("id") : "",
                flightId : Detail.fieldByName("flightId") != null ? Detail.fieldByName("flightId") : "",
                legNumber : Detail.fieldByName("legNumber") != null ? Detail.fieldByName("legNumber") : "",
                image : Detail.fieldByName("image") != null ? Detail.fieldByName("image") : "",
                crewFirstName : Detail.fieldByName("crewFirstName") != null ? Detail.fieldByName("crewFirstName") : "",
                crewLastName : Detail.fieldByName("crewLastName") != null ? Detail.fieldByName("crewLastName") : "",
                crewNickName : Detail.fieldByName("crewNickName") != null ? Detail.fieldByName("crewNickName") : "",
                crewType : Detail.fieldByName("crewType") != null ? Detail.fieldByName("crewType") : "",
                rank : Detail.fieldByName("rank") != null ? Detail.fieldByName("rank") : "",
                spcSpecial : Detail.fieldByName("spcSpecial") != null ? Detail.fieldByName("spcSpecial") : "",
                duty : Detail.fieldByName("duty") != null ? Detail.fieldByName("duty") : "",
                dutyCode : Detail.fieldByName("dutyCode") != null ? Detail.fieldByName("dutyCode") : "",
                rtFlightAndDate : Detail.fieldByName("rtFlightAndDate") != null ? Detail.fieldByName("rtFlightAndDate") : "",
                appraisalNo : Detail.fieldByName("appraisalNo") != "null" ? Detail.fieldByName("appraisalNo") : 0,
                seqNumber : Detail.fieldByName("seqNumber") != null ? Detail.fieldByName("seqNumber") : "",
                sfdcId : Detail.fieldByName("sfdcId") != null ? Detail.fieldByName("sfdcId") : "",
                languages : Detail.fieldByName("languages") != null ? Detail.fieldByName("languages") : "",
                rtFltNo : Detail.fieldByName("rtFltNo") != null ? Detail.fieldByName("rtFltNo") : "",
                crewExtId : Detail.fieldByName("extId") != null ? Detail.fieldByName("extId") : "",
                shouldBeEvaluated : Detail.fieldByName("shouldAppraise"),                
                isAppraised : Detail.fieldByName("isAppraised")                
            };
            if (crew.crewType == crewTypes[0].crewType && crew.dutyCode == "FLY") {				//Cockpit
                crewTypes[0].CrewList.push(crew);
            } else if (crew.crewType == crewTypes[1].crewType && crew.dutyCode == "FLY") {		//Cabin
                crewTypes[1].CrewList.push(crew);
            } else if (crew.crewType == crewTypes[2].crewType ) {  	//GE
                crewTypes[2].CrewList.push(crew);
            }
            else if (crew.crewType == crewTypes[4].crewType ) {			//Other
                crewTypes[4].CrewList.push(crew);
            }
            else if (crew.dutyCode == "TVL") {   						//Passive
                crewTypes[3].CrewList.push(crew);
            }
            
            Detail.next();
            
        }
        

        for ( i = 0; i < crewTypes.length; i++) {
            if (crewTypes[i].CrewList.length > 0) {
                modelCrewList.push(crewTypes[i]);
            }
        }

        Detail.close();
        db.close();
        return modelCrewList;
    } else {
        Detail.close();
        db.close();
        return modelCrewList;

    }
};

//
exports.updateCrewIsAppraised = function(crewExtId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    db.execute("UPDATE Crew SET isAppraised=1 WHERE flightId=? AND extId=?",currentFlightId, crewExtId);
    db.close();
};

exports.updateCrewListWhoIsAppraised = function() {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var crewIsEvaluatedListQrs = db.execute("SELECT DISTINCT evaluatedId FROM CrewAppraisalFormAnswer WHERE flightSfdcId=?", currentFlightId);        
    var crewIsEvaluatedList = [];
    if (crewIsEvaluatedListQrs != null) {
        while(crewIsEvaluatedListQrs.isValidRow()) {
            crewIsEvaluatedList.push(crewIsEvaluatedListQrs.fieldByName("evaluatedId"));
            crewIsEvaluatedListQrs.next();
        }                
        crewIsEvaluatedListQrs.close();
    }           

    for(var i = 0; i < crewIsEvaluatedList.length; i++) {
        db.execute("BEGIN");    
        db.execute("UPDATE Crew SET isAppraised=1 WHERE extId=? AND flightId=?", crewIsEvaluatedList[i], currentFlightId);
        db.execute("COMMIT");            
    }
       
    crewIsEvaluatedList = null;         
    db.close();        
};

exports.getSubjectTypeFromFormNumber = function(formNumberArg) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var detail = db.execute("SELECT DISTINCT subjectType FROM CrewAppraisalForm WHERE formNumber=?", formNumberArg+"");
    var subjectType;
    if (detail != null) {
        if (detail.isValidRow()) {
           subjectType = detail.fieldByName("subjectType") != null ? detail.fieldByName("subjectType") : "";
        }
        detail.close();
    }
    db.close();
    return subjectType;
};

exports.getCrewAppraisalItemsDescByGender = function(formNumber, subjectNumber, crewGender) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var detail = db.execute("SELECT * FROM CrewAppraisalForm WHERE formNumber=? AND subjectNumber=? AND condition=?", formNumber, subjectNumber, crewGender);
    var list = [];
    if (detail != null) {
        while (detail.isValidRow()) {
            var appraisalForm = {
                id : detail.fieldByName("id") != null ? detail.fieldByName("id") : "",
                version : detail.fieldByName("version") != null ? detail.fieldByName("version") : "",
                formNumber : detail.fieldByName("formNumber") != null ? detail.fieldByName("formNumber") : "",
                formDesc : detail.fieldByName("formDesc") != null ? detail.fieldByName("formDesc") : "",
                subjectNumber : detail.fieldByName("subjectNumber") != null ? detail.fieldByName("subjectNumber") : "",
                subjectDesc : detail.fieldByName("subjectDesc") != null ? detail.fieldByName("subjectDesc") : "",
                itemNumber : detail.fieldByName("itemNumber") != null ? detail.fieldByName("itemNumber") : "",
                itemDesc : detail.fieldByName("itemDesc") != null ? detail.fieldByName("itemDesc") : "",
                condition : detail.fieldByName("condition") != null ? detail.fieldByName("condition") : "",
                subjectType : detail.fieldByName("subjectType") != null ? detail.fieldByName("subjectType") : "",
                itemType : detail.fieldByName("type") != null ? detail.fieldByName("type") : "",
                sfdcId : detail.fieldByName("sfdcId") != null ? detail.fieldByName("sfdcId") : "",
                valueSelected : "",
                isSelected : false
            };
            list.push(appraisalForm);
            detail.next();
        }
        detail.close();
    }
    db.close();
    return list;
};


exports.insertCrewAppraisalAnswer = function (answersArg, subjectTypeArg) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    db.execute("INSERT OR REPLACE INTO CrewAppraisalFormAnswer "+
         "(id, formNumber, evaluatorId, evaluatedId, flightExtId, flightSfdcId, flightNumber, comment, createdDate, isSynced, formDesc, sfdcId)"+
         " VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", 
            answersArg.id,
            answersArg.formNumber,
            answersArg.evaluatorId,
            answersArg.evaluatedId,
            answersArg.flightExtId,
            answersArg.flightSfdcId,
            answersArg.flightNumber,
            answersArg.comment,
            answersArg.createdDate,
            answersArg.isSynced,
            answersArg.formDesc,
            answersArg.sfdcId
    );                       
    db.execute("BEGIN");
    if(answersArg.appraisalForm.length > 0) {
        db.execute("DELETE FROM CrewAppraisalSubjectAnswer WHERE appraisalId=?", answersArg.id);        
        if(answersArg.appraisalForm[0].itemsDesc.length > 0) {
            db.execute("DELETE FROM CrewAppraisalItemDescAnswer WHERE appraisalId=?", answersArg.id);        
        }
    }
    db.execute("COMMIT");
    for(var i = 0; i < answersArg.appraisalForm.length; i++) {
        db.execute("INSERT INTO CrewAppraisalSubjectAnswer "+
             "(formNumber, subjectNumber, score, comment, subjectDesc, subjectType, appraisalId)"+
             " VALUES (?,?,?,?,?,?,?)", 
                answersArg.formNumber,
                answersArg.appraisalForm[i].subjectNumber,
                answersArg.appraisalForm[i].subjectScore,
                answersArg.appraisalForm[i].comment,
                answersArg.appraisalForm[i].subjectDesc,
                subjectTypeArg,
                answersArg.id
        );               
        for(var j = 0; j < answersArg.appraisalForm[i].itemsDesc.length; j++) {
            if(answersArg.appraisalForm[i].itemsDesc[j].isSelected) {
                db.execute("INSERT INTO CrewAppraisalItemDescAnswer "+
                     "(formNumber, subjectNumber, itemNumber, value, itemDesc, itemType, appraisalId)"+
                     " VALUES (?,?,?,?,?,?,?)", 
                        answersArg.formNumber,
                        answersArg.appraisalForm[i].subjectNumber,
                        answersArg.appraisalForm[i].itemsDesc[j].itemNumber,
                        answersArg.appraisalForm[i].itemsDesc[j].valueSelected,
                        answersArg.appraisalForm[i].itemsDesc[j].itemDesc,
                        answersArg.appraisalForm[i].itemsDesc[j].itemType,
                        answersArg.id
                );                                           
            }
        }                
    }

    db.close();
};

exports.getCrewAppraisalAnswerForSFDC = function() {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var formQry = db.execute("SELECT * FROM CrewAppraisalFormAnswer WHERE isSynced = 0");
    var formList = [];
    if (formQry != null) {
        while (formQry.isValidRow()) {
            var formAnswer = {
               appraisalId : !utility.isEmpty(formQry.fieldByName("id")) ? formQry.fieldByName("id") : null,
               staffNum : !utility.isEmpty(formQry.fieldByName("evaluatedId")) ? formQry.fieldByName("evaluatedId") : null,
               formNum : !utility.isEmpty(formQry.fieldByName("formNumber")) ? formQry.fieldByName("formNumber") : null,
               evaStaffNum : !utility.isEmpty(formQry.fieldByName("evaluatorId")) ? formQry.fieldByName("evaluatorId") : null,
               evaFltExtId : !utility.isEmpty(formQry.fieldByName("flightExtId")) ? formQry.fieldByName("flightExtId") : null,
               evaFltSfdcId : !utility.isEmpty(formQry.fieldByName("flightSfdcId")) ? formQry.fieldByName("flightSfdcId") : null,
               comment : !utility.isEmpty(formQry.fieldByName("comment")) ? formQry.fieldByName("comment") : null,
               createdDate : !utility.isEmpty(formQry.fieldByName("createdDate")) ? formQry.fieldByName("createdDate") : null,
               isSynced : formQry.fieldByName("isSynced"),
               sfdcId : formQry.fieldByName("sfdcId"),
               subjs : [] 
            };
            
            if(formAnswer != null) {
                var subjectQry = db.execute("SELECT * FROM CrewAppraisalSubjectAnswer WHERE formNumber=? AND appraisalId=?", formAnswer.formNum, formAnswer.appraisalId);
                var subjectList = [];
                if (subjectQry != null) {
                    while (subjectQry.isValidRow()) {
                        var subjectType = !utility.isEmpty(subjectQry.fieldByName("subjectType")) ? subjectQry.fieldByName("subjectType") : null;
                        var subjectAnswer = { 
                            subjNum : !utility.isEmpty(subjectQry.fieldByName("subjectNumber")) ? subjectQry.fieldByName("subjectNumber") : null,
                            value : !utility.isEmpty(subjectQry.fieldByName("score")) ? subjectQry.fieldByName("score") : null,
                            comment : !utility.isEmpty(subjectQry.fieldByName("comment")) ? subjectQry.fieldByName("comment") : null,
//                            type : !utility.isEmpty(subjectQry.fieldByName("subjectType")) ? subjectQry.fieldByName("subjectType") : null,
                            items : []
                        };
                        
                        var itemQry = db.execute("SELECT * FROM CrewAppraisalItemDescAnswer WHERE formNumber=? AND subjectNumber=? AND appraisalId=?", formAnswer.formNum, subjectAnswer.subjNum, formAnswer.appraisalId);
                        var itemList = [];
                        if(itemQry != null) {
                            while (itemQry.isValidRow()) {
                                var naAnswer = itemQry.fieldByName("value");
                                if(subjectType == "Rating") {
                                    naAnswer = subjectAnswer.value;
                                } else {
                                    if(itemQry.fieldByName("value") == "NA") {
                                      naAnswer = " ";  
                                    }                                    
                                }
                                var itemAnswer = { 
                                    itemNum : !utility.isEmpty(itemQry.fieldByName("itemNumber")) ? itemQry.fieldByName("itemNumber") : null,
                                    value : !utility.isEmpty(naAnswer) ? naAnswer.substring(0,1) : null
                                };   
                                itemList.push(itemAnswer);
                                itemQry.next();
                            }                         
                            itemQry.close();
                            subjectAnswer.items = itemList;
                        }
                        
                        subjectList.push(subjectAnswer);
                        subjectQry.next();
                    }
                    subjectQry.close();
                    formAnswer.subjs = subjectList;
                }
            }
            
            formList.push(formAnswer);
            formQry.next();
        }
        formQry.close();
    }
    db.close();
    return formList;
};

exports.getCrewAppraisalFormAndAnswer = function(evaluatorArg, evaluatedArg) {
    var evaluatorRankArg = evaluatorArg.rank;
    var evaluatedRankArg = evaluatedArg.rank;
    var evaluatorIdArg = evaluatorArg.id;
    var evaluatedIdArg = evaluatedArg.crewExtId;

    var flightDetail = exports.getFlightDetails();
    var flightNumber = "";
    if(flightDetail != null) {
        var flightNumberTemp = flightDetail.flightExternalId.replace(/_/gi, "");
        flightNumber = flightNumberTemp.substring(0, flightNumberTemp.length-1); 
    }
    
    var formNumber = "";
    
    var db = Ti.Database.open(Alloy.Globals.dbName);

    var formNumberQry = db.execute("SELECT formNumber FROM CrewAppraisalFormCriteria WHERE evaluator=? AND evaluated=?", evaluatorRankArg+"", evaluatedRankArg+"");

    var formQry = null;
    if(formNumberQry != null && formNumberQry.isValidRow()) {
        formNumber = formNumberQry.fieldByName("formNumber");                
    } else if(evaluatorRankArg.toLowerCase() == "im" || evaluatorRankArg.toLowerCase() == "ap" || evaluatorRankArg.toLowerCase() == "d"){
        formNumber = "04";
    } else {
        formNumber = "";
    }
    
    var sql = "SELECT * " + 
               "FROM CrewAppraisalForm " + 
               "WHERE CrewAppraisalForm.formNumber=? " + 
               "GROUP BY CrewAppraisalForm.subjectNumber " +
               "ORDER BY CrewAppraisalForm.subjectNumber ASC";
    var formQry = db.execute(sql, formNumber);

    var formDetail = {
        formNumber : "",
        formDesc : "",
        comment : "",
        createdDate : "",
        appraisalId : null,
        sfdcId: null,
        subjectList : []        
    };

    var formAnswerQry = null;
    if (formQry != null) {
        if(formQry.isValidRow()) {
          formDetail.formNumber = formQry.fieldByName("formNumber") != null ? formQry.fieldByName("formNumber") : "";  
          formDetail.formDesc = formQry.fieldByName("formDesc") != null ? formQry.fieldByName("formDesc") : "";

            formAnswerQry = db.execute("SELECT * FROM CrewAppraisalFormAnswer WHERE evaluatorId=? AND evaluatedId=? AND flightNumber=?",evaluatorIdArg, evaluatedIdArg, flightNumber);
            if (formAnswerQry != null && formAnswerQry.isValidRow()) {
                formDetail.comment = formAnswerQry.fieldByName("comment")!= null ? formAnswerQry.fieldByName("comment") : "";
                formDetail.createdDate = formAnswerQry.fieldByName("createdDate")!= null ? formAnswerQry.fieldByName("createdDate") : "";
                formDetail.appraisalId = formAnswerQry.fieldByName("id")!= null ? formAnswerQry.fieldByName("id") : "";
                formDetail.sfdcId = formAnswerQry.fieldByName("sfdcId");
            }
        }
        
        while (formQry.isValidRow()) {
            var subject = { 
                subjectNumber : formQry.fieldByName("subjectNumber") != null ? formQry.fieldByName("subjectNumber") : "",
                subjectDesc : formQry.fieldByName("subjectDesc") != null ? formQry.fieldByName("subjectDesc") : "",
                subjectScore : "0",
                isSelected : false,
                isItemsDescSelected : false,
                comment : "",
                itemsDesc : []
            };

            var subjectAnswerQry = db.execute("SELECT score, comment FROM CrewAppraisalSubjectAnswer WHERE formNumber=? AND subjectNumber=? AND appraisalId=?", 
                                                !utility.isEmpty(formDetail.formNumber) ? formDetail.formNumber : "Empty", 
                                                !utility.isEmpty(subject.subjectNumber) ? subject.subjectNumber : "Empty", 
                                                !utility.isEmpty(formDetail.appraisalId) ? formDetail.appraisalId : "Empty"
                                             );
            if(subjectAnswerQry != null && subjectAnswerQry.isValidRow()) {
                subject.subjectScore = subjectAnswerQry.fieldByName("score")!= null ? subjectAnswerQry.fieldByName("score") : "0";
                subject.comment = subjectAnswerQry.fieldByName("comment")!= null ? subjectAnswerQry.fieldByName("comment") : "";
            }
            
            if(subject.subjectNumber != null && subject.subjectNumber.length > 0) {
                var descQry = db.execute("SELECT * FROM CrewAppraisalForm WHERE formNumber=? AND subjectNumber=?", 
                                          !utility.isEmpty(formDetail.formNumber) ? formDetail.formNumber : "Empty", 
                                          !utility.isEmpty(subject.subjectNumber) ? subject.subjectNumber : "Empty"
                                        );
                var itemsDescList = [];
                if (descQry != null) {
                    var defaultValue = "";
                    var isSelected = false;
                    while (descQry.isValidRow()) {
                        if(descQry.fieldByName("type") != null && descQry.fieldByName("type") != "Checkbox") {
                            if(descQry.fieldByName("defaultValue") != null && descQry.fieldByName("defaultValue").length > 0) {
                               defaultValue = descQry.fieldByName("defaultValue");                                
                            } else {
                               defaultValue = "YES";                                                                
                            }
                            isSelected = true;
                        } 
                        var itemDesc = { 
                            id : descQry.fieldByName("id") != null ? descQry.fieldByName("id") : "",
                            version : descQry.fieldByName("version") != null ? descQry.fieldByName("version") : "",
                            formNumber : descQry.fieldByName("formNumber") != null ? descQry.fieldByName("formNumber") : "",
                            formDesc : descQry.fieldByName("formDesc") != null ? descQry.fieldByName("formDesc") : "",
                            itemNumber : descQry.fieldByName("itemNumber") != null ? descQry.fieldByName("itemNumber") : "",
                            itemDesc : descQry.fieldByName("itemDesc") != null ? descQry.fieldByName("itemDesc") : "",
                            condition : descQry.fieldByName("condition") != null ? descQry.fieldByName("condition") : "",
                            subjectType : descQry.fieldByName("subjectType") != null ? descQry.fieldByName("subjectType") : "",
                            itemType : descQry.fieldByName("type") != null ? descQry.fieldByName("type") : "",
                            sfdcId : descQry.fieldByName("sfdcId") != null ? descQry.fieldByName("sfdcId") : "",
                            valueSelected : defaultValue,
                            isSelected : isSelected
                        };
                        
                        var itemAnswerQry = db.execute("SELECT itemType, value FROM CrewAppraisalItemDescAnswer WHERE formNumber=? AND subjectNumber=? AND itemNumber=? AND appraisalId=?", 
                                                        !utility.isEmpty(formDetail.formNumber) ? formDetail.formNumber : "Empty", 
                                                        !utility.isEmpty(subject.subjectNumber) ? subject.subjectNumber : "Empty", 
                                                        !utility.isEmpty(itemDesc.itemNumber) ? itemDesc.itemNumber : "Empty", 
                                                        !utility.isEmpty(formDetail.appraisalId) ? formDetail.appraisalId : "Empty"
                                                      );
       
                        if(itemAnswerQry != null && itemAnswerQry.isValidRow()) {
                            itemDesc.isSelected = true;
                            if(itemAnswerQry.fieldByName("itemType") != null && itemAnswerQry.fieldByName("itemType") != "Checkbox") {
                                itemDesc.valueSelected = itemAnswerQry.fieldByName("value");
                            }
                        }
                                                
                        itemsDescList.push(itemDesc);
                        descQry.next();
                    }
                    descQry.close();
                }
                subject.itemsDesc = itemsDescList;
                itemsDescList = [];                
            }
            formDetail.subjectList.push(subject);
            formQry.next();
        }
        formQry.close();
    }
    db.close();
    return formDetail;
};

exports.updateCrewListWhoShouldBeAppraised = function(userRank) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    
    var eavaluatedCount = 0;
    var Detail = db.execute("SELECT id, appraisalNo, lastAppraisal, crewType, rank, dutyCode,seqNumber,sfdcId,extId FROM Crew WHERE flightId=? AND crewType = 'Cabin' AND (posFly = 'AST' OR posFly = 'AHT') AND dutyCode='FLY' ORDER BY appraisalNo, lastAppraisal ASC", currentFlightId);
    if (Detail != null) {
        while (Detail.isValidRow()) {
            eavaluatedCount++;
            db.execute("BEGIN");
            db.execute("UPDATE Crew SET shouldAppraise=1 WHERE flightId=? AND id=? AND dutyCode='FLY'",currentFlightId, Detail.fieldByName("id"));
            db.execute("COMMIT");
            Detail.next();
        }
        Detail.close();
    }    
    
    var hasAP = false;
    var hasIM = false;
    var crewApQrs = db.execute("SELECT id FROM Crew WHERE flightId=? AND crewType = 'Cabin' AND rank = 'AP' AND dutyCode='FLY'", currentFlightId);
    if (crewApQrs != null) {
        hasAP = crewApQrs.isValidRow();
        crewApQrs.close();
    }
    var crewImQrs = db.execute("SELECT id FROM Crew WHERE flightId=? AND crewType = 'Cabin' AND rank = 'IM' AND dutyCode='FLY'", currentFlightId);
    if (crewImQrs != null) {
        hasIM = crewImQrs.isValidRow();
        crewImQrs.close();
    }
    if(hasAP && hasIM) {
        var evaluatedLimit = 6;
    } else {
        var evaluatedLimit = 3;        
    }    
    
    if(eavaluatedCount < evaluatedLimit) {
        var countLimit = evaluatedLimit - eavaluatedCount;
        var sql = "SELECT id, appraisalNo, lastAppraisal, crewType, rank, dutyCode,seqNumber,sfdcId,extId FROM Crew WHERE flightId='"+currentFlightId+"' AND crewType = 'Cabin'  AND dutyCode='FLY' AND posFly <> 'AST' AND posFly <> 'AHT' AND rank<> ? ORDER BY appraisalNo, lastAppraisal ASC LIMIT " + countLimit;
        var Detail = db.execute(sql, userRank);
        if (Detail != null) {
            while (Detail.isValidRow()) {
                db.execute("BEGIN");
                db.execute("UPDATE Crew SET shouldAppraise=1 WHERE flightId=? AND id=? AND dutyCode='FLY'",currentFlightId, Detail.fieldByName("id"));
                db.execute("COMMIT");
                Detail.next();
            }
            Detail.close();
        }        
    }
    
    db.close();
};


exports.updateCrewAppraisalPostReturn = function(dataArgs) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    
    try {
        if (dataArgs != null && dataArgs.length > 0) {
            for (var i = 0; i < dataArgs.length; i++) {
                db.execute("UPDATE CrewAppraisalFormAnswer SET isSynced = 1, sfdcId = ? WHERE id=?",dataArgs[i].sfdcId, dataArgs[i].appraisalId);
            };
        }
    } catch(e) {
        Ti.API.error(e);
    }
    db.close();
};


/* try to sort  appraisalno. */
function sortFnByAppraisalNo(a, b) {
    if (a.appraisalNo < b.appraisalNo)
        return -1;
    if (a.appraisalNo > b.appraisalNo)
        return 1;
    if (a.appraisalNo == b.appraisalNo)
        return 0;
};

exports.getCrewListSortBySeqNo = function(flightId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var List = [];

    var Detail = db.execute("SELECT id,appraisalNo,flightId,legNumber,image,crewFirstName,crewLastName,crewNickName,crewType,rank,spcSpecial,duty,rtFlightAndDate,seqNumber,sfdcId,dutyCode,shouldAppraise FROM Crew WHERE flightId= ? ", 
    							!utility.isEmpty(flightId) ? flightId : "Empty"
    						);
    if (Detail != null) {
	    while (Detail.isValidRow()) {
	        var crew = {
	            id : Detail.fieldByName("id") != null ? Detail.fieldByName("id") : "",
	            flightId : Detail.fieldByName("flightId") != null ? Detail.fieldByName("flightId") : "",
	            legNumber : Detail.fieldByName("legNumber") != null ? Detail.fieldByName("legNumber") : "",
	            image : Detail.fieldByName("image") != null ? Detail.fieldByName("image") : "",
	            crewFirstName : Detail.fieldByName("crewFirstName") != null ? Detail.fieldByName("crewFirstName") : "",
	            crewLastName : Detail.fieldByName("crewLastName") != null ? Detail.fieldByName("crewLastName") : "",
	            crewNickName : Detail.fieldByName("crewNickName") != null ? Detail.fieldByName("crewNickName") : "",
	            crewType : Detail.fieldByName("crewType") != null ? Detail.fieldByName("crewType") : "",
	            rank : Detail.fieldByName("rank") != null ? Detail.fieldByName("rank") : "",
	            spcSpecial : Detail.fieldByName("spcSpecial") != null ? Detail.fieldByName("spcSpecial") : "",
	            duty : Detail.fieldByName("duty") != null ? Detail.fieldByName("duty") : "",
	            dutyCode : Detail.fieldByName("dutyCode") != null ? Detail.fieldByName("dutyCode") : "",
	            rtFlightAndDate : Detail.fieldByName("rtFlightAndDate") != null ? Detail.fieldByName("rtFlightAndDate") : "",
	            appraisalNo : Detail.fieldByName("appraisalNo") != "null" ? Detail.fieldByName("appraisalNo") : 0,
	            seqNumber : Detail.fieldByName("seqNumber") != null ? Detail.fieldByName("seqNumber") : "",
	            sfdcId : Detail.fieldByName("sfdcId") != null ? Detail.fieldByName("sfdcId") : "",
                shouldBeEvaluated : Detail.fieldByName("shouldAppraise")	            
	        };
	        List.push(crew);
	        Detail.next();
	
	    }
		Detail.close();
	}
	
    db.close();
    return List.sort(sortFnBySeqNumber);
};

function sortFnBySeqNumber(a, b) {
    if (a.seqNumber < b.seqNumber)
        return -1;
    if (a.seqNumber > b.seqNumber)
        return 1;
    if (a.seqNumber == b.seqNumber)
        return 0;
};

exports.getPassengerDetail = function(PassengerId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT * FROM Passenger WHERE Passenger.id=?", !utility.isEmpty(PassengerId) ? PassengerId : "Empty");
    var passenger = null;
    if (Detail != null && Detail.isValidRow()) {
        passenger = {
            id : (Detail.fieldByName("id") != null ? Detail.fieldByName("id") : ""),
            flightId : (Detail.fieldByName("flightId") != null ? Detail.fieldByName("flightId") : ""),
            legNumber : (Detail.fieldByName("legNumber") != null ? Detail.fieldByName("legNumber") : ""),
            pnrNumber : (Detail.fieldByName("pnrNumber") != null ? Detail.fieldByName("pnrNumber") : ""),
            bookingSeat : (Detail.fieldByName("bookingSeat") != null ? Detail.fieldByName("bookingSeat") : ""),
            firstName : (Detail.fieldByName("firstName") != null ? Detail.fieldByName("firstName") : ""),
            lastName : (Detail.fieldByName("lastName") != null ? Detail.fieldByName("lastName") : ""),
            image : (Detail.fieldByName("image") != null ? Detail.fieldByName("image") : ""),
            gender : (Detail.fieldByName("gender") != null ? Detail.fieldByName("gender") : ""),
            dateOfBirth : (Detail.fieldByName("dateOfBirth") != null ? Detail.fieldByName("dateOfBirth") : ""),
            nationality : (Detail.fieldByName("nationality") != null ? Detail.fieldByName("nationality") : ""),
            phone : (Detail.fieldByName("phone") != null ? Detail.fieldByName("phone") : ""),
            mobile : (Detail.fieldByName("mobile") != null ? Detail.fieldByName("mobile") : ""),
            email1 : (Detail.fieldByName("email1") != null ? Detail.fieldByName("email1") : ""),
            email2 : (Detail.fieldByName("email2") != null ? Detail.fieldByName("email2") : ""),
            bookingClass : (Detail.fieldByName("bookingClass") != null ? Detail.fieldByName("bookingClass") : ""),
            baggage : (Detail.fieldByName("baggage") != null ? Detail.fieldByName("baggage") : ""),
            floor : "",
            zone : "",
            infantName : (Detail.fieldByName("infantName") != null ? Detail.fieldByName("infantName") : ""),
            infantAge : (Detail.fieldByName("infantAge") != null ? Detail.fieldByName("infantAge") : ""),
            paxKey : (Detail.fieldByName("paxKey") != null ? Detail.fieldByName("paxKey") : ""),
            accountId : (Detail.fieldByName("accountId") != null ? Detail.fieldByName("accountId") : ""),            
            oldSeat : (Detail.fieldByName("oldSeat") != null ? Detail.fieldByName("oldSeat") : ""),            
            oldClass : (Detail.fieldByName("oldClass") != null ? Detail.fieldByName("oldClass") : ""),
            conFlightNumber : (Detail.fieldByName("conFlightNumber") != null ? Detail.fieldByName("conFlightNumber") : ""),
            conFlightDate : (Detail.fieldByName("searchConDate") != null ? Detail.fieldByName("searchConDate") : ""),
            conFlightTime : (Detail.fieldByName("searchConSTD") != null ? Detail.fieldByName("searchConSTD") : ""),            
            staff : (Detail.fieldByName("searchStaff") != null ? Detail.fieldByName("searchStaff") : ""),
            memberId : (Detail.fieldByName("memberId") != null ? Detail.fieldByName("memberId") : ""),
            salutation : (Detail.fieldByName("salutation") != null ? Detail.fieldByName("salutation") : ""),
            
        };

        var Detail2 = db.execute("SELECT LOPAPosition.floor,LOPAPosition.zone FROM Passenger join LOPAPosition on LOPAPosition.position=Passenger.bookingSeat WHERE Passenger.id=? ", PassengerId + "");
        if (Detail2 != null && Detail2.isValidRow()) {
            passenger.floor = Detail2.fieldByName("floor") != null ? Detail2.fieldByName("floor") : "";
            passenger.zone = Detail2.fieldByName("zone") != null ? Detail2.fieldByName("zone") : "";
            
            Detail2.close();
        }
		Detail.close();
    }
    
    db.close();
    return passenger;
};

exports.getPassengerDetailByIdOrAccountIdOrPaxKey = function(PassengerId,accountId,paxKey,lopaPosition) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT * FROM Passenger WHERE (Passenger.id=? OR Passenger.accountId=? OR Passenger.paxKey=? OR Passenger.bookingSeat=?) AND Passenger.flightId=?", 
	    						!utility.isEmpty(PassengerId) ? PassengerId : "Empty", 
	    						!utility.isEmpty(accountId) ? accountId : "Empty", 
	    						!utility.isEmpty(paxKey) ? paxKey : "Empty", 
	    						!utility.isEmpty(lopaPosition) ? lopaPosition : "Empty", 
	    						!utility.isEmpty(currentFlightId) ? currentFlightId : "Empty" 
	    					);
    var passenger = null;
    if (Detail != null && Detail.isValidRow()) {
        passenger = {
            id : (Detail.fieldByName("id") != null ? Detail.fieldByName("id") : ""),
            accountId : (Detail.fieldByName("accountId") != null ? Detail.fieldByName("accountId") : ""),
            paxKey : (Detail.fieldByName("id") != null ? Detail.fieldByName("paxKey") : ""),
            flightId : (Detail.fieldByName("flightId") != null ? Detail.fieldByName("flightId") : ""),
            legNumber : (Detail.fieldByName("legNumber") != null ? Detail.fieldByName("legNumber") : ""),
            pnrNumber : (Detail.fieldByName("pnrNumber") != null ? Detail.fieldByName("pnrNumber") : ""),
            bookingSeat : (Detail.fieldByName("bookingSeat") != null ? Detail.fieldByName("bookingSeat") : ""),
            firstName : (Detail.fieldByName("firstName") != null ? Detail.fieldByName("firstName") : ""),
            lastName : (Detail.fieldByName("lastName") != null ? Detail.fieldByName("lastName") : ""),
            image : (Detail.fieldByName("image") != null ? Detail.fieldByName("image") : ""),
            gender : (Detail.fieldByName("gender") != null ? Detail.fieldByName("gender") : ""),
            dateOfBirth : (Detail.fieldByName("dateOfBirth") != null ? Detail.fieldByName("dateOfBirth") : ""),
            nationality : (Detail.fieldByName("nationality") != null ? Detail.fieldByName("nationality") : ""),
            phone : (Detail.fieldByName("phone") != null ? Detail.fieldByName("phone") : ""),
            mobile : (Detail.fieldByName("mobile") != null ? Detail.fieldByName("mobile") : ""),
            email1 : (Detail.fieldByName("email1") != null ? Detail.fieldByName("email1") : ""),
            email2 : (Detail.fieldByName("email2") != null ? Detail.fieldByName("email2") : ""),
            bookingClass : (Detail.fieldByName("bookingClass") != null ? Detail.fieldByName("bookingClass") : ""),
            baggage : (Detail.fieldByName("baggage") != null ? Detail.fieldByName("baggage") : ""),
            floor : "",
            zone : "",
            infantName : (Detail.fieldByName("infantName") != null ? Detail.fieldByName("infantName") : ""),
            infantAge : (Detail.fieldByName("infantAge") != null ? Detail.fieldByName("infantAge") : ""),
            upgradeCode : (Detail.fieldByName("upgrade") != null ? Detail.fieldByName("upgrade") : ""),
            staff : (Detail.fieldByName("searchStaff") != null ? Detail.fieldByName("searchStaff") : ""),
            oldSeat : (Detail.fieldByName("oldSeat") != null ? Detail.fieldByName("oldSeat") : ""),            
            oldClass : (Detail.fieldByName("oldClass") != null ? Detail.fieldByName("oldClass") : ""),
            conFlightNumber : (Detail.fieldByName("conFlightNumber") != null ? Detail.fieldByName("conFlightNumber") : ""),
            conFlightDate : (Detail.fieldByName("searchConDate") != null ? Detail.fieldByName("searchConDate") : ""),
            conFlightTime : (Detail.fieldByName("searchConSTD") != null ? Detail.fieldByName("searchConSTD") : ""),            
            memberId : (Detail.fieldByName("memberId") != null ? Detail.fieldByName("memberId") : ""),
            salutation : (Detail.fieldByName("salutation") != null ? Detail.fieldByName("salutation") : ""),
            

        };
        
		Detail.close();
		
    }
    
    var Detail2 = db.execute("SELECT LOPAPosition.floor,LOPAPosition.zone FROM Passenger join LOPAPosition on LOPAPosition.position=Passenger.bookingSeat WHERE Passenger.id=? ", PassengerId + "");
    if (Detail2 != null && Detail2.isValidRow()) {
       passenger.floor = Detail2.fieldByName("floor") != null ? Detail2.fieldByName("floor") : "";
       passenger.zone = Detail2.fieldByName("zone") != null ? Detail2.fieldByName("zone") : "";
       Detail2.close();
    }
    
    db.close();
    return passenger;

};


exports.getPassengerDetailByLopaPosition = function(lopaPosition) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT id,accountId,paxKey,infantName,infantAge,flightId,legNumber,pnrNumber,bookingSeat,firstName,lastName,image,gender,dateOfBirth,nationality,phone,mobile,email1,email2,bookingClass,baggage FROM Passenger  WHERE Passenger.bookingSeat=? and Passenger.flightId = ?", lopaPosition + "", currentFlightId);
    var passenger = null;
    if (Detail != null && Detail.isValidRow()) {
        passenger = {
            id : (Detail.fieldByName("id") != null ? Detail.fieldByName("id") : ""),
            accountId : (Detail.fieldByName("id") != null ? Detail.fieldByName("accountId") : ""),
            paxKey : (Detail.fieldByName("id") != null ? Detail.fieldByName("paxKey") : ""),
            flightId : (Detail.fieldByName("flightId") != null ? Detail.fieldByName("flightId") : ""),
            legNumber : (Detail.fieldByName("legNumber") != null ? Detail.fieldByName("legNumber") : ""),
            pnrNumber : (Detail.fieldByName("pnrNumber") != null ? Detail.fieldByName("pnrNumber") : ""),
            bookingSeat : (Detail.fieldByName("bookingSeat") != null ? Detail.fieldByName("bookingSeat") : ""),
            firstName : (Detail.fieldByName("firstName") != null ? Detail.fieldByName("firstName") : ""),
            lastName : (Detail.fieldByName("lastName") != null ? Detail.fieldByName("lastName") : ""),
            image : (Detail.fieldByName("image") != null ? Detail.fieldByName("image") : ""),
            gender : (Detail.fieldByName("gender") != null ? Detail.fieldByName("gender") : ""),
            dateOfBirth : (Detail.fieldByName("dateOfBirth") != null ? Detail.fieldByName("dateOfBirth") : ""),
            nationality : (Detail.fieldByName("nationality") != null ? Detail.fieldByName("nationality") : ""),
            phone : (Detail.fieldByName("phone") != null ? Detail.fieldByName("phone") : ""),
            mobile : (Detail.fieldByName("mobile") != null ? Detail.fieldByName("mobile") : ""),
            email1 : (Detail.fieldByName("email1") != null ? Detail.fieldByName("email1") : ""),
            email2 : (Detail.fieldByName("email2") != null ? Detail.fieldByName("email2") : ""),
            bookingClass : (Detail.fieldByName("bookingClass") != null ? Detail.fieldByName("bookingClass") : ""),
            baggage : (Detail.fieldByName("baggage") != null ? Detail.fieldByName("baggage") : ""),
            floor : "",
            zone : "",
            infantName : (Detail.fieldByName("infantName") != null ? Detail.fieldByName("infantName") : ""),
            infantAge : (Detail.fieldByName("infantAge") != null ? Detail.fieldByName("infantAge") : "")
        };
    	Detail.close();
    }
    
	db.close();
	return passenger;
};

exports.getRop = function(memberId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT id,passengerId,ropTier,mailingAddress,businessPhone,mobile,email,ropMileage,expiringMileage,ropMileExpireDate,seatPreference,favoriteFood,occupation,languagePreference,homePhone,foodPreference,drinkPreference FROM ROP WHERE id=? ", 
    						   !utility.isEmpty(memberId) ? memberId : "Empty"
    						);
    if (Detail != null && Detail.isValidRow()) {
        var rop = {
            id : Detail.fieldByName("id") != null ? Detail.fieldByName("id") : "",
            passengerId : Detail.fieldByName("passengerId") != null ? Detail.fieldByName("passengerId") : "",
            ropTier : Detail.fieldByName("ropTier") != null ? Detail.fieldByName("ropTier") : "",
            mailingAddress : Detail.fieldByName("mailingAddress") != null ? Detail.fieldByName("mailingAddress") : "",
            phone : Detail.fieldByName("businessPhone") != null ? Detail.fieldByName("businessPhone") : "",
            mobile : Detail.fieldByName("mobile") != null ? Detail.fieldByName("mobile") : "",
            email : Detail.fieldByName("email") != null ? Detail.fieldByName("email") : "",
            ropMileage : Detail.fieldByName("ropMileage") != null ? Detail.fieldByName("ropMileage") : "",
            expiringMileage : Detail.fieldByName("expiringMileage") != null ? Detail.fieldByName("expiringMileage") : "",
            ropMileExpireDate : Detail.fieldByName("ropMileExpireDate") != null ? Detail.fieldByName("ropMileExpireDate") : "",
            seatPreference : Detail.fieldByName("seatPreference") != null ? Detail.fieldByName("seatPreference") : "",
            favoriteFood : Detail.fieldByName("favoriteFood") != null ? Detail.fieldByName("favoriteFood") : "",
            occupation : Detail.fieldByName("occupation") != null ? Detail.fieldByName("occupation") : "",
            languagePreference : Detail.fieldByName("languagePreference") != null ? Detail.fieldByName("languagePreference") : "",
            homePhone : Detail.fieldByName("homePhone") != null ? Detail.fieldByName("homePhone") : "",
            foodPreference : Detail.fieldByName("foodPreference") != null ? Detail.fieldByName("foodPreference") : "",
            drinkPreference : Detail.fieldByName("drinkPreference") != null ? Detail.fieldByName("drinkPreference") : "",
        };
        Detail.close();
        db.close();
        return rop;
    } else {
        db.close();
        return false;
    }

};

exports.getPassengerSSR = function(passengerId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);

    var Detail = db.execute("SELECT id,passengerId,type,remark,status,service FROM SSR WHERE passengerId= ? ", passengerId + "");
    var List = [];
    if (Detail != null) {
        while (Detail.isValidRow()) {
            var SSR = {
                id : Detail.fieldByName("id"),
                passengerId : Detail.fieldByName("passengerId"),
                type : Detail.fieldByName("type"),
                remark : Detail.fieldByName("remark"),
                status : Detail.fieldByName("status"),
                service : Detail.fieldByName("service")
            };

            List.push(SSR);
            Detail.next();
        }
        Detail.close();
    }
    
    db.close();
    return List;
};

exports.getPassengerSSRList = function(flightId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);

    var Detail = db.execute("SELECT ROP.ropTier,Passenger.bookingSeat,Passenger.id,Passenger.firstName,Passenger.lastName,SSR.passengerId,SSR.type,SSR.remark,SSR.status,SSR.service "+
    						"FROM SSR left join Passenger on Passenger.id=SSR.passengerId "+
    						"LEFT JOIN ROP ON Passenger.id=ROP.passengerId WHERE Passenger.flightId= ? ", flightId);
    var List = [];
    if (Detail != null) {
        while (Detail.isValidRow()) {
            var rop = "";
            if (Detail.fieldByName("ropTier") != null) {
                rop = "ROP " + Detail.fieldByName("ropTier");
            }
            var SSR = {
                id : Detail.fieldByName("id"),
                rop : Detail.fieldByName("ropTier"),
                name : Detail.fieldByName("lastName") + "  " + Detail.fieldByName("firstName"),
                type : Detail.fieldByName("type"),
                remark : Detail.fieldByName("remark"),
                status : Detail.fieldByName("status"),
                service : Detail.fieldByName("service"),
                bookingSeat : Detail.fieldByName("bookingSeat")
            };

            List.push(SSR);
            Detail.next();
        }
        Detail.close();
    }
    
    db.close();
    return List;
};

/* SSR edit: class/status/seat */
exports.getPassengerSSRListEdit = function(flightId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    						 
    var Detail = db.execute("SELECT "+
    						"ROP.ropTier,"+   						
    						"Passenger.bookingClass,"+
    						"Passenger.bookingSeat,"+
    						"Passenger.id,"+
    						"Passenger.firstName,"+
    						"Passenger.lastName,"+
    						
    						"SSR.passengerId,"+
    						"SSR.type,"+
    						"SSR.remark,"+
    						"SSR.status,"+
    						"SSR.service "+
    						
    						"FROM SSR "+
    						"left join Passenger on Passenger.id=SSR.passengerId "+
    						"LEFT JOIN ROP ON Passenger.id=ROP.passengerId "+
    						 "WHERE Passenger.flightId= ? " + //); 
    						 "Order by Passenger.bookingSeat ASC" , flightId);

    var List = [];
    
    /* sort by class: F C U Y */
    var ListF = [];
    var ListC = [];
    var ListU = [];
    var ListY = [];
    
    /* sort by class: F C U Y: Confirm */
    var ListFconf = [];
    var ListCconf = [];
    var ListUconf = []; 
    var ListYconf = [];
    
    /* sort by class: F C U Y: Not Confirm */
    var ListFnot = [];
    var ListCnot = [];
    var ListUnot = []; 
    var ListYnot = [];
    
    
    /* sort by class: F C U Y: null */
    var ListFnull = [];
    var ListCnull = [];
    var ListUnull = []; 
    var ListYnull = [];
    
    
    if (Detail != null) {
        while (Detail.isValidRow()) {
            var rop = "";
            if (Detail.fieldByName("ropTier") != null) {
                rop = "ROP " + Detail.fieldByName("ropTier");
            }
            var SSR = {
                id : Detail.fieldByName("id"),
                rop : Detail.fieldByName("ropTier"),
                name : Detail.fieldByName("lastName") + "  " +Detail.fieldByName("firstName") ,
                type : Detail.fieldByName("type"),
                remark : Detail.fieldByName("remark"),
                status : Detail.fieldByName("status"),
                service : Detail.fieldByName("service"),
                bookingSeat : Detail.fieldByName("bookingSeat"),
                bookingClass : Detail.fieldByName("bookingClass")
            };

             // List.push(SSR);
             
             /* change to Group by Class sort by seat */
            
             switch(SSR.bookingClass){
           			case 'F': 
           						if(SSR.status=="Confirmed"){
           							ListFconf.push(SSR);
           						}else if(SSR.status=="Not Confirmed"){
           							ListFnot.push(SSR);
           						}else{
           							ListFnull.push(SSR);
           						}
           				break;
           			case 'C': 
           						if(SSR.status=="Confirmed"){
           							ListCconf.push(SSR);
           						}else if(SSR.status=="Not Confirmed"){
           							ListCnot.push(SSR);
           						}else{
           							ListCnull.push(SSR);
           						}
           				break;
           			case 'U': 
           						if(SSR.status=="Confirmed"){
           							ListUconf.push(SSR);
           						}else if(SSR.status=="Not Confirmed"){
           							ListUnot.push(SSR);
           						}else{
           							ListUnull.push(SSR);
           						}
           				break;
           			case 'Y': 
           						if(SSR.status=="Confirmed"){
           							ListYconf.push(SSR);
           						}else if(SSR.status=="Not Confirmed"){
           							ListYnot.push(SSR);
           						}else{
           							ListYnull.push(SSR);
           						}
           				break;          				
           	  }
       
            
            Detail.next();
        }
        
        /* add to ListView */
        ListY1 = ListYnot.concat( ListYnull );
        ListY = ListYconf.concat( ListY1 );
         
        ListU1 = ListUnot.concat( ListUnull );
        ListU = ListUconf.concat( ListU1 );
         
        ListC1 = ListCnot.concat( ListCnull );
        ListC = ListCconf.concat( ListC1 ); 
         
        ListF1 = ListFnot.concat( ListFnull );
        ListF = ListFconf.concat( ListF1 );
         
         
         /* concat: F C U Y */
        List1 = ListU.concat( ListY );
        List2 = ListC.concat( List1 );
        List = ListF.concat( List2 );
        
        
        
        Detail.close();
    }
    
    db.close();
    return List;
};

exports.getPassengerSSRListEditNewQry = function(flightId,offset,limit,searchText) {

	var db = Ti.Database.open(Alloy.Globals.dbName);
	  						
	var sql="SELECT "+  "Passenger.flightId as paxLopa,ROP.ropTier,Passenger.bookingClass, SSR.searchStatus, Passenger.bookingSeat, Passenger.lastName, Passenger.id, Passenger.firstName,Passenger.salutation,SSR.passengerId,SSR.type,SSR.ssrType,SSR.remark,SSR.status,SSR.service,SSR.searchType,Passenger.searchClass, Passenger.searchDest, Passenger.searchInfant, LOPAPosition.searchFloor,LOPAPosition.searchZone,ROP.searchROP, "+
            "Passenger.paxKey,Passenger.accountId, "+
            "ROPEnrollment.paxKey AS hasROPEnroll, "+
			"CASE Passenger.bookingClass "+
			" WHEN 'F' THEN 0  "+
			"WHEN 'C' THEN 1  "+
			"WHEN 'U' THEN 2  "+
			"WHEN 'Y' THEN 3 ELSE 4 END AS classOrder,  "+
			
			"CASE SSR.status  "+
			"WHEN 'Confirmed' THEN 0  "+
			"WHEN 'Not Confirmed' THEN 1 "+ 
			"ELSE 2  "+
			"END AS statusOrder, "+
			
			"CASE WHEN Passenger.bookingSeat IS NOT NULL THEN 0 ELSE  "+
			"CASE WHEN Passenger.bookingSeat IS NULL THEN 1 ELSE NULL END END AS seatOrder  "+
			"FROM SSR  "+
			
			"left join Passenger on Passenger.id=SSR.passengerId  "+
			"left join LOPAPosition on Passenger.bookingSeat=LOPAPosition.position OR Passenger.bookingSeat IS NULL  "+
            "LEFT JOIN ROPEnrollment ON (Passenger.id=ROPEnrollment.passengerId OR Passenger.paxKey=ROPEnrollment.paxKey OR Passenger.accountId=ROPEnrollment.accountId)  "+
			"LEFT JOIN ROP ON Passenger.memberId=ROP.id OR ROP.passengerId IS NULL  " ;					
			
	 if(searchText!=""){
    	sql+=
    	"WHERE Passenger.firstName like '%"+searchText+"%' or"+
    	" Passenger.lastName like '%"+searchText+"%' or"+
    	" Passenger.bookingClass like '%"+searchText+"%' or"+
    	" Passenger.bookingSeat like '%"+searchText+"%' or"+
    	" Passenger.firstName like '%"+searchText+"%' or"+
    	
    	" SSR.searchStatus like '%"+searchText+"%' or"+
    	" SSR.searchType like '%"+searchText+"%' or"+
    	
    	" Passenger.searchClass like '%"+searchText+"%' or"+
    	" Passenger.searchDest like '%"+searchText+"%' or"+
    	" Passenger.searchInfant like '%"+searchText+"%' or"+
    	" Passenger.salutation like '%"+searchText+"%' or"+
    	" LOPAPosition.searchFloor like '%"+searchText+"%' or"+
    	" LOPAPosition.searchZone like '%"+searchText+"%' or"+
    	" ROP.searchROP like '%"+searchText+"%' "; 
    }
    
    sql+="GROUP BY SSR.id ORDER BY classOrder, statusOrder, seatOrder, Passenger.bookingSeat ASC, SSR.type ASC, Passenger.lastName ASC, Passenger.firstName ASC ";
    
    sql="SELECT * FROM ( "+sql+" ) WHERE paxLopa='"+flightId+"' "+ "LIMIT "+limit+" OFFSET "+offset;
        
    var Detail = db.execute(sql); 
    var List=[];
    if (Detail != null) {
        while (Detail.isValidRow()) {
        	
            var rop = "";
            if (Detail.fieldByName("ropTier") != null) {
                rop = Detail.fieldByName("ropTier");
                if(rop == "PLATINUM"){
                	rop = " Platinum";	
                } else if(rop == "GOLD"){
                	rop = " Gold";	
                }else if(rop == "SILVER"){
                	rop = " Silver";	
                }else if(rop == "BASIC"){
                	rop = " Basic";	
                }    
            } else if(Detail.fieldByName("hasROPEnroll") != null && Detail.fieldByName("hasROPEnroll").length > 0){
                rop = " Applied";
            }

             var SSR = {
                id : Detail.fieldByName("id")!=null ? Detail.fieldByName("id"):"",             
                rop : Detail.fieldByName("ropTier")!=null ? Detail.fieldByName("ropTier"):"",
                name : (Detail.fieldByName("lastName")!=null ? Detail.fieldByName("lastName"):"") + "  " + (Detail.fieldByName("firstName")!=null ? Detail.fieldByName("firstName"):"")+ " " + (Detail.fieldByName("salutation") != null ? Detail.fieldByName("salutation") : ""),
                type : Detail.fieldByName("type")!=null ? Detail.fieldByName("type"):"",
                ssrType : Detail.fieldByName("ssrType")!=null ? Detail.fieldByName("ssrType"):"",
                remark : Detail.fieldByName("remark")!=null ? Detail.fieldByName("remark"):"",
                status : Detail.fieldByName("status")!=null ? Detail.fieldByName("status"):"",
                service : Detail.fieldByName("service")!=null ? Detail.fieldByName("service"):"",
                bookingSeat : Detail.fieldByName("bookingSeat")!=null ? Detail.fieldByName("bookingSeat"):"",
                bookingClass : Detail.fieldByName("bookingClass")!=null ? Detail.fieldByName("bookingClass"):"",
                salutation : Detail.fieldByName("salutation")!=null ? Detail.fieldByName("salutation"):""
            };

             List.push(SSR);
             
            Detail.next();
        }
        
        Detail.close();
    }
    db.close();
       
    return List;
    
};


exports.getPassengerSSRSpecailMealListEdit = function(flightId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);

    var Detail = db.execute("SELECT "+
    						"ROP.ropTier,"+
    						
    						"Passenger.bookingClass,"+
    						"Passenger.bookingSeat,"+
    						"Passenger.id,"+
    						"Passenger.firstName,"+
    						"Passenger.lastName,"+
    						
    						"SSR.passengerId,"+
    						"SSR.type,"+
    						"SSR.remark,"+
    						"SSR.status,"+
    						"SSR.service "+
    						
    						"FROM SSR "+
    						"left join Passenger on Passenger.id=SSR.passengerId "+
    						"LEFT JOIN ROP ON Passenger.id=ROP.passengerId "+
    						"WHERE Passenger.flightId= ? and SSR.ssrType='specialMeal'" + //); 
    						 "Order by Passenger.bookingSeat ASC" , flightId);
    var List = [];
    
    /* sort by class: F C U Y */
    var ListF = [];
    var ListC = [];
    var ListU = [];
    var ListY = [];
    
    /* sort by class: F C U Y: Confirm */
    var ListFconf = [];
    var ListCconf = [];
    var ListUconf = []; 
    var ListYconf = [];
    
    /* sort by class: F C U Y: Not Confirm */
    var ListFnot = [];
    var ListCnot = [];
    var ListUnot = []; 
    var ListYnot = [];
    
    
    /* sort by class: F C U Y: null */
    var ListFnull = [];
    var ListCnull = [];
    var ListUnull = []; 
    var ListYnull = [];
    
    
    if (Detail != null) {
        while (Detail.isValidRow()) {
            var rop = "";
            if (Detail.fieldByName("ropTier") != null) {
                rop = "ROP " + Detail.fieldByName("ropTier");
            }
            var SSR = {
                id : Detail.fieldByName("id"),
                rop : Detail.fieldByName("ropTier"),
                name : Detail.fieldByName("firstName") + "  " + Detail.fieldByName("lastName"),
                type : Detail.fieldByName("type"),
                remark : Detail.fieldByName("remark"),
                status : Detail.fieldByName("status"),
                service : Detail.fieldByName("service"),
                bookingSeat : Detail.fieldByName("bookingSeat"),
                bookingClass : Detail.fieldByName("bookingClass")
            };

             // List.push(SSR);
             
             /* change to Group by Class sort by seat */
            
             switch(SSR.bookingClass){
           			case 'F': 
           						if(SSR.status=="Confirmed"){
           							ListFconf.push(SSR);
           						}else if(SSR.status=="Not Confirmed"){
           							ListFnot.push(SSR);
           						}else{
           							ListFnull.push(SSR);
           						}
           				break;
           			case 'C': 
           						if(SSR.status=="Confirmed"){
           							ListCconf.push(SSR);
           						}else if(SSR.status=="Not Confirmed"){
           							ListCnot.push(SSR);
           						}else{
           							ListCnull.push(SSR);
           						}
           				break;
           			case 'U': 
           						if(SSR.status=="Confirmed"){
           							ListUconf.push(SSR);
           						}else if(SSR.status=="Not Confirmed"){
           							ListUnot.push(SSR);
           						}else{
           							ListUnull.push(SSR);
           						}
           				break;
           			case 'Y': 
           						if(SSR.status=="Confirmed"){
           							ListYconf.push(SSR);
           						}else if(SSR.status=="Not Confirmed"){
           							ListYnot.push(SSR);
           						}else{
           							ListYnull.push(SSR);
           						}
           				break;          				
           	}
        	
        	Detail.next();
        }
        
        /* add to ListView */
        ListY1 = ListYnot.concat( ListYnull );
        ListY = ListYconf.concat( ListY1 );
        
        ListU1 = ListUnot.concat( ListUnull );
        ListU = ListUconf.concat( ListU1 );
         
        ListC1 = ListCnot.concat( ListCnull );
        ListC = ListCconf.concat( ListC1 ); 
         
        ListF1 = ListFnot.concat( ListFnull );
        ListF = ListFconf.concat( ListF1 );
         
        /* concat: F C U Y */
        List1 = ListU.concat( ListY );
        List2 = ListC.concat( List1 );
        List = ListF.concat( List2 );
        
        Detail.close();
    }
    
    db.close();
    return List;
};



exports.getPassengerSSRSpecailMealList = function(flightId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);

    var Detail = db.execute("SELECT ROP.ropTier,Passenger.bookingSeat,Passenger.id,Passenger.firstName,Passenger.lastName,SSR.passengerId,SSR.type,SSR.remark,SSR.status,SSR.service FROM SSR left join Passenger on Passenger.id=SSR.passengerId LEFT JOIN ROP ON Passenger.id=ROP.passengerId WHERE Passenger.flightId= ? and SSR.ssrType='specialMeal'", flightId);
    var List = [];
    if (Detail != null) {
        while (Detail.isValidRow()) {
            var rop = "";
            if (Detail.fieldByName("ropTier") != null) {
                rop = "ROP " + Detail.fieldByName("ropTier");
            }
            var SSR = {
                id : Detail.fieldByName("id"),
                rop : Detail.fieldByName("ropTier"),
                name : Detail.fieldByName("firstName") + "  " + Detail.fieldByName("lastName"),
                type : Detail.fieldByName("type"),
                remark : Detail.fieldByName("remark"),
                status : Detail.fieldByName("status"),
                service : Detail.fieldByName("service"),
                bookingSeat : Detail.fieldByName("bookingSeat")
            };

            List.push(SSR);
            Detail.next();
        }
        Detail.close();
    }
    
    db.close();
    return List;
};





exports.getPassengerSSROtherListEdit = function(flightId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);

    var Detail = db.execute("SELECT "+
    						"ROP.ropTier,"+
    						
    						"Passenger.bookingClass,"+
    						"Passenger.bookingSeat,"+
    						"Passenger.id,"+
    						"Passenger.firstName,"+
    						"Passenger.lastName,"+
    						
    						"SSR.passengerId,"+
    						"SSR.type,"+
    						"SSR.remark,"+
    						"SSR.status,"+
    						"SSR.service "+
    						
    						"FROM SSR "+
    						"left join Passenger on Passenger.id=SSR.passengerId "+
    						"LEFT JOIN ROP ON Passenger.id=ROP.passengerId "+
    						"WHERE Passenger.flightId= ? and SSR.ssrType='service'" + //); 
    						 "Order by Passenger.bookingSeat ASC" , flightId);
    var List = [];
    
    /* sort by class: F C U Y */
    var ListF = [];
    var ListC = [];
    var ListU = [];
    var ListY = [];
    
    /* sort by class: F C U Y: Confirm */
    var ListFconf = [];
    var ListCconf = [];
    var ListUconf = []; 
    var ListYconf = [];
    
    /* sort by class: F C U Y: Not Confirm */
    var ListFnot = [];
    var ListCnot = [];
    var ListUnot = []; 
    var ListYnot = [];
    
    
    /* sort by class: F C U Y: null */
    var ListFnull = [];
    var ListCnull = [];
    var ListUnull = []; 
    var ListYnull = [];
    
    
    if (Detail != null) {
        while (Detail.isValidRow()) {
            var rop = "";
            if (Detail.fieldByName("ropTier") != null) {
                rop = "ROP " + Detail.fieldByName("ropTier");
            }
            var SSR = {
                id : Detail.fieldByName("id"),
                rop : Detail.fieldByName("ropTier"),
                name : Detail.fieldByName("firstName") + "  " + Detail.fieldByName("lastName"),
                type : Detail.fieldByName("type"),
                remark : Detail.fieldByName("remark"),
                status : Detail.fieldByName("status"),
                service : Detail.fieldByName("service"),
                bookingSeat : Detail.fieldByName("bookingSeat"),
                bookingClass : Detail.fieldByName("bookingClass")
            };

             // List.push(SSR);
             
             /* change to Group by Class sort by seat */
            
             switch(SSR.bookingClass){
           			case 'F': 
           						if(SSR.status=="Confirmed"){
           							ListFconf.push(SSR);
           						}else if(SSR.status=="Not Confirmed"){
           							ListFnot.push(SSR);
           						}else{
           							ListFnull.push(SSR);
           						}
           				break;
           			case 'C': 
           						if(SSR.status=="Confirmed"){
           							ListCconf.push(SSR);
           						}else if(SSR.status=="Not Confirmed"){
           							ListCnot.push(SSR);
           						}else{
           							ListCnull.push(SSR);
           						}
           				break;
           			case 'U': 
           						if(SSR.status=="Confirmed"){
           							ListUconf.push(SSR);
           						}else if(SSR.status=="Not Confirmed"){
           							ListUnot.push(SSR);
           						}else{
           							ListUnull.push(SSR);
           						}
           				break;
           			case 'Y': 
           						if(SSR.status=="Confirmed"){
           							ListYconf.push(SSR);
           						}else if(SSR.status=="Not Confirmed"){
           							ListYnot.push(SSR);
           						}else{
           							ListYnull.push(SSR);
           						}
           				break;          				
           	  }
       
            
            Detail.next();
        }
        
        /* add to ListView */
         ListY1 = ListYnot.concat( ListYnull );
         ListY = ListYconf.concat( ListY1 );
         
         ListU1 = ListUnot.concat( ListUnull );
         ListU = ListUconf.concat( ListU1 );
         
         ListC1 = ListCnot.concat( ListCnull );
         ListC = ListCconf.concat( ListC1 ); 
         
         ListF1 = ListFnot.concat( ListFnull );
         ListF = ListFconf.concat( ListF1 );
         
         
         /* concat: F C U Y */
        List1 = ListU.concat( ListY );
        List2 = ListC.concat( List1 );
        List = ListF.concat( List2 );
        
        
        
        Detail.close();
    }
    
    db.close();
    return List;
};


/* SSR specail meal */
exports.getPassengerSSRSpecailMealListEditNewQry = function(flightId,offset,limit,searchText) {
   
   var specialMeal = 'specialMeal';
   var db = Ti.Database.open(Alloy.Globals.dbName);
	    						
	var sql="SELECT "+  "Passenger.flightId as paxLopa,ROP.ropTier,Passenger.bookingClass, Passenger.salutation, SSR.searchStatus, Passenger.bookingSeat, Passenger.lastName, Passenger.id, Passenger.firstName,SSR.passengerId,SSR.type,SSR.ssrType,SSR.remark,SSR.status,SSR.service,SSR.searchType,Passenger.searchClass, Passenger.searchDest, Passenger.searchInfant, LOPAPosition.searchFloor,LOPAPosition.searchZone,ROP.searchROP, "+
                "Passenger.paxKey,Passenger.accountId, "+
                "ROPEnrollment.paxKey AS hasROPEnroll, "+
				"CASE Passenger.bookingClass "+
				" WHEN 'F' THEN 0  "+
				"WHEN 'C' THEN 1  "+
				"WHEN 'U' THEN 2  "+
				"WHEN 'Y' THEN 3 ELSE 4 END AS classOrder,  "+
				
				"CASE SSR.status  "+
				"WHEN 'Confirmed' THEN 0  "+
				"WHEN 'Not Confirmed' THEN 1 "+ 
				"ELSE 2  "+
				"END AS statusOrder, "+
				
				"CASE WHEN Passenger.bookingSeat IS NOT NULL THEN 0 ELSE  "+
				"CASE WHEN Passenger.bookingSeat IS NULL THEN 1 ELSE NULL END END AS seatOrder  "+
				"FROM SSR  "+
				
				"left join Passenger on Passenger.id=SSR.passengerId  "+
				"left join LOPAPosition on Passenger.bookingSeat=LOPAPosition.position OR Passenger.bookingSeat IS NULL  "+
                "LEFT JOIN ROPEnrollment ON (Passenger.id=ROPEnrollment.passengerId OR Passenger.paxKey=ROPEnrollment.paxKey OR Passenger.accountId=ROPEnrollment.accountId)  "+
				"LEFT JOIN ROP ON Passenger.memberId=ROP.id OR ROP.passengerId IS NULL  " ;	
			 
	 if(searchText!=""){
    	sql+=
    	"WHERE Passenger.firstName like '%"+searchText+"%' or"+
    	" Passenger.lastName like '%"+searchText+"%' or"+
    	" Passenger.bookingClass like '%"+searchText+"%' or"+
    	" Passenger.bookingSeat like '%"+searchText+"%' or"+
    	" Passenger.firstName like '%"+searchText+"%' or"+
    	
    	" SSR.searchStatus like '%"+searchText+"%' or"+
    	" SSR.searchType like '%"+searchText+"%' or"+
    	
    	" Passenger.searchInfant like '%"+searchText+"%' or"+
    	" Passenger.searchClass like '%"+searchText+"%' or"+
    	" Passenger.searchDest like '%"+searchText+"%' or"+
    	" Passenger.salutation like '%"+searchText+"%' or"+
    	" LOPAPosition.searchFloor like '%"+searchText+"%' or"+
    	" LOPAPosition.searchZone like '%"+searchText+"%' or"+
    	" ROP.searchROP like '%"+searchText+"%' "; 
    }
    
    sql+="GROUP BY SSR.id ORDER BY classOrder, statusOrder, seatOrder, Passenger.bookingSeat ASC, SSR.type ASC, Passenger.lastName ASC, Passenger.firstName ASC ";
    
    sql="SELECT * FROM ( "+sql+" ) WHERE paxLopa='"+flightId+"' and ssrType='"+specialMeal+"' "+
    "LIMIT "+limit+" OFFSET "+offset;
        
    var Detail = db.execute(sql); 
    var List=[];
    if (Detail != null) {
        while (Detail.isValidRow()) {
        	
            var rop = "";
            if (Detail.fieldByName("ropTier") != null) {
                rop = Detail.fieldByName("ropTier");
                if(rop == "PLATINUM"){
                	rop = " Platinum";	
                } else if(rop == "GOLD"){
                	rop = " Gold";	
                }else if(rop == "SILVER"){
                	rop = " Silver";	
                }else if(rop == "BASIC"){
                	rop = " Basic";	
                }    
            } else if(Detail.fieldByName("hasROPEnroll") != null && Detail.fieldByName("hasROPEnroll").length > 0){
                rop = " Applied";
            }
            
             var SSR = {
                id : Detail.fieldByName("id")!=null ? Detail.fieldByName("id"):"",             
                rop : Detail.fieldByName("ropTier")!=null ? Detail.fieldByName("ropTier"):"",
                name : (Detail.fieldByName("lastName")!=null ? Detail.fieldByName("lastName"):"") + "  " + (Detail.fieldByName("firstName")!=null ? Detail.fieldByName("firstName"):"")+ " " + (Detail.fieldByName("salutation") != null ? Detail.fieldByName("salutation") : ""),
                type : Detail.fieldByName("type")!=null ? Detail.fieldByName("type"):"",
                ssrType : Detail.fieldByName("ssrType")!=null ? Detail.fieldByName("ssrType"):"",
                remark : Detail.fieldByName("remark")!=null ? Detail.fieldByName("remark"):"",
                status : Detail.fieldByName("status")!=null ? Detail.fieldByName("status"):"",
                service : Detail.fieldByName("service")!=null ? Detail.fieldByName("service"):"",
                bookingSeat : Detail.fieldByName("bookingSeat")!=null ? Detail.fieldByName("bookingSeat"):"",
                bookingClass : Detail.fieldByName("bookingClass")!=null ? Detail.fieldByName("bookingClass"):"",
                salutation : Detail.fieldByName("salutation")!=null ? Detail.fieldByName("salutation"):""
            };

            List.push(SSR);

            Detail.next();
        }
        
        Detail.close();
    }
	db.close();
       
    return List;
    
};



exports.getPassengerSSROtherList = function(flightId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);

    var Detail = db.execute("SELECT ROP.ropTier,Passenger.bookingSeat,Passenger.id,Passenger.firstName,Passenger.lastName,SSR.passengerId,SSR.type,SSR.remark,SSR.status,SSR.service FROM SSR left join Passenger on Passenger.id=SSR.passengerId LEFT JOIN ROP ON Passenger.id=ROP.passengerId WHERE Passenger.flightId= ? and SSR.ssrType='service'", flightId);
    var List = [];
    if (Detail != null) {
        while (Detail.isValidRow()) {
            var rop = "";
            if (Detail.fieldByName("ropTier") != null) {
                rop = "ROP " + Detail.fieldByName("ropTier");
            }
            var SSR = {
                id : Detail.fieldByName("id"),
                rop : Detail.fieldByName("ropTier"),
                name : Detail.fieldByName("firstName") + "  " + Detail.fieldByName("lastName"),
                type : Detail.fieldByName("type"),
                remark : Detail.fieldByName("remark"),
                status : Detail.fieldByName("status"),
                service : Detail.fieldByName("service"),
                bookingSeat : Detail.fieldByName("bookingSeat")
            };

            List.push(SSR);
            Detail.next();
        }
        Detail.close();
    }
    
    db.close();
    return List;
};

exports.getPassengerListByAll = function(flightId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT LOPAPosition.floor,LOPAPosition.zone,Passenger.id,Passenger.lastName,Passenger.firstName,Passenger.bookingSeat,Passenger.bookingClass,ROP.ropTier FROM Passenger LEFT JOIN ROP ON Passenger.id=ROP.passengerId left join LOPAPosition on LOPAPosition.position=Passenger.bookingSeat WHERE flightId=? ", flightId + "");
    var List = [];
    if (Detail != null) {
        while (Detail.isValidRow()) {
            var rop = "";
            if (Detail.fieldByName("ropTier") != null) {
                rop = "ROP " + Detail.fieldByName("ropTier");
            }

            var passenger = {
                id : Detail.fieldByName("id") != null ? Detail.fieldByName("id") : "",
                rop : rop,
                name : (Detail.fieldByName("lastName") != null ? Detail.fieldByName("lastName") : "") + " " + (Detail.fieldByName("firstName") != null ? Detail.fieldByName("firstName") : ""),
                bookingSeat : Detail.fieldByName("bookingSeat") != null ? Detail.fieldByName("bookingSeat") : "",
                bookingClass : Detail.fieldByName("bookingClass") != null ? Detail.fieldByName("bookingClass") : "",
                floor : Detail.fieldByName("floor") != null ? Detail.fieldByName("floor") : "",
                zone : Detail.fieldByName("zone") != null ? Detail.fieldByName("zone") : ""
            };
            List.push(passenger);
            Detail.next();
        }
        Detail.close();
    }
    
    db.close();
    return List;
};

/* SSR other */
exports.getPassengerSSROtherListEditNewQry = function(flightId,offset,limit,searchText) {
   
   var service = 'service';
   var db = Ti.Database.open(Alloy.Globals.dbName);
	    						
	var sql="SELECT "+  "Passenger.flightId as paxLopa,ROP.ropTier,Passenger.bookingClass, Passenger.salutation,SSR.searchStatus, Passenger.bookingSeat, Passenger.lastName, Passenger.id, Passenger.firstName,SSR.passengerId,SSR.type,SSR.ssrType,SSR.remark,SSR.status,SSR.service,SSR.searchType,Passenger.searchClass, Passenger.searchDest, Passenger.searchInfant, LOPAPosition.searchFloor,LOPAPosition.searchZone,ROP.searchROP, "+
            "Passenger.paxKey,Passenger.accountId, "+
            "ROPEnrollment.paxKey AS hasROPEnroll, "+

				"CASE Passenger.bookingClass "+
				" WHEN 'F' THEN 0  "+
				"WHEN 'C' THEN 1  "+
				"WHEN 'U' THEN 2  "+
				"WHEN 'Y' THEN 3 ELSE 4 END AS classOrder,  "+
				
				"CASE SSR.status  "+
				"WHEN 'Confirmed' THEN 0  "+
				"WHEN 'Not Confirmed' THEN 1 "+ 
				"ELSE 2  "+
				"END AS statusOrder, "+
				
				"CASE WHEN Passenger.bookingSeat IS NOT NULL THEN 0 ELSE  "+
				"CASE WHEN Passenger.bookingSeat IS NULL THEN 1 ELSE NULL END END AS seatOrder  "+
				"FROM SSR  "+
				
				"left join Passenger on Passenger.id=SSR.passengerId  "+
				"left join LOPAPosition on Passenger.bookingSeat=LOPAPosition.position OR Passenger.bookingSeat IS NULL  "+
                "LEFT JOIN ROPEnrollment ON (Passenger.id=ROPEnrollment.passengerId OR Passenger.paxKey=ROPEnrollment.paxKey OR Passenger.accountId=ROPEnrollment.accountId)  "+
				"LEFT JOIN ROP ON Passenger.memberId=ROP.id OR ROP.passengerId IS NULL  " ;	
			 
	 if(searchText!=""){
    	sql+=
    	"WHERE Passenger.firstName like '%"+searchText+"%' or"+
    	" Passenger.lastName like '%"+searchText+"%' or"+
    	" Passenger.bookingClass like '%"+searchText+"%' or"+
    	" Passenger.bookingSeat like '%"+searchText+"%' or"+
    	" Passenger.firstName like '%"+searchText+"%' or"+
    	
    	" SSR.searchStatus like '%"+searchText+"%' or"+
    	" SSR.searchType like '%"+searchText+"%' or"+
    	
    	" Passenger.searchClass like '%"+searchText+"%' or"+
    	" Passenger.searchDest like '%"+searchText+"%' or"+
    	" Passenger.searchInfant like '%"+searchText+"%' or"+
    	" Passenger.salutation like '%"+searchText+"%' or"+
    	" LOPAPosition.searchFloor like '%"+searchText+"%' or"+
    	" LOPAPosition.searchZone like '%"+searchText+"%' or"+
    	" ROP.searchROP like '%"+searchText+"%' ";  
    }
    
    sql+="GROUP BY SSR.id ORDER BY classOrder, statusOrder, seatOrder, Passenger.bookingSeat ASC, SSR.type ASC, Passenger.lastName ASC, Passenger.firstName ASC ";
    
     
    sql="SELECT * FROM ( "+sql+" ) WHERE paxLopa='"+flightId+"' and ssrType='"+service+"' "+
    "LIMIT "+limit+" OFFSET "+offset;
        
    var Detail = db.execute(sql); 
    var List=[];
    if (Detail != null) {
        while (Detail.isValidRow()) {
        	
            var rop = "";
            if (Detail.fieldByName("ropTier") != null) {               
                rop = Detail.fieldByName("ropTier");
                if(rop == "PLATINUM"){
                	rop = " Platinum";	
                } else if(rop == "GOLD"){
                	rop = " Gold";	
                }else if(rop == "SILVER"){
                	rop = " Silver";	
                }else if(rop == "BASIC"){
                	rop = " Basic";	
                }    
            } else if(Detail.fieldByName("hasROPEnroll") != null && Detail.fieldByName("hasROPEnroll").length > 0){
                rop = " Applied";
            }
			var SSR = {
                id : Detail.fieldByName("id")!=null ? Detail.fieldByName("id"):"",             
                rop : Detail.fieldByName("ropTier")!=null ? Detail.fieldByName("ropTier"):"",
                name : (Detail.fieldByName("lastName")!=null ? Detail.fieldByName("lastName"):"") + "  " + (Detail.fieldByName("firstName")!=null ? Detail.fieldByName("firstName"):"")+ " " + (Detail.fieldByName("salutation") != null ? Detail.fieldByName("salutation") : ""),
                type : Detail.fieldByName("type")!=null ? Detail.fieldByName("type"):"",
                ssrType : Detail.fieldByName("ssrType")!=null ? Detail.fieldByName("ssrType"):"",
                remark : Detail.fieldByName("remark")!=null ? Detail.fieldByName("remark"):"",
                status : Detail.fieldByName("status")!=null ? Detail.fieldByName("status"):"",
                service : Detail.fieldByName("service")!=null ? Detail.fieldByName("service"):"",
                bookingSeat : Detail.fieldByName("bookingSeat")!=null ? Detail.fieldByName("bookingSeat"):"",
                bookingClass : Detail.fieldByName("bookingClass")!=null ? Detail.fieldByName("bookingClass"):"",
                salutation : Detail.fieldByName("salutation")!=null ? Detail.fieldByName("salutation"):""
            };
            List.push(SSR);

            Detail.next();
        }
    }
    db.close();
       
    return List;
    
};

exports.getPassengerListBySortSeat = function(flightId,offset,limit,searchText) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    								    								 
    var Detail = db.execute("SELECT LOPAPosition.floor,LOPAPosition.zone,Passenger.id,Passenger.paxKey,Passenger.accountId,Passenger.lastName,Passenger.firstName,Passenger.bookingSeat,Passenger.bookingClass,"+
					"ROP.ropTier "+
                    "ROPEnrollment.paxKey AS hasROPEnroll "+
					"FROM Passenger "+
					 "LEFT JOIN ROP ON Passenger.id=ROP.passengerId  "+
                     "LEFT JOIN ROPEnrollment ON (Passenger.id=ROPEnrollment.passengerId OR Passenger.paxKey=ROPEnrollment.paxKey OR Passenger.accountId=ROPEnrollment.accountId)  "+
					 "LEFT JOIN LOPAPosition ON LOPAPosition.position=Passenger.bookingSeat or Passenger.bookingSeat IS NULL "+
					 "WHERE Passenger.flightId=? and LOPAPosition.flightId=? "+
					 "Order By Passenger.bookingSeat ASC,Passenger.LastName", 
					 flightId, flightId
			     );

    var List = [];
    var ListDupOrNot2 = [];
    
    var ListF = [];
    var ListFwithSeat = [];
    var ListFnoSeat = [];
    
    var ListC = [];
    var ListCwithSeat = [];
    var ListCnoSeat = [];
    
    var ListU = [];
    var ListUwithSeat = [];
    var ListUnoSeat = [];
    
    var ListY = [];
    var ListYwithSeat = [];
    var ListYnoSeat = [];
    
    var ListNull = [];
    if (Detail != null) {
        while (Detail.isValidRow()) {
            var rop = "";
            if (Detail.fieldByName("ropTier") != null) {
                rop = "ROP " + Detail.fieldByName("ropTier");
            } else if(Detail.fieldByName("hasROPEnroll") != null && Detail.fieldByName("hasROPEnroll").length > 0){
                rop = "ROP Applied";
            }

            var passenger = {
                id : Detail.fieldByName("id") != null ? Detail.fieldByName("id") : "",
                rop : rop,
                name : (Detail.fieldByName("lastName") != null ? Detail.fieldByName("lastName") : "") + " " + (Detail.fieldByName("firstName") != null ? Detail.fieldByName("firstName") : ""),
                bookingSeat : Detail.fieldByName("bookingSeat") != null ? Detail.fieldByName("bookingSeat") : "",
                bookingClass : Detail.fieldByName("bookingClass") != null ? Detail.fieldByName("bookingClass") : "",
                floor : Detail.fieldByName("floor") != null ? Detail.fieldByName("floor") : "",
                zone : Detail.fieldByName("zone") != null ? Detail.fieldByName("zone") : "",
            };
            // List.push(passenger);
            
            /* try to check duplicate */
           if (ListDupOrNot2.indexOf(passenger.name)>= 0){
           }else if(List.indexOf(passenger.name) <0){
           		// List.push(passenger);
           		ListDupOrNot2.push(passenger.name);
           		
           		switch(passenger.bookingClass){
           			case 'F': 
           					if(passenger.bookingSeat==""){
		           				ListFnoSeat.push(passenger);
		           			}else{
		           				ListFwithSeat.push(passenger);
		           			}
           				break;
           			case 'C': 
		           			if(passenger.bookingSeat==""){
		           				ListCnoSeat.push(passenger);
		           			}else{
		           				ListCwithSeat.push(passenger);
		           			}
           				break;
           			case 'U': 
		           			if(passenger.bookingSeat==""){
		           				ListUnoSeat.push(passenger);
		           			}else{
		           				ListUwithSeat.push(passenger);
		           			}
           				break;
           			case 'Y': 
		           			if(passenger.bookingSeat==""){
		           				ListYnoSeat.push(passenger);
		           			}else{
		           				ListYwithSeat.push(passenger);
		           			}
           					
           				break;   
           			default: ListNull.push(passenger);
           				break;        				
           			
           		}
           }
           
           Detail.next();
        }
        Detail.close();
    }
    
    /* try to check List.length */
   
   /* try to concat seat with noSeat */
  	ListF = ListFwithSeat.concat( ListFnoSeat );
  	ListC = ListCwithSeat.concat( ListCnoSeat );
  	ListU = ListUwithSeat.concat( ListUnoSeat );
  	ListY = ListYwithSeat.concat( ListYnoSeat );
  
    /* try to concat arrayList */
   	ListYNull = ListY.concat( ListNull );
   	ListUYNull = ListU.concat( ListYNull );
   	ListCUYNull = ListC.concat( ListUYNull );
   	List = ListF.concat( ListCUYNull ); 
	
    
    db.close();
    return List;
};


exports.getPassengerListByName = function(flightId,offset,limit,searchText) {
 var db = Ti.Database.open(Alloy.Globals.dbName);
 
 var sql="SELECT LOPAPosition.flightId as fltLopa,"+
     "Passenger.flightId as paxLopa,"+"Passenger.salutation as salutation,"+
     "LOPAPosition.floor,LOPAPosition.zone,Passenger.id,Passenger.paxKey,Passenger.accountId,"+
     "Passenger.offPoint,Passenger.lastName,Passenger.firstName,Passenger.bookingSeat,Passenger.bookingClass,"+
     "Passenger.searchClass, Passenger.searchDest, Passenger.searchInfant, Passenger.searchStaff, Passenger.isStaff, "+
     "LOPAPosition.searchFloor,LOPAPosition.searchZone,"+
     "ROP.searchROP,"+
     "ROPEnrollment.paxKey AS hasROPEnroll, "+
   "CASE Passenger.bookingClass "+
         "WHEN 'F' THEN 0 "+
      "WHEN 'C' THEN 1 "+
      "WHEN 'U' THEN 2 "+
      "WHEN 'Y' THEN 3 "+
      "ELSE 4 "+
     "END AS classOrder, "+
      "ROP.ropTier "+
      "FROM Passenger "+
    "LEFT JOIN ROP ON Passenger.memberId=ROP.id  "+

    "LEFT JOIN ROPEnrollment ON (Passenger.id=ROPEnrollment.passengerId OR Passenger.paxKey=ROPEnrollment.paxKey OR Passenger.accountId=ROPEnrollment.accountId)  "+

    "left join LOPAPosition on LOPAPosition.position=Passenger.bookingSeat ";
  if(searchText!=""){
     sql+="WHERE Passenger.firstName like '%"+searchText+"%' or"+
     " Passenger.lastName like '%"+searchText+"%' or"+
     " Passenger.bookingClass like '%"+searchText+"%' or"+
     " Passenger.bookingSeat like '%"+searchText+"%' or"+
     " LOPAPosition.floor like '%"+searchText+"%' or"+
     " LOPAPosition.zone like '%"+searchText+"%' or"+
     " Passenger.firstName like '%"+searchText+"%' or"+
     
     " Passenger.searchClass like '%"+searchText+"%' or"+
     " Passenger.searchDest like '%"+searchText+"%' or"+
     " Passenger.searchInfant like '%"+searchText+"%' or"+
     " Passenger.searchStaff like '%"+searchText+"%' or"+
     " Passenger.salutation like '%"+searchText+"%' or"+
     " LOPAPosition.searchFloor like '%"+searchText+"%' or"+
     " LOPAPosition.searchZone like '%"+searchText+"%' or"+
     " ROP.searchROP like '%"+searchText+"%' ";  
    }
    // sql+="WHERE paxLopa='"+flightId+"' ";// and (fltLopa='"+flightId+"' or fltLopa is null) ";
    sql+="GROUP BY Passenger.id ORDER BY classOrder, Passenger.LastName ASC, Passenger.firstName ASC ";
      //"LIMIT "+limit+" OFFSET "+offset;
 
    // sql="SELECT * FROM ( "+sql+" ) WHERE paxLopa='"+flightId+"' or fltLopa='"+flightId+"' or fltLopa=null";
    sql="SELECT * FROM ( "+sql+" ) WHERE paxLopa='"+flightId+"' "+// and (fltLopa='"+flightId+"' or fltLopa is null)"+
    "LIMIT "+limit+" OFFSET "+offset;
            
    var Detail = db.execute(sql); 
    var List=[];
    if (Detail != null) {
        while (Detail.isValidRow()) {

            var rop = "";
            if (Detail.fieldByName("ropTier") != null) {
                // rop = " " + Detail.fieldByName("ropTier");
               
                rop = Detail.fieldByName("ropTier");
                if(rop == "PLATINUM"){
                 rop = " Platinum"; 
                } else if(rop == "GOLD"){
                 rop = " Gold"; 
                }else if(rop == "SILVER"){
                 rop = " Silver"; 
                }else if(rop == "BASIC"){
                 rop = " Basic"; 
                }    
            } else if(Detail.fieldByName("hasROPEnroll") != null && Detail.fieldByName("hasROPEnroll").length > 0){
                rop = " Applied";
            }     

            var passenger = {
                id : Detail.fieldByName("id") != null ? Detail.fieldByName("id") : "",
                paxKey : Detail.fieldByName("paxKey") != null ? Detail.fieldByName("paxKey") : "",
                accountId : Detail.fieldByName("accountId") != null ? Detail.fieldByName("accountId") : "",
                rop : rop,
                name : (Detail.fieldByName("lastName") != null ? Detail.fieldByName("lastName") : "") + " " + (Detail.fieldByName("firstName") != null ? Detail.fieldByName("firstName") : "")+ " " + (Detail.fieldByName("salutation") != null ? Detail.fieldByName("salutation") : ""),
                bookingSeat : Detail.fieldByName("bookingSeat") != null ? Detail.fieldByName("bookingSeat") : "",
                bookingClass : Detail.fieldByName("bookingClass") != null ? Detail.fieldByName("bookingClass") : "",
                floor : Detail.fieldByName("floor") != null ? Detail.fieldByName("floor") : "",
                offPoint : Detail.fieldByName("offPoint") != null ? Detail.fieldByName("offPoint") : "",
                isStaff : Detail.fieldByName("isStaff") != null ? Detail.fieldByName("isStaff") : "",
                zone : Detail.fieldByName("zone") != null ? Detail.fieldByName("zone") : "",
                salutation : Detail.fieldByName("salutation") != null ? Detail.fieldByName("salutation") : ""
            };
            List.push(passenger);
            Detail.next();
        }
        
        Detail.close();
    }
    db.close();
    return List;
};


exports.getPassengerListBySeat = function(flightId,offset,limit,searchText) {
   
	var db = Ti.Database.open(Alloy.Globals.dbName);
	
	var sql="SELECT LOPAPosition.flightId as fltLopa,"+
								"Passenger.flightId as paxLopa,"+
								"LOPAPosition.floor,LOPAPosition.zone,Passenger.id,"+
								"Passenger.lastName,Passenger.firstName,"+
								"Passenger.bookingSeat,Passenger.bookingClass,"+
								"Passenger.infantName,Passenger.infantAge,"+
								"Passenger.offPoint,Passenger.hasInfant,"+
								
								"CASE Passenger.bookingClass "+
						    		  "WHEN 'F' THEN 0 "+
									  "WHEN 'C' THEN 1 "+
									  "WHEN 'U' THEN 2 "+
									  "WHEN 'Y' THEN 3 "+
									  "ELSE 4 "+
									 "END AS classOrder, "+
									 
    		"ROP.ropTier "+
    		"FROM Passenger "+
			 "LEFT JOIN ROP ON Passenger.id=ROP.passengerId  "+
			 "left join LOPAPosition on LOPAPosition.position = Passenger.bookingSeat ";
			 // "left join LOPAPosition on LOPAPosition.position=Passenger.bookingSeat or Passenger.bookingSeat is null ";
			 
	if(searchText!=""){
    	sql+="WHERE Passenger.firstName like '%"+searchText+"%' or"+
    	" Passenger.lastName like '%"+searchText+"%' or"+
    	" Passenger.bookingClass like '%"+searchText+"%' or"+
    	" Passenger.bookingSeat like '%"+searchText+"%' or"+
    	" LOPAPosition.floor like '%"+searchText+"%' or"+
    	" LOPAPosition.zone like '%"+searchText+"%' or"+
    	" Passenger.firstName like '%"+searchText+"%' ";
    }
    
     sql+="ORDER BY classOrder, Passenger.bookingSeat ASC "+ "LIMIT "+limit+" OFFSET "+offset;
     
 
    sql="SELECT * FROM ( "+sql+" ) WHERE paxLopa='"+flightId+"' and (fltLopa='"+flightId+"' or fltLopa is null)";
            
    var List = [];
    var ListDupOrNot2 = [];
    
    var ListF = [];
    var ListFwithSeat = [];
    var ListFnoSeat = [];
    
    var ListC = [];
    var ListCwithSeat = [];
    var ListCnoSeat = [];
    
    var ListU = [];
    var ListUwithSeat = [];
    var ListUnoSeat = [];
    
    var ListY = [];
    var ListYwithSeat = [];
    var ListYnoSeat = [];
    
    var ListNull = [];
    
    var Detail = db.execute(sql); 
    var List=[];
    if (Detail != null) {
        while (Detail.isValidRow()) {

            var rop = "";
            if (Detail.fieldByName("ropTier") != null) {
                rop = " " + Detail.fieldByName("ropTier");
            }

            var passenger = {
                id : Detail.fieldByName("id") != null ? Detail.fieldByName("id") : "",
                rop : rop,
                name : (Detail.fieldByName("lastName") != null ? Detail.fieldByName("lastName") : "") + "   " + (Detail.fieldByName("firstName") != null ? Detail.fieldByName("firstName") : ""),
                bookingSeat : Detail.fieldByName("bookingSeat") != null ? Detail.fieldByName("bookingSeat") : "",
                bookingClass : Detail.fieldByName("bookingClass") != null ? Detail.fieldByName("bookingClass") : "",
                floor : Detail.fieldByName("floor") != null ? Detail.fieldByName("floor") : "",
                zone : Detail.fieldByName("zone") != null ? Detail.fieldByName("zone") : "",
                
                infantName : Detail.fieldByName("infantName") != null ? Detail.fieldByName("infantName") : "",
                infantAge : Detail.fieldByName("infantAge") != null ? Detail.fieldByName("infantAge") : "",
                offPoint : Detail.fieldByName("offPoint") != null ? Detail.fieldByName("offPoint") : "",
                hasInfant : Detail.fieldByName("hasInfant") != null ? Detail.fieldByName("hasInfant") : ""
            };
            
            
            /* try to order Seat Start */
           	/* try to check duplicate */

           		switch(passenger.bookingClass){
           			case 'F': 
           					if(passenger.bookingSeat==""){
		           				ListFnoSeat.push(passenger);
		           			}else{
		           				ListFwithSeat.push(passenger);
		           			}
           				break;
           			case 'C': 
		           			if(passenger.bookingSeat==""){
		           				ListCnoSeat.push(passenger);
		           			}else{
		           				ListCwithSeat.push(passenger);
		           			}
           				break;
           			case 'U': 
		           			if(passenger.bookingSeat==""){
		           				ListUnoSeat.push(passenger);
		           			}else{
		           				ListUwithSeat.push(passenger);
		           			}
           				break;
           			case 'Y': 
		           			if(passenger.bookingSeat==""){
		           				ListYnoSeat.push(passenger);
		           			}else{
		           				ListYwithSeat.push(passenger);
		           			}
           					
           				break;   
           			default: ListNull.push(passenger);
           				break;        				
           			
           		}

           	/* try to order Seat End */
            
            Detail.next();
        }
        Detail.close();
	}
          
       /* try to concat */
         /* try to concat seat with noSeat */
  	ListF = ListFwithSeat.concat( ListFnoSeat );
  	ListC = ListCwithSeat.concat( ListCnoSeat );
  	ListU = ListUwithSeat.concat( ListUnoSeat );
  	ListY = ListYwithSeat.concat( ListYnoSeat );
  
    /* try to concat arrayList */
   
   	List1 = ListY.concat( ListNull );
   	List2 = ListU.concat( List1 );
   	List3 = ListC.concat( List2 );
   	List = ListF.concat( List3 ); 
   
      /* try to concat */
       
       
    db.close();
    return List;
    
};

/* try to Query new Passenger List */
exports.getPassengerListBySeatNewQry = function(flightId,offset,limit,searchText) {
   
 var db = Ti.Database.open(Alloy.Globals.dbName);
 
 var sql="SELECT LOPAPosition.flightId as fltLopa,"+
        "Passenger.flightId as paxLopa,"+
        "LOPAPosition.floor,LOPAPosition.zone,Passenger.id,"+
        "Passenger.lastName,Passenger.firstName,"+"Passenger.salutation as salutation," +
        "Passenger.bookingSeat,Passenger.bookingClass,"+
        "Passenger.infantName,Passenger.infantAge,Passenger.paxKey, Passenger.accountId,"+
        "Passenger.offPoint,Passenger.hasInfant, Passenger.searchInfant, Passenger.isStaff, ROP.ropTier, "+
        
        "Passenger.searchClass, Passenger.searchDest, Passenger.searchStaff, "+
        "LOPAPosition.searchFloor,LOPAPosition.searchZone,"+
        "ROP.searchROP,"+

        "ROPEnrollment.paxKey AS hasROPEnroll, "+
                  
        "CASE WHEN Passenger.bookingClass = 'F' AND Passenger.bookingSeat IS NOT NULL  THEN 0 ELSE "+ "CASE WHEN Passenger.bookingClass = 'F' AND Passenger.bookingSeat IS NULL  THEN 1 ELSE "+ "CASE WHEN Passenger.bookingClass = 'C' AND Passenger.bookingSeat IS NOT NULL  THEN 2 ELSE "+     
        "CASE WHEN Passenger.bookingClass = 'C' AND Passenger.bookingSeat IS NULL  THEN 3 ELSE "+
         "CASE WHEN Passenger.bookingClass = 'U' AND Passenger.bookingSeat IS NOT NULL  THEN 4 ELSE "+
         "CASE WHEN Passenger.bookingClass = 'U' AND Passenger.bookingSeat IS NULL  THEN 5 ELSE "+
          "CASE WHEN Passenger.bookingClass = 'Y' AND Passenger.bookingSeat IS NOT NULL  THEN 6 ELSE "+
          "CASE WHEN Passenger.bookingClass = 'Y' AND Passenger.bookingSeat IS NULL  THEN 7 "+
          "ELSE NULL "+
        "END END END END END END END END AS classOrder " +
          
      // "ROP.ropTier "+
      "FROM Passenger "+
    "LEFT JOIN ROP ON Passenger.memberId=ROP.id  "+
    
    "LEFT JOIN ROPEnrollment ON (Passenger.id=ROPEnrollment.passengerId OR Passenger.paxKey=ROPEnrollment.paxKey OR Passenger.accountId=ROPEnrollment.accountId)  "+

    "left join LOPAPosition on LOPAPosition.position = Passenger.bookingSeat ";
    
  if(searchText!=""){
     sql+="WHERE Passenger.firstName like '%"+searchText+"%' or"+
     " Passenger.lastName like '%"+searchText+"%' or"+
     " Passenger.bookingClass like '%"+searchText+"%' or"+
     " Passenger.bookingSeat like '%"+searchText+"%' or"+
     " LOPAPosition.floor like '%"+searchText+"%' or"+
     " LOPAPosition.zone like '%"+searchText+"%' or"+
     " Passenger.firstName like '%"+searchText+"%' or"+
     " Passenger.searchClass like '%"+searchText+"%' or"+
     " Passenger.searchDest like '%"+searchText+"%' or"+
     " Passenger.searchInfant like '%"+searchText+"%' or"+
     " Passenger.salutation like '%"+searchText+"%' or"+
     " LOPAPosition.searchZone like '%"+searchText+"%' or"+
     " LOPAPosition.searchFloor like '%"+searchText+"%' or"+
     " ROP.searchROP like '%"+searchText+"%' ";    
    }
    
     sql+="GROUP BY Passenger.id ORDER BY classOrder, Passenger.bookingSeat ASC, Passenger.lastName ASC, Passenger.firstName ASC ";
     sql="SELECT * FROM ( "+sql+" ) WHERE paxLopa='"+flightId+"' " + // and (fltLopa='"+flightId+"' or fltLopa is null)"+ 
    		"LIMIT "+limit+" OFFSET "+offset;
            
    var Detail = db.execute(sql); 
    var List=[];
    if (Detail != null) {
        while (Detail.isValidRow()) {

            var rop = "";
            if (Detail.fieldByName("ropTier") != null) {
                rop = Detail.fieldByName("ropTier");
                if(rop == "PLATINUM"){
                 rop = " Platinum"; 
                } else if(rop == "GOLD"){
                 rop = " Gold"; 
                }else if(rop == "SILVER"){
                 rop = " Silver"; 
                }else if(rop == "BASIC"){
                 rop = " Basic"; 
                }    
            } else if(Detail.fieldByName("hasROPEnroll") != null && Detail.fieldByName("hasROPEnroll").length > 0){
                rop = " Applied";
            }

            var passenger = {
                id : Detail.fieldByName("id") != null ? Detail.fieldByName("id") : "",
                paxKey : Detail.fieldByName("paxKey") != null ? Detail.fieldByName("paxKey") : "",
                accountId : Detail.fieldByName("accountId") != null ? Detail.fieldByName("accountId") : "",
                rop : rop,
                name : (Detail.fieldByName("lastName") != null ? Detail.fieldByName("lastName") : "") + "   " + (Detail.fieldByName("firstName") != null ? Detail.fieldByName("firstName") : "") + " " + (Detail.fieldByName("salutation") != null ? Detail.fieldByName("salutation") : ""),
                bookingSeat : Detail.fieldByName("bookingSeat") != null ? Detail.fieldByName("bookingSeat") : "",
                bookingClass : Detail.fieldByName("bookingClass") != null ? Detail.fieldByName("bookingClass") : "",
                floor : Detail.fieldByName("floor") != null ? Detail.fieldByName("floor") : "",
                zone : Detail.fieldByName("zone") != null ? Detail.fieldByName("zone") : "",
                
                infantName : Detail.fieldByName("infantName") != null ? Detail.fieldByName("infantName") : "",
                infantAge : Detail.fieldByName("infantAge") != null ? Detail.fieldByName("infantAge") : "",
                offPoint : Detail.fieldByName("offPoint") != null ? Detail.fieldByName("offPoint") : "",
                isStaff : Detail.fieldByName("isStaff") != null ? Detail.fieldByName("isStaff") : "",
                hasInfant : Detail.fieldByName("hasInfant") != null ? Detail.fieldByName("hasInfant") : "",
                salutation : Detail.fieldByName("salutation") != null ? Detail.fieldByName("salutation") : ""
            };
            
            List.push(passenger);
         
            Detail.next();
        }
        Detail.close();
    }
            
    db.close();
    return List;
    
};

exports.getUpgradeCode = function(codeArg) {
    var db = Ti.Database.open(Alloy.Globals.dbName);

    var Detail = db.execute("SELECT * FROM UpgradeCode WHERE upgradeCode= ? ", codeArg + "");
    if (Detail != null) {
        if (Detail.isValidRow()) {
            var upgradeData = {
                upgradeCode : Detail.fieldByName("upgradeCode"),
                fromClass : Detail.fieldByName("fromClass"),
                toClass : Detail.fieldByName("toClass"),
                mile : Detail.fieldByName("mile"),
                amount : Detail.fieldByName("amount")
            };
        }
        Detail.close();
    }
    
    db.close();
    return upgradeData;
};

exports.getPaymentType = function() {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var list = [];
    var Details = db.execute("SELECT name FROM PaymentType");
    if (Details != null){
        while(Details.isValidRow()){
            list.push(Details.fieldByName("name") != null ? Details.fieldByName("name") : "");
            Details.next();
        }
        Details.close();
    }
    db.close();
    return list;
};

exports.getPaymentCurrency = function() {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var list = [];
    var Details = db.execute("SELECT currencyName FROM PaymentCurrency");
    if (Details != null){
        while(Details.isValidRow()){
            list.push(Details.fieldByName("currencyName") != null ? Details.fieldByName("currencyName") : "");
            Details.next();
        }
        Details.close();
    }
    db.close();
    return list;
};

exports.insertUpgradeSeatData = function(dataArg) {
    if(dataArg != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
        db.execute("INSERT INTO UpgradeSeat " + 
            "(toClass, toSeat, paxKey, paxId, accountId, flightId, upgradeCode, paymentType, amount, paymentCurrency, detail, createdBy, createdDate, fromSeat, fromClass, incidentId) " +
            "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", 
            dataArg.toClass,
            dataArg.toSeat,
            dataArg.paxKey,
            dataArg.passengerId,
            dataArg.accountId,
            dataArg.flightId,
            dataArg.upgradeCode,
            dataArg.paymentType,
            dataArg.amount,
            dataArg.paymentCurrency,
            dataArg.detail,
            dataArg.createdBy,
            dataArg.createdDate,
            dataArg.fromSeat,
            dataArg.fromClass,
            dataArg.incidentId
           );
        db.close();        
    }
};

exports.updatePassengerSeatClass = function(dataArg) {
    if (dataArg != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
            db.execute("BEGIN");
            db.execute("UPDATE Passenger SET oldSeat=?, oldClass=?, bookingSeat=?, bookingClass=? WHERE (id=? OR accountId=? OR paxKey=?) AND flightId=?", 
                dataArg.currentSeat,
                dataArg.currentClass,
                dataArg.newSeat,
                dataArg.newClass,
                dataArg.paxId,
                dataArg.accountId,
                dataArg.paxKey,
                currentFlightId
            );
            db.execute("COMMIT");
        db.close();
    }
};

exports.updatePassengerSeatClassPerFlight = function(dataArg) {
    if (dataArg != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
        var rs = db.execute("SELECT flightNumber, flightDateUTC, aircraftRegistration FROM Flight WHERE id=?",currentFlightId);

        if(rs != null && rs.isValidRow()) {
            var flightIdList = db.execute("SELECT id FROM Flight WHERE flightNumber=? AND flightDateUTC=? AND aircraftRegistration=?",
                                  rs.fieldByName("flightNumber"), 
                                  rs.fieldByName("flightDateUTC"), 
                                  rs.fieldByName("aircraftRegistration")
                               );            
            if(flightIdList != null) {
                while (flightIdList.isValidRow()) {
                    db.execute("BEGIN");
                    db.execute("UPDATE Passenger SET oldSeat=?, oldClass=?, bookingSeat=?, bookingClass=? WHERE (id=? OR accountId=? OR paxKey=?) AND flightId=?", 
                        dataArg.currentSeat,
                        dataArg.currentClass,
                        dataArg.newSeat,
                        dataArg.newClass,
                        dataArg.paxId,
                        dataArg.accountId,
                        dataArg.paxKey,
                        flightIdList.fieldByName("id")
                    );
                    db.execute("COMMIT");
                    flightIdList.next();
                }
                flightIdList.close();
            }
            rs.close();
        }
        db.close();
    }
};

exports.voidUpdateSeatClass = function(dataArg) {
    if (dataArg != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
        db.execute("BEGIN");
        db.execute("UPDATE UpgradeSeat SET isVoided=1 WHERE isSynced = 0 AND (paxId=? OR accountId=? OR paxKey=?)", 
            dataArg.paxId != null ? dataArg.paxId : "",
            dataArg.accountId != null ? dataArg.accountId : "",
            dataArg.paxKey != null ? dataArg.paxKey : ""
        );
        db.execute("COMMIT");
        
        db.execute("BEGIN");
        db.execute("UPDATE Passenger SET oldSeat=?, oldClass=?, bookingSeat=?, bookingClass=? WHERE id=? OR accountId=? OR paxKey=?", 
            null,
            null,
            dataArg.currentSeat,
            dataArg.currentClass,
            dataArg.paxId != null ? dataArg.paxId : "",
            dataArg.accountId != null ? dataArg.accountId : "",
            dataArg.paxKey != null ? dataArg.paxKey : ""
        );
        db.execute("COMMIT");
        db.close();
    }
};

exports.getUpgradeSeatDataForSync = function() {
    var db = Ti.Database.open(Alloy.Globals.dbName);

    var select = "SELECT * ";
    var from = "FROM UpgradeSeat ";
    var where = "WHERE isSynced=0 AND amount<>0";
    var sql = select + from + where;
    var detail = db.execute(sql);

    var list = [];
    if (detail != null) {
        while (detail.isValidRow()) {
            var upgradeSeatData = {
                toClass : detail.fieldByName("toClass").length > 0 ? detail.fieldByName("toClass") : null,
                toSeat : detail.fieldByName("toSeat").length > 0 ? detail.fieldByName("toSeat") : null,
                paxKey : detail.fieldByName("paxKey").length > 0  ? detail.fieldByName("paxKey") : null,
                fltId : detail.fieldByName("flightId").length > 0 ? detail.fieldByName("flightId") : null,
                paxId : detail.fieldByName("paxId").length > 0 ? detail.fieldByName("paxId") : null,
                upCode : detail.fieldByName("upgradeCode").length > 0 ? detail.fieldByName("upgradeCode") : null,
                payType : detail.fieldByName("paymentType").length > 0 ? detail.fieldByName("paymentType") : null,
                amount : detail.fieldByName("amount"),
                currenc : detail.fieldByName("paymentCurrency").length > 0 ? detail.fieldByName("paymentCurrency") : null,
                detail : detail.fieldByName("detail").length > 0 ? detail.fieldByName("detail") : null,
                id : detail.fieldByName("incidentId").length > 0 ? detail.fieldByName("incidentId") : null,
                creDT : detail.fieldByName("createdDate"), // text
                isVoided : detail.fieldByName("isVoided")
            };
            
            list.push(upgradeSeatData);
            detail.next();
        }

        detail.close();
    }

    db.close();

    return list;
};

exports.updateSeatStatusOnLOPA = function(dataArg) {
    if (dataArg != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
        
            db.execute("BEGIN");
            db.execute("UPDATE LOPAPosition SET newStatus=?, hasPax=? WHERE LOPAPosition.position=? AND LOPAPosition.flightId=?", 
                dataArg.newStatus,
                dataArg.hasPax,
                dataArg.position != null ? dataArg.position : "",
                currentFlightId
            );                
            db.execute("COMMIT");
  
        db.close();
    }
};

exports.updateSeatStatusOnLOPAPerFlightNumber = function(dataArg) {
    if (dataArg != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
        
        var rs = db.execute("SELECT flightNumber, flightDateUTC, aircraftRegistration FROM Flight WHERE id=?",currentFlightId);

        if(rs != null && rs.isValidRow()) {
            var flightIdList = db.execute("SELECT Flight.id FROM Flight LEFT JOIN Passenger ON Passenger.flightId = Flight.id WHERE Flight.flightNumber=? AND Flight.flightDateUTC=? AND Flight.aircraftRegistration=? AND (Passenger.id=? OR Passenger.accountId=? OR Passenger.paxKey=?)",
                    rs.fieldByName("flightNumber"), 
                    rs.fieldByName("flightDateUTC"), 
                    rs.fieldByName("aircraftRegistration"),
                    dataArg.paxId,
                    dataArg.accountId,
                    dataArg.paxKey
                );            
            if(flightIdList != null) {
                while (flightIdList.isValidRow()) {
                    db.execute("BEGIN");
                    db.execute("UPDATE LOPAPosition SET newStatus=?, hasPax=? WHERE LOPAPosition.position=? AND LOPAPosition.flightId=?", 
                        dataArg.newStatus,
                        utility.convertBooleanToInt(dataArg.hasPax),
                        dataArg.position != null ? dataArg.position : "",
                        flightIdList.fieldByName("id")
                    );                
                    db.execute("COMMIT");
                    flightIdList.next();
                }
                flightIdList.close();
            }
            rs.close(); 
        }
        db.close();
    }
};


exports.getUpgradeSeatData = function(paxKeyArg,accountIdArg,paxIdArg) {
    var db = Ti.Database.open(Alloy.Globals.dbName);

    var select = "SELECT * ";
    var from = "FROM UpgradeSeat ";
    var where = "WHERE (paxKey=? OR accountId=? OR paxId=?) AND flightId=? AND amount<>0";
    var sql = select + from + where;
    var detail = db.execute(sql, paxKeyArg!=null?paxKeyArg:"", accountIdArg!=null?accountIdArg:"", paxIdArg!=null?paxIdArg:"", currentFlightId);
    
    var list = [];
    if (detail != null) {
        while (detail.isValidRow()) {
            var upgradeSeatData = {
                fromSeat : detail.fieldByName("fromSeat") != null ? detail.fieldByName("fromSeat") : "",
                fromClass : detail.fieldByName("fromClass") != null ? detail.fieldByName("fromClass") : "",
                toClass : detail.fieldByName("toClass") != null ? detail.fieldByName("toClass") : "",
                toSeat : detail.fieldByName("toSeat") != null ? detail.fieldByName("toSeat") : "",
                paxKey : detail.fieldByName("paxKey") != null ? detail.fieldByName("paxKey") : "",
                fltId : detail.fieldByName("flightId") != null ? detail.fieldByName("flightId") : "",
                paxId : detail.fieldByName("paxId") != null ? detail.fieldByName("paxId") : "",
                upCode : detail.fieldByName("upgradeCode") != null ? detail.fieldByName("upgradeCode") : "",
                payType : detail.fieldByName("paymentType") != null ? detail.fieldByName("paymentType") : "",
                amount : detail.fieldByName("amount"),
                currenc : detail.fieldByName("paymentCurrency") != null ? detail.fieldByName("paymentCurrency") : "",
                detail : detail.fieldByName("detail") != null ? detail.fieldByName("detail") : "",
                isSynced : detail.fieldByName("isSynced") != null ? detail.fieldByName("isSynced") : "",
                isVoided : detail.fieldByName("isVoided") != null ? detail.fieldByName("isVoided") : ""
            };
            
            list.push(upgradeSeatData);
            detail.next();
        }

        detail.close();
    }

    db.close();

    return list;
};

exports.getChangeSeatData = function(paxKeyArg,accountIdArg,paxIdArg) {
    var db = Ti.Database.open(Alloy.Globals.dbName);

    var select = "SELECT * ";
    var from = "FROM UpgradeSeat ";
    var where = "WHERE (paxKey=? OR accountId=? OR paxId=?) AND flightId=? AND amount=0";
    var sql = select + from + where;
    var detail = db.execute(sql, paxKeyArg!=null?paxKeyArg:"", accountIdArg!=null?accountIdArg:"", paxIdArg!=null?paxIdArg:"", currentFlightId);
    
    var list = [];
    if (detail != null) {
        while (detail.isValidRow()) {
            var upgradeSeatData = {
                fromSeat : detail.fieldByName("fromSeat") != null ? detail.fieldByName("fromSeat") : "",
                fromClass : detail.fieldByName("fromClass") != null ? detail.fieldByName("fromClass") : "",
                toClass : detail.fieldByName("toClass") != null ? detail.fieldByName("toClass") : "",
                toSeat : detail.fieldByName("toSeat") != null ? detail.fieldByName("toSeat") : "",
                paxKey : detail.fieldByName("paxKey") != null ? detail.fieldByName("paxKey") : "",
                fltId : detail.fieldByName("flightId") != null ? detail.fieldByName("flightId") : "",
                paxId : detail.fieldByName("paxId") != null ? detail.fieldByName("paxId") : "",
                code : detail.fieldByName("upgradeCode") != null ? detail.fieldByName("upgradeCode") : "",
                payType : detail.fieldByName("paymentType") != null ? detail.fieldByName("paymentType") : "",
                amount : detail.fieldByName("amount"),
                currenc : detail.fieldByName("paymentCurrency") != null ? detail.fieldByName("paymentCurrency") : "",
                detail : detail.fieldByName("detail") != null ? detail.fieldByName("detail") : "",
                isSynced : detail.fieldByName("isSynced") != null ? detail.fieldByName("isSynced") : "",
                isVoided : detail.fieldByName("isVoided") != null ? detail.fieldByName("isVoided") : ""
            };
            
            list.push(upgradeSeatData);
            detail.next();
        }

        detail.close();
    }

    db.close();

    return list;
};

exports.updateUpgradeSeatPostReturn = function(dataArg) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    
    try {
        if (dataArg != null && dataArg.length > 0) {
            for (var i = 0; i < dataArg.length; i++) {
                db.execute("UPDATE UpgradeSeat SET isSynced = 1 WHERE paxKey=? OR paxId=?",dataArg[i].paxKey, dataArg[i].paxId);
            };
        }
    } catch(e) {
        Ti.API.error(e);
    }
    db.close();
};

exports.insertROPEnrollment = function(dataArg) {
    if(dataArg != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
        db.execute("INSERT OR REPLACE INTO ROPEnrollment (saluation, firstName, lastName, dateOfBirth, gender, nationality, " + 
            "phoneType, countryCode, areaCode, phoneNumber, email, " + 
            "enrollDate, status, isSynced, isCompleted, paxKey, accountId, passengerId, flightId, flightNumber, ropNumber, createdBy, reportedBy, isAccepted) " +
            "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", 
            dataArg.saluation, 
            dataArg.firstName, 
            dataArg.lastName, 
            dataArg.dateOfBirth, 
            dataArg.gender, 
            dataArg.nationality, 
            dataArg.phoneType, 
            dataArg.countryCode, 
            dataArg.areaCode, 
            dataArg.phoneNumber, 
            dataArg.email, 
            dataArg.enrollDate, 
            dataArg.status,
            utility.convertBooleanToInt(dataArg.isSynced), 
            utility.convertBooleanToInt(dataArg.isCompleted), 
            dataArg.paxKey,
            dataArg.accountId,
            dataArg.passengerId,
            dataArg.flightId,
            dataArg.flightNumber,
            dataArg.ropNumber,
            dataArg.createdBy,
            dataArg.appliedBy,
            utility.convertBooleanToInt(dataArg.isAccepted)
           );
        db.close();        
    }
};

exports.deleteRopEnrollmentByPaxKey = function(paxKey) {
    if (paxKey != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
        db.execute("DELETE FROM ROPEnrollment WHERE paxKey=?", paxKey);
        db.close();
    }
};

exports.deleteRopEnrollAttachmentByPaxKey = function(paxKey) {
    if (paxKey != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
        db.execute("DELETE FROM ROPEnrollAttachment WHERE parentId=?", paxKey);
        db.close();
    }
};

exports.insertRopEnrollAttachment = function(attachment) {
    if (attachment != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
        db.execute("INSERT INTO ROPEnrollAttachment (imagePath, detail, parentId, isSynced) VALUES (?,?,?,?)", attachment.name, attachment.detail, attachment.parentId, false);
        db.close();
    }
};

exports.getNationalityList = function() {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT * FROM Nationality ORDER BY nationality ASC");

    var List=[];
    if (Detail != null) {
        while (Detail.isValidRow()) {
            var nationality = {
                id : Detail.fieldByName("id") != null ? Detail.fieldByName("id") : "",
                nationality : Detail.fieldByName("nationality") != null ? Detail.fieldByName("nationality") : ""
            };           
            List.push(nationality);        
            Detail.next();
        }
        Detail.close();
    }
    
    db.close();
    return List;
};

exports.getNationalityArrayList = function() {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT * FROM Nationality ORDER BY nationality ASC");

    var List=[];
    if (Detail != null) {
        while (Detail.isValidRow()) {
            List.push((Detail.fieldByName("id") != null ? Detail.fieldByName("id") : "") +" : " +(Detail.fieldByName("nationality") != null ? Detail.fieldByName("nationality") : ""));
            Detail.next();
        }
        Detail.close();
    }
    
    db.close();
    return List;
};

exports.getFullNameNationality = function(id) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var detail = db.execute("SELECT * FROM Nationality WHERE id = ?", !utility.isEmpty(id) ? id : "Empty");

    if (detail != null) {
        if (detail.isValidRow()) {
            var nationality = {
                fullname : detail.fieldByName("nationality") != null ? detail.fieldByName("nationality") : ""
            };
        }
        detail.close();
    }
    db.close();
    return nationality;
};

exports.getNationalityId = function(fullname) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var detail = db.execute("SELECT * FROM Nationality WHERE nationality = ?", fullname);

    if (detail != null) {
        if (detail.isValidRow()) {
            var nationality = {
                id : detail.fieldByName("id") != null ? detail.fieldByName("id") : ""
            };
        }
        detail.close();
    }
    db.close();
    return nationality;
};


exports.getRopEnrollAttachment = function(paxKey) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var detail = db.execute("SELECT * FROM ROPEnrollAttachment WHERE parentId = ?", paxKey);

    if (detail != null) {
        if (detail.isValidRow()) {
            var ROPEnrollment = {
                parentId : detail.fieldByName("parentId") != null ? detail.fieldByName("parentId") : "",
                imagePath : detail.fieldByName("imagePath") != null ? detail.fieldByName("imagePath") : "",
                detail : detail.fieldByName("detail") != null ? detail.fieldByName("detail") : "",
                isSynced : detail.fieldByName("isSynced") != null ? detail.fieldByName("isSynced") : false,
                sfdcId : detail.fieldByName("sfdcId") != null ? detail.fieldByName("sfdcId") : ""
            };
        }
        detail.close();
    }
    db.close();
    return ROPEnrollment;
};

exports.getRopEnrollAttachmentsForSync = function() {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var detail = db.execute("SELECT * FROM ROPEnrollAttachment WHERE isSynced = 0");
    var attachments = [];
    if (detail != null) {
        while (detail.isValidRow()) {
            var ROPEnrollment = {
                id : detail.fieldByName("id") != null ? detail.fieldByName("id") : "",
                parentId : detail.fieldByName("parentId") != null ? detail.fieldByName("parentId") : "",
                path : detail.fieldByName("imagePath") != null ? detail.fieldByName("imagePath") : "",
                detail : detail.fieldByName("detail") != null ? detail.fieldByName("detail") : "",
                isSynced : detail.fieldByName("isSynced") != null ? detail.fieldByName("isSynced") : false,
                sfdcId : detail.fieldByName("sfdcId")
            };
            
            attachments.push(ROPEnrollment);
            detail.next();
        }
        detail.close();
    }
    db.close();
    return attachments;
};

exports.updateROPEnrollAttachmentSyncStatusCompleteById = function(sfid, attachmentId) {
    if (attachmentId != null) {
        var db = Ti.Database.open(Alloy.Globals.dbName);
        db.execute("UPDATE ROPEnrollAttachment SET sfdcId=?, isSynced=1 WHERE id=?", sfid, attachmentId);
        db.close();
    }
};

exports.updateROPEnrollmentsAsCompleted = function(completedEnrollmentIds) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    db.execute('BEGIN');
    if (completedEnrollmentIds != null && completedEnrollmentIds.length > 0) {
        for (var i = 0; i < completedEnrollmentIds.length; i++) {
            db.execute('UPDATE ROPEnrollment SET isCompleted=1 WHERE paxKey=?', completedEnrollmentIds[i]);
        }
    }
    db.execute('COMMIT');
    db.close();
};

exports.getCompleteROPEnrollIds = function() {    
    var db = Ti.Database.open(Alloy.Globals.dbName);
    
    var ROPEnrollIds = new Array();
    var sql = 
        "SELECT ROPEnrollment.paxKey AS id, COUNT(ROPEnrollAttachment.id) AS Attachments, COUNT(CASE WHEN ROPEnrollAttachment.isSynced=1 THEN 1 END) AS SyncedAttachments " +
        "FROM ROPEnrollment, ROPEnrollAttachment " +
        "WHERE ROPEnrollment.isSynced = 1 " +
            "AND ROPEnrollment.isCompleted = 0 " +
            "AND ROPEnrollment.paxKey = ROPEnrollAttachment.parentId " +
            "GROUP BY ROPEnrollment.paxKey " +
            "HAVING Attachments = SyncedAttachments " +
            "UNION ALL " +
            "SELECT ROPEnrollment.paxKey AS id, 0 AS Attachments, 0 AS SyncedAttachments " +
            "FROM ROPEnrollment " + 
            "WHERE ROPEnrollment.isSynced = 1 " +
            "AND ROPEnrollment.isCompleted = 0 " +
            "AND ROPEnrollment.paxKey NOT IN (SELECT parentId FROM ROPEnrollAttachment)";
    var rs = db.execute(sql);       
    if (rs != null) {
        while (rs.isValidRow()) {
            var attachmentCount = rs.fieldByName("Attachments");
            var syncedAttachmentCount = rs.fieldByName("SyncedAttachments");    
            ROPEnrollIds.push(rs.fieldByName("id"));         
            rs.next();
        }
        rs.close();
    }
    db.close();
    return ROPEnrollIds;
};


exports.voidROPEnrollment = function(paxKey) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    db.execute("UPDATE ROPEnrollment SET status = 2, isSynced = 0 WHERE paxKey=?", !utility.isEmpty(paxKey) ? paxKey : "Empty");
    db.close();
};

exports.getROPEnrollment = function(accountId, paxKey) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var detail;
	detail = db.execute("SELECT * FROM ROPEnrollment WHERE accountId=? OR paxKey=?", 
							!utility.isEmpty(accountId) ? accountId: "Empty", 
							!utility.isEmpty(paxKey) ? paxKey : "Empty"
						);
	
    if (detail != null) {
        if (detail.isValidRow()) {
            var ROPEnrollment = {
                saluation : detail.fieldByName("saluation") != null ? detail.fieldByName("saluation") : "",
                firstName : detail.fieldByName("firstName") != null ? detail.fieldByName("firstName") : "",
                lastName : detail.fieldByName("lastName") != null ? detail.fieldByName("lastName") : "",
                dateOfBirth : detail.fieldByName("dateOfBirth") != null ? detail.fieldByName("dateOfBirth") : "",
                gender : detail.fieldByName("gender") != null ? detail.fieldByName("gender") : "",
                nationality : detail.fieldByName("nationality") != null ? detail.fieldByName("nationality") : "",
                phoneType : detail.fieldByName("phoneType") != null ? detail.fieldByName("phoneType") : "",
                countryCode : detail.fieldByName("countryCode") != null ? detail.fieldByName("countryCode") : "",
                areaCode : detail.fieldByName("areaCode") != null ? detail.fieldByName("areaCode") : "",
                phoneNumber : detail.fieldByName("phoneNumber") != null ? detail.fieldByName("phoneNumber") : "",
                email : detail.fieldByName("email") != null ? detail.fieldByName("email") : "",
                enrollDate : detail.fieldByName("enrollDate") != null ? detail.fieldByName("enrollDate") : "",
                status : detail.fieldByName("status") != null ? detail.fieldByName("status") : 0,
                isSynced : detail.fieldByName("isSynced") != null ? detail.fieldByName("isSynced") : false,
                isCompleted : detail.fieldByName("isCompleted") != null ? detail.fieldByName("isCompleted") : false,
                paxKey : detail.fieldByName("paxKey") != null ? detail.fieldByName("paxKey") : null,
                accountId : detail.fieldByName("accountId") != null ? detail.fieldByName("accountId") : null,
                passengerId : detail.fieldByName("passengerId") != null ? detail.fieldByName("passengerId") : null,
                sfdcId : detail.fieldByName("sfdcId") != null ? detail.fieldByName("sfdcId") : null,
                flightId : detail.fieldByName("flightId") != null ? detail.fieldByName("flightId") : null,
                flightNumber : detail.fieldByName("flightNumber") != null ? detail.fieldByName("flightNumber") : "",
                inactiveReason : detail.fieldByName("inactiveReason") != null ? detail.fieldByName("inactiveReason") : "",
                ropNumber : detail.fieldByName("ropNumber") != null ? detail.fieldByName("ropNumber") : "",
                createdBy : detail.fieldByName("createdBy") != null ? detail.fieldByName("createdBy") : "",
                reportedBy : detail.fieldByName("reportedBy") != null ? detail.fieldByName("reportedBy") : "",
                isAccepted : detail.fieldByName("isAccepted")                                                
            };
        }
        detail.close();
    }
    db.close();
    return ROPEnrollment;
};

exports.getConditionForEnrollment = function() {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var detail = db.execute("SELECT * FROM ROPEnrollCondition");

    if (detail != null) {
        if (detail.isValidRow()) {
            var conditionForEnroll = {
                detail : detail.fieldByName("condiAndTerm") != null ? detail.fieldByName("condiAndTerm") : "",
                acceptText : detail.fieldByName("acceptText") != null ? detail.fieldByName("acceptText") : ""
            };
        }
        detail.close();
    }
    db.close();
    return conditionForEnroll;
};

exports.getROPEnrollmentForSync = function() {
    var db = Ti.Database.open(Alloy.Globals.dbName);

    var select = "SELECT * ";
    var from = "FROM ROPEnrollment ";
    var where = "WHERE isSynced=0";
    var sql = select + from + where;
    var detail = db.execute(sql);

    var list = [];
    if (detail != null) {
        while (detail.isValidRow()) {
                         
            var ropEnrollment = {
                salut : !utility.isEmpty(detail.fieldByName("saluation")) ? detail.fieldByName("saluation") : null,
                firstN : !utility.isEmpty(detail.fieldByName("firstName")) ? detail.fieldByName("firstName") : null,
                lastN : !utility.isEmpty(detail.fieldByName("lastName")) ? detail.fieldByName("lastName") : null,
                birth : !utility.isEmpty(detail.fieldByName("dateOfBirth")) ? detail.fieldByName("dateOfBirth") : null,
                gender : !utility.isEmpty(detail.fieldByName("gender")) ? detail.fieldByName("gender") : null,
                nation : !utility.isEmpty(detail.fieldByName("nationality")) ? detail.fieldByName("nationality") : null,
                phnType : !utility.isEmpty(detail.fieldByName("phoneType")) ? detail.fieldByName("phoneType") : null,
                cCode : !utility.isEmpty(detail.fieldByName("countryCode")) ? detail.fieldByName("countryCode") : null,
                aCode : !utility.isEmpty(detail.fieldByName("areaCode")) ? detail.fieldByName("areaCode") : null,
                phnNum : !utility.isEmpty(detail.fieldByName("phoneNumber")) ? detail.fieldByName("phoneNumber") : null,
                email : !utility.isEmpty(detail.fieldByName("email")) ? detail.fieldByName("email") : null,
                enrollD : !utility.isEmpty(detail.fieldByName("enrollDate")) ? detail.fieldByName("enrollDate") : null,
                status : detail.fieldByName("status") != null ? detail.fieldByName("status") : 0,
                isSynced : detail.fieldByName("isSynced") != null ? detail.fieldByName("isSynced") : false,
                paxKey : !utility.isEmpty(detail.fieldByName("paxKey")) ? detail.fieldByName("paxKey") : null,
                accId : !utility.isEmpty(detail.fieldByName("accountId")) ? detail.fieldByName("accountId") : null,
                paxId : !utility.isEmpty(detail.fieldByName("passengerId")) ? detail.fieldByName("passengerId") : null,
                fltId : !utility.isEmpty(detail.fieldByName("flightId")) ? detail.fieldByName("flightId") : null,
                sfdcId : detail.fieldByName("sfdcId"),
                fltNum : !utility.isEmpty(detail.fieldByName("flightNumber")) ? detail.fieldByName("flightNumber") : null,
                repBy : !utility.isEmpty(detail.fieldByName("reportedBy")) ? detail.fieldByName("reportedBy") : null,
                creBy : !utility.isEmpty(detail.fieldByName("createdBy")) ? detail.fieldByName("createdBy") : null,                
                ropNumber : !utility.isEmpty(detail.fieldByName("ropNumber")) ? detail.fieldByName("ropNumber") : null                
            };
            
            list.push(ropEnrollment);
            detail.next();
        }

        detail.close();
    }

    db.close();

    return list;
};

exports.updateROPEnrollmentPostReturn = function(dataArgs) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    
    try {
        if (dataArgs != null && dataArgs.length > 0) {
            for (var i = 0; i < dataArgs.length; i++) {
                db.execute("UPDATE ROPEnrollment SET isSynced = 1, sfdcId = ?, accountId = ?, ropNumber = ? WHERE paxKey=?",dataArgs[i].sfdcId, dataArgs[i].accId != null ? dataArgs[i].accId : "", dataArgs[i].ropNumber, dataArgs[i].paxKey);
            };
        }
    } catch(e) {
        Ti.API.error(e);
    }
    db.close();
};

function sortFnBySeat(a, b) {
    if (a.bookingSeat[a.bookingSeat.length - 1] < b.bookingSeat[b.bookingSeat.length - 1])
        return -1;
    if (a.bookingSeat[a.bookingSeat.length - 1] > b.bookingSeat[b.bookingSeat.length - 1])
        return 1;
    if (a.bookingSeat[a.bookingSeat.length - 1] == b.bookingSeat[b.bookingSeat.length - 1])
        return a.bookingSeat.slice(0, a.bookingSeat.length - 1) - b.bookingSeat.slice(0, b.bookingSeat.length - 1);
};

/* try to code new logic here STUCK */
exports.getPassengerRopListEdit = function(flightId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    								
    	var Detail = db.execute("SELECT LOPAPosition.flightId,LOPAPosition.floor,LOPAPosition.zone,Passenger.id,Passenger.lastName,Passenger.firstName,Passenger.bookingSeat,Passenger.bookingClass,"+
    								"ROP.ropTier "+
    								"FROM Passenger "+
    								 "LEFT JOIN ROP ON Passenger.id=ROP.passengerId  "+
    								 "left join LOPAPosition on LOPAPosition.position=Passenger.bookingSeat  "+
    								 "WHERE Passenger.flightId=?  " +
    								 "Order By Passenger.bookingSeat ASC,Passenger.LastName", flightId);
    								

    var ListDupOrNot2 = [];
    
    /* sort by ropTier: Plat Gold Sil Bas */
    var ListPlatinum = [];
    var ListGold = [];
    var ListSilver = [];
    var ListBasic = [];
    var ListRopTierNull = [];
    
    /* seat with no seat */
    var ListPlatinumNoSeat = [];
    var ListGoldNoSeat = [];
    var ListSilverNoSeat = [];
    var ListBasicNoSeat = [];
    var ListRopTierNullNoSeat = [];
    
    // for concat by ropTier
    var List1 = [];
    var List2 = [];
    var List3 = [];
    var ListRopTierALL = [];
    
    /* sort by class: F C U Y */
    var ListF = [];
    var ListFwithSeat = [];
    var ListFnoSeat = [];
    
    var ListC = [];
    var ListCwithSeat = [];
    var ListCnoSeat = [];
    
    var ListU = [];
    var ListUwithSeat = [];
    var ListUnoSeat = [];
    
    var ListY = [];
    var ListYwithSeat = [];
    var ListYnoSeat = [];
    
    /* for summary sort by Class + Seat */
   var ListClassSeatALL = [];
       
    /* for summary sort by ROP+ClassSeat */
   var List = [];
    
    var ListNull = [];
    if (Detail != null) {
        while (Detail.isValidRow()) {
        	if(Detail.fieldByName("flightId")==flightId || Detail.fieldByName("flightId")==null) {
	            var rop = "";
	            var ropId = "";
	            if (Detail.fieldByName("ropTier") != null) {
	                rop = "ROP " + Detail.fieldByName("ropTier");    
	            }
	
	            var passenger = {
	            	flightId : Detail.fieldByName("flightId"),
	                id : Detail.fieldByName("id") != null ? Detail.fieldByName("id") : "",
	                rop : rop,
	                name : (Detail.fieldByName("lastName") != null ? Detail.fieldByName("lastName") : "") + " " + (Detail.fieldByName("firstName") != null ? Detail.fieldByName("firstName") : ""),
	                bookingSeat : Detail.fieldByName("bookingSeat") != null ? Detail.fieldByName("bookingSeat") : "",
	                bookingClass : Detail.fieldByName("bookingClass") != null ? Detail.fieldByName("bookingClass") : "",
	                floor : Detail.fieldByName("floor") != null ? Detail.fieldByName("floor") : "",
	                zone : Detail.fieldByName("zone") != null ? Detail.fieldByName("zone") : ""
	            };
	            
	             /* try to check duplicate */
	            if (ListDupOrNot2.indexOf(passenger.name)>= 0){
	            }
	            else if(List.indexOf(passenger.name) < 0) {
	           		
	           		 ListDupOrNot2.push(passenger);        		            	
	            	
	            	 /*sort by ROP and Seat and noSeat */ // NoSeat
	           		  if (Detail.fieldByName("ropTier") != null) {
	            		 
	                	  chkRop = Detail.fieldByName("ropTier");
	               		  switch(chkRop){
	               			 case "PLATINUM": 
	               							 if(passenger.bookingSeat==""){
	               								  ListPlatinumNoSeat.push(passenger);
	               						      }else{
	               								  ListPlatinum.push(passenger);
	               							  }               							
	               				  break;
	                 				
	               			  case "GOLD":   
	               			               	  if(passenger.bookingSeat==""){
	               								  ListGoldNoSeat.push(passenger);
	               							  }else{
	               								  ListGold.push(passenger);
	               							  } 
	               				  break;
	               			  case "SILVER": 
	               			               	  if(passenger.bookingSeat==""){
	               								  ListSilverNoSeat.push(passenger);
	               							  }else{
	               								  ListSilver.push(passenger);
	               							  } 
	               				  break;
	               			  case "BASIC":  
	               			               	  if(passenger.bookingSeat==""){
	               								  ListBasicNoSeat.push(passenger);
	               							  }else{
	               								  ListBasic.push(passenger);
	               							  } 
	               				  break;    		           				
	               		  }
	                 	
	            	  }
	          	}
	           
	          	Detail.next();
	        }
        }
        
        Detail.close();
    }
    
   
   /* try to concat ropTier: Plat+Gold+Sil+Bas + NoSeat */
  List1Basic = ListBasic.concat( ListBasicNoSeat );
  List2Silver = ListSilver.concat( ListSilverNoSeat );
  List3Gold = ListGold.concat( ListGoldNoSeat );
  List4Platinum = ListPlatinum.concat( ListPlatinumNoSeat );
  
    /* edit */
  	List01 = List2Silver.concat( List1Basic );
  	List02 = List3Gold.concat( List1 );
  	List = List4Platinum.concat( List02 );
	    
    Detail.close();
    db.close();
    return List;
};


/* ROPList new query */
exports.getPsgRopListEditNewQry = function(flightId,offset,limit,searchText) {

var db = Ti.Database.open(Alloy.Globals.dbName);
			 							
	var sql = "SELECT Passenger.flightId as paxLopa, Passenger.bookingClass, " +"Passenger.salutation as salutation,"+
	           "ROP.ropTier, Passenger.bookingSeat, Passenger.lastName, Passenger.id, Passenger.paxKey, Passenger.accountId, "+
	           "LOPAPosition.floor,LOPAPosition.zone,Passenger.id,Passenger.offPoint,Passenger.firstName,Passenger.searchClass, "+
	           "Passenger.searchDest, Passenger.searchInfant, Passenger.searchStaff, Passenger.isStaff, "+
	           "LOPAPosition.searchFloor,LOPAPosition.searchZone,ROP.searchROP, "+
               "ROPEnrollment.paxKey AS hasROPEnroll, "+
					"CASE Passenger.bookingClass "+ 
					"WHEN 'F' THEN 0 "+
					"WHEN 'C' THEN 1 "+
					"WHEN 'U' THEN 2 "+
					"WHEN 'Y' THEN 3 ELSE 4 END AS classOrder, "+
					
					"CASE WHEN ROP.ropTier = 'PLATINUM' AND Passenger.bookingSeat IS NOT NULL  THEN 0 ELSE "+
					"CASE WHEN ROP.ropTier = 'PLATINUM' AND Passenger.bookingSeat IS NULL  THEN 1 ELSE "+
					"CASE WHEN ROP.ropTier = 'GOLD' AND Passenger.bookingSeat IS NOT NULL  THEN 2 ELSE "+
					"CASE WHEN ROP.ropTier = 'GOLD' AND Passenger.bookingSeat IS NULL  THEN 3 ELSE	"+
					"CASE WHEN ROP.ropTier = 'SILVER' AND Passenger.bookingSeat IS NOT NULL  THEN 4 ELSE "+ 
					"CASE WHEN ROP.ropTier = 'SILVER' AND Passenger.bookingSeat IS NULL  THEN 5 ELSE	"+
					"CASE WHEN ROP.ropTier = 'BASIC' AND Passenger.bookingSeat IS NOT NULL  THEN 6 ELSE "+ 
					"CASE WHEN ROP.ropTier = 'BASIC' AND Passenger.bookingSeat IS NULL  THEN 7 ELSE "+
					"CASE WHEN ROP.ropTier = '' AND Passenger.bookingSeat IS NOT NULL  THEN 8 ELSE "+ 
					"CASE WHEN ROP.ropTier = '' AND Passenger.bookingSeat IS NULL  THEN 9 ELSE NULL "+
					"END END END END END END END END END END AS ropOrder "+
					"FROM ROP "+
					"LEFT JOIN Passenger ON ROP.id = Passenger.memberId "+
                    "LEFT JOIN ROPEnrollment ON (Passenger.id=ROPEnrollment.passengerId OR Passenger.paxKey=ROPEnrollment.paxKey OR Passenger.accountId=ROPEnrollment.accountId)  "+
					"left join LOPAPosition on LOPAPosition.position=Passenger.bookingSeat ";
			 
	 if(searchText!=""){
    	sql+="WHERE Passenger.firstName like '%"+searchText+"%' or"+
    	" Passenger.lastName like '%"+searchText+"%' or"+
    	" Passenger.bookingClass like '%"+searchText+"%' or"+
    	" Passenger.bookingSeat like '%"+searchText+"%' or"+
    	" LOPAPosition.floor like '%"+searchText+"%' or"+
    	" LOPAPosition.zone like '%"+searchText+"%' or"+
    	" Passenger.firstName like '%"+searchText+"%' or"+
    	
    	" Passenger.searchClass like '%"+searchText+"%' or"+
    	" Passenger.searchDest like '%"+searchText+"%' or"+
    	" Passenger.searchInfant like '%"+searchText+"%' or"+
    	" Passenger.searchStaff like '%"+searchText+"%' or"+
    	" Passenger.salutation like '%"+searchText+"%' or"+
    	" LOPAPosition.searchFloor like '%"+searchText+"%' or"+
    	" LOPAPosition.searchZone like '%"+searchText+"%' or"+
    	" ROP.searchROP like '%"+searchText+"%' ";  
    }
    
 	sql+="GROUP BY Passenger.id ORDER BY classOrder, ropOrder, Passenger.bookingSeat ASC, Passenger.lastName ASC, Passenger.firstName ASC ";
    sql="SELECT * FROM ( "+sql+" ) WHERE paxLopa='"+flightId+"' "+  "LIMIT "+limit+" OFFSET "+offset;
            
    var Detail = db.execute(sql); 
    var ListDupOrNot2 = [];
    var List=[];
    if (Detail != null) {
        while (Detail.isValidRow()) {

            var rop = "";
            if (Detail.fieldByName("ropTier") != null) {
                // rop = " " + Detail.fieldByName("ropTier");
               
                rop = Detail.fieldByName("ropTier");
                if(rop == "PLATINUM"){
                	rop = " Platinum";	
                } else if(rop == "GOLD"){
                	rop = " Gold";	
                }else if(rop == "SILVER"){
                	rop = " Silver";	
                }else if(rop == "BASIC"){
                	rop = " Basic";	
                }    
            } else if(Detail.fieldByName("hasROPEnroll") != null && Detail.fieldByName("hasROPEnroll").length > 0){
                rop = " Applied";
            }              

            var passenger = {
                id : Detail.fieldByName("id") != null ? Detail.fieldByName("id") : "",
                paxKey : Detail.fieldByName("paxKey") != null ? Detail.fieldByName("paxKey") : "",
                accountId : Detail.fieldByName("accountId") != null ? Detail.fieldByName("accountId") : "",
                rop : rop,
                name : (Detail.fieldByName("lastName") != null ? Detail.fieldByName("lastName") : "") + "   " + (Detail.fieldByName("firstName") != null ? Detail.fieldByName("firstName") : "")+ " " + (Detail.fieldByName("salutation") != null ? Detail.fieldByName("salutation") : ""),
                bookingSeat : Detail.fieldByName("bookingSeat") != null ? Detail.fieldByName("bookingSeat") : "",
                bookingClass : Detail.fieldByName("bookingClass") != null ? Detail.fieldByName("bookingClass") : "",
                floor : Detail.fieldByName("floor") != null ? Detail.fieldByName("floor") : "",
                offPoint : Detail.fieldByName("offPoint") != null ? Detail.fieldByName("offPoint") : "",
                isStaff : Detail.fieldByName("isStaff") != null ? Detail.fieldByName("isStaff") : "",
                zone : Detail.fieldByName("zone") != null ? Detail.fieldByName("zone") : "",
                salutation : Detail.fieldByName("salutation") != null ? Detail.fieldByName("salutation") : ""
            };
            
            List.push(passenger);
             
            Detail.next();
        }
        
        Detail.close();
    }
   	db.close();
    return List;  
};

exports.getPsgEligibleListEditNewQry = function(flightId,offset,limit,searchText) {

var db = Ti.Database.open(Alloy.Globals.dbName);
			 							
	  var sql = "SELECT Passenger.flightId as paxLopa, Passenger.salutation as salutation, Passenger.upgrade as upgrade, Passenger.bookingClass, ROP.ropTier, Passenger.bookingSeat, Passenger.lastName, Passenger.id,LOPAPosition.floor,LOPAPosition.zone,Passenger.id,Passenger.offPoint,Passenger.firstName,Passenger.searchClass, Passenger.searchDest, Passenger.searchInfant, Passenger.searchStaff, Passenger.isStaff, Passenger.memberId, LOPAPosition.searchFloor,LOPAPosition.searchZone,ROP.searchROP,ROP.isExpired as isExpired, "+
                "ROPEnrollment.paxKey AS hasROPEnroll, "+
                  "CASE Passenger.bookingClass "+ 
					"WHEN 'F' THEN 0 "+
					"WHEN 'C' THEN 1 "+
					"WHEN 'U' THEN 2 "+
					"WHEN 'Y' THEN 3 ELSE 4 END AS classOrder, "+
					
					"CASE WHEN ROP.ropTier = 'PLATINUM' AND Passenger.bookingSeat IS NOT NULL  THEN 0 ELSE "+
					"CASE WHEN ROP.ropTier = 'PLATINUM' AND Passenger.bookingSeat IS NULL  THEN 1 ELSE "+
					"CASE WHEN ROP.ropTier = 'GOLD' AND Passenger.bookingSeat IS NOT NULL  THEN 2 ELSE "+
					"CASE WHEN ROP.ropTier = 'GOLD' AND Passenger.bookingSeat IS NULL  THEN 3 ELSE	"+
					"CASE WHEN ROP.ropTier = 'SILVER' AND Passenger.bookingSeat IS NOT NULL  THEN 4 ELSE "+ 
					"CASE WHEN ROP.ropTier = 'SILVER' AND Passenger.bookingSeat IS NULL  THEN 5 ELSE	"+
					"CASE WHEN ROP.ropTier = 'BASIC' AND Passenger.bookingSeat IS NOT NULL  THEN 6 ELSE "+ 
					"CASE WHEN ROP.ropTier = 'BASIC' AND Passenger.bookingSeat IS NULL  THEN 7 ELSE "+
					"CASE WHEN ROP.ropTier = '' AND Passenger.bookingSeat IS NOT NULL  THEN 8 ELSE "+ 
					"CASE WHEN ROP.ropTier = '' AND Passenger.bookingSeat IS NULL  THEN 9 ELSE NULL "+
					"END END END END END END END END END END AS ropOrder "+
					"FROM ROP "+
					"LEFT JOIN Passenger ON ROP.id = Passenger.memberId "+
                    "LEFT JOIN ROPEnrollment ON (Passenger.paxKey=ROPEnrollment.paxKey OR Passenger.accountId=ROPEnrollment.accountId)  "+
					"left join LOPAPosition on LOPAPosition.position=Passenger.bookingSeat ";
			 
	 if(searchText!=""){
    	sql+="WHERE Passenger.firstName like '%"+searchText+"%' or"+
    	" Passenger.lastName like '%"+searchText+"%' or"+
    	" Passenger.bookingClass like '%"+searchText+"%' or"+
    	" Passenger.bookingSeat like '%"+searchText+"%' or"+
    	" LOPAPosition.floor like '%"+searchText+"%' or"+
    	" LOPAPosition.zone like '%"+searchText+"%' or"+
    	" Passenger.firstName like '%"+searchText+"%' or"+
    	
    	" Passenger.searchClass like '%"+searchText+"%' or"+
    	" Passenger.searchDest like '%"+searchText+"%' or"+
    	" Passenger.searchInfant like '%"+searchText+"%' or"+
    	" Passenger.searchStaff like '%"+searchText+"%' or"+
    	" Passenger.salutation like '%"+searchText+"%' or"+
    	" LOPAPosition.searchFloor like '%"+searchText+"%' or"+
    	" LOPAPosition.searchZone like '%"+searchText+"%' or"+
    	" ROP.searchROP like '%"+searchText+"%' ";  
    }
    
 	sql+="GROUP BY Passenger.id ORDER BY classOrder, ropOrder, Passenger.bookingSeat ASC, Passenger.lastName ASC, Passenger.firstName ASC ";
    sql="SELECT * FROM ( "+sql+" ) WHERE paxLopa='"+flightId+"' AND upgrade IS NOT NULL AND isExpired='1' "+ "LIMIT "+limit+" OFFSET "+offset;
        
    var Detail = db.execute(sql); 
    var ListDupOrNot2 = [];
    var List=[];
    if (Detail != null) {
        while (Detail.isValidRow()) {

            var rop = "";
            if (Detail.fieldByName("ropTier") != null) {
                // rop = " " + Detail.fieldByName("ropTier");
               
                rop = Detail.fieldByName("ropTier");
                if(rop == "PLATINUM"){
                	rop = " Platinum";	
                } else if(rop == "GOLD"){
                	rop = " Gold";	
                }else if(rop == "SILVER"){
                	rop = " Silver";	
                }else if(rop == "BASIC"){
                	rop = " Basic";	
                }    
            } else if(Detail.fieldByName("hasROPEnroll") != null && Detail.fieldByName("hasROPEnroll").length > 0){
                rop = " Applied";
            }                   

            var passenger = {
                id : Detail.fieldByName("id") != null ? Detail.fieldByName("id") : "",
                rop : rop,
                name : (Detail.fieldByName("lastName") != null ? Detail.fieldByName("lastName") : "") + "   " + (Detail.fieldByName("firstName") != null ? Detail.fieldByName("firstName") : "")+ " " + (Detail.fieldByName("salutation") != null ? Detail.fieldByName("salutation") : ""),
                bookingSeat : Detail.fieldByName("bookingSeat") != null ? Detail.fieldByName("bookingSeat") : "",
                bookingClass : Detail.fieldByName("bookingClass") != null ? Detail.fieldByName("bookingClass") : "",
                floor : Detail.fieldByName("floor") != null ? Detail.fieldByName("floor") : "",
                offPoint : Detail.fieldByName("offPoint") != null ? Detail.fieldByName("offPoint") : "",
                isStaff : Detail.fieldByName("isStaff") != null ? Detail.fieldByName("isStaff") : "",
                zone : Detail.fieldByName("zone") != null ? Detail.fieldByName("zone") : "",
                salutation : Detail.fieldByName("salutation") != null ? Detail.fieldByName("salutation") : ""
                
            };
            
            List.push(passenger);
             
            Detail.next();
        }
        
        Detail.close();
    }
   	db.close();
    return List;  
};

exports.getPaxConnecting = function(flightId,offset,limit,searchText) {

var db = Ti.Database.open(Alloy.Globals.dbName);
 
var sql="SELECT LOPAPosition.flightId as fltLopa,"+
        "Passenger.flightId as paxLopa,"+
        "Passenger.conFlightSTD as std,"+
        "LOPAPosition.floor,LOPAPosition.zone,Passenger.id,"+"Passenger.salutation as salutation,"+
        "Passenger.lastName,Passenger.firstName,"+
        "Passenger.bookingSeat,Passenger.bookingClass,"+
        "Passenger.infantName,Passenger.infantAge,"+
        "Passenger.offPoint,Passenger.hasInfant, Passenger.searchInfant, Passenger.isStaff, ROP.ropTier, "+
        
        "Passenger.searchClass, Passenger.searchDest, Passenger.searchStaff, "+
        "Passenger.id,Passenger.paxKey,Passenger.accountId, "+
        "LOPAPosition.searchFloor,LOPAPosition.searchZone,"+
        "ROP.searchROP, Passenger.conFlightSegment, Passenger.conFlightNumber, Passenger.searchConDate, Passenger.searchConSTD,"+
        "ROPEnrollment.paxKey AS hasROPEnroll, "+
          
        "CASE WHEN Passenger.bookingClass = 'F' AND Passenger.bookingSeat IS NOT NULL  THEN 0 ELSE "+ "CASE WHEN Passenger.bookingClass = 'F' AND Passenger.bookingSeat IS NULL  THEN 1 ELSE "+ "CASE WHEN Passenger.bookingClass = 'C' AND Passenger.bookingSeat IS NOT NULL  THEN 2 ELSE "+     
        "CASE WHEN Passenger.bookingClass = 'C' AND Passenger.bookingSeat IS NULL  THEN 3 ELSE "+
         "CASE WHEN Passenger.bookingClass = 'U' AND Passenger.bookingSeat IS NOT NULL  THEN 4 ELSE "+
         "CASE WHEN Passenger.bookingClass = 'U' AND Passenger.bookingSeat IS NULL  THEN 5 ELSE "+
          "CASE WHEN Passenger.bookingClass = 'Y' AND Passenger.bookingSeat IS NOT NULL  THEN 6 ELSE "+
          "CASE WHEN Passenger.bookingClass = 'Y' AND Passenger.bookingSeat IS NULL  THEN 7 "+
          "ELSE NULL "+
        "END END END END END END END END AS classOrder " +
          
      // "ROP.ropTier "+
      "FROM Passenger "+
    "LEFT JOIN ROP ON Passenger.memberId=ROP.id  "+
    "LEFT JOIN ROPEnrollment ON (Passenger.id=ROPEnrollment.passengerId OR Passenger.paxKey=ROPEnrollment.paxKey OR Passenger.accountId=ROPEnrollment.accountId)  "+
    "left join LOPAPosition on LOPAPosition.position = Passenger.bookingSeat ";
    // "left join LOPAPosition on LOPAPosition.position=Passenger.bookingSeat or Passenger.bookingSeat is null ";
    
  if(searchText!=""){
     sql+="WHERE Passenger.firstName like '%"+searchText+"%' or"+
     " Passenger.lastName like '%"+searchText+"%' or"+
     " Passenger.bookingClass like '%"+searchText+"%' or"+
     " Passenger.bookingSeat like '%"+searchText+"%' or"+
     " LOPAPosition.floor like '%"+searchText+"%' or"+
     " LOPAPosition.zone like '%"+searchText+"%' or"+
     " Passenger.firstName like '%"+searchText+"%' or"+
     " Passenger.searchConSTD like '%"+searchText+"%' or"+
     " Passenger.conFlightSegment like '%"+searchText+"%' or"+
     " Passenger.conFlightNumber like '%"+searchText+"%' or"+
     " Passenger.searchConDate like '%"+searchText+"%' or"+
     
     " Passenger.searchClass like '%"+searchText+"%' or"+
     " Passenger.searchDest like '%"+searchText+"%' or"+
     " Passenger.searchInfant like '%"+searchText+"%' or"+
     " Passenger.searchStaff like '%"+searchText+"%' or"+
     " Passenger.salutation like '%"+searchText+"%' or"+
     " LOPAPosition.searchFloor like '%"+searchText+"%' or"+
     " LOPAPosition.searchZone like '%"+searchText+"%' or"+
     " ROP.searchROP like '%"+searchText+"%' ";    
    }
    
     sql+="GROUP BY Passenger.id ORDER BY std, classOrder, Passenger.bookingSeat ASC, Passenger.lastName ASC, Passenger.firstName ASC ";
     sql="SELECT * FROM ( "+sql+" ) WHERE paxLopa='"+flightId+"' AND std IS NOT NULL " + // and (fltLopa='"+flightId+"' or fltLopa is null)"+ 
    		"LIMIT "+limit+" OFFSET "+offset;
            
    var Detail = db.execute(sql); 
    var List=[];
    if (Detail != null) {
        while (Detail.isValidRow()) {

            var rop = "";
            if (Detail.fieldByName("ropTier") != null) {
                rop = Detail.fieldByName("ropTier");
                if(rop == "PLATINUM"){
                 rop = " Platinum"; 
                } else if(rop == "GOLD"){
                 rop = " Gold"; 
                }else if(rop == "SILVER"){
                 rop = " Silver"; 
                }else if(rop == "BASIC"){
                 rop = " Basic"; 
                }    
            } else if(Detail.fieldByName("hasROPEnroll") != null && Detail.fieldByName("hasROPEnroll").length > 0){
                rop = " Applied";
            }
            var passenger = {
                id : Detail.fieldByName("id") != null ? Detail.fieldByName("id") : "",
                rop : rop,
                name : (Detail.fieldByName("lastName") != null ? Detail.fieldByName("lastName") : "") + "   " + (Detail.fieldByName("firstName") != null ? Detail.fieldByName("firstName") : "")+ " " + (Detail.fieldByName("salutation") != null ? Detail.fieldByName("salutation") : ""),
                bookingSeat : Detail.fieldByName("bookingSeat") != null ? Detail.fieldByName("bookingSeat") : "",
                bookingClass : Detail.fieldByName("bookingClass") != null ? Detail.fieldByName("bookingClass") : "",
                floor : Detail.fieldByName("floor") != null ? Detail.fieldByName("floor") : "",
                zone : Detail.fieldByName("zone") != null ? Detail.fieldByName("zone") : "",
                
                infantName : Detail.fieldByName("infantName") != null ? Detail.fieldByName("infantName") : "",
                infantAge : Detail.fieldByName("infantAge") != null ? Detail.fieldByName("infantAge") : "",
                offPoint : Detail.fieldByName("offPoint") != null ? Detail.fieldByName("offPoint") : "",
                isStaff : Detail.fieldByName("isStaff") != null ? Detail.fieldByName("isStaff") : "",
                hasInfant : Detail.fieldByName("hasInfant") != null ? Detail.fieldByName("hasInfant") : "",
                conSTDtext : Detail.fieldByName("searchConSTD") != null ? Detail.fieldByName("searchConSTD") : "",
                conSegment : Detail.fieldByName("conFlightSegment") != null ? Detail.fieldByName("conFlightSegment") : "",
                conNumber : Detail.fieldByName("conFlightNumber") != null ? Detail.fieldByName("conFlightNumber") : "",
                conDate : Detail.fieldByName("searchConDate") != null ? Detail.fieldByName("searchConDate") : "",
                conSTD : Detail.fieldByName("std") != null ? Detail.fieldByName("std") : "",
                salutation : Detail.fieldByName("salutation") != null ? Detail.fieldByName("salutation") : "",
            };
            
            List.push(passenger);
         
            Detail.next();
        }
        Detail.close();
    }
            
    db.close();
    return List;
};

/* check compare */
/* try to code new logic here */
exports.getPsgRopListEdit = function(flightId) {
   var db = Ti.Database.open(Alloy.Globals.dbName);
    								 
   var Detail = db.execute("SELECT LOPAPosition.floor,LOPAPosition.zone,Passenger.id,Passenger.lastName,Passenger.firstName,Passenger.bookingSeat,Passenger.bookingClass,"+
    								"ROP.ropTier "+
    								"FROM Passenger "+
    								 "LEFT JOIN ROP ON Passenger.id=ROP.passengerId  "+
    								 "LEFT join LOPAPosition on LOPAPosition.position=Passenger.bookingSeat or Passenger.bookingSeat is null "+
    								 "WHERE Passenger.flightId=? and LOPAPosition.flightId=? "+ 
    								 "Order By Passenger.bookingSeat ASC,Passenger.LastName", flightId, flightId);
    								
    var ListDupOrNot2 = [];
    
    /* sort by ropTier: Plat Gold Sil Bas */
    var ListPlatinum = [];
    var ListGold = [];
    var ListSilver = [];
    var ListBasic = [];
    var ListRopTierNull = [];
    
    /* seat with no seat */
    var ListPlatinumNoSeat = [];
    var ListGoldNoSeat = [];
    var ListSilverNoSeat = [];
    var ListBasicNoSeat = [];
    var ListRopTierNullNoSeat = [];
    
    // for concat by ropTier
    var List1 = [];
    var List2 = [];
    var List3 = [];
    var ListRopTierALL = [];
    
    /* sort by class: F C U Y */
    var ListF = [];
    var ListFwithSeat = [];
    var ListFnoSeat = [];
    
    var ListC = [];
    var ListCwithSeat = [];
    var ListCnoSeat = [];
    
    var ListU = [];
    var ListUwithSeat = [];
    var ListUnoSeat = [];
    
    var ListY = [];
    var ListYwithSeat = [];
    var ListYnoSeat = [];
    
    /* for summary sort by Class + Seat */
   var ListClassSeatALL = [];
       
    /* for summary sort by ROP+ClassSeat */
   var List = [];
    
    var ListNull = [];
    if (Detail != null) {
        while (Detail.isValidRow()) {
            var rop = "";
            var ropId = "";
            if (Detail.fieldByName("ropTier") != null) {
                rop = "ROP " + Detail.fieldByName("ropTier");
                // ropId = Detail.fieldByName("passengerId"); //passengerId
            }

            var passenger = {
                id : Detail.fieldByName("id") != null ? Detail.fieldByName("id") : "",
                rop : rop,
                name : (Detail.fieldByName("lastName") != null ? Detail.fieldByName("lastName") : "") + " " + (Detail.fieldByName("firstName") != null ? Detail.fieldByName("firstName") : ""),
                bookingSeat : Detail.fieldByName("bookingSeat") != null ? Detail.fieldByName("bookingSeat") : "",
                bookingClass : Detail.fieldByName("bookingClass") != null ? Detail.fieldByName("bookingClass") : "",
                floor : Detail.fieldByName("floor") != null ? Detail.fieldByName("floor") : "",
                zone : Detail.fieldByName("zone") != null ? Detail.fieldByName("zone") : ""
            };
            
            /* try to check duplicate */
           if (ListDupOrNot2.indexOf(passenger.name)>= 0){
           }else if(List.indexOf(passenger.name) <0){
           		// List.push(passenger);
           		ListDupOrNot2.push(passenger);
           		
           		/*sort by ROP*/
           		if (Detail.fieldByName("ropTier") != null) {
           		// if (Detail.fieldByName("passengerId") != null) {
                	chkRop = Detail.fieldByName("ropTier");
          		  switch(chkRop){
               			 case "PLATINUM": 
               							 if(passenger.bookingSeat==""){
               								  ListPlatinumNoSeat.push(passenger);
               						      }else{
               								  ListPlatinum.push(passenger);
               							  }               							
               				  break;
                 				
               			  case "GOLD":   
               			               	  if(passenger.bookingSeat==""){
               								  ListGoldNoSeat.push(passenger);
               							  }else{
               								  ListGold.push(passenger);
               							  } 
               				  break;
               			  case "SILVER": 
               			               	  if(passenger.bookingSeat==""){
               								  ListSilverNoSeat.push(passenger);
               							  }else{
               								  ListSilver.push(passenger);
               							  } 
               				  break;
               			  case "BASIC":  
               			               	  if(passenger.bookingSeat==""){
               								  ListBasicNoSeat.push(passenger);
               							  }else{
               								  ListBasic.push(passenger);
               							  } 
               				  break;    		           				
               		  }
                	
            	}
            
           }
           
            Detail.next();
        }
        
        Detail.close();
    }
    
    // /* try to check List.length */
   
  /* try to concat ropTier: Plat+Gold+Sil+Bas + NoSeat */
  List1Basic = ListBasic.concat( ListBasicNoSeat );
  List2Silver = ListSilver.concat( ListSilverNoSeat );
  List3Gold = ListGold.concat( ListGoldNoSeat );
  List4Platinum = ListPlatinum.concat( ListPlatinumNoSeat );
  
    /* edit */
  	List01 = List2Silver.concat( List1Basic );
  	List02 = List3Gold.concat( List01 );
  	List = List4Platinum.concat( List02 );
	    
    db.close();
    return List;
};
	


/* try to edit here: to comment them all */
exports.getPassengerRopList = function(flightId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT LOPAPosition.floor,LOPAPosition.zone,Passenger.id,Passenger.lastName,Passenger.firstName,Passenger.bookingSeat,Passenger.bookingClass,ROP. ropTier "+
    								"FROM Passenger "+
    								"LEFT JOIN ROP ON Passenger.id=ROP.passengerId "+
    								"left join LOPAPosition on LOPAPosition.position=Passenger.bookingSeat "+
    								"WHERE Passenger.flightId=? and LOPAPosition.flightId=? "+
    								"Order by Passenger.bookingClass ASC ,Passenger.bookingSeat ASC", flightId, flightId);
    								
    var List = [];
    if (Detail != null) {
        var tempClass = {
            f : [{
                classes : "gold",
                List : []
            }, {
                classes : "platinum",
                List : []
            }, {
                classes : "silver",
                List : []
            }, {
                classes : "basic",
                List : []
            }],
            c : [{
                classes : "gold",
                List : []
            }, {
                classes : "platinum",
                List : []
            }, {
                classes : "silver",
                List : []
            }, {
                classes : "basic",
                List : []
            }],
            u : [{
                classes : "gold",
                List : []
            }, {
                classes : "platinum",
                List : []
            }, {
                classes : "silver",
                List : []
            }, {
                classes : "basic",
                List : []
            }],
            y : [{
                classes : "gold",
                List : []
            }, {
                classes : "platinum",
                List : []
            }, {
                classes : "silver",
                List : []
            }, {
                classes : "basic",
                List : []
            }]
        };

        while (Detail.isValidRow()) {

            if (Detail.fieldByName("ropTier") != null) {

                var rop = "";
                if (Detail.fieldByName("ropTier") != null) {
                    rop = " " + Detail.fieldByName("ropTier");
                }

                var passenger = {
                    id : Detail.fieldByName("id") != null ? Detail.fieldByName("id") : "",
                    rop : rop,
                    name : (Detail.fieldByName("firstName") != null ? Detail.fieldByName("firstName") : "") + " " + (Detail.fieldByName("lastName") != null ? Detail.fieldByName("lastName") : ""),
                    bookingSeat : Detail.fieldByName("bookingSeat") != null ? Detail.fieldByName("bookingSeat") : "",
                    bookingClass : Detail.fieldByName("bookingClass") != null ? Detail.fieldByName("bookingClass") : "",
                    floor : Detail.fieldByName("floor") != null ? Detail.fieldByName("floor") : "",
                    zone : Detail.fieldByName("zone") != null ? Detail.fieldByName("zone") : ""
                };

                if (passenger.bookingClass.toLowerCase() == "c") {
                    for ( i = 0; i < tempClass.c.length; i++) {
                        if (Detail.fieldByName("ropTier").toLowerCase() == tempClass.c[i].classes) {
                            tempClass.c[i].List.push(passenger);
                        }
                    }
                } else if (passenger.bookingClass.toLowerCase() == "y") {
                    for ( i = 0; i < tempClass.c.length; i++) {
                        if (Detail.fieldByName("ropTier").toLowerCase() == tempClass.c[i].classes) {
                            tempClass.c[i].List.push(passenger);
                        }
                    }
                } else if (passenger.bookingClass.toLowerCase() == "f") {
                    for ( i = 0; i < tempClass.f.length; i++) {
                        if (Detail.fieldByName("ropTier").toLowerCase() == tempClass.f[i].classes) {
                            tempClass.f[i].List.push(passenger);
                        }
                    }
                } else if (passenger.bookingClass.toLowerCase() == "u") {
                    for ( i = 0; i < tempClass.u.length; i++) {
                        if (Detail.fieldByName("ropTier").toLowerCase() == tempClass.u[i].classes) {
                            tempClass.u[i].List.push(passenger);
                        }
                    }
                }
            }
            Detail.next();
        }

        for ( i = 0; i < tempClass.f.length; i++) {
            if (tempClass.f[i].List.length > 0) {
                List = List.concat(tempClass.f[i].List);
            }
        }

        for ( i = 0; i < tempClass.c.length; i++) {
            if (tempClass.c[i].List.length > 0) {
                List = List.concat(tempClass.c[i].List);
            }
        }

        for ( i = 0; i < tempClass.u.length; i++) {
            if (tempClass.u[i].List.length > 0) {
                List = List.concat(tempClass.u[i].List);
            }
        }

        for ( i = 0; i < tempClass.y.length; i++) {
            if (tempClass.y[i].List.length > 0) {
                List = List.concat(tempClass.y[i].List);
            }
        }

		Detail.close();
    }
    
    db.close();

    return List;
};

exports.getZoneList = function(flightId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var callZone = db.execute('SELECT LOPAPosition FROM `LOPAPosition` JOIN LOPA on LOPAPosition.lopaId=LOPA.id where LOPA.flightId=? GROUP By LOPAPosition.zone ', flightId + "");

    if (callZone != null) {
        var Listzone = [];
        while (callZone.isValidRow()) {

            var zoneName = {
                name : callZone.fieldByName("zone")
            };
            Listzone.push(zoneName);
            callZone.next();
        }

        db.close();
        callZone.close();
        return Listzone;
    } else {
        db.close();
        return false;
    }
};

exports.getEquipmentLocationByZone = function(zone, flightId) {
	var db = Ti.Database.open(Alloy.Globals.dbName);
	var locations = [];
	var Details = db.execute("SELECT location FROM Equipment WHERE Equipment.zone=? AND flightId=? GROUP BY location",zone,flightId);
	if (Details != null){
		while(Details.isValidRow()){
			locations.push(Details.fieldByName("location") != null ? Details.fieldByName("location") : "");
			Details.next();
		}
		Details.close();
	}
	db.close();
	return locations;
};

exports.getEquipmentNameByZoneAndLocation = function(zone, location, flightId) {
	var db = Ti.Database.open(Alloy.Globals.dbName);
	var List = [];
	var Details = db.execute("SELECT sfdcId, name, description, cPro, total, quantity FROM Equipment WHERE Equipment.zone=? AND Equipment.location=? AND Equipment.flightId=?",zone ,location, flightId);
	if(Details != null){
		while(Details.isValidRow()){
			var equipment = {
				sfdcId : Details.fieldByName("sfdcId") != null ? Details.fieldByName("sfdcId") : "",
				name : Details.fieldByName("name") != null ? Details.fieldByName("name") : "",
				desc : Details.fieldByName("description") != null ? Details.fieldByName("description") : "",
				crewCheck : Details.fieldByName("cPro") != null ? Details.fieldByName("cPro") : "",
				total : Details.fieldByName("total") != null ? Details.fieldByName("total") : "",
				quantity : Details.fieldByName("quantity") != null ? Details.fieldByName("quantity") : ""
			};
			List.push(equipment);
			Details.next();
		}
		Details.close();
	}
	db.close();
	return List;
};

exports.getEquipmentZoneList = function() {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var zone = db.execute('SELECT DISTINCT zone FROM Equipment JOIN Flight ON Equipment.acDesc=Flight.aircraftRegistration WHERE Flight.id=? AND zone IS NOT null AND zone <> "" AND zone <> "-" ORDER BY zone ASC ', currentFlightId );
	var zoneList = [];
    if (zone != null) {
        while (zone.isValidRow()) {
            var zoneName=zone.fieldByName("zone")!=null ? zone.fieldByName("zone") : "";
            zoneList.push(zoneName);
            zone.next();
        } 
    }
    db.close();
    zone.close();
    return zoneList;
     
};

exports.getSafetyEquipmentsByZone = function(zone) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var equipment = db.execute('SELECT Equipment.sfdcId,Equipment.name,Equipment.ataChapter,Equipment.zone,Equipment.location FROM Equipment WHERE Equipment.zone=? AND Equipment.flightId=? ORDER BY name ASC ', zone, currentFlightId);
    var List = [];
    if (equipment != null) {
        while (equipment.isValidRow()) {
            var part = db.execute('SELECT sfdcId from EquipmentPart where EquipmentPart.equipmentId=? limit 1', equipment.fieldByName("sfdcId"));
            var havePart = false;
            if (part != null) {
                havePart = part.isValidRow();
            }

            var equipmentData = {
                id : equipment.fieldByName("sfdcId") != null ? equipment.fieldByName("sfdcId") : "",
                name : equipment.fieldByName("name") != null ? equipment.fieldByName("name") : "",
                ataChapter : equipment.fieldByName("ataChapter") != null ? equipment.fieldByName("ataChapter") : "",
                zone : equipment.fieldByName("zone") != null ? equipment.fieldByName("zone") : "",
                location : equipment.fieldByName("location") != null ? equipment.fieldByName("location") : "",
                havePart : havePart
            };
            List.push(equipmentData);
            equipment.next();
        }
    }
    equipment.close();
    db.close();
    return List;
};

exports.getEquipmentTypeByPosition = function(positionArg) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var type = null;
    var equipment = db.execute('SELECT type FROM LOPAPosition WHERE position=? AND flightId=?', 
                                !utility.isEmpty(positionArg) ? positionArg : "Empty", 
                                !utility.isEmpty(currentFlightId) ? currentFlightId : "Empty" 
                              );

    if (equipment != null) {
        if (equipment.isValidRow()) {
            type = equipment.fieldByName("type") != null ? equipment.fieldByName("type") : "";
        }
    }
    
    equipment.close();
    db.close();
    return type;
};

exports.getServiceEquipments = function(typeFilterText) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var sql = "SELECT DISTINCT Equipment.sfdcId,Equipment.name,Equipment.ataChapter,Equipment.zone,Equipment.location, CASE WHEN  zone == '-' OR (zone IS NULL AND location IS NOT NULL) THEN  1 ELSE 0 END AS other FROM Equipment WHERE flightId=? AND (zone IS NULL OR zone == '-') AND type LIKE '%"+typeFilterText+"%' ORDER BY name ASC";
    var equipment = db.execute(sql, currentFlightId);
 
    var List = [];
    var OtherEquipments = [];
    if (equipment != null) {
        while (equipment.isValidRow()) {
            var part = db.execute('SELECT sfdcId from EquipmentPart where EquipmentPart.equipmentId=? limit 1', equipment.fieldByName("sfdcId"));
            var havePart = false;
            if (part != null) {
                havePart = part.isValidRow();
            }
            if(!equipment.fieldByName("other")) {
                var equipmentData = {
                    id : equipment.fieldByName("sfdcId") != null ? equipment.fieldByName("sfdcId") : "",
                    name : equipment.fieldByName("name") != null ? equipment.fieldByName("name") : "",
                    ataChapter : equipment.fieldByName("ataChapter") != null ? equipment.fieldByName("ataChapter") : "",
                    zone : equipment.fieldByName("zone") != null ? equipment.fieldByName("zone") : "",
                    location : equipment.fieldByName("location") != null ? equipment.fieldByName("location") : "",
                    havePart : havePart,
                };                
                List.push(equipmentData);
            } else {
                var otherEquipment = {
                    id : equipment.fieldByName("sfdcId") != null ? equipment.fieldByName("sfdcId") : "",
                    name : equipment.fieldByName("name") != null ? equipment.fieldByName("name") : "",
                    ataChapter : equipment.fieldByName("ataChapter") != null ? equipment.fieldByName("ataChapter") : "",
                    zone : equipment.fieldByName("zone") != null ? equipment.fieldByName("zone") : "",
                    location : equipment.fieldByName("location") != null ? equipment.fieldByName("location") : "",
                    havePart : true,
                };      
                OtherEquipments.push(otherEquipment);                          
            }
            equipment.next();
        }
        List.push(OtherEquipments);
    }
    equipment.close();
    db.close();
    return List;
};

exports.getEquipmentPartByEquipmentId = function(equipmentId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT sfdcId,name FROM EquipmentPart WHERE equipmentId= ? AND flightId=?", 
    						   !utility.isEmpty(equipmentId) ? equipmentId : "Empty", 
    						   !utility.isEmpty(currentFlightId) ? currentFlightId : "Empty"
    						);
    var List = [];
    if (Detail != null) {
	    while (Detail.isValidRow()) {
	        var part = {
	            id : Detail.fieldByName("sfdcId"),
	            name : Detail.fieldByName("name")
	        };
	
	        List.push(part);
	        Detail.next();
	    }
	    Detail.close();
	}
    db.close();
    return List;
};

exports.getEquipmentPart = function(partId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT sfdcId,name FROM EquipmentPart WHERE sfdcId= ? AND flightId=? ", partId + "", currentFlightId);
    if (Detail != null) {
        var part = {
            id : Detail.fieldByName("sfdcId"),
            name : Detail.fieldByName("name")
        };
        Detail.close();
    }
    db.close();
    return part;
};

exports.getEquipmentDetailById = function(equipmentId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT sfdcId,name,type,ataChapter FROM Equipment WHERE sfdcId= ? AND flightId=?", 
    							!utility.isEmpty(equipmentId) ? equipmentId : "Empty", 
    							!utility.isEmpty(currentFlightId) ? currentFlightId : "Empty"
    						);
    if (Detail != null) {
	    var equipment = {
	        id : Detail.fieldByName("sfdcId"),
	        name : Detail.fieldByName("name"),
	        type : Detail.fieldByName("type"),
	        ataChapter : Detail.fieldByName("ataChapter"),
	    };
	    Detail.close();
	}
    db.close();
    return equipment;
};

exports.getConditionList = function() {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT DISTINCT name FROM Condition ORDER BY name ASC");
    var List = [];
    if (Detail != null) {
	    while (Detail.isValidRow()) {
	        var dataDetail = {
	            name : Detail.fieldByName("name"),	
	        };
	        List.push(dataDetail);
	        Detail.next();
	    }
	    Detail.close();
	}
    db.close();
    return List;
};

exports.getEmergencyList = function(flightId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT Emergency.id,Emergency.emergencyType FROM `Emergency` left join EquipmentAndEmergencyCategory on EquipmentAndEmergencyCategory.id=Emergency.equipmentAndEmergencyCateId WHERE EquipmentAndEmergencyCategory.flightId=? ", flightId + "");
    var List = [];
    if (Detail != null) {
	    while (Detail.isValidRow()) {
	        var dataDetail = {
	            id : Detail.fieldByName("id"),
	            name : Detail.fieldByName("emergencyType")
	        };
	
	        List.push(dataDetail);
	        Detail.next();
	    }
	
	    Detail.close();
	}
    db.close();
    return List;
};

exports.getEmergencyDetail = function(EmergencyId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT id,emergencyType FROM `Emergency`  WHERE id=? ", EmergencyId + "");
	var dataDetail;
	if (Detail != null) {
	    dataDetail = {
	        id : Detail.fieldByName("id"),
	        emergencyType : Detail.fieldByName("emergencyType")
	    };
	
	    Detail.close();
	}
    db.close();
    return dataDetail;
};

exports.getwebLink = function(flightId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute("SELECT linkToSystem FROM `EDocument` WHERE flightId=? ", flightId + "");
	
	var dataDetail;
	if (Detail != null) {
	    dataDetail = {
	        linkToSystem : Detail.fieldByName("linkToSystem")
	    };
	
	    Detail.close();
	}
    db.close();
    return dataDetail;
};

exports.getSSRList = function(FlightId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);

    var Detail = db.execute("SELECT SSR.id,SSR.passengerId,Passenger.firstName,Passenger.bookingSeat,Passenger.lastName,SSR.type,SSR.remark,SSR.status,SSR.service FROM SSR left join Passenger on SSR.passengerId=Passenger.id WHERE Passenger.flightId= ?  ", FlightId + "");
    var List = [];
	if (Detail != null) {
	    while (Detail.isValidRow()) {
	
	        var SSR = {
	            id : Detail.fieldByName("id"),
	            passengerId : Detail.fieldByName("passengerId"),
	            passengerName : Detail.fieldByName("lastName") + "  " + Detail.fieldByName("firstName"),
	            type : Detail.fieldByName("type"),
	            remark : Detail.fieldByName("remark"),
	            status : Detail.fieldByName("status"),
	            service : Detail.fieldByName("service"),
	            seat : Detail.fieldByName("bookingSeat")
	        };
	
	        List.push(SSR);
	        Detail.next();
	    }
	    Detail.close();
	}
    db.close();
    return List;
};

exports.getSpecialMeal = function(FlightId, legNumber) {
    var db = Ti.Database.open(Alloy.Globals.dbName);

    var Detail = db.execute("SELECT SSR.id,SSR.passengerId,Passenger.firstName,Passenger.lastName,Passenger.bookingSeat,SSR.type,SSR.remark,SSR.status,SSR.service FROM SSR left join Passenger on SSR.passengerId=Passenger.id WHERE Passenger.flightId= ? and Passenger.legNumber=? and SSR.ssrType=?", FlightId + "", legNumber + "", "specialMeal");
    var List = [];
	
	if (Detail != null) {
	    while (Detail.isValidRow()) {
	
	        var SSR = {
	        	
	            id : Detail.fieldByName("id"),
	            passengerId : Detail.fieldByName("passengerId"),
	            passengerName : Detail.fieldByName("firstName") + "  " + Detail.fieldByName("lastName"),
	            type : Detail.fieldByName("type"),
	            remark : Detail.fieldByName("remark"),
	            status : Detail.fieldByName("status"),
	            service : Detail.fieldByName("service"),
	            seat : Detail.fieldByName("bookingSeat")
	        };
	
	        List.push(SSR);
	        Detail.next();
	    }
	    Detail.close();
	}
    db.close();
    return List;
};

exports.getRouteInformation = function(FlightId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);

    var Detail = db.execute("SELECT RouteInformation.id,RouteInformation.routeInformationPath FROM RouteInformation left join EDocument on RouteInformation.eDocumentId=EDocument.id WHERE EDocument.flightId= ? ", FlightId + "");
    var List = [];
    if (Detail != null) {
	    while (Detail.isValidRow()) {
	
	        var data = {
	            id : Detail.fieldByName("id"),
	            routeInformationPath : Detail.fieldByName("routeInformationPath")
	        };
	        List.push(data);
	        Detail.next();
	    }
	    Detail.close();
	}
    db.close();
    return List;
};

exports.getCrewProcedure = function(FlightId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);

    var Detail = db.execute("SELECT CrewProcedure.id,CrewProcedure.crewProcedurePath FROM CrewProcedure left join EDocument on CrewProcedure.eDocumentId=EDocument.id WHERE EDocument.flightId= ? ", FlightId + "");
    var List = [];
    if (Detail != null) {
	    while (Detail.isValidRow()) {
	
	        var data = {
	            id : Detail.fieldByName("id"),
	            crewProcedurePath : Detail.fieldByName("crewProcedurePath")
	        };
	        List.push(data);
	        Detail.next();
	    }
	    Detail.close();
	}
    db.close();
    return List;
};

exports.getFoodAndBeverage = function(FlightId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);

    var Detail = db.execute("SELECT FoodAndBeverage.id,FoodAndBeverage.foodAndBeveragePath FROM FoodAndBeverage left join EDocument on FoodAndBeverage.eDocumentId=EDocument.id WHERE EDocument.flightId= ? ", FlightId + "");
    var List = [];
    if (Detail != null) {
	    while (Detail.isValidRow()) {
	
	        var data = {
	            id : Detail.fieldByName("id"),
	            foodAndBeveragePath : Detail.fieldByName("foodAndBeveragePath")
	        };
	        List.push(data);
	        Detail.next();
	    }
	    Detail.close();
	}
    db.close();
    return List;
};

exports.getRequirement = function(FlightId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);

    var Detail = db.execute("SELECT Requirement.id,Requirement.requirementPath FROM Requirement left join EDocument on Requirement.eDocumentId=EDocument.id WHERE EDocument.flightId= ? ", FlightId + "");
    var List = [];
    if (Detail != null) {
	    while (Detail.isValidRow()) {
	
	        var data = {
	            id : Detail.fieldByName("id"),
	            requirementPath : Detail.fieldByName("requirementPath")
	        };
	        List.push(data);
	        Detail.next();
	    }
	    Detail.close();
	}
    db.close();
    return List;
};

exports.getManual = function(FlightId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);

    var Detail = db.execute("SELECT Manual.id,Manual.manualPath FROM Manual left join EDocument on Manual.eDocumentId=EDocument.id WHERE EDocument.flightId= ? ", FlightId + "");
    var List = [];
    if (Detail != null) {
	    while (Detail.isValidRow()) {
	
	        var data = {
	            id : Detail.fieldByName("id"),
	            manualPath : Detail.fieldByName("manualPath")
	        };
	        List.push(data);
	        Detail.next();
	    }
	    Detail.close();
	}
    db.close();
    return List;
};

exports.getPassengerPsychology = function(accountId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var DetailPsy = db.execute("SELECT PassengerPsychology.like , PassengerPsychology.dislike , PassengerPsychology.other , PassengerPsychology.bySale , PassengerPsychology.byGround , PassengerPsychology.accountId "+
    							"FROM PassengerPsychology "+
    							"WHERE accountId = ?",accountId);
    if (DetailPsy != null && DetailPsy.isValidRow()) {
        var data = {
            like : DetailPsy.fieldByName("like") != null ? DetailPsy.fieldByName("like") : "",
            disLike : DetailPsy.fieldByName("dislike") != null ? DetailPsy.fieldByName("dislike") : "",
            other : DetailPsy.fieldByName("other") != null ? DetailPsy.fieldByName("other") : "",
            bySale : DetailPsy.fieldByName("bySale") != null ? DetailPsy.fieldByName("bySale") : "",
            byGround : DetailPsy.fieldByName("byGround") != null ? DetailPsy.fieldByName("byGround") : "",
            accountId : DetailPsy.fieldByName("accountId") != null ? DetailPsy.fieldByName("accountId") : "",
        };
        DetailPsy.close();
        db.close();
        return data;
    } else {
        db.close();
        return false;
    }

};

exports.getLOPA = function(flightId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var lopaRs = db.execute("SELECT id, flightId, legId, maxColumn, maxRow, class, floor, zone FROM LOPA WHERE flightId= ?", flightId);
    var lopaValues = [];
    if (lopaRs != null) {
	    while (lopaRs.isValidRow()) {
	        var lopaValue = {
	
	            id : lopaRs.fieldByName("id") != null ? lopaRs.fieldByName("id") : "",
	            flightId : lopaRs.fieldByName("flightId") != null ? lopaRs.fieldByName("flightId") : "",
	            legId : lopaRs.fieldByName("legId") != null ? lopaRs.fieldByName("legId") : "",
	            maxColumn : lopaRs.fieldByName("maxColumn") != null ? lopaRs.fieldByName("maxColumn") : "",
	            maxRow : lopaRs.fieldByName("maxRow") != null ? lopaRs.fieldByName("maxRow") : "",
	            cclass : lopaRs.fieldByName("class") != null ? lopaRs.fieldByName("class") : "",
	            floor : lopaRs.fieldByName("floor") != null ? lopaRs.fieldByName("floor") : "",
	            zone : lopaRs.fieldByName("zone") != null ? lopaRs.fieldByName("zone") : "",
	
	        };
	        lopaValues.push(lopaValue);
	        lopaRs.next();
	    }
	    lopaRs.close();
	}
	
    db.close();
    return lopaValues;
};

exports.getLOPAbyFlightIdFloorZone = function(flightIdArg, floorArg, zoneArg) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var lopaRs = db.execute("SELECT id, flightId, legId, maxColumn, maxRow, class, floor, zone FROM LOPA WHERE flightId=? AND floor=? AND zone=?", flightIdArg, floorArg, zoneArg);
    var lopaValues = [];
    if (lopaRs != null) {
        while (lopaRs.isValidRow()) {
            var lopaValue = {
    
                id : lopaRs.fieldByName("id") != null ? lopaRs.fieldByName("id") : "",
                flightId : lopaRs.fieldByName("flightId") != null ? lopaRs.fieldByName("flightId") : "",
                legId : lopaRs.fieldByName("legId") != null ? lopaRs.fieldByName("legId") : "",
                maxColumn : lopaRs.fieldByName("maxColumn") != null ? lopaRs.fieldByName("maxColumn") : "",
                maxRow : lopaRs.fieldByName("maxRow") != null ? lopaRs.fieldByName("maxRow") : "",
                cclass : lopaRs.fieldByName("class") != null ? lopaRs.fieldByName("class") : "",
                floor : lopaRs.fieldByName("floor") != null ? lopaRs.fieldByName("floor") : "",
                zone : lopaRs.fieldByName("zone") != null ? lopaRs.fieldByName("zone") : "",
    
            };
            
            lopaValues.push(lopaValue);
            lopaRs.next();
        }
        lopaRs.close();
    }
    
    db.close();
    return lopaValues;
};


exports.getLOPAByLOPAId = function(lopaId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var lopaRs = db.execute("SELECT id, flightId, legId, maxColumn, maxRow, class, floor, zone FROM LOPA WHERE id= ?", lopaId);
    var lopaValues = [];
    if (lopaRs != null) {
	    while (lopaRs.isValidRow()) {
	        var lopaValue = {
	
	            id : lopaRs.fieldByName("id") != null ? lopaRs.fieldByName("id") : "",
	            flightId : lopaRs.fieldByName("flightId") != null ? lopaRs.fieldByName("flightId") : "",
	            legId : lopaRs.fieldByName("legId") != null ? lopaRs.fieldByName("legId") : "",
	            maxColumn : lopaRs.fieldByName("maxColumn") != null ? lopaRs.fieldByName("maxColumn") : "",
	            maxRow : lopaRs.fieldByName("maxRow") != null ? lopaRs.fieldByName("maxRow") : "",
	            cclass : lopaRs.fieldByName("class") != null ? lopaRs.fieldByName("class") : "",
	            floor : lopaRs.fieldByName("floor") != null ? lopaRs.fieldByName("floor") : "",
	            zone : lopaRs.fieldByName("zone") != null ? lopaRs.fieldByName("zone") : "",
	
	        };
	        lopaValues.push(lopaValue);
	        lopaRs.next();
	    }
	    lopaRs.close();
	}
	
    db.close();
    return lopaValues;
};

exports.getMaxMinRow = function() {
	
	var db = Ti.Database.open(Alloy.Globals.dbName);
	var lopaPositionRs = db.execute("SELECT Min(rowL) AS minRow, Max(rowL) AS maxRow FROM LOPAPosition WHERE flightId=? and type='seat' GROUP BY lopaId ORDER BY floor DESC", currentFlightId);
    var lopaPositionValues = [];
    if (lopaPositionRs != null) {
	    while (lopaPositionRs.isValidRow()) {
	        var lopaPositionValue = {
	            maxRow : lopaPositionRs.fieldByName("maxRow") != null ? lopaPositionRs.fieldByName("maxRow") : "",
	            minRow : lopaPositionRs.fieldByName("minRow") != null ? lopaPositionRs.fieldByName("minRow") : "",
	        };
	        
	        if(lopaPositionValue.maxRow != null && lopaPositionValue.minRow != null){
	        	//lopaPositionValue.maxRow = lopaPositionValue.maxRow.substring(0, lopaPositionValue.maxRow.length - 1);
	        	//lopaPositionValue.minRow = lopaPositionValue.minRow.substring(0, lopaPositionValue.minRow.length - 1);
	        	lopaPositionValues.push(lopaPositionValue);
	        }
	        lopaPositionRs.next();
	    }
	    lopaPositionRs.close();
	}
	
    db.close();
    return lopaPositionValues;

};

exports.getLOPAPosition = function(lopa) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var lopaPositionRs = db.execute("SELECT * FROM LOPAPosition WHERE lopaId= ?", lopa);
    var lopaPositionValues = [];
    if (lopaPositionRs != null) {
	    while (lopaPositionRs.isValidRow()) {
	        var lopaPositionValue = {
	
	            id : lopaPositionRs.fieldByName("id") != null ? lopaPositionRs.fieldByName("id") : "",
	            lopaId : lopaPositionRs.fieldByName("lopaId") != null ? lopaPositionRs.fieldByName("lopaId") : "",
	            type : lopaPositionRs.fieldByName("type") != null ? lopaPositionRs.fieldByName("type") : "",
	            row : lopaPositionRs.fieldByName("row") != null ? lopaPositionRs.fieldByName("row") : "",
	            column : lopaPositionRs.fieldByName("column") != null ? lopaPositionRs.fieldByName("column") : "",
	            position : lopaPositionRs.fieldByName("position") != null ? lopaPositionRs.fieldByName("position") : "",
	            compareDesignator : lopaPositionRs.fieldByName("compareDesignator") != null ? lopaPositionRs.fieldByName("compareDesignator") : "",
	            compareDetail : lopaPositionRs.fieldByName("compareDetail") != null ? lopaPositionRs.fieldByName("compareDetail") : "",
	            visibleFlag : lopaPositionRs.fieldByName("visibleFlag") != null ? lopaPositionRs.fieldByName("visibleFlag") : "",
	            status : lopaPositionRs.fieldByName("status") != null ? lopaPositionRs.fieldByName("status") : "",
	            cclass : lopaPositionRs.fieldByName("class") != null ? lopaPositionRs.fieldByName("class") : "",
	            floor : lopaPositionRs.fieldByName("floor") != null ? lopaPositionRs.fieldByName("floor") : "",
	            zone : lopaPositionRs.fieldByName("zone") != null ? lopaPositionRs.fieldByName("zone") : "",
	            width : lopaPositionRs.fieldByName("width") != null ? lopaPositionRs.fieldByName("width") : "",
	            height : lopaPositionRs.fieldByName("height") != null ? lopaPositionRs.fieldByName("height") : "",
                newStatus : lopaPositionRs.fieldByName("newStatus") != null ? lopaPositionRs.fieldByName("newStatus") : "",
                rowL : lopaPositionRs.fieldByName("rowL") != null ? lopaPositionRs.fieldByName("rowL") : "",
                colL : lopaPositionRs.fieldByName("colL") != null ? lopaPositionRs.fieldByName("colL") : ""
                    	
	        };
	        lopaPositionValues.push(lopaPositionValue);
	        lopaPositionRs.next();
	    }
	    lopaPositionRs.close();
	}
	
    db.close();
    return lopaPositionValues;
};

exports.getLOPAPositionForPicklist = function() {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var lopaPositionRs = db.execute("SELECT id, lopaId, position, class, floor, zone,LENGTH(position) as lengthPosition FROM LOPAPosition Where flightId=? order by lengthPosition ASC,position ASC",currentFlightId);
    var lopaPositionValues = [];

    if (lopaPositionRs != null) {
        while (lopaPositionRs.isValidRow()) {
            var lopaPositionValue = {
                id : lopaPositionRs.fieldByName("id"),
                lopaId : lopaPositionRs.fieldByName("lopaId"),
                position : lopaPositionRs.fieldByName("position"),
                cclass : lopaPositionRs.fieldByName("class"),
                floor : lopaPositionRs.fieldByName("floor"),
                zone : lopaPositionRs.fieldByName("zone"),
            };
            lopaPositionValues.push(lopaPositionValue);
            lopaPositionRs.next();
        }
        lopaPositionRs.close();
    }
    db.close();
    return lopaPositionValues;
};

exports.getLOPAPositionByBookingSeat = function(bookingSeat) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var lopaPositionRs = db.execute("SELECT id, lopaId FROM LOPAPosition WHERE position=? AND flightId=?", bookingSeat, currentFlightId);
    var lopaPositionValues = [];

    if (lopaPositionRs != null) {
        while (lopaPositionRs.isValidRow()) {
            var lopaPositionValue = {
                id : lopaPositionRs.fieldByName("id"),
                lopaId : lopaPositionRs.fieldByName("lopaId"),
            };
            lopaPositionValues.push(lopaPositionValue);
            lopaPositionRs.next();
        }
        lopaPositionRs.close();
    }
    db.close();
    return lopaPositionValues;
};

exports.getLOPAIdByClass = function(bookingClass) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var lopaPositionRs = db.execute("SELECT id, lopaId FROM LOPAPosition WHERE class=? AND flightId=?", bookingClass, currentFlightId);
    var lopaPositionValues = [];

    if (lopaPositionRs != null) {
        while (lopaPositionRs.isValidRow()) {
            var lopaPositionValue = {
                id : lopaPositionRs.fieldByName("id"),
                lopaId : lopaPositionRs.fieldByName("lopaId"),
            };
            lopaPositionValues.push(lopaPositionValue);
            lopaPositionRs.next();
        }
        lopaPositionRs.close();
    }
    db.close();
    return lopaPositionValues;
};


exports.getLOPAPositionDetailByLopaId = function(lopaId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var lopaPositionRs = db.execute("SELECT * FROM LOPAPosition WHERE id=?", lopaId);
    var lopaPositionValues = [];

    if (lopaPositionRs != null) {
        if (lopaPositionRs.isValidRow()) {
            var lopaPositionValue = {
                id : lopaPositionRs.fieldByName("id") != null ? lopaPositionRs.fieldByName("id") : "",
                lopaId : lopaPositionRs.fieldByName("lopaId") != null ? lopaPositionRs.fieldByName("lopaId") : "",
                type : lopaPositionRs.fieldByName("type") != null ? lopaPositionRs.fieldByName("type") : "",
                row : lopaPositionRs.fieldByName("row") != null ? lopaPositionRs.fieldByName("row") : "",
                column : lopaPositionRs.fieldByName("column") != null ? lopaPositionRs.fieldByName("column") : "",
                position : lopaPositionRs.fieldByName("position") != null ? lopaPositionRs.fieldByName("position") : "",
                compareDesignator : lopaPositionRs.fieldByName("compareDesignator") != null ? lopaPositionRs.fieldByName("compareDesignator") : "",
                compareDetail : lopaPositionRs.fieldByName("compareDetail") != null ? lopaPositionRs.fieldByName("compareDetail") : "",
                visibleFlag : lopaPositionRs.fieldByName("visibleFlag") != null ? lopaPositionRs.fieldByName("visibleFlag") : "",
                status : lopaPositionRs.fieldByName("status") != null ? lopaPositionRs.fieldByName("status") : "",
                cclass : lopaPositionRs.fieldByName("class") != null ? lopaPositionRs.fieldByName("class") : "",
                floor : lopaPositionRs.fieldByName("floor") != null ? lopaPositionRs.fieldByName("floor") : "",
                zone : lopaPositionRs.fieldByName("zone") != null ? lopaPositionRs.fieldByName("zone") : "",
            };
        }
        lopaPositionRs.close();
    }
    db.close();
    return lopaPositionValue;
};

exports.getLOPAClassByLopaId = function(lopaId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var lopaPositionRs = db.execute("SELECT * FROM LOPAPosition WHERE LOPAPosition.class IS NOT NULL AND LOPAPosition.lopaId=?", lopaId);
    var lopaPositionValues = [];

    if (lopaPositionRs != null) {
        if (lopaPositionRs.isValidRow()) {
            var lopaPositionValue = {
                id : lopaPositionRs.fieldByName("id") != null ? lopaPositionRs.fieldByName("id") : "",
                lopaId : lopaPositionRs.fieldByName("lopaId") != null ? lopaPositionRs.fieldByName("lopaId") : "",
                type : lopaPositionRs.fieldByName("type") != null ? lopaPositionRs.fieldByName("type") : "",
                row : lopaPositionRs.fieldByName("row") != null ? lopaPositionRs.fieldByName("row") : "",
                column : lopaPositionRs.fieldByName("column") != null ? lopaPositionRs.fieldByName("column") : "",
                position : lopaPositionRs.fieldByName("position") != null ? lopaPositionRs.fieldByName("position") : "",
                compareDesignator : lopaPositionRs.fieldByName("compareDesignator") != null ? lopaPositionRs.fieldByName("compareDesignator") : "",
                compareDetail : lopaPositionRs.fieldByName("compareDetail") != null ? lopaPositionRs.fieldByName("compareDetail") : "",
                visibleFlag : lopaPositionRs.fieldByName("visibleFlag") != null ? lopaPositionRs.fieldByName("visibleFlag") : "",
                status : lopaPositionRs.fieldByName("status") != null ? lopaPositionRs.fieldByName("status") : "",
                cclass : lopaPositionRs.fieldByName("class") != null ? lopaPositionRs.fieldByName("class") : "",
                floor : lopaPositionRs.fieldByName("floor") != null ? lopaPositionRs.fieldByName("floor") : "",
                zone : lopaPositionRs.fieldByName("zone") != null ? lopaPositionRs.fieldByName("zone") : "",
            };
        }
        lopaPositionRs.close();
    }
    db.close();
    return lopaPositionValue;
};


exports.getLOPAPositionStatus = function(positionArg) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var lopaPositionRs = db.execute("SELECT status FROM LOPAPosition WHERE position=? AND flightId=?", positionArg, currentFlightId);
    var status = "1";

    if (lopaPositionRs != null) {
        if (lopaPositionRs.isValidRow()) {
            status = lopaPositionRs.fieldByName("status") != null ? lopaPositionRs.fieldByName("status") : "";
        }
        lopaPositionRs.close();
    }
    db.close();
    return status;
};

exports.getFlightAll = function() {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var flightRs = db.execute("SELECT id, flightNumber, flightDateUTC, flightDateLT, origin, destination, legNumber, aircraftType, aircraftConfiguration, aircraftRegistration, departureStation, arrivalStation, STD, STA, ETD, ETA, flyingTime, gate, nextFlightNumber, nextFlightDateTime, departureDate, lastModified, lastSync, airModel FROM Flight");
    var flightValue = '';
    if (flightRs != null) {
	    if (flightRs.isValidRow()) {
	        flightValue = {
	        	
	           	id : flightRs.fieldByName("id") != null ? flightRs.fieldByName("id") : "",
	           	flightNumber : flightRs.fieldByName("flightNumber") != null ? flightRs.fieldByName("flightNumber") : "",
	           	flightDateUTC : flightRs.fieldByName("flightDateUTC") != null ? flightRs.fieldByName("flightDateUTC") : "",
	           	flightDateLT : flightRs.fieldByName("flightDateLT") != null ? flightRs.fieldByName("flightDateLT") : "",
	           	origin : flightRs.fieldByName("origin") != null ? flightRs.fieldByName("origin") : "",
	           	destination : flightRs.fieldByName("destination") != null ? flightRs.fieldByName("destination") : "",
	           	legNumber : flightRs.fieldByName("legNumber") != null ? flightRs.fieldByName("legNumber") : "",
	           	aircraftType : flightRs.fieldByName("aircraftType") != null ? flightRs.fieldByName("aircraftType") : "",
	           	aircraftConfiguration : flightRs.fieldByName("aircraftConfiguration") != null ? flightRs.fieldByName("aircraftConfiguration") : "",
	           	aircraftRegistration : flightRs.fieldByName("aircraftRegistration") != null ? flightRs.fieldByName("aircraftRegistration") : "",
	           	arrivalStation : flightRs.fieldByName("arrivalStation") != null ? flightRs.fieldByName("arrivalStation") : "",
	           	STD : flightRs.fieldByName("STD") != null ? flightRs.fieldByName("STD") : "",
	           	STA : flightRs.fieldByName("STA") != null ? flightRs.fieldByName("STA") : "",
	           	ETD : flightRs.fieldByName("ETD") != null ? flightRs.fieldByName("ETD") : "",
	           	ETA : flightRs.fieldByName("ETA") != null ? flightRs.fieldByName("ETA") : "",
	           	flyingTime : flightRs.fieldByName("flyingTime") != null ? flightRs.fieldByName("flyingTime") : "",
	           	gate : flightRs.fieldByName("gate") != null ? flightRs.fieldByName("gate") : "",
	           	nextFlightNumber : flightRs.fieldByName("nextFlightNumber") != null ? flightRs.fieldByName("nextFlightNumber") : "",
	           	nextFlightDateTime : flightRs.fieldByName("nextFlightDateTime") != null ? flightRs.fieldByName("nextFlightDateTime") : "",
	           	departureDate : flightRs.fieldByName("departureDate") != null ? flightRs.fieldByName("departureDate") : "",
	           	lastModified : flightRs.fieldByName("lastModified") != null ? flightRs.fieldByName("lastModified") : "",
	           	lastSync : flightRs.fieldByName("lastSync") != null ? flightRs.fieldByName("lastSync") : "",
	           	airModel : flightRs.fieldByName("airModel") != null ? flightRs.fieldByName("airModel") : "",
	                     
	        };
	        
	
	    }
	
	    flightRs.close();
	}
	
    db.close();
    return flightValue;
};

exports.getFlight = function(currentFlightId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var flightRs = db.execute("SELECT id, flightNumber, flightDateUTC, flightDateLT, origin, destination, legNumber, aircraftType, aircraftConfiguration, aircraftRegistration, departureStation, arrivalStation, STD, STA, ETD, ETA, flyingTime, gate, nextFlightNumber, nextFlightDateTime, departureDate, lastModified, lastSync, airModel, STDLT, ETDLT, STALT, ETALT, region FROM Flight WHERE id=?", currentFlightId);
    var flightValue = '';
    if (flightRs != null && flightRs.isValidRow()) {
        flightValue = {
            id : flightRs.fieldByName("id") != null ? flightRs.fieldByName("id") : "",
           	flightNumber : flightRs.fieldByName("flightNumber") != null ? flightRs.fieldByName("flightNumber") : "",
           	flightDateUTC : flightRs.fieldByName("flightDateUTC") != null ? flightRs.fieldByName("flightDateUTC") : "",
           	flightDateLT : flightRs.fieldByName("flightDateLT") != null ? flightRs.fieldByName("flightDateLT") : "",
           	origin : flightRs.fieldByName("origin") != null ? flightRs.fieldByName("origin") : "",
           	destination : flightRs.fieldByName("destination") != null ? flightRs.fieldByName("destination") : "",
           	legNumber : flightRs.fieldByName("legNumber") != null ? flightRs.fieldByName("legNumber") : "",
           	aircraftType : flightRs.fieldByName("aircraftType") != null ? flightRs.fieldByName("aircraftType") : "",
           	aircraftConfiguration : flightRs.fieldByName("aircraftConfiguration") != null ? flightRs.fieldByName("aircraftConfiguration") : "",
           	aircraftRegistration : flightRs.fieldByName("aircraftRegistration") != null ? flightRs.fieldByName("aircraftRegistration") : "",
           	arrivalStation : flightRs.fieldByName("arrivalStation") != null ? flightRs.fieldByName("arrivalStation") : "",
            departureStation : flightRs.fieldByName("departureStation") != null ? flightRs.fieldByName("departureStation") : "",
           	STD : flightRs.fieldByName("STD") != null ? flightRs.fieldByName("STD") : "",
           	STA : flightRs.fieldByName("STA") != null ? flightRs.fieldByName("STA") : "",
           	ETD : flightRs.fieldByName("ETD") != null ? flightRs.fieldByName("ETD") : "",
           	ETA : flightRs.fieldByName("ETA") != null ? flightRs.fieldByName("ETA") : "",
           	flyingTime : flightRs.fieldByName("flyingTime") != null ? flightRs.fieldByName("flyingTime") : "",
           	gate : flightRs.fieldByName("gate") != null ? flightRs.fieldByName("gate") : "",
           	nextFlightNumber : flightRs.fieldByName("nextFlightNumber") != null ? flightRs.fieldByName("nextFlightNumber") : "",
           	nextFlightDateTime : flightRs.fieldByName("nextFlightDateTime") != null ? flightRs.fieldByName("nextFlightDateTime") : "",
           	departureDate : flightRs.fieldByName("departureDate") != null ? flightRs.fieldByName("departureDate") : "",
           	lastModified : flightRs.fieldByName("lastModified") != null ? flightRs.fieldByName("lastModified") : "",
           	lastSync : flightRs.fieldByName("lastSync") != null ? flightRs.fieldByName("lastSync") : "",
           	airModel : flightRs.fieldByName("airModel") != null ? flightRs.fieldByName("airModel") : "",
           	STDLT : flightRs.fieldByName("STDLT") != null ? flightRs.fieldByName("STDLT") : "",
           	STALT : flightRs.fieldByName("STALT") != null ? flightRs.fieldByName("STALT") : "",
           	ETDLT : flightRs.fieldByName("ETDLT") != null ? flightRs.fieldByName("ETDLT") : "",
           	ETALT : flightRs.fieldByName("ETALT") != null ? flightRs.fieldByName("ETALT") : "",
           	region : flightRs.fieldByName("region") != null ? flightRs.fieldByName("region") : "",
        };
    	flightRs.close();
    }
    db.close();
    return flightValue;
};

exports.getAvailableSeat = function(lopaId)
{
	var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute('SELECT LOPAPosition.id, LOPAPosition.position, LOPAPosition.class, LOPAPosition.floor, LOPAPosition.zone, LOPAPosition.status, LOPAPosition.type  FROM LOPAPosition left join LOPA on LOPAPosition.lopaId=LOPA.id WHERE LOPA.id=? and LOPAPosition.type="seat" and LOPAPosition.flightId = ?  Order by LOPAPosition.row  ', lopaId, currentFlightId);
    var List = [];
    if (Detail != null) {
        while (Detail.isValidRow()) {
            var rop = "";
            var name = "";
            if(Detail.fieldByName("status") != '3' && Detail.fieldByName("status") != '13'){
	            var seat = {
	                id : Detail.fieldByName("id"),
	                rop : rop,
	                name : name,
	                bookingSeat : Detail.fieldByName("position") != null ? Detail.fieldByName("position") : "",
	                bookingClass : Detail.fieldByName("class") != null ? Detail.fieldByName("class") : "",
	                floor : Detail.fieldByName("floor") != null ? Detail.fieldByName("floor") : "",
	                zone : Detail.fieldByName("zone") != null ? Detail.fieldByName("zone") : "",
	                type : Detail.fieldByName("type") != null ? Detail.fieldByName("type") : "",
	            };
            	List.push(seat);
            }
            Detail.next();
        }
        Detail.close();
    }
    db.close();
    return List;
	
};


exports.getPassengerListAllLopa = function() {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute('SELECT LOPAPosition.id, LOPAPosition.position, LOPAPosition.class, LOPAPosition.floor, LOPAPosition.zone  FROM LOPAPosition left join LOPA on LOPAPosition.lopaId=LOPA.id WHERE LOPAPosition.type="seat"  Order by LOPAPosition.row');
   	var List = [];
    if (Detail != null) {
        while (Detail.isValidRow()) {
            var rop = "";
            var name = "";
            var passengerData = db.execute('SELECT Passenger.id, Passenger.bookingClass,Passenger.firstName,Passenger.lastName,ROP.ropTier FROM Passenger left JOIN ROP on ROP.passengerId=Passenger.id WHERE Passenger.bookingSeat=? and Passenger.flightId = ? ', Detail.fieldByName("position"), currentFlightId);
            if (passengerData.isValidRow()) {
                if (passengerData.fieldByName("ropTier") != null) {
                    rop = " " + passengerData.fieldByName("ropTier");
                }

                if (passengerData.fieldByName("firstName") != null) {
                    name = passengerData.fieldByName("firstName") + " ";
                    if (passengerData.fieldByName("lastName") != null) {
                        name += passengerData.fieldByName("lastName");
                    }
                } else {
                    if (passengerData.fieldByName("lastName") != null) {
                        name += passengerData.fieldByName("lastName");
                    }
                }
            }

            var seat = {
                id : Detail.fieldByName("id"),
                rop : rop,
                name : name,
                bookingSeat : Detail.fieldByName("position") != null ? Detail.fieldByName("position") : "",
                bookingClass : Detail.fieldByName("class") != null ? Detail.fieldByName("class") : "",
                floor : Detail.fieldByName("floor") != null ? Detail.fieldByName("floor") : "",
                zone : Detail.fieldByName("zone") != null ? Detail.fieldByName("zone") : "",
            };

            List.push(seat);
            Detail.next();
        }

        Detail.close();
    } 
    
    db.close();
    return List;

};


exports.getPassengerListLopa = function(lopaId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var posStack = [];
    var List = [];
    var Detail = db.execute('SELECT LOPAPosition.id, LOPAPosition.position, LOPAPosition.class, LOPAPosition.floor, LOPAPosition.zone, LOPAPosition.status, LOPAPosition.type  FROM LOPAPosition left join LOPA on LOPAPosition.lopaId=LOPA.id WHERE LOPA.id=? and LOPAPosition.type="seat" and LOPAPosition.flightId = ?  Order by LOPAPosition.row  ', lopaId, currentFlightId);
    if (Detail != null) {
        while (Detail.isValidRow()) {
        	
        	if(Detail.fieldByName("status") != '3' && Detail.fieldByName("status") != '13'){
	            var seat = {
	                id : Detail.fieldByName("id"),
	                rop : "",
	                name : "",
	                bookingSeat : Detail.fieldByName("position") != null ? Detail.fieldByName("position") : "",
	                bookingClass : Detail.fieldByName("class") != null ? Detail.fieldByName("class") : "",
	                floor : Detail.fieldByName("floor") != null ? Detail.fieldByName("floor") : "",
	                zone : Detail.fieldByName("zone") != null ? Detail.fieldByName("zone") : "",
	                type : Detail.fieldByName("type") != null ? Detail.fieldByName("type") : "",
	            };
	    		posStack.push(seat.bookingSeat);
            	List.push(seat);
           	}
           	Detail.next();
        }
    	 Detail.close();
    }
    
    //var passengerData = db.execute('SELECT Passenger.id, Passenger.bookingClass,Passenger.firstName,Passenger.lastName,ROP.ropTier FROM Passenger left JOIN ROP on ROP.passengerId=Passenger.id WHERE Passenger.bookingSeat=? and Passenger.flightId=? Order by Passenger.bookingClass ASC ,Passenger.bookingSeat ASC', Detail.fieldByName("position"), currentFlightId);
    var passengerDataExp = "SELECT Passenger.id, Passenger.bookingClass,Passenger.firstName,Passenger.lastName,ROP.ropTier, Passenger.bookingSeat FROM Passenger left JOIN ROP on ROP.passengerId=Passenger.id WHERE Passenger.bookingSeat IN ('"+ posStack.join("','") + "') and Passenger.flightId='" + currentFlightId +"'Order by Passenger.bookingClass ASC ,Passenger.bookingSeat ASC";
    Ti.API.info(passengerDataExp);
    var passengerData = db.execute(passengerDataExp);
    if(passengerData != null){
	    while (passengerData.isValidRow()) {
	    	for(var index = 0; index < List.length; index++){
		    	var rop = "";
	    		var name = "";
		        if (passengerData.fieldByName("ropTier") != null) {
		            rop = " " + passengerData.fieldByName("ropTier");
		        }
		        if (passengerData.fieldByName("firstName") != null) {
		            name = passengerData.fieldByName("firstName") + " ";
		            if (passengerData.fieldByName("lastName") != null) {
		                name += passengerData.fieldByName("lastName");
		            }
		        } else {
		            if (passengerData.fieldByName("lastName") != null) {
		                name += passengerData.fieldByName("lastName");
		            }
		        }
		        if(List[index].bookingSeat == passengerData.fieldByName("bookingSeat"))
		        {
		        	List[index].name = name;
		        	List[index].rop = rop;
		        }
	    }
        passengerData.next();
    }
    passengerData.close();
    }
    db.close();
    return List;
    
};

exports.getOneLOPA = function(lopaId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var lopaOneRs = db.execute("SELECT id, flightId, legId, maxColumn, maxRow, class, floor, zone FROM LOPA WHERE id= ?", lopaId);

    var lopaId;
    if (lopaOneRs != null) {
	    if (lopaOneRs.isValidRow()) {
	        var lopaId = {
	            id : lopaOneRs.fieldByName("id"),
	            flightId : lopaOneRs.fieldByName("flightId"),
	            legId : lopaOneRs.fieldByName("legId"),
	            maxColumn : lopaOneRs.fieldByName("maxColumn"),
	            maxRow : lopaOneRs.fieldByName("maxRow"),
	            cclass : lopaOneRs.fieldByName("class"),
	            floor : lopaOneRs.fieldByName("floor"),
	            zone : lopaOneRs.fieldByName("zone"),
	        };
	    }
	   lopaOneRs.close();
	}

    db.close();
    return lopaId;
};

exports.getAllPassengers = function() {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var allPassengers = db.execute("SELECT COUNT(id) As count From Passenger WHERE flightId=?", currentFlightId);
    var count = 0;
    if(allPassengers != null)
    {
    	if(allPassengers.isValidRow()){
    		count = allPassengers.fieldByName("count");	
    	}
    	allPassengers.close();
    }
    db.close();
    return count;
};

exports.getAllSeats = function() {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var countDetail = db.execute("Select Count(id) as count from LOPAPosition Where flightId=? AND type='seat'", currentFlightId);
    var count = 0;
    if(countDetail != null)
    {
    	if(countDetail.isValidRow()){
    		count = countDetail.fieldByName("count");
    	}		
    	countDetail.close();
    }
    db.close();
    return count;
};

exports.getByZonePassengers = function(lopaId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var Detail = db.execute('SELECT LOPAPosition.id, LOPAPosition.position, LOPAPosition.class, LOPAPosition.floor, LOPAPosition.zone  FROM LOPAPosition left join LOPA on LOPAPosition.lopaId=LOPA.id WHERE LOPA.id=? and LOPAPosition.type="seat" and LOPAPosition.flightId=? Order by LOPAPosition.row  ', lopaId, currentFlightId);
    var passengerCount = 0;
    if (Detail != null) {
        var passengerData;
        while (Detail.isValidRow()) {
            passengerData = db.execute('SELECT Passenger.id, Passenger.bookingClass,Passenger.firstName,Passenger.lastName,ROP.ropTier FROM Passenger left JOIN ROP on ROP.passengerId=Passenger.id WHERE Passenger.bookingSeat=? and Passenger.flightId=? Order by Passenger.bookingClass ASC ,Passenger.bookingSeat ASC', Detail.fieldByName("position"), currentFlightId);
            if(passengerData != null){
            	if (passengerData.isValidRow()) {    	
	            	passengerCount++;
            	}
            	Detail.next();
        		passengerData.close();
        	}
       	}
        Detail.close();
    } 
    
    db.close();
    return passengerCount;
    
};

exports.getByZoneSeats = function(lopaId) {
    var db = Ti.Database.open(Alloy.Globals.dbName);
    var countDetail = db.execute("Select Count(id) as count from LOPAPosition Where flightId=? AND type='seat' AND lopaId=?", currentFlightId, lopaId);
    var count = 0;
    if(countDetail != null){
    	if(countDetail.isValidRow()){
    		count = countDetail.fieldByName("count");
    	}
    	countDetail.close();
    }
    db.close();
    return count;
};



exports.isIncidents = function(positions, acReg) {

   var db = Ti.Database.open(Alloy.Globals.dbName);
   var incidentDataValues = [];
   var sqlExp = "SELECT Incident.id, Passenger.bookingSeat as paxPos, PositionGroupMember.positionId as seatPos " + 
    "FROM Incident " + 
    "LEFT JOIN PaxGroupMember ON PaxGroupMember.incidentId = Incident.id " + 
    "LEFT JOIN Passenger ON (Passenger.id = PaxGroupMember.paxId OR Passenger.paxKey = PaxGroupMember.paxKey OR Passenger.accountId = PaxGroupMember.accountId) " + 
    "LEFT JOIN PositionGroupMember ON PositionGroupMember.incidentId = Incident.id " + 
    "WHERE ((Passenger.bookingSeat IN ('" + positions.join("','") +"') AND Passenger.flightId = '"+ currentFlightId +"') OR (PositionGroupMember.positionId IN ('"+ positions.join("','") +"') AND Incident.acReg = '"+ acReg +"')) AND Incident.isVoided == 0 AND Incident.incidentStatus != 2 AND Incident.incidentStatus != 3 AND Incident.upgradeChangeSeatType IS NULL";
   //Ti.API.info(sqlExp);
   var incidentData = db.execute(sqlExp);
   if (incidentData != null) {
		while (incidentData.isValidRow()) {
			var pos = '';
			if(incidentData.fieldByName("paxPos") != null)
			{
				pos = incidentData.fieldByName("paxPos");
			}
			else if(incidentData.fieldByName("seatPos") != null)
			{
				pos = incidentData.fieldByName("seatPos");
			}
				
			if(incidentDataValues.indexOf(pos) < 0){
			       	incidentDataValues.push(pos);
			}
		        incidentData.next();
		    }
		    
		    incidentData.close();
		}
    db.close();
    return incidentDataValues;
};

exports.isIncidentsLAVG = function(acReg) {
	
	var db = Ti.Database.open(Alloy.Globals.dbName);
	var incidentDataValues = [];
    var Detail = db.execute("SELECT Incident.id, PositionGroupMember.positionId as positionId " + 
        "FROM Incident " + 
        "LEFT JOIN PositionGroupMember ON PositionGroupMember.incidentId = Incident.id " + 
        "WHERE (Incident.acReg = ? AND Incident.isVoided == 0 AND Incident.incidentStatus != 2 AND Incident.incidentStatus != 3) ", acReg);
    
    if (Detail != null) {
    	while (Detail.isValidRow()) {
    		
        	var pos = Detail.fieldByName("positionId") != null ? Detail.fieldByName("positionId") : "";
			if(incidentDataValues.indexOf(pos) < 0){
		   		incidentDataValues.push(pos);
			}
			Detail.next();
    	}
    	Detail.close();
    }
	db.close();
	return incidentDataValues;
	
};

exports.getCountIncidentPerZone = function(lopaId) {
    var sum = 0;
    var db = Ti.Database.open(Alloy.Globals.dbName);    
    var incidentList = [];
    var countPaxincidents = db.execute("SELECT incident.id as id FROM Incident LEFT JOIN PaxGroupMember ON Incident.id = PaxGroupMember.incidentId LEFT JOIN LOPAPosition LEFT JOIN Passenger ON  Passenger.id = PaxGroupMember.paxId WHERE LOPAPosition.position = Passenger.bookingSeat And LOPAPosition.lopaId = ? AND Incident.flightId = ? group by incident.id", lopaId, currentFlightId);
	
	if (countPaxincidents != null) {
		while(countPaxincidents.isValidRow())
		{
		    sum++;
		    incidentList.push(countPaxincidents.fieldByName("id"));
		    countPaxincidents.next();
		}
		countPaxincidents.close();
	}
	
	var countPositionIncidents = db.execute("SELECT incident.id as id FROM incident left join  PositionGroupMember on  PositionGroupMember.incidentId = incident.id Left join LopaPosition on  PositionGroupMember.positionId = LopaPosition.position Where LopaPosition.lopaId = ? group by incident.id", lopaId);
	var isDupIncident = -1;
	
	if (countPositionIncidents != null) {
		while(countPositionIncidents.isValidRow()) {
		    isDupIncident = incidentList.indexOf(countPositionIncidents.fieldByName("id"));
		    	
		    if(isDupIncident < 0){
		    	sum++;	
		    }
		    isDupIncident = -1;
		    countPositionIncidents.next();
		 }
	    
	    countPositionIncidents.close();
	}
	
	
    db.close();
    return sum;
};


exports.getCountIncidentPerZoneAll = function(lopa, acReg) {
    var sumValueList = [];
    var db = Ti.Database.open(Alloy.Globals.dbName);
    
    var countPaxincidents;
    var countPositionIncidents;
    for(var index = 0; index < lopa.length; index++){
    	var sum = 0;
    	var lopaId = lopa[index].id;
    	var incidentList = [];
	    countPaxincidents = db.execute("SELECT incident.id as id, incident.upgradeChangeSeatType as upgradeChangeSeatType, incident.incidentStatus as incidentStatus FROM Incident LEFT JOIN PaxGroupMember ON Incident.id = PaxGroupMember.incidentId LEFT JOIN LOPAPosition LEFT JOIN Passenger ON  Passenger.id = PaxGroupMember.paxId WHERE LOPAPosition.position = Passenger.bookingSeat And LOPAPosition.lopaId = ? AND Incident.flightId = ? group by incident.id", lopaId, currentFlightId);
	    
	    if (countPaxincidents != null) {
		    while(countPaxincidents.isValidRow())
		    {
		    	if(countPaxincidents.fieldByName("upgradeChangeSeatType") != "upgradeSeat" && countPaxincidents.fieldByName("upgradeChangeSeatType") != "changeSeat"){
		    		sum++;
		    	}
		    	
		    	incidentList.push(countPaxincidents.fieldByName("id"));
		    	countPaxincidents.next();
		    }	
		    countPaxincidents.close();
	    }
	    
	    countPositionIncidents = db.execute("SELECT Incident.id as id FROM Incident left join  PositionGroupMember on  PositionGroupMember.incidentId = Incident.id Left join LopaPosition on  PositionGroupMember.positionId = LopaPosition.position Where (LopaPosition.lopaId = ? AND Incident.acReg = ?) group by incident.id", lopaId , acReg);
	    var isDupIncident = -1;
	    
	    if (countPositionIncidents != null) {
		    while(countPositionIncidents.isValidRow())
		    {
		    	
		    	isDupIncident = incidentList.indexOf(countPositionIncidents.fieldByName("id"));

		    	if(isDupIncident < 0){
		    		sum++;	
		    	}
		    	isDupIncident = -1;
		    	countPositionIncidents.next();
		    }
	    
	    	sumValueList[index] = sum;	
	    	countPositionIncidents.close();
	   	}
	   	
    }
    
    db.close();
    return sumValueList;
};

exports.getCountIncidentAll = function() {
	
	var db = Ti.Database.open(Alloy.Globals.dbName);
    var allIncident = 0;
	var countIncidents = db.execute("SELECT incident.id FROM Incident LEFT JOIN PaxGroupMember ON Incident.id = PaxGroupMember.incidentId  LEFT JOIN PositionGroupMember ON Incident.id = PositionGroupMember.incidentId LEFT JOIN LOPAPosition LEFT JOIN Passenger ON  Passenger.id = PaxGroupMember.paxId WHERE ((LOPAPosition.position == PositionGroupMember.positionId) OR (Passenger.bookingSeat == LOPAPosition.position)) AND Incident.flightId = ? AND Incident.upgradeChangeSeatType IS NULL GROUP BY incident.id", currentFlightId);
	if (countIncidents != null) {
		while(countIncidents.isValidRow())
	    {
	    	allIncident++;
	    	countIncidents.next();
	    }
	    countIncidents.close();
	}
	db.close();
	return allIncident;
	
};

