//**********************************************
//* Require
//**********************************************
var query = require('query_lib');
var utility = require('utility_lib');
var component = require('component_lib');
//
//**********************************************
//* Variable Declaration
//**********************************************
var args = arguments[0] || {};
var crewId = args.crewId;

var isNew = true;
var isFirstTime = true;

var evaluator;
var evaluated;

var crewAppraisalList = [];
var appraisalForm = [];
var appraisalSubjects = [];
var appraisalDescItems = [];
var formDetail = null;

var ratingSelected = "0";
var defaultCheckbox = "NO";

var formNumber = "";
var formDesc = "";
var remarkTextBox = null;
var otherTextBox1 = null;
var otherTextBox2 = null;

var subjectType;

var yeNoMenuList = ["YES", "NO"];
var yeNoNAMenuList = ["YES", "NO", "NA"];
var genderMenuList = ["Male", "Female"];

var menuType = 0;
const YESNOBOX = 1;
const YESNONABOX = 2;
const GENDERBOX = 3;

var pastSubjectIndex = 0;

var changeState = 0;

var isPostedLayout = false;

var isEdited = false;
//
//**********************************************
//* Function
//**********************************************
function initializeSubjectList() {
    evaluator = query.getUserDetail();
    evaluated = query.getCrewDetail(crewId);

    if (evaluator != null && evaluated != null) {
        formDetail = query.getCrewAppraisalFormAndAnswer(evaluator, evaluated);
        if (formDetail.formNumber != null && formDetail.formNumber.length > 0) {
            appraisalForm = formDetail.subjectList;
            formNumber = formDetail.formNumber;
            formDesc = formDetail.formDesc;
            $.formNameLabel.text = formNumber + " " + formDesc;
        } else {
            $.formNameLabel.text = "No appraised form.";
        }

        if (formDetail.appraisalId != null) {
            isNew = false;
        }

        $.asseseeNameLabel.text = (evaluated.rank != null ? evaluated.rank : "") + " " + (evaluated.crewFirstName != null ? evaluated.crewFirstName : "") + " " + (evaluated.crewLastName != null ? evaluated.crewLastName.substring(0, 1) + ". " : "") + (evaluated.crewExtId != null ? "(" + evaluated.crewExtId + ")" : "");
    }

    subjectType = query.getSubjectTypeFromFormNumber(formNumber);

    if (appraisalForm != null && appraisalForm.length > 0) {
        var tableData = [];
        var tableData1 = [];
        var tableData2 = [];

        for (var i = 0; i < appraisalForm.length; i++) {
            var subjectView = Ti.UI.createView({
                height : Ti.UI.SIZE,
                width : "100%",
                backgroundColor : 'transparent',
                layout : 'vertical'
            });

            var subjectHeaderView = Ti.UI.createView({
                backgroundColor : 'transparent',
                backgroundImage : bgHeaderSection,
                layout : "horizontal",
                height : 70,
                width : "100%",
                index : i,
                touchEnabled : true
            });

            var subjectNumberLabel = Ti.UI.createLabel({
                text : appraisalForm[i].subjectNumber + ".",
                left : "2%",
                width : "30",
                height : "100%",

                font : {
                    fontWeight : "bold",
                    fontSize : 18
                },
                color : colorTextTitle
            });

            var subjectDescLabel = Ti.UI.createLabel({
                text : appraisalForm[i].subjectDesc,
                left : "1%",
                width : subjectType == "Rating" ? "55%" : "90%",
                height : "100%",

                font : {
                    fontWeight : "bold",
                    fontSize : 18
                },
                color : colorTextTitle
            });

            if (OS_ANDROID) {
                subjectDescLabel.width = subjectType == "Rating" ? "45%" : "85%";
            }

            subjectHeaderView.add(subjectNumberLabel);
            subjectHeaderView.add(subjectDescLabel);

            if (subjectType == "Rating") {// Rating question
                var score1Btn = Ti.UI.createImageView({
                    image : "/images/ic_star_white.png",
                    left : "3%",
                    height : 30,
                    width : 30,
                    subjectIndex : i,
                    score : 1,
                    subjectNumber : appraisalForm[i].subjectNumber,
                    formNumber : formNumber
                });

                score1Btn.addEventListener("click", function(e) {
                    ratingProgress(e, true);
                });

                var score2Btn = Ti.UI.createImageView({
                    image : "/images/ic_star_white.png",
                    left : "2%",
                    height : 30,
                    width : 30,
                    subjectIndex : i,
                    score : 2,
                    subjectNumber : appraisalForm[i].subjectNumber,
                    formNumber : formNumber
                });

                score2Btn.addEventListener("click", function(e) {
                    ratingProgress(e, true);
                });

                var score3Btn = Ti.UI.createImageView({
                    image : "/images/ic_star_white.png",
                    left : "2%",
                    height : 30,
                    width : 30,
                    subjectIndex : i,
                    score : 3,
                    subjectNumber : appraisalForm[i].subjectNumber,
                    formNumber : formNumber
                });

                score3Btn.addEventListener("click", function(e) {
                    ratingProgress(e, true);
                });

                var score4Btn = Ti.UI.createImageView({
                    image : "/images/ic_star_white.png",
                    left : "2%",
                    height : 30,
                    width : 30,
                    subjectIndex : i,
                    score : 4,
                    subjectNumber : appraisalForm[i].subjectNumber,
                    formNumber : formNumber
                });

                score4Btn.addEventListener("click", function(e) {
                    ratingProgress(e, true);
                });

                var score5Btn = Ti.UI.createImageView({
                    image : "/images/ic_star_white.png",
                    left : "2%",
                    height : 30,
                    width : 30,
                    subjectIndex : i,
                    score : 5,
                    subjectNumber : appraisalForm[i].subjectNumber,
                    formNumber : formNumber
                });

                score5Btn.addEventListener("click", function(e) {
                    ratingProgress(e, true);
                });

                var score6Btn = Ti.UI.createImageView({
                    image : "/images/ic_star_white.png",
                    left : "2%",
                    height : 30,
                    width : 30,
                    subjectIndex : i,
                    score : 6,
                    subjectNumber : appraisalForm[i].subjectNumber,
                    formNumber : formNumber
                });

                score6Btn.addEventListener("click", function(e) {
                    ratingProgress(e, true);
                });

                var scoreImages = showSubjectScore(appraisalForm[i].subjectScore);
                score1Btn.image = scoreImages.score1Image;
                score2Btn.image = scoreImages.score2Image;
                score3Btn.image = scoreImages.score3Image;
                score4Btn.image = scoreImages.score4Image;
                score5Btn.image = scoreImages.score5Image;
                score6Btn.image = scoreImages.score6Image;

                subjectHeaderView.add(score1Btn);
                subjectHeaderView.add(score2Btn);
                subjectHeaderView.add(score3Btn);
                subjectHeaderView.add(score4Btn);
                subjectHeaderView.add(score5Btn);
                subjectHeaderView.add(score6Btn);
                subjectView.add(subjectHeaderView);

            } else {// Yes, No, NA Question
                subjectView.add(subjectHeaderView);
                for (var j = 0; j < appraisalForm[i].itemsDesc.length; j++) {
                    var view1 = Ti.UI.createView({
                        backgroundColor : 'transparent',
                        layout : "horizontal",
                        height : 70,
                        width : "100%",
                        touchEnabled : true
                    });

                    if (appraisalForm[i].itemsDesc[j].itemType == "YesNo") {
                        var yesNoTextBox = Ti.UI.createLabel({
                            text : appraisalForm[i].itemsDesc[j].valueSelected,
                            subjectIndex : i,
                            itemDescIndex : j,
                            left : "3%",
                            width : "60",
                            borderRadius : "5",
                            borderWidth : "1",
                            borderColor : "#7B549C",
                            color : "#FFCB05",
                            top : "15%",
                            bottom : "15%",
                            backgroundColor : "#26000000",
                            textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER,
                            font : {
                                fontWeight : "bold",
                                fontSize : 18
                            }
                        });

                        yesNoTextBox.addEventListener("click", function(e) {
                            var tableData = [];
                            menuType = YESNOBOX;
                            for (var k = 0; k < yeNoMenuList.length; k++) {
                                tableData.push(createOptDialogBtn(yeNoMenuList[k], yeNoMenuList.length, e.source.subjectIndex, e.source.itemDescIndex));
                            }
                            var win2 = optionDialogWindow(tableData, "70%", "20%");
                            tableData = null;

                            win2.open();
                            win2.addEventListener("click", function(e) {
                                win2.close();
                            });
                        });

                        view1.add(yesNoTextBox);

                    } else if (appraisalForm[i].itemsDesc[j].itemType == "YesNoNA") {
                        var yesNoNATextBox = Ti.UI.createLabel({
                            text : appraisalForm[i].itemsDesc[j].valueSelected,
                            subjectIndex : i,
                            itemDescIndex : j,
                            left : "3%",
                            width : "60",
                            borderRadius : "5",
                            borderWidth : "1",
                            borderColor : "#7B549C",
                            color : "#FFCB05",
                            top : "15%",
                            bottom : "15%",
                            backgroundColor : "#26000000",
                            textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER,
                            font : {
                                fontWeight : "bold",
                                fontSize : 18
                            },
                        });
                        yesNoNATextBox.addEventListener("click", function(e) {
                            var tableData = [];
                            menuType = YESNONABOX;
                            for (var k = 0; k < yeNoNAMenuList.length; k++) {
                                tableData.push(createOptDialogBtn(yeNoNAMenuList[k], yeNoNAMenuList.length, e.source.subjectIndex, e.source.itemDescIndex));
                            }
                            var win2 = optionDialogWindow(tableData, "70%", "20%");
                            tableData = null;

                            win2.open();
                            win2.addEventListener("click", function(e) {
                                win2.close();
                            });
                        });

                        view1.add(yesNoNATextBox);
                    }

                    var itemDescLabel = Ti.UI.createLabel({
                        text : appraisalForm[i].itemsDesc[j].itemDesc,
                        left : "2%",
                        width : "80%",
                        height : "100%",

                        font : {
                            fontWeight : "bold",
                            fontSize : 18
                        },
                        color : colorTextTitle
                    });

                    view1.add(itemDescLabel);
                    subjectView.add(view1);
                }

            }

            $.scrollView.add(subjectView);
        }

        var remarkLabel = Ti.UI.createLabel({
            text : "Remark : ",
            left : "3%",
            width : "80",
            height : "30",
            top : "5%",

            font : {
                fontWeight : "bold",
                fontSize : 18
            },
            color : colorTextTitle
        });

        remarkTextBox = Ti.UI.createTextArea({
            value : formDetail.comment,
            left : "3%",
            right : "3%",
            borderRadius : "5",
            borderWidth : "1",
            borderColor : "#7B549C",
            color : "#FFCB05",
            top : "1%",
            bottom : "15%",
            backgroundColor : "#26000000",
            textAlign : Titanium.UI.TEXT_ALIGNMENT_LEFT,
            verticalAlign : Titanium.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
            font : {
                fontWeight : "bold",
                fontSize : 18
            }
        });

        if (OS_ANDROID) {
            remarkTextBox.width = "94%";
        }

        var remarkView = Ti.UI.createView({
            backgroundColor : 'transparent',
            layout : "vertical",
            height : "210",
            width : "100%",
            touchEnabled : true
        });

        remarkView.add(remarkLabel);
        remarkView.add(remarkTextBox);
        $.scrollView.add(remarkView);
        $.scrollView.show();
    }
}

