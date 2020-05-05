export function FetchGet(address, parameters, isSecure, callback, errorCallback) {
    let query = [];
    for (let parameter in parameters) {
        let encodedKey = encodeURIComponent(parameter);
        let encodedValue = encodeURIComponent(parameters[parameter]);
        query.push(encodedKey + "=" + encodedValue);
    }
    query = query.join("&");
    if (isSecure) {
        query += "&nickname=" + encodeURIComponent(global.nickname) + "&password=" + encodeURIComponent(global.password);
    }
    fetch(address + "?" + query, {
        method: 'GET',
    }).then((response) => response.json())
        .then((responseJson) => {
            callback(responseJson)
        })
        .catch((error) => {
            errorCallback(error)
        });
}

export function FetchPost(address, details, isSecure, callback, errorCallback = null) {
    let formBody = [];
    for (let property in details) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    if (isSecure) {
        formBody += "&username=" + encodeURIComponent(global.username) + "&password=" + encodeURIComponent(global.password);
    }

    fetch(global.apiAddress + address, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody
    }).then((response) => response.json())
        .then((responseJson) => {
            callback(responseJson)
        })
        .catch((error) => {
            if (errorCallback !== undefined && errorCallback !== null) {
                errorCallback(error);
                console.log(address + " API error, message: " + error.message);
            }
        });
}

