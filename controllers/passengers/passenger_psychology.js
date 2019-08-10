// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = arguments[0] || {};
var accountId = args.accountId;
var like = args.like;
var dislike = args.dislike;
var other = args.other;
var psychoQuery = require('query_lib');

var savePromptview;
var cancelPromptview;
var isPostedLayout = false;

// $.psychologyWindow.backgroundImage = bgGeneral;

if(OS_ANDROID)
{
	//var softInput = Titanium.UI.Android.SOFT_INPUT_STATE_ALWAYS_HIDDEN | Ti.UI.Android.SOFT_INPUT_ADJUST_PAN;
	var softInput = Titanium.UI.Android.SOFT_INPUT_STATE_ALWAYS_HIDDEN | Ti.UI.Android.SOFT_INPUT_ADJUST_PAN;
	$.psychologyWindow.windowSoftInputMode = softInput;	
	
	$.psychologyWindow.activity.onCreateOptionsMenu = function(e) { 
		var menu = e.menu; 
		var menuItem = menu.add({ 
		title: "Save",  
		showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM 
	}); 
		menuItem.addEventListener("click", function(e) { 
			btnSave();
		}); 
	};	
}

function btnSave(){
	savePromptview = new Alloy.createController("common/alertPrompt", {
		title : "CONFIRM",
		message: "Are you sure you want to save?",
		okText: "Yes",
		cancelText: "No",
		onOk: function() {
			onSave();
		}
	}).getView();
	savePromptview.open();
}

function onSave(){
	passengerDetailIsRefresh = 1;
	psychoQuery.updatePsychology(accountId,$.textArea1.value,$.textArea2.value,$.textArea3.value);
	savePromptview = null;
	cancelPromptview = null;
	$.psychologyWindow.close();
}

function btnCancel(){
	onClose();
	// cancelPromptview = new Alloy.createController("common/alertPrompt", {
		// title : "CONFIRM",
		// message: "Are you sure you want to cancel?",
		// okText: "Yes",
		// cancelText: "No",
		// onOk: function() {
			// onClose();
		// }
	// }).getView();
	// cancelPromptview.open();
}

function onClose() {
	savePromptview = null;
	cancelPromptview = null;
	$.psychologyWindow.close();
}

$.psychologyWindow.addEventListener('postlayout', function() {
	if(!isPostedLayout){
		if(OS_IOS) {Alloy.Globals.activityIndicator.hide();}
		setTimeout(function(){
			$.psychologyWindow.touchEnabled = true;
		}, 300);
		isPostedLayout = true;
	}
});


$.textArea1.applyProperties({
	verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
	font : {
		fontSize : 18
	},
	color : colorTextValue,
	suppressReturn : false
});


$.textArea2.applyProperties({
	verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
	font : {
		fontSize : 18
	},
	color : colorTextValue,
	suppressReturn : false
});

$.textArea3.applyProperties({
	verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
	font : {
		fontSize : 18
	},
	color : colorTextValue,
	suppressReturn : false
});

$.textArea1.value = like;
$.textArea2.value = dislike;
$.textArea3.value = other;

$.saveBtn.addEventListener('click', function() {
	btnSave();
});

$.cancelBtn.addEventListener('click', function() {
	btnCancel();
});

$.psychologyWindow.addEventListener('click', function() {
	if(OS_IOS)
	{
		$.textArea1.blur();
		$.textArea2.blur();
		$.textArea3.blur();	
	}
	
});

if(OS_ANDROID){
	$.psychologyWindow.addEventListener('android:back', function(e) {
	    Ti.API.info("Press Back button");
	    savePromptview = null;
		cancelPromptview = null;
	    $.psychologyWindow.removeAllChildren();
		$.psychologyWindow.close();
		$.psychologyWindow = null;  
	});
}