// Rating button function
function ratingProgress(e, isExpend) {
    if (((appraisalForm[pastSubjectIndex].isSelected && appraisalForm[pastSubjectIndex].isItemsDescSelected) || !utility.isEmpty(appraisalForm[pastSubjectIndex].comment)) || pastSubjectIndex == e.source.subjectIndex || !isNew) {
        isNew = true;
        isEdited = true;
        var scoreImages = showSubjectScore(e.source.score);

        e.source.parent.children[2].image = scoreImages.score1Image;
        e.source.parent.children[3].image = scoreImages.score2Image;
        e.source.parent.children[4].image = scoreImages.score3Image;
        e.source.parent.children[5].image = scoreImages.score4Image;
        e.source.parent.children[6].image = scoreImages.score5Image;
        e.source.parent.children[7].image = scoreImages.score6Image;

        if (isExpend) {
            var len = e.source.parent.parent.children.length;
            for (var i = 1; i < len; i++) {
                e.source.parent.parent.remove(e.source.parent.parent.children[1]);
            }
            showItemsDescPerSubject(e);
        }

        if (pastSubjectIndex != e.source.subjectIndex) {
            var len = $.scrollView.children[pastSubjectIndex].children.length;
            for (var i = 1; i < len; i++) {
                $.scrollView.children[pastSubjectIndex].remove($.scrollView.children[pastSubjectIndex].children[1]);
            }
            $.scrollView.children[pastSubjectIndex].height = 70;
        }

        appraisalForm[e.source.subjectIndex].subjectScore = ratingSelected;
        appraisalForm[e.source.subjectIndex].isSelected = true;

        if (appraisalForm[e.source.subjectIndex].subjectScore > "3") {
            appraisalForm[e.source.subjectIndex].isItemsDescSelected = true;
        } else {
            for (var x = 0; x < appraisalForm[e.source.subjectIndex].itemsDesc.length; x++) {
                appraisalForm[e.source.subjectIndex].isItemsDescSelected = false | appraisalForm[e.source.subjectIndex].itemsDesc[x].isSelected;
                if (appraisalForm[e.source.subjectIndex].isItemsDescSelected) {
                    break;
                }
            }
        }

        pastSubjectIndex = e.source.subjectIndex;

    } else {
        if (!appraisalForm[pastSubjectIndex].isSelected) {
            var messageAlert = "Please evaluate the previous subject.";
        } else if (!appraisalForm[pastSubjectIndex].isItemsDescSelected) {
            var messageAlert = "Please select the previous subject's reasons why the rating is less than 4.";
        }
        var _promptView = new Alloy.createController("common/alertPrompt", {
            title : "Alert",
            message : messageAlert,
            okText : "OK",
            disableCancel : true,
            onOk : function() {
            }
        }).getView();
        _promptView.open();
    }

}

