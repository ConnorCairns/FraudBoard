import { Paper, TableCell, TableHead, TableContainer, Table, TableBody, TableRow } from '@mui/material';
import { useReducerContext } from "../../services/ReducerProvider";

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


const CostTable = () => {
    const [state,] = useReducerContext()

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow key='head'>
                        {headCells.map((headCell) => (
                            <TableCell key={headCell.id} align={headCell.numeric ? 'right' : 'left'} sx={{ fontWeight: 700 }}>
                                {headCell.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow key='domainCost'>
                        <TableCell>
                            Domain
                        </TableCell>
                        <TableCell align='right' sx={{ fontWeight: 600 }}>
                            {state.currDomain.domain_cost}
                        </TableCell>
                        <TableCell align='right' sx={{ fontWeight: 600 }}>
                            {`${((state.currDomain.domain_cost / state.currDomain.total_spent) * 100).toFixed(2)}`}
                        </TableCell>
                    </TableRow>
                    <TableRow key='hostingCost'>
                        <TableCell>
                            Hosting
                        </TableCell>
                        <TableCell align='right' sx={{ fontWeight: 600 }}>
                            {state.currDomain.hosting_cost}
                        </TableCell>
                        <TableCell align='right' sx={{ fontWeight: 600 }}>
                            {`${((state.currDomain.hosting_cost / state.currDomain.total_spent) * 100).toFixed(2)}`}
                        </TableCell>
                    </TableRow>
                    <TableRow key='adCost'>
                        <TableCell>
                            Advertising
                        </TableCell>
                        <TableCell align='right' sx={{ fontWeight: 600 }}>
                            {state.currDomain.advertising_spend}
                        </TableCell>
                        <TableCell align='right' sx={{ fontWeight: 600 }}>
                            {`${((state.currDomain.advertising_spend / state.currDomain.total_spent) * 100).toFixed(2)}`}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )

}

export default CostTable