//**********************************************
//* Require
//**********************************************
var query = require('query_lib');
var utility = require('utility_lib');
var component = require('component_lib');

//**********************************************
//* Variable Declaration
//**********************************************
var args = arguments[0] || {};
var passengerId = args.passengerId;
var isNew = args.isNew;


var saluationArray = ["Mr.", "Mrs.", "Miss", "Ms.", "Mstr."];
var genderArray = ["F", "M"];
var nationalityArrayList = [];
var nationalityId;

var flightId;
var flightNumber;
var ropNumber = "";
var appliedBy = "";
var createdBy = "";

var attachment1 = [];
var cameraMenuIndex = 0;

var menuType = 0;
const SALUATION = 1;
const GENDER = 2;
const NATIONALITY = 3;
const CAMERA = 4;
const CREW_LIST = 5;

var passenger;
var conditionForEnroll;
var isAccepted = false;
var changeState = 0;

var countryCodeText = "";
var areaCodeText = "";
var phoneNumberText = "";

const ATTACHMENT_SIZE_LIMIT = 4.5 * 1024 * 1024;

const ANDROID_SCEEN_HEIGHT = Math.floor(utility.dpiConverter(1280));
const SCROLL_VIEW_HEIGHT = Math.floor(ANDROID_SCEEN_HEIGHT*0.85);
//**********************************************
//* Function
//**********************************************

// Remove array record
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

// Initialize data
function initializationRopEnrollDetail() {
    $.countryCode.keyboardType = Titanium.UI.KEYBOARD_TYPE_PHONE_PAD;
    $.areaCode.keyboardType = Titanium.UI.KEYBOARD_TYPE_PHONE_PAD;
    $.phoneNumber.keyboardType = Titanium.UI.KEYBOARD_TYPE_PHONE_PAD;
    
    $.saluation.touchEnabled = false;
    $.dateOfBirth1.touchEnabled = false;
    $.gender1.touchEnabled = false;
    $.nationality1.touchEnabled = false;
    $.reportByTextField.touchEnabled = false;
    
    passenger = query.getPassengerDetail(passengerId);
    conditionForEnroll = query.getConditionForEnrollment();
    nationalityArrayList = query.getNationalityArrayList();
    
    //Ti.API.info('conditionForEnroll.detail ' + conditionForEnroll);
    $.enrollConditionLabel.text = conditionForEnroll != null ? conditionForEnroll.detail : "";
    
    if(passenger != null) {
        if (passenger.gender.substring(0, 1).toLowerCase() == "f")
            $.imageUser.image = "/images/user_woman.png";
        else
            $.imageUser.image = "/images/user_man.png";        
    }

    if(isNew) {
        if(passenger != null) {
            $.name.text = passenger.lastName + " " + passenger.firstName + " " + passenger.salutation;
            $.saluation.value = passenger.salutation;
            $.seatNoClass.text = "Seat No. " + passenger.bookingSeat + " -  Class " + passenger.bookingClass;
            $.floorZone.text = passenger.floor + " - Zone " + passenger.zone;
            $.dateOfBirth.text = passenger.dateOfBirth;
            $.gender.text = passenger.gender;
            $.nationality.text = passenger.nationality;
            $.firstName.value = passenger.firstName;
            $.lastName.value = passenger.lastName;
            $.dateOfBirth1.value = utility.convertDateToYYYmmDD(passenger.dateOfBirth);
            $.gender1.value = passenger.gender.substring(0,1);
            var getNationId = query.getNationalityId(passenger.nationality);
            if(getNationId != null) {
                nationalityId = getNationId.id;
            }
            $.nationality1.value = passenger.nationality;
            var emailStr = "";
            if (passenger.email1 != null && passenger.email1.length > 0) {
                emailStr = passenger.email1;
            } else if (passenger.email2 != null && passenger.email2.length > 0) {
                emailStr = passenger.email2;
            }
            $.email.value = emailStr; 
            flightId = currentFlightId;    
            var flightDerail = query.getFlightDetails(currentFlightId); 
            if(flightDerail != null) {
                var flightNumberTemp = flightDerail.flightExternalId.replace(/_/gi, "");
                flightNumber = flightNumberTemp.substring(0, flightNumberTemp.length-1);                                             
            }
            ropNumber = "";
            appliedBy = "";
            var user = query.getUserDetail();
            if(user != null) {
                createdBy = user.sfdcId;                
            }
            isAccepted = false;
        }
    } else {
        if(passenger != null) {
        	$.saluation.value = passenger.salutation;
            $.name.text = passenger.lastName + " " + passenger.firstName + " " + passenger.salutation;
            $.seatNoClass.text = "Seat No. " + passenger.bookingSeat + " -  Class " + passenger.bookingClass;
            $.floorZone.text = passenger.floor + " - Zone " + passenger.zone;
            $.dateOfBirth.text = passenger.dateOfBirth;
            $.gender.text = passenger.gender;
            $.nationality.text = passenger.nationality;

            var enrollmentDetail = query.getROPEnrollment(passenger.accountId, passenger.paxKey);
            if(enrollmentDetail != null) {
                $.saluation.value = enrollmentDetail.saluation;
                $.firstName.value = enrollmentDetail.firstName;
                $.lastName.value = enrollmentDetail.lastName;
                $.dateOfBirth1.value = enrollmentDetail.dateOfBirth;
                $.gender1.value = enrollmentDetail.gender;
                var natinalityFullName = query.getFullNameNationality(enrollmentDetail.nationality);
                nationalityId = enrollmentDetail.nationality;
                $.nationality1.value = natinalityFullName != null ? natinalityFullName.fullname : "";
                $.email.value = enrollmentDetail.email;
                $.countryCode.value = enrollmentDetail.countryCode;
                $.areaCode.value = enrollmentDetail.areaCode;
                $.phoneNumber.value = enrollmentDetail.phoneNumber;
                flightId = enrollmentDetail.flightId;
                flightNumber = enrollmentDetail.flightNumber;
                ropNumber = enrollmentDetail.ropNumber;                             
                appliedBy = enrollmentDetail.reportedBy;
                var crew = query.getCrewDetailBySfdcId(appliedBy);
                if(crew != null) {
                    $.reportByTextField.value = crew.rank + ". " + crew.crewFirstName + " " + crew.crewLastName;                            
                }
                createdBy = enrollmentDetail.createdBy;   
                isAccepted = enrollmentDetail.isAccepted;                          
            }
            
            var enrollmentAttachement = query.getRopEnrollAttachment(passenger.paxKey);
            if(enrollmentAttachement != null) {
                var attachment = {
                    parentId : enrollmentAttachement.parentId,
                    name : enrollmentAttachement.imagePath,
                    detail : enrollmentAttachement.detail,
                    isSynced : enrollmentAttachement.isSynced,
                    sfdcId : enrollmentAttachement.sfdcId
                };

                attachment1.push(attachment);

                $.attachmentTextField1.value = enrollmentAttachement.detail;
                $.cameraBtn1.image = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "ropEnrollAttachment" + Ti.Filesystem.separator + enrollmentAttachement.imagePath;                
            }
        }        
    }
    
    /*
    $.ropEnrollmentFormWindow.addEventListener('click', function(){
    	$.email.blur();
    	$.countryCode.blur();
    	$.areaCode.blur();
    	$.phoneNumber.blur();
    	$.attachmentTextField1.blur();
    });
    */
}

