import { Typography } from '@mui/material';
import { useTheme } from '@material-ui/core';

const Title = ({ title }) => {
    const theme = useTheme()

    return (
        <Typography component="h2" variant="h6" color={theme.palette.info.main} gutterBottom>{title}</Typography>
    )
}

export default Title