function checkBoxFunction(e) {
    if (((appraisalForm[pastSubjectIndex].isSelected && appraisalForm[pastSubjectIndex].isItemsDescSelected) || !utility.isEmpty(appraisalForm[pastSubjectIndex].comment)) || (pastSubjectIndex == e.source.subjectIndex)) {
        e.source.isSelected = !e.source.isSelected;

        if (e.source.isSelected) {
            e.source.image = '/images/btn_button_on.png';
            appraisalForm[e.source.subjectIndex].itemsDesc[e.source.itemIndex].isSelected = true;
            appraisalForm[e.source.subjectIndex].itemsDesc[e.source.itemIndex].valueSelected = appraisalForm[e.source.subjectIndex].itemsDesc[e.source.itemIndex].itemDesc;
        } else {
            e.source.image = '/images/btn_button_off.png';
            appraisalForm[e.source.subjectIndex].itemsDesc[e.source.itemIndex].isSelected = false;
            appraisalForm[e.source.subjectIndex].itemsDesc[e.source.itemIndex].valueSelected = "";
        }
        for (var x = 0; x < appraisalForm[e.source.subjectIndex].itemsDesc.length; x++) {
            appraisalForm[e.source.subjectIndex].isItemsDescSelected = false | appraisalForm[e.source.subjectIndex].itemsDesc[x].isSelected;
            if (appraisalForm[e.source.subjectIndex].isItemsDescSelected) {
                break;
            }
        }
        if (appraisalForm[e.source.subjectIndex].subjectScore < "4") {
            appraisalForm[e.source.subjectIndex].isSelected = appraisalForm[e.source.subjectIndex].isItemsDescSelected;
        } else {
            appraisalForm[e.source.subjectIndex].isSelected = true;
            appraisalForm[e.source.subjectIndex].isItemsDescSelected = true;
        }

        pastSubjectIndex = e.source.subjectIndex;

    } else {
        if (!appraisalForm[pastSubjectIndex].isSelected) {
            var messageAlert = "Please evaluate the previous subject.";
        } else if (!appraisalForm[pastSubjectIndex].isItemsDescSelected) {
            var messageAlert = "Please select the previous subject's reasons why the rating is less than 4.";
        }
        var _promptView = new Alloy.createController("common/alertPrompt", {
            title : "Alert",
            message : messageAlert,
            okText : "OK",
            disableCancel : true,
            onOk : function() {
            }
        }).getView();
        _promptView.open();
    }
}

