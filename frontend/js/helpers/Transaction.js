$(document).ready(async () => {
  
  //1. show-hide from,to,id depending on type
  
  const accountId=$('#accountId');
  const accountIdFromField = $('#accountIdFrom');
  const accountIdToField = $('#accountIdTo');
  //accountIdFrom &accountIdTo is hidden as default
  accountIdFromField.hide();
  accountIdToField.hide();
  $('input[name="transactionType"]').change(() => {
    const type = $('input[name="transactionType"]:checked').val();
    if (type !== 'Transfer') {
      accountIdFromField.hide();
      accountIdToField.hide();
      accountId.show();
      
    } else {
      accountIdFromField.show();
      accountIdToField.show();
      accountId.hide();
    }
  });
  


  //2.  process when clicked add-transaction-buton
  $('#add-transaction').click(async () => {
      var transactionType = $('input[name="transactionType"]:checked').val();
      var accountId = (transactionType !== 'Transfer') ? parseInt($('#accountId').val()) : null;     
      var accountIdFrom = (transactionType === 'Transfer') ? parseInt($('#accountIdFrom').val()) : null;
      var accountIdTo = (transactionType === 'Transfer') ? parseInt($('#accountIdTo').val()) : null;
      var categoryId = parseInt($('#category-select').val());
      var description = $('#description').val();
      var amount = $('#amount').val();

      const result = await Post("transactions", {
          newTransaction: {
              accountId: accountId, // account ID for Deposits or Withdraws
              accountIdFrom: accountIdFrom, // sender ID if type = 'Transfer', otherwise null
              accountIdTo: accountIdTo, // receiver ID if type = 'Transfer', otherwise null,
              type: transactionType, // 'Deposit', 'Withdraw', 'Transfer'
              amount: amount, // amount of the transaction
              categoryId: categoryId, // category ID
              description: description, // description of the transaction
          },
      });
      console.log(result);
    });


  //3. display lists of transactions
  try {
    // get transaction info by API request
    const transactionsResponse = await Get("transactions");
    const categoryResponse=await Get("categories");
    const accountsResponse = await Get("accounts"); 

    // Format account information into an associative array
    const accountMap = {};
    accountsResponse.forEach(account => {
      accountMap[account.id] = account;
    });

    // Format category information into an associative array
    const categoryMap = {};
    categoryResponse.forEach(category => {
      categoryMap[category.id] = category;
    });

    console.log(transactionsResponse);
    
    // get t-body 
    const $tableBody = $('#transaction-table-body');

    transactionsResponse.forEach((account)=>{
      // add transactions info to table
      account.forEach((transaction) => {
        const $row = $('<tr>');
        $row.html(`
          <td>${transaction.id}</td>d
          <td>${accountMap[transaction.accountId].username}</td>
          <td>${transaction.type}</td>
          <td>${categoryMap[transaction.categoryId].name}</td>
          <td>${transaction.description}</td>
          <td>${transaction.amount}</td>
          <td>${transaction.accountIdFrom ? accountMap[transaction.accountIdFrom].username : '-'}</td>
          <td>${transaction.accountIdTo ? accountMap[transaction.accountIdTo].username : '-'}</td>
        `);
        $tableBody.append($row);
      });
    });
    
  } catch (error) {
    console.error('Error fetching transaction data:', error);
  }
});
  