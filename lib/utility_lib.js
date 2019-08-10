// Validate an email id
exports.validateEmail = function(mail) 
{
    var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if(mail.match(mailFormat))
    {
        return true;
    }
    else
    {
        var _promptView = new Alloy.createController("common/alertPrompt", {
            title : "Alert",
            message : "You have entered an invalid email address! Please correct it.",
            okText : "OK",
            disableCancel : true,
            onOk : function() {
            }
        }).getView();
        _promptView.open();
        return false;
    }
};

exports.isNumber = function (value) {
   return !isNaN(+value); // return true is the number
};

exports.checkInputKeyMustBeNumber = function(arg) {
    if (arg != null && arg.length > 0) {
        if (arg.substr(-1) < "0" || arg.substr(-1) > "9") {
            arg = arg.substr(0, arg.length - 1);
            var _promptView = new Alloy.createController("common/alertPrompt", {
                title : "Alert",
                message : "Please enter the number type.",
                okText : "OK",
                disableCancel : true,
                onOk : function() {
                }
            }).getView();
            _promptView.open();
        }
        return arg;
    } else {
        return arg;
    }   
};

exports.checkInputKeyMustBeNumberAndDot = function(arg) {
    if (arg != null && arg.length > 0) {
        if ((arg.substr(-1) < "0" || arg.substr(-1) > "9") && arg.substr(-1) != ".") {
            arg = arg.substr(0, arg.length - 1);
            var _promptView = new Alloy.createController("common/alertPrompt", {
                title : "Alert",
                message : "Please enter the number type.",
                okText : "OK",
                disableCancel : true,
                onOk : function() {
                }
            }).getView();
            _promptView.open();
        }
        return arg;
    } else {
        return arg;
    }   
};


exports.checkText = function(arg) {
	if ((typeof(arg) != "undefined") && (arg != null)) {
		return arg;
	}
	
	return "";
};

exports.checkNum = function(arg) {
	if ((typeof(arg) != "undefined") && (arg != null)) {
		return arg;
	}
	
	return 0;
};

exports.isEmpty = function(str) {
	return (!str || !str.length);
};

exports.generateGUID = function() {
    var guid = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)+
    Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(2);
    var timeRandom = exports.getTimeUTC();
    return "TGI"+guid+timeRandom;
};

exports.generateEvaluatedGUID = function() {
    var guid = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)+
    Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(2);
    return "EVA"+guid;
};

exports.generateCompensationGUID = function() {
    var guid = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)+
    Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(2);
    return "COMPEN"+guid;
};

exports.getDateTimeForImageName = function() {
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();
    var month = currentTime.getMonth() + 1;
    var day = currentTime.getDate();
    var year = currentTime.getFullYear();

    if (hours < 10) {
        hours = "0" + hours;
    };
    if (minutes < 10) {
        minutes = "0" + minutes;
    };
    if (seconds < 10) {
        seconds = "0" + seconds;
    };

    return day + "_" + month + "_" + year + "_" + hours + "_" + minutes + "_" + seconds;
};


exports.getDateDDMMYY = function() { // 010116 (UTC)
        var today = new Date();
        var dd = today.getUTCDate();
        var mm = today.getUTCMonth() + 1; // Jan is Zero
        var yyyy = today.getUTCFullYear()+"";
        if (dd < 10) {
            dd = '0' + dd;
        } else {
            dd = dd+"";
        }
        if (mm < 10) {
            mm = '0' + mm;
        }else{
            mm = mm + "";
        }
        var yy=yyyy.substring(2);
        return dd+mm+yy;
};

exports.getDateUTCyyyyMMdd = function() { // 2000-01-25 (UTC)
        var today = new Date();
        var dd = today.getUTCDate();
        var mm = today.getUTCMonth() + 1; // Jan is Zero
        var yyyy = today.getUTCFullYear()+"";
        
        if (dd < 10) {
            dd = '0' + dd;
        } else {
            dd = dd+"";
        }
        if (mm < 10) {
            mm = '0' + mm;
        }else{
            mm = mm + "";
        }

        return yyyy + "-" + mm + "-" + dd;
};

exports.getDateTimeUTC = function() { // 2017-02-23 10:00:00.00000 (UTC)
        var today = new Date();
        var dd = today.getUTCDate();
        var mm = today.getUTCMonth() + 1; // Jan is Zero
        var yyyy = today.getUTCFullYear()+"";
        var hh = today.getUTCHours();
        var mi = today.getUTCMinutes();
        var sec = today.getUTCSeconds();
                
        if (dd < 10) {
            dd = '0' + dd;
        } else {
            dd = dd+"";
        }
        
        if (mm < 10) {
            mm = '0' + mm;
        }else{
            mm = mm + "";
        }

        if(hh < 10) {
           hh = '0' + hh;  
        }else {
           hh = hh + ""; 
        }
        
        if(mi < 10) {
           mi = '0' + mi; 
        }else {
           mi = mi + ""; 
        }
        
        if(sec < 10) {
          sec = '0' + sec;  
        }else {
          sec = sec + "";  
        }
        return yyyy + "-" + mm + "-" + dd + " " + hh + ":" + mi + ":" + sec + ".00000";
};

