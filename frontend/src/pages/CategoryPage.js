import { useTheme } from "@material-ui/core";
import { Box, Container, Grid, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import CategoriesPieChart from "../components/categoryGridComponents/CategoriesPieChart";
import OverallCost from "../components/categoryGridComponents/OverallCost";
import useFetch from "../hooks/useFetch";
import { useReducerContext } from "../services/ReducerProvider";

const CategoryPage = () => {
    const theme = useTheme();
    const [status, res] = useFetch('http://localhost:4000/get_all_category_data');
    const [, dispatch] = useReducerContext();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'fetched') {
            dispatch({ type: 'updateAllCategory', payload: res.all })
            delete res.all //Might be better way to do this idk
            dispatch({type: 'updateOtherCategories', payload: res})
            setLoading(false)
        }
    }, [status, res, dispatch])


    return (
        <Box component="main" sx={{
            backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
        }}>
            <Toolbar />
            <Container maxWidth="false" sx={{ mt: 4, mb: 4 }} >
                <Typography component="h1" variant="h4" color={theme.palette.info.main} gutterBottom>
                    Categories
                </Typography>
                {
                    loading ?
                        <Typography>Loading ...</Typography>
                        :
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} lg={4}>
                                <OverallCost />
                            </Grid>
                            <Grid item xs={12} sm={12} lg={8}>
                                <CategoriesPieChart />
                            </Grid>
                            <Grid item xs={12}>
                            </Grid>
                        </Grid>
                }
            </Container>
        </Box>
    )
}

export default CategoryPage;