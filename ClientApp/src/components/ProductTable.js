import React, { useState } from 'react'
import MaterialTable from 'material-table'

import * as Methods from '../Methods'

export function ProductTable() {

    let diseditableObj = {
        use: false,
        editFuncs: {}
    };
    let editableObj = {
        use: true,
        editFuncs: {
            onRowAdd: newData =>
                new Promise((resolve, reject) => {
                    Methods.cusFetch('ProductInfo', 'post', newData, resolve, reject);
                }),
            onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                    Methods.cusFetch('ProductInfo', 'patch', newData, resolve, reject);
                }),
            onRowDelete: oldData =>
                new Promise((resolve, reject) => {
                    Methods.cusFetch('ProductInfo', 'delete', oldData.uid, resolve, reject);
                })
        }
    };

    const [editInfo, setEditInfo] = useState(diseditableObj);
    const [lookupData, setLookupData] = useState({});

    function changeEditable() {

        setEditInfo((editInfo.use) ? diseditableObj : editableObj);
    }

    return (
        <div style={{ maxWidth: '100%' }}>
            <button onClick={changeEditable}>切換修改</button>
            <MaterialTable
                title="產品資料"
                options={{
                    search: true,
                    addRowPosition: 'first',
                    rowStyle: rowData => ({
                        backgroundColor: (rowData.tableData.id % 2 === 1) ? '#EEE' : '#FFF'
                    }),
                    headerStyle: {
                        backgroundColor: '#bbdefb'
                    },
                    pageSize: 10
                    //tableLayout: 'fixed',
                }}

                columns={[
                    { title: '名稱', field: 'name', initialEditValue: '-', emptyValue: '' },
                    { title: '規格1', field: 'spec1', initialEditValue: '-', emptyValue: '' },
                    { title: '規格2', field: 'spec2', initialEditValue: '-', emptyValue: '' },
                    { title: '類型', field: 'type', initialEditValue: '-', emptyValue: '' },
                    { title: '單位', field: 'unit', initialEditValue: '-', emptyValue: '' },
                    { title: '價格', field: 'price', type: 'numeric', initialEditValue: '0', emptyValue: '0' },
                    { title: '公司', field: 'companyUid', type: 'numeric', lookup: lookupData },
                    { title: '', field: '__none__', editable: 'never' },
                ]}
                data={query =>
                    new Promise((resolve, reject) => {

                        fetch('CompanyInfo?pageSize=9999&pageIndex=0&searchText=')
                            .then(response => response.json())
                            .then(result => {

                                let obj = {};

                                for (let datum of result.data) {
                                    obj[datum.uid] = datum.name;
                                }
                                console.log(obj);
                                setLookupData(obj);


                                let url = 'ProductInfo?pageSize=' + query.pageSize + '&pageIndex=' + query.page + '&searchText=' + query.search;
                                fetch(url)
                                    .then(response => response.json())
                                    .then(result => {
                                        resolve({
                                            data: result.data,
                                            page: result.page,
                                            totalCount: result.total,
                                        })
                                    });
                            });

                    })
                }
                editable={editInfo.editFuncs}

                localization={Methods.LocalizationObj}
            />
        </div>
    );
}