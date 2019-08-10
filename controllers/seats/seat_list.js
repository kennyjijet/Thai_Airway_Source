var args = arguments[0] || {};

function onBack() {
	if (OS_IOS) {
		$.seatWindow.parent.close();
		$.seatWindow.parent = null;
		$.seatWindow = null;
	}
	else {
		$.seatWindow.close();
		$.seatWindow = null;
	}
}

//Alloy.Globals.navGroupWin.
$.TestShowData.setText(args.title);

/*
var navBackButt = Ti.UI.createButtonBar({
  labels:           ['Back'],
  backgroundColor:  '#ae4041',
  color:            '#ffffff'
});
*/

//var labelBack = 'Back';
//$.seatWindow.setLeftNavButton(labelBack);