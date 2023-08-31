//common functions that can be used in different cases
const BASE_URL = "http://localhost:3000/";

async function Get(path) {
    return await ApiRequest(BASE_URL + path, "GET");
}

async function Post(path, body) {
    return await ApiRequest(BASE_URL + path, "POST", body);
}

async function ApiRequest(url, type, body) {
    try {
        return await $.ajax({
            url: url,
            type: type,
            data: JSON.stringify(body),
            contentType: "application/json",
            success: (data) => {
                return data;
            },
            error: (err) => {
                console.log(err);
                return err;
            },
        });
    } catch (err) {
        console.log("catch-error", err);
        return {
            status: err.status,
            errorMessage: err.responseText,
        };
    }
}
