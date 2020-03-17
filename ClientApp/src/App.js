import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';

import { Home } from './components/pages/Home';
import { CompanyPage } from './components/pages/CompanyPage';
import { MaterialPage } from './components/pages/MaterialPage';
import { ReceiptPage } from './components/pages/ReceiptPage';

import './custom.css'

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <Layout>
                <Route exact path='/' component={Home} />
                <Route path='/company-page' component={CompanyPage} />
                <Route path='/material-page' component={MaterialPage} />
                <Route path='/receipt-page' component={ReceiptPage} />
            </Layout>
        );
    }
}
