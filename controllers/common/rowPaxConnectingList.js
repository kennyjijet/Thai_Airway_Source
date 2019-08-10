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
var conSTD =args.conSTD;
var conSegment =args.conSegment;
var conNumber =args.conNumber;
var conDate =args.conDate;
var arrivalLT = args.arrivalLT;
var conSTDtext = args.conSTDtext;

function init(){
	if(isStaff){
		$.staff.visible=true;
	}
	$.tableRow.passengerId=id;
	var imgPath="";
	if (ropTier.toLowerCase().indexOf("gold") > -1) {
		imgPath= "images/rop_gold.png";
	} else if (ropTier.toLowerCase().indexOf("platinum") > -1) {
		imgPath = "images/rop_platinum.png";
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
	$.conFlight.setText(conNumber);
	$.conDate.setText(conDate);
	$.conSegment.setText(conSegment);
	$.conSTD.setText(conSTDtext);
	
	var etaTime = null;
	var stdTime = null;
	if(arrivalLT != ""){
		etaTime = new Date(arrivalLT);
		stdTime = new Date(conSTD);
		if (etaTime.getTime() >= stdTime.getTime()) {
			$.conSTD.color = "#D62E97";
		}else{
			$.conSTD.color = "#FFCB05";
		}
	}
		
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
		$.infantView.visible=false;
		$.infantView.height=0;
	}

}
init();

if(OS_ANDROID)
{
	if(hasInfant){
		$.name.top = 0;  
		$.name.height = "15%";
		$.subViewId.top = 0;
		$.subViewId.height = "20%";
		$.infantView.top = 0;
		$.infantView.height = "15%";
		$.thirdViewId.top = 0;
		$.thirdViewId.height = "25%";
		$.tableRow.height = 160;
		
	}else{
		
		$.name.top = 0;  
		$.name.height = "30%";
		$.subViewId.top = 0;
		$.subViewId.height = "25%";
		$.infantView.top = 0;
		$.infantView.height = 0;
		$.thirdViewId.top = 0;
		$.thirdViewId.height = "35%";
		$.tableRow.height = 130;
		
	}
	
	$.seat.left = 0;
	$.seat.width = "10%";
	$.image.left = 10;
	$.image.width = 80;
	$.viewDetail.width = "69%";
	
	$.viewId.width = "100%";
	// $.viewId.layout = "horizontal";
	
	$.labelRop.width = utility_lib.dpiConverter(50);
	$.rop.width = utility_lib.dpiConverter(110);
	$.classP.width = utility_lib.dpiConverter(60);
	$.paxClass.width = utility_lib.dpiConverter(80);
	$.dest.width = utility_lib.dpiConverter(55);
	
	$.flightId.width = 43;
	$.conFlight.width = 57;
	$.dateId.width = 35;
	$.conDate.width = 45;
	$.segmentId.width = 62;
	$.conSegment.width = 62;
	$.stdId.width = 33;
	$.conSTD.width = 55;
	
	$.conFlight.font = {fontSize:14};
	$.conDate.font = {fontSize:14};
	$.conSegment.font = {fontSize:14};
	$.conSTD.font = {fontSize:14};
	
	$.labelInfant.width = 60;
	$.infant.top = 0;
}