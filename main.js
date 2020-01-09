// TODO add column definitions necessary for Order Detail report
var columnDefs = [
  {
      headerName: "Company",
      children: [
        {headerName: "Name", field: "company", rowGroup: true, hide: true, filter: 'agTextColumnFilter', rowGroup: true},
        {headerName: "Terms", field: "company_attributes.terms", rowGroup: true},
        {headerName: "Phone", field: "company_attributes.phone", filter: 'agTextColumnFilter', rowGroup: true},
        {headerName: "URL", field: "company_attributes.url", filter: 'agTextColumnFilter', rowGroup: true},
      ]
  },
  {
    headerName: "Item",
    children: [
      {headerName: "Name", field: "item", hide: true, filter: 'agTextColumnFilter'},
      {headerName: "Size", field: "item_attributes.size", pivot: true, enablePivot: true},
      {headerName: "Color", field: "item_attributes.color", enablePivot: true},
      {headerName: "Style", field: "item_attributes.style", enablePivot: true},
    ]
  },
  {
    headerName: "Order",
    children: [
      {headerName: "Order", field: "order", rowGroup: true, hide: true, filter: 'agTextColumnFilter'},
    ]
  },
  {headerName: "Ordered (#)", field: "orderedQuantity", aggFunc: 'sum', valueFormatter: currencyFormatter},
  {headerName: "Ordered ($)", field: "orderedAmount", aggFunc: 'sum', valueFormatter: currencyFormatter},
  {headerName: "Currency", field: "currency", hide: true},
];

// TODO aggregate values
var gridOptions = {
    defaultColDef: {
        sortable: true,
        filter: true
    },
    columnDefs: columnDefs,
    floatingFilter: true,
    animateRows: true,
    enableRangeSelection: true,
    enableCharts: true,
    sideBar: true,
    groupIncludeFooter: true,
    groupIncludeTotalFooter: true,
    rowData: rowData,
    autoGroupColumnDef: {
        headerName:'Group',
        field: 'item'
    }
};

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function() {
    var gridDiv = document.querySelector('#myGrid');
    new agGrid.Grid(gridDiv, gridOptions);
});

function currencyFormatter(params) {
  if(params.value && params.data) {
    return params.data.currency + ' ' + params.value; 
  }
}