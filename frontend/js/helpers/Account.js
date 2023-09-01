function updateUI(account,balance=0) {
    $("#accName").append(`
      <tr>
        <td>${account.username}</td>
        <td>${balance}</td>
      </tr>
    `);
  
    $(
        "#account, #from, #to, #FilterByAccount, #accountId, #accountIdTo, #accountIdFrom"
    ).append(`<option value=${account.id}>${account.username}</option>`);
  }
  
  //calc balance function
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
  
  
  $(document).ready(async () => {
    const accounts = await Get("accounts");
    const transactions = await Get("transactions");
  
    //set default option
    $(
        "#account, #from, #to, #FilterByAccount, #accountId, #accountIdTo, #accountIdFrom"
    ).append(`<option value=-1>---</option>`);
    // set accounts info
    for (const account of accounts) {
      // Extract only elements matching the specified accountId
      const matchingTransactionsArray = transactions.find(accountArray => {
        return accountArray.some(transaction => transaction.accountId === account.id);
      });
      // calc balance
      balance=calcBalance(matchingTransactionsArray)
      updateUI(account, balance);
    }
  
  
    //when addAcc clicked
    $("#addAcc").submit(async (event) => {
        event.preventDefault();
        const newName = $("#accountInput").val().trim();
        if (accounts.some(account => account.username === newName)) {
          alert("Account already exists!");
          return;
        }
        const result = await Post("accounts", {
            newAccount: newName,
        });
  
        //show result in UI and handle server error
        if (!showNotification(result)) {
            return;
        }
  
        // Update the UI
        updateUI({
            id: result.id,
            username: newName,
        });
  
        // Clear input
        $("#accountInput").val("");
    });
  });
  