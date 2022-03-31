import { Paper, TextField, Box, Button } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReducerContext } from "../services/ReducerProvider";
import Title from './Title';

const LookupDomain = () => {
    const [domain, setDomain] = useState("");
    const navigate = useNavigate();
    const [, dispatch] = useReducerContext();

    const handleClick = () => {
        dispatch({ type: 'updateDomainHistory', payload: domain })
        navigate(`/domains/${domain}`)
    }

    return (
        <>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <Box component="form" onSubmit={e => { e.preventDefault(); handleClick(e) }} sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Title title="View Domain" />
                    <TextField value={domain} onChange={(e) => setDomain(e.target.value)} fullWidth size="small" variant="outlined" autoComplete="url" placeholder="Domain to view" type="text" />
                    <Button sx={{ ml: 'auto', mt: '0.5rem' }} onClick={handleClick} variant="contained">View
                    </Button>
                </Box>
            </Paper>
        </>
    )
}

export default LookupDomain