import React, { useState, useEffect } from 'react';
import { CompanyItem } from './CompanyItem';

import LinearProgress from '@material-ui/core/LinearProgress';

export function CompanyPage() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    async function fetchData(url, isRtnJson, method = 'get', postData = null) {
        setLoading(true);

        let requestInif = null;
        if (method !== 'get') {
            requestInif = {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(postData)
            };
        }

        const response = await fetch(url, requestInif);
        console.log("res: " +url);

        if (!response.ok) {
            var error = {
                'statusText': response.statusText,
                'status': response.status,
                'text': response.text()
            }
            setLoading(false);
            alert("發生錯誤:" + JSON.stringify(error));
            return null;
        } else {
            var data = null;
            if (isRtnJson) {
                data = await response.json();
            }
            setLoading(false);
            return data;
        }
    }

    async function getCompany() {
        console.log("getCompany");

        const data = await fetchData('company', true);
        if (data !== null) {
            console.log(data);
            var data2 = JSON.parse(JSON.stringify(data));
            setCompanies(data2);
        }
    }
    async function handleEditDone(company) {

        if (company.uid === undefined) {
            // post
            console.log("post");
            await fetchData('company', false, 'post', JSON.stringify(company));
        } else {
            // patch
            console.log("patch");
            await fetchData('company', false, 'patch', JSON.stringify(company));
        }
        await getCompany();
    }

    useEffect(() => {
        getCompany();
    }, []);

    function renderCompaniesTable(companies) {
        return (
            <table className='table table-striped' aria-labelledby="tabelLabel">
                <thead>
                    <tr>
                        <th>名稱</th>
                        <th>地址</th>
                        <th>電話</th>
                        <th>傳真</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <CompanyItem initCanEdit={true} onEditDone={handleEditDone} />
                    {companies.map(company =>
                        <CompanyItem key={company.uid} company={company} initCanEdit={false} onEditDone={handleEditDone} />
                    )}
                </tbody>
            </table>
        );
    }


    return (
        <div>
            <button onClick={getCompany}>test</button>
            <h1 id="tabelLabel" >公司</h1>
            {loading ? <LinearProgress /> : renderCompaniesTable(companies)}
        </div>
    );
}
