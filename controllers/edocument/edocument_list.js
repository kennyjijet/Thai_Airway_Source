// Arguments passed into this controller can be accessed via the `$.args` object directly or:
// var args = arguments[0] || {};
// var flightId = args.flightId;
var docQuery = require('query_lib');
var link;
var stringPath="";
var extraFontSize = 0;
var utility_lib = require('utility_lib');
if(OS_ANDROID)
{
	extraFontSize = 3;
}

function initialTable(){
	var dynamicLinkList = docQuery.getDynamicLink(currentFlightId);
	var tableData = [];
	
	for(var i=0;i<dynamicLinkList.length;i++){
		var linkURL;
		if (dynamicLinkList[i].multiFlag == 0) {
			linkURL = "pdfviewer://x-callback-url/open-file?path=/"+dynamicLinkList[i].link;
		}else{
			linkURL = "pdfviewer://";
		}
		
		var row = Ti.UI.createTableViewRow({
			linkId : linkURL,
			height : 50,
			hasChild : true
		});
		
		var img = Ti.UI.createImageView({
			image : "/images/ic_document.png",
			height : 30,
			left : "5%"
		});
		
		var nameLabel = Ti.UI.createLabel({
			left : "10%",
			color : "white",
			text : dynamicLinkList[i].name,
			font : {
				fontSize : utility_lib.dpiConverter(18 + extraFontSize),
			}
		});
		
		row.add(img);
		row.add(nameLabel);
		tableData.push(row);
		
		row.addEventListener('click', function(e){
			$.edocumentWindow.add(Ti.UI.createWebView({ url: e.rowData.linkId }));
		});
	}
	
	$.relateTable.setData(tableData);
	
	/*
	$.relateTable.applyProperties({
		data : tableData
	});
	*/
}

initialTable();


if(OS_IOS)
{
	Alloy.Globals.activityIndicator.hide();
}

$.edocumentWindow.backgroundImage = bgGeneral;

$.relateSection.backgroundImage = "/images/bg_header_section.png";

$.allSection.backgroundImage = "/images/bg_header_section.png";

$.funcInfo.hasChild = true;

$.manual.hasChild = true;

$.safety.hasChild = true;

$.service.hasChild = true;

$.relateTable.separatorColor = colorSeparatorTableRow;
$.relateTable.scrollable = false;


$.allTable.separatorColor = colorSeparatorTableRow;
$.allTable.touchEnabled = true;
$.allTable.scrollable = false;


// $.edocumentWindow.add(Ti.UI.createWebView({ url: 'pdfviewer://x-callback-url/add-file?open=true&url=http://www.th.emb-japan.go.jp/th/jis/study.htm' }));

//On click
$.funcInfo.addEventListener('click', function(){
	$.edocumentWindow.add(Ti.UI.createWebView({ url: 'pdfviewer://' }));
});

$.manual.addEventListener('click', function(){
	$.edocumentWindow.add(Ti.UI.createWebView({ url: 'pdfviewer://' }));
});

$.safety.addEventListener('click', function(){
	$.edocumentWindow.add(Ti.UI.createWebView({ url: 'pdfviewer://' }));
});

$.service.addEventListener('click', function(){
	$.edocumentWindow.add(Ti.UI.createWebView({ url: 'pdfviewer://' }));
});

if(OS_ANDROID){
	$.edocumentWindow.addEventListener('android:back', function(e) {
	    Ti.API.info("Press Back button");
		$.edocumentScoll = null;
		$.edocumentWindow.close();
	    
	});
}

