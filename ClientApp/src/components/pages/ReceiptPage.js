import React, { useState, useEffect } from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { ReceiptRow, ReceiptRowType } from '../items/ReceiptRow';
import * as Methods from '../../Methods'

export function ReceiptPage() {

    const [receipts, setReceipts] = useState([]);
    const [selectedRowAndMode, setSelectedRowAndMode] = useState(undefined);
    useEffect(() => {
        getDate();
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
    function getDate() {

        fetch('ReceiptInfo')
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

    function addClick() {

        let newReceipts = [{
            uidForView: Methods.cusGetUidForView(),
            id: "--",
            payee: 0,
            date: Date.now,
            items: []
        }, ...receipts];

        setReceipts(newReceipts);
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
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ minWidth: "120px" }}></TableCell>
                                <TableCell component="th" scope="row">編號</TableCell>
                                <TableCell component="th" scope="row">客戶名稱</TableCell>
                                <TableCell component="th" scope="row" style={{ minWidth: "100px" }}>日期</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {receipts.map((item, index) => (
                                <ReceiptRow
                                    key={item.uid} selectedRowAndMode={selectedRowAndMode} inputData={item}
                                    onSelectedRow={onSelectedRow} onConfirm={getDate}></ReceiptRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}