// Camera Function
function resizeImage(oldImage) {
    var oldWidth = oldImage.width;
    var oldHeight = oldImage.height;
    var aspectRatio = oldHeight / oldWidth;
    var limitSize = IMAGE_HIGH_SIZE;

    if (oldHeight > limitSize) {
        var newWidth,
            newHeight;
        if (oldWidth > oldHeight) {
            newWidth = limitSize;
            newHeight = newWidth * aspectRatio;
        } else {
            newHeight = limitSize;
            newWidth = newHeight / aspectRatio;
        }
        var resizedImage = oldImage.imageAsResized(newWidth, newHeight);
    } else {
        newHeight = oldHeight;
        newWidth = oldWidth;
        resizedImage = oldImage;
    }

    $.cameraBtn1.image = resizedImage;
    return resizedImage;
}

function addAttachment(name, detail, type) {
    var attachment = {
        name : name,
        detail : "",
        parentId : passenger.paxKey
    };

    attachment1.push(attachment);
}

function cameraFunction(menuIndex) {
    if (menuIndex == 1) {// Take photo
        Ti.Media.showCamera({
            success : function(event) {
                Ti.API.info("Test:1");
                var image = event.media;
                if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
                    var image = event.media;
                    var incidentAttachment = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'ropEnrollAttachment');
                    if (!incidentAttachment.exists()) {
                        incidentAttachment.createDirectory();
                    }

                    var filename = "image" + "_" + passenger.paxKey + "_" + utility.getDateTimeForImageName() + '.jpg';
                    var imageFile = Ti.Filesystem.getFile(incidentAttachment.resolve(), filename);
                    var resizeImg = resizeImage(image);

                        if (attachment1 != null && attachment1.length > 0)
                            if (attachment1[0].name.length > 0) {
                                var attachmentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "ropEnrollAttachment" + Ti.Filesystem.separator + attachment1[0].name);
                                attachmentFile.deleteFile();
                                attachment1.remove(0);
                            }

                    if (imageFile.write(resizeImg) === false) {
                        // handle write error
                    } else {

                    }
                    addAttachment(filename, "", "photo");
                }
            },
            cancel : function() {
                //getting image from camera was cancelled
            },
            error : function(error) {
                var a = Ti.UI.createAlertDialog({
                    title : 'Camera'
                });
                if (error.code == Ti.Media.NO_CAMERA) {
                    a.setMessage('Device does not have image recording capabilities');
                } else {
                    a.setMessage('Unexpected error: ' + error.code);
                }
                a.show();
            },
            allowImageEditing : true,
            saveToPhotoGallery : true
        });
    } else if (menuIndex == 2) {// Select image
        Ti.Media.openPhotoGallery({
            success : function(event) {
                var image = event.media;
                var incidentAttachment = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'ropEnrollAttachment');
                if (!incidentAttachment.exists()) {
                    incidentAttachment.createDirectory();
                }

                var filename = "image" + "_" + passenger.paxKey + "_" + utility.getDateTimeForImageName() + '.jpg';
                var imageFile = Ti.Filesystem.getFile(incidentAttachment.resolve(), filename);
                var resizeImg = resizeImage(image);

                if (attachment1 != null && attachment1.length > 0)
                    if (attachment1[0].name.length > 0) {
                        var attachmentFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "ropEnrollAttachment" + Ti.Filesystem.separator + attachment1[0].name);
                        attachmentFile.deleteFile();
                        attachment1.remove(0);
                    }

                if (imageFile.write(resizeImg) === false) {
                } else {

                }

                addAttachment(filename, "", "photo");
            },
            cancel : function() {
            },
            mediaTypes : Ti.Media.MEDIA_TYPE_PHOTO
        });
    } else if (menuIndex == 3) {// View Image
            if (attachment1 != null && attachment1.length > 0 && attachment1 != undefined) {
                fullpath = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "ropEnrollAttachment" + Ti.Filesystem.separator + attachment1[0].name;
                viewFullScreenImage(fullpath);
            }
    } 
}

