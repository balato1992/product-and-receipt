
/* #baddf9, #edffff, #89abc6 */
/* #e3f2fd, #ffffff, #b1bfca */
export function getMainBgcolor() {
    return "#e0f7fa";
}
export function getBgcolor() {
    return "#eeeeee";
}

export function jsonCopyObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export function cusGetUidForView() {
    // reference: https://cythilya.github.io/2017/03/12/uuid/
    return "view" + performance.now() + Math.random();
}

export function cusFetch(url, method, data, resolve, reject, alway) {

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(JSON.stringify(data))
    })
        .then(response => {

            if (response.status === 200) {
                if (resolve) {
                    resolve();
                }
            } else {
                let msg = JSON.stringify({
                    'statusText': response.statusText,
                    'status': response.status,
                    'text': response.text()
                });
                throw new Error(msg)
            }

            if (alway) {
                alway();
            }
        })
        .catch(error => {
            if (reject) {
                reject(error);
            }

            if (alway) {
                alway();
            }
        });
}

export function cusFetchJson(url, callback) {

    fetch(url)
        .then(response => response.json())
        .then(callback);
}