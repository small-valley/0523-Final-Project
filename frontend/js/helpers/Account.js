$(document).ready(() => {
  // Load accounts from local storage on page load
  let savedAccounts = JSON.parse(localStorage.getItem("accounts")) || [];

  // Filter out any undefined accounts
  savedAccounts = savedAccounts.filter(account => account && account.id && account.name && account.balance !== undefined);

  // Update the UI with account details
  function updateUI(account) {
    $("#accName").append(
      `<tr>
        <td>${account.name}</td>
        <td>${account.balance}</td>
        <td><button class="removeBtn" data-account-id="${account.id}">Remove Account</button></td>
      </tr>`
    );
    $("#account, #from, #to, #FilterByAccount").append(
      `<option value="${account.id}">${account.name}</option>`
    );
  }

  savedAccounts.forEach((account) => {
    updateUI(account);
  });

  // Handle the remove account button click event
  $("#accName").on("click", ".removeBtn", function() {
    const accountId = $(this).data("account-id");
    savedAccounts = savedAccounts.filter(account => account.id !== accountId);
    localStorage.setItem("accounts", JSON.stringify(savedAccounts));
    $(this).closest("tr").remove();
  });

  $("#addAcc").submit((event) => {
    event.preventDefault();
    const newName = $("#accountInput").val().trim();

    const accountExists = savedAccounts.some(account => account.name === newName);
    if (accountExists) {
      // Show the modal
      $("#myModal").css("display", "block");
      $("#accountInput").val(""); // Clear input
  
      // Close the modal when the close button is clicked
      $(".close").click(function() {
        $("#myModal").css("display", "none"); // Hide the modal
      });
  
      return;
    }
  

    $.ajax({
      method: "post",
      data: {
        newAccount: newName,
      },
      url: "http://localhost:3000/accounts",
      dataType: "json",
    }).done((data) => {
      // Add new account to savedAccounts
      const newAccount = { id: data.id, name: newName, balance: 0 };
      savedAccounts.push(newAccount);
      localStorage.setItem("accounts", JSON.stringify(savedAccounts));

      // Update the UI
      updateUI(newAccount);

      // Clear input
      $("#accountInput").val("");
    });
  });
});