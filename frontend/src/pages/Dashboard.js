import { Box, Toolbar, Container, Grid } from '@mui/material';
import Domains from '../components/Domains';
import AddDomain from '../components/AddDomain';

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
                    <AddDomain />
                    <Domains title="Recently Added Domains" DataGridProps={{ hideFooter: true, disableColumnMenu: true }} />
                </Grid>
            </Container>
        </Box>
    )
}

export default Dashboard