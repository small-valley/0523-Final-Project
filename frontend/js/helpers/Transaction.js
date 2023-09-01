const SELECT_BOX_DEFAULT_VALUE = -1;
const TRANSACTION_TYPE_TRANSFER = "Transfer";

$(document).ready(async () => {
    //1. show-hide from,to,id depending on type
    DisplayAccountSelectElement();
    $('input[name="transactionType"]').change(async function () {
        DisplayAccountSelectElement();
        await SelectValidAccout($(this).val());
        ClearAmount();
        $("#add-transaction").attr("disabled", true);
    });

    //2.  process when clicked add-transaction-buton
    $("#transaction-form").submit(async (e) => {
        e.preventDefault();
        var transactionType = $('input[name="transactionType"]:checked').val();
        var accountId =
            transactionType !== TRANSACTION_TYPE_TRANSFER
                ? parseInt($("#accountId").val())
                : null;
        var accountIdFrom =
            transactionType === TRANSACTION_TYPE_TRANSFER
                ? parseInt($("#accountIdFrom").val())
                : null;
        var accountIdTo =
            transactionType === TRANSACTION_TYPE_TRANSFER
                ? parseInt($("#accountIdTo").val())
                : null;
        var categoryId = parseInt($("#category-select").val());
        var description = $("#description").val();
        var amount = parseInt($("#amount").val());

        //get info as text
        var accountName = $("#accountId").find(":selected").text();
        var accountNameFrom = $("#accountIdFrom").find(":selected").text();
        var accountNameTo = $("#accountIdTo").find(":selected").text();
        var categoryName = $("#category-select").find(":selected").text();
        //create confirmation text
        if (transactionType === "Transfer") {
            var confirmationMessage = `Do you want to add the transaction?
            
            Type: ${transactionType}
            ${accountNameFrom} ▶︎▶︎▶︎ ${accountNameTo}
            Category: ${categoryName}
            Amount: ${amount}
            Description: ${description}`;
        } else {
            var confirmationMessage = `Do you want to add the transaction?

            Account: ${accountName}
            Type: ${transactionType}
            Category: ${categoryName}
            Amount: ${amount}
            Description: ${description}`;
        }
        //set confirmation window
        const confirmation = window.confirm(confirmationMessage);
        let result;
        if (confirmation) {
            result = await Post("transactions", {
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
        } else {
            return;
        }

        if (!showNotification(result)) {
            return;
        }

        //clear input
        $("input#type-deposit").prop("checked", true);
        $("select#accountId option[value=-1]").attr("selected", true);
        $("select#accountIdFrom option[value=-1]").attr("selected", true);
        $("select#accountIdTo option[value=-1]").attr("selected", true);
        $("select#category-select option[value=-1]").attr("selected", true);
        $("#description").val("");
        $("#amount").val("");
        DisplayAccountSelectElement();
        ChangeAddTransactionButtonAvailability();
    });

    //3. display lists of transactions
    try {
        // get transaction info by API request
        const transactionsResponse = await Get("transactions");
        const categoryResponse = await Get("categories");
        const accountsResponse = await Get("accounts");

        //Format transaction information into an array of objects
        const transactions = transactionsResponse.flat().sort((a, b) => {
            return a.id - b.id;
        });

        // Format account information into an associative array
        const accountMap = {};
        accountsResponse.forEach((account) => {
            accountMap[account.id] = account;
        });

        // Format category information into an associative array
        const categoryMap = {};
        categoryResponse.forEach((category) => {
            categoryMap[category.id] = category;
        });

        // get t-body
        const $tableBody = $("#transaction-table-body");

        transactions.forEach((transaction) => {
            const $row = $("<tr>");
            $row.html(`
                  <td>${transaction.id}</td>d
                  <td>${accountMap[transaction.accountId].username}</td>
                  <td>${transaction.type}</td>
                  <td>${categoryMap[transaction.categoryId].name}</td>
                  <td>${transaction.description}</td>
                  <td>${transaction.amount}</td>
                  <td>${
                      transaction.accountIdFrom
                          ? accountMap[transaction.accountIdFrom].username
                          : "-"
                  }</td>
                  <td>${
                      transaction.accountIdTo
                          ? accountMap[transaction.accountIdTo].username
                          : "-"
                  }</td>
                `);
            $tableBody.append($row);
        });
    } catch (error) {
        console.error("Error fetching transaction data:", error);
    }

    //4. set validation function to new transaction
    transactionValidationDefs.forEach((def, i) => {
        //prepare hidden error message
        $(def.elementSelector).after(
            //todo: move css stylings to css file.
            `<p id="error-message-${i}" class="error-message ${def.class}" style="display: none; color: red">${def.errMsg}</p>`
        );

        const errorMessageSelector =
            def.class === "" ? `p#error-message-${i}` : `p.${def.class}`;

        $(def.elementSelector).change(async function () {
            //show error message
            const result = await def.validation();
            if (!result) {
                $(`${def.elementSelector} ~ ${errorMessageSelector}`).show();
            } else {
                $(`${def.elementSelector} ~ ${errorMessageSelector}`).hide();
                if (def.class !== "") {
                    $(`${errorMessageSelector}`).hide();
                }
            }
            //change button availability
            await ChangeAddTransactionButtonAvailability();
        });
    });

    //5. set validation function to new category
    $("#category-input").change(function () {
        if ($(this).val().trim() !== "") {
            $("#category-add-button").attr("disabled", false);
        }
    });

    //6. clear amount when acountId is changed
    $("#accountId, #accountIdFrom").change(ClearAmount);
});

const transactionValidationDefs = [
    {
        elementSelector: "#accountId",
        errMsg: "Please select Account.",
        class: "",
        validation: function () {
            if (
                $('input[name="transactionType"]:checked').val() ===
                TRANSACTION_TYPE_TRANSFER
            ) {
                return true;
            } else {
                if ($(this.elementSelector).val() == SELECT_BOX_DEFAULT_VALUE) {
                    return false;
                }
                return true;
            }
        },
    },
    {
        elementSelector: "#accountIdFrom",
        errMsg: "Please select From Account.",
        class: "",
        validation: function () {
            if (
                $('input[name="transactionType"]:checked').val() !==
                TRANSACTION_TYPE_TRANSFER
            ) {
                return true;
            } else {
                if ($(this.elementSelector).val() == SELECT_BOX_DEFAULT_VALUE) {
                    return false;
                }
                return true;
            }
        },
    },
    {
        elementSelector: "#accountIdFrom",
        errMsg: "From and To Acccount must be different.",
        class: "from-to-accountId",
        validation: function () {
            if (
                $('input[name="transactionType"]:checked').val() !==
                TRANSACTION_TYPE_TRANSFER
            ) {
                return true;
            } else {
                if (
                    $(this.elementSelector).val() != SELECT_BOX_DEFAULT_VALUE &&
                    $(this.elementSelector).val() === $("#accountIdTo").val()
                ) {
                    return false;
                }
                return true;
            }
        },
    },
    {
        elementSelector: "#accountIdTo",
        errMsg: "Please select To Account.",
        class: "",
        validation: function () {
            if (
                $('input[name="transactionType"]:checked').val() !==
                TRANSACTION_TYPE_TRANSFER
            ) {
                return true;
            } else {
                if ($(this.elementSelector).val() == SELECT_BOX_DEFAULT_VALUE) {
                    return false;
                }
                return true;
            }
        },
    },
    {
        elementSelector: "#accountIdTo",
        errMsg: "From and To Acccount must be different.",
        class: "from-to-accountId",
        validation: function () {
            if (
                $('input[name="transactionType"]:checked').val() !==
                TRANSACTION_TYPE_TRANSFER
            ) {
                return true;
            } else {
                if (
                    $(this.elementSelector).val() != SELECT_BOX_DEFAULT_VALUE &&
                    $(this.elementSelector).val() === $("#accountIdFrom").val()
                ) {
                    return false;
                }
                return true;
            }
        },
    },
    {
        elementSelector: "#category-select",
        errMsg: "Please select Category.",
        class: "",
        validation: function () {
            if ($(this.elementSelector).val() == SELECT_BOX_DEFAULT_VALUE) {
                return false;
            } else {
                return true;
            }
        },
    },
    {
        elementSelector: "#amount",
        errMsg: "Please input Value between 1 and the amout selected account has.",
        class: "",
        validation: async function () {
            const amount =
                $("input#amount").val() === ""
                    ? -1
                    : parseInt($("input#amount").val());

            if (
                $('input[name="transactionType"]:checked').val() ===
                    "Deposit" &&
                amount > 0
            ) {
                return true;
            }
            if (amount < 0) {
                return false;
            }

            // calculate account balance
            const accountId =
                $('input[name="transactionType"]:checked').val() ===
                TRANSACTION_TYPE_TRANSFER
                    ? $("#accountIdFrom").val()
                    : $("#accountId").val();

            let balance = 0;
            let transactions = await Get("transactions");
            transactions = transactions.flat();
            if (transactions) {
                const matchingTransactionsArray = transactions.filter(
                    (tran) => tran.accountId == accountId
                );
                balance = calcBalance(matchingTransactionsArray);
            }
            if (amount <= 0 || balance < amount) {
                $("p#error-message-6").text(
                    `Please input Value between 1 and ${balance}`
                );
                return false;
            } else {
                return true;
            }
        },
    },
];

async function ValidateTransactionInput() {
    const validations = await Promise.all(
        transactionValidationDefs.map(async (def) => {
            return await def.validation();
        })
    );
    return validations.every((res) => res == true);
}

async function ChangeAddTransactionButtonAvailability() {
    const result = await ValidateTransactionInput();
    $("#add-transaction").attr("disabled", !result);
}

function DisplayAccountSelectElement() {
    //show-hide from,to,id depending on type
    const accountId = $("#accountId");
    const type = $('input[name="transactionType"]:checked').val();
    const $fromToContainer = $("#from-to");
    const $accountLabel = $("#acc");

    $fromToContainer.hide();
    $accountLabel.show();

    if (type !== TRANSACTION_TYPE_TRANSFER) {
        accountId.show();
        $fromToContainer.hide();
        $accountLabel.show();
    } else {
        accountId.hide();
        $fromToContainer.show();
        $accountLabel.hide();
    }
}

async function SelectValidAccout(transactionType) {
    // delete input amount
    $("input#amount").val("");
    // initialize account select box
    $("#accountId, #accountIdFrom").empty();
    $("#accountId, #accountIdFrom").append(`<option value=-1>---</option>`);

    const accounts = await Get("accounts");

    // add all accounts to select box if type is deposit
    if (transactionType === "Deposit") {
        accounts.forEach((account) => {
            $("#accountId, #accountIdFrom").append(
                `<option value=${account.id}>${account.username}</option>`
            );
        });
        return;
    }

    const transactions = await Get("transactions");

    // set accounts info
    for (const account of accounts) {
        // Extract only elements matching the specified accountId
        const matchingTransactionsArray = transactions.find((accountArray) => {
            return accountArray.some(
                (transaction) => transaction.accountId === account.id
            );
        });

        // add account which has over 0 balance
        if (0 < calcBalance(matchingTransactionsArray)) {
            $("#accountId, #accountIdFrom").append(
                `<option value=${account.id}>${account.username}</option>`
            );
        }
    }
}

function ClearAmount() {
    // delete input amount
    $("input#amount").val("");
    // clear previous error messages
    $("p.error-message").hide();
    // diable amount input when accountId is not selected
    if (
        ($('input[name="transactionType"]:checked').val() !==
            TRANSACTION_TYPE_TRANSFER &&
            $("#accountId").val() == -1) ||
        ($('input[name="transactionType"]:checked').val() ===
            TRANSACTION_TYPE_TRANSFER &&
            $("#accountIdFrom").val() == -1)
    ) {
        $("input#amount").attr("disabled", true);
    } else {
        $("input#amount").attr("disabled", false);
    }
}
