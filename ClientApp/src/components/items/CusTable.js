import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import ButtonBase from '@material-ui/core/ButtonBase';
import CircularProgress from '@material-ui/core/CircularProgress';
import Icon from '@material-ui/core/Icon';
import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import TextField from '@material-ui/core/TextField';

import AddBoxIcon from '@material-ui/icons/AddBox';
import SearchIcon from '@material-ui/icons/Search';

import { CusTableRow, SelectedRowMode, RowDisplayType, getColumnKey } from './CusTableRow';
import * as Methods from '../../Methods';


export const SortOrder = {
    None: 0,
    Asc: 1,
    Desc: 2
}

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

export function CusTable(props) {
    const classes = useStyles();

    const columns = props.columns;
    const getDataCallback = props.getDataCallback;
    const editActions = props.editActions;
    const usingReceiptDetail = props.usingReceiptDetail;
    const usingReceiptDetailProductNames = props.usingReceiptDetailProductNames;

    let getData = () => {
        if (getDataCallback) {
            setOpenBackdrop(true);
            getDataCallback((data) => {

                setOpenBackdrop(false);
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

    const [openBackdrop, setOpenBackdrop] = useState(false);

    useEffect(() => {
        getData();
    }, []);
    useEffect(() => {

        let data = Methods.jsonCopyObject(tableData);

        if (searchText && searchText !== "") {

            const checkContain = (searchText, value) => {

                value = String(value).toLowerCase();
                searchText = String(searchText).toLowerCase();

                return (value.indexOf(searchText) !== -1);
            };

            data = data.filter((datum) => {

                for (let column of columns) {

                    let value;
                    switch (column.type) {
                        case 'select':
                            value = column.selectList[datum[column.field]];
                            break;
                        default:
                            value = datum[column.field];
                            break;
                    }

                    if (checkContain(searchText, value)) {
                        return true;
                    }
                }

                if (usingReceiptDetail) {
                    for (let item of datum.items) {
                        let columns = ['productName', 'price', 'productNumber'];

                        for (let column of columns) {

                            if (checkContain(searchText, item[column])) {
                                return true;
                            }
                        }
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

                if (sortedFieldAndOrder.order === SortOrder.Desc) {
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
            let reject = (err) => {
                alert("上傳失敗, 訊息:" + err);
            };
            let alway = () => {
                setOpenBackdrop(false);
            };


            if (editActions) {
                if (selectedRowAndMode === undefined) {
                    alert("發生錯誤 0012");
                    return;
                }
                switch (selectedRowAndMode.mode) {
                    case SelectedRowMode.AddMode:
                        setOpenBackdrop(true);
                        return editActions.post(data, resolve, reject, alway);
                    case SelectedRowMode.ModifyMode:
                        setOpenBackdrop(true);
                        return editActions.patch(data, resolve, reject, alway);
                    case SelectedRowMode.DeleteMode:
                        setOpenBackdrop(true);
                        data = data.uid;
                        return editActions.delete(data, resolve, reject, alway);
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

            if (typeof column.initialEditValue === "function") {
                obj[column.field] = column.initialEditValue();
            } else {
                obj[column.field] = column.initialEditValue;
            }
        }
        if (usingReceiptDetail) {
            obj.items = [];
        }

        return obj;
    }
    function getRowType(data) {

        let currentType = RowDisplayType.View;
        if (selectedRowAndMode !== undefined) {

            if (selectedRowAndMode.rowData === data) {
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
                    default:
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
        let count = 0;
        for (let i = firstIndex; i < lastIndex; i++) {

            if (i < dataCount) {
                let item = filteredData[i];

                list.push(
                    <CusTableRow
                        style={{ backgroundColor: (++count % 2 === 0) ? Methods.getBgcolor() : '' }}
                        usingReceiptDetail={usingReceiptDetail}
                        usingReceiptDetailProductNames={usingReceiptDetailProductNames}
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
            && sortedFieldAndOrder.field === field) {

            if (sortedFieldAndOrder.order === SortOrder.Asc) {
                newOrder = SortOrder.Desc;
            }
            else if (sortedFieldAndOrder.order === SortOrder.Desc) {
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
    const handleChangeRowsPerPage = event => {
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
                            <TableCell></TableCell>
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
                                            && sortedFieldAndOrder.field === item.field
                                            && sortedFieldAndOrder.order !== SortOrder.None)
                                            ? ((sortedFieldAndOrder.order === SortOrder.Asc)
                                                ? <Icon>arrow_upward</Icon>
                                                : <Icon>arrow_downward</Icon>)
                                            : null}
                                    </ButtonBase>
                                </TableCell>
                            ))}
                            {usingReceiptDetail &&
                                <React.Fragment>
                                    <TableCell>合計</TableCell>
                                    <TableCell></TableCell>
                                </React.Fragment>
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {showAddItem &&
                            <CusTableRow
                                usingReceiptDetail={usingReceiptDetail}
                                usingReceiptDetailProductNames={usingReceiptDetailProductNames}
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

            <Backdrop className={classes.backdrop} open={openBackdrop}>
                <CircularProgress />
            </Backdrop>
        </Paper>
    );
}