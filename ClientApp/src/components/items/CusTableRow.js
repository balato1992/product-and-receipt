import React, { useState, useEffect } from 'react'

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputBase from '@material-ui/core/InputBase';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
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

import { CusAutoComplete } from './CusAutoComplete';
import * as Methods from '../../Methods';


export const RowDisplayType = {
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
const ReceiptItemActionType = {
    Handle: 0,
    Add: 1,
    Delete: 2
}

export const getColumnKey = function (column) {

    return column.title + "_" + column.field;
}

export function CusTableRow(props) {
    const style = props.style;
    const columns = props.columns;
    const displayType = props.displayType;
    const oriData = props.inputData;
    const usingReceiptDetail = props.usingReceiptDetail;
    const usingReceiptDetailProductNames = props.usingReceiptDetailProductNames;

    const confirmAction = props.confirmAction;
    const onRowSelected = props.onRowSelected;
    const onActionDone = props.onActionDone;

    const [changedData, setChangedData] = useState(Methods.jsonCopyObject(props.inputData));

    const [showReceiptDetail, setShowReceiptDetail] = useState(false);


    function splitStringToView(value) {
        if (value == null) {
            return null;
        }

        return value.split('\n').map((item, key) => {
            return <React.Fragment key={key}>{item}<br /></React.Fragment>
        });
    }
    function getView_TextField(isEditing, column, datum) {

        if (!isEditing) {
            switch (column.type) {
                case 'date':
                    return <InputBase type="datetime-local" value={datum[column.field]}
                        disabled className="color-black" />;
                case 'select':
                    return <React.Fragment>{column.selectList[datum[column.field]]}</React.Fragment>;
                case 'numeric':
                    return <React.Fragment>{datum[column.field]}</React.Fragment>;
                case 'file':
                    return <img src={datum[column.field]} height="36" style={{ border: (datum[column.field]) ? "2px black dashed" : "" }} />;
                default:
                    return splitStringToView(datum[column.field]);
            }
        }
        else {
            switch (column.type) {
                case 'date':
                    return <TextField fullWidth name={column.field} type="datetime-local"
                        defaultValue={datum[column.field]} onChange={handleChange} />;
                case 'select':
                    return <Select name={column.field} value={datum[column.field]} onChange={handleChange} >
                        {Object.keys(column.selectList).map(function (key) {
                            let name = column.selectList[key];

                            return <MenuItem key={key} value={key}>{name}</MenuItem>;
                        })}
                    </Select>;
                case 'numeric':
                    return <TextField fullWidth name={column.field} type="number"
                        defaultValue={datum[column.field]} onChange={handleChange} />;
                case 'file':
                    return <input name={column.field} type="file" accept=".bmp,.png"
                        defaultValue={datum[column.field]} onChange={handleChange} />;
                default:
                    return <TextField fullWidth multiline name={column.field}
                        defaultValue={datum[column.field]} onChange={handleChange} />;
            }
        }
    }
    function getView_Row() {
        let isEditing = displayType === RowDisplayType.Add || displayType === RowDisplayType.Modify;
        let isDeleting = displayType === RowDisplayType.Delete;
        let isDisabled = displayType === RowDisplayType.Disabled;

        let data = isEditing ? changedData : oriData;

        let nStyle = {};
        if (style) {
            nStyle = Methods.jsonCopyObject(style);
        }
        nStyle.opacity = isDisabled ? 0.4 : 1;

        return (
            <TableRow style={nStyle}>
                <TableCell>
                    {isEditing || isDeleting
                        ?
                        <React.Fragment>
                            <Button variant="outlined" size="small" startIcon={<CheckIcon />} disabled={isDisabled} onClick={confirmClick} >確定</Button>
                            &nbsp;
                            <Button variant="outlined" size="small" startIcon={<ClearIcon />} disabled={isDisabled} onClick={cancelClick} >取消</Button>
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
                        <TableCell colSpan={columns.length}>
                            是否刪除
                            <b>
                                {columns.map((item, index) => (
                                    <React.Fragment key={getColumnKey(item)}>
                                        {index === 0 ? "" : ","}{item.title}: {data[item.field]}
                                    </React.Fragment>
                                ))}
                            </b>?
                        </TableCell>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        {columns.map((column) => (
                            <TableCell key={getColumnKey(column)}>
                                {getView_TextField(isEditing, column, data)}
                            </TableCell>
                        ))}
                        {usingReceiptDetail &&
                            <React.Fragment>
                                <TableCell>
                                    {!isEditing && !isShowReceiptDetail() &&
                                        <InputBase value={getReceiptTotalSum(data.items)} disabled className="color-black" />
                                    }
                                </TableCell>
                                <TableCell>
                                    {!isEditing && <Button variant="outlined" size="small" startIcon={<FormatListBulletedIcon />} disabled={isDisabled}
                                        onClick={() => { setShowReceiptDetail(!showReceiptDetail); }} >詳細項目</Button>}
                                </TableCell>
                            </React.Fragment>
                        }
                    </React.Fragment>
                }
            </TableRow>
        );
    }


    function isShowReceiptDetail() {

        // 20200517 by Chad, turn showReceiptDetail to false when the row is disabled, maybe there has a better way to slove this
        if (displayType === RowDisplayType.Disabled) {
            setTimeout(() => {
                setShowReceiptDetail(false);
            }, 1);
        }

        return showReceiptDetail || getEditable();
    }
    function getReceiptTotal(item) {
        return item.price * item.productNumber;
    }
    function getReceiptTotalSum(arr) {

        let sum = 0;
        for (let item of arr) {
            sum += getReceiptTotal(item);
        }

        return sum;
    }
    function receiptItemActionClick(action, index, handleInfo) {

        let newInputData = Methods.jsonCopyObject(changedData);
        let newItems = [...newInputData.items];

        switch (action) {
            case ReceiptItemActionType.Handle:

                newItems[index][handleInfo.name] = handleInfo.value;
                break;
            case ReceiptItemActionType.Add:
                newItems.unshift({ uidForView: Methods.cusGetUidForView(), productName: "", price: 0, productNumber: 1 });
                break;
            case ReceiptItemActionType.Delete:
                newItems.splice(index, 1);
                break;

            default:
                alert("發生錯誤: 0011");
                break;
        }

        newInputData.items = newItems;
        setChangedData(newInputData);
    }
    function receiptItemActionClickHandle(index, name, value) {

        receiptItemActionClick(ReceiptItemActionType.Handle, index, {
            name: name,
            value: value
        });
    }


    function getView_ReceiptItemRow(isEditing) {
        let data = isEditing ? changedData : oriData;

        return <React.Fragment>
            {
                data.items.map((item, index) => (
                    <TableRow key={item.uidForView} style={{ backgroundColor: (index % 2 === 1) ? Methods.getBgcolor() : '' }}>
                        <TableCell>
                            {isEditing
                                ? (<React.Fragment>
                                    <CusAutoComplete
                                        value={item.productName}
                                        options={usingReceiptDetailProductNames}
                                        handler={(value) => {
                                            receiptItemActionClickHandle(index, 'productName', value)
                                        }}></CusAutoComplete>
                                </React.Fragment>)
                                : (<React.Fragment>{item.productName}</React.Fragment>)
                            }
                        </TableCell>
                        <TableCell>
                            {isEditing
                                ? (<TextField name="price" fullWidth type="number" defaultValue={item.price}
                                    onChange={(e) => { receiptItemActionClickHandle(index, e.target.name, e.target.value); }} />)
                                : (<React.Fragment>{item.price}</React.Fragment>)
                            }
                        </TableCell>
                        <TableCell>×</TableCell>
                        <TableCell>
                            {isEditing
                                ? (<TextField name="productNumber" fullWidth type="number" defaultValue={item.productNumber}
                                    onChange={(e) => { receiptItemActionClickHandle(index, e.target.name, e.target.value); }} />)
                                : (<React.Fragment>{item.productNumber}</React.Fragment>)
                            }
                        </TableCell>
                        <TableCell>=</TableCell>
                        <TableCell>{getReceiptTotal(item)}</TableCell>
                        <TableCell>
                            {isEditing && (<Button variant="outlined" size="small" startIcon={<HighlightOffIcon />}
                                onClick={() => { receiptItemActionClick(ReceiptItemActionType.Delete, index); }} >移除</Button>)}
                        </TableCell>
                    </TableRow>
                ))
            }
            <TableRow style={{ border: "0px" }}>
                <TableCell style={{ border: "0px" }} colSpan={3}></TableCell>
                <TableCell style={{ border: "0px" }} align="right">合計:</TableCell>
                <TableCell style={{ border: "0px" }}></TableCell>
                <TableCell style={{ border: "0px" }}>{getReceiptTotalSum(data.items)}</TableCell>
                <TableCell style={{ border: "0px" }}></TableCell>
            </TableRow>
        </React.Fragment>;
    }


    function getEditable() {
        return displayType === RowDisplayType.Add || displayType === RowDisplayType.Modify;
    }

    async function handleChange(event) {
        const target = event.target;
        let value = target.value;
        const name = target.name;

        if (target.files != null && target.files.length >= 0) {

            let file = target.files[0];

            const fileLoad = file => {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                })
            }

            const src = await fileLoad(file);

            alert("檔案設定成功");

            value = src;
        }

        let newData = Methods.jsonCopyObject(changedData);
        newData[name] = value;

        setChangedData(newData);
    }
    function updateClick() {
        setChangedData(Methods.jsonCopyObject(oriData));
        setShowReceiptDetail(false);
        if (onRowSelected) {
            onRowSelected(oriData, SelectedRowMode.ModifyMode);
        }
    }
    function deleteClick() {
        if (onRowSelected) {
            onRowSelected(oriData, SelectedRowMode.DeleteMode);
        }
    }
    function confirmClick() {
        if (confirmAction) {
            confirmAction(changedData, () => {
                cancelClick();
            });
        }
    }
    function cancelClick() {

        if (onRowSelected) {
            onRowSelected();
        }
        if (onActionDone) {
            onActionDone();
        }
    }

    return (
        <React.Fragment>
            {getView_Row()}
            {usingReceiptDetail && isShowReceiptDetail() &&
                <TableRow>
                    <TableCell>
                    </TableCell>
                    <TableCell colSpan={columns.length + 2}>
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
                                            {getEditable() && (<Button variant="outlined" size="small" startIcon={<AddCircleOutlineIcon />}
                                                onClick={() => { receiptItemActionClick(ReceiptItemActionType.Add); }} >新增項目</Button>)}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {getView_ReceiptItemRow(getEditable())}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TableCell>
                </TableRow>
            }
        </React.Fragment>
    );
}

