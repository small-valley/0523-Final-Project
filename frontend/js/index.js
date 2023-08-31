$(() => {
  const $typeDeposit = $("#type-deposit");
  const $typeWithdraw = $("#type-withdraw");
  const $typeTransfer = $("#type-transfer");
  const $fromToContainer = $("#from-to");
  const $accountLabel = $("#acc");

  $fromToContainer.hide();
  $accountLabel.show();

  // Add event listeners to radio buttons using jQuery
  $typeDeposit.on("change", toggleFromTo);
  $typeWithdraw.on("change", toggleFromTo);
  $typeTransfer.on("change", toggleFromTo);

  function toggleFromTo() {
    $fromToContainer.toggle($typeTransfer.is(":checked"));
    $accountLabel.toggle(!$typeTransfer.is(":checked"));
  }
});