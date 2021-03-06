import { Card, CardContent, Typography, Box, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider } from "@mui/material";
import { useTheme } from '@material-ui/core';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { useReducerContext } from "../../services/ReducerProvider";
import MoneyIcon from '@mui/icons-material/Money';
import NumbersIcon from '@mui/icons-material/Numbers';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const CategoryCard = () => {
    const [state,] = useReducerContext()
    const theme = useTheme()

    const date = new Date(state.allCategory[0].timeDate * 1000).toLocaleString('en-GB') //init in milliseconds so *1000

    return (
        <Card sx={{ marginBottom: '16px' }}>
            <CardContent sx={{ pb: 0 }}>
                <Box sx={{ display: 'flex' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography color="textSecondary" variant="overline" gutterBottom sx={{ fontWeight: 600, letterSpacing: '0.5px', }}>
                            CATEGORY
                        </Typography>
                        <Typography color="textPrimary" variant="h4" sx={{ fontWeight: 700, textTransform: 'capitalize' }}>
                            ALL
                        </Typography>
                        <Typography color="textSecondary" variant="body2">
                            {`Updated ${date}`}
                        </Typography>
                    </Box>
                    <Avatar
                        sx={{
                            backgroundColor: theme.palette.error.main,
                            height: 56,
                            width: 56,
                            ml: 'auto'
                        }}
                    >
                        <AnalyticsIcon />
                    </Avatar>
                </Box>
                <Box sx={{ pt: 1, display: 'flex', alignItems: 'center' }}>
                    <List sx={{ width: '100%' }}>
                        <ListItem key="categorySpend" alignItems="flex-start">
                            <ListItemAvatar >
                                <Avatar sx={{ backgroundColor: theme.palette.info.main }}>
                                    <MoneyIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                sx={{ alignSelf: 'center' }}
                                primary="Average Spend"
                            />
                            <Typography variant="h5" textAlign="right" sx={{ alignSelf: 'center' }}>
                                ${state.allCategory[0].average_cost.toFixed(2)}
                            </Typography>
                        </ListItem>
                        <Divider />
                        <ListItem key="count" alignItems="flex-start">
                            <ListItemAvatar >
                                <Avatar sx={{ backgroundColor: theme.palette.info.main }}>
                                    <NumbersIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                sx={{ alignSelf: 'center' }}
                                primary="Website Count"
                            />
                            <Typography variant="h5" textAlign="right" sx={{ alignSelf: 'center' }}>
                                {state.allCategory[0].count}
                            </Typography>
                        </ListItem>
                        <Divider />
                        <ListItem key="totalCategorySpend" alignItems="flex-start">
                            <ListItemAvatar >
                                <Avatar sx={{ backgroundColor: theme.palette.info.main }}>
                                    <AttachMoneyIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                sx={{ alignSelf: 'center' }}
                                primary="Total Category Spend"
                            />
                            <Typography variant="h5" textAlign="right" sx={{ alignSelf: 'center' }}>
                                ${state.allCategory[0].total_spent.toFixed(2)}
                            </Typography>
                        </ListItem>
                    </List>
                </Box>
            </CardContent>
        </Card >
    )
}

export default CategoryCard