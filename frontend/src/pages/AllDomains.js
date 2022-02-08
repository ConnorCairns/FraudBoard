import Domains from '../components/Domains';
import { Box, Toolbar, Container } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const AllDomains = () => {
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
                <Domains reqLimit={100} title="All Domains" DataGridProps={{ paginationMode: 'server', components: { Toolbar: GridToolbar } }} />
            </Container>
        </Box>
    )
}

export default AllDomains