// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

//require('appcelerator.encrypteddatabase');

Alloy.Globals.flightExId = null;
Alloy.Globals.flightId = null;
Alloy.Globals.aircraftReg = null;

Alloy.Globals.instanceUrl = null;
Alloy.Globals.accessToken = null;

Alloy.CFG.accessToken = null;
Alloy.CFG.refreshToken = null;
Alloy.CFG.instanceURL = null;
Alloy.Globals.maxCol = null;
Alloy.Globals.lopaId = null;
Alloy.Globals.initializeApp = null;
Alloy.Globals.syncFinished = 0;
Alloy.Globals.syncTimeNow = null;
Alloy.Globals.initialSynced = false;

var ANActivityIndicator = require('ANActivityIndicator');
var androidActivityIndicator = require('androidActivityIndicator');
var user_lib = require("user_lib");

Alloy.Globals.dbName = 'TGdb' + Ti.App.Properties.getString('db.version');
var db = Ti.Database.install('/TGdb.sqlite', Alloy.Globals.dbName);

var user = user_lib.getUser();
if (user != null) {
	Alloy.Globals.instanceUrl = user.instanceUrl;
	Alloy.Globals.accessToken = user.accessToken;
}

// Define Flight Id
var currentFlightId = "a02N0000007IHIZIA4"; //Alloy.Globals.flightId
var nextFlightId = "TG676_25OCT2016_2";
var flightExIdList = ""; //Alloy.Globals.flightExId
var aircraftRegGlobal = ""; //Alloy.Globals.aircraftReg
var flightExternalId="";
var compensationFlag = 0;
var logTemp = [];
//var maxColLopa = 0;
// Define Background Color
const bgGeneral = "/images/bg_general.png";
const bgHome = "/images/bg_home.png";
const bgLopa = "/images/bg_lopa.png";
const bgHeaderSection = "/images/bg_header_section.png";

// Define Text Color
const colorTextTitle = "white";
const colorTextSubTitle = "white";
const colorTextDesc = "white";
const colorSeparatorTableRow = "#5E3987";
const colorSelectedBtnHighlight = "#80D8008C";
const colorTextValue = "#FFCB05";
const colorTextHint = "#7B549C";

// Define Incident status
const OPEN = 1;
const RESOLVED = 2;
const CLOSED = 3;

// Define Incident category
const PASSENGER = 1;
const SERVICE_EQUIPMENT = 2;
const SAFETY_EQUIPMENT = 3;
const AC_MAINTENANCE = 4;
const OTHER = 5;
const EMERGENCY = 6;
const ALL = 7;

// Define Compensation type
const COMP_MILE = "ROP Mileages";
const COMP_MPD = "MPD";
const COMP_UPCER = "Upgrade Certificate";
const COMP_DUTY = "Duty Free";
const COMP_OTHER = "Others";

// Define Emergency Category 
const PASSENGER_DECEASE = 10;
const CREW_DECEASE = 11;
const SEVERE_PASSENGER_INJURY = 12;
const SEVERE_CREW_INJURY = 13;
const SEVERE_TURBULENCE = 14;
const SLIDER_DEPLOYMENT = 15;

// Define ROP Enrollment status
const ENROLL = 1;
const VOIDED = 2;
const ACTIVED = 3;
const INACTIVE = 4;

// Define Person Type
const paxType = 30;
const crewType = 31;
const staffType = 32;

const PERSON_MASTER = 40;
const PERSON_INVOLVED = 41;

// 
const NOT_CONCERN_PAX = 13;

// Change / Upgrade function
const CHANGE_SEAT_FUNCTION = 97;
const UPGRADE_SEAT_FUNCTION = 99;
const PASSENGER_DETAIL = 95;
const INCIDENT_DETAIL = 96;

// Define Cabin / Flight Deck log type
const CABIN_LOG = 21;
const FLIGHT_DECK_LOG = 22;
const IMAGE_HIGH_SIZE = 720;

