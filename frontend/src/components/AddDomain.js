import { Paper, TextField, Box, Alert } from "@mui/material";
import { LoadingButton } from '@mui/lab';
import Title from './Title';
import { useState } from "react";
import CustomAlert from './CustomAlert';


const AddDomain = () => {
    const [loading, setLoading] = useState();
    const [url, setURL] = useState("");
    const [open, setOpen] = useState(false);
    const [openInfo, setOpenInfo] = useState(false);
    const [openError, setOpenError] = useState(false);

    const handleClick = () => {
        setLoading(true)
        setOpen(false)

        fetch('http://localhost:4000/add-domain', {
            crossDomain: true,
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({ "URL": url }),
        })
            .then(response => {
                if (response.ok) {
                    setURL("")
                    setOpen(true)
                    setLoading(false)
                } else if (response.status == 409) {
                    setURL("")
                    setOpenInfo(true)
                    setLoading(false)
                } else {
                    setOpenError(true)
                    setLoading(false)
                }
            })
    }

    return (
        <>
            <CustomAlert severity="success" message="Successfully added domain" open={open} onClick={() => setOpen(false)} />
            <CustomAlert severity="info" message="Domain already exists in database" open={openInfo} onClick={() => setOpenInfo(false)} />
            <CustomAlert severity="error" message="Something went wrong" open={openError} onClick={() => setOpenError(false)} />
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <Box component="form" onSubmit={e => { e.preventDefault(); handleClick() }} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Title title="Add Domain" />
                    <TextField value={url} disabled={loading} onChange={(e) => setURL(e.target.value)} fullWidth size="small" variant="outlined" autoComplete="url" placeholder="Domain to add" type="text" />
                    <LoadingButton sx={{ ml: 'auto', mt: '0.5rem' }} onClick={handleClick} loading={loading} variant="contained">Submit
                    </LoadingButton>
                </Box>
            </Paper>
        </>
    )
}

export default AddDomain