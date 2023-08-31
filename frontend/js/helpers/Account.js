$(document).ready(async () => {
  function updateUI(account) {
    $("#accName").append(
      `<tr>
        <td>${account.name}</td>
        <td>0</td>
        </tr>`
    );
    $("#account, #from, #to, #FilterByAccount, #accountId, #accountIdTo, #accountIdFrom").append(
      `<option value="${account.id}">${account.name}</option>`
    );
  }

  async function fetchAccounts() {
    const result = await Get("accounts"); 
    return result;
  }

  const accounts = await fetchAccounts(); 

  for (const account of accounts) {
    updateUI(account);
  }

  $("#addAcc").submit((event) => {
    event.preventDefault();
    const newName = $("#accountInput").val().trim();

    $.ajax({
      method: "post",
      data: {
        newAccount: newName,
      },
      url: "http://localhost:3000/accounts",
      dataType: "json",
    }).done((data) => {
      const newAccount = { id: data.id, name: newName, balance: 0 };
      // Update the UI
      updateUI(newAccount);

      // Clear input
      $("#accountInput").val("");
    });
  });
});