exports.getTimeUTC = function() { // 103011000
        var today = new Date();
        var hh = today.getUTCHours();
        var mi = today.getUTCMinutes();
        var sec = today.getUTCSeconds();
        var msec = today.getUTCMilliseconds();
                
        if(hh < 10) {
           hh = '0' + hh;  
        }else {
           hh = hh + ""; 
        }
        
        if(mi < 10) {
           mi = '0' + mi; 
        }else {
           mi = mi + ""; 
        }
        
        if(sec < 10) {
          sec = '0' + sec;  
        }else {
          sec = sec + "";  
        }
        msec = msec.toString().substring(0,1);
        return hh + mi + sec + msec;
};

exports.getDateYYYYmmDD = function() { // 2000-01-25 (local time)
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; // Jan is Zero
        var yyyy = today.getFullYear()+"";
        
        if (dd < 10) {
            dd = '0' + dd;
        } else {
            dd = dd+"";
        }
        if (mm < 10) {
            mm = '0' + mm;
        }else{
            mm = mm + "";
        }

        return yyyy + "-" + mm + "-" + dd;
};

exports.convertDateToYYYmmDD = function(dateArg) { // d/m/yyyy to yyyy-mm-dd
        var dayStr = dateArg.substring(0, dateArg.search("/"));
        var dateTemp1 = dateArg.substring(dateArg.search("/") + 1, dateArg.length);
        var mountStr = dateTemp1.substring(0, dateTemp1.search("/"));
        var yearStr = dateTemp1.substring(dateTemp1.search("/") + 1, dateTemp1.length);
        
        if (dayStr.length == 1) {
            dayStr = "0" + dayStr;
        }        
        if (mountStr.length == 1) {
            mountStr = "0" + mountStr;
        }        

        return yearStr + "-" + mountStr + "-" + dayStr;
};

exports.getDateTime = function() { //01 JAN 2016 23:10
        var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        var today = new Date();
        var dd = today.getDate();
        var hr = today.getHours();
        var min = today.getMinutes();
        if (min < 10) {
            min = "0" + min;
        }
        if (hr < 10) {
            hr = "0" + hr;
        }
        if (dd < 10) {
            dd = '0' + dd;
        }

 //       var ampm = hr < 12 ? "am" : "pm";
        var date = today.getDate();
        var month = months[today.getMonth()];
        var year = today.getFullYear();
        months = null;
        return dd+" "+month+" "+year+" "+hr+":"+min;
};

exports.displayDateTime = function(dateTimeAgr) { //01 JAN 2016 23:10
    var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    var dateTimeStr = "";
    if (dateTimeAgr != null) {
        var today = new Date(dateTimeAgr);
        var dd = today.getDate();
        var hr = today.getHours();
        var min = today.getMinutes();

        if (min < 10) {
            min = "0" + min;
        }
        if (hr < 10) {
            hr = "0" + hr;
        }
        if (dd < 10) {
            dd = '0' + dd;
        }
        //       var ampm = hr < 12 ? "am" : "pm";
        var date = today.getDate();
        var month = months[today.getMonth()];
        var year = today.getFullYear();
        
        dateTimeStr = dd + " " + month + " " + year + " " + hr + ":" + min;
        
        dd = null;
        hr = null;
        min = null;
        date = null;
        month = null;
        year = null;
    }
    months = null;
    today = null;
    
    return dateTimeStr;

};

exports.getDateForFlightNumber = function(dateTimeAgr) { //01JAN2016
    var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    var dateTimeStr = "";
    if (dateTimeAgr != null) {
        var today = new Date(dateTimeAgr);
        var dd = today.getDate();
        if (dd < 10) {
            dd = '0' + dd;
        }
        //       var ampm = hr < 12 ? "am" : "pm";
        var date = today.getDate();
        var month = months[today.getMonth()];
        var year = today.getFullYear();
        
        dateTimeStr = dd + "" + month + "" + year;
        
        dd = null;
        date = null;
        month = null;
        year = null;
    }
    months = null;
    today = null;
    
    return dateTimeStr;

};



exports.createDateTimeForSFDC = function() { //2016-11-09T06:49:57.064Z
    var dateTimeStr = new Date().toISOString();
    return dateTimeStr;
};

exports.strForQuery = function(value) {
    return value != null ? value : "";
};

exports.boolForQuery = function(value) {
    if (value == null || !value) {
        return 0;
    } else {
        return 1;
    }
};

