import React, { useState, useEffect } from 'react'

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import AddBoxIcon from '@material-ui/icons/AddBox';

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

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

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

    function getFilteredRows() {
        let dataCount = tableData.length;

        let firstIndex = page * rowsPerPage;
        let lastIndex = firstIndex + rowsPerPage;

        let list = [];
        for (let i = firstIndex; i < lastIndex; i++) {

            if (i < dataCount) {
                let item = tableData[i];

                list.push(
                    <CusTableRow
                        key={item.uid}
                        columns={columns}
                        displayType={getRowType(item)}
                        inputData={item}
                        confirmAction={getAction()}
                        onRowSelected={onRowSelected} />);
            } else {
                list.push(
                    <TableRow key={"l_" + i} style={{ visibility: "hidden" }}>
                        <TableCell>
                            <Button size="small">-</Button>
                        </TableCell>
                    </TableRow>);
            }
        }

        return <React.Fragment>{list}</React.Fragment>;
    }

    const addClick = () => {

        if (!showAddItem) {
            let receipt = getNewData();
            setAddRowItem(receipt);
            onRowSelected(receipt, SelectedRowMode.AddMode);
            setShowAddItem(!showAddItem);
        } else {
            onRowSelected();
            setShowAddItem(!showAddItem);
        }
    }
    const onRowSelected = (rowData, mode) => {

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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell style={{ width: '190px' }}>
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
                    {getFilteredRows()}
                    <TableRow>
                        <TablePagination
                            count={tableData.length}
                            page={page}
                            onChangePage={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 15, 25, 50, 100]}
                        />
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}