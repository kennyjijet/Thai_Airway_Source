//**********************************************
//* Require
//**********************************************
var model = require('query_lib');
var utility = require('utility_lib');
var component = require('component_lib');

//**********************************************
//* Variable Declaration
//**********************************************
var args = arguments[0] || {};
var passengerId = args.passengerId;
var LOPAPositionId = args.LOPAPositionId;
var LOPAPositionPos = args.LOPAPositionPos;
var isFromLopa = args.isFromLopa;

var passenger;
var rop;
var ssr;
var passengerPsychology;
var incidents = [];
var closeFlag = 0;
var flightInformation;
var acReg;
var ropEnrollment;
var argsLike;
var argsDisLike;
var argsOther;

var upgradeList=[];
var upgradeIncidentList=[];
var changeSeatList=[];
var changeIncidentList=[];
var windowWidth=0;

var isStaff = false;
var isPostedLayout = false;
//**********************************************
//* Function
//**********************************************

if(OS_ANDROID)
{
	$.dateGenderNation.height = 25;
	$.dateGenderNation1.height = 25;
	
	$.dateGenderNation2.height = 25;
	$.dateGenderNation3.height = 25;
	
	$.dateGenderNation4.height = 25;
	$.dateGenderNation5.height = 25;
	
	$.dateGen123Id.height = 22;
	$.dateGen45Id.height = 22;
	
	$.dateGenderNation4.top = 0;
	$.dateGenderNation5.top = 0;
	
	$.ROPViewId.height = 200;
	$.applyROP.top = 35;
	$.applyROP.width = 140;
	$.applyROP.height = 40;
	
	$.ropType.height = 22;
	
	$.imageROP.width = 100;
	$.imageROP.height = 60;
	
	$.imageROP.top = 0;
    $.ropProfileImage.top = 0;
	$.ropProfileImage.height = "100%";
	$.userImageView.width = "25%";
	$.paxDetailView.width = "75%";
	$.paxNameView.width = "60%";
	$.ROPViewId.width = "40%";
}

Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

