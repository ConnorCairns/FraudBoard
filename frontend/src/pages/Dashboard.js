import { Box, Toolbar, Container, Grid } from '@mui/material';
import Domains from '../components/Domains';
import AddDomain from '../components/AddDomain';
import LookupDomain from '../components/LookupDomain';

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
            <Container sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} lg={6}>
                        <AddDomain />
                    </Grid>
                    <Grid item xs={12} sm={12} lg={6}>
                        <LookupDomain />
                    </Grid>
                    <Grid item xs={12}>
                        <Domains title="Sample Domains" DataGridProps={{ hideFooter: true, disableColumnMenu: true }} />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default Dashboard