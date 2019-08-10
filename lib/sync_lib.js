var query_lib = require("query_lib");
var delete_data = require("delete_data");
var force = require('force');
var log = require('log_lib');
var component = require('component_lib');
var utility = require('utility_lib');

var isSyncing = false;
var isFlightInProgress = false;
var isError = false;
var user_lib = require('user_lib');
// Background sync variables
var isBackgroundSyncInitialized = false;
var is3HrCompleted = false;
var is1Hr30MinCompleted = false;
var totalSizeData = 0;
var incidentAttachments;
var compensationAttachments;
var ropEnrollmentAttachments;
var _loginPromptView;
var flightNumberList = [];
var changeSeatList = [];

const ATTACHMENT_SIZE_LIMIT = 4.5 * 1024 * 1024;

exports.isBackgroundSyncActivated = function() {
	return isBackgroundSyncInitialized;
};

exports.isSyncInprogress = function() {
	return isSyncing;
};

exports.setSyncInprogress = function(isSync) {
	isSyncing = isSync;
};

exports.set3HrCompleted = function(status) {
	is3HrCompleted = status;
};

exports.set1Hr30MinCompleted = function(status) {
	is1Hr30MinCompleted = status;
};

function checkDataSize(dataArg){
    var sizeData = JSON.stringify(dataArg); //responseText
    Ti.API.info('Data size (B) : ' + sizeData.length);
    Ti.API.info('Data size (KB) : ' + (sizeData.length / 1024));
    totalSizeData += (sizeData.length / 1024);
    Ti.API.info('Total Size (KB): ' + totalSizeData);    
}

//******************************************************

exports.startSync = function() {
	//Ti.API.info(isSyncing);
	var user = query_lib.getUserDetail();
	//Ti.API.info("User access token" + user.accessToken);
	//Ti.API.info("Alloy.Globals.accessToken" + Alloy.Globals.accessToken);

	if (!isSyncing && (user.accessToken || Alloy.Globals.accessToken)) {
		Ti.API.info("Starting synchronization process.");
		isError = false;
		//isSyncing = true;

		return true;
	} else {
		return false;
	}
};

exports.syncFlight = function(startSyncing, syncing, finishSyncing) {
	syncFlightFunction(finishSyncing);
};

function convertDate(date) {
    var temp = new Date(date);
    return temp.getDate() + "/" + (temp.getMonth() + 1) + "/" + temp.getFullYear();
}

exports.syncCrewDutyPost = function(startSyncing, syncing, finishSyncing, syncError) {
	syncCrewDutyFunctionPost(finishSyncing, syncError);
};

function syncCrewDutyFunctionPost(finishSyncing, syncError) {

	var crewHttpPOSTClient = Titanium.Network.createHTTPClient({
		timeout : 1000 * 30, // 30 seconds
		onerror : function(e) {
			Ti.API.error(e);
			Ti.API.error(this.responseText);
			
			if(e.code == 401 || e.source.status == 401)
			{
				syncError(e);
			}
			
			var errorLog = null;
			if(e.code == -1009 || e.source.status == -1009){
				
				errorLog = {
					type : 1 // 1 = Network error
				};
			}
			if(e.code == -1200 || e.source.status == -1200){
				
				errorLog = {
					type : 2 // 2 = SSL error has occurred and a secure connection
				};
			}
			if(e.code == -1001 || e.source.status == -1001){
				
				errorLog = {
					type : 3 // 3 = Request Timeout
				};
			}
			if(errorLog != null){
				logTemp.push(errorLog);
				finishSyncing();
			}
			
			log.logError(this.responseText, "POST CrewDuty", 3);
		},
		onload : function(e) {
			var data;
			try {
				if(this.responseText != null) {
                   data = JSON.parse(this.responseText);                    
                } else {
                   data = null; 
                }
                // checkDataSize(this.responseText);
				if (data != null) {
//					Ti.API.info("Crew Duty Assignment record number return from SFDC : "+data.recordNo);
					query_lib.setDutySynced();
				} else {
//					Ti.API.info("Null data");
				}
			} catch (err) {
				Ti.API.error(err);
			} finally {
				finishSyncing();
			}

			data = null;
		}
	});

	var url = Alloy.Globals.instanceUrl + "services/apexrest/crewduty";
//	Ti.API.info(url);

	var dutyList = query_lib.getCrewDutyAssignment();
	var params = {
		crewdutyList : dutyList
	};
	
//	Ti.API.info(JSON.stringify(params));
    // checkDataSize(JSON.stringify(params));

	crewHttpPOSTClient.open("POST", url);
	crewHttpPOSTClient.setRequestHeader("content-type", "application/json");
	crewHttpPOSTClient.setRequestHeader("Authorization", "OAuth " + Alloy.Globals.accessToken);
	crewHttpPOSTClient.send(JSON.stringify(params));

	params = null;
	dutyList = null;
	crewHttpPOSTClient = null;
}

exports.syncPsychologyPost = function(startSyncing, syncing, finishSyncing) {
	syncPsychologoFunctionPost(finishSyncing);
};

function syncPsychologoFunctionPost(finishSyncing) {

	var psychoHttpClient = Titanium.Network.createHTTPClient({
		timeout : 1000 * 30, // 30 seconds
		onerror : function(e) {
			Ti.API.error(e);
			Ti.API.error(this.responseText);
			var errorLog = null;
			if(e.code == -1009 || e.source.status == -1009){
				
				errorLog = {
					type : 1 // 1 = Network error
				};
			}
			if(e.code == -1200 || e.source.status == -1200){
				
				errorLog = {
					type : 2 // 2 = SSL error has occurred and a secure connection
				};
			}
			if(e.code == -1001 || e.source.status == -1001){
				
				errorLog = {
					type : 3 // 3 = Request Timeout
				};
			}
			if(errorLog != null){
				logTemp.push(errorLog);
			}
			log.logError(this.responseText, "POST Psychology", 3);
			finishSyncing();
		},
		onload : function(e) {
			var data;
			try {
				if(this.responseText != null) {
                   data = JSON.parse(this.responseText);                    
                } else {
                   data = null; 
                }
                // checkDataSize(this.responseText);
				if (data != null) {
//					Ti.API.info("Passenger Psychology response : "+JSON.stringify(data));
				} else {
//					Ti.API.info("Null data");
				}
			} catch (err) {
				Ti.API.error(err);
			} finally {
				finishSyncing();
			}

			data = null;
		}
	});

	var url = Alloy.Globals.instanceUrl + "services/apexrest/passenger";
//	Ti.API.info(url);

	var psychoList = query_lib.getPsychologyUnsynced();
	var params = {
		paxPsy : psychoList
	};
	
//	Ti.API.info(JSON.stringify(params));
    // checkDataSize(JSON.stringify(params));

	psychoHttpClient.open("POST", url);
	psychoHttpClient.setRequestHeader("content-type", "application/json");
	psychoHttpClient.setRequestHeader("Authorization", "OAuth " + Alloy.Globals.accessToken);
	psychoHttpClient.send(JSON.stringify(params));

	params = null;
	psychoList = null;
	psychoHttpClient = null;
}

