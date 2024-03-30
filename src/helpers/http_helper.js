export const httpCall = async ({http, method, token, body, signal}) => {
    let req = {};

    if (token != null) {
        req = await fetch(http, {
            method: method,
            headers : {
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
         body: (method === 'GET' || body === null) ? null : JSON.stringify(body),
        });
    } 
    else if (signal != ""){
        console.log(http, method)
        req = await fetch(http, {
            method: method,
            headers : {
                'Content-Type': 'application/json',
            },
            body :(method === 'GET' || body === null) ? null : JSON.stringify(body),
            signal: signal
        });
    }
    else {
        console.log(http,method)
        req = await fetch(http, {
            method: method,
            headers : {
                'Content-Type': 'application/json',
            },
            body :(method === 'GET' || body === null) ? null : JSON.stringify(body),
        });
    }
    const result = await req.json();
    return result;
}