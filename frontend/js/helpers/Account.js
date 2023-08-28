let accId = undefined;

let accountBalance = 0;


$(document).ready(() => {

  $("#addAcc").submit((event) => {
    event.preventDefault();
    const newName = $("#accountInput").val().trim();

    const accountExists = $("#accName td").toArray().some(td => td.textContent === newName);
    if (accountExists) {
      alert("Account already exists!");
      $("#accountInput").val("");
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
      $.ajax({
        method: "get",
        url: "http://localhost:3000/accounts",
        dataType: "json",
      }).done((accData) => {
        let accountName = $("#accountInput").val();
        console.log("accData", accData);
        if (accData.slice(-1)[0]) {
          accId = accData.slice(-1)[0].id;
          console.log("accId", accId);
          $("#accName").append(() =>{
            if($(`accName td[value="${accId}"]`).length == 0){
              return $(
                `<tr>
                <td value="${accId}">${accountName}</td>
                </tr>`
              );
            }
          });
          $("#accountInput").val("");
          $("#accBalance").append(`
            <tr>
              <td value="${accId}">${accountBalance}</td>
            </tr>
          `);
          
          $("#account").append(`
            <option value="${accId}">${accountName}</option>
          `);
          $("#from").append(`
            <option value="${accId}">${accountName}</option>
          `);
          $("#to").append(`
            <option value="${accId}">${accountName}</option>
          `);
          $("#FilterByAccount").append(`
            <option value="${accId}">${accountName}</option>
          `);
        };
        
      });
    });
  });
});

