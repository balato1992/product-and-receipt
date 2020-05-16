import React, { useState, useEffect } from 'react';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { ReceiptRow, SelectedRowMode } from '../items/ReceiptRow';
import * as Methods from '../../Methods'

export function ReceiptPage() {


    const [receipts, setReceipts] = useState([]);
    const [selectedRowAndMode, setSelectedRowAndMode] = useState(undefined);

    const [addRowItem, setAddRowItem] = useState(getNewReceipt());
    const [showAddItem, setShowAddItem] = useState(false);

    const baseUrl = "ReceiptInfo";

    useEffect(() => {
        getData();
    }, []);

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
    function getData() {

        fetch(baseUrl)
            .then(response => response.json())
            .then(result => {

                for (let datum of result) {

                    datum.uidForView = Methods.cusGetUidForView();

                    for (let item of datum.items) {
                        item.uidForView = Methods.cusGetUidForView();
                    }
                }
                setReceipts(result);
                console.log(result);
            });
    };
    function getDataAction(method) {

        return (data, doneFunc) => {
            Methods.cusFetch(baseUrl, method, data,
                () => {
                    alert("上傳成功");

                    doneFunc();
                    getData();
                },
                () => {
                    alert("上傳失敗");
                });
        };
    }

    function getNewReceipt() {
        return {
            id: "",
            payee: "",
            date: new Date().toUTCString(),
            items: []
        };
    }

    function addClick() {

        if (!showAddItem) {
            let receipt = getNewReceipt();
            setAddRowItem(receipt);
            onSelectedRow(receipt, SelectedRowMode.ModifyMode);
        }

        setShowAddItem(!showAddItem);
    }
    function onSelectedRow(rowData, mode) {

        if (rowData !== undefined
            && mode !== undefined
            && (selectedRowAndMode === undefined || selectedRowAndMode.rowData !== rowData)
        ) {
            setSelectedRowAndMode({
                rowData: rowData,
                mode: mode
            });
        } else {
            setSelectedRowAndMode(undefined);
        }
    }

    return (
        <div>
            <button onClick={addClick}>新增收據紀錄</button>

            <div style={{ maxWidth: '100%' }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ minWidth: "120px" }}></TableCell>
                                <TableCell>編號</TableCell>
                                <TableCell>客戶名稱</TableCell>
                                <TableCell style={{ minWidth: "100px" }}>日期</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {showAddItem &&
                                <ReceiptRow selectedRowAndMode={selectedRowAndMode} inputData={addRowItem}
                                    confirmAction={getDataAction('post')}
                                    onActionDone={() => { setShowAddItem(false); }}
                                    onSelectedRow={onSelectedRow} ></ReceiptRow>
                            }
                            {receipts.map((item, index) => (
                                <ReceiptRow
                                    key={item.uid} selectedRowAndMode={selectedRowAndMode} inputData={item}
                                    confirmAction={getDataAction('patch')}
                                    onSelectedRow={onSelectedRow} ></ReceiptRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}
