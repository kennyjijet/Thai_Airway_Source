// exam 
// var val=0;
// 
// var namePage="Equipment";
// var statusSelect=1;//0=singleSelsect    1=MultiSelect   2=singleSelectToNextPage
// var data=[];  //"name"= show in table      //Path next Page 
// data.push({ itemName : "number 1", nextPageName : "create_incident" });
// data.push({ itemName : "number 2",nextPageName : "create_incident"  });
// data.push({ itemName : "number 3",nextPageName : "create_incident"  });
// data.push({ itemName : "number 4",nextPageName : "create_incident"  });
// 
// function pickerValue(value){
   // val=value;
   // $.showdata.text=val;
// }
// $.show.addEventListener('click',function(e){
    // alert(jjmall);
// });
// var searchFlag=false;
// $.timePickerLabel.addEventListener('click',function(e){
	// $.navWindow.openWindow(Alloy.createController("pick_list",[pickerValue,data,PageName,statusSelect,searchFlag]).getView());   // send function set value and Data List
	// Alloy.Globals.navWindow = $.navWindow;
// });
// 
//**********************************************
//* Variable Declaration
//**********************************************
var args = arguments[0] || {};

var arrayData = [];
var arrayDataForReturn = [];
var filterArrayData = [];
var functionReturn;
var statusSearch = false;
var statusSelect;
var idWindow;
var enabledBottomButtonFlag = false;

var selectedData = [];
var isLoadingSearch = false;
var keyboardTimeout;
var isPostedLayout = false;

//**********************************************
//* Function
//**********************************************
function setIcon(imgPath, i) {
	var icon = $.UI.create("ImageView", {
		image : imgPath,
	    left : 5,
	    height : 45,
	    width : 45,
	    selectedFlag : false,
	    conditionId : i,
	    id : "iconId"
	});
	return icon;
}

function setTitle(dataAgr) {
        var title = $.UI.create("Label", {
            text : dataAgr,
            left : 45 + 20,
            classes : 'fontBold18',
            color : colorTextTitle
        });    
        return title;
}

function setArrayData(array) {
	var dataTable = [];

    for (var i = 0; i < array.length; i++) {

        var row = $.UI.create("TableViewRow", {
            selectedColor : 'transparent',
            hasChild : statusSelect == 2 ? true : false,
            height : 50,
            //          backgroundSelectedColor: 'gray',
            touchEnabled : false,
            backgroundColor: "transparent",
//            id : i,
            idType : "btnRow",
            selected: false
        });
		
		var imgIconPath = "/images/btn_button_off.png";
		if (isDataSelected(array[i].name)) {
			removeArrayDataForReturn(array[i].name);
			arrayDataForReturn.push(array[i]);
			imgIconPath = "/images/btn_button_on.png";
			
			enabledBottomButtonFlag = true;
			
			row.selected = true;
		}
        row.add(setIcon(imgIconPath,i));
        row.add(setTitle(array[i].name));
        
        dataTable.push(row);
        // var titleTable = {
        // title : array[i].name,
        // height : "75",
        // color : colorTextTitle,
        // font : {
        // fontSize : '20px',
        // fontFamily : 'arial',
        // fontWeight : 'bold'
        // },
        // hasChild : statusSelect == 2 ? true : false
        // };
    }

	setTable(dataTable);
    dataTable = null;
}

function isDataSelected(name) {
	if (selectedData != null && selectedData.length > 0) {
		for (var i = 0; i < selectedData.length; i++) {
			if (selectedData[i].name == name) {
				return true;
			}
		}
	}
	
	return false;
}

function setTable(tableData) {
	$.tableView.setData(tableData);
}

// $.tableView.addEventListener('click', function(e){
// if(statusSearch) functionReturn(filterArrayData[e.index].title);
// else functionReturn(arrayData[e.index].title);
// idWindow.close();
//
// });
function removeArrayDataForReturn(name){
	for(var i=0;i<arrayDataForReturn.length;i++){
		if(arrayDataForReturn[i].name==name){
			arrayDataForReturn.splice(i, 1);
		}
	}
}

$.tableView.addEventListener('onrowselect', function(e) {
//	Ti.API.log('select' + e.index);
	if (statusSearch)
		arrayDataForReturn.push(filterArrayData[e.index]);
	else
		arrayDataForReturn.push(arrayData[e.index]);
		e.row.children[0].image = "/images/btn_button_on.png";
});
$.tableView.addEventListener('onrowunselect', function(e) {
//	Ti.API.log('unselect' + e.index);
	if (statusSearch)
		removeArrayDataForReturn(filterArrayData[e.index].name);
	else
		removeArrayDataForReturn(arrayData[e.index].name);
        e.row.children[0].image = "/images/btn_button_off.png";

//	e.row.backgroundColor = 'transparent';
});
$.doneBtn.addEventListener('click', function(e) {	
	functionReturn(arrayDataForReturn);
	$.pickerWindow.close();
	
});
$.cancelBtn.addEventListener('click', function(e) {
    $.pickerWindow.close();
});

