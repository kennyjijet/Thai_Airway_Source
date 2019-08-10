
var args = arguments[0] || {};
var model = require('query_lib');
var component = require('component_lib');
var DataFromModel;
var mostDate;
var dutyMaster;
var canClick = false;
var clickWin = true;
var flightNumber;
var crewIdTemp = null;
var userId = model.getUserId();
var user = model.getUserDetailsFromCrew(userId.id + "_" + currentFlightId);

const isAppraisedColor = "#CCCCCC"; //"#88898C"
var isPostlayout = true;

function keepEventSource(e){
   eventSourceForCrewEvaluted = e; 
}

function showCrewList() {
    $.scrollView.hide();
    var userDetail = model.getUserDetail();
    var userRank = "IM";
    if(userDetail != null && userDetail != undefined) {
      userRank = userDetail.rank;
    }
    model.updateCrewListWhoShouldBeAppraised(userRank);
    model.updateCrewListWhoIsAppraised();

	DataFromModel = model.getCrewList(currentFlightId);		
	loopCheckMostDate(DataFromModel);
	
	setTableCrewList(DataFromModel);
}

	/* try to sort  appraisalno. */
	function sortFnByAppraisalNo(a, b) {
	    if (a.appraisalNo < b.appraisalNo)
	        return -1;
	    if (a.appraisalNo > b.appraisalNo)
	        return 1;
	    if (a.appraisalNo == b.appraisalNo)
	        return 0;
	};

function compareNumbers(a, b) {
  return a.appraisalNo - b.appraisalNo;
}

function loopCheckMostDate(data){
	mostDate=[];
	if(data.length>0){ 
		for (var ii = 0; ii < data.length; ii++) {
			for (var jj = 0; jj < data[ii].CrewList.length; jj++) {
				addToMostDate(data[ii].CrewList[jj].rtFlightAndDate);
			}
		}
		checkMostDate();
	}
}
function addToMostDate(date){
	for(i=0;i<mostDate.length;i++){
		if(mostDate[0].date==date)
		{
			mostDate[0].count+=1;
			return false;
		}
	}
	
	mostDate.push({date :date , count : 1});
	return true;
}
function checkMostDate(){
	var date="";
	if(mostDate.length>0){
		date=mostDate[0].date;
	}
	for(i=1;i<mostDate.length;i++){
		var date1 = new Date(mostDate[i].date);
		var date2 = new Date(date);
		if(date1>date2){
			date=mostDate[i].date;
		}
	}
	mostDate=date;
}


function formatDate(date) {
	  var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
   // var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	
    var d = new Date(date);
       	// var month = '' + d.getMonth();
       	var month = d.getMonth();
      	var day = '' + d.getDate();
        var year = d.getFullYear();
    // if (month.length < 2) month = '0' + month;
    if (day.length < 2){
    	day = day;
    	day = '0' + day;
    } else {
    	day = day;
    }
     	
    // return [day-1, months[month], year].join(' ');
    return [day, months[month], year].join(' ');
   // return day+" "+months[month];
}

// Option dialog for data selection
function optionDialogWindow(data, topAlign, leftAlign, rightAlign, viewIndex) {
    var optionDialogWin = Ti.UI.createWindow({
        fullscreen : false,
        backgroundColor : '#40000000',
    });
    var view = Ti.UI.createView({
        top : topAlign,
        bottom : "1%",
        left : leftAlign,
        right : rightAlign,
        borderRadius : 20,
        backgroundColor : 'white',
        layout : "vertical"
    });

    var tableView = Ti.UI.createTableView({
        height : "100%",
        width : "100%",
        data : data
    });
    setTimeout(function(){
    	if(OS_IOS){
    		tableView.scrollToIndex(viewIndex,{ 
				animated: false,
				position : Ti.UI.iOS.TableViewScrollPosition.TOP
			});
    	}else if(OS_ANDROID){
    		tableView.scrollToIndex(viewIndex,{ 
				animated: false,
				position : Ti.UI.Android.TRANSITION_SLIDE_TOP
			});
    	}
    },0);
    

    view.add(tableView);

    optionDialogWin.add(view);
    data = null;
    tableData = null;
    view = null;

    return optionDialogWin;
};

