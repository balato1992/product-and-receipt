import React from 'react'
import MaterialTable from 'material-table'

import * as Methods from '../../Methods'

export function CusMetarialTable(props) {
    let title = props.title;
    let grouping = props.grouping;
    let columns = props.columns;
    let getTableData = props.getTableData;
    let editable = props.editable;

    return (
        <div style={{ maxWidth: '100%' }}>
            <MaterialTable
                title={title}
                options={{
                    search: true,
                    addRowPosition: 'first',
                    rowStyle: rowData => ({
                        backgroundColor: (rowData.tableData.id % 2 === 1) ? '#EEE' : '#FFF'
                    }),
                    headerStyle: {
                        backgroundColor: Methods.getMainBgcolor()
                    },
                    grouping: grouping,
                    pageSize: 10
                    //tableLayout: 'fixed',
                }}

                columns={columns}
                data={query =>
                    new Promise((resolve, reject) => {

                        getTableData(query, resolve, reject);
                    })
                }
                editable={editable}

                localization={Methods.LocalizationObj}
            />
        </div>
    );
}