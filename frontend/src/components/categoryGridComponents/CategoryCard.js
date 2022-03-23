import { Card, CardContent, Typography, Box, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useTheme } from '@material-ui/core';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { useReducerContext } from "../../services/ReducerProvider";
import MoneyIcon from '@mui/icons-material/Money';
import NumbersIcon from '@mui/icons-material/Numbers';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useState } from "react";

const CategoryCard = () => {
    const [state,] = useReducerContext()
    const [selectedCategory, setSelectedCategory] = useState(state.currCategory[0].category)
    const theme = useTheme()

    const date = new Date(state.otherCategories[selectedCategory][0].timeDate * 1000).toLocaleString() //init in milliseconds so *1000

    return (
        <Card>
            <CardContent sx={{ pb: 0 }}>
                <Box sx={{ display: 'flex' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 120 }}>
                        <FormControl fullWidth>
                            <InputLabel id="categorySelectLabel">CATEGORY</InputLabel>
                            <Select labelId="categorySelectLabel" id="categorySelect" value={selectedCategory} label="CATEGORY" onChange={(e) => setSelectedCategory(e.target.value)}>
                                {Object.keys(state.otherCategories).map(category => (
                                    <MenuItem key={category} value={category}>{category}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Typography color="textSecondary" variant="body2">
                            {`Updated ${date}`}
                        </Typography>
                    </Box>
                    <Avatar
                        sx={{
                            backgroundColor: theme.palette.primary.main,
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
                                ${state.otherCategories[selectedCategory][0].average_cost.toFixed(2)}
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
                                {state.otherCategories[selectedCategory][0].count}
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
                                ${state.otherCategories[selectedCategory][0].total_spent.toFixed(2)}
                            </Typography>
                        </ListItem>
                    </List>
                </Box>
            </CardContent>
        </Card >
    )
}

export default CategoryCard