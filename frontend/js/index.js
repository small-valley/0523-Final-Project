$(() => {
  //Start coding here!
});
const typeDeposit = document.getElementById("type-deposit");
  const typeWithdraw = document.getElementById("type-withdraw");
  const typeTransfer = document.getElementById("type-transfer");
  const fromToContainer = document.getElementById("from-to");
  const accountLabel = document.getElementById("acc");

  // Initially hide 'From' and 'To'
  fromToContainer.style.display = "none";
  accountLabel.style.display = "block"; // Display 'Account' initially

  // Add event listeners to radio buttons
  typeDeposit.addEventListener("change", toggleFromTo);
  typeWithdraw.addEventListener("change", toggleFromTo);
  typeTransfer.addEventListener("change", toggleFromTo);

  function toggleFromTo() {
    // Show 'From' and 'To' only for 'Transfer'
    fromToContainer.style.display =
      typeTransfer.checked ? "block" : "none";
    
    // Hide 'Account' label when 'Transfer' is selected
    accountLabel.style.display = typeTransfer.checked ? "none" : "block";
  }