function syncFlightFunction(finishSyncing) {

	var flightHttpClient = Titanium.Network.createHTTPClient({
		timeout : 1000 * 30, // 30 seconds
		onerror : function(e) {
			Ti.API.error(e);
			Ti.API.error(this.responseText);
			var errorLog = null;
			if(e.code == -1009 || e.source.status == -1009){
				
				errorLog = {
					type : 1 // 1 = Network error
				};
			}
			if(e.code == -1200 || e.source.status == -1200){
				
				errorLog = {
					type : 2 // 2 = SSL error has occurred and a secure connection
				};
			}
			if(e.code == -1001 || e.source.status == -1001){
				
				errorLog = {
					type : 3 // 3 = Request Timeout
				};
			}
			if(errorLog != null){
				logTemp.push(errorLog);
			}
			log.logError(this.responseText, "GET Flight", 3);
			finishSyncing();
			
			// if (e.code == 401 || e.source.status == 401) {
				// syncError(e);
			// }
			// else {
				// finishSyncing(false);
			// }
			
			/*
			if (e.code == -1 || e.code == -1001 || e.code == 500 || e.source.status == 0 || e.source.status == -1005 || e.source.status == -1100) {
				finishSyncing(false);
			}
			else {
				syncError(e);
			}
			*/
		},
		onload : function(e) {
			var _data;
			try {
				if(this.responseText != null) {
                   _data = JSON.parse(this.responseText);                    
                } else {
                   _data = null; 
                } // Flight information
                // checkDataSize(this.responseText);
                //Ti.API.info(_data);
				if (_data != null & _data.length > 0) {					
                    var db = Ti.Database.open(Alloy.Globals.dbName);
                    db.execute("BEGIN");
                    var flightInfo = db.execute("SELECT id FROM Flight WHERE isCurrentFlight='1'");
                    var hasFlight = flightInfo.isValidRow();
                    if(!hasFlight){
                        var isCurrent = true;
                        for(var index = 0; index < _data.length; index++)
                        {
                            flightIds.push(_data[index].id);
                            flightNumberList.push(_data[index].flightNo);
                            var aircraftConfiguration = _data[index].acCon;
                            var aircraftRegistration = _data[index].acReg;
                            var aircraftType = _data[index].acType;
                            var arrivalStation = _data[index].arrSt;
                            var departureStation = _data[index].depSt;
                            var flightDateLT = _data[index].dateL;
                            var flightDateUTC = _data[index].dateU;
                            var departureDate = _data[index].depDl;
                            var destination = _data[index].dest;
                            var ETA = _data[index].etaUTC;
                            var ETD = _data[index].etdUTC;
                            var STA = _data[index].staUTC;
                            var STD = _data[index].stdUTC;
                            var flightNumber = _data[index].flightNo;
                            var flyingTime = _data[index].ft;
                            var gate = _data[index].gate;
                            var flightInformationId = _data[index].id;
                            var lastModified = _data[index].lastM;
                            var lastSync = new Date();
                            var legNumber = _data[index].legNo;
                            var nextFlightDateTime = _data[index].nFltDTu;
                            var nextFlightNumber = _data[index].nFltNo;
                            var origin = _data[index].origin;
                            var flightExternalId = _data[index].fltExtId;
                            var arriveStationFull = _data[index].arrStF;
                            var departureStationFull = _data[index].depStF;
                            var airModel = _data[index].model;
                            var bookingPax = _data[index].bookingPax;
                            var ETALT = _data[index].etaLT;
                            var ETDLT = _data[index].etdLT;
                            var STALT = _data[index].staLT;
                            var STDLT = _data[index].stdLT;
                            var acName = _data[index].acName != null ? _data[index].acName : "";
                            var acNameTH = _data[index].acNameTH != null ? _data[index].acNameTH : "";
                            var codeShare = _data[index].codeShare != null ? _data[index].codeShare : "";
                            var acceptPax = _data[index].acceptedPax != null ? _data[index].acceptedPax : "";
                            var region = _data[index].region;
                           	
                           	var totalInfantClassY = _data[index].totalInfantClassY != null ? _data[index].totalInfantClassY : 0;
                            var totalInfantClassU = _data[index].totalInfantClassU != null ? _data[index].totalInfantClassU : 0;
                            var totalInfantClassC = _data[index].totalInfantClassC != null ? _data[index].totalInfantClassC : 0;
                            var totalInfantClassF = _data[index].totalInfantClassF != null ? _data[index].totalInfantClassF : 0;
                            
                            var totalPassengerClassY = _data[index].totalPassengerClassY != null ? _data[index].totalPassengerClassY : 0;
                            var totalPassengerClassU = _data[index].totalPassengerClassU != null ? _data[index].totalPassengerClassU : 0;
                            var totalPassengerClassC = _data[index].totalPassengerClassC != null ? _data[index].totalPassengerClassC : 0;
                            var totalPassengerClassF = _data[index].totalPassengerClassF != null ? _data[index].totalPassengerClassF : 0;
                            
                            
                            db.execute('INSERT OR REPLACE INTO Flight (id, flightNumber, flightDateUTC, flightDateLT, origin, destination, legNumber, aircraftType, aircraftConfiguration, aircraftRegistration, departureStation, departureStationFull, arrivalStation, arrivalStationFull, STD, ETD, STA, ETA, flyingTime, gate, nextFlightNumber, nextFlightDateTime, departureDate, lastModified, lastSync, bookingPax, acceptedPax, status, flightExternalId, isCurrentFlight, airModel, STDLT, ETDLT, STALT, ETALT, aircraftName, aircraftNameTH, codeShare, region, totalInfantClassY, totalInfantClassU, totalInfantClassC, totalInfantClassF, totalPassengerClassY, totalPassengerClassU, totalPassengerClassC, totalPassengerClassF) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', 
                            flightInformationId, flightNumber, flightDateUTC, flightDateLT, origin, destination, legNumber, aircraftType, aircraftConfiguration, aircraftRegistration, departureStation, departureStationFull, arrivalStation, arriveStationFull, STD, ETD, STA, ETA, flyingTime, gate, nextFlightNumber, nextFlightDateTime, departureDate, lastModified, lastSync.toISOString(), bookingPax, acceptPax, 'status', flightExternalId, utility.convertBooleanToInt(isCurrent), airModel, STDLT, ETDLT, STALT, ETALT, acName, acNameTH, codeShare, region, totalInfantClassY, totalInfantClassU, totalInfantClassC, totalInfantClassF, totalPassengerClassY, totalPassengerClassU, totalPassengerClassC, totalPassengerClassF);
                            isCurrent = false;
                        }
                        isCurrent = null;
                    }else{
                        for(var index = 0; index < _data.length; index++)
                        {
                            flightIds.push(_data[index].id);
                            flightNumberList.push(_data[index].flightNo);
                            var checkFlight = db.execute("SELECT isCurrentFlight FROM Flight WHERE id='"+_data[index].id+"'");
                            var isCurrent;
                            if (checkFlight != null){
                                if (checkFlight.isValidRow()){
                                    isCurrent = checkFlight.fieldByName('isCurrentFlight');
                                }else {
                                    isCurrent = 0;
                                }
                            }
                            var aircraftConfiguration = _data[index].acCon;
                            var aircraftRegistration = _data[index].acReg;
                            var aircraftType = _data[index].acType;
                            var arrivalStation = _data[index].arrSt;
                            var departureStation = _data[index].depSt;
                            var flightDateLT = _data[index].dateL;
                            var flightDateUTC = _data[index].dateU;
                            var departureDate = _data[index].depDl;
                            var destination = _data[index].dest;
                            var ETA = _data[index].etaUTC;
                            var ETD = _data[index].etdUTC;
                            var STA = _data[index].staUTC;
                            var STD = _data[index].stdUTC;
                            var flightNumber = _data[index].flightNo;
                            var flyingTime = _data[index].ft;
                            var gate = _data[index].gate;
                            var flightInformationId = _data[index].id;
                            var lastModified = _data[index].lastM;
                            var lastSync = new Date();
                            var legNumber = _data[index].legNo;
                            var nextFlightDateTime = _data[index].nFltDTu;
                            var nextFlightNumber = _data[index].nFltNo;
                            var origin = _data[index].origin;
                            var flightExternalId = _data[index].fltExtId;
                            var arriveStationFull = _data[index].arrStF;
                            var departureStationFull = _data[index].depStF;
                            var airModel = _data[index].model;
                            var bookingPax = _data[index].bookingPax;
                            var ETALT = _data[index].etaLT;
                            var ETDLT = _data[index].etdLT;
                            var STALT = _data[index].staLT;
                            var STDLT = _data[index].stdLT;
                            var acName = _data[index].acName != null ? _data[index].acName : "";
                            var acNameTH = _data[index].acNameTH != null ? _data[index].acNameTH : "";
                            var codeShare = _data[index].codeShare != null ? _data[index].codeShare : "";
                            var acceptPax = _data[index].acceptedPax != null ? _data[index].acceptedPax : "";
                            var region = _data[index].region;
                            
                            var totalInfantClassY = _data[index].totalInfantClassY != null ? _data[index].totalInfantClassY : 0;
                            var totalInfantClassU = _data[index].totalInfantClassU != null ? _data[index].totalInfantClassU : 0;
                            var totalInfantClassC = _data[index].totalInfantClassC != null ? _data[index].totalInfantClassC : 0;
                            var totalInfantClassF = _data[index].totalInfantClassF != null ? _data[index].totalInfantClassF : 0;
                            
                            var totalPassengerClassY = _data[index].totalPassengerClassY != null ? _data[index].totalPassengerClassY : 0;
                            var totalPassengerClassU = _data[index].totalPassengerClassU != null ? _data[index].totalPassengerClassU : 0;
                            var totalPassengerClassC = _data[index].totalPassengerClassC != null ? _data[index].totalPassengerClassC : 0;
                            var totalPassengerClassF = _data[index].totalPassengerClassF != null ? _data[index].totalPassengerClassF : 0;
                            
                            db.execute('INSERT OR REPLACE INTO Flight (id, flightNumber, flightDateUTC, flightDateLT, origin, destination, legNumber, aircraftType, aircraftConfiguration, aircraftRegistration, departureStation, departureStationFull, arrivalStation, arrivalStationFull, STD, ETD, STA, ETA, flyingTime, gate, nextFlightNumber, nextFlightDateTime, departureDate, lastModified, lastSync, bookingPax, acceptedPax, status, flightExternalId, isCurrentFlight, airModel, STDLT, ETDLT, STALT, ETALT, aircraftName, aircraftNameTH, codeShare, region, totalInfantClassY, totalInfantClassU, totalInfantClassC, totalInfantClassF, totalPassengerClassY, totalPassengerClassU, totalPassengerClassC, totalPassengerClassF) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', 
                            flightInformationId, flightNumber, flightDateUTC, flightDateLT, origin, destination, legNumber, aircraftType, aircraftConfiguration, aircraftRegistration, departureStation, departureStationFull, arrivalStation, arriveStationFull, STD, ETD, STA, ETA, flyingTime, gate, nextFlightNumber, nextFlightDateTime, departureDate, lastModified, lastSync.toISOString(), bookingPax, acceptPax, 'status', flightExternalId, isCurrent, airModel, STDLT, ETDLT, STALT, ETALT, acName, acNameTH, codeShare, region, totalInfantClassY, totalInfantClassU, totalInfantClassC, totalInfantClassF, totalPassengerClassY, totalPassengerClassU, totalPassengerClassC, totalPassengerClassF);
                        }
                    }
                    db.execute("COMMIT");
                    hasFlight = null;
                    flightInfo = null;
                    
                    db.execute("BEGIN");
                    for(var index = 0; index < _data.length; index++)
                    {
                        var flight = _data[index];
                        var crewList = flight.crewL;
                        if(crewList != null && crewList.length > 0) {
                            db.execute("DELETE FROM Crew WHERE flightId=?",flight.id);
                            var fltExtNoSplit = flight.fltExtId.split("_");
                            var fltExtNo = fltExtNoSplit[0]+fltExtNoSplit[1];
                            for (var i = 0; i < crewList.length; i++) {
                                var crew = crewList[i];
                                var appraisalNum = crew.noOfEval != "null" ? crew.noOfEval : 0;
                                var typeCrew = "";
                                if (crew.rank.slice(0, 1).toLowerCase() == "f") {
                                    typeCrew = "Cockpit";
                                } else if (crew.rank.slice(0, 1).toLowerCase() == "a") {
                                    typeCrew = "Cabin";
                                } else if (crew.rank.slice(0, 1).toLowerCase() == "i") {
                                    typeCrew = "Cabin";
                                } else if (crew.rank.slice(0, 1).toLowerCase() == "g") {
                                    typeCrew = "GE";
                                }
                                else{
                                    typeCrew = "Other";
                                }
                                var j = i + 1;
                                db.execute('INSERT OR REPLACE INTO Crew (id,flightId,legNumber,image,crewTitle,crewFirstName,crewLastName,crewNickName,crewType,rank,actingRank,spcSpecial,duty,dutyCode,languages,rtFlightAndDate,posFly,appraisalNo,sfdcId,seqNumber,rtFltNo,flightExtNo,extId,gender,lastAppraisal) ' +
                                            'VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', 
                                            crew.id + '_' + flight.id, 
                                            flight.id, 
                                            "", 
                                            crew.image, 
                                            crew.title, 
                                            crew.firstN, 
                                            crew.lastN, 
                                            crew.nickN, 
                                            typeCrew, 
                                            crew.rank, 
                                            crew.aRank, 
                                            crew.spcSpl, 
                                            crew.duty, 
                                            crew.dutyC, 
                                            crew.lang, 
                                            crew.rtFltD, 
                                            crew.posFly, 
                                            appraisalNum, 
                                            crew.sfdcId, 
                                            crew.seqNo,
                                            crew.rtFltNo,
                                            flight.fltExtId,
                                            crew.id,
                                            crew.gender,
                                            crew.lastEva //"2016-02-"+ (j<10?"0"+j:j) //crew.lastAppraisal
                                          );
                            }
                            fltExtNoSplit = null; 
                            fltExtNo = null;                               
                        }
                        flight = null;
                        crewList = null;
                    }
                    db.execute("COMMIT");
                    
                    db.execute("BEGIN");                    
                    for (var index = 0; index < _data.length; index++) {
                        var aircraftReg = _data[index].acReg;
                        var flightId = _data[index].id;
                        db.execute("DELETE FROM Equipment WHERE flightId=?", flightId);
                        db.execute("DELETE FROM EquipmentPart WHERE flightId=?", flightId);
                        var equipments = _data[index].equip;
                        if(equipments != null && equipments.length > 0) {
                            for (var indexE = 0; indexE < equipments.length; indexE++) {
                                var equipment = equipments[indexE];
                                db.execute('INSERT INTO `Equipment`(`sfdcId`, `type`, `name`, `ataChapter`, `zone`, `location`,`acDesc`,`flightId`,`total`,`quantity`,`cPro`,`crewCheck`,`description`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', 
                                           equipment.id, 
                                           equipment.lcc, 
                                           equipment.name, 
                                           equipment.ataCh, 
                                           equipment.zone, 
                                           equipment.location, 
                                           aircraftReg, 
                                           flightId, 
                                           equipment.total, 
                                           equipment.qty, 
                                           equipment.cPro, 
                                           equipment.cCA, 
                                           equipment.descr
                                          );
                                for (var indexP = 0; indexP < equipment.part.length; indexP++) {
                                    var par = equipment.part[indexP];
                                    db.execute('INSERT INTO `EquipmentPart`(`sfdcId`, `equipmentId`, `name`, `flightId`) VALUES (?,?,?,?)', par.id, equipment.id, par.name, flightId);
                                }
                            }                                   
                        }
                        aircraftReg = null;
                        flightId = null;
                    }
                    db.execute("COMMIT");
                    
                    db.execute("DELETE FROM User");
                    
                    db.execute("BEGIN");
                    for(var index = 0; index < _data.length; index++)
                    {   
                        var _currentUser = _data[index].userId;
                        var flightNumber = _data[index].nFltNo;
                        var flightId = _data[index].id;
                        db.execute('INSERT OR REPLACE INTO User (id, userFirstName, userLastName, flightNumber, accessToken, securityToken, instantURL, refreshToken, flightId, rank, actingRank, sfdcId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', _currentUser.id, _currentUser.firstN, _currentUser.lastN, flightNumber, Alloy.CFG.accessToken, 'securityToken', Alloy.CFG.instanceURL, Alloy.CFG.refreshToken, flightId, _currentUser.rank, _currentUser.aRank, _currentUser.sfdcId); 
                        _currentUser = null;
                        flightNumber = null;
                        flightId = null;
                    }
                    db.execute("COMMIT");
                
                    db.execute("BEGIN");
                    db.execute("DELETE FROM Condition");
                    for (var index = 0; index < _data.length; index++) {
                        var conditions = _data[index].condi;
                        if(conditions != null && conditions.length) {
                            for (var indexC = 0; indexC < conditions.length; indexC++) {
                                db.execute("INSERT INTO Condition (name, type) VALUES (?,?)", String(conditions[indexC]), '');           
                            }                                
                        }
                        conditions = null;
                    }
                    
                    db.execute("COMMIT");
                    db.execute("BEGIN");
                    for (var index = 0; index < _data.length; index++) {
                    	var flight = _data[index];
                    	var duty = _data[index].duty;
                    	db.execute("DELETE FROM MasterDuty WHERE flightId=?", flight.id);
                    	if (duty != null && duty.length > 0){
                    		for (var i=0;i<duty.length;i++){
                    			db.execute("INSERT OR REPLACE INTO MasterDuty (id, flightId, name) VALUES (?,?,?)", duty[i]+"_"+flight.id , flight.id , duty[i]);
                    		}
                    	}
                    	flight = null;
                    	duty = null;
                    }
                    db.execute("COMMIT");
                    db.close();
				} else {
					// log.logError("Returned data is null", "GET Flight", 5);
				}
			} catch (err) {
				Ti.API.error(err);
			} finally {
				finishSyncing(true);
			}
			_data = null;
		}
	});
	
	var url = Alloy.Globals.instanceUrl + "services/apexrest/flight";
//	Ti.API.info(url);
	flightHttpClient.open("GET", url);
	flightHttpClient.setRequestHeader("content-type", "application/json");
	flightHttpClient.setRequestHeader("Authorization", "OAuth " + Alloy.Globals.accessToken);
	flightHttpClient.send();
};

exports.syncROPEnrollmentPost = function(startSyncing, syncing, finishSyncing) {
    syncROPEnrollmentFunctionPost(finishSyncing);
};

function syncROPEnrollmentFunctionPost(finishSyncing) {
    
    var ropEnrollmentList = query_lib.getROPEnrollmentForSync();
    var ropEnrollment1Record = [];
    
    if(ropEnrollmentList != null && ropEnrollmentList.length > 0) { 
        var countRecord = 0;
        for(var i = 0; i < ropEnrollmentList.length; i++) {
            ropEnrollment1Record = [];
            ropEnrollment1Record.push(ropEnrollmentList[i]);
            var incidentHttpClient = Titanium.Network.createHTTPClient({
                timeout : 1000 * 30, // 30 seconds
                onerror : function(e) {
                    Ti.API.error(e);
                    Ti.API.error(this.responseText);
                    countRecord++;
                    var errorLog = null;
                    if(e.code == -1009 || e.source.status == -1009){
                        
                        errorLog = {
                            type : 1 // 1 = Network error
                        };
                    }
                    if(e.code == -1200 || e.source.status == -1200){
                        
                        errorLog = {
                            type : 2 // 2 = SSL error has occurred and a secure connection
                        };
                    }
                    if(e.code == -1001 || e.source.status == -1001){
                        
                        errorLog = {
                            type : 3 // 3 = Request Timeout
                        };
                    }
                    if(errorLog != null){
                        logTemp.push(errorLog);
                    }
                    log.logError(this.responseText, "POST ROP Enrollment", 3);
                    
                    if (e.code == 401 || e.source.status == 401) {
                    }
                    else {
//                        finishSyncing([]);
                    }
                    if(countRecord == ropEnrollmentList.length) {
                        finishSyncing();                
                        ropEnrollmentList = null;
                        ropEnrollment1Record = null;
                    }                           
                },
                onload : function(e) {
                    countRecord++;
                    var data;
                    try {
                        if(this.responseText != null) {
                           data = JSON.parse(this.responseText);                    
                        } else {
                           data = null; 
                        }
                        // checkDataSize(this.responseText);
                        if (data != null) {
                            query_lib.updateROPEnrollmentPostReturn(data);
        //                    Ti.API.info("ROP Enrollment data return from SFDC : ");
                        } else {
        //                    Ti.API.info("Null data");
                        }
                    } catch (err) {
                        Ti.API.error(err);
                    } finally {
//                        finishSyncing();
                    }
                    if(countRecord == ropEnrollmentList.length) {
                        finishSyncing();                
                        ropEnrollmentList = null;
                        ropEnrollment1Record = null;
                    }                           
                    data = null;
                }
            });
        
            var url = Alloy.Globals.instanceUrl + "services/apexrest/ropenrollment";
            // Ti.API.info(url);
        
            var params = {
                "ropEnrollmentList" : ropEnrollment1Record
            };
            
            // Ti.API.info("Enroll JSON data:");
            // Ti.API.info(JSON.stringify(params));
            // checkDataSize(JSON.stringify(params));
        
            incidentHttpClient.open("POST", url);
            incidentHttpClient.setRequestHeader("content-type", "application/json");
            incidentHttpClient.setRequestHeader("Authorization", "OAuth " + Alloy.Globals.accessToken);
            incidentHttpClient.send(JSON.stringify(params));
        
            params = null;
        }
        
    } else {
        finishSyncing();
    }

}

