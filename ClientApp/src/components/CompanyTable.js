import React, { useState } from 'react'
import MaterialTable from 'material-table'

import * as Methods from '../Methods'

export function CompanyTable() {

    let diseditableObj = {
        use: false,
        editFuncs: {}
    };
    let editableObj = {
        use: true,
        editFuncs: {
            onRowAdd: newData =>
                new Promise((resolve, reject) => {
                    Methods.cusFetch('CompanyInfo', 'post', newData, resolve, reject);
                }),
            onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                    Methods.cusFetch('CompanyInfo', 'patch', newData, resolve, reject);
                }),
            onRowDelete: oldData =>
                new Promise((resolve, reject) => {
                    Methods.cusFetch('CompanyInfo', 'delete', oldData.uid, resolve, reject);
                })
        }
    };

    const [editInfo, setEditInfo] = useState(diseditableObj);

    function changeEditable() {

        setEditInfo((editInfo.use) ? diseditableObj : editableObj);
    }

    return (
        <div style={{ maxWidth: '100%' }}>
            <button onClick={changeEditable}>切換修改</button>
            <MaterialTable
                title="公司資料"
                options={{
                    search: true,
                    addRowPosition: 'first',
                    rowStyle: rowData => ({
                        backgroundColor: (rowData.tableData.id % 2 === 0) ? '#EEE' : '#FFF'
                    }),
                    pageSize: 10
                    //tableLayout: 'fixed',
                }}

                columns={[
                    { title: '名稱', field: 'name', initialEditValue: '-', emptyValue: '' },
                    {
                        title: '地址', field: 'address', initialEditValue: '-', emptyValue: '',
                        cellStyle: { width: '40%' },
                        headerStyle: { width: '40%' }
                    },
                    { title: '電話', field: 'telephone', initialEditValue: '-', emptyValue: '' },
                    { title: '傳真', field: 'fax', initialEditValue: '-', emptyValue: '' },
                    { title: '', field: '__none__', editable: 'never' },
                ]}
                data={query =>
                    new Promise((resolve, reject) => {

                        let url = 'CompanyInfo?pageSize=' + query.pageSize + '&pageIndex=' + query.page + '&searchText=' + query.search;

                        fetch(url)
                            .then(response => response.json())
                            .then(result => {
                                resolve({
                                    data: result.data,
                                    page: result.page,
                                    totalCount: result.total,
                                })
                            });
                    })
                }
                editable={editInfo.editFuncs}

                localization={Methods.LocalizationObj}
            />
        </div>
    );
}