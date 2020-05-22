import React, { useState } from 'react'

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputBase from '@material-ui/core/InputBase';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import * as Methods from '../../Methods';


export const ReceiptRowTypeForView = {
    View: 0,
    Disabled: 1,
    Add: 2,
    Modify: 3,
    Delete: 4
}
export const SelectedRowMode = {
    AddMode: 0,
    ModifyMode: 1,
    DeleteMode: 2
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
    function deleteClick() {
        onSelectedRow(oriData, SelectedRowMode.DeleteMode);
    }
    function confirmClick() {
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

        let currentType = ReceiptRowTypeForView.View;
        if (selectedRowAndMode != undefined) {

            if (selectedRowAndMode.rowData == oriData) {
                switch (selectedRowAndMode.mode) {
                    case SelectedRowMode.AddMode:
                        currentType = ReceiptRowTypeForView.Add;
                        break;
                    case SelectedRowMode.ModifyMode:
                        currentType = ReceiptRowTypeForView.Modify;
                        break;
                    case SelectedRowMode.DeleteMode:
                        currentType = ReceiptRowTypeForView.Delete;
                        break;
                }
            } else {
                currentType = ReceiptRowTypeForView.Disabled;
            }
        }

        return currentType == type;
    }
    function getEditable() {
        return checkRowType(ReceiptRowTypeForView.Add) || checkRowType(ReceiptRowTypeForView.Modify);
    }
    function getCompleteShowDetail() {

        // 20200517 by Chad, turn showDetail to false when the row is disabled, maybe there has a better way to slove this
        if (checkRowType(ReceiptRowTypeForView.Disabled)) {
            setTimeout(() => {
                setShowDetail(false);
            }, 1);
        }

        return showDetail || getEditable();
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

    function getView_Row() {
        let isEditing = getEditable();
        let isDeleting = checkRowType(ReceiptRowTypeForView.Delete);
        let isDisabled = checkRowType(ReceiptRowTypeForView.Disabled);

        let opacity = isDisabled ? 0.4 : 1;
        let data = isEditing ? changedData : oriData;

        return (
            <TableRow style={{ opacity: opacity }}>
                <TableCell>
                    {isEditing || isDeleting
                        ?
                        <React.Fragment>
                            <Button variant="outlined" size="small" startIcon={<CheckIcon />} disabled={isDisabled} onClick={confirmClick} >確定</Button>
                            &nbsp;
                            <Button variant="outlined" size="small" startIcon={<ClearIcon />} disabled={isDisabled} onClick={finishAction} >取消</Button>
                        </React.Fragment>
                        :
                        <React.Fragment>
                            <Button variant="outlined" size="small" startIcon={<EditIcon />} disabled={isDisabled} onClick={updateClick} >修改</Button>
                            &nbsp;
                            <Button variant="outlined" size="small" startIcon={<DeleteIcon />} disabled={isDisabled} onClick={deleteClick} >刪除</Button>
                        </React.Fragment>
                    }
                </TableCell>
                {(isDeleting)
                    ?
                    <React.Fragment>
                        <TableCell colSpan={5}>
                            是否刪除 <b>編號: {data.id}, 客戶名稱: {data.payee}, 日期: {data.date}</b>?
                        </TableCell>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <TableCell>
                            {isEditing
                                ? <TextField name="id" defaultValue={data.id} onChange={(e) => { handleChange(e); }} />
                                : <InputBase value={data.id} disabled className="color-black" />
                            }
                        </TableCell>
                        <TableCell>
                            {isEditing
                                ? <TextField name="payee" defaultValue={data.payee} onChange={(e) => { handleChange(e); }} />
                                : <InputBase value={data.payee} disabled className="color-black" />
                            }
                        </TableCell>
                        <TableCell>
                            {isEditing
                                ? <TextField name="date" type="datetime-local" defaultValue={data.date} onChange={(e) => { handleChange(e); }} />
                                : <InputBase type="datetime-local" value={data.date} disabled className="color-black" />
                            }
                        </TableCell>
                        <TableCell>
                            {!isEditing && !getCompleteShowDetail() &&
                                <InputBase value={"合計: " + getTotalSum(data.items)} disabled className="color-black" />
                            }
                        </TableCell>
                        <TableCell>
                            {!isEditing && <Button variant="outlined" size="small" startIcon={<FormatListBulletedIcon />} disabled={isDisabled} onClick={() => { setShowDetail(!showDetail); }} >詳細項目</Button>}
                        </TableCell>
                    </React.Fragment>
                }
            </TableRow>
        );
    }
    function getView_ItemRow(isEditing) {
        let data = isEditing ? changedData : oriData;

        return <React.Fragment>
            {
                data.items.map((item, index) => (
                    <TableRow key={item.uidForView}>
                        <TableCell>
                            {isEditing
                                ? (<TextField name="productName" fullWidth defaultValue={item.productName} onChange={(e) => { itemActionClick(ItemActionType.Handel, index, e); }} />)
                                : (<React.Fragment>{item.productName}</React.Fragment>)
                            }
                        </TableCell>
                        <TableCell>
                            {isEditing
                                ? (<TextField name="price" fullWidth type="number" defaultValue={item.price} onChange={(e) => { itemActionClick(ItemActionType.Handel, index, e); }} />)
                                : (<React.Fragment>{item.price}</React.Fragment>)
                            }
                        </TableCell>
                        <TableCell>×</TableCell>
                        <TableCell>
                            {isEditing
                                ? (<TextField name="productNumber" fullWidth type="number" defaultValue={item.productNumber} onChange={(e) => { itemActionClick(ItemActionType.Handel, index, e); }} />)
                                : (<React.Fragment>{item.productNumber}</React.Fragment>)
                            }
                        </TableCell>
                        <TableCell>=</TableCell>
                        <TableCell>{getTotal(item)}</TableCell>
                        <TableCell>
                            {isEditing && (<Button variant="outlined" size="small" startIcon={<HighlightOffIcon />} onClick={() => { itemActionClick(ItemActionType.Delete, index); }} >移除</Button>)}
                        </TableCell>
                    </TableRow>
                ))
            }
            <TableRow style={{ border: "0px" }}>
                <TableCell style={{ border: "0px" }} colSpan={3}></TableCell>
                <TableCell style={{ border: "0px" }} align="right">合計:</TableCell>
                <TableCell style={{ border: "0px" }}></TableCell>
                <TableCell style={{ border: "0px" }}>{getTotalSum(data.items)}</TableCell>
                <TableCell style={{ border: "0px" }}></TableCell>
            </TableRow>
        </React.Fragment>;
    }

    return (
        <React.Fragment>
            {getView_Row()}
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
                                        <TableCell></TableCell>
                                        <TableCell style={{ width: "15%" }}>數量</TableCell>
                                        <TableCell></TableCell>
                                        <TableCell style={{ width: "10%" }}>總價</TableCell>
                                        <TableCell>
                                            {getEditable() && (<Button variant="outlined" size="small" startIcon={<AddCircleOutlineIcon />} onClick={() => { itemActionClick(ItemActionType.Add); }} >新增項目</Button>)}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {getView_ItemRow(getEditable())}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TableCell>
                </TableRow>
            }
        </React.Fragment>
    );
}