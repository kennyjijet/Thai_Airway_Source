// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = arguments[0] || {};
var name = args.name;
var desc = args.desc;
var crewCheck = args.crewCheck;
var total = args.total;
var quantity = args.quantity;
var equipmentId = args.equipmentId;
var zoneSE = args.zoneSE;
var locationSE = args.locationSE;
var utility_lib = require('utility_lib');
var extraFontSize = 0;
// Ti.API.info('check name : '+name);
// Ti.API.info('check description : '+desc);
// Ti.API.info('check crewCheck : '+crewCheck);
// Ti.API.info('check zone : '+zoneSE);
// Ti.API.info('check location : '+locationSE);
if(OS_ANDROID)
{	
	extraFontSize = 3;
	$.anActIndicatorView.hide();
}

if(OS_IOS)
{
	$.anActIndicatorView.hide();
}

function initialTable() {
	var dataTable = [];
	var nameRow = Ti.UI.createTableViewRow({
		height : "10%",
		backgroundColor : "transparent",
		touchEnabled : false,
		selectionStyle : "none"
	});
	
	if(OS_ANDROID)
	{
		nameRow.height = utility_lib.dpiConverter(150);	
	}
	
	var nameTitleLabel = Ti.UI.createLabel({
		color : "white",
		left : "5%",
		text : "Name :",
		font : {
			fontSize : utility_lib.dpiConverter(18 + extraFontSize),
		}
		
	});
	
	var nameTextLabel = Ti.UI.createLabel({
		color : "#FFCB05",
		left : "25%",
		text : name,
		font : {
			fontSize : utility_lib.dpiConverter(22 + extraFontSize),
			fontWeight : "bold"
		}
	});
	
	
	
	nameRow.add(nameTitleLabel);
	nameRow.add(nameTextLabel);
	dataTable.push(nameRow);
	
	var descTitleLabel = Ti.UI.createLabel({
		color : "white",
		left : "5%",
		text : "Description :",
		verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
		font : {
			fontSize : utility_lib.dpiConverter(18 + extraFontSize),
		}
	});
	
	var descTextLabel = Ti.UI.createLabel({
		color : "#FFCB05",
		left : "6%",
		text : desc,
		font : {
			fontSize : utility_lib.dpiConverter(22),
			fontWeight : "bold"
		}
	});
	
	Ti.API.info('desc ' + desc);
	
	var descWrapHeight = descTextLabel.toImage();
	var getHeight = 60;
	if (descWrapHeight.height >= 54 && descWrapHeight.height != 1024) {
	    getHeight = descWrapHeight.height + 90;
	}
	var descView = Ti.UI.createView({
		height : Ti.UI.SIZE,
		width : "100%",
		layout : "horizontal"
	});
	
	var descRow = Ti.UI.createTableViewRow({
		height : getHeight,
		backgroundColor : "transparent",
		touchEnabled : false,
		selectionStyle : "none"
	});
	
	descView.add(descTitleLabel);
	descView.add(descTextLabel);
	descRow.add(descView);
	dataTable.push(descRow);
	
	var crewRow = Ti.UI.createTableViewRow({
		height : "10%",
		backgroundColor : "transparent",
		touchEnabled : false,
		selectionStyle : "none"
	});
	
	if(OS_ANDROID)
	{
		crewRow.height = "150";	
	}
	
	var crewTitleLabel = Ti.UI.createLabel({
		color : "white",
		left : "5%",
		text : "Crew Procedure :",
		font : {
			fontSize : utility_lib.dpiConverter(18 + extraFontSize),
		}
	});
	
	var crewTextLabel = Ti.UI.createLabel({
		color : "#FFCB05",
		left : "25%",
		text : crewCheck,
		font : {
			fontSize : utility_lib.dpiConverter(22 + extraFontSize),
			fontWeight : "bold"
		}
	});
	
	if(OS_ANDROID)
	{
		crewTextLabel.left = "32%";
	}
	
	crewRow.add(crewTitleLabel);
	crewRow.add(crewTextLabel);
	dataTable.push(crewRow);
	
	var qtyRow = Ti.UI.createTableViewRow({
		height : "10%",
		backgroundColor : "transparent",
		touchEnabled : false,
		selectionStyle : "none"
	});
	
	if(OS_ANDROID)
	{
		qtyRow.height = "150";	
	}
	
	
	var qtyTitleLabel = Ti.UI.createLabel({
		color : "white",
		left : "5%",
		text : "Quantity :",
		font : {
			fontSize : utility_lib.dpiConverter(18 + extraFontSize),
		}
	});
	
	var qtyTextLabel = Ti.UI.createLabel({
		color : "#FFCB05",
		left : "25%",
		text : quantity,
		font : {
			fontSize : utility_lib.dpiConverter(22 + extraFontSize),
			fontWeight : "bold"
		}
	});
	
	qtyRow.add(qtyTitleLabel);
	qtyRow.add(qtyTextLabel);
	dataTable.push(qtyRow);
	
	var btnRow = Ti.UI.createTableViewRow({
		height : "10%",
		backgroundColor : "transparent",
		selectionStyle : "none"
	});
	
	if(OS_ANDROID)
	{
		btnRow.height = "150";	
	}
	
	var btnFlight = Ti.UI.createImageView({
		left : "20%",
		image : "/images/btn_flight_log.png"
	});
	
	if(OS_ANDROID)
	{
		btnFlight.width = "22%";
	}
	
	btnFlight.addEventListener('click', function(e){
		// Ti.API.info('flight Click');
		var incidentDetalView = Alloy.createController("incidents/incident_detail", {
                incidentCate : SAFETY_EQUIPMENT,
                isNew : true,
                equipmentId : equipmentId,
                zoneName : zoneSE,
                locationName : locationSE
            }).getView();
		
		if(OS_IOS)
		{
			Alloy.Globals.activityIndicator.show();	
		}
		
		if(OS_ANDROID)
		{
			$.anActIndicatorView.show();
		}
		
        setTimeout(function() {
        	if(OS_IOS)
			{
				Alloy.Globals.navGroupWin.openWindow(incidentDetalView);	
			}else{
				incidentDetalView.open();
			}
      
        }, 20);
	});
	
	var btnCCM = Ti.UI.createImageView({
		right : "20%",
		image : "/images/btn_ccm.png"
	});
	
	if(OS_ANDROID)
	{
		btnCCM.width = "22%";
	}
	
	btnCCM.addEventListener('click', function(e){
		$.safetyDetailWindow.add(Ti.UI.createWebView({ url: "pdfviewer://" }));
	});
	
	btnRow.add(btnFlight);
	btnRow.add(btnCCM);
	dataTable.push(btnRow);
	
	$.tableView.setData(dataTable);
	dataTable = null;
}


