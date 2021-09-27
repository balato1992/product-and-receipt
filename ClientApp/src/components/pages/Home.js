import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

export function Home() {
    const [text, SetText] = useState("");

    const textChanged = (e) => {

        SetText(e.target.value);
    };

    function resThen(res) {

        res
            .then(response => {
                if (!response.ok) {
                    alert("上傳失敗, 錯誤碼: " + response.status);
                    console.log(response);
                    throw new Error('response not ok.');
                }
                return response.text();
            })
            .then(json => {
                alert("執行完成!");
                console.log(json);
            })
            .catch(error => {
                console.log("error msg: " + error);
            });
    }

    function postDBVersionClick() {
        let res = fetch("DBVersion", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(text)
        });

        resThen(res);
    }
    function backupClick() {
        let res = fetch("DBVersion", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify("2159")
        });

        resThen(res);
    }
    function getDBVersionClick() {
        let res = fetch("DBVersion", {
            method: "GET"
        });

        resThen(res);
    }
    function getGlobalInfo() {
        let res = fetch("GlobalInfo", {
            method: "GET"
        });

        resThen(res);
    }

    return (
        <div>
            <p>Welcome</p>
            <div><Button variant="outlined" size="small" onClick={backupClick} >手動備份</Button> </div>

            <div style={{ display: "none" }}>
                <div style={{ display: "flex" }}>
                    <div>DB Version </div>
                    <div><Button variant="outlined" size="small" onClick={getDBVersionClick} >Get</Button> </div>
                    <div><Button variant="outlined" size="small" onClick={postDBVersionClick} >Post</Button> </div>
                    <div><TextField fullWidth onChange={textChanged} /> </div>
                </div>
                <div style={{ display: "flex" }}>
                    <div>Global Info </div>
                    <div><Button variant="outlined" size="small" onClick={getGlobalInfo} >Get</Button> </div>
                </div>
            </div>
        </div>
    );
}
