import { Box, Alert, Collapse, IconButton, Button, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';


const CustomAlert = ({ severity, message, open, onClick, view = null }) => {

    return (
        <Box sx={{ width: '100%', mb: '0.5rem', display: open ? 'block' : 'contents' }}>
            <Collapse sx={{ alignItems: 'center' }} in={open}>
                <Alert sx={{ alignItems: 'center', display: 'flex', textAlign: 'center' }} severity={severity} action={
                    view ?
                        <Button size="small" sx={{ ml: 2, float: 'right' }} onClick={view} color="inherit">View</Button>
                        :
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => onClick()}>
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                }>
                    <Typography variant="body">{message}</Typography>
                </Alert>
            </Collapse>
        </Box>
    )
}

export default CustomAlert