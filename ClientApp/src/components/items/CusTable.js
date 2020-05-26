import React, { useState, useEffect } from 'react'

import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Icon from '@material-ui/core/Icon';

import AddBoxIcon from '@material-ui/icons/AddBox';
import SearchIcon from '@material-ui/icons/Search';

import { CusTableRow, SelectedRowMode, RowDisplayType, getColumnKey } from './CusTableRow';
import * as Methods from '../../Methods';


export const SortOrder = {
    None: 0,
    Asc: 1,
    Desc: 2
}

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
    const [searchText, setSearchText] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    const [addRowItem, setAddRowItem] = useState(getNewData());
    const [showAddItem, setShowAddItem] = useState(false);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [sortedFieldAndOrder, setSortedFieldAndOrder] = React.useState(undefined);

    useEffect(() => {
        getData();
    }, []);
    useEffect(() => {

        let data = Methods.jsonCopyObject(tableData);

        if (searchText && searchText != "") {

            data = data.filter((datum) => {

                for (let column of columns) {
                    let value = datum[column.field];

                    switch (column.type) {
                        case 'select':
                            value = column.selectList[datum[column.field]];
                            break;
                        default:
                            break;
                    }

                    value = String(value).toLowerCase();

                    if (value.indexOf(searchText.toLowerCase()) !== -1) {
                        return true;
                    }
                }
                return false;
            });
        }

        if (sortedFieldAndOrder && sortedFieldAndOrder.order !== SortOrder.None) {
            data.sort(function (a, b) {
                let field = sortedFieldAndOrder.field;

                let v1 = String(a[field]);
                let v2 = String(b[field]);

                if (sortedFieldAndOrder.order == SortOrder.Desc) {
                     v1 = String(b[field]);
                     v2 = String(a[field]);
                }

                if (v1 < v2) {
                    return -1;
                }
                else if (v2 > v1) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
        }

        cancelRowAdding();
        setFilteredData(data);
        resetPage(data.length);

    }, [tableData, searchText, sortedFieldAndOrder]);

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
    function cancelRowAdding() {

        onRowSelected();
        setShowAddItem(false);
    }
    function resetPage(length) {

        let firstIndex = page * rowsPerPage;
        let maxIndex = Math.max(length - 1, 0);

        if (firstIndex >= maxIndex) {

            let newPage = Math.floor(maxIndex / rowsPerPage);

            setPage(newPage);
        }
    }

    function getViewRows() {
        let dataCount = filteredData.length;

        let firstIndex = page * rowsPerPage;
        let lastIndex = firstIndex + rowsPerPage;

        let list = [];
        for (let i = firstIndex; i < lastIndex; i++) {

            if (i < dataCount) {
                let item = filteredData[i];

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
            setShowAddItem(true);
        } else {
            cancelRowAdding();
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
    const searchTextChanged = (e) => {

        setSearchText(e.target.value);
    };
    const headerClick = (field) => {

        let newOrder = SortOrder.Asc;

        if (sortedFieldAndOrder !== undefined
            && sortedFieldAndOrder.field == field) {

            if (sortedFieldAndOrder.order == SortOrder.Asc) {
                newOrder = SortOrder.Desc;
            }
            else if (sortedFieldAndOrder.order == SortOrder.Desc) {
                newOrder = SortOrder.None;
            }
        }

        setSortedFieldAndOrder({
            field: field,
            order: newOrder
        });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Paper>
            <TableContainer>
                <Table size="small">
                    <TableBody>
                        <TableRow>
                            <TableCell style={{ width: '100px' }}>
                                <Button variant="outlined" size="small" startIcon={<AddBoxIcon />} onClick={addClick} >新增</Button>
                            </TableCell>
                            <TableCell style={{ width: '260px' }}>
                                <TextField fullWidth placeholder="搜尋" onChange={searchTextChanged}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }} />
                            </TableCell>
                            <TableCell>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ width: '190px' }}>
                            </TableCell>
                            {columns.map((item) => (
                                <TableCell key={getColumnKey(item)}>
                                    <ButtonBase onClick={() => { headerClick(item.field); }}>
                                        <b>{item.title}</b>
                                        {(sortedFieldAndOrder !== undefined
                                            && sortedFieldAndOrder.field == item.field
                                            && sortedFieldAndOrder.order !== SortOrder.None)
                                            ? ((sortedFieldAndOrder.order == SortOrder.Asc)
                                                ? <Icon>arrow_upward</Icon>
                                                : <Icon>arrow_downward</Icon>)
                                            : null}
                                    </ButtonBase>
                                </TableCell>
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
                                onActionDone={() => { cancelRowAdding(); }}></CusTableRow>
                        }
                        {getViewRows()}
                        <TableRow>
                            <TablePagination
                                count={filteredData.length}
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
        </Paper>
    );
}