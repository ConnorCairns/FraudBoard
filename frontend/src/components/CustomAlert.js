import { Box, Alert, Collapse, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';


const CustomAlert = ({ severity, message, open, onClick }) => {
    return (
        <Box sx={{ width: '100%', mb: '0.5rem' }}>
            <Collapse in={open}>
                <Alert severity={severity} action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => onClick()}>
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }>
                    {message}
                </Alert>
            </Collapse>
        </Box>
    )
}

export default CustomAlert