import { useParams } from 'react-router-dom';
import { Box, Toolbar, Container, Typography, Grid } from '@mui/material';
import { useTheme } from '@material-ui/core';
import TotalCost from '../components/domainGridComponents/TotalCost';
import useFetch from '../hooks/useFetch';
import { useEffect, useState } from 'react';
import { unmarshall } from '../utils/unmarshall';
import { useReducerContext } from '../services/ReducerProvider';
import CategoryCard from '../components/domainGridComponents/CategoryCard';

const DomainPage = () => {
    const params = useParams()
    const theme = useTheme()
    const [status, res] = useFetch(`http://localhost:4000/get_domain?key=${params.domainName}`)
    const [data, setData] = useState();
    const [, dispatch] = useReducerContext()
    const [loading, setLoading] = useState(true)

    useEffect(() => {

    })

    useEffect(() => {
        if (status === 'fetched') {
            let unmarshalledData = unmarshall([res])
            setData(unmarshalledData[0])
            dispatch({ type: 'updateCurrDomain', payload: unmarshalledData[0] })

            fetch(`http://localhost:4000/get_category_cost?category=${unmarshalledData[0].category}`)
                .then(response => response.json())
                .then(data => {
                    dispatch({ type: 'updateCurrCategory', payload: data[0] })
                    setLoading(false)
                })
        }


    }, [status, res, dispatch])

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
            <Container maxWidth="false" sx={{ mt: 4, mb: 4 }}>
                <Typography component="h1" variant="h4" color={theme.palette.info.main} gutterBottom>{params.domainName}</Typography>
                {
                    loading ?
                        <Typography>Loading ...</Typography>
                        :
                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <TotalCost />
                            </Grid>
                            <Grid item xs={8} sx={{height: '50%'}}>
                                <CategoryCard />
                            </Grid>
                        </Grid>
                }

            </Container>
        </Box>
    )
}

export default DomainPage