function viewFullScreenImage(imgPath) {
    var win1 = component.createFullScreenImageWindow(imgPath);
    img = null;
    imgHeight = null;
    imgWidth = null;

    win1.open();
    win1.addEventListener("click", function(e) {
        win1.close();
    });
}

// Option dialog for data selection
function optionDialogWindow(data, topAlign, sideAlign) {
    var optionDialogWin = Ti.UI.createWindow({
        fullscreen : false,
        backgroundColor : '#40000000',
    });
    
    if(OS_ANDROID)
	{
		optionDialogWin.title = '';
		optionDialogWin.theme = 'Theme.NoActionBar';	
	}
	
    var view = Ti.UI.createView({
        top : topAlign,
        bottom : "1%",
        left : sideAlign,
        right : sideAlign,
        borderRadius : 20,
        backgroundColor : 'white',
        layout : "vertical"
    });

    var tableView = Ti.UI.createTableView({
        height : "100%",
        width : "100%",
        data : data
    });

	if(OS_ANDROID)
    {
    	tableView.separatorColor = "grey";	
    }
    view.add(tableView);

    optionDialogWin.add(view);
    data = null;
    tableData = null;
    view = null;

    return optionDialogWin;
};

function createOptDialogBtn(dataArg, dataNumber, indexArg, rowHeightArg) {
    var rowHeight = 100 / dataNumber;
    var rowHeightStr = rowHeight.toString() + "%";

    if(OS_ANDROID) {
        if(dataNumber == 2) {
            rowHeightStr = 121;         
        } else if (dataNumber == 3) {
            rowHeightStr = 80;                      
        } else {
            rowHeightArg != null ? rowHeightStr = rowHeightArg : 0;
        }
    } 

    var row = Ti.UI.createTableViewRow({
        height : rowHeightStr,
        width : "100%",
        touchEnable : true,
        hasChild : 'false',
    });
    
    var label = Ti.UI.createLabel({
        text : dataArg,
        btnId : indexArg,
        color : "#007AFF",
        font : {
            fontSize : '20',
            fontWeight : 'bold'
        },
        height : "100%",
        width : "100%",
        textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER
    });

    label.addEventListener("click", function(e) {
        switch (menuType) {
            case SALUATION :
                $.saluation.value = e.source.text;
                // switch ($.saluation.value.toLowerCase()) { //"Mr.", "Mrs.", "Miss", "Ms.", "Mstr."
                    // case "mr.":
                        // $.gender1.value = "M"; 
                        // break;
                    // case "mrs.":
                        // $.gender1.value = "F";
                        // break;
                    // case "miss":
                        // $.gender1.value = "F";
                        // break;
                    // case "ms.":
                        // $.gender1.value = "F";
                        // break;
                    // case "mstr.":
                        // $.gender1.value = "M";
                        // break;
                // }
                break;
            case GENDER:
                $.gender1.value = e.source.text;
                break;
            case NATIONALITY:
                $.nationality1.value = e.source.text;
                nationalityId = e.source.btnId;
                break;
            case CAMERA:
                cameraMenuIndex = e.source.btnId;
                break;
            case CREW_LIST:
                $.reportByTextField.value = e.source.text;
                appliedBy = e.source.btnId;
                break;
            }
    });

    row.add(label);

    rowHeightStr = null;
    rowHeight = null;

    return row;
}

