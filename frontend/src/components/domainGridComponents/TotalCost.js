import { Card, CardContent, Typography, Box, Avatar, CardActions, Collapse, Divider } from "@mui/material";
import { styled } from '@mui/material/styles';
import { useTheme } from '@material-ui/core';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import PaidIcon from '@mui/icons-material/Paid';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import { useState } from "react";
import CostTable from './CostTable';
import { useReducerContext } from "../../services/ReducerProvider";

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    margin: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const TotalCost = () => {
    const [state,] = useReducerContext()
    const [expanded, setExpanded] = useState(false)
    const theme = useTheme()

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent sx={{ pb: 0 }}>
                <Box sx={{ display: 'flex' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography color="textSecondary" variant="overline" gutterBottom sx={{ fontWeight: 600, letterSpacing: '0.5px', }}>
                            TOTAL SPENT
                        </Typography>
                        <Typography color="textPrimary" variant="h4" sx={{ fontWeight: 700 }}>
                            ${state.currDomain.total_spent}
                        </Typography>
                    </Box>
                    <Avatar
                        sx={{
                            backgroundColor: state.currDomain.total_spent < state.currCategory.average_cost ? theme.palette.error.main : theme.palette.success.main,
                            height: 56,
                            width: 56,
                            ml: 'auto'
                        }}
                    >
                        <PaidIcon />
                    </Avatar>
                </Box>
                <Box sx={{ pt: 1, display: 'flex', alignItems: 'center' }}>
                    {
                        state.currDomain.total_spent < state.currCategory.average_cost ?
                            <>
                                <Box sx={{ mr: 1, display: 'flex' }}>
                                    <ArrowDownwardIcon sx={{ color: theme.palette.error.main }} />
                                    <Typography sx={{ color: theme.palette.error.main }}>
                                        {((state.currCategory.average_cost - state.currDomain.total_spent) / state.currCategory.average_cost * 100).toFixed(2)}%
                                    </Typography>
                                </Box>
                                <Typography color="textSecondary" variant="caption">below category average</Typography>
                            </>
                            :
                            <>
                                <Box sx={{ mr: 1, display: 'flex' }}>
                                    <ArrowUpwardIcon sx={{ color: theme.palette.success.main }} />
                                    <Typography sx={{ color: theme.palette.success.main }}>
                                        {((state.currDomain.total_spent - state.currCategory.average_cost) / state.currCategory.average_cost * 100).toFixed(2)}%
                                    </Typography>
                                </Box>
                                <Typography color="textSecondary" variant="caption">above category average</Typography>
                            </>
                    }
                </Box>
            </CardContent>
            <CardActions sx={{ pt: 0 }}>
                <ExpandMore expand={expanded} onClick={() => setExpanded(!expanded)}>
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Divider />
                <CardContent>
                    <CostTable />
                </CardContent>
            </Collapse>
        </Card >
    )
}

export default TotalCost