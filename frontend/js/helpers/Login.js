const LOGIN_KEY = "login";
const LOGIN = 0;
const LOGIN_PAGE_PATH = "index.html";

$(() => {
    const loginCode = localStorage.getItem(LOGIN_KEY);
    const path = window.location.pathname;
    if (loginCode != LOGIN && path.indexOf(LOGIN_PAGE_PATH) < 0) {
        alert("Please login!");
        window.location.replace("index.html");
        return;
    } else if (loginCode != LOGIN) {
        //show logout icon
        $("div#navBar").append(`
        <img id="login-image" src="../imgs/logout.png" alt="An image of login person">
        <p id="login-name">Logout</p>
        `);
        //hide menus
        $("a.inactive").hide();
    } else {
        //show login icon
        $("div#navBar").append(`
        <img id="login-image" src="../imgs/login.png" alt="An image of login person">
        <p id="login-name">Login: John Dow</p>
        `);
        //show menus
        $("a.inactive").show();
    }

    $("main").show();

    $("#myTrakr").click(() => {
        window.location.href = LOGIN_PAGE_PATH;
    });

    $("#login").click(() => {
        localStorage.setItem(LOGIN_KEY, LOGIN);
        window.location.href = "addAcc.html";
    });

    $("#logout").click(() => {
        localStorage.removeItem(LOGIN_KEY);
        $("div#navBar img").attr("src", "../imgs/logout.png");
        $("div#navBar p").text("Logout");
        $("a.inactive").hide();
    });
});
