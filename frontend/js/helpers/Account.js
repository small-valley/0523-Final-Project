function addAccount(event) {
  event.preventDefault();   
  const accountName = $('#accountInput').val();
  const tableRow = $('<tr></tr>');
  const accountCell = $('<td></td>').text(accountName);
  let balanceCell = $('<td></td>').text(0);
  tableRow.append(accountCell);
  tableRow.append(balanceCell);
  $('#summary').append(tableRow);
}