// Camera button
$.cameraBtn1.addEventListener('click', function(e) {
    menuType = CAMERA;
    var tableData = [];
    var cameraMenu = ["Take a Photo", "Select Image", "View Image"];

    if ($.cameraBtn1.image) {
    } else {
        cameraMenu.remove(2);
    }

    for (var i = 0; i < cameraMenu.length; i++) {
        tableData.push(createOptDialogBtn(cameraMenu[i], cameraMenu.length, i+1));
    }
    var win2 = optionDialogWindow(tableData, "70%", "20%");
    data = null;
    tableData = null;

    win2.open();
    win2.addEventListener("click", function(e) {
        win2.close();
        cameraFunction(cameraMenuIndex);
        cameraMenuIndex = 0;
    });
    
    if(OS_ANDROID){
		win2.addEventListener('android:back', function(e) {
			win2.close();
        	cameraMenuIndex = 0;
		});
	}
});

// Select Saluation
// $.saluationView.addEventListener("click", function(e) {
    // var tableData = [];
    // menuType = SALUATION;
    // for (var i = 0; i < saluationArray.length; i++) {
        // tableData.push(createOptDialogBtn(saluationArray[i], saluationArray.length, null, 67));
    // }
    // var win2 = optionDialogWindow(tableData, "60%", "20%");
    // tableData = null;
// 
    // win2.open();
    // win2.addEventListener("click", function(e) {
        // win2.close();
    // });
//     
    // if(OS_ANDROID){
		// win2.addEventListener('android:back', function(e) {
			// win2.close();
		// });
	// }
// });

// Select Gender
// $.genderView.addEventListener("click", function(e) {
    // var tableData = [];
    // menuType = GENDER;
    // for (var i = 0; i < genderArray.length; i++) {
        // tableData.push(createOptDialogBtn(genderArray[i], genderArray.length, 100));
    // }
    // var win2 = optionDialogWindow(tableData, "80%", "30%");
    // data = null;
    // tableData = null;
// 
    // win2.open();
    // win2.addEventListener("click", function(e) {
        // win2.close();
    // });
    // if(OS_ANDROID){
		// win2.addEventListener('android:back', function(e) {
			// win2.close();
		// });
	// }  
// });

// Select Nationality
// $.nationality1.addEventListener("click", function(e) {
    // var tableData = [];
    // menuType = NATIONALITY;
    // for (var i = 0; i < nationalityArray.length; i++) {
        // tableData.push(createOptDialogBtn(nationalityArray[i].nationality, 10, nationalityArray[i].id));
    // }
    // var win2 = optionDialogWindow(tableData, "30%", "10%");
    // data = null;
    // tableData = null;
// 
    // win2.open();
    // win2.addEventListener("click", function(e) {
        // win2.close();
    // });
// });

// $.nationalityView.addEventListener("click", function(e) {
   	// var singlePickListView = Alloy.createController("single_picklist", [
        // getNationalityFormPicklist, 
        // nationalityArrayList,
        // "Nationality List"
    // ]).getView();
//     
    // if(OS_IOS){
   		// Alloy.Globals.navGroupWin.openWindow(singlePickListView);
      // }else{
    	// singlePickListView.open();
    // }
// });

// function getNationalityFormPicklist(value) {
    // $.nationality1.value = value;
    // nationalityId = value.substring(0,2).toUpperCase();
// }

// Select Birth of Date
// $.birthDateView.addEventListener("click", function(e) {
    // var winDatePicker = Ti.UI.createWindow({
        // fullscreen : false,
        // backgroundColor : '#40000000',
    // });
//     
    // var today = new Date();
    // var year = today.getFullYear();
    // var minYear = year - 170;
    // var picker = Ti.UI.createPicker({
      // type:Ti.UI.PICKER_TYPE_DATE,
      // minDate:new Date(minYear,0,1),
      // maxDate:new Date(),
      // value:new Date(),
      // bottom:"5%"
    // });
//     
    // picker.addEventListener('change',function(e){
        // var day = new Date(e.value);
        // var dd = day.getDate();
        // var mm = day.getMonth() + 1; // Jan is Zero
        // var yyyy = day.getFullYear()+"";
//         
        // if (dd < 10) {
            // dd = '0' + dd;
        // } else {
            // dd = dd+"";
        // }
        // if (mm < 10) {
            // mm = '0' + mm;
        // }else{
            // mm = mm + "";
        // }
        // $.dateOfBirth1.value = yyyy + "-" + mm + "-" + dd; 
// //       $.dateOfBirth1.value = dd + "/" + mm + "/" + yyyy;
    // });
//     
    // winDatePicker.add(picker);
    // winDatePicker.open();
//     
    // winDatePicker.addEventListener("click", function(e) {
        // winDatePicker.close();
    // });
// 
// });


