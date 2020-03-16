import React from 'react';

import { CompanyTable } from './CompanyTable';
import { ProductTable } from './ProductTable';

export function CompanyPage() {
    return (
        <div>
            <h2>公司與產品</h2>
            <CompanyTable></CompanyTable>
            <ProductTable></ProductTable>
        </div>
    );
}