exports.syncROPEnrollmentAttachment = function(startSyncing, syncing, finishSyncing) {

    ropEnrollmentAttachments = query_lib.getRopEnrollAttachmentsForSync();
    Ti.API.info("Start ROP Enroll attachment data:");
//    Ti.API.info(ropEnrollmentAttachments);
    syncROPEnrollmentFunctionAttachment(finishSyncing);
};

function syncROPEnrollmentFunctionAttachment(finishSyncing) {

    if (ropEnrollmentAttachments == null || ropEnrollmentAttachments == undefined || ropEnrollmentAttachments.length == 0) {
        finishSyncing();
    } 
    else {
    	var count = 0;
        for(var i = 0; i < ropEnrollmentAttachments.length; i++) {
            var attachment = ropEnrollmentAttachments[i];
    
            var incidentHttpClient = Titanium.Network.createHTTPClient({
                timeout : 1000 * 30, // 30 seconds
                onerror : function(e) {
                	count++;
//                    Ti.API.error(e);
//                    Ti.API.error(this.responseText);
                    var errorLog = null;
                    if(e.code == -1009 || e.source.status == -1009){
                        
                        errorLog = {
                            type : 1 // 1 = Network error
                        };
                    }
                    if(e.code == -1200 || e.source.status == -1200){
                        
                        errorLog = {
                            type : 2 // 2 = SSL error has occurred and a secure connection
                        };
                    }
                    if(e.code == -1001 || e.source.status == -1001){
                        
                        errorLog = {
                            type : 3 // 3 = Request Timeout
                        };
                    }
                    if(errorLog != null){
                        logTemp.push(errorLog);
                    }
                    log.logError(this.responseText, "POST ROP Enrollment Attachment", 3);
                    if(count == ropEnrollmentAttachments.length) {
		                finishSyncing();
		                ropEnrollmentAttachments = null;       
		            }
//                    syncROPEnrollmentFunctionAttachment(index + 1, finishSyncing);
                },
                onload : function(e) {
                	count++;
                    var data;
                    try {
                        if(this.responseText != null) {
                           data = JSON.parse(this.responseText);                    
                        } else {
                           data = null; 
                        }
                        // checkDataSize(this.responseText);
                        // Ti.API.info("Attachment Return:");                    
                        if (data != null) {
                            query_lib.updateROPEnrollAttachmentSyncStatusCompleteById(data.salesforceId[0], data.attachmentId);
                        } else {
                            // Ti.API.info("Null data");
                        }
                    } catch (err) {
                        Ti.API.error(err);
                    } finally {
                        data = null;
//                        syncROPEnrollmentFunctionAttachment(index + 1, finishSyncing);
                    }
                    if(count == ropEnrollmentAttachments.length) {
		                finishSyncing();
		                ropEnrollmentAttachments = null;       
		            }
                }
            });
    
            var url = Alloy.Globals.instanceUrl + "services/apexrest/ropEnrollment/attachment";
    
            var filepath = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "ropEnrollAttachment";
                // Ti.API.info("Image path:");            
    //            Ti.API.info(filepath);            
    
            var file = Ti.Filesystem.getFile(filepath, attachment.path);
            var blob;
            if (file != null) {
                // Ti.API.info("Image not null");            
                blob = file.read();
            } else {
                // Ti.API.info("Image not null");                        
            }
    
            var attachment64 = blob != null ? Ti.Utils.base64encode(blob).toString() : "";
            if (file.getSize() < ATTACHMENT_SIZE_LIMIT) {
                var bodies = chunkSubstr(attachment64, 5);
    
                var fileExtension = file.extension();
                var contentType = "";
                if (fileExtension == "jpg" || fileExtension == "jpeg") {
                    contentType = "image/jpeg";
                } else if (fileExtension == "png") {
                    contentType = "image/png";
                }
                            
                var attachmentParam = {
                    attachmentId : attachment.id,
                    name : attachment.path,
                    contenttype : contentType,
                    parentId : attachment.parentId,
                    description : attachment.detail,
                    body : bodies
                };
    
                var params = {
                    "receiveAttachment" : attachmentParam
                };
    
    //          Ti.API.info(JSON.stringify(params));
    
                // checkDataSize(JSON.stringify(params));
                incidentHttpClient.open("POST", url);
                incidentHttpClient.setRequestHeader("content-type", "application/json");
                incidentHttpClient.setRequestHeader("Authorization", "OAuth" + " " + Alloy.Globals.accessToken);
                incidentHttpClient.send(JSON.stringify(params));
    
                params = null;
                attachmentParam = null;
                bodies = null;
                incidentHttpClient = null;
            } else {
//                Ti.API.error("Attachment file is larger than limit (" + ATTACHMENT_SIZE_LIMIT + ")");
                log.logError("Attachment file is larger than limit (" + ATTACHMENT_SIZE_LIMIT + ")", "POST Attachment", 5);
            }
               
            attachment = null;
            attachment64 = null;
            file = null;
            blob = null;
            filepath = null;
            body = null;
        }
    }
}

exports.syncROPEnrollmentGet = function(startSyncing, syncing, finishSyncing) {
    syncROPEnrollmentFunctionGet(finishSyncing);
};

function syncROPEnrollmentFunctionGet(finishSyncing) {

    var incidentHttpClient = Titanium.Network.createHTTPClient({
        timeout : 1000 * 30, // 50 seconds
        onerror : function(e) {
            Ti.API.error(e);
            Ti.API.error(this.responseText);
            var errorLog = null;
			if(e.code == -1009 || e.source.status == -1009){
				
				errorLog = {
					type : 1 // 1 = Network error
				};
			}
			if(e.code == -1200 || e.source.status == -1200){
				
				errorLog = {
					type : 2 // 2 = SSL error has occurred and a secure connection
				};
			}
			if(e.code == -1001 || e.source.status == -1001){
				
				errorLog = {
					type : 3 // 3 = Request Timeout
				};
			}
			if(errorLog != null){
				logTemp.push(errorLog);
			}
            log.logError(this.responseText, "GET ROP Enrollment",3);
            finishSyncing(null);
        },
        onload : function(e) {
            var ropEnrollments;
            try {
                if(this.responseText != null) {
                   ropEnrollments = JSON.parse(this.responseText);                    
                } else {
                   ropEnrollments = null; 
                }
                Ti.API.info("ROP Enrollment get data:");
                // checkDataSize(this.responseText);
                if (ropEnrollments != null && ropEnrollments.length > 0) {
                    var db = Ti.Database.open(Alloy.Globals.dbName);
                    for (var i = 0; i < ropEnrollments.length; i++) {
                        db.execute("BEGIN");
                        var ropEnrollment = ropEnrollments[i];
                        db.execute("INSERT OR REPLACE INTO ROPEnrollment (saluation, firstName, lastName, dateOfBirth, gender, nationality, " + 
                            "phoneType, countryCode, areaCode, phoneNumber, email, " + 
                            "enrollDate, status, isSynced, paxKey, accountId, passengerId, sfdcId, flightId, flightNumber, inactiveReason, ropNumber, reportedBy, createdBy) " +
                            "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", 
                            strForQuery(ropEnrollment.salut),
                            strForQuery(ropEnrollment.firstN),
                            strForQuery(ropEnrollment.lastN),
                            strForQuery(ropEnrollment.birth),
                            strForQuery(ropEnrollment.gender),
                            strForQuery(ropEnrollment.nation),
                            strForQuery(ropEnrollment.phnType),
                            strForQuery(ropEnrollment.cCode),
                            strForQuery(ropEnrollment.aCode),
                            strForQuery(ropEnrollment.phnNum),
                            strForQuery(ropEnrollment.email),
                            strForQuery(ropEnrollment.enrollD),
                            ropEnrollment.status,
                            boolForQuery(ropEnrollment.isSynced),
                            strForQuery(ropEnrollment.paxKey),
                            strForQuery(ropEnrollment.accId),
                            strForQuery(ropEnrollment.paxId),
                            ropEnrollment.sfdcId,
                            strForQuery(ropEnrollment.fltId),
                            strForQuery(ropEnrollment.fltNum),
                            strForQuery(ropEnrollment.reason),
                            strForQuery(ropEnrollment.ropNumber),
                            strForQuery(ropEnrollment.repBy),
                            strForQuery(ropEnrollment.creBy)
                        );    
                        db.execute("COMMIT");
                    }       
                    db.close();
                }

            } catch (err) {
                Ti.API.error(err);
            } finally {
                finishSyncing();
                ropEnrollments = null;
            }
        }
    });

    var url = Alloy.Globals.instanceUrl + "services/apexrest/ropenrollment";
    // Ti.API.info(url);

    incidentHttpClient.open("GET", url);
    incidentHttpClient.setRequestHeader("content-type", "application/json");
    incidentHttpClient.setRequestHeader("Authorization", "OAuth" + " " + Alloy.Globals.accessToken);
    incidentHttpClient.send();
    
    url = null
    incidentHttpClient = null;
}

exports.syncCrewAppraisalPost = function(startSyncing, syncing, finishSyncing) {
    syncCrewAppraisalFunctionPost(finishSyncing);
};

function syncCrewAppraisalFunctionPost(finishSyncing) {

    var crewAppraisalHttpClient = Titanium.Network.createHTTPClient({
        timeout : 1000 * 30, // 30 seconds
        onerror : function(e) {
            Ti.API.error(e);
            Ti.API.error(this.responseText);
            var errorLog = null;
			if(e.code == -1009 || e.source.status == -1009){
				
				errorLog = {
					type : 1 // 1 = Network error
				};
			}
			if(e.code == -1200 || e.source.status == -1200){
				
				errorLog = {
					type : 2 // 2 = SSL error has occurred and a secure connection
				};
			}
			if(e.code == -1001 || e.source.status == -1001){
				
				errorLog = {
					type : 3 // 3 = Request Timeout
				};
			}
			if(errorLog != null){
				logTemp.push(errorLog);
			}
            log.logError(this.responseText, "POST Crew Appraisal",3);
            
            if (e.code == 401 || e.source.status == 401) {
                syncErrorAutoIncident(e);
            }
            else {
                finishSyncing([]);
            }
                
            /*
            if (e.code == -1 || e.code == -1001 || e.code == 500) {
                finishSyncing([]);
            }
            else {
                syncErrorAutoIncident(e);
            }
            */
        },
        onload : function(e) {
            var data;
            try {
                if(this.responseText != null) {
                   data = JSON.parse(this.responseText);                    
                } else {
                   data = null; 
                }
                // checkDataSize(this.responseText);
                if (data != null) {
                    query_lib.updateCrewAppraisalPostReturn(data);
                    // Ti.API.info("Crew Appraisal data return from SFDC : ");
//                    Ti.API.info(data);
                } else {
                    // Ti.API.info("Null data");
                }
            } catch (err) {
                Ti.API.error(err);
            } finally {
                finishSyncing();
            }

            data = null;
        }
    });

    var url = Alloy.Globals.instanceUrl + "services/apexrest/crewappraisal";
    // Ti.API.info(url);

    var crewAppraisals = query_lib.getCrewAppraisalAnswerForSFDC();
    var params = {
        "crewAppraisalAnswers" : crewAppraisals
    };
        
    // Ti.API.info(JSON.stringify(params));
    // checkDataSize(JSON.stringify(params));

    crewAppraisalHttpClient.open("POST", url);
    crewAppraisalHttpClient.setRequestHeader("content-type", "application/json");
    crewAppraisalHttpClient.setRequestHeader("Authorization", "OAuth " + Alloy.Globals.accessToken);
    crewAppraisalHttpClient.send(JSON.stringify(params));

    params = null;
    url = null;
    crewAppraisals = null;
}

exports.syncUpgradeSeatPost = function(startSyncing, syncing, finishSyncing) {
    syncUpgradeSeatFunctionPost(finishSyncing);
};

function syncUpgradeSeatFunctionPost(finishSyncing) {

    var upgradeSeatList = query_lib.getUpgradeSeatDataForSync();
    var upgradeSeat1Record = [];
    if(upgradeSeatList != null && upgradeSeatList.length > 0) {
        var countRecord = 0;
        for(var i = 0; i < upgradeSeatList.length; i++) {
            upgradeSeat1Record = [];
            upgradeSeat1Record.push(upgradeSeatList[i]);        
        
            var incidentHttpClient = Titanium.Network.createHTTPClient({
                timeout : 1000 * 30, // 30 seconds
                onerror : function(e) {
                    countRecord++;
                    Ti.API.error(e);
                    Ti.API.error(this.responseText);
                    var errorLog = null;
                    if(e.code == -1009 || e.source.status == -1009){
                        
                        errorLog = {
                            type : 1 // 1 = Network error
                        };
                    }
                    if(e.code == -1200 || e.source.status == -1200){
                        
                        errorLog = {
                            type : 2 // 2 = SSL error has occurred and a secure connection
                        };
                    }
                    if(e.code == -1001 || e.source.status == -1001){
                        
                        errorLog = {
                            type : 3 // 3 = Request Timeout
                        };
                    }
                    if(errorLog != null){
                        logTemp.push(errorLog);
                    }
                    log.logError(this.responseText, "POST Upgrade Seat",4);
                    
                    if (e.code == 401 || e.source.status == 401) {
                    }
                    else {
//                        finishSyncing([]);
                    }
                    if(countRecord==upgradeSeatList.length) {
                       finishSyncing();
                        upgradeSeatList = null;
                        upgradeSeat1Record = null;
                    }
                        
                },
                onload : function(e) {
                    countRecord++;
                    var data;
                    try {
        //                Ti.API.info(this.responseText);
                        if(this.responseText != null) {
                           data = JSON.parse(this.responseText);                    
                        } else {
                           data = null; 
                        }
        
                        Ti.API.info("Upgrade seat data return from SFDC : ");
                        if (data != null) {
                            query_lib.updateUpgradeSeatPostReturn(data);
                            // Ti.API.info(data);
                        } else {
                            // Ti.API.info("Null data");
                        }
                    } catch (err) {
    //                    Ti.API.error(err);
    //                    log.logError(err, "POST Upgrade Seat",3);
                    } finally {
    //                    finishSyncing();
                    }
                    if(countRecord==upgradeSeatList.length) {
                       finishSyncing();
                        upgradeSeatList = null;
                        upgradeSeat1Record = null;
                    }        
                    data = null;
                }
            });
        
            var url = Alloy.Globals.instanceUrl + "services/apexrest/upgradeseat";
            // Ti.API.info(url);
        
            var params = {
                "upgradeSeatList" : upgradeSeat1Record
            };
            
            // Ti.API.info("Upgrade Seat JSON data:");
            // Ti.API.info(JSON.stringify(params));
            incidentHttpClient.open("POST", url);
            incidentHttpClient.setRequestHeader("content-type", "application/json");
            incidentHttpClient.setRequestHeader("Authorization", "OAuth " + Alloy.Globals.accessToken);
            incidentHttpClient.send(JSON.stringify(params));
        
            url = null;
            params = null;
            incidentHttpClient = null;
        }
        
    } else {
        finishSyncing();         
    }
}


