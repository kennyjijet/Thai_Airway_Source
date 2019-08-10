// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var message = args.message;
var title = args.title;
var okText = args.okText;
var cancelText = args.cancelText;
var disableCancel = args.disableCancel;

if(OS_IOS)
{
	$.okButton.left = "5";
	$.cancelButton.right = "5";
	
}

function onOk() {
	$.alertPromptWin.close();
	args.onOk();
}

function onCancel() {
	$.alertPromptWin.close();
	if (args.onCancel) {
		args.onCancel();
	}
}

// Implementation
if (message != null) {
	$.messageLabel.setText(message);
}

if (title != null) {
	$.titleLabel.setText(title);
}

if (okText != null) {
	$.okButton.setTitle(okText);
}

if (cancelText != null) {
	$.cancelButton.setTitle(cancelText);
}

if (disableCancel) {
	$.cancelButton.hide();
	$.vertSep.hide();
	$.okButton.setWidth("90%");
}else{
	
	if(OS_ANDROID)
	{
		$.okButton.show();
		$.okButton.left = '15';
		$.cancelButton.right = '15';
		$.okButton.setWidth("40%");
		$.cancelButton.setWidth("40%");
	}
}

if(OS_ANDROID){
	$.alertPromptWin.addEventListener('android:back', function(e) {
	    Ti.API.info("Press Back button");
		$.alertPromptWin.close();
	});
	
    $.okButton.setBackgroundColor('#636263');
    $.okButton.height = "80%";
    $.okButton.borderRadius = 4;
    
    $.cancelButton.setBackgroundColor('#636263');
    $.cancelButton.height = "80%";
    $.cancelButton.borderRadius = 4;
}

