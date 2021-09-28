import React, { useState, useEffect } from 'react';

import { CusTable } from '../items/CusTable';
import * as Methods from '../../Methods'

export function MaterialPage() {
    const baseUrl = "MaterialInfo";
    const [tableColumns, setTableColumns] = useState([]);

    let getDataCallback = (callback) => {

        let query = {
            pageSize: 99999999,
            page: 0,
            search: "",
        };
        let url = baseUrl + '?'
            + 'pageSize=' + query.pageSize
            + '&pageIndex=' + query.page + '&searchText=' + query.search;
        Methods.cusFetchJson(url,
            (result) => {
                callback(result.data);
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

    useEffect(() => {
        Methods.cusFetchJson('companyInfo?pageSize=999999&pageIndex=0&searchText=',
            result => {
                if (result.data.length > 0) {

                    let companies = {};
                    for (let datum of result.data) {

                        companies[datum.uid] = datum.name;
                    }

                    let firstItemUid = result.data[0].uid;

                    setTableColumns([
                        {
                            title: '公司', field: 'companyUid', type: 'select', selectList: companies,
                            initialEditValue: firstItemUid, emptyValue: firstItemUid
                        },
                        { title: '名稱', field: 'name', initialEditValue: '-', emptyValue: '' },
                        { title: '規格1', field: 'spec1', initialEditValue: '-', emptyValue: '' },
                        { title: '規格2', field: 'spec2', initialEditValue: '-', emptyValue: '' },
                        { title: '類型', field: 'type', initialEditValue: '-', emptyValue: '' },
                        { title: '單位', field: 'unit', initialEditValue: '-', emptyValue: '' },
                        {
                            title: '價格', field: 'price', type: 'numeric',
                            initialEditValue: '0', emptyValue: '0'
                        },
                        {
                            title: '圖片', field: 'image', type: 'file',
                            initialEditValue: null, emptyValue: null, hideWhenDeleting: true
                        },
                    ]);
                }
            });
    }, []);

    return (
        <React.Fragment>
            <h2>產品</h2>
            {(tableColumns.length <= 0)
                ?
                <React.Fragment>無公司資料，請於公司頁面新增</React.Fragment>
                :
                <CusTable columns={tableColumns} getDataCallback={getDataCallback} editActions={editActions} ></CusTable>
            }
        </React.Fragment>
    );
}

