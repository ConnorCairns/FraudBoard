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

const AVG = 23
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

const TotalCost = ({ cost, domainCost, hostingCost, adCost }) => {
    const [expanded, setExpanded] = useState(false)
    const theme = useTheme()

    console.log(cost)

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent sx={{ pb: 0 }}>
                <Box sx={{ display: 'flex' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography color="textSecondary" variant="overline" gutterBottom sx={{ fontWeight: 600, letterSpacing: '0.5px', }}>
                            TOTAL SPENT
                        </Typography>
                        <Typography color="textPrimary" variant="h4" sx={{ fontWeight: 700 }}>
                            ${cost}
                        </Typography>
                    </Box>
                    <Avatar
                        sx={{
                            backgroundColor: cost < AVG ? theme.palette.error.main : theme.palette.success.main,
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
                        cost < AVG ?
                            <>
                                <Box sx={{ mr: 1, display: 'flex' }}>
                                    <ArrowDownwardIcon sx={{ color: theme.palette.error.main }} />
                                    <Typography sx={{ color: theme.palette.error.main }}>
                                        {((AVG - cost) / AVG * 100).toFixed(2)}%
                                    </Typography>
                                </Box>
                                <Typography color="textSecondary">below average</Typography>
                            </>
                            :
                            <>
                                <Box sx={{ mr: 1, display: 'flex' }}>
                                    <ArrowUpwardIcon sx={{ color: theme.palette.success.main }} />
                                    <Typography sx={{ color: theme.palette.success.main }}>
                                        {((cost - AVG) / AVG * 100).toFixed(2)}%
                                    </Typography>
                                </Box>
                                <Typography color="textSecondary">above average</Typography>
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
                    <CostTable cost={cost} domainCost={domainCost} hostingCost={hostingCost} adCost={adCost} />
                </CardContent>
            </Collapse>
        </Card >
    )
}

export default TotalCost