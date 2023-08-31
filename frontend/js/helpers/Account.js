function updateUI(account) {
    $("#accName").append(`
      <tr>
        <td>${account.username}</td>
        <td>0</td>
      </tr>
    `);

    $(
        "#account, #from, #to, #FilterByAccount, #accountId, #accountIdTo, #accountIdFrom"
    ).append(`<option value=${account.id}>${account.username}</option>`);
}

$(document).ready(async () => {
    const accounts = await Get("accounts");

    //set default option
    $(
        "#account, #from, #to, #FilterByAccount, #accountId, #accountIdTo, #accountIdFrom"
    ).append(`<option value=-1>---</option>`);

    accounts.forEach((account) => {
        // Update the UI
        updateUI(account);
    });

    $("#addAcc").submit(async (event) => {
        event.preventDefault();
        const newName = $("#accountInput").val().trim();
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
            balance: 0,
        });

        // Clear input
        $("#accountInput").val("");
    });
});
