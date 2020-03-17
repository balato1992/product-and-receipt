import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

function getUid() {
    return "u" + performance.now() + Math.random();
}


export function ReceiptPage() {
    const [items, setItems] = useState([
        { uid: getUid(), name: "test1", price: 11, count: 3 },
        { uid: getUid(), name: "test2", price: 1, count: 3 },
        { uid: getUid(), name: "test3", price: 2, count: 4 },
        { uid: getUid(), name: "test4", price: 6, count: 7 },
    ]);

    function handleChange(index, event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        let newItems = [...items];
        newItems[index][name] = value;

        setItems(newItems);
    }
    function addItemClick() {

        let newItems = [...items, { uid: getUid(), name: "", price: 0, count: 0 }];

        setItems(newItems);
    }
    function removeItemClick(item) {

        let newItems = [...items];

        newItems.splice(newItems.indexOf(item), 1);

        setItems(newItems);
    }
    function uploadClick() {

        console.log("--");
        console.log(items);
    }

    function getTotal(item) {
        return item.price * item.count;
    }
    function getTotalSum() {

        let sum = 0;
        for (let item of items) {
            sum += getTotal(item);
        }

        return sum;
    }

    return (
        <Paper style={{ padding: "24px" }}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>名稱</TableCell>
                            <TableCell style={{ width: "15%", minWidth: "70px" }}>單價</TableCell>
                            <TableCell style={{ width: "10px" }}></TableCell>
                            <TableCell style={{ width: "15%", minWidth: "70px" }}>數量</TableCell>
                            <TableCell style={{ width: "10px" }}></TableCell>
                            <TableCell style={{ width: "10%" }}>總價</TableCell>
                            <TableCell style={{ width: "100px" }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item, index) => (
                            <TableRow key={item.uid}>
                                <TableCell component="th" scope="row">{index}</TableCell>
                                <TableCell>
                                    <TextField name="name" fullWidth defaultValue={item.name} onChange={handleChange.bind(this, index)} />
                                </TableCell>
                                <TableCell>
                                    <TextField name="price" fullWidth  type="number" defaultValue={item.price} onChange={handleChange.bind(this, index)} />
                                </TableCell>
                                <TableCell>*</TableCell>
                                <TableCell>
                                    <TextField name="count" fullWidth  type="number" defaultValue={item.count} onChange={handleChange.bind(this, index)} />
                                </TableCell>
                                <TableCell>=</TableCell>
                                <TableCell>{getTotal(item)}</TableCell>
                                <TableCell><button onClick={() => { removeItemClick(item); }}>remove</button></TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell colSpan={2}><button onClick={addItemClick}>add</button></TableCell>
                            <TableCell></TableCell>
                            <TableCell align="right">合計:</TableCell>
                            <TableCell></TableCell>
                            <TableCell>{getTotalSum()}</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            <button onClick={uploadClick}>upload</button>
        </Paper>
    );
}
