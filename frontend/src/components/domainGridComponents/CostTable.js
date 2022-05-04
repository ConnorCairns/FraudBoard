import { Paper, TableCell, TableHead, TableContainer, Table, TableBody, TableRow, Collapse, Box, Typography, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { useReducerContext } from '../../services/ReducerProvider';
import baseUrl from '../../utils/url';
import { useNavigate } from 'react-router-dom';


const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton size='small' {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    margin: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const CostTable = ({ headCells, tableData, titleRef }) => {
    const cols = headCells.map(headCell => headCell.id)
    const [expanded, setExpanded] = useState(false);
    const [state, dispatch] = useReducerContext();
    const [registrars, setRegistrars] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        if (expanded === true) {
            fetch(`${baseUrl}get_registrars?registrar=${state.currDomain.registrar}`)
                .then(response => response.json())
                .then(data => {
                    //Slice to stay consistent between domains
                    setRegistrars(data.filter(registrar => registrar.domain_name !== state.currDomain.domain_name).slice(0, 3))
                })
        } else {
            setRegistrars(null)
        }
    }, [expanded])

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
                        tableData.map((row) => {
                            if (row.key === 'registrar') {
                                return (
                                    <>
                                        <TableRow key={row.key} sx={{ '& > *': { borderBottom: 'unset' } }}>
                                            <TableCell key={`${row.key}-${row.colKey}`} align='left' sx={{ fontWeight: 400 }}>
                                                {row.colKey}
                                            </TableCell>
                                            <TableCell key="registrarVal" align='left' sx={{ fontWeight: 400, display: 'flex', alignItems: 'center', borderBottom: 'unset' }}>
                                                {row.value}
                                                <ExpandMore expand={expanded} onClick={() => setExpanded(!expanded)} sx={{ ml: 'auto', mr: 0, float: 'right' }}>
                                                    <ExpandMoreIcon />
                                                </ExpandMore>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow key={`1-${row.key}`}>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                <Collapse in={expanded} timeout="auto" unmountOnExit>
                                                    <Box sx={{ margin: 1, p: 1 }}>
                                                        <Typography variant="h6" gutterBottom component="div">
                                                            Other domains on same registrar
                                                        </Typography>
                                                        {
                                                            registrars !== null ?
                                                                <List>
                                                                    {registrars.map((registrar, idx) => (
                                                                        <>
                                                                            <ListItem key={`${registrar.domain_name}-${idx}`} disablePadding>
                                                                                <ListItemButton onClick={() => {
                                                                                    dispatch({ type: 'updateDomainHistory', payload: registrar.domain_name })
                                                                                    titleRef.current.scrollIntoView({ behavior: 'smooth' })
                                                                                    setExpanded(false)
                                                                                    navigate(`/domains/${registrar.domain_name}`)
                                                                                }}>
                                                                                    <ListItemText primary={registrar.domain_name} />
                                                                                </ListItemButton>
                                                                            </ListItem>
                                                                            {(idx !== registrars.length - 1) &&
                                                                                <Divider />
                                                                            }
                                                                        </>
                                                                    ))}
                                                                </List> :
                                                                <>
                                                                    Loading ...
                                                                </>
                                                        }
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </>

                                )
                            }

                            return (
                                <TableRow key={row.key}>
                                    {cols.map((col, idx) =>
                                        <TableCell key={`${col}-${row[col]}`} align={headCells[idx].numeric ? 'right' : 'left'} sx={{ fontWeight: headCells[idx].numeric ? 600 : 400 }}>
                                            {row[col]}
                                        </TableCell>
                                    )}
                                </TableRow>)
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )

}

export default CostTable