function passengerDetail() {
    rop = model.getRop(passenger.memberId);
    // Ti.API.info('Pass ROP');
    ssr = model.getPassengerSSR(passenger.id);
    // Ti.API.info('Pass SSR');
    passengerPsychology = model.getPassengerPsychology(passenger.accountId);
	// Ti.API.info('Pass Psychology');
    if (passenger != null) {
        incidents = model.getIncidentsByPassengerOrPosition(passenger.id, passenger.accountId, passenger.paxKey, passenger.bookingSeat, acReg);
    	// Ti.API.info('Pass getIncidentsByPassengerOrPosition');
    }
	
    showIncidentList(incidents);
    initialPassengerPsychology(passengerPsychology);
    $.firstName.text = passenger.lastName + " " + passenger.firstName + " " + passenger.salutation;
    $.bookingSeatClass.text = passenger.bookingSeat != "" ? (passenger.bookingSeat + "  " + "Class " + passenger.bookingClass) : "";
    
    // Ti.API.info('$.bookingSeatClass.text ' + $.bookingSeatClass.text);
    
    $.floorZone.text = passenger.floor != "" ? (passenger.floor + "-" + "zone" + passenger.zone) : "";
    $.image.image = passenger.image != "" ? passenger.image : (passenger.gender.toLowerCase() == "m" ? "/images/user_man.png" : "/images/user_woman.png" );
    $.dateGenderNation.text = "Date Of Birth : ";
    $.dateGenderNation1.text = passenger.dateOfBirth;
    $.dateGenderNation2.text = "   Gender : ";
    $.dateGenderNation3.text = passenger.gender;
    $.dateGenderNation4.text = "   Nationality : ";
    $.dateGenderNation5.text = passenger.nationality;

    /* chk man or woman to change image START */
    if (passenger.gender.toLowerCase() == "m") {
        $.image.image = "/images/user_man.png";
    } else if (passenger.gender.toLowerCase() == "f") {
        $.image.image = "/images/user_woman.png";
    } else {
        $.image.image = "/images/user_man.png";
    }
    /* chk man or woman to change image END */
    
    if (rop) {

        if (rop.ropTier.toLowerCase().indexOf("gold") > -1) {
            $.imgTitleBar.backgroundImage = "/images/bg_gold.png";
            $.imageROP.image = "/images/rop_gold_resized.png";
        } else if (rop.ropTier.toLowerCase().indexOf("platinum") > -1) {
            $.imgTitleBar.backgroundImage = "/images/bg_platinum.png";
            $.imageROP.image = "/images/rop_platinum_resized.png";
        } else if (rop.ropTier.toLowerCase().indexOf("silver") > -1) {
            $.imgTitleBar.backgroundImage = "/images/bg_silver.png";
            $.imageROP.image = "/images/rop_silver_resized.png";
        } else if (rop.ropTier.toLowerCase().indexOf("basic") > -1) {
            $.imgTitleBar.backgroundImage = "/images/bg_rop.png";
            $.imageROP.image = "/images/rop_basic_resized.png";
        } else {
            $.imgTitleBar.backgroundImage = null;
            $.imageROP.image = null;            
        }
       

        $.ropType.text = rop.ropTier + " : " + rop.id;
        var td1 = Ti.UI.createView({
            height : "60",
            width : "100%",
            layout : "horizontal"
        });
        var label1 = Ti.UI.createLabel({
            left : "5%",
            width : "20%",
            color : "white",
            height : "100%",
            font : {
                fontSize : utility.dpiConverter(18),
                fontWeight : "bold",
            },
            text : "Food Preference :"
        });
        td1.add(label1);

        label1 = Ti.UI.createLabel({
            left : "5%",
            width : "60%",
            height : "100%",
            color : "#ffcb05",
            font : {
                fontWeight : "bold",
                fontSize : utility.dpiConverter(22)
            },

            text : rop.foodPreference
        });

        td1.add(label1);

        $.loopRop.add(td1);

        td1 = Ti.UI.createView({
            height : "60",
            width : "100%",
            layout : "horizontal"
        });
        label1 = Ti.UI.createLabel({
            left : "5%",
            width : "20%",
            color : "white",
            font : {
                fontSize : utility.dpiConverter(18),
                fontWeight : "bold",
            },
            text : "Drink Preference :"
        });
        td1.add(label1);

        label1 = Ti.UI.createLabel({
            left : "5%",
            width : "60%",
            color : "#ffcb05",
            font : {
                fontWeight : "bold",
                fontSize : utility.dpiConverter(22)
            },
            text : rop.drinkPreference

        });
        td1.add(label1);

        $.applyROP.visible = false;
        $.loopRop.add(td1);
        $.loopRop.height = "100";
        // test OLD: $.loopRop.height = "100";

        // try to check ROP
        if (rop.foodPreference === "" && rop.drinkPreference === "") {
            // $.loopRop.height = "0";
            // $.ropInfoLabel.height = "0";
        } else {
            $.loopRop.height = "100";
        }

        td = null;
        label1 = null;

    } else {
        ropEnrollment = model.getROPEnrollment(passenger.accountId, passenger.paxKey);    
        
        if(ropEnrollment != null) {
            var flightDerail = model.getFlightDetails(currentFlightId); 
            if(flightDerail != null) {
                var flightNumberTemp = flightDerail.flightExternalId.replace(/_/gi, "");
                var flightNumber = flightNumberTemp.substring(0, flightNumberTemp.length-1);
                
                // Ti.API.info('ropEnrollment.status ' + ropEnrollment.status);
                // Ti.API.info('VOIDED ' + VOIDED);
                
                // Ti.API.info('ropEnrollment.flightNumber ' + ropEnrollment.flightNumber);
                // Ti.API.info('flightNumber ' + flightNumber);
                                                             
                if(ropEnrollment.flightNumber != flightNumber && ropEnrollment.status == VOIDED) {
                    
                    $.ROPlabel.text = "Apply for ROP";
                    
                } else if(ropEnrollment.flightNumber != flightNumber && ropEnrollment.status != VOIDED){
                    $.ROPlabel.text = "Applied";
                } else if(ropEnrollment.flightNumber == flightNumber && ropEnrollment.status == VOIDED){
                    $.ROPlabel.text = "Applied";
                } else if(ropEnrollment.flightNumber == flightNumber && ropEnrollment.status != VOIDED){
                    $.ROPlabel.text = "Applied";
                }               
            } 
        }

        $.applyROP.addEventListener("click", function(e) {
            ropEnrollment = model.getROPEnrollment(passenger.accountId, passenger.paxKey);
            if (ropEnrollment != null) {
                var flightDerail = model.getFlightDetails(currentFlightId); 
                if(flightDerail != null) {
                    var flightNumberTemp = flightDerail.flightExternalId.replace(/_/gi, "");
                    var flightNumber = flightNumberTemp.substring(0, flightNumberTemp.length-1);                                             

                    if(ropEnrollment.flightNumber != flightNumber && ropEnrollment.status == VOIDED) {
                        closeFlag = 1;
                        var ropEnView = Alloy.createController("rop_enrollment/rop_enrollment_form", {
                            passengerId : passenger.id,
                            isNew : true
                        }).getView();
                        isFromPassengerDetail = true;
                        if(OS_IOS){
                        	Alloy.Globals.navGroupWin.openWindow(ropEnView);
                        }else{
                        	$.anActIndicatorView.show();
                        	ropEnView.open();
                        }
                        
                   
                    } 
                    else {
                        closeFlag = 1;
                        showRopDetail(ropEnrollment);
                    }               
                } 
            } else {
                closeFlag = 1;
                var ropEnFormView = Alloy.createController("rop_enrollment/rop_enrollment_form", {
                    passengerId : passenger.id,
                    isNew : true
                }).getView();
                isFromPassengerDetail = true;
                if(OS_IOS)
                {
                	Alloy.Globals.navGroupWin.openWindow(ropEnFormView);	
                }else{
                	$.anActIndicatorView.show();
                	ropEnFormView.open();
                }
                
            }
        });
        $.ropInfoLabel.visible = false;
        if(OS_IOS){
        	$.showRopDetail.visible = false;
        }
        if(OS_ANDROID)
        {
        	$.showRopDetail.visible = false;
        	$.showRopDetail.height = 0;
        }
        $.ropInfoLabel.height = 0;
    }

    $.bookingClass.text = passenger.bookingClass;
    $.connectingFlight.text = passenger.conFlightNumber;
    $.connectingDateTime.text = passenger.conFlightDate+" "+passenger.conFlightTime;

    if (passenger.infantName != "" || passenger.infantAge != "") {
        $.infantName.text = passenger.infantName;
        $.infantAge.text = passenger.infantAge;
    } else {
        $.HerdInfant.height = 0;
        $.BodyInfant.height = 0;
    }

    if (ssr.length == 0) {
        $.headSSR.height = 0;
        $.headSSR.hidden;
        // $.headSSRname.hidden;
        // $.headSSRname.height = 0;
    }

    for (var ii = 0; ii < ssr.length; ii++) {
        ssrId = ssr[ii].id;

        // set wrapContent start
        label1 = Ti.UI.createLabel({
            text : ssr[ii].remark,
            color : "#ffcb05",
            font : {
                fontWeight : "bold",
                fontSize : utility.dpiConverter(22)
            },
        });
        var setWrapHeight = label1.toImage();
        //        var getHeight = 90;
        var getHeight = 80;
        if (setWrapHeight.height > 500) {
            getHeight = 80;
        } else {
            getHeight = setWrapHeight.height + 70;
        }

        var MainView = Ti.UI.createView({
            className : "row",
            backgroundColor : "#E5E4E2",
            height : getHeight,
            width : "100%",
            layout : "horizontal",
            ssrId : ssrId,
            backgroundColor : "transparent"

        });

        /* column 1: type */
        td1 = Ti.UI.createView({
            height : "100%",
            width : "20%"
        });
        label1 = Ti.UI.createLabel({
            text : ssr[ii].type,
            color : "#ffcb05",
            font : {
                fontWeight : "bold",
                fontSize : utility.dpiConverter(22)
            },
        });
        td1.add(label1);
        MainView.add(td1);

        /* column 2: status */
        td1 = Ti.UI.createView({
            height : "100%",
            width : "25%"
        });
        label1 = Ti.UI.createLabel({
            text : ssr[ii].status,
            color : "#ffcb05",
            color : "#ffcb05",
            font : {
                fontWeight : "bold",
                fontSize : utility.dpiConverter(22)
            },
        });
        td1.add(label1);
        MainView.add(td1);

        /* column 3: remark */
        td1 = Ti.UI.createView({
            height : "100%",
            // height : "180%",
        });
        label1 = Ti.UI.createLabel({
            text : ssr[ii].remark,
            color : "#ffcb05",
            font : {
                fontWeight : "bold",
                fontSize : utility.dpiConverter(22)
            },
        });
        td1.add(label1);
        MainView.add(td1);

        label1 = null;
        td1 = null;

        $.loopSSR.add(MainView);

    }
    $.loopSSR.height = Ti.UI.SIZE;

    $.passengerPsyBtb.addEventListener("click", function(e) {
        
        var passengerPsyView = Alloy.createController("passengers/passenger_psychology", {
        	accountId : passenger.accountId,
            like : argsLike,
            dislike : argsDisLike,
            other : argsOther
        }).getView();
        if(OS_IOS)
        {
        	Alloy.Globals.navGroupWin.openWindow(passengerPsyView);
        }else{
        	$.anActIndicatorView.show();
        	passengerPsyView.open();
        }
        
    });

    $.upgradeSeatBtn.addEventListener("click", function(e) {
       if(passenger.bookingClass.toLowerCase() == "c" || passenger.bookingClass.toLowerCase() == "f" || passenger.bookingClass == null || utility.isEmpty(passenger.bookingClass)) {
             var _promptView = new Alloy.createController("common/alertPrompt", {
                title : "Alert",
                message : "This class is not available to upgrade.",
                okText : "OK",
                disableCancel : true,
                onOk : function() {
                }
            }).getView();
            _promptView.open();                 
            if(OS_IOS) { Alloy.Globals.activityIndicator.hide(); }
            else { $.anActIndicatorView.show(); }
          
       } else {
            closeFlag = 1;
            if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
            setTimeout(function() {
            	var upgradeSeatLopaView = Alloy.createController("upgrade_seat/upgrade_seat_lopa", {
                    accountId : passenger.accountId,
                    passengerId : passenger.id,
                    paxKey : passenger.paxKey,
                    doFunction : UPGRADE_SEAT_FUNCTION,
                    fromWhere : PASSENGER_DETAIL,
                    isFromLopa : isFromLopa
                }).getView();
            	if(OS_IOS)
            	{
            		Alloy.Globals.navGroupWin.openWindow(upgradeSeatLopaView);  
            	}else{
            		$.anActIndicatorView.show();
            		upgradeSeatLopaView.open();
            	}
                         
            }, 10);

       }      
    });

    $.changeSeatBtn.addEventListener("click", function(e) {
        closeFlag = 1;
        if(OS_IOS) { Alloy.Globals.activityIndicator.show(); }
        setTimeout(function() {
        	var upgradeSeatLopaView = Alloy.createController("upgrade_seat/upgrade_seat_lopa", {
                accountId : passenger.accountId,
                passengerId : passenger.id,
                paxKey : passenger.paxKey,
                doFunction : CHANGE_SEAT_FUNCTION,
                fromWhere : PASSENGER_DETAIL,
                isFromLopa : isFromLopa
            }).getView();
        	if(OS_IOS){
        		 Alloy.Globals.navGroupWin.openWindow(upgradeSeatLopaView);
        	}else{
        		$.anActIndicatorView.show();
        		upgradeSeatLopaView.open();
        	}
        	//$.passengerDetailWindow.close();
           
        }, 10);
    });

}

