import { Paper, TableCell, TableHead, TableContainer, Table, TableBody, TableRow } from '@mui/material';
import { useReducerContext } from "../../services/ReducerProvider";

// const headCells = [
//     {
//         id: 'name',
//         numeric: false,
//         label: 'Type'
//     },
//     {
//         id: 'cost',
//         numeric: true,
//         label: 'Cost ($)'
//     },
//     {
//         id: 'share',
//         numeric: true,
//         label: 'Percent of Total (%)'
//     },

// ]


const CostTable = ({ headCells, tableData }) => {
    const [state,] = useReducerContext()

    const cols = headCells.map(headCell => headCell.id)

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
                    {
                        tableData.map((row) => (
                            <TableRow key={row.key}>
                                {cols.map((col, idx) => (
                                    <TableCell align={headCells[idx].numeric ? 'right' : 'left'} sx={{ fontWeight: headCells[idx].numeric ? 600 : 400 }}>
                                        {row[col]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )

}

export default CostTable