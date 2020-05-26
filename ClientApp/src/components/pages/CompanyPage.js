import React from 'react';

import { CusTable } from '../items/CusTable';
import * as Methods from '../../Methods'

export function CompanyPage() {

    let columns = [
        { title: '名稱', field: 'name', initialEditValue: '-', emptyValue: '' },
        { title: '地址', field: 'address', initialEditValue: '-', emptyValue: '' },
        { title: '電話', field: 'telephone', initialEditValue: '-', emptyValue: '' },
        { title: '傳真', field: 'fax', initialEditValue: '-', emptyValue: '' },
    ];
    let getDataCallback = (callback) => {

        let query = {
            pageSize: 99999999,
            page: 0,
            search: "",
        };
        let url = 'CompanyInfo?pageSize=' + query.pageSize + '&pageIndex=' + query.page + '&searchText=' + query.search;

        fetch(url)
            .then(response => response.json())
            .then(result => {

                callback(result.data);
            });
    };
    let editActions = {
        post: (data, resolve, reject) => {

            Methods.cusFetch("CompanyInfo", "post", data, resolve, reject);
        },
        patch: (data, resolve, reject) => {

            Methods.cusFetch("CompanyInfo", "patch", data, resolve, reject);
        },
        delete: (data, resolve, reject) => {

            Methods.cusFetch("CompanyInfo", "delete", data, resolve, reject);
        },
    };

    return (
        <React.Fragment>
            <h2>公司</h2>
            <CusTable columns={columns} getDataCallback={getDataCallback} editActions={editActions} ></CusTable>
        </React.Fragment>
    );
}