exports.syncIncidentPost = function(startSyncing, syncing, isBackground, finishSyncing) {
    syncIncidentFunctionPost(finishSyncing, isBackground);
};

function syncIncidentFunctionPost(finishSyncing, isBackground) {

    var incidentHttpClient = Titanium.Network.createHTTPClient({
        timeout : 1000 * 30, // 30 seconds
        onerror : function(e) {
            Ti.API.error(e);
            Ti.API.error(this.responseText);
            if(!isBackground){
            	var errorLog = null;
				if(e.code == -1009 || e.source.status == -1009){
					
					errorLog = {
						type : 1 // 1 = Network error
					};
				}
				if(e.code == -1200 || e.source.status == -1200){
					
					errorLog = {
						type : 2 // 2 = SSL error has occurred and a secure connection
					};
				}
				if(e.code == -1001 || e.source.status == -1001){
					
					errorLog = {
						type : 3 // 3 = Request Timeout
					};
				}
				if(errorLog != null){
					logTemp.push(errorLog);
				}
            }
            
            log.logError(this.responseText, "POST Incident",3);
            if (e.code == 401 || e.source.status == 401) {
                syncErrorAutoIncident(e);
            }
            else {
                finishSyncing([]);
            }
                
            /*
            if (e.code == -1 || e.code == -1001 || e.code == 500) {
                finishSyncing([]);
            }
            else {
                syncErrorAutoIncident(e);
            }
            */
        },
        onload : function(e) {
            var data;
            try {
                if(this.responseText != null) {
                   data = JSON.parse(this.responseText);                    
                } else {
                   data = null; 
                }
                // checkDataSize(this.responseText);
                if (data != null) {
                    query_lib.updateIncidentPostReturn(data);
                    // Ti.API.info("Incident data return from SFDC : ");
                    // Ti.API.info(data);
                } else {
                    // Ti.API.info("Null data");
                }
            } catch (err) {
                Ti.API.error(err);
            } finally {
                finishSyncing();
            }

            data = null;
        }
    });

    var url = Alloy.Globals.instanceUrl + "services/apexrest/incident";
    // Ti.API.info(url);

    var incidentList = query_lib.getSubmittedIncidentsByFlightIdForSync(currentFlightId);
    // Ti.API.info(incidentList);
    var params = {
        "incidentList" : incidentList
    };
    // Ti.API.info(params);
    
    // Ti.API.info(JSON.stringify(params));
    // checkDataSize(JSON.stringify(params));

    incidentHttpClient.open("POST", url);
    incidentHttpClient.setRequestHeader("content-type", "application/json");
    incidentHttpClient.setRequestHeader("Authorization", "OAuth " + Alloy.Globals.accessToken);
    incidentHttpClient.send(JSON.stringify(params));

	url = null;
    params = null;
    incidentList = null;
    incidentHttpClient = null;
}

exports.syncCompensationAttachment = function(startSyncing, syncing, finishSyncing) {

    compensationAttachments = query_lib.getSubmittedIncidentCompensationAttachments();
    Ti.API.info("Start compensation attachment data:");
   // Ti.API.info(compensationAttachments);
    syncCompensationAttachmentFunction(finishSyncing);
};

function syncCompensationAttachmentFunction(finishSyncing) {

    if (compensationAttachments == null || compensationAttachments == undefined || compensationAttachments.length == 0) {
        finishSyncing();
    } 
    else {
        var count = 0;
        
        for(var i = 0; i < compensationAttachments.length; i++) {
            var attachment = compensationAttachments[i];
    		
            var incidentHttpClient = Titanium.Network.createHTTPClient({
                timeout : 1000 * 30, // 30 seconds
                onerror : function(e) {
                	count++;
//                    Ti.API.error(e);
//                    Ti.API.error(this.responseText);
                    var errorLog = null;
                    if(e.code == -1009 || e.source.status == -1009){
                        
                        errorLog = {
                            type : 1 // 1 = Network error
                        };
                    }
                    if(e.code == -1200 || e.source.status == -1200){
                        
                        errorLog = {
                            type : 2 // 2 = SSL error has occurred and a secure connection
                        };
                    }
                    if(e.code == -1001 || e.source.status == -1001){
                        
                        errorLog = {
                            type : 3 // 3 = Request Timeout
                        };
                    }
                    if(errorLog != null){
                        logTemp.push(errorLog);
                    }
                    log.logError(this.responseText, "POST Compensation Attachment",3);
                    if(count == compensationAttachments.length) {
	                	finishSyncing();
	                	compensationAttachments = null;               
	            	} 
//                    syncCompensationAttachmentFunction(index + 1, finishSyncing);
                },
                onload : function(e) {
                	count++;
                    var data;
                    try {
                        if(this.responseText != null) {
                           data = JSON.parse(this.responseText);                    
                        } else {
                           data = null; 
                        }
                        // checkDataSize(this.responseText);
                        // Ti.API.info("Compensation Attachment Return:");                    
    //                    Ti.API.info(data);                    
                        if (data != null) {
                            query_lib.updateCompensationAttachmentSyncStatusCompleted(data.salesforceId[0], data.parentId);
                        } else {
    //                        Ti.API.info("Null data");
                        }
                    } catch (err) {
    //                    Ti.API.error(err);
                    } finally {
                        data = null;
    //                    syncCompensationAttachmentFunction(index + 1, finishSyncing);
                    }
                    if(count == compensationAttachments.length) {
		                finishSyncing();
		                compensationAttachments = null;       
		            }
                }
            });
    
            var url = Alloy.Globals.instanceUrl + "services/apexrest/compensation/attachment";
    
            var filepath = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "compensationAttachment";
                // Ti.API.info("Image path:");            
                // Ti.API.info(filepath);            
    
            var file = Ti.Filesystem.getFile(filepath, attachment.path);
            var blob;
            if (file != null) {
    //            Ti.API.info("Image not null");            
                blob = file.read();
            } else {
    //            Ti.API.info("Image not null");                        
            }
    
            var attachment64 = blob != null ? Ti.Utils.base64encode(blob).toString() : "";
            if (file.getSize() < ATTACHMENT_SIZE_LIMIT) {
                var bodies = chunkSubstr(attachment64, 5);
    
                var fileExtension = file.extension();
                var contentType = "";
                if (fileExtension == "jpg" || fileExtension == "jpeg") {
                    contentType = "image/jpeg";
                } else if (fileExtension == "png") {
                    contentType = "image/png";
                }
                            
                var attachmentParam = {
                    attachmentId : attachment.id,
                    name : attachment.path,
                    contenttype : contentType,
                    parentId : attachment.compensationId,
                    description : attachment.detail,
                    body : bodies
                };
    
                var params = {
                    "receiveAttachment" : attachmentParam
                };
    
             // Ti.API.info(JSON.stringify(params));
    
                // checkDataSize(JSON.stringify(params));
                incidentHttpClient.open("POST", url);
                incidentHttpClient.setRequestHeader("content-type", "application/json");
                incidentHttpClient.setRequestHeader("Authorization", "OAuth" + " " + Alloy.Globals.accessToken);
                incidentHttpClient.send(JSON.stringify(params));
    
                params = null;
                attachmentParam = null;
                bodies = null;
                incidentHttpClient = null;
            } else {
//                Ti.API.error("Attachment file is larger than limit (" + ATTACHMENT_SIZE_LIMIT + ")");
                log.logError("Attachment file is larger than limit (" + ATTACHMENT_SIZE_LIMIT + ")", "POST Attachment",5);
            }
    
            attachment = null;
            attachment64 = null;
            file = null;
            blob = null;
            filepath = null;
            body = null;
                           
        }
    }
}


exports.syncIncidentAttachment = function(startSyncing, syncing, isBackground, finishSyncing) {

    // First get all the attachment paths, but convert attachments to Base64 string here
    // So that Base64 string are not passed through parameters.
    // Save memory
    incidentAttachments = query_lib.getSubmittedIncidentAttachments(isBackground);
    syncIncidentFunctionAttachment(finishSyncing, isBackground);
};

function syncIncidentFunctionAttachment(finishSyncing, isBackground) {

    if (incidentAttachments == null || incidentAttachments == undefined || incidentAttachments.length == 0) {
        finishSyncing();
    } 
    else {
        var countRecord=0;
        for(var i = 0; i < incidentAttachments.length; i++) {
            var attachment = incidentAttachments[i];
    
            var incidentHttpClient = Titanium.Network.createHTTPClient({
                // timeout : 1000 * 30, // 30 seconds
                onerror : function(e) {
                    countRecord++;
                    Ti.API.error(e);
                    Ti.API.error(this.responseText);
                    if(!isBackground){
                        var errorLog = null;
                        if(e.code == -1009 || e.source.status == -1009){
                            
                            errorLog = {
                                type : 1 // 1 = Network error
                            };
                        }
                        if(e.code == -1200 || e.source.status == -1200){
                            
                            errorLog = {
                                type : 2 // 2 = SSL error has occurred and a secure connection
                            };
                        }
                        if(e.code == -1001 || e.source.status == -1001){
                            
                            errorLog = {
                                type : 3 // 3 = Request Timeout
                            };
                        }
                        if(errorLog != null){
                            logTemp.push(errorLog);
                        }
                    }
                    log.logError(this.responseText, "POST Attachment",3);
                    if(countRecord==incidentAttachments.length) {
                        incidentAttachments = null;
                        finishSyncing();
                    }
                },
                onload : function(e) {
                    countRecord++;
                    var data;
                    try {
                        if(this.responseText != null) {
                           data = JSON.parse(this.responseText);                    
                        } else {
                           data = null; 
                        }
                        // checkDataSize(this.responseText);
                        if (data != null) {
                            //                      Ti.API.info("SFDC id = "+data.salesforceId + " " + "Attachment id = "+ data.attachmentId);
                            query_lib.updateAttachmentSyncStatusCompleteById(data.salesforceId[0], data.attachmentId);
                        } else {
    //                        Ti.API.info("Null data");
                        }
                    } catch (err) {
                        Ti.API.error(err);
                    } finally {
                        data = null;
                    }
                    if(countRecord==incidentAttachments.length) {
                        incidentAttachments = null;
                        finishSyncing();
                    }
                }
            });
    
            var url = Alloy.Globals.instanceUrl + "services/apexrest/attachment";
    
            var filepath = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "incidentAttachment";
            var file = Ti.Filesystem.getFile(filepath, attachment.path);
            var blob;
            if (file != null) {
                blob = file.read();
            }
    
            var attachment64 = blob != null ? Ti.Utils.base64encode(blob).toString() : "";
            if (file.getSize() < ATTACHMENT_SIZE_LIMIT) {
                var bodies = chunkSubstr(attachment64, 5);
    
                var fileExtension = file.extension();
                var contentType = "";
                if (fileExtension == "jpg" || fileExtension == "jpeg") {
                    contentType = "image/jpeg";
                } else if (fileExtension == "png") {
                    contentType = "image/png";
                }
                else if (fileExtension == "mp4") {
                    contentType = "video/mp4";
                }
                else if (fileExtension == "mov") {
                    contentType = "video/quicktime";
                }
                            
                var attachmentParam = {
                    attachmentId : attachment.id,
                    name : attachment.path,
                    contenttype : contentType,
                    parentId : attachment.incidentId,
                    description : attachment.detail,
                    body : bodies
                };
    
                var params = {
                    "receiveAttachment" : attachmentParam
                };
    
    //          Ti.API.info(JSON.stringify(params));
                // checkDataSize(JSON.stringify(params));
    
                incidentHttpClient.open("POST", url);
                incidentHttpClient.setRequestHeader("content-type", "application/json");
                incidentHttpClient.setRequestHeader("Authorization", "OAuth" + " " + Alloy.Globals.accessToken);
                incidentHttpClient.send(JSON.stringify(params));
    
                params = null;
                attachmentParam = null;
                bodies = null;
                fileExtension = null;
                incidentHttpClient = null;

                attachment = null;
                attachment64 = null;
                file = null;
                blob = null;
                body = null;
            } else {
                Ti.API.error("Attachment file is larger than limit (" + ATTACHMENT_SIZE_LIMIT + ")");
                log.logError("Attachment file is larger than limit (" + ATTACHMENT_SIZE_LIMIT + ")", "POST Attachment",5);
            }
                
        }
    }
}

function chunkSubstr(str, numChunks) {
    var chunks = new Array(numChunks);
    var size = Math.floor(str.length / numChunks);
    for (var i = 0, o = 0; i < numChunks ; ++i, o += size) {
        if(i < numChunks - 1)
          chunks[i] = str.substr(o, size);
        else                
          chunks[i] = str.substr(o, str.length);
    }

    return chunks;
}

