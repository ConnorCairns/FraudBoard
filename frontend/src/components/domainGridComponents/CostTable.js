import { Paper, TableCell, TableHead, TableContainer, Table, TableBody, TableRow } from '@mui/material';

const headCells = [
    {
        id: 'name',
        numeric: false,
        label: 'Type'
    },
    {
        id: 'cost',
        numeric: true,
        label: 'Cost ($)'
    },
    {
        id: 'share',
        numeric: true,
        label: 'Percent of Total (%)'
    },

]


const CostTable = ({ cost, domainCost, hostingCost, adCost }) => {

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    {headCells.map((headCell) => (
                        <TableCell key={headCell.id} align={headCell.numeric ? 'right' : 'left'} sx={{ fontWeight: 700 }}>
                            {headCell.label}
                        </TableCell>
                    ))}
                </TableHead>
                <TableBody>
                    <TableRow key='domainCost'>
                        <TableCell>
                            Domain
                        </TableCell>
                        <TableCell align='right' sx={{ fontWeight: 600 }}>
                            {domainCost}
                        </TableCell>
                        <TableCell align='right' sx={{ fontWeight: 600 }}>
                            {`${((domainCost / cost) * 100).toFixed(2)}`}
                        </TableCell>
                    </TableRow>
                    <TableRow key='hostingCost'>
                        <TableCell>
                            Hosting
                        </TableCell>
                        <TableCell align='right' sx={{ fontWeight: 600 }}>
                            {hostingCost}
                        </TableCell>
                        <TableCell align='right' sx={{ fontWeight: 600 }}>
                            {`${((hostingCost / cost) * 100).toFixed(2)}`}
                        </TableCell>
                    </TableRow>
                    <TableRow key='adCost'>
                        <TableCell>
                            Advertising
                        </TableCell>
                        <TableCell align='right' sx={{ fontWeight: 600 }}>
                            {adCost}
                        </TableCell>
                        <TableCell align='right' sx={{ fontWeight: 600 }}>
                            {`${((adCost / cost) * 100).toFixed(2)}`}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )

}

export default CostTable