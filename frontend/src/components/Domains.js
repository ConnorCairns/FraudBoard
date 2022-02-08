import { useTheme } from '@material-ui/core';
import { Paper, Typography } from '@mui/material';
import useFetch from '../hooks/useFetch.js';
import Title from './Title';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';

const columns = [
    { field: 'domain_name', headerName: 'Domain Name', flex: 1 },
    { field: 'creation_date', headerName: 'Registration Date', flex: 1 },
    { field: 'expiration_date', headerName: 'Expiration Date', flex: 1 },
    { field: 'registrar', headerName: 'Registrar', flex: 1 },
    { field: 'domain_cost', headerName: 'Amount Spent', flex: 1, align: 'right' },

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
                    'amount': `$${domain.domain_cost.N}`
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
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        getRowId={(row) => row.domain_name}
                        onRowClick={(row) => console.log(row)}
                        autoHeight
                        {...DataGridProps}
                    />
                    {/* <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Domain Name</TableCell>
                                <TableCell>Registration Date</TableCell>
                                <TableCell>Expiration Date</TableCell>
                                <TableCell>Registrar</TableCell>
                                <TableCell align="right">Amount Spent</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {domains.map((domain) => (
                                <DomainRow domainData={domain} key={domain.domain_name.S} />
                            ))}
                        </TableBody>
                    </Table> */}
                </>
                :
                <Typography>Loading ...</Typography>
            }
        </Paper>
    )
}

export default Domains