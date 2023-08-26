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

  // トランザクション追加ボタンがクリックされたときの処理
  $('#add-transaction').click(async () => {
      const transactionType = $('input[name="transactionType"]:checked').val();
        const accountId = parseInt($('#accountId').val());
        // const accountIdFrom = parseInt($('#accountIdFrom option:selected').val());
        // const accountIdTo = parseInt($('#accountIdTo option:selected').val());
        const categoryId = parseInt($('#categoryId').val());
        const description = $('#description').val();
        const amount = $('#amount').val();
    
      const result = await Post("transactions", {
          newTransaction: {
              accountId: accountId, // account ID for Deposits or Withdraws
              accountIdFrom: null, // sender ID if type = 'Transfer', otherwise null
              accountIdTo: null, // receiver ID if type = 'Transfer', otherwise null,
              type: transactionType, // 'Deposit', 'Withdraw', 'Transfer'
              amount: amount, // amount of the transaction
              categoryId: categoryId, // category ID
              description: description, // description of the transaction
          },
      });
      console.log(result);

      // ローカルストレージにトランザクション情報を追加保存
      const storedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
      storedTransactions.push(...result); // サーバーからのレスポンスをローカルストレージに保存
      localStorage.setItem('transactions', JSON.stringify(storedTransactions));
  });


  //display lists of transactions
  try {
    // API リクエストを使ってトランザクション情報を取得
    const transactionsResponse = await Get("transactions");
    console.log(transactionsResponse);
    
    // テーブルの tbody 要素を取得
    const $tableBody = $('#transaction-table-body');

    transactionsResponse.forEach((account)=>{
      // 取得したトランザクション情報をテーブルに追加
      let user='dammy';
      account.forEach((transaction) => {
        const $row = $('<tr>');
        $row.html(`
          <td>${transaction.id}</td>d
          <td>${transaction.accountId}</td>
          <td>${transaction.type}</td>
          <td>${transaction.categoryId}</td>
          <td>${transaction.description}</td>
          <td>${transaction.amount}</td>
          <td>${transaction.accountIdFrom}</td>
          <td>${transaction.accountIdTo}</td>
        `);
        $tableBody.append($row);
      });
    });
    
  } catch (error) {
    console.error('Error fetching transaction data:', error);
  }
});
  