// Type only number
$.countryCode.addEventListener('change', function(e) {
    if(OS_IOS) {
        $.countryCode.value = utility.checkInputKeyMustBeNumber($.countryCode.value);        
    } else {
        if(!this.value){
            return;
        }
    
        if(changeState == 0){
            changeState = 1;
            $.countryCode.setValue(utility.checkInputKeyMustBeNumber(this.value));
        }else{
            if(changeState == 1){
                changeState = 2;
                var len = $.countryCode.getValue().length;
                $.countryCode.setSelection(len, len);
            }else{
                changeState = 0;
            }
        }    
    }
});

$.areaCode.addEventListener('change', function(e) {
    if(OS_IOS) {
        $.areaCode.value = utility.checkInputKeyMustBeNumber($.areaCode.value);
    } else {
        if(!this.value){
            return;
        }
    
        if(changeState == 0){
            changeState = 1;
            $.areaCode.setValue(utility.checkInputKeyMustBeNumber(this.value));
        }else{
            if(changeState == 1){
                changeState = 2;
                var len = $.areaCode.getValue().length;
                $.areaCode.setSelection(len, len);
            }else{
                changeState = 0;
            }
        }    
        
    }
});

$.phoneNumber.addEventListener('change', function(e) {
    if(OS_IOS) {    
        $.phoneNumber.value = utility.checkInputKeyMustBeNumber($.phoneNumber.value);
    } else {
        if(!this.value){
            return;
        }
    
        if(changeState == 0){
            changeState = 1;
            $.phoneNumber.setValue(utility.checkInputKeyMustBeNumber(this.value));
        }else{
            if(changeState == 1){
                changeState = 2;
                var len = $.phoneNumber.getValue().length;
                $.phoneNumber.setSelection(len, len);
            }else{
                changeState = 0;
            }
        }            
    }
});

$.reportedByView.addEventListener('click', function(e) {
    var tableData = [];
    menuType = CREW_LIST;
    var data = query.getCrewListSortBySeqNo(currentFlightId);
    for (var i = 0; i < data.length; i++) {
        if (data[i].dutyCode.toLowerCase() == "fly" && data[i].rank.toLowerCase() != "fc" && data[i].rank.toLowerCase() != "fp") {
            tableData.push(createOptDialogBtn(data[i].rank + ". " + data[i].crewFirstName + " " + data[i].crewLastName, 8, data[i].sfdcId, 61));            
        }// Filter Acctive rank
    }
    var win2 = optionDialogWindow(tableData, "50%", "10%");
    data = null;
    tableData = null;

    win2.open();
    win2.addEventListener("click", function(e) {
        win2.close();
    });
    
    if(OS_ANDROID){
		win2.addEventListener('android:back', function(e) {
			win2.close();
		});
	}  
});

function showConditionForEnrollPage() {
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
        height : "67%",
        width : "94%",
        bottom : "1%",
        layout : "vertical",
        backgroundColor : "#26000000"
    });

    // var viewRow2 = Ti.UI.createScrollView({
        // showVerticalScrollIndicator : true,        
        // height : "50%",
        // width : "94%",
        // layout : "vertical",
        // backgroundColor : "#26000000"
//            
    // });

    // var viewRow3 = Ti.UI.createScrollView({
        // height : "13%",
        // width : "94%",
        // bottom : "1%",
        // layout : "vertical",
        // borderRadius : "10",
        // borderWidth : "1",
        // borderColor : "#7B549C"
//            
    // });

    var viewRow3 = Ti.UI.createView({
        height : "13%",
        width : "94%",
        bottom : "1%",
        layout : "vertical",
        borderRadius : "10",
        borderWidth : "1",
        borderColor : "#7B549C"
    });

    var viewRow4 = Ti.UI.createView({
        height : "7%",
        width : "94%",
        layout : "vertical",
    });

    label1 = Ti.UI.createLabel({
        text : "Condition for Enrollment",
        color : "white",
        font : {
            fontSize : '22sp',
            fontFamily : 'arial',
            fontWeight : 'bold'
        }
    });

    var acceptBtn = Ti.UI.createImageView({
        image : isAccepted ? "/images/btn_accepted.png" : "/images/btn_accept40x150.png",
        height : 40,
        width : 150,
        top : 3
    });
    
    acceptBtn.addEventListener("click", function(e){
       //isAccepted = !isAccepted;
       if(isAccepted) {
             var _promptView = new Alloy.createController("common/alertPrompt", {
                title : "Alert",
                message : "Already accepted.",
                okText : "OK",
                disableCancel : true,
                onOk : function() {
                        win2.close();
                }
            }).getView();
            _promptView.open();          
       } else {
            var _syncDataPromptView = new Alloy.createController("common/alertPrompt", {
                title : 'Confirm',
                message : 'Do you accept the condition?',
                okText : "Yes",
                cancelText : "No",
                onOk : function() {
                    isAccepted = true;
                    if(isAccepted) {
                        e.source.image = "/images/btn_accepted.png";
                    } else {
                        e.source.image = "/images/btn_accept40x150.png";            
                    }        
                    setTimeout(function() {
                        win2.close();
                    }, 500);    
                }
            }).getView();
            _syncDataPromptView.open();           
       }
    });

    // var textArea = Ti.UI.createLabel({
          // text: conditionForEnroll != null ? conditionForEnroll.detail : "",
          // backgroundColor : "transparent",
          // color: 'white',
          // font: {fontSize:20, fontWeight:'bold', fontFamily : 'arial',},
          // textAlign: 'left',
          // top: "1%",
          // bottom: "1%",
