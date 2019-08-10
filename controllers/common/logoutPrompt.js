// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var message = args.message;
var title = args.title;
var logoutText = args.logoutText;
var okText = args.okText;
var cancelText = args.cancelText;
var disableCancel = args.disableCancel;

function onLogout() {
	$.logoutPromptWin.close();
	args.onLogout();
}

function onOk() {
	$.logoutPromptWin.close();
	args.onOk();
}

function onCancel() {
	$.logoutPromptWin.close();
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
}


if(OS_ANDROID){
	$.logoutPromptWin.addEventListener('android:back', function(e) {
	    Ti.API.info("Press Back button");
		$.logoutPromptWin.close();
	});

    $.logoutButton.setBackgroundColor('#636263');
    $.logoutButton.height = "80%";
    $.logoutButton.borderRadius = 4;

    $.okButton.setBackgroundColor('#636263');
    $.okButton.height = "80%";
    $.okButton.borderRadius = 4;
    
    $.cancelButton.setBackgroundColor('#636263');
    $.cancelButton.height = "80%";
    $.cancelButton.borderRadius = 4;
}
