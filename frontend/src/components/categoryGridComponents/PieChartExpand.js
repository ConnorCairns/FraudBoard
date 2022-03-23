import { CardContent, CardActions, Collapse, Divider } from "@mui/material";
import { useState } from "react";
import { styled } from '@mui/material/styles';
import { useTheme } from "@material-ui/core";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import PieChartExpandTable from "./PieChartExpandTable";

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

const PieChartExpand = () => {
    const [expanded, setExpanded] = useState(false);
    const theme = useTheme();

    return (
        <>
            <CardActions sx={{ pt: 0 }}>
                <ExpandMore expand={expanded} onClick={() => setExpanded(!expanded)}>
                    <ExpandMoreIcon />
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Divider />
                <CardContent>
                    <PieChartExpandTable />
                </CardContent>
            </Collapse>
        </>
    )
}

export default PieChartExpand