exports.syncCompleteIncidents = function(startSyncing, syncing, isBackground, finishSyncing) {
    var httpClient = Titanium.Network.createHTTPClient({
        timeout : 1000 * 30, // 30 seconds
        onerror : function(e) {
            Ti.API.error(e);
            Ti.API.error(this.responseText);
            if(!isBackground){
            	var errorLog = null;
				if(e.code == -1009 || e.source.status == -1009){
					
					errorLog = {
						type : 1 // 1 = Network error
					};
				}
				if(e.code == -1200 || e.source.status == -1200){
					
					errorLog = {
						type : 2 // 2 = SSL error has occurred and a secure connection
					};
				}
				if(e.code == -1001 || e.source.status == -1001){
					
					errorLog = {
						type : 3 // 3 = Request Timeout
					};
				}
				if(errorLog != null){
					logTemp.push(errorLog);
				}
            }
            log.logError(this.responseText, "POST Complete Incidents",3);
            finishSyncing();
        },
        onload : function(e) {
             Ti.API.info("syncCompleteIncidents");
            // checkDataSize(this.responseText);
            
            var responseIds;
            try {
                if(this.responseText != null) {
                   responseIds = JSON.parse(this.responseText);                    
                } else {
                   responseIds = null; 
                }
                
                // Ti.API.info(responseIds);
                if (responseIds != null && responseIds.length > 0) {
                    query_lib.updateIncidentsAsCompleted(responseIds);
                    // checkDataSize(this.responseText);
                }
            }
            catch (err) {
                Ti.API.error(err);
            }
            finally {
                responseIds = null;
                finishSyncing();
            }
            
        }
    });

    var url = Alloy.Globals.instanceUrl + "services/apexrest/flight";
    // Ti.API.info("syncCompleteIncidents:" + url);
    
    var mobileAppKeys = query_lib.getCompleteIncidentIds();
    var params = {
        "mobileAppKeyList" : mobileAppKeys
    };
    
    // Ti.API.info(JSON.stringify(params));
    // checkDataSize(JSON.stringify(params));

    httpClient.open("POST", url);
    httpClient.setRequestHeader("content-type", "application/json");
    httpClient.setRequestHeader("Authorization", "OAuth" + " " + Alloy.Globals.accessToken);
    httpClient.send(JSON.stringify(params));
    
    url = null;
    mobileAppKeys = null;
    params = null;
    httpClient = null;
};

exports.syncIncidentGet = function(startSyncing, syncing, finishSyncing) {
    syncIncidentFunctionGet(finishSyncing);
};

function syncIncidentFunctionGet(finishSyncing) {

    var incidentHttpClient = Titanium.Network.createHTTPClient({
        timeout : 1000 * 30, // 50 seconds
        onerror : function(e) {
            Ti.API.error(e);
            Ti.API.error(this.responseText);
            var errorLog = null;
			if(e.code == -1009 || e.source.status == -1009){
				
				errorLog = {
					type : 1 // 1 = Network error
				};
			}
			if(e.code == -1200 || e.source.status == -1200){
				
				errorLog = {
					type : 2 // 2 = SSL error has occurred and a secure connection
				};
			}
			if(e.code == -1001 || e.source.status == -1001){
				
				errorLog = {
					type : 3 // 3 = Request Timeout
				};
			}
			if(errorLog != null){
				logTemp.push(errorLog);
			}
            log.logError(this.responseText, "GET Incident",3);
            finishSyncing(null);
        },
        onload : function(e) {
            var incidents;
            try {
                if(this.responseText != null) {
                   incidents = JSON.parse(this.responseText);                    
                } else {
                   incidents = null; 
                }
                
                // checkDataSize(this.responseText);
                if (incidents != null && incidents.length > 0) {
                    var db = Ti.Database.open(Alloy.Globals.dbName);
                    var isInsertIncident = true;
                    for (var i = 0; i < incidents.length; i++) {
                        var incident = incidents[i];
                        
                        if(incident.inCate == SAFETY_EQUIPMENT || incident.inCate == AC_MAINTENANCE) {
                            if(incident.equipId == null || incident.equipId == undefined || utility.isEmpty(incident.equipId)) {
                                isInsertIncident = false;                                
                            } else {
                                isInsertIncident = true;
                            }
                        } else {
                            isInsertIncident = true;                            
                        }
                        
                        if(isInsertIncident) {
                            db.execute("BEGIN");
                            db.execute("INSERT OR REPLACE INTO Incident (id,flightId,reportType,equipmentId,partId,ataChapter,condition,logGroup,sequenceNumber," + 
                            "detail,changeSeat,createdBy,reportedBy,createDateTime,updateDateTime,incidentStatus,isLog," + 
                            "isMulti,isSubmitted,isVoided,isSynced,subject,category,sfdcId,emergencyType,acReg,flightNumber,sector,phone,email,upgradeChangeSeatType,reasonForChangeSeat"+
                            ") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", 
                            strForQuery(incident.id),
                            strForQuery(incident.fltId),
                            strForQuery(incident.rptType),
                            strForQuery(incident.equipId),
                            strForQuery(incident.partId),
                            "", // ATA Chapter
                            strForQuery(incident.condi),
                            incident.logType != null ? incident.logType : 0,
                            strForQuery(incident.seqNo),
                            strForQuery(incident.descr),
                            "", // Change seat
                            strForQuery(incident.creBy),
                            strForQuery(incident.repBy),
                            strForQuery(incident.creDT),
                            strForQuery(incident.updDT),
                            incident.status,
                            boolForQuery(incident.isLog),
                            boolForQuery(incident.isMulti),
                            boolForQuery(false), // isSubmitted
                            boolForQuery(incident.isVoided), // isVoided
                            boolForQuery(incident.isSynced),
                            strForQuery(incident.subject),
                            incident.inCate,
                            incident.sfdcId,
                            incident.emerType,
                            strForQuery(incident.acReg),
                            strForQuery(incident.fltNum),
                            "",
                            strForQuery(incident.phone),
                            strForQuery(incident.email),
                            incident.upChgType,                        
                            strForQuery(incident.reasonChangeSeat)
                            );    
                            db.execute("COMMIT");
                            
                        }
                        
                        var passengers = incident.paxMem;
                        if (passengers != null && passengers.length > 0) {
                            db.execute("BEGIN");
                            db.execute("DELETE FROM PaxGroupMember WHERE incidentId=?", incident.id);  
                            db.execute("COMMIT");      
                            for (var j = 0; j < passengers.length; j++) {
                                var passenger = passengers[j];
                                db.execute("BEGIN");
                                db.execute("INSERT INTO PaxGroupMember (paxId, role, detail, incidentId, type, accountId, paxKey) VALUES (?,?,?,?,?,?,?)", 
                                    strForQuery(passenger.id), 
                                    strForQuery(passenger.role), 
                                    strForQuery(passenger.detail), 
                                    strForQuery(incident.id), 
                                    "",
                                    strForQuery(passenger.accId),
                                    strForQuery(passenger.paxKey)
                                );
                                db.execute("COMMIT");
                                passenger = null;
                            }
                            passengers = null;
                        }
                        
                        var crews = incident.crewMem;
                        if (crews != null && crews.length > 0) {
                            db.execute("BEGIN");
                            db.execute("DELETE FROM CrewGroupMember WHERE incidentId=?", incident.id);
                            db.execute("COMMIT");      
                            for (var j = 0; j < crews.length; j++) {
                                var crew = crews[j];
                                db.execute("BEGIN");
                                db.execute("INSERT INTO CrewGroupMember (crewId, role, detail, incidentId, type) VALUES (?,?,?,?,?)", 
                                    strForQuery(crew.id), 
                                    strForQuery(crew.role), 
                                    strForQuery(crew.detail), 
                                    strForQuery(incident.id), 
                                    ""
                                );
                                db.execute("COMMIT");
                                crew = null;  
                            }
                            crews = null;
                        }
                        
                        var staffs = incident.staffMem;
                        if (staffs != null && staffs.length > 0) {        
                            db.execute("BEGIN");
                            db.execute("DELETE FROM StaffGroupMember WHERE incidentId=?", incident.id);        
                            db.execute("COMMIT");      
                            for (var j = 0; j < staffs.length; j++) {
                                var staff = staffs[j];
                                db.execute("BEGIN");
                                db.execute("INSERT INTO StaffGroupMember (personnelId, name, role, detail, incidentId) VALUES (?,?,?,?,?)", 
                                    strForQuery(staff.id), 
                                    strForQuery(staff.staffName), 
                                    strForQuery(staff.role), 
                                    strForQuery(staff.detail), 
                                    strForQuery(incident.id)
                                );
                                db.execute("COMMIT");
                                staff = null;   
                            }
                            staffs = null;
                        }

                        var positions = incident.posMem;
                        if (positions != null && positions.length > 0) {
                            db.execute("BEGIN");
                            db.execute("DELETE FROM PositionGroupMember WHERE incidentId=?", incident.id);
                            db.execute("COMMIT");      
                            for (var j = 0; j < positions.length; j++) {
                                var position = positions[j];
                                db.execute("BEGIN");
                                db.execute("INSERT INTO PositionGroupMember (positionId, name, incidentId) VALUES (?,?,?)", 
                                    strForQuery(position.id), 
                                    "", 
                                    strForQuery(incident.id)
                                );
                                db.execute("COMMIT");
                                position = null;
                            }
                            positions = null;
                        }
                        
                        var compensations = incident.compen;
                        if (compensations != null && compensations.length > 0) {
                            db.execute("BEGIN");
                            db.execute("DELETE FROM Compensation WHERE incidentId=?", incident.id);
                            db.execute("COMMIT");      
                            for (var j = 0; j < compensations.length; j++) {
                                var compensation = compensations[j];
                                db.execute("BEGIN");
                                    db.execute("INSERT INTO Compensation (detail, type, quantity, amount, incidentId, problem, currency, upgradeCer, iscFormNumber, itemCodeNumber, fromSeat, fromClass, toSeat, toClass, compenId, createdDateTime) "+
                                    "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", 
                                     compensation.detail, 
                                     compensation.type, 
                                     compensation.quantity, 
                                     compensation.amount, 
                                     strForQuery(incident.id),
                                     compensation.problem,
                                     compensation.currenc,
                                     compensation.upCer,
                                     compensation.iscFormNum,
                                     compensation.itemCodeNum,
                                     compensation.fromSeat,
                                     compensation.fromClass,
                                     compensation.toSeat,
                                     compensation.toClass,
                                     compensation.id,
                                     compensation.creDT
                           );
                                db.execute("COMMIT");
                                compensation = null;   
                            }
                            compensations = null;
                        }
                        var changeSeatMems = incident.chSeat;
                        if(changeSeatMems != null && changeSeatMems.length > 0) {
                            db.execute("BEGIN");
                            db.execute("DELETE FROM ChangeSeatGroupMember WHERE incidentId=?", incident.id);
                            db.execute("COMMIT");                                  
                            for (var j = 0; j < changeSeatMems.length; j++) {
                               db.execute("BEGIN");
                               db.execute("INSERT INTO ChangeSeatGroupMember (oldSeat, oldClass, newSeat, newClass, incidentId, createdDateTime) VALUES (?,?,?,?,?,?)", 
                                   changeSeatMems[j].fromSeat,
                                   changeSeatMems[j].fromClass,
                                   changeSeatMems[j].toSeat,
                                   changeSeatMems[j].toClass,
                                   strForQuery(incident.id),
                                   changeSeatMems[j].creDT
                              );                                
                               db.execute("COMMIT");                                  
                            }
                            changeSeatMems = null;
                        }

                    }       
                    db.close();
                }
            } catch (err) {
                Ti.API.error(err);
            } finally {
                finishSyncing();
                incidents = null;
            }
        }
    });

    var url = Alloy.Globals.instanceUrl + "services/apexrest/incident";
    // Ti.API.info(url);

    incidentHttpClient.open("GET", url);
    incidentHttpClient.setRequestHeader("content-type", "application/json");
    incidentHttpClient.setRequestHeader("Authorization", "OAuth" + " " + Alloy.Globals.accessToken);
    incidentHttpClient.send();
    
    url = null;
    incidentHttpClient = null;
}

// Top Case
exports.syncFeedback = function(startSyncing, syncing, finishSyncing) {
	syncFeedbackFunction(finishSyncing);
};

function syncFeedbackFunction(finishSyncing) {

	var passengerHttpClient = Titanium.Network.createHTTPClient({
		timeout : 1000 * 30, // 30 seconds
		onerror : function(e) {
			Ti.API.error(e);
			Ti.API.error(this.responseText);
			var errorLog = null;
			if(e.code == -1009 || e.source.status == -1009){
				
				errorLog = {
					type : 1 // 1 = Network error
				};
			}
			if(e.code == -1200 || e.source.status == -1200){
				
				errorLog = {
					type : 2 // 2 = SSL error has occurred and a secure connection
				};
			}
			if(e.code == -1001 || e.source.status == -1001){
				
				errorLog = {
					type : 3 // 3 = Request Timeout
				};
			}
			if(errorLog != null){
				logTemp.push(errorLog);
			}
			log.logError(this.responseText, "GET Passenger Feedback",3);
			finishSyncing(false);
		},
		onload : function(e) {
			try {
				var feedbacks;
				if(this.responseText != null) {
                   feedbacks = JSON.parse(this.responseText);                    
                } else {
                   feedbacks = null; 
                }
                
                // checkDataSize(this.responseText);
				if (feedbacks != null && feedbacks.length > 0) {
                    var db = Ti.Database.open(Alloy.Globals.dbName);
                    
                    db.execute("BEGIN");
                    // Ti.API.info("flight number : " + flightNumberList);
                    for(var i = 0; i < flightNumberList.length; i++) {
                    	db.execute("DELETE FROM PassengerFeedback WHERE flightNumber=?",flightNumberList[i]);
                    }
                    flightNumberList = [];
                    db.execute("COMMIT");
                    
                    db.execute("BEGIN");
                    for(var i=0;i<feedbacks.length;i++){
                    	var feedback = feedbacks[i];
                    	db.execute("INSERT INTO PassengerFeedback (type,total,class,issueType,flightNumber) VALUES (?,?,?,?,?)",feedback.type,feedback.total,feedback.tClass,feedback.issueType,feedback.flightNumber);
                    }
                    db.execute("COMMIT");
                    db.close();
				} else {
					// Ti.API.info("Null data");
				}
			} catch (err) {
				Ti.API.error(err);
			} finally {
				data = null;
				finishSyncing(true);
				//	finishSyncUserInfo(finishSyncing);
			}
		}
	});

	var url = Alloy.Globals.instanceUrl + "services/apexrest/topcase";
	// Ti.API.info(url);
	passengerHttpClient.open("GET", url);
	passengerHttpClient.setRequestHeader("content-type", "application/json");
	passengerHttpClient.setRequestHeader("Authorization", "OAuth " + Alloy.Globals.accessToken);
	passengerHttpClient.send();
	
	url = null;
	passengerHttpClient = null;
};

