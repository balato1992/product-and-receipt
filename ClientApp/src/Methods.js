
export function getMainBgcolor() {
    return "#e0f7fa";
}

export function jsonCopyObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export function cusGetUidForView() {
    // reference: https://cythilya.github.io/2017/03/12/uuid/
    return "view" + performance.now() + Math.random();
}

export function cusFetch(url, method, data, resolve, reject) {

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(JSON.stringify(data))
    })
        .then(response => {

            if (response.status === 200) {
                resolve();
            } else {
                let msg = JSON.stringify({
                    'statusText': response.statusText,
                    'status': response.status,
                    'text': response.text()
                });
                alert("發生錯誤: " + msg);
                throw new Error(msg)
            }
        })
        .catch(error => {
            reject();
        });
}

export let LocalizationObj = {
    grouping: {
        groupedBy: '分類:',
        placeholder: '拖曳標題至此來分類'
    },
    pagination: {
        labelDisplayedRows: '{from}-{to} (共{count})',
        labelRowsPerPage: '每頁列數:',
        labelRowsSelect: '列每頁',

        firstAriaLabel: '第一頁',
        firstTooltip: '第一頁',
        previousAriaLabel: '上一頁',
        previousTooltip: '上一頁',
        nextAriaLabel: '下一頁',
        nextTooltip: '下一頁',
        lastAriaLabel: '最後一頁',
        lastTooltip: '最後一頁',
    },
    toolbar: {
        searchTooltip: '搜尋',
        searchPlaceholder: '搜尋',
        nRowsSelected: '{0} row(s) selected'
    },
    header: {
        actions: '功能'
    },
    body: {
        emptyDataSourceMessage: '沒有資料可顯示',
        filterRow: {
            filterTooltip: '過濾器'
        },
        addTooltip: '新增',
        deleteTooltip: '刪除',
        editTooltip: '修改',
        editRow: {
            deleteText: '你確定刪除此列嗎?',
            cancelTooltip: '取消',
            saveTooltip: '儲存',
        }
    }
};

