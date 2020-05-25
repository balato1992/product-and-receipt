import React, { useState } from 'react';
import FormGroup from '@material-ui/core/FormGroup';

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
        <div>
            <FormGroup row>
                <h2 style={{ paddingRight: "24px" }}>
                    公司
                </h2>
            </FormGroup>

            <CusTable columns={columns} getDataCallback={getDataCallback} editActions={editActions} ></CusTable>
        </div>
    );
}