// Option dialog for data selection
function optionDialogWindow(data, topAlign, sideAlign) {
    var optionDialogWin = Ti.UI.createWindow({
        fullscreen : false,
        backgroundColor : '#40000000',
    });
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

    view.add(tableView);

    optionDialogWin.add(view);
    data = null;
    tableData = null;
    view = null;

    return optionDialogWin;
};

function createOptDialogBtn(dataArg, dataNumber, subjectIndex, itemDescIndex) {
    var rowHeight = 100 / dataNumber;
    var rowHeightStr = rowHeight.toString() + "%";

    if (OS_ANDROID) {
        if (dataNumber == 2) {
            rowHeightStr = 120;
        } else {
            rowHeightStr = 85;
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
        data : dataArg,
        subjectIndex : subjectIndex,
        itemDescIndex : itemDescIndex,
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
        isEdited = true;
        appraisalForm[e.source.subjectIndex].itemsDesc[e.source.itemDescIndex].valueSelected = this.text;
        $.scrollView.children[e.source.subjectIndex].children[e.source.itemDescIndex+1].children[0].text = appraisalForm[e.source.subjectIndex].itemsDesc[e.source.itemDescIndex].valueSelected;
    });

    row.add(label);

    rowHeightStr = null;
    rowHeight = null;

    return row;
}

function createOptDialogBtnForGenderSelection(dataArg, dataNumber) {
    var rowHeight = 100 / dataNumber;
    var rowHeightStr = rowHeight.toString() + "%";

    var row = Ti.UI.createTableViewRow({
        height : rowHeightStr,
        width : "100%",
        touchEnable : true,
        hasChild : 'false',
    });

    var label = Ti.UI.createLabel({
        text : dataArg,
        data : dataArg,
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
        isEdited = true;
        if (e.source.data == "Male") {
            $.scrollView.children[0].data[0].rows[1].children[0].children[0].text = "   Crew Male";
            $.scrollView.children[0].data[0].rows[1].children[0].children[0].color = colorTextValue;
            appraisalForm[0].itemsDesc = query.getCrewAppraisalItemsDescByGender(formNumber, "01", "M");
            if (appraisalForm[0].itemsDesc != null) {
                showItemsDesOfMaleOrFemaleForSubject01();
            }

        } else if (e.source.data == "Female") {
            $.scrollView.children[0].data[0].rows[1].children[0].children[0].text = "   Crew Female";
            $.scrollView.children[0].data[0].rows[1].children[0].children[0].color = colorTextValue;
            appraisalForm[0].itemsDesc = query.getCrewAppraisalItemsDescByGender(formNumber, "01", "F");
            if (appraisalForm[0].itemsDesc != null) {
                showItemsDesOfMaleOrFemaleForSubject01();
            }
        }

    });

    row.add(label);

    rowHeightStr = null;
    rowHeight = null;

    return row;
}

function showItemsDesOfMaleOrFemaleForSubject01() {
    var tableData = [];

    for (var j = 0; j < 2; j++) {
        tableData.push($.scrollView.children[0].data[0].rows[j]);
    }

    for (var i = 0; i < appraisalForm[0].itemsDesc.length; i++) {
        var itemDescLabel = Ti.UI.createLabel({
            text : appraisalForm[0].itemsDesc[i].itemDesc,
            left : "2%",
            width : "80%",
            height : "100%",

            font : {
                fontWeight : "bold",
                fontSize : 18
            },
            color : colorTextTitle
        });

        var view1 = Ti.UI.createView({
            backgroundColor : 'transparent',
            layout : "horizontal",
            height : "100%",
            width : "100%",
            touchEnabled : true
        });

        var checkboxBtn = Ti.UI.createImageView({
            image : '/images/btn_button_off.png',
            left : "3%",
            height : 45,
            width : 45,
            isSelected : false,
            subjectIndex : 0,
            subjectNumber : appraisalForm[0].itemsDesc[0].subjectNumber,
            formNumber : appraisalForm[0].itemsDesc[0].formNumber,
            itemIndex : i
        });

        checkboxBtn.addEventListener("click", function(e) {
            isEdited = true;
            checkBoxFunction(e);
        });

        var itemDescTableRow = Ti.UI.createTableViewRow({
            idType : "btnRow",
            index : i,
            selectedColor : 'transparent',
            backgroundColor : 'transparent',
            hasChild : false,
            width : "100%",
            height : 70,
        });

        view1.add(checkboxBtn);
        view1.add(itemDescLabel);

        itemDescTableRow.add(view1);
        tableData.push(itemDescTableRow);
    }
    var otherLabel = Ti.UI.createLabel({
        text : "Other : ",
        left : "4%",
        width : "70",
        height : "100%",

        font : {
            fontWeight : "bold",
            fontSize : 18
        },
        color : colorTextTitle
    });

    otherTextBox1 = Ti.UI.createTextField({
        text : "",
        subjectIndex : 0,
        left : "1%",
        width : "70%",
        borderRadius : "5",
        borderWidth : "1",
        borderColor : "#7B549C",
        color : "#FFCB05",
        top : "15%",
        bottom : "15%",
        backgroundColor : "#26000000",
        textAlign : Titanium.UI.TEXT_ALIGNMENT_LEFT,
        font : {
            fontWeight : "bold",
            fontSize : 18
        }
    });

    otherTextBox1.addEventListener("change", function(e) {
        isEdited = true;
        if (OS_IOS) {
            appraisalForm[e.source.subjectIndex].comment = e.source.value;
            pastSubjectIndex = e.source.subjectIndex;

            if (appraisalForm[e.source.subjectIndex].subjectScore < "4") {
                if (appraisalForm[e.source.subjectIndex].comment.length > 0) {
                    appraisalForm[e.source.subjectIndex].isItemsDescSelected = true;
                    appraisalForm[e.source.subjectIndex].isSelected = true;
                } else {
                    for (var x = 0; x < appraisalForm[e.source.subjectIndex].itemsDesc.length; x++) {
                        appraisalForm[e.source.subjectIndex].isItemsDescSelected = false | appraisalForm[e.source.subjectIndex].itemsDesc[x].isSelected;
                        if (appraisalForm[e.source.subjectIndex].isItemsDescSelected) {
                            break;
                        }
                    }
                }
            } else {
                appraisalForm[e.source.subjectIndex].isSelected = true;
                appraisalForm[e.source.subjectIndex].isItemsDescSelected = true;
            }

        } else {
            if (!this.value) {
                return;
            }
            if (changeState == 0) {
                changeState = 1;
                otherTextBox1.setValue(this.value);
                appraisalForm[e.source.subjectIndex].comment = e.source.value;
                pastSubjectIndex = e.source.subjectIndex;

                if (appraisalForm[e.source.subjectIndex].subjectScore < "4") {
                    if (appraisalForm[e.source.subjectIndex].comment.length > 0) {
                        appraisalForm[e.source.subjectIndex].isItemsDescSelected = true;
                        appraisalForm[e.source.subjectIndex].isSelected = true;
                    } else {
                        for (var x = 0; x < appraisalForm[e.source.subjectIndex].itemsDesc.length; x++) {
                            appraisalForm[e.source.subjectIndex].isItemsDescSelected = false | appraisalForm[e.source.subjectIndex].itemsDesc[x].isSelected;
                            if (appraisalForm[e.source.subjectIndex].isItemsDescSelected) {
                                break;
                            }
                        }
                    }
                } else {
                    appraisalForm[e.source.subjectIndex].isSelected = true;
                    appraisalForm[e.source.subjectIndex].isItemsDescSelected = true;
                }
            } else {
                if (changeState == 1) {
                    changeState = 2;
                    var len = otherTextBox1.getValue().length;
                    otherTextBox1.setSelection(len, len);
                } else {
                    changeState = 0;
                }
            }
        }
    });

    var otherView = Ti.UI.createView({
        backgroundColor : 'transparent',
        layout : "horizontal",
        height : "100%",
        width : "100%",
        touchEnabled : true
    });

    var otherTableRow = Ti.UI.createTableViewRow({
        idType : "btnRow",
        index : i,
        selectedColor : 'transparent',
        backgroundColor : 'transparent',
        hasChild : false,
        width : "100%",
        height : 70,
    });

    otherView.add(otherLabel);
    otherView.add(otherTextBox1);
    otherTableRow.add(otherView);
    tableData.push(otherTableRow);

    $.scrollView.children[0].removeAllChildren();
    $.scrollView.children[0].setData(tableData);
    $.scrollView.children[0].height = Ti.UI.SIZE;
}

