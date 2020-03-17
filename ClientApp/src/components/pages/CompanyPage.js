import React, { useState } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import { CusMetarialTable } from '../items/CusMetarialTable';
import * as Methods from '../../Methods'

export function CompanyPage() {
    const [showEdit, setShowEdit] = useState(false);

    const columns = [
        { title: '名稱', field: 'name', initialEditValue: '-', emptyValue: '' },
        {
            title: '地址', field: 'address', initialEditValue: '-', emptyValue: '',
            cellStyle: { width: '40%' },
            headerStyle: { width: '40%' }
        },
        { title: '電話', field: 'telephone', initialEditValue: '-', emptyValue: '' },
        { title: '傳真', field: 'fax', initialEditValue: '-', emptyValue: '' },
        { title: '', field: '__none__', editable: 'never' },
    ];
    const getTableData = (query, resolve, reject) => {

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
    };
    const editable = {
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
    };


    function editClick() {
        setShowEdit(!showEdit);
    }


    return (
        <div>
            <FormGroup row>
                <h2 style={{ paddingRight: "24px" }}>
                    公司
                </h2>
                <FormControlLabel
                    control={
                        <Switch checked={showEdit} onChange={editClick} />
                    }
                    label="修改模式"
                />
            </FormGroup>
            <br />
            {!showEdit && <CusMetarialTable title="公司資料" grouping={true} columns={columns} getTableData={getTableData}></CusMetarialTable>}
            {showEdit && <CusMetarialTable title="公司資料" columns={columns} getTableData={getTableData} editable={editable}></CusMetarialTable>}
        </div>
    );
}