exports.pad = function(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

exports.convertBooleanToInt = function(boolVariable)
{
	if(boolVariable)
		return 1;
 	return 0;
};

exports.dpiConverter = function(densityPixels) {
	/*
	Ti.API.info('Ti.Platform.displayCaps.density: ' + Ti.Platform.displayCaps.density);
	Ti.API.info('Ti.Platform.displayCaps.dpi: ' + Ti.Platform.displayCaps.dpi);
	Ti.API.info('Ti.Platform.displayCaps.platformHeight: ' + Ti.Platform.displayCaps.platformHeight);
	Ti.API.info('Ti.Platform.displayCaps.platformWidth: ' + Ti.Platform.displayCaps.platformWidth);
	if((Ti.Platform.osname === 'iphone')||(Ti.Platform.osname === 'ipad')||(Ti.Platform.osname === 'android')){
	  Ti.API.info('Ti.Platform.displayCaps.logicalDensityFactor: ' + Ti.Platform.displayCaps.logicalDensityFactor);
	}
	if(Ti.Platform.osname === 'android'){
	  Ti.API.info('Ti.Platform.displayCaps.xdpi: ' + Ti.Platform.displayCaps.xdpi);
	  Ti.API.info('Ti.Platform.displayCaps.ydpi: ' + Ti.Platform.displayCaps.ydpi);
	}
	*/
	
	var valueConverted = 0;
	if(OS_IOS)
	{
		//valueConverted = densityPixels * Ti.Platform.displayCaps.dpi / 160;
		//valueConverted = densityPixels * (Ti.Platform.displayCaps.dpi / 160);
		valueConverted = densityPixels;
	}
	
	if(OS_ANDROID)
	{
		//valueConverted = densityPixels * Ti.Platform.displayCaps.dpi / 320;
		//valueConverted = densityPixels * Ti.Platform.displayCaps.dpi / 320;
		//160 - default
		valueConverted = densityPixels * (170 / Ti.Platform.displayCaps.dpi);
	}
	
	return valueConverted;
};

exports.inchConverter = function(size)
{
    // default to 160 dpi if unavailable
    var inchValue = size * 160.0; 
    try
    { 
        // compute header height based on screen density ... target .25" height
        height = size * Ti.Platform.displayCaps.dpi; 
    }
    catch(e) { warn("Error accessing display caps for screen density calculation: " + e); }
    return inchValue;
};

exports.toImageCalibrationForAndroid = function(size) {
    return size - Math.floor(size * (23/100));  
};

exports.showMoreDetail = function(textArg) {
    var win2 = Ti.UI.createWindow({
        id : "win2Id",
        fullscreen : false,
        backgroundColor : '#40000000',
    });
    
    var view = Ti.UI.createView({
        top : "7%",
        bottom : "7%",
        left : "7%",
        right : "7%",
        borderColor : "white",
        borderWidth : "1",
        borderRadius : 20,
        backgroundImage : bgGeneral,
        layout : "vertical"
    });

    var viewRowClose = Ti.UI.createView({
        height : "7%",
        width : "100%"
    });
    var labelClose = Ti.UI.createLabel({
        text : "X",
        color : "white",
        height : "100%",
        font : {
            fontSize : '25sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        right : "5%"
    });

    var viewRow1 = Ti.UI.createView({
        height : "4%",
        width : "94%",
        layout : "vertical",

    });
    
    var viewRow2 = Ti.UI.createView({
        height : "81%",
        width : "94%",
        bottom : "1%",
        layout : "vertical",
        backgroundColor : "#26000000"
    });

    var detailHeaderLabel = Ti.UI.createLabel({
        text : "Detail",
        color : "white",
        height : "100%",
        font : {
            fontSize : '22',
            fontFamily : 'arial',
            fontWeight : 'bold'
        }
    });

    var textArea = Ti.UI.createTextArea({
          value: textArg,
          backgroundColor : "transparent",
          color: colorTextValue,
          font: {fontSize:20, fontWeight:'bold', fontFamily : 'arial',},
          textAlign: 'left',
          top: "1%",
          bottom: "1%",
          height: "100%",
          width: "100%",
          editable : false
    });
        
    viewRowClose.add(labelClose);
    viewRow1.add(detailHeaderLabel);
    viewRow2.add(textArea);
    
    view.add(viewRowClose);
    view.add(viewRow1);
    view.add(viewRow2);

    win2.add(view);

    win2.open();

    win2.addEventListener("click", function(e) {
        if(e.source.id == "win2Id") {
            win2.close();            
        }
    });
    
    labelClose.addEventListener("click", function(e) {
        win2.close();
    });
    
    if(OS_ANDROID){
        win2.addEventListener('android:back', function(e) {
            win2.close();
        });
    }  
};
