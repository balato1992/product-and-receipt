import React, { useState, useEffect } from 'react'

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddBoxIcon from '@material-ui/icons/AddBox';

import * as Methods from '../../Methods'
import { CusTableRow, SelectedRowMode, RowDisplayType, getColumnKey } from './CusTableRow';

export function CusTable(props) {
    let columns = props.columns;
    let getDataCallback = props.getDataCallback;
    let editActions = props.editActions;

    let getData = () => {
        if (getDataCallback) {
            getDataCallback((data) => {

                setTableData(data);
            });
        }
    };

    const [tableData, setTableData] = useState([]);
    const [selectedRowAndMode, setSelectedRowAndMode] = useState(undefined);

    const [addRowItem, setAddRowItem] = useState(getNewData());
    const [showAddItem, setShowAddItem] = useState(false);


    useEffect(() => {
        getData();
    }, []);

    function getAction() {
        return (data, doneFunc) => {

            let resolve = () => {
                //alert("上傳成功");
                doneFunc();
                getData();
            };
            let reject = () => {
                alert("上傳失敗");
            };


            if (editActions) {
                if (selectedRowAndMode === undefined) {
                    alert("發生錯誤 0012");
                    return;
                }
                switch (selectedRowAndMode.mode) {
                    case SelectedRowMode.AddMode:
                        return editActions.post(data, resolve, reject);
                    case SelectedRowMode.ModifyMode:
                        return editActions.patch(data, resolve, reject);
                    case SelectedRowMode.DeleteMode:
                        data = data.uid;
                        return editActions.delete(data, resolve, reject);
                    default:
                        alert("發生錯誤 0013");
                        return () => { };
                }
            }
        };
    }
    function getNewData() {

        let obj = {};

        for (let column of columns) {
            obj[column.field] = column.initialEditValue;
        }

        return obj;
    }
    function getRowType(data) {

        let currentType = RowDisplayType.View;
        if (selectedRowAndMode != undefined) {

            if (selectedRowAndMode.rowData == data) {
                switch (selectedRowAndMode.mode) {
                    case SelectedRowMode.AddMode:
                        currentType = RowDisplayType.Add;
                        break;
                    case SelectedRowMode.ModifyMode:
                        currentType = RowDisplayType.Modify;
                        break;
                    case SelectedRowMode.DeleteMode:
                        currentType = RowDisplayType.Delete;
                        break;
                }
            } else {
                currentType = RowDisplayType.Disabled;
            }
        }

        return currentType;
    }

    function addClick() {

        if (!showAddItem) {
            let receipt = getNewData();
            setAddRowItem(receipt);
            onRowSelected(receipt, SelectedRowMode.AddMode);
        }

        setShowAddItem(!showAddItem);
    }
    function onRowSelected(rowData, mode) {

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
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Button variant="outlined" size="small" startIcon={<AddBoxIcon />} onClick={addClick} >新增</Button>
                        </TableCell>
                        {columns.map((item) => (
                            <TableCell key={getColumnKey(item)}>{item.title}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {showAddItem &&
                        <CusTableRow
                            columns={columns}
                            displayType={getRowType(addRowItem)}
                            inputData={addRowItem}
                            confirmAction={getAction()}
                            onRowSelected={onRowSelected}
                            onActionDone={() => { setShowAddItem(false); }}></CusTableRow>
                    }
                    {tableData.map((item) => (
                        <CusTableRow
                            key={item.uid}
                            columns={columns}
                            displayType={getRowType(item)}
                            inputData={item}
                            confirmAction={getAction()}
                            onRowSelected={onRowSelected}></CusTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}