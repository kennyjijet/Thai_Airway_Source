var utility_lib = require("utility_lib");
var args = $.args;

var id = args.id;
var seat = args.seat;
var name = args.name;
var ropTier = args.ropTier;
var paxClass = args.paxClass;
var infantName = args.infantName;
var infantAge = args.infantAge;
var destination = args.destination;
var hasInfant = args.hasInfant;
var isStaff =args.isStaff;

if(OS_ANDROID){
	$.tableRow.passengerId=id;
}

function init(){
	if(isStaff){
		$.staff.visible=true;
	}
	
	$.tableRow.passengerId=id;
	
	var imgPath="";
	if (ropTier.toLowerCase().indexOf("gold") > -1) {
		imgPath= "/images/rop_gold.png";
		if(OS_ANDROID)
		{
			imgPath= "/images/rop_gold_resized.png";
		}
	} else if (ropTier.toLowerCase().indexOf("platinum") > -1) {
		imgPath = "/images/rop_platinum.png";
		if(OS_ANDROID)
		{
			imgPath= "/images/rop_platinum_resized.png";
		}
	} 
	
	if(imgPath!=""){
		$.image.image=imgPath;
	}
	else
	{
		$.image.visible=false;
	}
	
	$.name.setText(name);
	if(ropTier!=""){
		$.rop.setText(ropTier);
	}
	$.seat.setText(seat);
	$.paxClass.setText(paxClass);
	$.destination.setText(destination);
	
	if(hasInfant){
		var infant=infantName;
		if(infant!=""){
			if(infantAge!=""){
				infant+=" ( "+infantAge+" )";
			}else{
				infant+=" ( - )";
			}
		}else{
			if(infantAge!=""){
				infant=" - ";
				infant+=" ( "+infantAge+" )";
			}
			else
			{
				$.labelInfant.visible=false;
			}
		}
	
		if(infant!=""){
			$.infant.setText(infant);
		}
		else{
			$.labelInfant.visible=false;
		}
	}
	else{
		$.labelInfant.visible=false;
	}

}
init();

if(OS_IOS)
{
	$.viewId.layout = "horizontal";
	$.name.left = 0;
	$.cardViewId.width = "20%";
	$.seatViewId.width = "10%";
	$.descriptionViewId.width = "60%";
	
	$.seat.left = 0;
	$.seat.width = "100%";
	$.image.left = "10%";
	if(hasInfant){
		$.tableRow.height = "190";
	}else{
		$.tableRow.height = "130";
	}
	
}


if(OS_ANDROID)
{
	
	
	if(hasInfant){
		$.name.top = 0;  
		$.name.height = "40%";
		$.subViewId.top = 0;
		$.subViewId.height = "20%";
		$.infantViewId.top = 0;
		$.infantViewId.height = "40%";
		$.tableRow.height = "150";
		$.labelInfant.width = 70;
	}else{
		$.name.top = "15%";  
		$.name.height = "40%";
		$.subViewId.top = 0;
		$.subViewId.height = "25%";
		$.infantViewId.top = 0;
		$.infantViewId.height = "40%";
		$.tableRow.height = "110";
	}
	
	$.seat.left = 0;
	$.seat.width = "100%";
	$.image.left = "5%";
	
	$.viewId.width = "100%";
	$.viewId.layout = "horizontal";
	$.labelRop.width = utility_lib.dpiConverter(50);
	$.rop.width = utility_lib.dpiConverter(110);
	$.classP.width = utility_lib.dpiConverter(60);
	$.paxClass.width = utility_lib.dpiConverter(100);
	$.dest.width = utility_lib.dpiConverter(55);
	
	$.labelInfant.width = utility_lib.dpiConverter(65);
	$.infant.top = 0;
	
}
