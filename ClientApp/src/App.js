import React from 'react';
import { Route } from 'react-router';

import { makeStyles } from '@material-ui/core/styles';

import { Layout } from './components/Layout';
import { Home } from './components/pages/Home';
import { CompanyPage } from './components/pages/CompanyPage';
import { MaterialPage } from './components/pages/MaterialPage';
import { ReceiptPage } from './components/pages/ReceiptPage';
import * as Methods from './Methods'
import './custom.css'


export default function App() {
    makeStyles({
        head: {
            fontWeight: 600,
        },
    }, { name: 'MuiTableCell' })();

    makeStyles({
        root: {
            backgroundColor: Methods.getMainBgcolor(),
        },
    }, { name: 'MuiTableHead' })();

    makeStyles({
        root: {
            whiteSpace: "nowrap",
        },
    }, { name: 'MuiButton' })();

    return (
        <Layout>
            <Route exact path='/' component={Home} />
            <Route path='/company-page' component={CompanyPage} />
            <Route path='/material-page' component={MaterialPage} />
            <Route path='/receipt-page' component={ReceiptPage} />
        </Layout>
    );
}
