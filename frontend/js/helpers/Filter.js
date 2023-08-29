$(document).ready(async() => {
    
    //set categories to select-filter box
    const categorySelect = $("#filter-category");
    const categories = await Get('categories');
    //set default value
    categorySelect.append(`<option value="">---</option>`);
    categories.forEach((category) => {
        categorySelect.append(
            `<option value=${category.id}>${category.name}</option>`
        );
    });

    //set accounts to select-filter box
    const accountSelect = $("#filter-account");
    const accounts = await Get('accounts');
    //set default value
    accountSelect.append(`<option value="">---</option>`);
    accounts.forEach((account) => {
        accountSelect.append(
            `<option value=${account.id}>${account.username}</option>`
        );
    });


    //click event when you change filter select
    $('#filter-account, #filter-category, #filter-type').change(async () => {
        try {
            // get transaction info by API request
            const transactionsResponse = await Get("transactions");
            const categoryResponse=await Get("categories");
            const accountsResponse = await Get("accounts"); 
        
            const flatTransactions=transactionsResponse.flat();
            
            //get filter info
            const filterAccount = $('#filter-account').val() === '' ? '' : parseInt($('#filter-account').val());
            const filterCategory = $('#filter-category').val() === '' ? '' : parseInt($('#filter-category').val());
            const filterType = $('#filter-type').val();
            
            //filter transactions
            const accountFilteredTransactions=accountFilters(filterAccount,flatTransactions);
            const categoryFilteredTransactions=categoryFilters(filterCategory,accountFilteredTransactions);
            const typeFilteredTransactions=typeFilters(filterType,categoryFilteredTransactions);

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
        
            console.log(flatTransactions);
            console.log(accountFilteredTransactions);
            console.log(categoryFilteredTransactions);
            console.log(typeFilteredTransactions);
            
            // get t-body 
            const $tableBody = $('#transaction-table-body');
            $tableBody.empty();

             // Add transactions info to table
            typeFilteredTransactions.forEach(transaction => {
                const $row = $('<tr>');
                $row.html(`
                <td>${transaction.id}</td>
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
          } catch (error) {
            console.error('Error fetching transaction data:', error);
          }
    });
  });
  



  //filter transactions by account　function
  function accountFilters(filterAccount,transactions) {
    if(filterAccount===''){
        return transactions
    }else{
        const filteredTransactions = transactions.filter(transaction => transaction.accountId === filterAccount);
        return filteredTransactions
    }
  }

  //filter transactions by category function
  function categoryFilters(filterCategory,transactions) {
    if(filterCategory===''){
        return transactions;
    }else{
        const filteredTransactions = transactions.filter(transaction => transaction.categoryId === filterCategory);
        return filteredTransactions
    }
  }

  //filter transactions by type function
  function typeFilters(filterType,transactions) {
    if(filterType===''){
        return transactions;
    }else{
        const filteredTransactions = transactions.filter(transaction => transaction.type === filterType);
        return filteredTransactions
    }
  }