function showRopDetail(dataArg) {

    var win2 = Ti.UI.createWindow({
        fullscreen : false,
        backgroundColor : '#40000000',
    });
    var view = Ti.UI.createView({
        top : "10%",
        bottom : "10%",
        left : "10%",
        right : "10%",
        borderColor : "white",
        borderWidth : "1",
        borderRadius : 20,
        backgroundImage : bgGeneral,
        layout : "vertical"
    });

    var viewRowClose = Ti.UI.createView({
        height : "10%",
        width : "100%"
    });
    var labelClose = Ti.UI.createLabel({
        text : "X",
        color : "white",
        font : {
            fontSize : "25sp",
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        right : "5%"
    });
    viewRowClose.add(labelClose);

    var viewRow1 = Ti.UI.createView({
        height : "10%",
        width : "100%",
        layout : "vertical"
    });
    var viewRow2 = Ti.UI.createView({
        height : "70%",
        width : "100%",
        layout : "vertical"
    });

    label1 = Ti.UI.createLabel({
        text : "ROP Information",
        color : "white",
        font : {
            fontSize : '25sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        }
    });
    viewRow1.add(label1);

    //Saluation == Salutation.
    var subViewRow = Ti.UI.createView({
        height : "12%",
        width : "100%",
        layout : "horizontal"
    });
    label1 = Ti.UI.createLabel({
        text : "Salutation / Title",
        color : "white",
        font : {
            fontSize : '18sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "30%",
        left : "10%"
    });
    var label2 = Ti.UI.createLabel({
        text : dataArg.saluation,
        color : colorTextValue,
        font : {
            fontSize : '20sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "50%",
        left : "1%"
    });
    subViewRow.add(label1);
    subViewRow.add(label2);
    viewRow2.add(subViewRow);

    //first name
    var subViewRow = Ti.UI.createView({
        height : "12%",
        width : "100%",
        layout : "horizontal"
    });
    label1 = Ti.UI.createLabel({
        text : "First Name",
        color : "white",
        font : {
            fontSize : '18sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "30%",
        left : "10%"
    });
    var label2 = Ti.UI.createLabel({
        text : dataArg.firstName,
        color : colorTextValue,
        font : {
            fontSize : '20sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "50%",
        left : "1%"
    });
    subViewRow.add(label1);
    subViewRow.add(label2);
    viewRow2.add(subViewRow);

    //last name
    subViewRow = Ti.UI.createView({
        height : "12%",
        width : "100%",
        layout : "horizontal"
    });
    label1 = Ti.UI.createLabel({
        text : "Last Name",
        color : "white",
        font : {
            fontSize : '18sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "30%",
        left : "10%"
    });
    label2 = Ti.UI.createLabel({
        text : dataArg.lastName,
        color : colorTextValue,
        font : {
            fontSize : '20sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "50%",
        left : "1%"
    });
    subViewRow.add(label1);
    subViewRow.add(label2);
    viewRow2.add(subViewRow);

    //birth date
    subViewRow = Ti.UI.createView({
        height : "12%",
        width : "100%",
        layout : "horizontal"
    });
    label1 = Ti.UI.createLabel({
        text : "Birth Date",
        color : "white",
        font : {
            fontSize : '18sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "30%",
        left : "10%"
    });
    label2 = Ti.UI.createLabel({
        text : dataArg.dateOfBirth,
        color : colorTextValue,
        font : {
            fontSize : '20',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "50%",
        left : "1%"
    });
    subViewRow.add(label1);
    subViewRow.add(label2);
    viewRow2.add(subViewRow);

    //Gender
    subViewRow = Ti.UI.createView({
        height : "12%",
        width : "100%",
        layout : "horizontal"
    });
    label1 = Ti.UI.createLabel({
        text : "Gender",
        color : "white",
        font : {
            fontSize : '18sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "30%",
        left : "10%"
    });
    label2 = Ti.UI.createLabel({
        text : dataArg.gender,
        color : colorTextValue,
        font : {
            fontSize : '20sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "50%",
        left : "1%"
    });
    subViewRow.add(label1);
    subViewRow.add(label2);
    viewRow2.add(subViewRow);

    //Nationality
    subViewRow = Ti.UI.createView({
        height : "12%",
        width : "100%",
        layout : "horizontal"
    });
    label1 = Ti.UI.createLabel({
        text : "Nationality",
        color : "white",
        font : {
            fontSize : '18sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "30%",
        left : "10%"
    });
    
    var natinalityFullName = model.getFullNameNationality(dataArg.nationality);
    label2 = Ti.UI.createLabel({
        text : natinalityFullName != null ? natinalityFullName.fullname : "",
        color : colorTextValue,
        font : {
            fontSize : utility.dpiConverter(20),
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "50%",
        left : "1%"
    });
    subViewRow.add(label1);
    subViewRow.add(label2);
    viewRow2.add(subViewRow);

    //Phone
    subViewRow = Ti.UI.createView({
        height : "12%",
        width : "100%",
        layout : "horizontal"
    });
    label1 = Ti.UI.createLabel({
        text : "Phone",
        color : "white",
        font : {
            fontSize : '18sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "30%",
        left : "10%"
    });
    label2 = Ti.UI.createLabel({
        text : dataArg.countryCode + " " + dataArg.areaCode + " " + dataArg.phoneNumber,
        color : colorTextValue,
        font : {
            fontSize : '20sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "50%",
        left : "1%"
    });
    subViewRow.add(label1);
    subViewRow.add(label2);
    viewRow2.add(subViewRow);

    //Email
    subViewRow = Ti.UI.createView({
        height : "12%",
        width : "100%",
        layout : "horizontal"
    });
    label1 = Ti.UI.createLabel({
        text : "Email",
        color : "white",
        font : {
            fontSize : '18sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "30%",
        left : "10%"
    });
    label2 = Ti.UI.createLabel({
        text : dataArg.email,
        color : colorTextValue,
        font : {
            fontSize : '20sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "50%",
        left : "1%"
    });
    subViewRow.add(label1);
    subViewRow.add(label2);
    viewRow2.add(subViewRow);

    view.add(viewRowClose);
    view.add(viewRow1);
    view.add(viewRow2);

    ropEnrollment = model.getROPEnrollment(passenger.accountId, passenger.paxKey);
    var isEdit = false;
    if(ropEnrollment != null) {
        var flightDerail = model.getFlightDetails(currentFlightId); 
        if(flightDerail != null) {
            var flightNumberTemp = flightDerail.flightExternalId.replace(/_/gi, "");
            var flightNumber = flightNumberTemp.substring(0, flightNumberTemp.length-1);                                             

            if(ropEnrollment.flightNumber != flightNumber && ropEnrollment.status == VOIDED) {
            } else if(ropEnrollment.flightNumber != flightNumber && ropEnrollment.status != VOIDED){
            } else if(ropEnrollment.flightNumber == flightNumber && ropEnrollment.status == VOIDED){
            } else if(ropEnrollment.flightNumber == flightNumber && ropEnrollment.status != VOIDED && ropEnrollment.isSynced){
                isEdit = false;
            } else if(ropEnrollment.flightNumber == flightNumber && ropEnrollment.status != VOIDED && !ropEnrollment.isSynced){
                isEdit = true;  
            }               
        } 
    }                
   
    var td1 = Ti.UI.createView({
        height : "10%",
        width : "100%",
        layout : "horizontal"
    });
    
    var editBtnView = Ti.UI.createView({
        height : "100%",
        width : isEdit ? "50%" : "0%",
        layout : "vertical"
    });

    var voidBtnView = Ti.UI.createView({
        height : "100%",
        width : isEdit ? "50%" : "100%",
        layout : "vertical"
    });

    var btnEdit = Ti.UI.createImageView({
        image : "/images/btn_edit.png",
        height : "50",
        width : "150",
        borderRadius : '2px'
    });

    var btnVoid = Ti.UI.createImageView({
        image : "/images/btn_void.png",
        height : "50",
        width : "150",
        borderRadius : '2px'
    });
    
    var labelVoided = Ti.UI.createLabel({
        text : "This Enrollment is voided.",
        color : "#F540FE",
        font : {
            fontSize : utility.dpiConverter(25),
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "100%",
        height : "100%",
        textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER
    });

    var labelReason = Ti.UI.createLabel({
        text : "",
        color : "#F540FE",
        font : {
            fontSize : utility.dpiConverter(25),
            fontFamily : 'arial',
            fontWeight : 'bold'
        },
        width : "100%",
        height : "100%",
        textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER
    });

    btnVoid.addEventListener("click", function(e) {
        closeFlag = 1;
        var _syncDataPromptView = new Alloy.createController("common/alertPrompt", {
            title : 'Confirm',
            message : 'Do you want to void this Enrollment?',
            okText : "Yes",
            cancelText : "No",
            onOk : function() {
                model.voidROPEnrollment(passenger.paxKey);
                ropEnrollment = model.getROPEnrollment(passenger.accountId, passenger.paxKey);
                if(ropEnrollment != null) {
                    if (ropEnrollment.status == VOIDED) {
                        td1.removeAllChildren();
                        voidBtnView.add(labelVoided);
                        td1.add(voidBtnView); 
                    } else {
                        voidBtnView.add(btnVoid);
                        td1.add(voidBtnView);                        
                    }            
                }                
            }
        }).getView();
        _syncDataPromptView.open();
    });

    btnEdit.addEventListener("click", function(e) {
        closeFlag = 1;
        var ropEnbrolFormView = Alloy.createController("rop_enrollment/rop_enrollment_form", {
            passengerId : passenger.id,
            isNew : false
        }).getView();
        isFromPassengerDetail = true;
        if(OS_IOS)
        {
        	Alloy.Globals.navGroupWin.openWindow(ropEnbrolFormView);
        }else{
        	$.anActIndicatorView.show();
        	ropEnbrolFormView.open();	
        }
        
    });

    if(ropEnrollment != null) {
        if(flightDerail != null) {
            var flightNumberTemp = flightDerail.flightExternalId.replace(/_/gi, "");
            var flightNumber = flightNumberTemp.substring(0, flightNumberTemp.length-1);                                             

            if(ropEnrollment.flightNumber != flightNumber && ropEnrollment.status == VOIDED) {
            } else if(ropEnrollment.flightNumber != flightNumber && ropEnrollment.status != VOIDED){
            } else if(ropEnrollment.flightNumber == flightNumber && ropEnrollment.status == VOIDED){
                td1.removeAllChildren();
                voidBtnView.add(labelVoided);
                td1.add(voidBtnView);                                                                                    
            } else if(ropEnrollment.flightNumber == flightNumber && ropEnrollment.status != VOIDED && ropEnrollment.isSynced){
                voidBtnView.add(btnVoid);
                td1.add(voidBtnView);                                                                    
            } else if(ropEnrollment.flightNumber == flightNumber && ropEnrollment.status != VOIDED && !ropEnrollment.isSynced){
                editBtnView.add(btnEdit);
                voidBtnView.add(btnVoid);
                td1.add(editBtnView);                        
                td1.add(voidBtnView);                        
            }               
        } 
    }                

    view.add(td1);

    win2.add(view);

    closeFlag = 1;
    win2.open();

    win2.addEventListener("click", function(e) {
        win2.close();
    });
    labelClose.addEventListener("click", function(e) {
        win2.close();
    });

}

function updateSeatClassOfPassenger() {
    $.bookingSeatClass.text = passenger.bookingSeat != "" ? (passenger.bookingSeat + "  " + "Class " + passenger.bookingClass) : "";
    $.floorZone.text = passenger.floor != "" ? (passenger.floor + "-" + "zone" + passenger.zone) : "";    
    $.bookingClass.text = passenger.bookingClass;
}

function onVoidUpgradeSeat(e) {
   e.source.image = "/images/btn_voided1.png";

   var voidedData = {
        currentSeat : passenger != null ? passenger.oldSeat : "",
        currentClass : passenger != null ? passenger.oldClass : "",
        paxId : passenger != null ? passenger.id : "",
        accountId : passenger != null ? passenger.accountId : "",
        paxKey : passenger != null ? passenger.paxKey : ""                   
    };
    model.voidUpdateSeatClass(voidedData);  

    var dataTemp = {
        newStatus : null,
        hasPax : null,
        position : passenger.bookingSeat,
        paxId : passenger.id,
        accountId : passenger.accountId,
        paxKey : passenger.paxKey                      
    };
    
    model.updateSeatStatusOnLOPA(dataTemp);
    
    var dataTemp = {
        newStatus : null,
        hasPax : null,
        position : passenger.oldSeat,                      
        paxId : passenger.id,
        accountId : passenger.accountId,
        paxKey : passenger.paxKey                      
    };
    
    model.updateSeatStatusOnLOPA(dataTemp);

    upgradeList = model.getUpgradeSeatData(passenger.paxKey, passenger.accountId, passenger.id);

    if(passenger != null) {
        passenger = model.getPassengerDetail(passenger.id);            
    }
    if(passenger != null) {
        updateSeatClassOfPassenger();        
    }    
    passengerListIsRefresh = 1;
}

function showUpgradeSeatClassRecords() {
    upgradeIncidentList = model.getChangeUpgradeSeatIncidentsByPassengerOrPosition(passenger.id, passenger.accountId, passenger.paxKey, "", acReg, "upgradeSeat");
    var tableData = [];

    if(upgradeIncidentList != null && upgradeIncidentList.length > 0) {
            
        $.upgradeSeatTableView.removeAllChildren();
        for(var i = 0; i < upgradeIncidentList.length; i++) {
            var splitedTextByLineBreak = upgradeIncidentList[i].detail.split("\n"); 
            var fromSeatText = splitedTextByLineBreak[0];
            var toSeatText = splitedTextByLineBreak[1];
            var amount = splitedTextByLineBreak[2];
            
            var view = Ti.UI.createView({
                backgroundColor : 'transparent',
                layout : "vertical",
                left : "5%",
                height : "100%",
                width : "94%",
                touchEnabled : true
            });
                
            var viewFrom = Ti.UI.createView({
                backgroundColor : 'transparent',
                layout : "horizontal",
                height : "33%",
                width : "100%",
                touchEnabled : true
            });
        
            var viewTo = Ti.UI.createView({
                backgroundColor : 'transparent',
                layout : "horizontal",
                height : "33%",
                width : "100%",
                touchEnabled : true
            });

            var viewAmount = Ti.UI.createView({
                backgroundColor : 'transparent',
                layout : "horizontal",
                height : "33%",
                width : "100%",
                touchEnabled : true
            });
                    
            var labelFrom = Ti.UI.createLabel({
                text : fromSeatText,
                color : colorTextTitle,
                font : {
                    fontSize : utility.dpiConverter(20),
                },
                height : "100%",
                width : "100%",
//                top : 10
            });
                
            var labelTo = Ti.UI.createLabel({
                text : toSeatText,
                color : colorTextTitle,
                font : {
                    fontSize : utility.dpiConverter(20),
                },
                height : "100%",
                width : "100%",
//                top : 0
            });
            
            var labelAmount = Ti.UI.createLabel({
                text : amount,
                color : colorTextTitle,
                font : {
                    fontSize : utility.dpiConverter(20),
                },
                height : "100%",
                width : "100%",
//                top : 0
            });

             var row = Ti.UI.createTableViewRow({
                backgroundColor : 'transparent',
                height : 90,
                width : "100%",
                touchEnable : true,
                hasChild : 'false',
                selectionStyle : "none",
                index : i
            });
           
            viewFrom.add(labelFrom);
            viewTo.add(labelTo);
            viewAmount.add(labelAmount);
            view.add(viewFrom);
            view.add(viewTo);
            view.add(viewAmount);
            row.add(view);
            
            tableData.push(row);            
        }        
    
        
        $.upgradeSeatTableView.setData(tableData);
        $.upgradeSeatTableView.height = Ti.UI.SIZE;                   
    }    
}

function showChangeSeatClassRecords() {
    changeIncidentList = model.getChangeUpgradeSeatIncidentsByPassengerOrPosition(passenger.id, passenger.accountId, passenger.paxKey, "", acReg, "changeSeat");
    var tableData = [];

    if(changeIncidentList != null && changeIncidentList.length > 0) {
    
        $.upgradeSeatTableView.removeAllChildren();
    
        for(var i = 0; i < changeIncidentList.length; i++) {
            var splitedTextByLineBreak = changeIncidentList[i].detail.split("\n"); 
            var fromSeatText = splitedTextByLineBreak[0];
            var toSeatText = splitedTextByLineBreak[1];
            var reasonForChangeSeatText = changeIncidentList[i].reasonForChangeSeat;
            
            var view = Ti.UI.createView({
                backgroundColor : 'transparent',
                layout : "vertical",
                left : "5%",
                height : "100%",
                width : "94%",
                touchEnabled : true
            });
                
            var viewFrom = Ti.UI.createView({
                backgroundColor : 'transparent',
                layout : "horizontal",
                height : 30,
                width : "100%",
                touchEnabled : true
            });
        
            var viewTo = Ti.UI.createView({
                backgroundColor : 'transparent',
                layout : "horizontal",
                height : 30,
                width : "100%",
                touchEnabled : true
            });
                    
            var viewReasonForChange = Ti.UI.createView({
                backgroundColor : 'transparent',
                layout : "horizontal",
                height : 79,
                width : "100%",
                touchEnabled : true
            });
           
            var labelFrom = Ti.UI.createLabel({
                text : fromSeatText,
                color : colorTextValue,
                font : {
                    fontSize : utility.dpiConverter(20),
                },
                height : "100%",
                width : "100%",
                top : 5
            });
                
            var labelTo = Ti.UI.createLabel({
                text : toSeatText,
                color : colorTextValue,
                font : {
                    fontSize : utility.dpiConverter(20),
                },
                height : "100%",
                width : "100%",
                top : 3
            });

            var labelReasonForChangeSeat = Ti.UI.createLabel({
                text : "Reason for change : " + reasonForChangeSeatText,
                color : colorTextTitle,
                font : {
                    fontSize : utility.dpiConverter(18),
                },
                height : "100%",
                width : "100%",
                // wordWrap : true,
                // ellipsize : true,
            });

             var row = Ti.UI.createTableViewRow({
                backgroundColor : 'transparent',
                height : 140,
                width : "100%",
                touchEnable : true,
                hasChild : 'false',
                selectionStyle : "none",
                index : i
            });
            
            viewFrom.add(labelFrom);
            viewTo.add(labelTo);
            viewReasonForChange.add(labelReasonForChangeSeat);
            view.add(viewFrom);
            view.add(viewTo);
            view.add(viewReasonForChange);
            row.add(view);
            
            tableData.push(row);            
        }        

        $.changeSeatTableView.setData(tableData);
        $.changeSeatTableView.height = Ti.UI.SIZE;                   
    }    
}

function initialPassengerPsychology(passengerPsychology) {
    if (passengerPsychology != false) {
    	$.passengePsycontent.removeAllChildren();
    	var psyTableData = [];
    	var likeView = Ti.UI.createView({
    		height : Ti.UI.SIZE,
    		width : "100%",
    		layout : "horizontal"
    	});
    	
    	var titleLike = $.UI.create("Label", {
    		width : "35%",
    		height : "100%",
    		left : "5%",
			classes : ['subLabelShow'],
			verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
			top : 15
		});
		titleLike.text = "Like :";
    	
    	var textLike = $.UI.create("Label", {
    		width : "55%",
			classes : ['LabelShow2'],
			top : 10
		});
		textLike.text = passengerPsychology.like;
		argsLike = passengerPsychology.like;
		
		var likeWrapHeight = textLike.toImage();
		
		var likeRow = Ti.UI.createTableViewRow({
    		height : setRowHeightPsychology(likeWrapHeight.height != 1024 ? likeWrapHeight.height : 0),
    		color : "white",
    		backgroundColor : "transparent",
    		selectedBackgroundColor : "transparent"
    	});
    	
    	var dislikeView = Ti.UI.createView({
    		height : Ti.UI.SIZE,
    		width : "100%",
    		layout : "horizontal"
    	});
    	
    	var titledisLike = $.UI.create("Label", {
    		width : "35%",
    		height : "100%",
    		left : "5%",
			classes : ['subLabelShow'],
			verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
			top : 15
		});
		titledisLike.text = "Dislike :";
    	
    	var textdisLike = $.UI.create("Label", {
    		width : "55%",
			classes : ['LabelShow2'],
			top : 10
		});
		textdisLike.text = passengerPsychology.disLike;
		argsDisLike = passengerPsychology.disLike;
		
		var dislikeWrapHeight = textdisLike.toImage();
		
		var dislikeRow = Ti.UI.createTableViewRow({
    		height : setRowHeightPsychology(dislikeWrapHeight.height != 1024 ? dislikeWrapHeight.height : 0),
    		color : "white",
    		backgroundColor : "transparent",
    		selectedBackgroundColor : "transparent"
    	});
    	
    	var otherView = Ti.UI.createView({
    		height : Ti.UI.SIZE,
    		width : "100%",
    		layout : "horizontal"
    	});
    	
    	var titleOther = $.UI.create("Label", {
    		width : "35%",
    		height : "100%",
    		left : "5%",
			classes : ['subLabelShow'],
			verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
			top : 15
		});
		titleOther.text = "Other/Information :";
    	
    	var textOther = $.UI.create("Label", {
    		width : "55%",
			classes : ['LabelShow2'],
			top : 10
		});
		textOther.text = passengerPsychology.other;
		argsOther = passengerPsychology.other;
		
		var otherWrapHeight = textOther.toImage();
		
		var otherRow = Ti.UI.createTableViewRow({
    		height : setRowHeightPsychology(otherWrapHeight.height != 1024 ? otherWrapHeight.height : 0),
    		color : "white",
    		backgroundColor : "transparent",
    		selectedBackgroundColor : "transparent"
    	});
    	
    	var gndView = Ti.UI.createView({
    		height : Ti.UI.SIZE,
    		width : "100%",
    		layout : "horizontal"
    	});
    	
    	var titleGnd = $.UI.create("Label", {
    		width : "35%",
    		height : "100%",
    		left : "5%",
			classes : ['subLabelShow'],
			verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
			top : 15
		});
		titleGnd.text = "By Ground Customer Service :";
    	
    	var textGnd = $.UI.create("Label", {
    		width : "55%",
			classes : ['LabelShow2'],
			top : 10
		});
		textGnd.text = passengerPsychology.byGround;
		
		var gndWrapHeight = textGnd.toImage();
		
		var gndRow = Ti.UI.createTableViewRow({
    		height : setRowHeightPsychology(gndWrapHeight.height != 1024 ? gndWrapHeight.height : 0),
    		color : "white",
    		backgroundColor : "transparent",
    		selectedBackgroundColor : "transparent"
    	});
    	
    	var saleView = Ti.UI.createView({
    		height : Ti.UI.SIZE,
    		width : "100%",
    		layout : "horizontal"
    	});
    	
    	var titleSale = $.UI.create("Label", {
    		width : "35%",
    		height : "100%",
    		left : "5%",
			classes : ['subLabelShow'],
			verticalAlign : Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
			top : 15
		});
		titleSale.text = "By Sale and Marketing :";
    	
    	var textSale = $.UI.create("Label", {
    		width : "55%",
			classes : ['LabelShow2'],
			top : 10
		});
		textSale.text = passengerPsychology.bySale;
		
		var saleWrapHeight = textSale.toImage();
		
		var saleRow = Ti.UI.createTableViewRow({
    		height : setRowHeightPsychology(saleWrapHeight.height != 1024 ? saleWrapHeight.height : 0),
    		color : "white",
    		backgroundColor : "transparent",
    		selectedBackgroundColor : "transparent"
    	});
    	
    	var isLikePost = true;
    	textLike.addEventListener('postlayout', function(){
    		if(isLikePost){
				likeRow.height = setRowHeightPsychology(textLike.toImage().height != 1024 ? textLike.toImage().height : 0);
	    		isLikePost = false;
    		}
		});
		
		var isDisPost = true;
		textdisLike.addEventListener('postlayout', function(){
    		if(isDisPost){
				dislikeRow.height = setRowHeightPsychology(textdisLike.toImage().height != 1024 ? textdisLike.toImage().height : 0);
	    		isDisPost = false;
    		}
		});
		
		var isOtherPost = true;
		textOther.addEventListener('postlayout', function(){
    		if(isOtherPost){
				otherRow.height = setRowHeightPsychology(textOther.toImage().height != 1024 ? textOther.toImage().height : 0);
	    		isOtherPost = false;
    		}
		});
		
		var isGndPost = true;
		textGnd.addEventListener('postlayout', function(){
    		if(isGndPost){
				gndRow.height = setRowHeightPsychology(textGnd.toImage().height != 1024 ? textGnd.toImage().height : 0);
	    		isGndPost = false;
    		}
		});
		
		var isSalePost = true;
		textSale.addEventListener('postlayout', function(){
    		if(isSalePost){
				saleRow.height = setRowHeightPsychology(textSale.toImage().height != 1024 ? textSale.toImage().height : 0);
	    		isSalePost = false;
    		}
		});
    	
    	likeView.add(titleLike);
		likeView.add(textLike);
		likeRow.add(likeView);
		psyTableData.push(likeRow);
		
		dislikeView.add(titledisLike);
    	dislikeView.add(textdisLike);
    	dislikeRow.add(dislikeView);
    	psyTableData.push(dislikeRow);
    	
    	otherView.add(titleOther);
    	otherView.add(textOther);
    	otherRow.add(otherView);
    	psyTableData.push(otherRow);
    	
    	gndView.add(titleGnd);
    	gndView.add(textGnd);
    	gndRow.add(gndView);
    	psyTableData.push(gndRow);
    	
    	saleView.add(titleSale);
    	saleView.add(textSale);
    	saleRow.add(saleView);
    	psyTableData.push(saleRow);
    	
    	$.passengePsycontent.applyProperties({
    		height : Ti.UI.SIZE,
    		backgroundColor : "transparent",
    		separatorColor : "transparent",
			touchEnabled : false,
			scrollable : false,
			data : psyTableData
    	});
    	if (OS_ANDROID) {
    		$.passengePsycontent.height = Ti.UI.SIZE;
    		$.passengePsycontent.backgroundColor = "transparent";
    		$.passengePsycontent.separatorColor = "transparent";
    		$.passengePsycontent.scrollable = false;
    		$.passengePsycontent.data = psyTableData;
    	}
    } else {
        $.passengerPsyBtb.top = 0;
        $.passengerPsyBtb.height = 0;
        $.passengerPsyBtb.hide();
        $.passengePsycontent.height = 0;
        $.passengePsycontent.hide();
    }
}

function setRowHeightPsychology(labelHeight) {
	var getHeight = 60;
    if (labelHeight < 54) {
        getHeight = 60;
    } else {
    	getHeight = labelHeight + 20;
    }
    return getHeight;
}

//* Initial Table Row to view Incident data
function initializeIncidentRow(incident, index) {
   var iconWidth = 0;
   var subtitleWidthPercentageOfScreen = 70;           
   if(OS_ANDROID) {
       var subtitleWidthPercentageOfScreen = 50;           
   } 

    var str2 = incident.category;
    if (str2 == null) {
        str2 = "";
    } else {
        str2 = str2.toString();
    }

    var icon2 = $.UI.create("ImageView", {
        image : (str2.length > 0) ? "/images/" + "ic_" + component.incidentCategoryArray(str2) + "1" + ".png" : "/images/ic_other1.png",
        left : iconWidth + 20,
        height : 40,
        width : 40,
    });
    str2 = null;

    var lastNameStr;
    var firsNameStr;
    var seatName = "";
    var posName = "";
    var seatStr = "";
    var classStr = "";
    var equipmentNameStr = "";

    if(incident.category == AC_MAINTENANCE || incident.category == SAFETY_EQUIPMENT) {
        for (var i = 0; i < incident.lopaPosition.length; i++) {
            if (incident.lopaPosition[i] != null && incident.lopaPosition[i].length > 0) {
                posName += ", " + incident.lopaPosition[i];
            } 
        }                
        posName = posName.substring(2, posName.length);
    } else {
        if (incident.passengerBookingSeat != null && incident.passengerBookingSeat.length) {
            seatName = incident.passengerBookingSeat;
        }        
    }

    if (incident.passengerLastName != null && incident.passengerLastName.length > 0)
        lastNameStr = incident.passengerLastName + " ";
    else
        lastNameStr = "";
    if (incident.passengerFirstName != null && incident.passengerFirstName.length > 0)
        firsNameStr = incident.passengerFirstName;
    else
        firsNameStr = "";
    if ((seatName != null && seatName.length > 0) || (posName != null && posName.length > 0))
        seatStr = "Seat No. " + seatName + posName;
    else
        seatStr = "";
    if (incident.passengerBookingClass != null && incident.passengerBookingClass.length > 0)
        classStr = ", Class " + incident.passengerBookingClass + "   ";
    else
        classStr = "";

    var passengerStr = lastNameStr + firsNameStr + seatStr + classStr;
    if (passengerStr.length > 0) {
        var nameStr = lastNameStr + firsNameStr;
    } else if (incident.category == EMERGENCY && (incident.emergencyType == CREW_DECEASE || incident.emergencyType == SEVERE_CREW_INJURY)) {
        var crewFirstName = !utility.isEmpty(incident.crewFirstName) ? incident.crewFirstName + " " : "";
        var crewLastName = !utility.isEmpty(incident.crewLastName) ? incident.crewLastName + " " : "";
        var crewRank = !utility.isEmpty(incident.crewRank) ? incident.crewRank + " " : "";
        var nameStr = crewRank + crewFirstName + crewLastName;
    } else {
        var nameStr = "";
    }

    if (incident.equipmentName != null && incident.equipmentName.length > 0)
        equipmentNameStr = incident.equipmentName;
    else
        equipmentNameStr = "";
    if (incident.condition != null && incident.condition.length > 0)
        conditionStr = " " + incident.condition;
    else
        conditionStr = "";
    var slashStr = "";
    
    if(nameStr.length > 0 && equipmentNameStr.length > 0) {
        slashStr = " - ";
    }
    
    var headerLabel = nameStr + slashStr;

    var subjectStr = "";
    if (incident.subject != null && incident.subject.length > 0) {
        subjectStr = incident.subject;        
    } else {
        subjectStr = "";        
    }
    
    var seatClassStr = seatStr + classStr;

    var title = $.UI.create("Label", {
        text : headerLabel,
        top : 7,
        left : iconWidth + icon2.width + 30,
        height : 17,
        classes : 'fontBold17',
        color : colorTextSubTitle
    });
    
    if(OS_ANDROID)
    {
        title.height = 25;
    }
    
    if(headerLabel.length > 0) {
       var titleWidth = title.toImage().width;        
    } else {
       var titleWidth = 0;        
    }
    
    var title2 = $.UI.create("Label", {
        text :equipmentNameStr + conditionStr,
        top : 7,
        left : iconWidth + icon2.width + titleWidth +30,
        height : 17,
        lines: 1,
        classes : 'fontBold17',
        color : colorTextValue
    });
    
    if(OS_ANDROID)
    {
        if(titleWidth > 0) {
            var titleWidthCalibration = utility.toImageCalibrationForAndroid(titleWidth);         
        } else {
            var titleWidthCalibration = titleWidth;         
        }
        title2.height = 22;
        title2.left = iconWidth + icon2.width + titleWidthCalibration + 30;
        title2.width = windowWidth - (iconWidth + icon2.width + titleWidthCalibration + 320);   
        title2.wordWrap = false;
        title2.ellipsize = true;
        
    } else {
        title2.width = windowWidth - (iconWidth + icon2.width + titleWidth + 140);        
    }
    
    var widthForSubtitle = 0;
    if(seatClassStr.length == 0) {
        widthForSubtitle = Math.floor((50/100) * windowWidth);
    } else {
        widthForSubtitle = null;        
    }

    var subtitle = $.UI.create("Label", {
        text : subjectStr,
        top : title.top + title.height + 5,
        left : iconWidth + icon2.width + 30,
        height : 16,
        lines : 1,
        width : widthForSubtitle,
        classes : 'fontLight16',
        color : colorTextValue
    });
    
    var subtitleWidth = subtitle.toImage();

    subtitleWidth = subtitleWidth.width;
    
    if(OS_ANDROID)
    {
        subtitle.height = 20;
        subtitle.wordWrap = false;
        subtitle.ellipsize = true;
        subtitleWidth = utility.toImageCalibrationForAndroid(subtitleWidth);       
    }

    if (subjectStr != null && subjectStr.length > 0) {
        subtitleWidth = iconWidth + icon2.width + 35 + subtitleWidth;
    } else {
        subtitleWidth = iconWidth + icon2.width + 30;
    }
            
    if((subtitleWidth > Math.floor((subtitleWidthPercentageOfScreen/100) * windowWidth)) && seatClassStr.length == 0) {
        subtitle.width = Math.floor((subtitleWidthPercentageOfScreen/100) * windowWidth);
    } else if((subtitleWidth > Math.floor((subtitleWidthPercentageOfScreen/100) * windowWidth)) && seatClassStr.length > 0){
        subtitle.width = Math.floor((subtitleWidthPercentageOfScreen/100) * windowWidth) - (iconWidth + icon2.width + 30);  
        subtitleWidth  = Math.floor((subtitleWidthPercentageOfScreen/100) * windowWidth);      
    } else {
        subtitle.width = subtitleWidth - (iconWidth + icon2.width + 35);
        subtitleWidth = subtitle.width + iconWidth + icon2.width + 35;  
        // Ti.API.info(seatClassStr);
    }
       
    var subtitle1 = $.UI.create("Label", {
        text : seatClassStr,
        top : title.top + title.height + 5,
        left : subtitleWidth,
        width : windowWidth - (subtitleWidth + 140),
        height : 16,
        lines : 1,
        classes : 'fontLight16',
        color : colorTextSubTitle
    });
    
    if(OS_ANDROID)
        {
            subtitle1.width = Math.floor((15/100) * windowWidth);
            subtitle1.height = 20;
            subtitle1.wordWrap = false;
            subtitle1.ellipsize = true;

        }

    var str1;
    if (utility.isEmpty(incident.logGroup) && incident.category != AC_MAINTENANCE && incident.category != SAFETY_EQUIPMENT) {
        str1 = "";
    } else {
        if (incident.logGroup == CABIN_LOG) {
            str1 = "Cabin Log No. : " + incident.sequenceNumber;
        } else if (incident.logGroup == FLIGHT_DECK_LOG) {
            str1 = "FLT Deck Log No. : " + incident.sequenceNumber;
        } else {
            str1 = incident.sequenceNumber;
        }
    }
    var logNumber = $.UI.create("Label", {
        text : str1,
//        top : subtitle.top + subtitle.height + 5,
        bottom : 7,
        left : iconWidth + icon2.width + 30,
        classes : 'fontLight16',
        color : colorTextDesc
    });
    str1 = null;

    var flightNumber = $.UI.create("Label", {
        text : incident.flightNumber, //"TG628 / 8MAY2017",
        top : subtitle.top + subtitle.height + 5,
//        bottom : 7,
        left : iconWidth + icon2.width + 30,
        classes : 'fontLight16',
        color : colorTextDesc
    });
    
    var intStatus = "";

    if(incident.status == OPEN) {
        intStatus = "PENDING";
    } else if(incident.status == RESOLVED || incident.status == CLOSED) {
        intStatus = "RESOLVED";        
    } 
    
    var incidentStatusTop = 20;
    if(OS_ANDROID) {
        incidentStatusTop = 23;
    }

    var incidentStatus = $.UI.create("Label", {
        text : !incident.isVoided ? intStatus : "VOIDED",
        top : incidentStatusTop,
        right : 5,
        classes : 'fontLight16',
        color : colorTextValue
    });
    

    var reportedBy = $.UI.create("Label", {
        text : incident.reportedBy,
        bottom : 25,
        right : 5,
        classes : 'fontLight16',
        color : "#A3FFFFFF"
    });

    var createdDateTime = $.UI.create("Label", {
        text : utility.displayDateTime(incident.createDateTime),
        bottom : 7,
        right : 5,
        classes : 'fontLight16',
        color : colorTextDesc
    });

    var row = $.UI.create("TableViewRow", {
        selectedColor : 'transparent',
        hasChild : 'true',
        height : 100,
        touchEnabled : true,
        id : incident.id,
        idType : "btnRow"
    });
    
    if(OS_ANDROID)
    {
        row.left = 20;
        row.height = 110;
    }
    
    row.addEventListener("click", function(e) {
        if ((e.source.id == undefined || e.source.idType == "btnRow") && (e.source.id != "iconId")) {
            if(OS_IOS){ Alloy.Globals.activityIndicator.show(); }
            setTimeout(function() {
                var incidentDetailView = Alloy.createController("incidents/incident_detail", {
                    incidentCate : "",
                    isNew : false,
                    incidentId : e.source.parent.id == undefined ? e.source.id : e.source.parent.id,
                    type : ""
                }).getView();
                
                if(OS_IOS){
                    Alloy.Globals.navGroupWin.openWindow(incidentDetailView);
                }else{
                	$.anActIndicatorView.show();
                    incidentDetailView.open();
                }
                
            }, 200);
        }
    });

    row.add(title);
    row.add(title2);
    row.add(subtitle);
    row.add(subtitle1);
    row.add(reportedBy);
    row.add(createdDateTime);
    row.add(incidentStatus);
    row.add(icon2);
    row.add(logNumber);
    row.add(flightNumber);
    incident = null;
    headerLabe = null;
    return row;
}

function formatDate(date) {
    var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    var d = new Date(date);
    var month = '' + d.getMonth();
    var day = '' + d.getDate();
    var year = d.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    return [day, months[month], year].join(' ');
}

function showIncidentList(dataAgr) {
    $.incidentListTableView1.removeAllChildren();
    tableData1 = [];

    for (var i = 0; i < dataAgr.length; i++) {
        tableData1.push(initializeIncidentRow(dataAgr[i], i));
    }
    $.incidentListTableView1.setData(tableData1);
    $.incidentListTableView1.selectionStyle = "none";
    tableData1 = null;
    dataAgr = null;
}

//* Dialog option for selecting incident category to create the new incident
function createOptionalBtn(dataAgr, indexArg) {
    var btnId = dataAgr[0];
    var btnName = dataAgr[1];
    var imgPathName = dataAgr[2];
    var pagePath;
    var textColor;

        textColor = null;
    var row = component.createOptionDialogBtn(btnId, 3);
    row.add(component.createIcon(imgPathName, "7%"));
    row.add(component.createLabel(btnName, "17%", textColor));

    row.addEventListener("click", function(e) {
        if (e.source.id == undefined || e.source.idType == "btnRow") {
            if (e.source.parent.id == undefined) {
                btnId = e.source.id;
            } else {
                btnId = e.source.parent.id;
            }
        }
        if (btnId == EMERGENCY) {
            pagePath = "passengers/passenger_emergency_category";
        } else {
            pagePath = "incidents/incident_detail";
        }
        var pageView = Alloy.createController(pagePath, {
            incidentCate : btnId,
            passengerId : passenger.id,
            isNew : true,
            incidentId : "",
            type : "",
            fromWhere : PASSENGER_DETAIL
        }).getView();
        if(OS_IOS)
        {
        	Alloy.Globals.navGroupWin.openWindow(pageView);	
        }else{
        	$.anActIndicatorView.show();
        	pageView.open();
        }
        
    });
    btnId = null;
    pagePath = null;
    btnName = null;
    imgPathName = null;
    return row;
}

//* Event on +CREATE INCIDENT button
$.incidentBtn.addEventListener("click", function(e) {
    var data = [];
    data = component.incidentCategoryData();
    data.remove(4);
    data.remove(2);
    data.remove(1);

    var tableData = [];
    for (var i = 0; i < data.length; i++) {
        tableData.push(createOptionalBtn(data[i], i));
    }
    var win2 = component.createOptionDialogWindow(tableData, "70%");
    data = null;
    tableData = null;

    win2.open();
    win2.addEventListener("click", function(e) {
        win2.close();
    });
});

function init() {
	windowWidth = $.passengerDetailView.toImage().width; 
    
    flightInformation = model.getFlight(currentFlightId);
    // Ti.API.info("HERE getFlight");
    if (flightInformation != null) {
        acReg = flightInformation.aircraftRegistration;
    }
    
    // Ti.API.info("HERE getPassengerDetailByIdOrAccountIdOrPaxKey");
    // Ti.API.info(LOPAPositionPos);
    // Ti.API.info(passengerId);
    
    if(OS_ANDROID)
    {
    	LOPAPositionPos = LOPAPositionPos != null ? LOPAPositionPos : "";
    	passengerId = passengerId != null ? passengerId : "";	
    }
    
    
    passenger = model.getPassengerDetailByIdOrAccountIdOrPaxKey(passengerId, "", "", LOPAPositionPos);
    // Ti.API.info('Pass getPassengerDetailByIdOrAccountIdOrPaxKey');
    if(passenger != null && passenger != undefined) {
        if(passenger.staff == "STAFF") {
            isStaff = true;
            $.applyROP.hide();                
        }
        passengerDetail();   
        // Ti.API.info('Pass passengerDetail');
        showUpgradeSeatClassRecords();
        showChangeSeatClassRecords();
        // Ti.API.info('Pass ');
    } else {
        var _promptView = new Alloy.createController("common/alertPrompt", {
            title : "Alert",
            message : "No passenger data.",
            okText : "OK",
            disableCancel : true,
            onOk : function() {
            	$.passengerDetailWindow.close();
            	$.passengerDetailView.removeAllChildren();
	    		$.passengerDetailView = null;
            }
        }).getView();
        _promptView.open();                 
        
    }    
}

//**********************************************
//* Main
//**********************************************
$.passengerDetailWindow.addEventListener('focus', function(e) {
	// Ti.API.info('FOcus');
    if (incidentPassengerIsRefresh) {
        if (passenger != null) {
            incidents = model.getIncidentsByPassengerOrPosition(passenger.id, passenger.accountId, passenger.paxKey, passenger.bookingSeat, acReg);
        }
        showIncidentList(incidents);
        incidentListIsRefresh = 0;
        incidentPassengerIsRefresh = 0;
        incidentSeatDetailIsRefresh = 0;

        if(OS_IOS) { Alloy.Globals.activityIndicator.hide(); }
        else { $.anActIndicatorView.hide(); }
    }
    
    if (passengerDetailIsRefresh) {
        passengerDetailIsRefresh = 0;
    	passengerPsychology = model.getPassengerPsychology(passenger.accountId);
        initialPassengerPsychology(passengerPsychology);
        ropEnrollment = model.getROPEnrollment(passenger.accountId, passenger.paxKey);
        if(ropEnrollment != null) {
            if (ropEnrollment.status == ENROLL) {
                $.ROPlabel.text = "Applied";
            }           
        }
      }
      
    if(passengerSeatClassIsRefresh) {
        passengerSeatClassIsRefresh = 0;
        if(passenger != null) {
            passenger = model.getPassengerDetail(passenger.id);            
        }
        if(passenger != null) {
            updateSeatClassOfPassenger();        
            showUpgradeSeatClassRecords(); 
            showChangeSeatClassRecords();           
        }
    }
    if(OS_ANDROID){
    	$.anActIndicatorView.hide();
    }
});

$.passengerDetailWindow.addEventListener('postlayout', function(e) {
	if(!isPostedLayout){
    	if(OS_IOS) { Alloy.Globals.activityIndicator.hide();}
    	else { $.anActIndicatorView.hide(); }
    	isPostedLayout = true;
        init();
	}
});

$.passengerDetailWindow.addEventListener('blur', function(e) {
    if (closeFlag != 0) {
        closeFlag = 0;
        return;
    }
});

if(OS_ANDROID)
{
	$.passengerDetailWindow.addEventListener('android:back', function(e) {
	    $.passengerPsyBtb = null;
	    $.passengerDetailView.removeAllChildren();
	    $.passengerDetailView = null;
	    $.passengePsycontent = null;
	    $.incidentBtn = null;
	    $.incidentListTableView1 = null;
	    $.upgradeSeatBtn = null;
	    $.upgradeSeatTableView = null;
	    $.changeSeatBtn = null;
	    $.changeSeatTableView = null;
	    $.imgTitleBar = null;
	    $.passengerDetailWindow.removeAllChildren();
		$.passengerDetailWindow.close();
		
	});
}