// //          height: ,
          // width: "100%",
    // });    

    var textArea = Ti.UI.createTextArea({
          value: conditionForEnroll != null ? conditionForEnroll.detail : "",
          backgroundColor : "transparent",
          color: 'white',
          font: {fontSize:20, fontWeight:'bold', fontFamily : 'arial',},
          textAlign: 'left',
          top: "1%",
          bottom: "1%",
          height: "100%",
          width: "100%",
          editable : false
    });
    
    
    // var textAreaAccepted = Ti.UI.createLabel({
          // text: conditionForEnroll != null ? conditionForEnroll.acceptText : "",
          // backgroundColor : "transparent",
          // color : colorTextValue,
          // font: {fontSize:20, fontWeight:'bold', fontFamily : 'arial',},
          // textAlign: 'left',
          // top: 5,
          // bottom: 5,
          // width: "96%",
          // height: "100%",
    // });    

    var textAreaAccepted = Ti.UI.createTextArea({
          value: conditionForEnroll != null ? conditionForEnroll.acceptText : "",
          backgroundColor : "transparent",
          color : colorTextValue,
          font: {fontSize:20, fontWeight:'bold', fontFamily : 'arial',},
          textAlign: 'left',
          top: "1%",
          bottom: "1%",
          width: "96%",
          editable : false,
    });
    
    viewRowClose.add(labelClose);
    viewRow1.add(label1);
    viewRow2.add(textArea);
    viewRow3.add(textAreaAccepted);
    viewRow4.add(acceptBtn);
    
    view.add(viewRowClose);
    view.add(viewRow1);
    view.add(viewRow2);
    view.add(viewRow3);
    view.add(viewRow4);

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
}

//* Save button
$.saveEnrollBtn.addEventListener('click', function(e) {
    saveRopEnrollment();
});