function createOptDialogBtn(dataArg, textColor, name, canSelect, androidHeight) {
    var rowHeight = 100 / 8;
    var rowHeightStr = rowHeight.toString() + "%";

    var row = Ti.UI.createTableViewRow({
        height : androidHeight = 0 ? rowHeightStr : androidHeight,
        width : "100%",
        touchEnable : canSelect,
        hasChild : 'false',
    });
        
    var label = Ti.UI.createLabel({
        text : dataArg,
        color : textColor,
        name : name,
        font : {
            fontSize : '20',
            fontWeight : 'bold'
        },
        height : "100%",
        width : "100%",
        textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER
    });
    
    canClick = false;
    clickWin = true;
    
	label.addEventListener("click", function(e) {
		if (canSelect){
			model.assignCrewDuty(label.name,label.text);
			canClick = true;
        }else{
        	clickWin = false;
        }
    });

    row.add(label);

    rowHeightStr = null;
    rowHeight = null;

    return row;
}

function setTableCrewList(data) {
	if(OS_IOS){
		$.scrollView.removeAllChildren();
	}else{
		for(var i=0;i<$.scrollView.children.length;i++){
			$.scrollView.remove($.scrollView.children[i]);
		}
	}
    
	for (var ii = 0; ii < data.length; ii++) {

		var tableData = [];
		var rHeight = 0;
		for (var jj = 0; jj < data[ii].CrewList.length; jj++) {

			var row = Ti.UI.createTableViewRow({
				className : 'row',
				objName : 'row',
				touchEnabled : true,
				height : 150,
				width : "100%",
				backgroundColor : "transparent",
				selectedColor : '#fff',
				selectedBackgroundColor : "#33ffffff",
				crewId : data[ii].CrewList[jj].id,
				name : data[ii].CrewList[jj].crewFirstName + " " + data[ii].CrewList[jj].crewLastName.substring(0,1)+".",
				rank : data[ii].CrewList[jj].rank
			});

			var ViewRow = Ti.UI.createView({
				crewId : data[ii].CrewList[jj].id,
				width : '100%',
				left : 0,
				height : '100%',
				layout : "horizontal"
			});
			
			var fullpath = "images/user_man.png";
			if (data[ii].CrewList[jj].image != "") {
				fullpath = Ti.Filesystem.applicationDataDirectory + Ti.Filesystem.separator + "crew" + Ti.Filesystem.separator + data[ii].CrewList[jj].image;
			}
			var imgVimg1 = Ti.UI.createImageView({
				image : fullpath,
				width : 90,
				height : 120,
				top : "10%",
				bottom : "10%",
				left : "5%",
				right : "5%",
				borderRadius: 15
			});
			ViewRow.add(imgVimg1);

			var View2 = Ti.UI.createView({ 		
				height : "100%",
				width : "33%",
				layout : "vertical"
			});
			//////////////////////
			var row1= Ti.UI.createView({
				height : 30,
				width : "100%",
				layout : "horizontal",
				top : "5%",
			});
			
			// crewFirstName:
			var label1 = Ti.UI.createLabel({
				text : "Name : " ,
				height : "100%",
				width : "35%",
				color : "white",
				font : {
					fontSize : 16
				}
			});
			row1.add(label1);
			
			// crewFirstName(Value)
			var label2 = Ti.UI.createLabel({
				text : (data[ii].CrewList[jj].crewFirstName!="" ? data[ii].CrewList[jj].crewFirstName: "")+" "+(data[ii].CrewList[jj].crewLastName!="" ? data[ii].CrewList[jj].crewLastName.substring(0,1)+".": "") ,
				height : "100%",
				width : "65%",
				left : "-5%",
				color : "#FFCB05",
				font : {
					fontSize : 15,
					fontWeight : 'bold'
				}
			});
			if(OS_ANDROID){
				label2.wordWrap = false;
				label2.ellipsize = true;
			}
			row1.add(label2);
			View2.add(row1);
			//////////////////////
			var crewId=data[ii].CrewList[jj].id!="" ? (data[ii].CrewList[jj].id): "";
			if(crewId!=""){
				crewId=crewId.split("_");
				crewId=crewId[0];
			}
			row1= Ti.UI.createView({
				height : 30,
				width : "100%",
				layout : "horizontal",
			});
			
			// PERS NO :
			 label1 = Ti.UI.createLabel({
				text : "PERS NO : " ,
				height : "100%",
				width : "40%",
				color : "white",
				font : {
					fontSize : 16
				}
			});
			
			// PERS NO(Value)
			row1.add(label1);
			 label2 = Ti.UI.createLabel({
				text : crewId ,
				height : "100%",
				width : "55%",
				left : "5%",
				color : "#FFCB05",
				font : {
					fontSize : 15,
					fontWeight : 'bold'
				}
			});
			row1.add(label2);
			View2.add(row1);
			//////////////////////
			  row1= Ti.UI.createView({
				height : 30,
				width : "100%",
				layout : "horizontal",
			});
			
			// duty:
			 label1 = Ti.UI.createLabel({
				text :  "Duty : " ,
				height : "100%",
				width : "35%",
				color : "white",
				font : {
					fontSize : 16
				}
			});
			row1.add(label1);
			
			// duty(Value)
			 label2 = Ti.UI.createLabel({
				text : (data[ii].CrewList[jj].duty!="" ? data[ii].CrewList[jj].duty: ""),
				height : "100%",
				width : "60%",
				left : "-5%",
				color : "#FFCB05",
				font : {
					fontSize : 15,
					fontWeight : 'bold'
				}
			});
			row1.add(label2);
			View2.add(row1);
			
			//////////////////////
			/* check first alphabet: 'A' */
			var chkRank = data[ii].CrewList[jj].rank.charAt(0); 
			
			/* btnDuty */
			/* add detect GE for hiding btnDuty*/
			if (data[ii].crewType != "Cockpit" 
				&& data[ii].crewType != "GE" 
				&& (chkRank != 'A' || chkRank != 'I')
				&& data[ii].CrewList[jj].dutyCode != "TVL"
				&& data[ii].crewType != "Other"  ) { 
				// || chkRank != 'I' ) {
			
				var btnDuty = Ti.UI.createView({
					btn : true,
					backgroundGradient: {
					    type: 'linear',
					    colors: [{color:'#ffffff',position:0.1},{color:'#ffffff',position:0.50},{color:'#c1c1c1',position:1.0}],
					    backFillStart:false
					  },
					left : 0,
					width : 160,
					height : 35,
					borderRadius : 5,
					borderColor : "white",
					borderWidth : 2,
				});
				 label1 = Ti.UI.createLabel({
					btn : true,
					color : '#3D1A6F',
					text : "Duty",
					font : {
						fontSize : 18,
						// fontFamily : 'Lucida Grande-Bold',
						fontWeight : 'bold'
					},
				});
				if(OS_ANDROID){
					label1.width = "100%";
					label1.height = "100%";
					label1.textAlign = "center";
				}
				btnDuty.add(label1);
				View2.add(btnDuty);
				
				btnDuty.addEventListener("click", function(eDuty)  {
					  // component.alertUnderConstruction();
					var tableDataDuty = [];
					var clickFlag = false;
					if(crewIdTemp != null){
						for(var i=0;i<$.scrollView.children[3].data[0].rows.length;i++){
							if (crewIdTemp == $.scrollView.children[3].data[0].rows[i].children[0].children[1].children[1].children[1].text) {
								if(OS_IOS){
									$.scrollView.children[3].data[0].rows[i].backgroundColor = "transparent";
								}else{
									$.scrollView.children[3].data[0].rows[i].children[0].backgroundColor = "transparent";
								}
							}
						}
					}
					if(dutyMaster.length > 0){
						if (user.id != ""){
							if(OS_IOS){
								eDuty.rowData.backgroundColor = "blue";
							}else{
								eDuty.source.parent.parent.parent.backgroundColor = "blue";
							}
							var closeWinFlag = false;
							if(user.rank == "AP" || user.rank == "IM"){
								var indexUnassign = 0;
								var isUnassignFlag = true;
								for (var i=0;i<dutyMaster.length;i++){
									var containDuty = model.containsDuty(dutyMaster[i]);
			  						if(containDuty){
			  							if(OS_IOS){
			  								tableDataDuty.push(createOptDialogBtn(dutyMaster[i], "gray", eDuty.rowData.crewId.split("_")[0], false,0));
			  							}else if(OS_ANDROID){
			  								tableDataDuty.push(createOptDialogBtn(dutyMaster[i], "gray", eDuty.source.parent.parent.parent.crewId.split('_')[0], false,75));
			  							}
									}else{
										if(isUnassignFlag){
											isUnassignFlag = false;
											indexUnassign = i;
										}
										if(OS_IOS){
			  								tableDataDuty.push(createOptDialogBtn(dutyMaster[i], "#007AFF", eDuty.rowData.crewId.split("_")[0], true,0));
			  							}else if(OS_ANDROID){
			  								tableDataDuty.push(createOptDialogBtn(dutyMaster[i], "#007AFF", eDuty.source.parent.parent.parent.crewId.split('_')[0], true,75));
			  							}
			  						}
			  					}
			  					var win2 = optionDialogWindow(tableDataDuty, "40%", "60%" ,"10%",indexUnassign);
						        win2.open();
						        tableDataDuty = [];
						        win2.addEventListener("click", function() {
						        	if(canClick){
						        		if(OS_IOS){
						        			crewIdTemp = eDuty.rowData.crewId.split("_")[0];
						        			eDuty.row.children[0].children[1].children[2].children[1].text = model.getCrewDuty(eDuty.rowData.crewId);
						        		}else{
						        			crewIdTemp = eDuty.source.parent.parent.parent.crewId.split('_')[0];
						        			eDuty.source.parent.parent.parent.children[1].children[2].children[1].text = model.getCrewDuty(eDuty.source.parent.parent.parent.crewId);
						        		}
						        		canClick = false;
						        		win2.close();
						        	}else{
						        		if(clickWin){
						        			if(OS_IOS){
												eDuty.rowData.backgroundColor = "transparent";
											}else{
												eDuty.source.parent.parent.parent.backgroundColor = "transparent";
											}
											clickWin = false;
						        			win2.close();
						        		}else{
						        			clickWin = true;
						        		}
						        	}
						        });
						    }
						    else{
						    	if(OS_IOS){
						    		eDuty.rowData.backgroundColor = "transparent";
						    	}else{
						    		eDuty.source.parent.parent.parent.backgroundColor = "transparent";
						    	}
						    	var dialog = Alloy.createController("common/alertPrompt", {
						            message : "Only AP/IM",
						            title : 'Alert',
						            okText : "OK",
						            onOk : function() {
						            },
						            disableCancel : true
						        }).getView();
						        dialog.open();
						    }
					    }else{
					    	if(OS_IOS){
					    		eDuty.rowData.backgroundColor = "transparent";
					    	}else{
					    		eDuty.source.parent.parent.parent.backgroundColor = "transparent";
					    	}
					    	var dialog = Alloy.createController("common/alertPrompt", {
					            message : "Only AP/IM",
					            title : 'Alert',
					            okText : "OK",
					            onOk : function() {
					            },
					            disableCancel : true
					        }).getView();
					        dialog.open();
					    }
					}else{
						if(OS_IOS){
				    		eDuty.rowData.backgroundColor = "transparent";
				    	}else{
				    		eDuty.source.parent.parent.parent.backgroundColor = "transparent";
				    	}
						var dialog = Alloy.createController("common/alertPrompt", {
				            message : "No duty master data in this Aircraft,\rPlease contact your administrator",
				            title : 'Alert',
				            okText : "OK",
				            onOk : function() {
				            },
				            disableCancel : true
				        }).getView();
				        dialog.open();
					}
				});
			} // end: btnDuty
			
			ViewRow.add(View2);
/////////////////////
			View2 = Ti.UI.createView({ 		
				height : "100%",
				width : "40%",
				layout : "vertical"
			});
			
			row1= Ti.UI.createView({
				height : 30,
				width : "100%",
				layout : "horizontal",
				top : "5%",
			});
			
			
			// crewNickName:
			 label1 = Ti.UI.createLabel({
				text :  "Nickname : " ,
				height : "100%",
				width : "40%",
				color : "white",
				font : {
					fontSize : 16
				}
			});
			row1.add(label1);
			
			// crewNickName(Value)
			 label2 = Ti.UI.createLabel({
				text : (data[ii].CrewList[jj].crewNickName!="" ? data[ii].CrewList[jj].crewNickName: ""),
				height : "100%",
				width : "55%",
				left : "-5%",
				color : "#FFCB05",
				font : {
					fontSize : 15,
					fontWeight : 'bold'
				}
			});
			row1.add(label2);
			View2.add(row1);
			//////////////////////
			row1= Ti.UI.createView({
				height : 30,
				width : "100%",
				layout : "horizontal",
			});
			
			// Rank
		    label1 = Ti.UI.createLabel({
				text :  "Rank : ",
				height : "100%",
				width : "25%",
				color : "white",
				font : {
					fontSize : 16
				}
			});
			row1.add(label1);
			
			// Rank(Value)
			 label2 = Ti.UI.createLabel({
				text : (data[ii].CrewList[jj].rank!="" ? (data[ii].CrewList[jj].rank)+" "+(data[ii].CrewList[jj].languages!="" ? ("("+data[ii].CrewList[jj].languages)+")": ""): "")  ,
				height : "100%",
				width : "70%",
				left : "-5%",
				color : "#FFCB05",
				font : {
					fontSize : 15,
					fontWeight : 'bold'
				}
			});
			row1.add(label2);
			View2.add(row1);
			//////////////////////
			row1= Ti.UI.createView({
				height : 30,
				width : "100%",
				layout : "horizontal",
			});
			
			// rtFlightAndDate:
			 label1 = Ti.UI.createLabel({
				text :  "RT.FLT/Date : ",
				height : "100%",
				width : "45%",
				color : "white",
				font : {
					fontSize : 16
				}
			});
			row1.add(label1);
			var rtDate=data[ii].CrewList[jj].rtFlightAndDate!="" ? formatDate(data[ii].CrewList[jj].rtFlightAndDate) : "";
			var rtNo=data[ii].CrewList[jj].rtFltNo!="" ? data[ii].CrewList[jj].rtFltNo : "";
			if(rtNo!=""){
				if(rtDate!=""){
					rtNo+="/"+rtDate;
				}
			}
			else{
				if(rtDate!=""){
					rtNo=rtDate;
				}
			}
			
			// rtFlightAndDate(Value)
			 label2 = Ti.UI.createLabel({
				text : rtNo,
				height : "100%",
				width : "55%",

				color : mostDate==data[ii].CrewList[jj].rtFlightAndDate ?  "#FFCB05" : "#D62E97",
				font : {
					fontSize : 15,
					// fontFamily : 'Lucida Grande-Bold',
					fontWeight : 'bold'
				}
			});
			if(OS_ANDROID){
				label2.wordWrap = false;
				label2.ellipsize = true;
			}
			row1.add(label2);
			View2.add(row1);
			
			
			//////////////////////
			/* check first alphabet: 'A' */
			var chkRank = data[ii].CrewList[jj].rank.charAt(0); 
			
			/* btnAppraisal */
			/* add detect GE for hiding btnApp*/
			if (data[ii].crewType != "Cockpit" 
				&& data[ii].crewType != "GE" 
				&& (chkRank != 'A' || chkRank != 'I') 
				&& data[ii].CrewList[jj].dutyCode != "TVL"
				&& data[ii].crewType != "Other" ) { 
                
				var btnAppraisal = Ti.UI.createView({
					btn : true,
                    rowIndex : jj,
                    crewId : data[ii].CrewList[jj].id,
                    crewExtId : data[ii].CrewList[jj].crewExtId,
                    isAppraised : data[ii].CrewList[jj].isAppraised,
					backgroundGradient: {
					    type: 'linear',
					    colors: [{color:'#ffffff',position:0.1},{color:'#ffffff',position:0.50},{color:'#c1c1c1',position:1.0}],
					    backFillStart:false
					  },
					left : 0,
					width : 180,
					height : 35,
					borderRadius : 5,
					borderColor : "white",
					borderWidth : 2
				});

                 var buttonAppraisalColor = '#3D1A6F';
                 if(data[ii].CrewList[jj].shouldBeEvaluated) {
                     buttonAppraisalColor = '#FF5733';
                 }
                 
				 label1 = Ti.UI.createLabel({
					btn : true,
					rowIndex : jj,
                    crewId : data[ii].CrewList[jj].id,
                    crewExtId : data[ii].CrewList[jj].crewExtId,
                    isAppraised : data[ii].CrewList[jj].isAppraised,
					color : !data[ii].CrewList[jj].isAppraised ? buttonAppraisalColor : isAppraisedColor,//"#88898C",
					text : !data[ii].CrewList[jj].isAppraised ? 'Appraisal ' + " (" + (data[ii].CrewList[jj].appraisalNo != null ? data[ii].CrewList[jj].appraisalNo : "") + ")" : 'Appraised ' + " (" + (data[ii].CrewList[jj].appraisalNo != null ? data[ii].CrewList[jj].appraisalNo : "") + ")",
					font : {
						fontSize : 18,
						// fontFamily : 'Lucida Grande-Bold',
						fontWeight : 'bold'
					},
				});
								
                // btnAppraisal.addEventListener("click", function(e)  {
                  // if(!e.source.isAppraised) {
                        // rowIndex = e.source.rowIndex;
                        // var crewAppraisalView = Alloy.createController("crew_appraisal/crew_appraisal", {
                            // crewId : e.source.crewId,
                        // }).getView();
                        // if(OS_IOS)
    					// {
    						// Alloy.Globals.navGroupWin.openWindow(crewAppraisalView);
    					// }else{
    						// crewAppraisalView.open();
    					// }
//                   
                    // } else {
                        // var _promptView = new Alloy.createController("common/alertPrompt", {
                            // title : "Alert",
                            // message : "This crew already appraised for this flight.",
                            // okText : "OK",
                            // disableCancel : true,
                            // onOk : function() {
                            // }
                        // }).getView();
                        // _promptView.open();                            
                    // }
                // });                 

                btnAppraisal.addEventListener("click", function(e)  {
                    rowIndex = e.source.rowIndex;
                    var crewAppraisalView = Alloy.createController("crew_appraisal/crew_appraisal", {
                        crewId : e.source.crewId,
                    }).getView();
                    if(OS_IOS)
                    {
                        Alloy.Globals.navGroupWin.openWindow(crewAppraisalView);
                    }else{
                    	$.anActIndicatorView.show();
                        crewAppraisalView.open();
                    }
                });                 

				btnAppraisal.add(label1);
				
				View2.add(btnAppraisal);
			}
			ViewRow.add(View2);
			///////////////////
			row.add(ViewRow);
			row.hasChild = true;
			row.addEventListener("click", function(e) {
				if (!e.source.btn == true) {
					CrewDetail(e.rowData.crewId);
				}
			});
		
			tableData.push(row);	 
			rHeight += 150;
		} // end for(.. data[ii].CrewList.length)
		
		
		/* items */
		var table = Ti.UI.createTableView({
			data : tableData,
			height : Ti.UI.SIZE,
			backgroundColor : "transparent",
			separatorColor : "#5E3987",
			scrollable : false
		});
		
		/* Section */
		var headerView = Ti.UI.createView({
			height : "6%", 
			width : "100%",
			backgroundImage : "/images/bg_header_section.png",
			layout : "horizontal"

		});
		
		if(OS_ANDROID){
			table.height = rHeight+20;
			headerView.height = 50;
		}

		var label1 = Ti.UI.createLabel({
			text : data[ii].crewType,
			left : "5%",
			color : "white",
			height : "100%",
			font : {
				fontSize : 20,
				// fontFamily : 'arial',
				fontWeight : 'bold'
			}
		});
		headerView.add(label1);
		
		label1 = Ti.UI.createLabel({
			text : " ("+data[ii].CrewList.length+")",
			left : 0,
			color : "#FFCB05",
			height : "100%",
			font : {
				fontSize : 20,
				// fontFamily : 'arial',
				fontWeight : 'bold'
			}
		});
		headerView.add(label1);
				
		$.scrollView.add(headerView);
		$.scrollView.add(table);

	} // end for(...data.length)
//	model = null;
	data = null;
}