var paxGroupMemGlobalTemp = [];
var paxPositionMemRemovedTemp = [];
var crewGroupMemGlobalTemp = [];
var staffGroupMemGlobalTemp = [];
var compensationGlobalTemp = [];
var changSeatGlobalTemp = [];
var reasonForChangeSeatTemp = "";
var compensationRefresh = 0;
var personInvolvedRefresh = 0;
var ropEnrollmentRefresh = 0;
var equipmentRefresh = 0;
var incidentListIsRefresh = 0;
var incidentPassengerIsRefresh = 0;
var incidentSeatDetailIsRefresh = 0;
var passengerDetailIsRefresh = 0;
var crewListRefresh = 0;
var passengerSeatClassIsRefresh = 0;
var passengerListIsRefresh = 0;
var changeSeatFromIncidentDetailIsRefresh = 0;
var isBackToLopa = 0;
var lopaIsRefresh = 0;
var homeIsRefresh = 0;
var homeIsRefreshFromSync = 0;
var rowIndex = 300;
var isFromPassengerDetail = false;
var isFromIncidentDetail = false;


var flightIds = [];
var closeFlightEnabled = false;

if(OS_IOS)
{
	var ANActivityIndicator = require('ANActivityIndicator');
	Alloy.Globals.activityIndicator = new ANActivityIndicator("Loading...");	
	Alloy.Globals.activityIndicatorLazyLoading = new ANActivityIndicator("Loading...", "#70000000"); 

}else{
	var anActIndicator = require('androidActivityIndicator');
	Alloy.Globals.anActIndicator = anActIndicator.androidActivityIndicator();
}


//Alloy.Globals.activityIndicatorTest = new Alloy.createController("common/activityIndicator", {}).getView();



var utility_lib = require("utility_lib");


// ratio 1/72 on screen size.
/*
var g_28pt = utility_lib.inchConverter(28/72); 
var g_24pt = utility_lib.inchConverter(24/72); 
var g_20pt = utility_lib.inchConverter(20/72);   
var g_18pt = utility_lib.inchConverter(18/72);   
var g_16pt = utility_lib.inchConverter(16/72);   
var g_14pt = utility_lib.dpiConverter(14/72);
var g_12pt = utility_lib.dpiConverter(12/72);
var g_10pt = utility_lib.dpiConverter(10/72);
var g_8pt = utility_lib.dpiConverter(8/72);
var g_6pt = utility_lib.dpiConverter(6/72);
*/

Alloy.Globals.d_28pt = utility_lib.dpiConverter(28) + 'sp';
Alloy.Globals.d_25pt = utility_lib.dpiConverter(25) + 'sp';
Alloy.Globals.d_24pt = utility_lib.dpiConverter(24) + 'sp';
Alloy.Globals.d_22pt = utility_lib.dpiConverter(22) + 'sp';
Alloy.Globals.d_21pt = utility_lib.dpiConverter(21) + 'sp';
Alloy.Globals.d_20pt = utility_lib.dpiConverter(20) + 'sp';
Alloy.Globals.d_18pt = utility_lib.dpiConverter(18) + 'sp';
Alloy.Globals.d_17pt = utility_lib.dpiConverter(17) + 'sp';
Alloy.Globals.d_16pt = utility_lib.dpiConverter(16) + 'sp';
Alloy.Globals.d_15pt = utility_lib.dpiConverter(15) + 'sp';
Alloy.Globals.d_14pt = utility_lib.dpiConverter(14) + 'sp';
Alloy.Globals.d_12pt = utility_lib.dpiConverter(12) + 'sp';
Alloy.Globals.d_10pt = utility_lib.dpiConverter(10) + 'sp';
Alloy.Globals.d_8pt = utility_lib.dpiConverter(8) + 'sp';
Alloy.Globals.d_6pt = utility_lib.dpiConverter(6) + 'sp';


// pixel to actual size
/*
Alloy.Globals.d_28pt = utility_lib.dpiConverter(28);
Alloy.Globals.d_24pt = utility_lib.dpiConverter(24);
Alloy.Globals.d_22pt = utility_lib.dpiConverter(22);
Alloy.Globals.d_20pt = utility_lib.dpiConverter(20);
Alloy.Globals.d_18pt = utility_lib.dpiConverter(18);
Alloy.Globals.d_16pt = utility_lib.dpiConverter(16);
Alloy.Globals.d_15pt = utility_lib.dpiConverter(15);
Alloy.Globals.d_14pt = utility_lib.dpiConverter(14);
Alloy.Globals.d_12pt = utility_lib.dpiConverter(12);
Alloy.Globals.d_10pt = utility_lib.dpiConverter(10);
Alloy.Globals.d_8pt = utility_lib.dpiConverter(8);
Alloy.Globals.d_6pt = utility_lib.dpiConverter(6);
*/

	