// Save ROP Enrollment
function saveRopEnrollment() {
    var isSave = true;
    var mandatoryFieldNoStr = "";
    
    // if($.saluation.value.length < 1) {
        // isSave = false;
        // mandatoryFieldNoStr = "\nSaluation";
    // }
    if($.firstName.value.length < 1) {
        isSave = false;        
        mandatoryFieldNoStr += "\nFirst Name";
    }
    if($.lastName.value.length < 1) {
        isSave = false;        
        mandatoryFieldNoStr += "\nLast Name";
    }
    if($.dateOfBirth1.value.length < 1) {
        isSave = false;
        mandatoryFieldNoStr += "\nDate Of Birth";        
    }
    if($.gender1.value.length < 1) {
        isSave = false;
        mandatoryFieldNoStr += "\nGender";                
    }
    if($.nationality1.value.length < 1) {
        isSave = false;
        mandatoryFieldNoStr += "\nNationality";                
    }
    if($.email.value.length < 1) {
        isSave = false;        
        mandatoryFieldNoStr += "\nEmail";        
    }
    if($.countryCode.value.length < 1) {
        isSave = false;
        mandatoryFieldNoStr += "\nCountry Code";                
    }
    if($.areaCode.value.length < 1) {
        isSave = false;
        mandatoryFieldNoStr += "\nArea Code";                
    }
    if($.phoneNumber.value.length < 1) {
        isSave = false;
        mandatoryFieldNoStr += "\nPhone Number";                
    }
    if($.reportByTextField.value.length < 1) {
        isSave = false;
        mandatoryFieldNoStr += "\nApplied By";                
    }
    
    if(!isSave) {
        var _promptView = new Alloy.createController("common/alertPrompt", {
            title : "No data on mandatory field",
            message : mandatoryFieldNoStr,
            okText : "OK",
            disableCancel : true,
            onOk : function() {
            }
        }).getView();
        _promptView.open();
        
    } else {
        isSave = utility.validateEmail($.email.value);        
        if(!$.cameraBtn1.image && isSave) {
            isSave = false;
            var _promptView = new Alloy.createController("common/alertPrompt", {
                title : "Alert",
                message : "Please take a photo of the boading pass.",
                okText : "OK",
                disableCancel : true,
                onOk : function() {
                }
            }).getView();
            _promptView.open();         
        }
        // if($.gender1.value.toLowerCase() == "m") {
           // if($.saluation.value.toLowerCase() == "mr." || $.saluation.value.toLowerCase() == "mstr.") {
//                
           // } else {
             // isSave = false;  
             // var _promptView = new Alloy.createController("common/alertPrompt", {
                    // title : "Alert",
                    // message : "The saluation mismatch with the gender! Please re-enter them.",
                    // okText : "OK",
                    // disableCancel : true,
                    // onOk : function() {
                    // }
             // }).getView();
             // _promptView.open();         
           // }
        // } else if ($.gender1.value.toLowerCase() == "f") {
           // if($.saluation.value.toLowerCase() == "mrs." || $.saluation.value.toLowerCase() == "miss" || $.saluation.value.toLowerCase() == "ms.") {
//                
           // } else {
             // isSave = false;  
             // var _promptView = new Alloy.createController("common/alertPrompt", {
                    // title : "Alert",
                    // message : "The saluation mismatch with the gender! Please re-enter them.",
                    // okText : "OK",
                    // disableCancel : true,
                    // onOk : function() {
                    // }
             // }).getView();
             // _promptView.open();         
           // }            
        // } else {
            // isSave = false;
        // }
    } 
    
    if(!isAccepted) {
        isSave = false;
         var _promptView = new Alloy.createController("common/alertPrompt", {
            title : "Alert",
            message : "Please confirm the customer to accept the condition & term for enrollment.",
            okText : "OK",
            disableCancel : true,
            onOk : function() {
            }
        }).getView();
        _promptView.open();       
    }
        
    if(isSave) {
        var _syncDataPromptView = new Alloy.createController("common/alertPrompt", {
            title : 'Confirm',
            message : 'Do you want to save this Enrollment?',
            okText : "Yes",
            cancelText : "No",
            onOk : function() {
                var ropEnrollment = {
                    saluation : $.saluation.value,
                    firstName : $.firstName.value,
                    lastName : $.lastName.value,
                    dateOfBirth : $.dateOfBirth1.value,
                    gender : $.gender1.value,
                    nationality : nationalityId, //$.nationality1.value,
                    phoneType : "C",
                    countryCode : $.countryCode.value,
                    areaCode : $.areaCode.value,
                    phoneNumber : $.phoneNumber.value,
                    email : $.email.value,
                    enrollDate : utility.getDateYYYYmmDD(),
                    status : ENROLL,
                    isSynced : false,
                    isCompleted : false,
                    paxKey : passenger.paxKey,
                    accountId : passenger.accountId,
                    passengerId : passenger.id,
                    flightId : flightId,
                    flightNumber : flightNumber,
                    ropNumber : ropNumber,
                    createdBy : createdBy,
                    appliedBy : appliedBy,
                    isAccepted : isAccepted
                };
                query.insertROPEnrollment(ropEnrollment);
                
                query.deleteRopEnrollAttachmentByPaxKey(passenger.paxKey);
                if (attachment1 != null && attachment1.length > 0) {
                    attachment1[0].detail = $.attachmentTextField1.value.length > 0 ? $.attachmentTextField1.value : "";
                    query.insertRopEnrollAttachment(attachment1[0]);
                }
                
                if(isFromPassengerDetail){
                	isFromPassengerDetail = false;        
                	passengerDetailIsRefresh = 1;
                	passengerListIsRefresh = 1;
                }
                
                if(isFromIncidentDetail){
                	isFromIncidentDetail = false;
                	ropEnrollmentRefresh = 1;
                }
                
                
                $.ropEnrollmentFormWindow.close();
            }
        }).getView();
        _syncDataPromptView.open();
    }    
}


//* Cancel button
$.cancelEnrollBtn.addEventListener('click', function(e) {
    var _syncDataPromptView = new Alloy.createController("common/alertPrompt", {
        title : 'Confirm',
        message : 'Do you want to discard this Enrollment?',
        okText : "Yes",
        cancelText : "No",
        onOk : function() {
        	isFromIncidentDetail = false;
        	isFromPassengerDetail = false;
            $.ropEnrollmentFormWindow.close();
        }
    }).getView();
    _syncDataPromptView.open();
});

// Condition for Enrollment
$.conditionHeaderLabelView.addEventListener('click', function(e) { 
    showConditionForEnrollPage();
});

$.enrollConditionLabel.addEventListener('click', function(e) { 
    showConditionForEnrollPage();
});


//**********************************************
//* Main
//**********************************************