function showItemsDescPerSubject(e) {
    formNumberArg = e.source.formNumber;
    subjectNumberArg = e.source.subjectNumber;
    subjectIndex = e.source.subjectIndex;
    scoreArg = e.source.score;

    if (appraisalForm[subjectIndex].itemsDesc != null) {
        if (subjectNumberArg == "01" && formNumber != "05") {

            var itemsDescForSubject01 = [];
            var hasGender = false;

            if (evaluated.gender.substring(0, 1).toLowerCase() == "m") {
                var genderTitle = "  Male Crew  ";
                var textColor = colorTextValue;
                hasGender = true;
                for (var y = 0; y < appraisalForm[subjectIndex].itemsDesc.length; y++) {
                    if (appraisalForm[subjectIndex].itemsDesc[y].condition.toLowerCase() == "m") {
                        itemsDescForSubject01.push(appraisalForm[subjectIndex].itemsDesc[y]);
                    }
                }
                appraisalForm[subjectIndex].itemsDesc = itemsDescForSubject01;

            } else if (evaluated.gender.substring(0, 1).toLowerCase() == "f") {
                var genderTitle = "  Female Crew  ";
                var textColor = colorTextValue;
                hasGender = true;
                for (var y = 0; y < appraisalForm[subjectIndex].itemsDesc.length; y++) {
                    if (appraisalForm[subjectIndex].itemsDesc[y].condition.toLowerCase() == "f") {
                        itemsDescForSubject01.push(appraisalForm[subjectIndex].itemsDesc[y]);
                    }
                }
                appraisalForm[subjectIndex].itemsDesc = itemsDescForSubject01;

            } else {
                var genderTitle = "  Select Crew Gender";
                var textColor = "white";
                hasGender = false;
            }

            var crewGenderLabel = Ti.UI.createLabel({
                text : genderTitle,
                left : "3%",
                width : !hasGender ? "205" : Ti.UI.SIZE,
                top : "15",
                bottom : "15",

                font : {
                    fontWeight : "bold",
                    fontSize : 18
                },
                color : textColor,
                borderRadius : 5,
                border : 1,
                borderColor : "white"
            });

            crewGenderLabel.addEventListener("click", function(e) {
                var tableData = [];
                menuType = GENDERBOX;
                for (var k = 0; k < genderMenuList.length; k++) {
                    tableData.push(createOptDialogBtnForGenderSelection(genderMenuList[k], genderMenuList.length));
                }
                var win2 = optionDialogWindow(tableData, "70%", "20%");
                tableData = null;

                win2.open();
                win2.addEventListener("click", function(e) {
                    win2.close();
                });

            });

            crewGenderLabel.touchEnabled = !hasGender;

            var arrowDown = Ti.UI.createImageView({
                image : "images/arrow_down.png",
                height : "15",
                width : "15",
                left : -20
            });

            var crewGenderView = Ti.UI.createView({
                backgroundColor : 'transparent',
                layout : "horizontal",
                height : 70,
                width : "100%",
                touchEnabled : true
            });

            crewGenderView.add(crewGenderLabel);
            if (!hasGender) {
                crewGenderView.add(arrowDown);
            }

            e.source.parent.parent.add(crewGenderView);

            for (var i = 0; i < appraisalForm[subjectIndex].itemsDesc.length; i++) {
                var itemDescLabel = Ti.UI.createLabel({
                    text : appraisalForm[subjectIndex].itemsDesc[i].itemDesc,
                    left : "2%",
                    width : "80%",
                    height : "100%",

                    font : {
                        fontWeight : "bold",
                        fontSize : 18
                    },
                    color : colorTextTitle
                });

                var view1 = Ti.UI.createView({
                    backgroundColor : 'transparent',
                    layout : "horizontal",
                    height : 70,
                    width : "100%",
                    touchEnabled : true
                });

                if (appraisalForm[subjectIndex].itemsDesc[i].itemType == "Checkbox") {
                    var checkboxBtn = Ti.UI.createImageView({
                        image : appraisalForm[subjectIndex].itemsDesc[i].isSelected ? '/images/btn_button_on.png' : '/images/btn_button_off.png',
                        left : "3%",
                        height : 45,
                        width : 45,
                        isSelected : appraisalForm[subjectIndex].itemsDesc[i].isSelected,
                        subjectIndex : subjectIndex,
                        subjectNumber : appraisalForm[subjectIndex].itemsDesc[0].subjectNumber,
                        formNumber : appraisalForm[subjectIndex].itemsDesc[0].formNumber,
                        itemIndex : i
                    });
                    checkboxBtn.addEventListener("click", function(e) {
                        isEdited = true;
                        checkBoxFunction(e);
                    });

                    view1.add(checkboxBtn);
                }

                view1.add(itemDescLabel);
                e.source.parent.parent.height = Ti.UI.SIZE;
                e.source.parent.parent.add(view1);
            }

        } else {
            for (var i = 0; i < appraisalForm[subjectIndex].itemsDesc.length; i++) {
                var view1 = Ti.UI.createView({
                    backgroundColor : 'transparent',
                    layout : "horizontal",
                    height : "70",
                    width : "100%",
                    touchEnabled : true
                });

                if (appraisalForm[subjectIndex].itemsDesc[i].itemType == "Checkbox") {
                    var checkboxBtn = Ti.UI.createImageView({
                        image : appraisalForm[subjectIndex].itemsDesc[i].isSelected ? '/images/btn_button_on.png' : '/images/btn_button_off.png',
                        left : "3%",
                        height : 45,
                        width : 45,
                        isSelected : appraisalForm[subjectIndex].itemsDesc[i].isSelected,
                        subjectIndex : subjectIndex,
                        subjectNumber : appraisalForm[subjectIndex].itemsDesc[0].subjectNumber,
                        formNumber : appraisalForm[subjectIndex].itemsDesc[0].formNumber,
                        itemIndex : i
                    });
                    checkboxBtn.addEventListener("click", function(e) {
                        isEdited = true;
                        checkBoxFunction(e);
                    });

                    view1.add(checkboxBtn);
                }

                var itemDescLabel = Ti.UI.createLabel({
                    text : appraisalForm[subjectIndex].itemsDesc[i].itemDesc,
                    left : "2%",
                    width : "80%",
                    height : "100%",

                    font : {
                        fontWeight : "bold",
                        fontSize : 18
                    },
                    color : colorTextTitle
                });

                view1.add(itemDescLabel);
                
                e.source.parent.parent.add(view1);
            }

        }

         var otherView = Ti.UI.createView({
            backgroundColor : 'transparent',
            layout : "horizontal",
            height : 70,
            width : "100%",
            touchEnabled : true
        });

        var otherLabel = Ti.UI.createLabel({
            text : "Other : ",
            left : "4%",
            width : 100,
            height : "100%",

            font : {
                fontWeight : "bold",
                fontSize : 18
            },
            color : colorTextTitle
        });

        var otherTextBox2 = Ti.UI.createTextField({
            value : appraisalForm[subjectIndex].comment,
            subjectIndex : subjectIndex,
            left : 0,
            width : "75%",
            borderRadius : "5",
            borderWidth : "1",
            borderColor : "#7B549C",
            color : "#FFCB05",
            top : "15%",
            bottom : "15%",
            backgroundColor : "#26000000",
            textAlign : Titanium.UI.TEXT_ALIGNMENT_LEFT,
            font : {
                fontWeight : "bold",
                fontSize : 18
            }
        });

        otherTextBox2.addEventListener("change", function(e) {
            isEdited = true;
            if (OS_IOS) {
                appraisalForm[e.source.subjectIndex].comment = e.source.value;
                pastSubjectIndex = e.source.subjectIndex;
                if (appraisalForm[e.source.subjectIndex].subjectScore < "4") {
                    if (appraisalForm[e.source.subjectIndex].comment.length > 0) {
                        appraisalForm[e.source.subjectIndex].isItemsDescSelected = true;
                        appraisalForm[e.source.subjectIndex].isSelected = true;
                    } else {
                        for (var x = 0; x < appraisalForm[e.source.subjectIndex].itemsDesc.length; x++) {
                            appraisalForm[e.source.subjectIndex].isItemsDescSelected = false | appraisalForm[e.source.subjectIndex].itemsDesc[x].isSelected;
                            if (appraisalForm[e.source.subjectIndex].isItemsDescSelected) {
                                break;
                            }
                        }
                    }
                } else {
                    appraisalForm[e.source.subjectIndex].isSelected = true;
                    appraisalForm[e.source.subjectIndex].isItemsDescSelected = true;
                }

            } else {
                if (!this.value) {
                    return;
                }
                if (changeState == 0) {
                    changeState = 1;
                    otherTextBox2.setValue(this.value);
                    appraisalForm[e.source.subjectIndex].comment = e.source.value;
                    pastSubjectIndex = e.source.subjectIndex;
                    if (appraisalForm[e.source.subjectIndex].subjectScore < "4") {
                        if (appraisalForm[e.source.subjectIndex].comment.length > 0) {
                            appraisalForm[e.source.subjectIndex].isItemsDescSelected = true;
                            appraisalForm[e.source.subjectIndex].isSelected = true;
                        } else {
                            for (var x = 0; x < appraisalForm[e.source.subjectIndex].itemsDesc.length; x++) {
                                appraisalForm[e.source.subjectIndex].isItemsDescSelected = false | appraisalForm[e.source.subjectIndex].itemsDesc[x].isSelected;
                                if (appraisalForm[e.source.subjectIndex].isItemsDescSelected) {
                                    break;
                                }
                            }
                        }
                    } else {
                        appraisalForm[e.source.subjectIndex].isSelected = true;
                        appraisalForm[e.source.subjectIndex].isItemsDescSelected = true;
                    }
                } else {
                    if (changeState == 1) {
                        changeState = 2;
                        var len = otherTextBox2.getValue().length;
                        otherTextBox2.setSelection(len, len);
                    } else {
                        changeState = 0;
                    }
                }
            }
        });

        otherView.add(otherLabel);
        otherView.add(otherTextBox2);

        e.source.parent.parent.add(otherView);
        e.source.parent.parent.height = Ti.UI.SIZE;
    }
}

