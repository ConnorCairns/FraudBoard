import { useTheme } from '@material-ui/core';
import { Paper, TableCell, TableHead, TableContainer, Table, TableBody, TableRow } from '@mui/material';
import { useReducerContext } from "../../services/ReducerProvider";

const headCells = [
    {
        id: 'name',
        numeric: false,
        label: 'Category'
    },
    {
        id: 'cost',
        numeric: true,
        label: 'Total Spent ($)'
    },
    {
        id: 'datasetCount',
        numeric: true,
        label: 'Dataset Count'
    },
    {
        id: 'share',
        numeric: true,
        label: 'Spend difference from expected (%)'
    },

]

const PieChartExpandTable = () => {
    const [state,] = useReducerContext();
    const theme = useTheme();

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
                    {Object.keys(state.otherCategories).map(category => {
                        const difference = (((state.otherCategories[category].total_spent / state.allCategory[0].total_spent) - (state.otherCategories[category].count / state.allCategory[0].count)) * 100).toFixed(2)
                        return (< TableRow key={category} >
                            <TableCell>
                                {category}
                            </TableCell>
                            <TableCell align='right' sx={{ fontWeight: 600 }}>
                                {state.otherCategories[category].total_spent}
                            </TableCell>
                            <TableCell align='right' sx={{ fontWeight: 600 }}>
                                {state.otherCategories[category].count}
                            </TableCell>
                            <TableCell align='right' sx={{ fontWeight: 600, color: difference > 0 ? theme.palette.success.main : theme.palette.error.main }}>
                                {difference}
                            </TableCell>
                        </TableRow>)
                    })}
                </TableBody>
            </Table>
        </TableContainer >
    )
}

export default PieChartExpandTable