if(OS_ANDROID)
{
    var softInput = Titanium.UI.Android.SOFT_INPUT_STATE_ALWAYS_HIDDEN | Ti.UI.Android.SOFT_INPUT_ADJUST_PAN;
    $.ropEnrollmentFormWindow.windowSoftInputMode = softInput;

//    $.scrollView.height = SCROLL_VIEW_HEIGHT;
//    $.selectBodyView.heigth = $.scrollView.height;
    $.paxHeaderView.height = ANDROID_SCEEN_HEIGHT - SCROLL_VIEW_HEIGHT;

    $.imageUser.width = utility.dpiConverter(110);
    $.imageUser.height = utility.dpiConverter(110);
        
    $.name.font.fontSize = utility.dpiConverter(10);
    $.seatNoClass.font.fontSize = utility.dpiConverter(10);
    $.floorZone.font.fontSize = utility.dpiConverter(10);
    
    $.name.height = 25;
    $.seatNoClass.height = 25;
    $.floorZone.height = 25;
    $.profileSubViewId.top = "2%";
    $.profileSubViewId.bottom = "2%";
    $.profileViewId.height = "70%";
    
    $.saluationView.height = Math.floor(0.07 * SCROLL_VIEW_HEIGHT);
    $.saluation.top= "5%";
    $.saluation.bottom="5%";
    $.saluation.width ="70%";
    
    $.firstNameView.height = Math.floor(0.07 * SCROLL_VIEW_HEIGHT);
    $.firstName.top= "5%";
    $.firstName.bottom="5%";
    $.firstName.width = "70%";
    
    $.lastNameView.height = Math.floor(0.07 * SCROLL_VIEW_HEIGHT);
    $.lastName.top= "5%";
    $.lastName.bottom="5%";
    $.lastName.width = "70%";
    
    $.birthDateView.height = Math.floor(0.07 * SCROLL_VIEW_HEIGHT);
    $.dateOfBirth1.top= "5%";
    $.dateOfBirth1.bottom="5%";
    $.dateOfBirth1.width = "70%";
    
    $.genderView.height = Math.floor(0.07 * SCROLL_VIEW_HEIGHT);
    $.gender1.top= "5%";
    $.gender1.bottom="5%";
    $.gender1.width="70%";
    
    
    $.nationalityView.height = Math.floor(0.07 * SCROLL_VIEW_HEIGHT);
    $.nationality1.top= "5%";
    $.nationality1.bottom="5%";
    $.nationality1.width="70%";
    
    $.emailView.height = Math.floor(0.07 * SCROLL_VIEW_HEIGHT);
    $.email.top= "5%";
    $.email.bottom="5%";
    $.email.width="70%";
    

    $.phoneNumberHeaderView.height = Math.floor(0.05 * SCROLL_VIEW_HEIGHT);

    $.countryCodeView.height = Math.floor(0.07 * SCROLL_VIEW_HEIGHT);
    
    $.attachmentView1.height = Math.floor(0.1 * SCROLL_VIEW_HEIGHT);

    $.reportedByView.height = Math.floor(0.07 * SCROLL_VIEW_HEIGHT);
    $.reportByTextField.top= "5%";
    $.reportByTextField.bottom="5%";
    $.reportByTextField.width="70%";
    
    $.enrollConditionView.height = Math.floor(0.22 * SCROLL_VIEW_HEIGHT);
    $.conditionHeaderLabelView.height = Math.floor(0.3*$.enrollConditionView.height);
    $.enrollConditionLabelView.height = Math.floor(0.7*$.enrollConditionView.height);

    $.attachmentTextField1.width = "52%";
    $.phoneNumber.width = "37%";
        
    $.saluation.touchEnabled = false;
    $.firstName.touchEnabled = false;
    $.lastName.touchEnabled = false;
    $.dateOfBirth1.touchEnabled = false;
    $.gender1.touchEnabled = false;
    $.nationality1.touchEnabled = false;    
    $.saluationView.touchEnabled = false;
    $.nationalityView.touchEnabled = false;
    $.birthDateView.touchEnabled = false;
    
    $.ropEnrollmentFormWindow.activity.onCreateOptionsMenu = function(e) { 
        var menu = e.menu; 
        var menuItem = menu.add({ 
        title: "Save",  
        showAsAction: Ti.Android.SHOW_AS_ACTION_IF_ROOM 
    }); 
        menuItem.addEventListener("click", function(e) { 
            saveRopEnrollment();
        }); 
    };  

    $.ropEnrollmentFormWindow.addEventListener('android:back', function(e) {
        Ti.API.info("Press Back button");
        var _syncDataPromptView = new Alloy.createController("common/alertPrompt", {
        title : 'Confirm',
        message : 'Do you want to discard this Enrollment?',
        okText : "Yes",
        cancelText : "No",
        onOk : function() {
        	 
        	 isFromIncidentDetail = false;
        	 isFromPassengerDetail = false;
        	 
             $.paxHeaderView.removeAllChildren();
             $.paxHeaderView = null;
             $.scrollView.removeAllChildren();
             $.scrollView = null;
             $.ropEnrollmentFormWindow.removeAllChildren();
             $.ropEnrollmentFormWindow.close();
            }
        }).getView();
        _syncDataPromptView.title = '';
        _syncDataPromptView.theme = 'Theme.NoActionBar';
        _syncDataPromptView.open();
    });    
}

initializationRopEnrollDetail();