/* sortFnSeqNumber */
function sortFnByAppraisalNo(a, b) {
    if (a.appraisalNo < b.appraisalNo)
        return -1;
    if (a.appraisalNo > b.appraisalNo)
        return 1;
    if (a.appraisalNo == b.appraisalNo)
        return 0;
};



function CrewDetail(crewId) {
	
	if(OS_IOS) { 
		Alloy.Globals.activityIndicator.show(); 
	}else{
		$.anActIndicatorView.show();
	}
	
	var crewDetailView = Alloy.createController("crew/crew_detail", {
		crewId : crewId
	}).getView();
	
	if(OS_IOS)
    {
    	Alloy.Globals.navGroupWin.openWindow(crewDetailView);
    }else{
    	crewDetailView.open();
    }
}

function init() {
    dutyMaster = model.getMasterDuty(currentFlightId);
	var flightDerail = model.getFlightDetails(currentFlightId); 
    if(flightDerail != null) {
        var flightNumberTemp = flightDerail.flightExternalId.replace(/_/gi, "");
        flightNumber = flightNumberTemp.substring(0, flightNumberTemp.length-1); 
    }
    showCrewList();
}

//**********************************************
//* Main
//**********************************************
$.crewLisWindow.touchEnabled = false;
init();
$.crewLisWindow.addEventListener('postlayout', function() {
	if(isPostlayout){
		setTimeout(function() {
	        $.scrollView.show();
			$.crewLisWindow.touchEnabled = true;
	        if(OS_IOS) { Alloy.Globals.activityIndicator.hide(); }
	        else { $.anActIndicatorView.hide(); }
		},300);
		isPostlayout = false;
	}
});

