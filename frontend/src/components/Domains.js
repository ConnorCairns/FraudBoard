import { useTheme } from '@material-ui/core';
import { Paper, Typography, Box } from '@mui/material';
import useFetch from '../hooks/useFetch.js';
import Title from './Title';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import SettingsPanel from './SettingsPanel.js';
import { useDemoData } from '@mui/x-data-grid-generator';

const formatEmails = (emails) => {
    if (Array.isArray(emails)) {
        console.log(unmarshall(emails))
        return unmarshall(emails)
    } else {
        return emails
    }

}

// const columns = [
//     { field: 'domain_name', headerName: 'Domain Name', flex: 1, minWidth: 280 },
//     { field: 'domain_cost', headerName: 'Domain Cost', flex: 1, minWidth: 100, align: 'right', valueFormatter: ({ value }) => `$${value}` },
//     { field: 'hosting_cost', headerName: 'Hosting Cost', flex: 1, minWidth: 100, align: 'right', valueFormatter: ({ value }) => `$${value}` },
//     { field: 'total_spent', headerName: 'Total Spent', flex: 1, minWidth: 100, align: 'right', valueFormatter: ({ value }) => `$${value}` },
//     { field: 'creation_date', headerName: 'Registration Date', flex: 1, minWidth: 170 },
//     { field: 'expiration_date', headerName: 'Expiration Date', flex: 1, minWidth: 170 },
//     { field: 'registrar', headerName: 'Registrar', flex: 1, minWidth: 150, overflow: 'auto' },
//     { field: 'address', headerName: 'Address', flex: 1, minWidth: 300 },
//     { field: 'city', headerName: 'City', flex: 1, minWidth: 150 },
//     { field: 'country', headerName: 'Country', flex: 1, minWidth: 150 },
//     { field: 'state', headerName: 'State', flex: 1, minWidth: 200 },
//     { field: 'zipcode', headerName: 'Zipcode', flex: 1, minWidth: 100 },
//     { field: 'dnssec', headerName: 'dnssec', flex: 1, minWidth: 100 },
//     {
//         field: 'emails', headerName: 'Emails', flex: 1, minWidth: 100, valueFormatter: ({ emails }) => {
//             if (Array.isArray(emails)) {
//                 console.log(unmarshall(emails))
//                 return unmarshall(emails)
//             } else {
//                 return emails
//             }
//         }
//     },
//     { field: 'name', headerName: 'Name', flex: 1, minWidth: 100 },
//     { field: 'name_servers', headerName: 'Name Servers', flex: 1, minWidth: 100 },
//     { field: 'org', headerName: 'Org', flex: 1, minWidth: 100 },

// ]

const columns = [
    { field: 'domain_name', headerName: 'Domain Name', flex: 1 },
    { field: 'registrar', headerName: 'Registrar', flex: 1, overflow: 'auto' },
    { field: 'city', headerName: 'City', flex: 0.8 },
    { field: 'country', headerName: 'Country', flex: 0.5 },
    { field: 'domain_cost', headerName: 'Domain Cost', flex: 1, align: 'right', valueFormatter: ({ value }) => `$${value}` },
    { field: 'hosting_cost', headerName: 'Hosting Cost', flex: 1, align: 'right', valueFormatter: ({ value }) => `$${value}` },
    { field: 'total_spent', headerName: 'Total Spent', flex: 1, align: 'right', valueFormatter: ({ value }) => `$${value}` },

]

const unmarshall = (output) => {
    return output.map((item => {
        let newObj = {}

        for (var key in item) {
            newObj[key] = Object.values(item[key])[0]
        }

        return newObj

    }))
}

const Domains = ({ title = "Domains", DataGridProps, reqLimit = 5 }) => {
    const URL = `http://localhost:4000/get-domains?limit=${reqLimit}`
    const [status, domains] = useFetch(URL)
    const [rows, setRows] = useState();

    // const [type, setType] = useState('Commodity');
    // const [size, setSize] = useState(100);

    // const { loading, data, setRowLength, loadNewData } = useDemoData({
    //     dataSet: type,
    //     rowLength: size,
    //     maxColumns: 40,
    //     editable: true,
    // });

    // const [pagination, setPagination] = useState({
    //     pagination: false,
    //     autoPageSize: false,
    //     pageSize: undefined,
    // });
    // const handleApplyClick = (settings) => {
    //     if (size !== settings.size) {
    //         setSize(settings.size);
    //     }

    //     if (type !== settings.type) {
    //         setType(settings.type);
    //     }

    //     if (size !== settings.size || type !== settings.type) {
    //         setRowLength(settings.size);
    //         loadNewData();
    //     }

    //     const newPaginationSettings = {
    //         pagination: settings.pagesize !== -1,
    //         autoPageSize: settings.pagesize === 0,
    //         pageSize: settings.pagesize > 0 ? settings.pagesize : undefined,
    //     };

    //     setPagination((currentPaginationSettings) => {
    //         if (
    //             currentPaginationSettings.pagination === newPaginationSettings.pagination &&
    //             currentPaginationSettings.autoPageSize ===
    //             newPaginationSettings.autoPageSize &&
    //             currentPaginationSettings.pageSize === newPaginationSettings.pageSize
    //         ) {
    //             return currentPaginationSettings;
    //         }
    //         return newPaginationSettings;
    //     });
    // };

    useEffect(() => {
        if (status === 'fetched') {
            let test = unmarshall(domains)
            console.log(test)
            let rows = domains.map((domain) => {
                return {
                    'domainName': domain.domain_name.S,
                    'registrationDate': domain.creation_date.S,
                    'expirationDate': domain.expiration_date.S,
                    'registar': domain.registrar.S,
                    'amount': `$${domain.domain_cost.N}`,
                }
            })
            setRows(test)
        }

    }, [status, domains])

    const theme = useTheme()

    return (
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', mt: '0.5rem' }}>
            <Title title={title} />
            {rows != undefined ?
                <>
                    {/* <Box sx={{
                        display: 'flex', flexDirection: 'column', width: '100%', height: 600, '& .MuiFormGroup-options': {
                            alignItems: 'center',
                            paddingBottom: theme.spacing(0.1),
                            '& > div': {
                                minWidth: 100,
                                margin: theme.spacing(0.1),
                                marginLeft: 0,
                            }
                        }
                    }}>
                        <SettingsPanel onApply={handleApplyClick}
                            size={size}
                            type={type} /> */}
                    <DataGrid
                        // {...data}
                        // components={{
                        //     Toolbar: GridToolbar,
                        // }}
                        // loading={loading}
                        // checkboxSelection
                        // disableSelectionOnClick
                        // rowThreshold={0}
                        // initialState={{
                        //     ...data.initialState,
                        //     pinnedColumns: { left: ['__check__', 'desk'] },
                        // }}
                        // {...pagination}
                        rows={rows}
                        columns={columns}
                        getRowId={(row) => row.domain_name}
                        onRowClick={(row) => console.log(row)}
                        autoHeight
                        rowsPerPageOptions={[5, 10, 100]}
                        {...DataGridProps}
                    />
                    {/* </Box> */}
                </>
                :
                <Typography>Loading ...</Typography>
            }
        </Paper >
    )
}

export default Domains