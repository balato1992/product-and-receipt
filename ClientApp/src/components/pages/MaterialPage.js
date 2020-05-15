import React, { useState } from 'react';

import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import { CusMetarialTable } from '../items/CusMetarialTable';
import * as Methods from '../../Methods'

export function MaterialPage() {
    const [showEdit, setShowEdit] = useState(false);
    const [lookupData, setLookupData] = useState({});
    const baseUrl = "MaterialInfo";

    const columns = [
        {
            title: '公司', field: 'companyUid', type: 'numeric', lookup: lookupData,
            cellStyle: {
                'textAlign': 'left'
            },
            headerStyle: {
                'textAlign': 'left'
            }
        },
        { title: '名稱', field: 'name', initialEditValue: '-', emptyValue: '' },
        { title: '規格1', field: 'spec1', initialEditValue: '-', emptyValue: '' },
        { title: '規格2', field: 'spec2', initialEditValue: '-', emptyValue: '' },
        { title: '類型', field: 'type', initialEditValue: '-', emptyValue: '' },
        { title: '單位', field: 'unit', initialEditValue: '-', emptyValue: '' },
        {
            title: '價格', field: 'price', type: 'numeric', initialEditValue: '0', emptyValue: '0',
            cellStyle: {
                'textAlign': 'left'
            },
            headerStyle: {
                'textAlign': 'left'
            }
        },
    ];
    const getTableData = (query, resolve, reject) => {

        fetch('companyInfo?pageSize=999999&pageIndex=0&searchText=')
            .then(response => response.json())
            .then(result => {

                let obj = {};
                for (let datum of result.data) {
                    obj[datum.uid] = datum.name;
                }
                setLookupData(obj);

                let url = baseUrl + '?pageSize=' + query.pageSize + '&pageIndex=' + query.page + '&searchText=' + query.search;
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
    };
    const editable = {
        onRowAdd: newData =>
            new Promise((resolve, reject) => {
                Methods.cusFetch(baseUrl, 'post', newData, resolve, reject);
            }),
        onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
                Methods.cusFetch(baseUrl, 'patch', newData, resolve, reject);
            }),
        onRowDelete: oldData =>
            new Promise((resolve, reject) => {
                Methods.cusFetch(baseUrl, 'delete', oldData.uid, resolve, reject);
            })
    };


    function editClick() {
        setShowEdit(!showEdit);
    }


    return (
        <div>
            <FormGroup row>
                <h2 style={{ paddingRight: "24px" }}>
                    產品
                </h2>
                <FormControlLabel
                    control={
                        <Switch checked={showEdit} onChange={editClick} />
                    }
                    label="修改模式"
                />
            </FormGroup>
            <br />
            {!showEdit && <CusMetarialTable title="產品資料" grouping={true} columns={columns} getTableData={getTableData}></CusMetarialTable>}
            {showEdit && <CusMetarialTable title="產品資料" columns={columns} getTableData={getTableData} editable={editable}></CusMetarialTable>}
        </div>
    );
}
