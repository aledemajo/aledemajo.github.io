
let rowData;

rowData = data;
gridOptions.rowData = rowData;

function reloadData(index) {
	rowData = data;
	let i = 0
	while (i < index) {
		rowData = rowData.concat(rowData.slice())
		i++
	}
	gridOptions.api.setRowData(rowData)
	updateLabel(rowData.length)
}

function resetData() {
	console.log('resetting data...')
	rowData = rowData
	gridOptions.api.setRowData(rowData)
	console.log('reloaded to ' + rowData.length  + ' records!')

	updateLabel(rowData.length)
}

function updateLabel(records) {
	console.log('reloading...')
	document.getElementById('lblRecords').innerHTML = 'Updated to ' + records + ' records';
	console.log('reloaded to ' + rowData.length  + ' records!')
}