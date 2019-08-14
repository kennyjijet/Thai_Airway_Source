var arrayData = [];
var filterArrayData = [];
var arrayDataForReturn = [];
var functionReturn;
var statusSearch = false;
var statusMultiSelect = false;
var idWindow;
$.init = function(args) {
	functionReturn = args[0];
	arrayData = args[1];
	$.label.text = args[2];
	statusMultiSelect = args[3];
	idWindow = args[4];
	$.doneBtn.visible = statusMultiSelect;
	setArrayData(arrayData);
};
function setArrayData(array) {
	var dataTable = [];
	for (var i = 0; i < array.length; i++) {

		var row = Ti.UI.createTableViewRow({
			className : 'row',
			objName : 'row',
			touchEnabled : true,
			height : 100,
			title : array[i].name,
			index : i
		});

		if (statusMultiSelect) {
			var image = Ti.UI.createImageView({
				image : 'unselect.png',
				right : "2%",
				selectStatus : false
			});

			image.addEventListener('click', function(e) {
				e.source.selectStatus = !e.source.selectStatus;
				if (e.source.selectStatus) {
					e.source.image = "select.png";
					if (statusSearch)
						arrayDataForReturn.push(filterArrayData[e.source.parent.index]);
					else
						arrayDataForReturn.push(arrayData[e.source.parent.index]);

				} else {
					e.source.image = "unselect.png";
					deleteArrayData(e.source.parent.title);
				}
			});
			row.add(image);
		} else {
			row.addEventListener('click', function(e) {
				if (statusSearch) {
					functionReturn(filterArrayData[e.source.index]);
				} else {
					functionReturn(arrayData[e.source.index]);
				}
				idWindow.close();

			});

		}
		dataTable.push(row);
	}
	setTable(dataTable);
}
function setTable(tableData) {
	$.tableView.setData(tableData);
}

function deleteArrayData(title) {
	for (var i = 0; i < arrayDataForReturn.length; i++) {
		if (arrayDataForReturn[i] == title) {
			arrayDataForReturn.splice(i, 1);
		}
	}
}
function filterData(searchText) {
	filterArrayData = [];
	for (var i = 0; i < arrayData.length; i++) {
		if (arrayData[i].title.trim().toLowerCase().indexOf(searchText) > -1) {
			filterArrayData.push(arrayData[i]);
		}
	}
	setTable(filterArrayData);
}

$.searchBar.addEventListener("change", function(e) {
	$.tableView.removeAllChildren();
	arrayDataForReturn = [];
	if (e.value.length == 0) {
		statusSearch = false;
		setTable(arrayData);
		//performSearch(null);
	} else {
		statusSearch = true;
		filterData(e.value.trim().toLowerCase());
		//performSearch(e.value);
	}
});
$.doneBtn.addEventListener('click', function(e) {
	functionReturn(arrayDataForReturn);
	idWindow.close();
});
