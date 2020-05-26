import React, { useState } from 'react'

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

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

export const getColumnKey = function (column) {

    return column.title + "_" + column.field;
}

export function CusTableRow(props) {
    const columns = props.columns;
    const displayType = props.displayType;
    const oriData = props.inputData;

    const confirmAction = props.confirmAction;
    const onRowSelected = props.onRowSelected;
    const onActionDone = props.onActionDone;

    const [changedData, setChangedData] = useState(Methods.jsonCopyObject(props.inputData));

    function getView_Row() {
        let isEditing = displayType == RowDisplayType.Add || displayType == RowDisplayType.Modify;
        let isDeleting = displayType == RowDisplayType.Delete;
        let isDisabled = displayType == RowDisplayType.Disabled;

        let data = isEditing ? changedData : oriData;

        return (
            <TableRow style={{ opacity: isDisabled ? 0.4 : 1 }}>
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
                                        {index == 0 ? "" : ","}{item.title}: {data[item.field]}
                                    </React.Fragment>
                                ))}
                            </b>?
                        </TableCell>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        {columns.map((item, index) => (
                            <TableCell key={getColumnKey(item)}>
                                {isEditing
                                    ? <TextField fullWidth name={item.field} defaultValue={data[item.field]} onChange={handleChange} inputProps={{size: 6}} />
                                    : <React.Fragment>{data[item.field]}</React.Fragment>
                                }
                            </TableCell>
                        ))}
                    </React.Fragment>
                }
            </TableRow>
        );
    }


    function handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        let newData = Methods.jsonCopyObject(changedData);
        newData[name] = value;

        setChangedData(newData);
    }
    function updateClick() {
        setChangedData(Methods.jsonCopyObject(oriData));
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
        </React.Fragment>
    );
}

