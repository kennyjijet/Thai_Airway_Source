
exports.deleteUser = function() {
	var db = Ti.Database.open(Alloy.Globals.dbName);
	db.execute('DELETE FROM User');
	db.close();
};

exports.deleteAuthentication = function() {
	var db = Ti.Database.open(Alloy.Globals.dbName);
	db.execute('DELETE FROM Authentication');
	db.close();
};

exports.deleteFlight = function()
{
	var db = Ti.Database.open(Alloy.Globals.dbName);
	db.execute('DELETE FROM Flight');
	db.close();
	
};

exports.deletePassenger = function() {
	var db = Ti.Database.open(Alloy.Globals.dbName);
	db.execute('DELETE FROM Passenger');
	db.execute('DELETE FROM ROP');
	db.execute('DELETE FROM SSR');
	db.execute('DELETE FROM PassengerPsychology');
    db.execute('DELETE FROM ROPEnrollment');
    db.execute('DELETE FROM ROPEnrollAttachment');
    db.execute("DELETE FROM UpgradeSeat");
    db.execute("DELETE FROM UpgradeCode");
    db.execute("DELETE FROM ChangeSeatGroupMember");
    db.execute('DELETE FROM PassengerFeedback');
    db.execute('DELETE FROM ROPEnrollCondition');
	db.close();
};

exports.deleteIncident = function() {
	var db = Ti.Database.open(Alloy.Globals.dbName);
	db.execute('DELETE FROM Incident');
	db.execute('DELETE FROM PaxGroupMember');
	db.execute('DELETE FROM CrewGroupMember');
	db.execute('DELETE FROM StaffGroupMember');
	db.execute('DELETE FROM PositionGroupMember');
	db.execute('DELETE FROM Compensation');
	db.execute('DELETE FROM Attachment');
	db.close();
};

exports.deleteLOPA = function() {
	var db = Ti.Database.open(Alloy.Globals.dbName);
	db.execute('DELETE FROM LOPA');
	db.execute('DELETE FROM LOPAPosition');
	db.close();
};

exports.deleteEquipment = function() {
	var db = Ti.Database.open(Alloy.Globals.dbName);
	db.execute("DELETE FROM Equipment");
	db.execute("DELETE FROM EquipmentPart");
	db.execute("DELETE FROM Condition");
	db.close();
};

exports.deleteCrew = function() {
	var db = Ti.Database.open(Alloy.Globals.dbName);
	db.execute("DELETE FROM Crew");
	db.execute("DELETE FROM CrewDutyAssignment");
	db.execute("DELETE FROM CrewGroupMember");
	db.execute("DELETE FROM StaffGroupMember");
	db.execute("DELETE FROM CrewProcedure");
    db.execute("DELETE FROM CrewAppraisalForm");
    db.execute("DELETE FROM CrewAppraisalFormAnswer");
    db.execute("DELETE FROM CrewAppraisalFormCriteria");
    db.execute("DELETE FROM CrewAppraisalItemDescAnswer");
    db.execute("DELETE FROM CrewAppraisalSubjectAnswer");
	db.close();
};

exports.deleteMiscellaneous = function() {
	var db = Ti.Database.open(Alloy.Globals.dbName);
	db.execute("DELETE FROM FoodAndBeverage");
	db.execute("DELETE FROM Requirement");
	db.execute("DELETE FROM Manual");
	db.execute("DELETE FROM RouteInformation");
	db.execute("DELETE FROM MasterDuty");
	db.execute("DELETE FROM MasterCompensation");
	db.execute("DELETE FROM DynamicLinkList");
	db.execute("DELETE FROM EDocument");
	db.execute("DELETE FROM MPDCondition");
	db.execute("DELETE FROM MileageCondition");
	db.execute("DELETE FROM Nationality");
	db.execute("DELETE FROM PaymentCurrency");
	db.execute("DELETE FROM PaymentType");
	db.execute("DELETE FROM UpgradeCertificateCondition");
	db.close();
};

exports.clearDataWithCurrentFlight = function() {
	var db = Ti.Database.open(Alloy.Globals.dbName);
	db.execute("DELETE FROM Passenger WHERE flightId=?",currentFlightId);
	db.execute("DELETE FROM LOPA WHERE flightId=?",currentFlightId);
	db.execute("DELETE FROM LOPAPosition WHERE flightId=?",currentFlightId);
	db.close();
};