const SELECT_BOX_DEFAULT_VALUE = -1;
const TRANSACTION_TYPE_TRANSFER = "Transfer";

$(document).ready(async () => {
    //1. show-hide from,to,id depending on type
    const accountId = $("#accountId");
    const accountIdFromField = $("#accountIdFrom");
    const accountIdToField = $("#accountIdTo");
    //accountIdFrom & accountIdTo is hidden as default
    accountIdFromField.hide();
    accountIdToField.hide();
    $('input[name="transactionType"]').change(() => {
        const type = $('input[name="transactionType"]:checked').val();
        if (type !== TRANSACTION_TYPE_TRANSFER) {
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
    $("#add-transaction").click(async () => {
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
        var amount = $("#amount").val();

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
        const categoryResponse = await Get("categories");
        const accountsResponse = await Get("accounts");

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

        console.log(transactionsResponse);

        // get t-body
        const $tableBody = $("#transaction-table-body");

        transactionsResponse.forEach((account) => {
            // add transactions info to table
            account.forEach((transaction) => {
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
        });
    } catch (error) {
        console.error("Error fetching transaction data:", error);
    }

    //4. set validation function
    transactionValidationDefs.forEach((def, i) => {
        //prepare hidden error message
        $(def.elementSelector).after(
            //todo: move css stylings to css file.
            `<p id="error-message-${i}" class="error-message ${def.class}" style="display: none; color: red">${def.errMsg}</p>`
        );

        const errorMessageSelector =
            def.class === "" ? `p#error-message-${i}` : `p.${def.class}`;

        $(def.elementSelector).change(function () {
            //show error message
            if (!def.validation()) {
                $(`${def.elementSelector} ~ ${errorMessageSelector}`).show();
            } else {
                $(`${def.elementSelector} ~ ${errorMessageSelector}`).hide();
                if (def.class !== "") {
                    $(`${errorMessageSelector}`).hide();
                }
            }
            //change button availability
            if (!ValidateTransactionInput()) {
                $("#add-transaction").attr("disabled", true);
            } else {
                $("#add-transaction").attr("disabled", false);
            }
        });
    });
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
        errMsg: "Please input Value between 1 and the amount which an account has.",
        class: "",
        validation: function () {
            if ($("input#amount").val() <= 0) {
                return false;
            } else {
                return true;
            }
        },
    },
];

function ValidateTransactionInput() {
    return transactionValidationDefs
        .map((def) => {
            return def.validation();
        })
        .every((res) => res);
}