function showSubjectScore(scoreSelectedArg) {
    var scoreImageArray = {
        socre1Image : '/images/ic_star_white.png',
        socre2Image : '/images/ic_star_white.png',
        socre3Image : '/images/ic_star_white.png',
        socre4Image : '/images/ic_star_white.png',
        socre5Image : '/images/ic_star_white.png',
        socre6Image : '/images/ic_star_white.png',
    };

    if (scoreSelectedArg == 1) {
        scoreImageArray.score1Image = '/images/ic_star_highlight.png';
        scoreImageArray.score2Image = '/images/ic_star_white.png';
        scoreImageArray.score3Image = '/images/ic_star_white.png';
        scoreImageArray.score4Image = '/images/ic_star_white.png';
        scoreImageArray.score5Image = '/images/ic_star_white.png';
        scoreImageArray.score6Image = '/images/ic_star_white.png';
        ratingSelected = "1";
    } else if (scoreSelectedArg == 2) {
        scoreImageArray.score1Image = '/images/ic_star_highlight.png';
        scoreImageArray.score2Image = '/images/ic_star_highlight.png';
        scoreImageArray.score3Image = '/images/ic_star_white.png';
        scoreImageArray.score4Image = '/images/ic_star_white.png';
        scoreImageArray.score5Image = '/images/ic_star_white.png';
        scoreImageArray.score6Image = '/images/ic_star_white.png';
        ratingSelected = "2";
    } else if (scoreSelectedArg == 3) {
        scoreImageArray.score1Image = '/images/ic_star_highlight.png';
        scoreImageArray.score2Image = '/images/ic_star_highlight.png';
        scoreImageArray.score3Image = '/images/ic_star_highlight.png';
        scoreImageArray.score4Image = '/images/ic_star_white.png';
        scoreImageArray.score5Image = '/images/ic_star_white.png';
        scoreImageArray.score6Image = '/images/ic_star_white.png';
        ratingSelected = "3";
    } else if (scoreSelectedArg == 4) {
        scoreImageArray.score1Image = '/images/ic_star_highlight.png';
        scoreImageArray.score2Image = '/images/ic_star_highlight.png';
        scoreImageArray.score3Image = '/images/ic_star_highlight.png';
        scoreImageArray.score4Image = '/images/ic_star_highlight.png';
        scoreImageArray.score5Image = '/images/ic_star_white.png';
        scoreImageArray.score6Image = '/images/ic_star_white.png';
        ratingSelected = "4";
    } else if (scoreSelectedArg == 5) {
        scoreImageArray.score1Image = '/images/ic_star_highlight.png';
        scoreImageArray.score2Image = '/images/ic_star_highlight.png';
        scoreImageArray.score3Image = '/images/ic_star_highlight.png';
        scoreImageArray.score4Image = '/images/ic_star_highlight.png';
        scoreImageArray.score5Image = '/images/ic_star_highlight.png';
        scoreImageArray.score6Image = '/images/ic_star_white.png';
        ratingSelected = "5";
    } else if (scoreSelectedArg == 6) {
        scoreImageArray.score1Image = '/images/ic_star_highlight.png';
        scoreImageArray.score2Image = '/images/ic_star_highlight.png';
        scoreImageArray.score3Image = '/images/ic_star_highlight.png';
        scoreImageArray.score4Image = '/images/ic_star_highlight.png';
        scoreImageArray.score5Image = '/images/ic_star_highlight.png';
        scoreImageArray.score6Image = '/images/ic_star_highlight.png';
        ratingSelected = "6";
    } else {
        scoreImageArray.score1Image = '/images/ic_star_white.png';
        scoreImageArray.score2Image = '/images/ic_star_white.png';
        scoreImageArray.score3Image = '/images/ic_star_white.png';
        scoreImageArray.score4Image = '/images/ic_star_white.png';
        scoreImageArray.score5Image = '/images/ic_star_white.png';
        scoreImageArray.score6Image = '/images/ic_star_white.png';
    }
    return scoreImageArray;
}

