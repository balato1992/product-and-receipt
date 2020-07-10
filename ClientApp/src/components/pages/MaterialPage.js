import React, { useState } from 'react';

import { CusTable } from '../items/CusTable';
import * as Methods from '../../Methods'

export function MaterialPage() {
    const baseUrl = "MaterialInfo";
    const [columns, setColumns] = useState([]);

    let getDataCallback = (callback) => {

        let query = {
            pageSize: 99999999,
            page: 0,
            search: "",
        };

        Methods.cusFetchJson('companyInfo?pageSize=999999&pageIndex=0&searchText=',
            result => {
                let firstItem = result.data[0];
                let obj = {};
                for (let datum of result.data) {

                    obj[datum.uid] = datum.name;
                }
                setColumns([
                    { title: '公司', field: 'companyUid', type: 'select', selectList: obj, initialEditValue: firstItem.uid, emptyValue: firstItem.uid },
                    { title: '名稱', field: 'name', initialEditValue: '-', emptyValue: '' },
                    { title: '規格1', field: 'spec1', initialEditValue: '-', emptyValue: '' },
                    { title: '規格2', field: 'spec2', initialEditValue: '-', emptyValue: '' },
                    { title: '類型', field: 'type', initialEditValue: '-', emptyValue: '' },
                    { title: '單位', field: 'unit', initialEditValue: '-', emptyValue: '' },
                    { title: '價格', field: 'price', type: 'numeric', initialEditValue: '0', emptyValue: '0' },
                ]);

                let url = baseUrl + '?pageSize=' + query.pageSize + '&pageIndex=' + query.page + '&searchText=' + query.search;
                Methods.cusFetchJson(url,
                    (result2) => {
                        callback(result2.data);
                    });
            });
    };
    let editActions = {
        post: (data, resolve, reject, alway) => {

            Methods.cusFetch(baseUrl, "post", data, resolve, reject, alway);
        },
        patch: (data, resolve, reject, alway) => {

            Methods.cusFetch(baseUrl, "patch", data, resolve, reject, alway);
        },
        delete: (data, resolve, reject, alway) => {

            Methods.cusFetch(baseUrl, "delete", data, resolve, reject, alway);
        },
    };


    return (
        <React.Fragment>
            <h2>產品</h2>
            <CusTable columns={columns} getDataCallback={getDataCallback} editActions={editActions} ></CusTable>
        </React.Fragment>
    );
}