exports.syncPassengers = function(startSyncing, syncing, finishSyncing) {
	syncPassengersFunction(finishSyncing);
};

function syncPassengersFunction(finishSyncing) {

	var passengerHttpClient = Titanium.Network.createHTTPClient({
		timeout : 1000 * 30, // 30 seconds
		onerror : function(e) {
			Ti.API.error(e);
			Ti.API.error(this.responseText);
			var errorLog = null;
			if(e.code == -1009 || e.source.status == -1009){
				
				errorLog = {
					type : 1 // 1 = Network error
				};
			}
			if(e.code == -1200 || e.source.status == -1200){
				
				errorLog = {
					type : 2 // 2 = SSL error has occurred and a secure connection
				};
			}
			if(e.code == -1001 || e.source.status == -1001){
				
				errorLog = {
					type : 3 // 3 = Request Timeout
				};
			}
			if(errorLog != null){
				logTemp.push(errorLog);
			}
			log.logError(this.responseText, "GET Passenger",3);
			finishSyncing(false);
		},
		onload : function(e) {
			try {
				var passengers;
				if(this.responseText != null) {
                   passengers = JSON.parse(this.responseText);                    
                } else {
                   passengers = null; 
                }
                
                //Ti.API.info(passengers);
                // checkDataSize(this.responseText);
				if (passengers != null && passengers.length > 0) {
                    var db = Ti.Database.open(Alloy.Globals.dbName);
                    
                    db.execute("BEGIN");
                    // Ti.API.info("flight id : " + flightIds);
                    for(var i = 0; i < flightIds.length; i++) {
                        db.execute("DELETE FROM SSR WHERE flightId=?",flightIds[i]);
                        db.execute("DELETE FROM PassengerPsychology WHERE flightId=?",flightIds[i]);
                        db.execute("DELETE FROM Passenger WHERE flightId=?",flightIds[i]);                    
                    }
                        // flightIds = [];
                    db.execute("COMMIT");
        
                    for (var index = 0; index < passengers.length; index++) {
                        var passenger = passengers[index];
                        var psy = passenger.psy;
                        var searchInfant="";
                        if(passenger.hasInfant==1){
                            searchInfant="INFANT ";
                            if(passenger.infName!=null){
                                searchInfant+=passenger.infName;
                            }
                        }
                        db.execute("BEGIN");
                        var upgrade = null;
                        if (passenger.upgrade != null){
                        	upgrade = "";
	                        for (var i=0; i < passenger.upgrade.length; i++) {
	                        	upgrade += passenger.upgrade[i];
	                        	if(i != passenger.upgrade.length-1){
	                        		upgrade += ",";
	                        	}
	                        }
	                    }
	                    var dateForSearch = null;
	                    var stdForSearch = null;
	                    if (passenger.connectingfltstd != null){
	                    	var conDate = new Date(passenger.connectingfltstd);
	                    	var monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
	                    	dateForSearch = ("0" + conDate.getUTCDate()).slice(-2)+" "+monthNames[conDate.getUTCMonth()];
	                    	stdForSearch = ("0" + conDate.getUTCHours()).slice(-2)+":"+("0" + conDate.getUTCMinutes()).slice(-2);
	                    }
                        db.execute('INSERT OR REPLACE INTO `Passenger`(`id`, `flightId`, `legNumber`,`pnrNumber`,`bookingSeat`, 
                            `firstName`, `lastName`, `image`, `gender`, `dateOfBirth`, 
                            `nationality`, `phone`, `mobile`, `email1`, `email2`, 
                            `bookingClass`, `baggage`, `infantName`, `infantAge`, `hasInfant`, 
                            `boardPoint`, `offPoint`,`searchClass`, `searchDest`,`searchInfant`,`isStaff`,
                            `searchStaff`,`accountId`,`paxKey`,`upgrade`,`oldSeat`, `oldClass`,
                            `conFlightSTD`,`conFlightSegment`,`conFlightNumber`,`conFlightDate`,
                            `searchConSTD`,`searchConDate`,`memberId`, `salutation`) 
                            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', 
                            passenger.id, 
                            passenger.fltId, 
                            passenger.legNo, 
                            passenger.pnrNo, 
                            passenger.changeSeat != null ? passenger.changeSeat : passenger.bSeat, 
                            passenger.firstN, 
                            passenger.lastN, 
                            passenger.image, 
                            passenger.gender, 
                            passenger.birth != null ? convertDate(passenger.birth) : null, 
                            passenger.nat, 
                            passenger.phone, 
                            passenger.mobile, 
                            passenger.email1, 
                            passenger.email2, 
                            passenger.changeClass != null ? passenger.changeClass : passenger.cabin, 
                            passenger.bag, 
                            passenger.infName, 
                            passenger.infAge, 
                            passenger.hasInfant, 
                            passenger.boardPoint, 
                            passenger.offPoint,
                            "CLASS "+ (passenger.changeClass != null ? passenger.changeClass : passenger.cabin),
                            "DEST "+passenger.offPoint,
                            searchInfant,
                            passenger.isStaff==1 ? 1 : 0,
                            passenger.isStaff==1 ? "STAFF" : "",
                            passenger.accId,
                            passenger.paxKey,
                            upgrade,
                            passenger.changeSeat != null ? passenger.bSeat : null, 
                            passenger.changeClass != null ? passenger.cabin : null,
                            passenger.connectingfltstd,
                            passenger.connectingfltsegment,
                            passenger.connectingfltno,
                            passenger.connectingfltdate,
                            stdForSearch,
                            dateForSearch,
                            passenger.memberships.length > 0 ? passenger.memberships[0].id : null,
                            passenger.title
                        );
                        if(passenger.changeSeat != null || passenger.changeClass != null) {
                            var changeSeatData = {
                                oldSeat : passenger.bSeat,
                                oldClass : passenger.cabin,
                                newSeat : passenger.changeSeat,
                                newClass : passenger.changeClass,
                                ropTier : "",
                                flightId : passenger.fltId
  
                            };                 
                            if (passenger.memberships.length > 0) {
                                for (var k = 0; k < passenger.memberships.length; k++) {
                                    if (passenger.memberships[k].airline == "TG") {
                                        if (passenger.memberships[k].tier == "SILV") {
                                            changeSeatData.ropTier = "SILVER";
                                        } else if (passenger.memberships[k].tier == "PLAT") {
                                            changeSeatData.ropTier = "PLATINUM";
                                        } else if (passenger.memberships[k].tier == "GOLD") {
                                            changeSeatData.ropTier = "GOLD";
                                        } else if (passenger.memberships[k].tier == "BASE"){
                                            changeSeatData.ropTier = "BASIC";
                                        } else {
                                            changeSeatData.ropTier = "";
                                        }
                                    }
                                }
                             }                            
                           changeSeatList.push(changeSeatData);           
                        }

                        db.execute("COMMIT");
                        
                        db.execute("BEGIN");
                        if (passenger.accId != null){
                        	db.execute('INSERT OR REPLACE INTO `PassengerPsychology`(`accountId`, `like`, `dislike`, `other`, `bySale`, `byGround`, `paxKey`, `flightId`, `isSync`) VALUES (?,?,?,?,?,?,?,?,?)', passenger.accId, psy.ifLike, psy.ifDislike, psy.ifOther, psy.sale, psy.ground, passenger.paxKey, passenger.fltId, true);
                        }
                        db.execute("COMMIT");
                        if (passenger.memberships.length > 0) {
                            for (var iMenber = 0; iMenber < passenger.memberships.length; iMenber++) {
                                var menber = passenger.memberships[iMenber];
                                if (menber.airline == "TG") {
                                    var tier = menber.tier;
                                    if (tier == "SILV") {
                                        tier = "SILVER";
                                    } else if (tier == "PLAT") {
                                        tier = "PLATINUM";
                                    } else if (tier == "GOLD") {
                                        tier = "GOLD";
                                    } else if (tier == "BASE"){
                                        tier = "BASIC";
                                    } else {
                                        tier = "";
                                    }
                
                                    db.execute("BEGIN");
                                    db.execute('INSERT OR REPLACE INTO `ROP`(`id`, `passengerId`, `ropTier`, 
                                        `mailingAddress`, `businessPhone`, `mobile`, `email`, `email2`, 
                                        `ropMileage`, `expiringMileage`, `seatPreference`, 
                                        `favoriteFood`, `occupation`, `languagePreference`,`homePhone`,
                                        foodPreference,drinkPreference,searchROP,isExpired) 
                                        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', 
                                        menber.id, passenger.id, tier, menber.addr, menber.bPhone, menber.mobile, menber.email1, menber.email2, 
                                        menber.mi, menber.expMi, menber.seatPre, menber.favFood, 
                                        menber.occup, menber.lang, menber.hPhone,menber.food,menber.drink,"ROP "+tier,passenger.isExpired
                                    );
                                    db.execute("COMMIT");
                                    break;
                                }
                            }
                        }
                
                        if (passenger.ssr_spm != null) {
                              for ( iSSR = 0; iSSR < passenger.ssr_spm.length; iSSR++) {
                                    var remarkSSR = '';
                                    if(passenger.ssr_spm[iSSR].remark!=null)remarkSSR=passenger.ssr_spm[iSSR].remark;
                                   
                                    var statusSSR='';
                                     if(passenger.ssr_spm[iSSR].status!=null)statusSSR=passenger.ssr_spm[iSSR].status;
                                    
                                     var typeSSR='';
                                    if(passenger.ssr_spm[iSSR].type!=null)typeSSR=passenger.ssr_spm[iSSR].type;
                                    
                                    var searchType='';
                                    if(typeSSR!=""){ searchType="TYPE "+typeSSR;}
                                    var searchStatus='';
                                    if(statusSSR!=""){ searchStatus="STATUS "+statusSSR;}
                                    db.execute("BEGIN");
                                    db.execute('INSERT INTO `SSR`(`passengerId`, `type`, `remark`, `status`, `service`, `ssrType`, `searchType`, `searchStatus`, `flightId`) VALUES (?,?,?,?,?,?,?,?,?)', passenger.id,typeSSR, remarkSSR,statusSSR, "in-flight","specialMeal", searchType, searchStatus, passenger.fltId);
                                    db.execute("COMMIT");
                                }
                        }
                        if (passenger.ssr_sv != null) {
                            for ( iSSR = 0; iSSR < passenger.ssr_sv.length; iSSR++) {
                                var remarkSSR = '';
                                if(passenger.ssr_sv[iSSR].remark!=null)remarkSSR=passenger.ssr_sv[iSSR].remark;
                               
                                var statusSSR='';
                                if(passenger.ssr_sv[iSSR].status!=null)statusSSR=passenger.ssr_sv[iSSR].status;
                                
                                var typeSSR='';
                                if(passenger.ssr_sv[iSSR].type!=null)typeSSR=passenger.ssr_sv[iSSR].type;
                                
                                var searchType='';
                                if(typeSSR!=""){ searchType="TYPE "+typeSSR;}
                                var searchStatus='';
                                if(statusSSR!=""){ searchStatus="STATUS "+statusSSR;}
                                
                                db.execute("BEGIN");
                                db.execute('INSERT INTO `SSR`(`passengerId`, `type`, `remark`, `status`, `service`, `ssrType`, `searchType`, `searchStatus`, `flightId`) VALUES (?,?,?,?,?,?,?,?,?)', passenger.id,typeSSR, remarkSSR,statusSSR, "in-flight", "service", searchType, searchStatus, passenger.fltId);
                                db.execute("COMMIT");
                            }
                        }
                    }
                    db.close();
				} else {
					// Ti.API.info("Null data");
				}
			} catch (err) {
				Ti.API.error(err);
			} finally {
				passengers = null;
				finishSyncing(true);
				//	finishSyncUserInfo(finishSyncing);
			}
		}
	});

	var url = Alloy.Globals.instanceUrl + "services/apexrest/passenger";
	// Ti.API.info(url);
	passengerHttpClient.open("GET", url);
	passengerHttpClient.setRequestHeader("content-type", "application/json");
	passengerHttpClient.setRequestHeader("Authorization", "OAuth " + Alloy.Globals.accessToken);
	passengerHttpClient.send();
	
	url = null;
	passengerHttpClient = null;
};

exports.syncLOPA = function(startSyncing, syncing, finishSyncing) {
	
	syncLOPAFunction(finishSyncing);
};

