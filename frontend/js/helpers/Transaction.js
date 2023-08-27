//common functions that can be used in different cases


async function Get(path) {
    return await ApiRequest("http://localhost:3000/" + path, "GET");
}

async function Post(path, body) {
    return await ApiRequest("http://localhost:3000/" + path, "POST", body);
}

async function ApiRequest(url, type, body) {
    return await $.ajax({
        url: url,
        type: type,
        data: JSON.stringify(body),
        contentType: "application/json",
        success: (data) => {
            return data;
        },
        error: (err) => {
            console.log(err);
        },
    });
}


//2023.8.25 
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
      var categoryId = parseInt($('#categoryId').val());
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

      // ローカルストレージにトランザクション情報を追加保存
      // const storedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
      // storedTransactions.push(...result); // サーバーからのレスポンスをローカルストレージに保存
      // localStorage.setItem('transactions', JSON.stringify(storedTransactions));
  });


  //3. display lists of transactions
  try {
    // get transaction info by API request
    const transactionsResponse = await Get("transactions");
    const categoryResponse=await Get("categories");
    const accountsResponse = await Get("accounts"); 

    // アカウント情報を連想配列に整形
    const accountMap = {};
    accountsResponse.forEach(account => {
      accountMap[account.id] = account;
    });

    // カンテゴリ情報を連想配列に整形
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
  