setTimeout(function(){
		initialTable();
		if(OS_IOS)
		{
			Alloy.Globals.activityIndicator.hide();
		}
	},300);


if(OS_ANDROID){
	
	$.safetyDetailWindow.addEventListener('focus', function() {
		if(OS_ANDROID)
    	{
    		$.anActIndicatorView.hide();
    	}
 	});
 	
	$.safetyDetailWindow.addEventListener('android:back', function(e) {
	    Ti.API.info("Press Back button");
		$.tableView = null;
		$.safetyDetailWindow.close();
	    
	});
}

// $.textName.text = name;
// $.textDesc.text = desc;
// $.textDesc.text = "qws qws qws qwsq qsw qsw qws qws qws qws qws qws qws qwe qwe qwe qwe qwe qwe qwe qwe qwe qwe qwe qwe qwe qwe qwe qwe qwe qwe qwe qwe qsw qsw qws qws qws qws qws qws qws qwe qwe qwe qwe";
// var descWrapHeight = $.textDesc.toImage();
// var getHeight = 60;
// if (descWrapHeight.height > 54 && descWrapHeight.height != 0) {
    // getHeight = descWrapHeight + 20;
// }
// $.descRow.height = getHeight;
// $.textCrewChk.text = crewCheck;
// $.textQTY.text = quantity;

