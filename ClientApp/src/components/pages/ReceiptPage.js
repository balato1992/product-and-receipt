import React from 'react';

import { CusTable } from '../items/CusTable';
import * as Methods from '../../Methods'

export function ReceiptPage() {
    const baseUrl = "ReceiptInfo";

/*
    public class ReceiptDatumWithUid
        public int Uid { get; set; }
    public class ReceiptDatum
        public string Id { get; set; }
        public string Payee { get; set; }
        public DateTime Date { get; set; }
        public List<ReceiptItemDatum> Items { get; set; }

    public class ReceiptItemDatum
        public string ProductName { get; set; }
        public decimal Price { get; set; }
        public decimal Number { get; set; }

 */
    function getDate() {
        let date = new Date();
        date.setHours(date.getHours() + 8);

        return date.toISOString().substr(0, 19);
    }

    let columns = [
        { title: '編號', field: 'id', initialEditValue: '-', emptyValue: '' },
        { title: '客戶名稱', field: 'payee', initialEditValue: '-', emptyValue: '' },
        { title: '日期', field: 'date', type: 'date', initialEditValue: getDate, emptyValue: '' },
        //{ title: '合計', field: 'items', type: 'select' },
    ];
    let getDataCallback = (callback) => {

        let url = baseUrl;

        Methods.cusFetchJson(url,
            (result) => {

                for (let datum of result) {

                    datum.uidForView = Methods.cusGetUidForView();

                    for (let item of datum.items) {
                        item.uidForView = Methods.cusGetUidForView();
                    }
                }
                callback(result);
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
        <div>
            <CusTable columns={columns} getDataCallback={getDataCallback} editActions={editActions} usingReceiptDetail={true}></CusTable>
        </div>
    );
}
