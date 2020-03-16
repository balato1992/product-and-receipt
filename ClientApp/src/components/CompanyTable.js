import React from 'react'
import MaterialTable from 'material-table'

import * as Methods from '../Methods'

export function CompanyTable() {


    return (
        <div style={{ maxWidth: '100%' }}>
            <MaterialTable
                title="公司"
                options={{
                    search: true,
                    addRowPosition: 'first',
                    rowStyle: rowData => ({
                        backgroundColor: (rowData.tableData.id % 2 == 0) ? '#EEE' : '#FFF'
                    }),
                    //tableLayout: 'fixed'
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
                editable={{
                    onRowAdd: newData =>
                        new Promise((resolve, reject) => {
                            Methods.cusFetch('post', newData, resolve, reject);
                        }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            Methods.cusFetch('patch', newData, resolve, reject);
                        }),
                    onRowDelete: oldData =>
                        new Promise((resolve, reject) => {
                            Methods.cusFetch('delete', oldData.uid, resolve, reject);
                        })
                }}

                localization={Methods.LocalizationObj}
            />
        </div>
    );
}