$.tableView.addEventListener('click', function(e) {
	if (statusSelect == '1') {
		e.row.selected = !e.row.selected;
		if (e.row.selected) {
			$.tableView.fireEvent('onrowselect', e);
		} else {
			$.tableView.fireEvent('onrowunselect', e);
		}
		
//		$.controllBtn.visible = arrayDataForReturn.length > 0 ? true : false;
//        enabledBottomButtonFlag = arrayDataForReturn.length > 0 ? true : false;
       // enabledBottomButtonFlag = true;
       // enalbleDisableButton();
         
	} else {
		if (statusSearch) {
			if (statusSelect == 2) {
				var nextPageNameView = Alloy.createController(filterArrayData[e.index].nextPageName, {
					DataFromPickList : filterArrayData[e.index]
				}).getView();
				if(OS_IOS){
    	 			Alloy.Globals.navGroupWin.openWindow(nextPageNameView);
      			}else{
    				nextPageNameView.open();
    			}	
			} else {
				functionReturn(filterArrayData[e.index]);
				$.pickerWindow.close();
			}

		} else {
			if (statusSelect == 2) {
				var nextPageNameView = Alloy.createController(arrayData[e.index].nextPageName, {
					DataFromPickList : arrayData[e.index]
				}).getView();
				
				if(OS_IOS){
    	 			Alloy.Globals.navGroupWin.openWindow(nextPageNameView);
      			}else{
    				nextPageNameView.open();
    			}	

			} else {
				functionReturn(arrayData[e.index]);
				$.pickerWindow.close();
			}

		}

	}
});


function filterData(searchText) {
    filterArrayData = [];
    for (var i = 0; i < arrayData.length; i++) {
        if (arrayData[i].name.trim().toLowerCase().indexOf(searchText) > -1) {
            filterArrayData.push(arrayData[i]);
        }
    }
    setArrayData(filterArrayData);
}

$.custom_searchbar.clearTextBtn.addEventListener('click', function() {
    tempData = [];
    statusSearch = false;
    $.custom_searchbar.clearTextBtn.hide();
    $.custom_searchbar.customSearchBar.value="";
    $.custom_searchbar.customSearchBar.hintText = "Search by Name...";
    if(OS_IOS) {
        Alloy.Globals.activityIndicator.show();
    }
    setTimeout(function() {
        setArrayData(arrayData);
	    if(OS_IOS) {
	        Alloy.Globals.activityIndicator.hide();
	    }
    }, 20);
});

$.custom_searchbar.customSearchBar.addEventListener('touchstart', function(e) {
    $.tableView.removeAllChildren();
    arrayDataForReturn = [];
    if ($.custom_searchbar.customSearchBar.value == "") {
        $.custom_searchbar.customSearchBar.hintText = "Search by Name...";
//        setArrayData(arrayData);
        searchStatus = false;
        $.custom_searchbar.clearTextBtn.hide();
    } else {
        searchStatus = true;
        $.custom_searchbar.clearTextBtn.show();
        filterData($.custom_searchbar.customSearchBar.value.trim().toLowerCase());
    }

});

$.custom_searchbar.customSearchBar.addEventListener("change", function(e) {
    if(keyboardTimeout) {
        clearTimeout(keyboardTimeout);
        keyboardTimeout = null;
    }
    keyboardTimeout = setTimeout(function(){
            $.tableView.removeAllChildren();
            arrayDataForReturn = [];
            if ($.custom_searchbar.customSearchBar.value == "") {
                $.custom_searchbar.customSearchBar.hintText = "Search by Name...";
                statusSearch = false;
                $.custom_searchbar.clearTextBtn.hide();
                if(OS_IOS) {
	                Alloy.Globals.activityIndicator.show();                	
                }
                setTimeout(function() {
                    setArrayData(arrayData);
	                if(OS_IOS) {
	                    Alloy.Globals.activityIndicator.hide();
	                }
                }, 20);
            } else {
                statusSearch = true;
                $.custom_searchbar.clearTextBtn.show();
                filterData($.custom_searchbar.customSearchBar.value.trim().toLowerCase());
            }
        }, 500);        
 });

function init() {
    arrayDataForReturn = [];
    functionReturn = args[0];
    arrayData = args[1];
    $.pickerWindow.title = args[2];
    statusSelect = args[3];
    $.custom_searchbar.visible=args[4];
    $.custom_searchbar.clearTextBtn.hide();
    $.custom_searchbar.customSearchBar.hintText = "Search by Name...";
   
    if (args[5] != null) {
        selectedData = args[5];
    }
    
};

//**********************************************
//* Main
//**********************************************
$.pickerWindow.backgroundImage = bgGeneral;
init();
$.pickerWindow.addEventListener('postlayout', function() {
	if(!isPostedLayout) {
		isPostedLayout = true;
		setArrayData(arrayData);
	    if(OS_IOS) {
	        Alloy.Globals.activityIndicator.hide();
	    }
   }
});


if(OS_ANDROID){
	$.pickerWindow.addEventListener('android:back', function(e) {
	    Ti.API.info("Press Back button");
		$.pickerWindow.close();
	});
	var softInput = Titanium.UI.Android.SOFT_INPUT_STATE_ALWAYS_HIDDEN | Ti.UI.Android.SOFT_INPUT_ADJUST_PAN;
	$.pickerWindow.windowSoftInputMode = softInput;
	
	$.pickerWindow.activity.onCreateOptionsMenu = function(e) {
		var menuItem = e.menu.add({
			title : "Done",
			showAsAction : Ti.Android.SHOW_AS_ACTION_IF_ROOM
		});
		menuItem.addEventListener("click", function(e) {
			functionReturn(arrayDataForReturn);
			$.pickerWindow.close();
		});
	};

	
}