$.cancleEvaluation.addEventListener('click', function(e) {
    cancelFunction();
});

function cancelFunction() {
    if(isEdited) {
        var _syncDataPromptView = new Alloy.createController("common/alertPrompt", {
            title : 'Confirm',
            message : 'Do you want to discard this Evaluation?',
            okText : "Yes",
            cancelText : "No",
            onOk : function() {
                $.crewAppraisalFormWindow.close();
            }
        }).getView();
        _syncDataPromptView.open();            
    } else {
        $.crewAppraisalFormWindow.close();        
    }
}

function saveCrewAppraisal() {
    var isSave = false;
    var isAllSubjectsEvaluated = true;
    for (var i = 0; i < appraisalForm.length; i++) {
        if (appraisalForm[i].subjectScore < "4") {
            if (appraisalForm[i].comment.length > 0) {
                appraisalForm[i].isItemsDescSelected = true;
                appraisalForm[i].isSelected = true;
            } else {
                for (var x = 0; x < appraisalForm[i].itemsDesc.length; x++) {
                    appraisalForm[i].isItemsDescSelected = false | appraisalForm[i].itemsDesc[x].isSelected;
                    if (appraisalForm[i].isItemsDescSelected) {
                        break;
                    }
                }
                appraisalForm[i].isSelected = appraisalForm[i].isItemsDescSelected;
            }
        } else {
            appraisalForm[i].isSelected = true;
            appraisalForm[i].isItemsDescSelected = true;
        }
        isAllSubjectsEvaluated = isAllSubjectsEvaluated & appraisalForm[i].isSelected & appraisalForm[i].isItemsDescSelected;
    }

    if (isAllSubjectsEvaluated || subjectType != "Rating") {
        isSave = true;
    } else {
        var _promptView = new Alloy.createController("common/alertPrompt", {
            title : "Alert",
            message : "Please evaluate all subjects or please select the subject's reasons why the rating is less than 4.",
            okText : "OK",
            disableCancel : true,
            onOk : function() {
            }
        }).getView();
        _promptView.open();
    }

    if (isSave) {
        var _syncDataPromptView = new Alloy.createController("common/alertPrompt", {
            title : 'Confirm',
            message : 'Do you want to save this Evaluation?',
            okText : "Yes",
            cancelText : "No",
            onOk : function() {
                var flightDerail = query.getFlightDetails(currentFlightId);
                if (flightDerail != null) {
                    var flightNumberTemp = flightDerail.flightExternalId.replace(/_/gi, "");
                    var flightNumber = flightNumberTemp.substring(0, flightNumberTemp.length - 1);
                    var flightExtId = flightDerail.flightExternalId;
                }

                if (formDetail != null) {
                    if (formDetail.appraisalId != null) {
                        var appraisalId = formDetail.appraisalId;
                    } else {
                        var appraisalId = utility.generateEvaluatedGUID();
                    }
                } else {
                    var appraisalId = utility.generateEvaluatedGUID();
                }

                var appraisalAnswer = {
                    id : appraisalId,
                    sfdcId : formDetail.sfdcId,
                    formNumber : formNumber,
                    evaluatorId : evaluator.id,
                    evaluatedId : evaluated.crewExtId,
                    flightExtId : flightExtId,
                    flightSfdcId : currentFlightId,
                    flightNumber : flightNumber,
                    comment : remarkTextBox.value,
                    createdDate : utility.getDateTimeUTC(),
                    isSynced : false,
                    formDesc : formDesc,
                    appraisalForm : appraisalForm
                };

                crewListRefresh = 1;
                query.insertCrewAppraisalAnswer(appraisalAnswer, subjectType);
                query.updateCrewIsAppraised(evaluated.crewExtId);
                $.crewAppraisalFormWindow.close();
            }
        }).getView();
        _syncDataPromptView.open();
    }

}