function syncLOPAFunction(finishSyncing) {

	var lopaHttpClient = Titanium.Network.createHTTPClient({
		timeout : 1000 * 30, // 30 seconds
		onerror : function(e) {
			Ti.API.error(e);
			Ti.API.error(this.responseText);
			var errorLog = null;
			if(e.code == -1009 || e.source.status == -1009){
				
				errorLog = {
					type : 1 // 1 = Network error
				};
			}
			if(e.code == -1200 || e.source.status == -1200){
				
				errorLog = {
					type : 2 // 2 = SSL error has occurred and a secure connection
				};
			}
			if(e.code == -1001 || e.source.status == -1001){
				
				errorLog = {
					type : 3 // 3 = Request Timeout
				};
			}
			if(errorLog != null){
				logTemp.push(errorLog);
			}
			log.logError(this.responseText, "GET LOPA", 3);
			finishSyncing(false);

		},
		onload : function(e) {
			var _data;
			try {
				if(this.responseText != null) {
                   _data = JSON.parse(this.responseText);                    
                } else {
                   _data = null; 
                }
                
                
                            
                // checkDataSize(this.responseText);
				if (_data != null && _data.length > 0) {
                    var db = Ti.Database.open(Alloy.Globals.dbName);
                    
                    db.execute("BEGIN");
	                for(var i = 0; i < _data.length; i++) {
	                   db.execute("DELETE FROM LOPA WHERE flightId=?",flightIds[i]);
	                   db.execute("DELETE FROM LOPAPosition WHERE flightId=?",flightIds[i]);                    
	                }
                    db.execute("COMMIT");
                    	
                    db.execute("BEGIN");
                    for(var indexF = 0; indexF < _data.length; indexF++){
                    	
                        var lopa = _data[indexF];
                        var flightId = lopa.id;
                        var lopaPos = _data[indexF].lopaPos;
                        var lopaTemp = 0;
                        var lopaCount = 0;
                        
                        for (var index = 0; index < lopaPos.length; index++) {
                            var position = lopaPos[index];
                            if (lopaTemp != position.lopaId) {
                                db.execute('INSERT OR REPLACE INTO LOPA (id, flightId, legId, maxColumn, maxRow, class, floor, zone) VALUES (?,?,?,?,?,?,?,?)', "lopaId" + position.lopaId + '_' + flightId, flightId, lopa.legId, position.maxCol, 0, position.tclass, position.floor, position.zone);
                                lopaTemp = position.lopaId;
                            }
                            
                            var width = position.width != null ? position.width : 0;
                            var height = position.height != null ? position.height : 0;
                            db.execute("INSERT INTO LOPAPosition (id, lopaId, type, row, column, position, compareDesignator, compareDetail, visibleFlag, status, class, floor, zone, flightId, width, height,searchFloor,searchZone, rowL, colL) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", position.pos + '_' + flightId, "lopaId" + position.lopaId + '_' + flightId, position.type, position.row, position.col, position.pos, "", "", position.flag, position.sts, position.tclass, position.floor, position.zone, flightId, width, height,position.floor,"ZONE "+position.zone, position.rowL, position.colL);
                            position = null;
                        }
                        
                        lopa = null;
                        flightId = null;
                        lopaPos = null;
                        lopaTemp = null;
                        lopaCount = null;
                
                      }
                      db.execute("COMMIT");
                      if(changeSeatList != null && changeSeatList.length > 0) {
                        for (var i = 0; i < changeSeatList.length; i++) {
                            db.execute("BEGIN");
                            db.execute("UPDATE LOPAPosition SET newStatus=? WHERE position=? AND flightId=?",component.changeOldSeatStatusOfLopaPosition(changeSeatList[i].oldSeat),changeSeatList[i].oldSeat,changeSeatList[i].flightId); //Available
                            db.execute("UPDATE LOPAPosition SET newStatus=? WHERE position=? AND flightId=?",component.changeNewSeatStatusOfLopaPosition(changeSeatList[i].newSeat,changeSeatList[i].ropTier),changeSeatList[i].newSeat,changeSeatList[i].flightId); //Occupied
                            db.execute("COMMIT");
                        }
                      }  
                      changeSeatList = [];                        
                    db.close();
				} else {
					// Ti.API.info("Null data");
				}
			} catch (err) {
				Ti.API.error(err);
			} finally {
				_data = null;
				//	finishSyncUserInfo(finishSyncing);
				finishSyncing(true);
			}
		}
	});

	var url = Alloy.Globals.instanceUrl + "services/apexrest/lopa";
	// Ti.API.info(url);
	//var params = {
	//	 "flightExternalIdList" : flightExIdList
	//};

	//Ti.API.info(JSON.stringify(salesVisitParam));
	//lopaHttpClient.send(JSON.stringify(params));
	//lopaHttpClient.open("POST", url);

	lopaHttpClient.open("GET", url);
	lopaHttpClient.setRequestHeader("content-type", "application/json");
	lopaHttpClient.setRequestHeader("Authorization", "OAuth" + " " + Alloy.Globals.accessToken);
	lopaHttpClient.send();
	//lopaHttpClient.send(JSON.stringify(params));
	url = null;
	lopaHttpClient = null;

}

exports.syncMasterData = function(startSyncing, syncing, finishSyncing) {
    syncMasterDataFunction(finishSyncing);
};

function syncMasterDataFunction(finishSyncing) {

    var masterDataHttpClient = Titanium.Network.createHTTPClient({
        timeout : 1000 * 30, // 30 seconds
        onerror : function(e) {
            Ti.API.error(e);
            Ti.API.error(this.responseText);
            var errorLog = null;
			if(e.code == -1009 || e.source.status == -1009){
				
				errorLog = {
					type : 1 // 1 = Network error
				};
			}
			if(e.code == -1200 || e.source.status == -1200){
				
				errorLog = {
					type : 2 // 2 = SSL error has occurred and a secure connection
				};
			}
			if(e.code == -1001 || e.source.status == -1001){
				
				errorLog = {
					type : 3 // 3 = Request Timeout
				};
			}
			if(errorLog != null){
				logTemp.push(errorLog);
			}
            log.logError(this.responseText, "GET MASTER DATA",3);
            finishSyncing(false);

        },
        onload : function(e) {
            var _data;
            try {
                if(this.responseText != null) {
                   _data = JSON.parse(this.responseText);                    
                } else {
                   _data = null; 
                }
                
                // checkDataSize(this.responseText);
                Ti.API.info("Master data:");
                if (_data != null) {
                    var nationality = _data.nation;
                    var conditionForEnroll = _data.condi;
                    var acceptText = _data.accept;
                    var crewAppraisalForm = _data.crewAppraisal;
                    var crewAppraisalFormCriteria = _data.crewAppraisalFormCriteria;
                    var upgradeCode = _data.upgrade;
                    var paymentType = _data.paymentType;
                    var paymentCurrency = _data.currenc;
                    var compen = _data.compen;
                    var conditionForMileage = _data.ropMileCondi;
                    var conditionForMPD = _data.mpdCondi;
                    var conditionForSBUpCer = _data.sbUpgradeCondi;
                    var conditionForCFUpCer = _data.cUpgradeCondi;
                    
                    var db = Ti.Database.open(Alloy.Globals.dbName);
                    if(nationality != null && nationality.length > 0) {
                        for(var i = 0; i < nationality.length; i++) {                            
                            db.execute("BEGIN");
                            db.execute("INSERT OR REPLACE INTO Nationality (id, nationality) VALUES (?,?)", nationality[i].value, nationality[i].label);                       
                            db.execute("COMMIT");                                                    
                        }
                    }
                    nationality = null;
                    
                    if(conditionForEnroll != null && conditionForEnroll.length > 0) {
                            db.execute("DELETE FROM ROPEnrollCondition");                            
                            db.execute("BEGIN");
                            db.execute("INSERT INTO ROPEnrollCondition (condiAndTerm, acceptText) VALUES (?,?)", conditionForEnroll,acceptText);                       
                            db.execute("COMMIT");                                                                            
                    }
                    conditionForEnroll = null;
                    
                    if(crewAppraisalForm != null && crewAppraisalForm.length > 0) {
                        for(var i = 0; i < crewAppraisalForm.length; i++) {                            
                            db.execute("BEGIN");
                            db.execute("INSERT OR REPLACE INTO CrewAppraisalForm (id, version, formNumber, formDesc, subjectNumber, subjectDesc, itemNumber, itemDesc, condition, type, sfdcId, subjectType, defaultValue) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", 
                                        strForQuery(crewAppraisalForm[i].id),
                                        strForQuery(crewAppraisalForm[i].version),
                                        strForQuery(crewAppraisalForm[i].formNum).length < 2 ? "0" + strForQuery(crewAppraisalForm[i].formNum) : strForQuery(crewAppraisalForm[i].formNum),
                                        strForQuery(crewAppraisalForm[i].formDesc),
                                        strForQuery(crewAppraisalForm[i].subjNum).length < 2 ? "0" + strForQuery(crewAppraisalForm[i].subjNum): strForQuery(crewAppraisalForm[i].subjNum),
                                        strForQuery(crewAppraisalForm[i].subjDesc),
                                        strForQuery(crewAppraisalForm[i].itemNum).length < 2 ? "0" + strForQuery(crewAppraisalForm[i].itemNum) : strForQuery(crewAppraisalForm[i].itemNum),
                                        strForQuery(crewAppraisalForm[i].itemDesc),
                                        strForQuery(crewAppraisalForm[i].condi),
                                        strForQuery(crewAppraisalForm[i].type),
                                        strForQuery(crewAppraisalForm[i].sfdcId),                                        
                                        strForQuery(crewAppraisalForm[i].subjType),                                        
                                        strForQuery(crewAppraisalForm[i].defaultValue)                                        
                                    );                       
                            db.execute("COMMIT");                                                                            
                        }
                        crewAppraisalForm = null;
                    }
                    
                    if(crewAppraisalFormCriteria != null && crewAppraisalFormCriteria.length > 0) {
                        db.execute("DELETE FROM CrewAppraisalFormCriteria");                            
                        for(var i = 0; i < crewAppraisalFormCriteria.length; i++) {                            
                            db.execute("BEGIN");
                            db.execute("INSERT INTO CrewAppraisalFormCriteria (formNumber, evaluator, evaluated) VALUES (?,?,?)", 
                                        crewAppraisalFormCriteria[i].formNums[0],
                                        crewAppraisalFormCriteria[i].evaluator,
                                        crewAppraisalFormCriteria[i].evaluated
                                    );                       
                            db.execute("COMMIT");                                                                            
                        }
                        crewAppraisalFormCriteria = null;
                    }
                    
                    if(upgradeCode != null && upgradeCode.length > 0) {
                        db.execute("DELETE FROM UpgradeCode");
                        for(var i = 0; i < upgradeCode.length; i++) {
                            db.execute("BEGIN");
                            db.execute("INSERT INTO UpgradeCode (upgradeCode, fromClass, toClass, mile, amount) VALUES (?,?,?,?,?)", upgradeCode[i].code, upgradeCode[i].fromClass, upgradeCode[i].toClass, upgradeCode[i].mile, upgradeCode[i].amount);
                            db.execute("COMMIT");
                        }
                        upgradeCode = null;
                    }
                    
                    if(paymentType != null && paymentType.length > 0) {
                        db.execute("DELETE FROM PaymentType");
                        for(var i = 0; i < paymentType.length; i++) {
                            db.execute("BEGIN");
                            db.execute("INSERT INTO PaymentType (name) VALUES (?)", paymentType[i]);
                            db.execute("COMMIT");
                        }
                        paymentType = null;
                    }

                    if(paymentCurrency != null && paymentCurrency.length > 0) {
                        var currencyMile = {
                             currencyName : "MILE"
                        };
                        db.execute("DELETE FROM PaymentCurrency");
                        paymentCurrency.push(currencyMile);
                        for(var i = 0; i < paymentCurrency.length; i++) {
                            db.execute("BEGIN");
                            db.execute("INSERT INTO PaymentCurrency (currencyName) VALUES (?)", paymentCurrency[i].currencyName);
                            db.execute("COMMIT");
                        }
                        paymentCurrency = null;
                    }
                    
                    if(compen != null && compen.length > 0){
                    	db.execute("DELETE FROM MasterCompensation");
                    	for(var i=0;i<compen.length;i++){
                    		var classes = compen[i].classList;
                    		for (var j=0; j < classes.length; j++) {
                    			db.execute("BEGIN");
                    			db.execute("INSERT INTO MasterCompensation (type, subType, problem, currency, class, amount, region) VALUES (?,?,?,?,?,?,?)", compen[i].type,compen[i].subType,compen[i].problem,compen[i].curr,classes[j],compen[i].amount,compen[i].region);
                    			db.execute("COMMIT");
							}
                    	}
                    	compen = null;
                    }
                    
                    if(conditionForSBUpCer != null && conditionForSBUpCer.length > 0 && conditionForCFUpCer != null && conditionForCFUpCer.length > 0) {
                    	db.execute("DELETE FROM UpgradeCertificateCondition");                            
                        db.execute("BEGIN");
                        db.execute("INSERT INTO UpgradeCertificateCondition (type, description) VALUES (?,?)", 0,conditionForSBUpCer);
                        db.execute("INSERT INTO UpgradeCertificateCondition (type, description) VALUES (?,?)", 1,conditionForCFUpCer);             
                        db.execute("COMMIT");
                        conditionForSBUpCer = null;
                    }
                    
                    if(conditionForMileage != null && conditionForMileage.length > 0){
                    	db.execute("DELETE FROM MileageCondition");
                    	for(var i=0;i<conditionForMileage.length;i++){
                			db.execute("BEGIN");
                			db.execute("INSERT INTO MileageCondition (description,type) VALUES (?,?)", conditionForMileage[i].content,conditionForMileage[i].name);
                			db.execute("COMMIT");
                    	}
                    	conditionForMileage = null;
                    }
                    
                    if(conditionForMPD != null && conditionForMPD.length > 0){
                    	db.execute("DELETE FROM MPDCondition");
                    	for(var i=0;i<conditionForMPD.length;i++){
                			db.execute("BEGIN");
                			db.execute("INSERT INTO MPDCondition (description,type) VALUES (?,?)", conditionForMPD[i].content,conditionForMPD[i].name);
                			db.execute("COMMIT");
                    	}
                    	conditionForMPD = null;
                    }
                    db.close();
                } else {
                    // Ti.API.info("Null data");
                }
            } catch (err) {
                Ti.API.error(err);
            } finally {
                _data = null;
                finishSyncing(true);
            }
        }
    });

    var url = Alloy.Globals.instanceUrl + "services/apexrest/masterdata/inflight";
    // Ti.API.info(url);

    masterDataHttpClient.open("GET", url);
    masterDataHttpClient.setRequestHeader("content-type", "application/json");
    masterDataHttpClient.setRequestHeader("Authorization", "OAuth" + " " + Alloy.Globals.accessToken);
    masterDataHttpClient.send();

	url = null;
	masterDataHttpClient = null;
}



