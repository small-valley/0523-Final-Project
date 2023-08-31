const SUCCESS_MESSAGE = "Success!";

const snackbarCss = {
    "min-width": "250px",
    "margin-left": "-125px",
    "background-color": "#333",
    color: "#fff",
    "text-align": "center",
    "border-radius": "2px",
    padding: "16px",
    position: "fixed",
    "z-index": "1",
    left: "50%",
    bottom: "30px",
};

function showNotification(apiResult) {
    const message = !apiResult.errorMessage
        ? SUCCESS_MESSAGE
        : apiResult.errorMessage;

    $("main").append(
        `<div id="snackbar" style="display: none">${message}</div>`
    );
    $("#snackbar").css(snackbarCss).fadeIn(500);
    setTimeout(() => {
        $("#snackbar").fadeOut(500, () => {
            $("#snackbar").remove();
        });
    }, 2000);

    return message === SUCCESS_MESSAGE;
}