if (OS_IOS) {
    $.saveEvaluation.addEventListener('click', function(e) {
        saveCrewAppraisal();
    });
} else {
    $.crewAppraisalFormWindow.activity.onCreateOptionsMenu = function(e) {
        menuItem = e.menu.add({
            title : "Save",
            showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM
        });
        menuItem.addEventListener("click", function(e) {
            saveCrewAppraisal();
        });
    };
}

//
//**********************************************
//* Main
//**********************************************
initializeSubjectList();
$.crewAppraisalFormWindow.addEventListener('postlayout', function() {
    if (!isPostedLayout) {
        if (OS_ANDROID) {
            $.anActIndicatorView.show();
        }
        isPostedLayout = true;
        setTimeout(function() {
            if (OS_IOS) {
                Alloy.Globals.activityIndicator.hide();
            } else if (OS_ANDROID) {
                $.anActIndicatorView.hide();
            }
        }, 300);
    }
});

if (OS_ANDROID) {
    $.crewAppraisalFormWindow.addEventListener('android:back', function(e) {
        cancelFunction();
    });
    var softInput = Titanium.UI.Android.SOFT_INPUT_STATE_ALWAYS_HIDDEN | Ti.UI.Android.SOFT_INPUT_ADJUST_PAN;
    $.crewAppraisalFormWindow.windowSoftInputMode = softInput;
}

// if(OS_IOS) {
    // $.crewAppraisalFormWindow.addEventListener('click', function() {
        // if(otherTextBox1 != null) {
            // otherTextBox1.blur();        
        // }
        // if(otherTextBox2 != null) {
            // otherTextBox2.blur();                
        // }
        // if(remarkTextBox != null) {
            // remarkTextBox.blur();        
        // }
    // });    
// }

