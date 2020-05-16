import React, { useState } from 'react'

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import * as Methods from '../../Methods';


export const ReceiptRowType = {
    View: 0,
    Disabled: 1,
    Modify: 2
}
export const SelectedRowMode = {
    ModifyMode: 0
}
const ItemActionType = {
    Handel: 0,
    Add: 1,
    Delete: 2
}

export function ReceiptRow(props) {

    const oriData = props.inputData;
    const [changedData, setChangedData] = useState(Methods.jsonCopyObject(props.inputData));
    const selectedRowAndMode = props.selectedRowAndMode;
    const confirmAction = props.confirmAction;
    const onActionDone = props.onActionDone;
    const onSelectedRow = props.onSelectedRow;

    const [showDetail, setShowDetail] = useState(false);


    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        let newData = Methods.jsonCopyObject(changedData);
        newData[name] = value;

        setChangedData(newData);
    }
    function itemActionClick(action, index, event) {

        let newInputData = Methods.jsonCopyObject(changedData);
        let newItems = [...newInputData.items];

        switch (action) {
            case ItemActionType.Handel:
                const target = event.target;
                const value = target.value;
                const name = target.name;

                newItems[index][name] = value;
                break;
            case ItemActionType.Add:
                newItems.unshift({ uidForView: Methods.cusGetUidForView(), productName: "", price: 0, productNumber: 1 });
                break;
            case ItemActionType.Delete:
                newItems.splice(index, 1);
                break;

            case ItemActionType.Delete:
                alert("發生錯誤: 0011");
                break;
        }

        newInputData.items = newItems;
        setChangedData(newInputData);
    }


    function updateClick() {
        setChangedData(Methods.jsonCopyObject(oriData));
        setShowDetail(false);
        onSelectedRow(oriData, SelectedRowMode.ModifyMode);
    }
    function updateConfirmClick() {
        confirmAction(changedData, () => {
            finishAction();
        });
    }
    function finishAction() {

        onSelectedRow();
        if (onActionDone) {
            onActionDone();
        }
    }

    function checkRowType(type) {

        let currentType = ReceiptRowType.View;
        if (selectedRowAndMode != undefined && selectedRowAndMode.mode == SelectedRowMode.ModifyMode) {

            if (selectedRowAndMode.rowData == oriData) {
                currentType = ReceiptRowType.Modify;
            } else {
                currentType = ReceiptRowType.Disabled;
            }
        }

        return currentType == type;
    }
    function getCompleteShowDetail() {
        return showDetail || checkRowType(ReceiptRowType.Modify);
    }


    function getTotal(item) {
        return item.price * item.productNumber;
    }
    function getTotalSum(arr) {

        let sum = 0;
        for (let item of arr) {
            sum += getTotal(item);
        }

        return sum;
    }

    function getView_HeaderRow(editable, disabled) {
        let data = !editable ? oriData : changedData;

        return <TableRow>
            <TableCell>
                {!editable
                    ?
                    <div>
                        <button onClick={updateClick} disabled={disabled} >修改</button>
                    </div>
                    :
                    <div>
                        <button onClick={updateConfirmClick}>確定</button>
                        <button onClick={finishAction}>取消</button>
                    </div>
                }
            </TableCell>
            <TableCell>
                {editable
                    ? <TextField name="id" defaultValue={data.id} onChange={(e) => { handleChange(e); }} />
                    : <React.Fragment>{data.id}</React.Fragment>
                }
            </TableCell>
            <TableCell>
                {editable
                    ? <TextField name="payee" defaultValue={data.payee} onChange={(e) => { handleChange(e); }} />
                    : <React.Fragment>{data.payee}</React.Fragment>
                }
            </TableCell>
            <TableCell>
                {editable
                    ? <TextField name="date" type="datetime" defaultValue={data.date} onChange={(e) => { handleChange(e); }} />
                    : <React.Fragment>{data.date}</React.Fragment>
                }
            </TableCell>
            <TableCell>
                {!editable && !getCompleteShowDetail() &&
                    <React.Fragment>
                        合計: {getTotalSum(data.items)}
                    </React.Fragment>
                }
            </TableCell>
            <TableCell>
                {!editable && <button onClick={() => { setShowDetail(!showDetail); }} >Detail</button>}
            </TableCell>
        </TableRow>;
    }
    function getView_ItemRow(data, editable) {
        return <React.Fragment>
            {
                data.items.map((item, index) => (
                    <TableRow key={item.uidForView}>
                        <TableCell>
                            {editable
                                ? (<TextField name="productName" fullWidth defaultValue={item.productName} onChange={(e) => { itemActionClick(ItemActionType.Handel, index, e); }} />)
                                : (<React.Fragment>{item.productName}</React.Fragment>)
                            }
                        </TableCell>
                        <TableCell>
                            {editable
                                ? (<TextField name="price" fullWidth type="number" defaultValue={item.price} onChange={(e) => { itemActionClick(ItemActionType.Handel, index, e); }} />)
                                : (<React.Fragment>{item.price}</React.Fragment>)
                            }
                        </TableCell>
                        <TableCell>×</TableCell>
                        <TableCell>
                            {editable
                                ? (<TextField name="productNumber" fullWidth type="number" defaultValue={item.productNumber} onChange={(e) => { itemActionClick(ItemActionType.Handel, index, e); }} />)
                                : (<React.Fragment>{item.productNumber}</React.Fragment>)
                            }
                        </TableCell>
                        <TableCell>=</TableCell>
                        <TableCell>{getTotal(item)}</TableCell>
                        <TableCell>
                            {editable && (<button onClick={() => { itemActionClick(ItemActionType.Delete, index); }}>移除</button>)}
                        </TableCell>
                    </TableRow>
                ))
            }
            <TableRow>
                <TableCell colSpan={3}></TableCell>
                <TableCell align="right">合計:</TableCell>
                <TableCell></TableCell>
                <TableCell>{getTotalSum(data.items)}</TableCell>
                <TableCell></TableCell>
            </TableRow>
        </React.Fragment>;
    }

    return (
        <React.Fragment>
            {
                getView_HeaderRow(checkRowType(ReceiptRowType.Modify), checkRowType(ReceiptRowType.Disabled))
            }
            {getCompleteShowDetail() &&
                <TableRow>
                    <TableCell>
                    </TableCell>
                    <TableCell colSpan={5}>
                        <TableContainer>
                            <Table size="small">
                            <TableHead>
                            <TableRow>
                                        <TableCell>名稱</TableCell>
                                        <TableCell style={{ width: "15%" }}>單價</TableCell>
                                        <TableCell style={{ width: "10px" }}></TableCell>
                                        <TableCell style={{ width: "15%" }}>數量</TableCell>
                                        <TableCell style={{ width: "10px" }}></TableCell>
                                        <TableCell style={{ width: "10%" }}>總價</TableCell>
                                        <TableCell style={{ width: "120px" }}>
                                            {checkRowType(ReceiptRowType.Modify) && (<button onClick={() => { itemActionClick(ItemActionType.Add); }}>新增項目</button>)}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        checkRowType(ReceiptRowType.Modify)
                                            ? getView_ItemRow(changedData, true)
                                            : getView_ItemRow(oriData, false)
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TableCell>
                </TableRow>
            }
        </React.Fragment>
    );
}