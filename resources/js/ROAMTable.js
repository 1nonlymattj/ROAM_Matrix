function createTable() {
    // Create a table element
    var table = document.createElement('table');

    // Header row
    var headerRow1 = document.createElement('tr');
    var th1 = document.createElement('th');
    var th2 = document.createElement('th');

    th1.textContent = 'RESOLVED';
    th2.textContent = 'OWNED';

    headerRow1.appendChild(th1);
    headerRow1.appendChild(th2);

    // Column
    var trColumn = document.createElement('tr');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');

    td1.textContent = '';
    td2.textContent = '';

    trColumn.appendChild(td1);
    trColumn.appendChild(td2);

    // Header row with different headers
    var headerRow2 = document.createElement('tr');
    var th3 = document.createElement('th');
    var th4 = document.createElement('th');

    th3.textContent = 'ACCEPTED';
    th4.textContent = 'MITIGATED';

    headerRow2.appendChild(th3);
    headerRow2.appendChild(th4);

    // Column 2
    var trColumn2 = document.createElement('tr');
    var td3 = document.createElement('td');
    var td4 = document.createElement('td');

    td3.textContent = '';
    td4.textContent = '';

    trColumn2.appendChild(td3);
    trColumn2.appendChild(td4);

    // Append rows to the table
    table.appendChild(headerRow1);
    table.appendChild(trColumn);
    table.appendChild(headerRow2);
    table.appendChild(trColumn2);

    // Append the table to the body of the document
    // Append the table to the specific div
    var tableContainer = document.getElementById('ROAM_Table');
    tableContainer.appendChild(table);
}