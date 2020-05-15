import React, { useState } from 'react'
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import * as Methods from '../../Methods'


export const ReceiptRowType = {
    View: 0,
    Add: 1,
    Modify: 2
}

export function ReceiptRow(props) {
    const [inputData, setInputData] = useState(props.inputData);
    const [rowType, setRowType] = useState(props.initRowType);
    const refreshTrigger = props.refreshTrigger;
    const baseUrl = "ReceiptInfo";

    let getUidForView = () => { };
    if (props.getUidForView != null) {
        getUidForView = props.getUidForView;
    }

    function postResolve() {
        alert("success");
    }
    function postReject() {
        alert("error");
    }
    function postData(data) {
        Methods.cusFetch(baseUrl, 'post', data, postResolve, postReject);
    }
    function patchData(data) {
        Methods.cusFetch(baseUrl, 'patch', data, postResolve, postReject);
    }
    //function handleItemChange(index, event) {
    //    Methods.cusFetch(baseUrl, 'delete', newData, resolve, reject)
    //}

    function handleItemChange(index, event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let newInputData = Object.assign({}, inputData);

        let newItems = [...newInputData.items];
        newItems[index][name] = value;

        newInputData.items = newItems;
        setInputData(newInputData);
    }
    function addItemClick() {
        let newInputData = Object.assign({}, inputData);

        let newItems = [{ uidForView: getUidForView(), productName: "", price: 0, productNumber: 1 }, ...newInputData.items];

        newInputData.items = newItems;
        setInputData(newInputData);
    }
    function removeItemClick(item) {
        let newInputData = Object.assign({}, inputData);

        let newItems = [...newInputData.items];

        newItems.splice(newItems.indexOf(item), 1);

        newInputData.items = newItems;
        setInputData(newInputData);
    }

    function addClick() {
    }
    function cancelClick() {
    }
    function deleteClick() {
    }
    

    function setRowTypeClick(rowType) {
        setRowType(rowType)
    }
    function isRowTypeEqualsView() {
        return rowType == ReceiptRowType.View;
    }


    function getTotal(item) {
        return item.price * item.productNumber;
    }
    function getTotalSum() {

        let sum = 0;
        for (let item of inputData.items) {
            sum += getTotal(item);
        }

        return sum;
    }


    return (
        <div style={{ maxWidth: '100%' }}>
            <Paper style={{ padding: "24px" }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>名稱</TableCell>
                                <TableCell style={{ width: "15%", minWidth: "100px" }}>單價</TableCell>
                                <TableCell style={{ width: "10px" }}></TableCell>
                                <TableCell style={{ width: "15%", minWidth: "100px" }}>數量</TableCell>
                                <TableCell style={{ width: "10px" }}></TableCell>
                                <TableCell style={{ width: "10%", minWidth: "120px" }}>總價</TableCell>
                                <TableCell style={{ width: "120px" }}>
                                    {isRowTypeEqualsView() ? (null) : (<button onClick={addItemClick}>新增項目</button>)}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {inputData.items.map((item, index) => (
                                <TableRow key={item.uidForView}>
                                    <TableCell component="th" scope="row">{index + 1}</TableCell>
                                    <TableCell>
                                        {isRowTypeEqualsView() ? (<React.Fragment>{item.productName}</React.Fragment>)
                                            : (<TextField name="productName" fullWidth defaultValue={item.productName} onChange={handleItemChange.bind(this, index)} />)}
                                    </TableCell>
                                    <TableCell>
                                        {isRowTypeEqualsView() ? (<React.Fragment>{item.price}</React.Fragment>)
                                            : (<TextField name="price" fullWidth type="number" defaultValue={item.price} onChange={handleItemChange.bind(this, index)} />)}
                                    </TableCell>
                                    <TableCell>*</TableCell>
                                    <TableCell>
                                        {isRowTypeEqualsView() ? (<React.Fragment>{item.productNumber}</React.Fragment>)
                                            : (<TextField name="productNumber" fullWidth type="number" defaultValue={item.productNumber} onChange={handleItemChange.bind(this, index)} />)}
                                    </TableCell>
                                    <TableCell>=</TableCell>
                                    <TableCell>{getTotal(item)}</TableCell>
                                    <TableCell>
                                        {isRowTypeEqualsView() ? (null) : (<button onClick={() => { removeItemClick(item); }}>移除</button>)}
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan={4}></TableCell>
                                <TableCell align="right">合計:</TableCell>
                                <TableCell></TableCell>
                                <TableCell>{getTotalSum()}</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={6}></TableCell>
                                <TableCell>
                                    {isRowTypeEqualsView() ? (null)
                                        : (<button onClick={addClick}>確定</button>)}</TableCell>
                                <TableCell>
                                    {isRowTypeEqualsView() ? (<button onClick={() => { ; }}>修改</button>)
                                        : (<button onClick={cancelClick}>取消</button>)}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>

                <div>
                    <div>
                        {rowType}
                    </div>
                    <button onClick={() => { setRowTypeClick(ReceiptRowType.View); }}>View</button>
                    <button onClick={() => { setRowTypeClick(ReceiptRowType.Modify); }}>Modify</button>
                </div>
            </Paper>
        </div>
    );
}