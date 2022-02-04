import { useEffect } from "react"
import { Box, Toolbar, Container, Paper, Grid } from '@mui/material';
import Domains from '../components/Domains.js'

const Dashboard = () => {

    return (
        <Box component="main"
            sx={{
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[900],
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
            }}>
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Domains />
                    </Paper>
                </Grid>
            </Container>
        </Box>
    )
}

export default Dashboard