if(OS_IOS){
	$.leftNavCrew.addEventListener('click', function(){
		var dutyUnsync = model.countDutyUnSynced();
		if(dutyUnsync > 0){
			var dialog = Alloy.createController("common/alertPrompt", {
		        message : "Please sync manually to send new assigned duty to iCares",
		        title : 'Alert',
		        okText : "OK",
		        onOk : function() {
		        	$.crewLisWindow.close();
		        },
		        disableCancel : true
		    }).getView();
		    dialog.open();
		}else{
			$.crewLisWindow.close();
		}
	});
}

$.crewLisWindow.addEventListener('focus', function(e) {
    if(crewListRefresh) {
        crewListRefresh = 0;
        if(rowIndex != 300) {
            $.scrollView.show();
            $.scrollView.children[3].data[0].rows[rowIndex].children[0].children[2].children[3].children[0].color = isAppraisedColor;//"#F2F2F2";
            $.scrollView.children[3].data[0].rows[rowIndex].children[0].children[2].children[3].children[0].isAppraised = true;            
            rowIndex = 300;
        }
    }else{
    	if(!isPostlayout){
    		$.anActIndicatorView.hide();
    	}
    }
});

if(OS_ANDROID){
	$.crewLisWindow.addEventListener('android:back', function(e) {
	    // Ti.API.info("Press Back button");
	    var dutyUnsync = model.countDutyUnSynced();
		if(dutyUnsync > 0){
			var dialog = Alloy.createController("common/alertPrompt", {
		        message : "Please sync manually to send new assigned duty to iCares",
		        title : 'Alert',
		        okText : "OK",
		        onOk : function() {
		        	$.scrollView.removeAllChildren();
					$.scrollView = null;
					$.crewLisWindow.removeAllChildren();
		        	$.crewLisWindow.close();
		        },
		        disableCancel : true
		    }).getView();
		    dialog.open();
		}else{
			$.scrollView.removeAllChildren();
			$.scrollView = null;
			$.crewLisWindow.removeAllChildren();
			$.crewLisWindow.close();
		}
	});
}

