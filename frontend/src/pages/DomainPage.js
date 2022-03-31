import { useLocation, useParams } from 'react-router-dom';
import { Box, Toolbar, Container, Typography, Grid } from '@mui/material';
import { useTheme } from '@material-ui/core';
import TotalCost from '../components/domainGridComponents/TotalCost';
import useFetch from '../hooks/useFetch';
import { useEffect, useRef, useState } from 'react';
import { useReducerContext } from '../services/ReducerProvider';
import CategoryCard from '../components/domainGridComponents/CategoryCard';
import CostLineGraph from '../components/domainGridComponents/CostLineGraph';
import DomainTable from '../components/domainGridComponents/DomainTable';
import baseUrl from '../utils/url'

const DomainPage = () => {
    const params = useParams()
    const location = useLocation()
    const theme = useTheme()
    const [url, setUrl] = useState(`${baseUrl}get_domain_data?domain=${params.domainName}`)
    const [status, res] = useFetch(url)
    const [, dispatch] = useReducerContext()
    const [loading, setLoading] = useState(true)
    const titleRef = useRef(null);
    useEffect(() => {
        if (status === 'fetched') {
            dispatch({ type: 'updateCurrDomain', payload: res.domain_data })
            dispatch({ type: 'updateCurrCategory', payload: res.category_data })
            dispatch({ type: 'updateAllCategory', payload: res.overall_data })
            setLoading(false)
        } else if (status === 'serverError') {
            setLoading(false)
        }


    }, [status, res, dispatch])

    useEffect(() => {
        setLoading(true)
        setUrl(`${baseUrl}get_domain_data?domain=${params.domainName}`)
    }, [location.key])

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
            <Toolbar ref={titleRef} />
            <Container maxWidth="false" sx={{ mt: 4, mb: 4 }}>
                <Typography component="h1" variant="h4" color={theme.palette.info.main} gutterBottom>{params.domainName}</Typography>
                {
                    loading ?
                        <Typography>Loading ...</Typography>
                        : status === 'serverError' ?
                            <Typography>Domain not found</Typography>
                            :
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} lg={4}>
                                    <TotalCost />
                                </Grid>
                                <Grid item xs={12} sm={12} lg={8}>
                                    <CategoryCard />
                                </Grid>
                                <Grid item xs={12} sm={12} lg={4}>
                                    <DomainTable titleRef={titleRef} />
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