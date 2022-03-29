import { useParams } from 'react-router-dom';
import { Box, Toolbar, Container, Typography, Grid } from '@mui/material';
import { useTheme } from '@material-ui/core';
import TotalCost from '../components/domainGridComponents/TotalCost';
import useFetch from '../hooks/useFetch';
import { useEffect, useState } from 'react';
import { useReducerContext } from '../services/ReducerProvider';
import CategoryCard from '../components/domainGridComponents/CategoryCard';
import CostLineGraph from '../components/domainGridComponents/CostLineGraph';
import DomainTable from '../components/domainGridComponents/DomainTable';

const DomainPage = () => {
    const params = useParams()
    const theme = useTheme()
    const [status, res] = useFetch(`https://o29ulont8a.execute-api.eu-west-1.amazonaws.com/Prod/get_domain_data?domain=${params.domainName}`)
    const [, dispatch] = useReducerContext()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (status === 'fetched') {
            dispatch({ type: 'updateCurrDomain', payload: res.domain_data })
            dispatch({ type: 'updateCurrCategory', payload: res.category_data })
            dispatch({ type: 'updateAllCategory', payload: res.overall_data })
            setLoading(false)
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
                            <Grid item xs={12} sm={12} lg={4}>
                                <TotalCost />
                            </Grid>
                            <Grid item xs={12} sm={12} lg={8}>
                                <CategoryCard />
                            </Grid>
                            <Grid item xs={12} sm={12} lg={4}>
                                <DomainTable />
                            </Grid>
                            <Grid item xs={12} sm={12} lg={8}>
                                <CostLineGraph />
                            </Grid>
                        </Grid>
                }

            </Container>
        </Box>
    )
}

export default DomainPage