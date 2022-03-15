import { useParams } from 'react-router-dom';
import { Box, Toolbar, Container, Typography } from '@mui/material';
import { Grid, useTheme } from '@material-ui/core';
import TotalCost from '../components/domainGridComponents/TotalCost';
import useFetch from '../hooks/useFetch';
import { useEffect, useState } from 'react';
import { unmarshall } from '../utils/unmarshall';

const DomainPage = () => {
    const params = useParams()
    const theme = useTheme()
    const URL = `http://localhost:4000/get_domain?key=${params.domainName}`
    const [status, res] = useFetch(URL)
    const [data, setData] = useState();

    useEffect(() => {
        if (status === 'fetched') {
            let unmarshalledData = unmarshall([res])
            setData(unmarshalledData[0])
        }


    }, [status, res])

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
                <Typography component="h1" variant="h4" color={theme.palette.info.main} gutterBottom>{params.domainName}</Typography>
                {
                    data ?
                        <Grid container spacing={2}>
                            <Grid item xs={3}>
                                <TotalCost cost={data.total_spent} />
                            </Grid>
                        </Grid>
                        :
                        <Typography>Loading ...</Typography>
                }

            </Container>
        </Box>
    )
}

export default DomainPage