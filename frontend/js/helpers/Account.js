$(document).ready(async() => {
  //1. update UI func
  function updateUI(account,balance=0) {
    $("#accName").append(
      `<tr>
        <td>${account.username}</td>
        <td>${balance}</td>
        <td><button class="removeBtn" data-account-id="${account.id}">Remove Account</button></td>
      </tr>`
    );
    $("#account, #from, #to, #FilterByAccount,#accountId,#accountIdTo,#accountIdFrom").append(
      `<option value="${account.id}">${account.username}</option>`
    );
  }

  //2. calc Balance func

  function calcBalance(accountTransactions,balance=0){
    if(accountTransactions){
      accountTransactions.forEach(transaction => {
        if (transaction.type === "Deposit") {
          balance += parseInt(transaction.amount);
        } else if (transaction.type === "Withdraw") {
          balance -= parseInt(transaction.amount);
        } else if (transaction.type === "Transfer") {
          if (transaction.accountId === transaction.accountIdFrom) {
            balance -= parseInt(transaction.amount);
          } else if (transaction.accountId === transaction.accountIdTo) {
            balance += parseInt(transaction.amount);
          } else {
            console.log("Unknown type:", transaction);
          }
        } else {
          console.log("Unknown type:", transaction);
        }
      });
    }
    return balance;
  }


  //3. edit page loading process 
  async function onPageLoad() {
    const transactions = await Get("transactions");
    const accounts = await Get("accounts");
    for (const account of accounts) {
      // Extract only elements matching the specified accountId
      const matchingTransactionsArray = transactions.find(accountArray => {
        return accountArray.some(transaction => transaction.accountId === account.id);
      });
      // calc balance
      balance=calcBalance(matchingTransactionsArray)

      updateUI(account, balance);
    }
  }
  onPageLoad(); 


  //4. when addAcc clicked process
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
      const newAccount = { id: data.id, username: newName};
      // Update the UI
      updateUI(newAccount);

      // Clear input
      $("#accountInput").val("");
    });
  });
});