exports.syncCrewImages = function(startSyncing, syncing, finishSyncing) {
	syncCrewImagesGet(finishSyncing);
};

function syncCrewImagesGet(finishSyncing) {
	var httpClient = Titanium.Network.createHTTPClient({
		timeout : 1000 * 30, // 30 seconds
		onerror : function(e) {
			Ti.API.error(e);
			Ti.API.error(this.responseText);
			var errorLog = null;
			if(e.code == -1009 || e.source.status == -1009){
				
				errorLog = {
					type : 1 // 1 = Network error
				};
			}
			if(e.code == -1200 || e.source.status == -1200){
				
				errorLog = {
					type : 2 // 2 = SSL error has occurred and a secure connection
				};
			}
			if(e.code == -1001 || e.source.status == -1001){
				
				errorLog = {
					type : 3 // 3 = Request Timeout
				};
			}
			if(errorLog != null){
				logTemp.push(errorLog);
			}
			log.logError(this.responseText, "GET Crew Images",3);
			finishSyncing([]);
		},
		onload : function(e) {
			var crewImages;
			try {
				if(this.responseText != null) {
                   crewImages = JSON.parse(this.responseText);                    
                } else {
                   crewImages = null; 
                }
                
                // checkDataSize(this.responseText);
				
				if (crewImages != null && crewImages.length > 0) {
					for (var i = 0; i < crewImages.length; i++) {
						var crewId = crewImages[i].name;
						var encodedImage = crewImages[i].image;
						var Blob = Ti.Utils.base64decode(encodedImage);
						
						var oldWidth = Blob.width;
						var oldHeight = Blob.height;
						var aspectRatio = oldHeight / oldWidth;
						
						var newWidth, newHeight;
						if (oldWidth > oldHeight) {
							newWidth = 160;
							newHeight = newWidth * aspectRatio;
						}
						else {
							newHeight = 160;
							newWidth = newHeight / aspectRatio;
						}			
			
						var resizedImage = Blob.imageAsResized(newWidth, newHeight);
						var crewImageFolder = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "crew");
						if(!crewImageFolder.exists()) {
							crewImageFolder.createDirectory();
						}
						
						var filename = crewId + ".jpg";
						var imageFile = Ti.Filesystem.getFile(crewImageFolder.resolve(), filename);
											
						if (imageFile.write(resizedImage)===false) {
						    // handle write error
						    // Ti.API.info("Error writing crew image : " + crewId);
						}
						else {
							query_lib.updateCrewImagePath(crewId, filename);
							//db.execute("INSERT OR REPLACE INTO Crew (id, image) VALUES (?,?)", crewId, filename);
						}
					
						// Null handlers
						crewId = null;
						encodedImage = null;
						Blob = null;
						oldWidth = null;
						oldHeight = null;
						aspectRatio = null;
						newWidth = null;
						newHeight = null;
						resizedImage = null;
						crewImageFolder = null;
						imageFile = null;
					}
				}

			} catch (err) {
				Ti.API.error(err);
			} finally {
				crewImages = null;
				finishSyncing();
			}
		}
	});

	var url = Alloy.Globals.instanceUrl + "services/apexrest/crewimage";
	// Ti.API.info(url);

	httpClient.open("GET", url);
	httpClient.setRequestHeader("content-type", "application/json");
	httpClient.setRequestHeader("Authorization", "OAuth" + " " + Alloy.Globals.accessToken);
	httpClient.send();
	
	url = null;
	httpClient = null;
}

exports.syncEdocumentGet = function(startSyncing, syncing, finishSyncing) {
	// Ti.API.info('Check doc sync');
	syncEdocumentFunctionGet(finishSyncing);
};

function syncEdocumentFunctionGet(finishSyncing) {
	// Ti.API.info('Check func doc sync');
	var edocumentHttpClient = Titanium.Network.createHTTPClient({
		timeout : 1000 * 30, // 50 seconds
		onerror : function(e) {
			Ti.API.error(e);
			Ti.API.error(this.responseText);
			var errorLog = null;
			if(e.code == -1009 || e.source.status == -1009){
				
				errorLog = {
					type : 1 // 1 = Network error
				};
			}
			if(e.code == -1200 || e.source.status == -1200){
				
				errorLog = {
					type : 2 // 2 = SSL error has occurred and a secure connection
				};
			}
			if(e.code == -1001 || e.source.status == -1001){
				
				errorLog = {
					type : 3 // 3 = Request Timeout
				};
			}
			if(errorLog != null){
				logTemp.push(errorLog);
			}
			log.logError(this.responseText, "GET E-Documents",3);
			finishSyncing(null);
		},
		onload : function(e) {
			var edocuments;
			try {
				if(this.responseText != null) {
                   edocuments = JSON.parse(this.responseText);                    
                } else {
                   edocuments = null; 
                }
                
                var db = Ti.Database.open(Alloy.Globals.dbName);
                // checkDataSize(this.responseText);
                if(edocuments != null) {
                	db.execute("BEGIN");
                    // Ti.API.info("flight id : " + flightIds);
                        for(var i = 0; i < flightIds.length; i++) {
                        	db.execute('DELETE FROM EDocument WHERE flightId=?',flightIds[i]);
                            db.execute("DELETE FROM DynamicLinkList WHERE flightId=?",flightIds[i]);                 
                        }
                        flightIds = [];
                    db.execute("COMMIT");

					db.execute("BEGIN");
				    for (var i = 0; i < edocuments.length; i++) {
				        var document = edocuments[i];
				        db.execute("INSERT INTO EDocument (`flightId`, `linkToSystem`, `type`) VALUES (?,?,?)", document.flightId, document.service, "service");
				        db.execute("INSERT INTO EDocument (`flightId`, `linkToSystem`, `type`) VALUES (?,?,?)", document.flightId, document.safety, "safety");
				        db.execute("INSERT INTO EDocument (`flightId`, `linkToSystem`, `type`) VALUES (?,?,?)", document.flightId, document.manual, "manual");
				        db.execute("INSERT INTO EDocument (`flightId`, `linkToSystem`, `type`) VALUES (?,?,?)", document.flightId, document.functionInfo, "functionInfo");
				        for ( j = 0; j < document.dynamicLinkList.length; j++) {
				            var dynamicLinkList = document.dynamicLinkList[j];
				            db.execute("INSERT INTO DynamicLinkList (`flightId`, `startWith`, `name`, `multiFlag`, `link`) VALUES (?,?,?,?,?)", document.flightId, dynamicLinkList.startWith, dynamicLinkList.name, dynamicLinkList.multiFlag, dynamicLinkList.link);
				        }
				        document = null;
				    }             
				    db.execute("COMMIT");      
                }else{
                	// Ti.API.info('Null data');
                }
                db.close();
			} catch (err) {
				Ti.API.error(err);
			} finally {
				finishSyncing(edocuments);
				edocuments = null;
			}
		}
	});

	var url = Alloy.Globals.instanceUrl + "services/apexrest/edocument";
	// Ti.API.info(url);

	edocumentHttpClient.open("GET", url);
	edocumentHttpClient.setRequestHeader("content-type", "application/json");
	edocumentHttpClient.setRequestHeader("Authorization", "OAuth" + " " + Alloy.Globals.accessToken);
	edocumentHttpClient.send();
	
	url = null;
	edocumentHttpClient = null;
}


exports.syncComplete = function() {
	isSyncing = false;
	
    var currentDateTime = new Date();
    var flightStd = query_lib.getCurrentFlightStd();
    if(flightStd != null) {
        // Ti.API.info(flightStd.getTime() + " " + currentDateTime.getTime());    
    
        var currentDateTimeMins = currentDateTime.getTime() / 1000 / 60;
        var flightStdMins = flightStd.getTime() / 1000 / 60;        
    
        //Ti.API.info('flightStdMins = ' + flightStdMins);
        //Ti.API.info('currentDateTimeMins = ' + currentDateTimeMins);
        //Ti.API.info('flightStdMins - currentDateTimeMins = ' + (flightStdMins - currentDateTimeMins));
        
        //Foreground sync : 2 hrs 45 minutes            
        if ((flightStdMins - currentDateTimeMins) <= 165) {
            is1Hr30MinCompleted = true;
        }
    
        //Foreground sync : 2 hrs 45 minutes - 7 hrs 45 minutes           
        if ((((flightStdMins - currentDateTimeMins) <= 465) && ((flightStdMins - currentDateTimeMins) > 165))) {
            is3HrCompleted = true;
        }        
        
        if(currentDateTimeMins > flightStdMins) {
            is1Hr30MinCompleted = true;
            is3HrCompleted = true;            
        }
        
        flightStd = null;

        //Ti.API.info("is1Hr30MinCompleted = " + is1Hr30MinCompleted);
        //Ti.API.info("is3HrCompleted = " + is3HrCompleted);
    }
    currentDateTime = null;
};

/*
 * Background Sync conditions
 * 1. Scheduled automatic sync
 * 		This mode will run full synchronization process.
 * 		Runs at 24 hours, 8 hours, 2 hours, and 30 mins prior to STD
 * 		When this mode is activated, an alert box will popup to prompt user to sync
 * 		Sync page will be displayed.
 *
 * 2. Background to send submitted case
 * 		This mode will run silently in the background to send submitted incidents to SFDC.
 * 		No sync progress will be displayed in this mode.
 */
exports.startSyncBackground = function() {
	// Ti.API.info("Starting background sync");
	isBackgroundSyncInitialized = true;

	var currentDateTime = new Date();
	var flightStd = query_lib.getCurrentFlightStd();
	if (flightStd != null) {
		// Ti.API.info(flightStd.getTime() + " " + currentDateTime.getTime());
		
		var currentDateTimeMins = currentDateTime.getTime() / 1000 / 60;
		var flightStdMins = flightStd.getTime() / 1000 / 60;
		
		//Ti.API.info("isSyncing: " + isSyncing);
		//Ti.API.info("3 Hour: " + is3HrCompleted);
		//Ti.API.info("1.5 Hour: " + is1Hr30MinCompleted);
	
		if (!isSyncing) {
			
			isSyncing = true;
			
			/*
			 * Check flight time against current time
			 * 1,440 = 24 hours
			 * 480 = 8 hours
			 */
			//Ti.API.info('flightStdMins ' + flightStdMins);
			//Ti.API.info('currentDateTimeMins ' + currentDateTimeMins);
			//Ti.API.info('flightStdMins - currentDateTimeMins ' + (flightStdMins - currentDateTimeMins));
			//Ti.API.info('is3HrCompleted ' + is3HrCompleted);
		
			// Ti.API.info('Condition '+ (((((flightStdMins - currentDateTimeMins) <= 180) && ((flightStdMins - currentDateTimeMins) > 90)) && !is3HrCompleted) ||
				// (((flightStdMins - currentDateTimeMins) <= 90)) && !is1Hr30MinCompleted));
				
			if (((((flightStdMins - currentDateTimeMins) <= 180) && ((flightStdMins - currentDateTimeMins) > 90)) && !is3HrCompleted) ||
				(((flightStdMins - currentDateTimeMins) <= 90)) && !is1Hr30MinCompleted) {
				
				var promptWin = Alloy.createController("common/syncPrompt", {
					currentDateTimeMins : currentDateTimeMins,
					flightStdMins : flightStdMins
				}).getView();
				promptWin.open();
		
				/*
				var syncDialog = Ti.UI.createAlertDialog({
					buttonNames: ["Sync", "Cancel"],
					cancel: 1,
					title: 'Scheduled Sync',
					message: 'Scheduled sync is about to start. \n\"Sync\" - start synchronization process. \n\"Cancel\" - continue work.'
				});
				syncDialog.addEventListener('click',function(e) {
				   // Ti.API.info("e.index: " + e.index);
				   switch (e.index) {
				   	case 0:
				   		// Start sync
				   		// Ti.API.info("start sync");
				   		Alloy.Globals.navGroupWin.openWindow(Alloy.createController("sync").getView());
				   		
				   		if (((flightStdMins - currentDateTimeMins) <= 1440) && ((flightStdMins - currentDateTimeMins) > 480)) {
				   			is24HrCompleted = true;
				   		}
				   		else if (((flightStdMins - currentDateTimeMins) <= 480) && ((flightStdMins - currentDateTimeMins) > 120)) {
				   			is8HrCompleted = true;
				   		}
				   		else if (((flightStdMins - currentDateTimeMins) <= 120) && ((flightStdMins - currentDateTimeMins) > 30)) {
				   			is2HrCompleted = true;
				   		}
				   		if ((flightStdMins - currentDateTimeMins) <= 30) {
							is30MinCompleted = true;
						}
				   		
				   		break;
				   	case 1:
				   		// Do nothing
				   		// Ti.API.info("cancel");
				   		exports.syncComplete();
				   		break;
				   }
				});
				syncDialog.show();
				*/
			}
			else {
				exports.sendIncidentSync(true);
			}
		}
		else {
			// Ti.API.info("Sync is already in progress. Skipping background sync.");
		}
		flightStd = null;
	}
	currentDateTime = null;
};

exports.sendIncidentSync = function(isBackground) {
	exports.syncIncidentPost(null, null, isBackground, function() {
		exports.syncIncidentAttachment(null, null, isBackground, function() {
			exports.syncCompleteIncidents(null, null, isBackground, function(){
				exports.syncComplete();
			});
		});
	});
};


function onLogin() {
	
	var loginView = Alloy.createController("login").getView();
	loginView.open();
	Alloy.Globals.navGroupWin = null;
	_loginPromptView = null;
	
	/*
	force.logout(function() {
		var loginView = Alloy.createController("login").getView();
		loginView.open();
	},
	function () {
		
	});
	*/
	
	//$.syncWindow.close();
	
}

function onContinue() {
	//var homeView = Alloy.createController("home", {}).getView();
	//homeView.open();
	
	//$.syncWindow.close();
	_loginPromptView = null;
}

function syncErrorAutoIncident(e) {
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
				user_lib.insertUpdateUserAuthen(user);
				Alloy.Globals.instanceUrl = user.instanceUrl;
				Alloy.Globals.accessToken = user.accessToken;
				exports.sendIncidentSync(false);
				//startSync();
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
	else {
		// Do nothing
	}
}


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
