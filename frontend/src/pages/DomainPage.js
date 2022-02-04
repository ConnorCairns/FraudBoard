import { useParams } from 'react-router-dom';
import { Box, Toolbar, Container, Paper, Grid } from '@mui/material';

const DomainPage = () => {
    const params = useParams()

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
                {params.domainName}
            </Container>
        </Box>
    )
}

export default DomainPage