//common functions that can be used in different cases
const BASE_URL = "http://localhost:3000";

function Get(url) {
    return ApiRequest(url, "GET");
}

function Post(url, body) {
    return ApiRequest(url, "POST", body);
}

function ApiRequest(url, type, body) {
    $.ajax({
        url: url,
        type: type,
        data: JSON.stringify(body),
        contentType: "application/json",
        success: (data) => {
            return data;
        },
        error: (err) => {
            console.log(err);
        },
    });
}
