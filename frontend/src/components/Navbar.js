import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { AppBar, Divider, Drawer, IconButton, ListItemButton, Toolbar, Typography, List, ListItemIcon, Tooltip } from '@mui/material';
import MenuIcon from '@material-ui/icons/Menu';
import { ChevronLeft } from '@material-ui/icons';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TableRowsIcon from '@mui/icons-material/TableRows';
import { ListItemText } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { useReducerContext } from '../services/ReducerProvider';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';
import Looks4Icon from '@mui/icons-material/Looks4';
import Looks5Icon from '@mui/icons-material/Looks5';
import CategoryIcon from '@mui/icons-material/Category';

const numberIcons = [<LooksOneIcon />, <LooksTwoIcon />, <Looks3Icon />, <Looks4Icon />, <Looks5Icon />]

const drawerWidth = 210;

const CustomAppBar = styled(AppBar, {
    shouldForwardProp: (prop) => prop !== "open"
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    })
}));

const CustomDrawer = styled(Drawer, {
    shouldForwardProp: (prop) => prop !== "open"
})(({ theme, open }) => ({
    '& .MuiDrawer-paper': {
        width: drawerWidth,
        position: 'relative',
        boxSizing: 'border-box',
        whiteSpace: 'nowrap',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(!open && {
            overflowX: "hidden",
            width: theme.spacing(7),
            [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9),
            },
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            })
        })
    }
}))

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate()
    const [state, dispatch] = useReducerContext();

    return (
        <>
            <CustomAppBar position="absolute" open={open}>
                <Toolbar>
                    <IconButton onClick={() => setOpen(!open)} size="large" edge="start" color="inherit" sx={{ mr: 2, ...(open && { display: 'none' }) }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography component="h1" color="inherit" variant="h6">
                        Fraud Dashboard
                    </Typography>
                </Toolbar>
            </CustomAppBar>
            <CustomDrawer variant="permanent" open={open}>
                <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: [1] }}>
                    <IconButton onClick={() => setOpen(!open)} >
                        <ChevronLeft />
                    </IconButton>
                </Toolbar>
                <Divider />
                <List>
                    <ListItemButton key={"Dashboard"} onClick={() => navigate("/")}>
                        <ListItemIcon >
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                    <ListItemButton key={"All Domains"} onClick={() => navigate("/domains")}>
                        <ListItemIcon >
                            <TableRowsIcon />
                        </ListItemIcon>
                        <ListItemText primary="All Domains" />
                    </ListItemButton>
                    <ListItemButton key={"Categories"} onClick={() => navigate("/categories")}>
                        <ListItemIcon >
                            <CategoryIcon />
                        </ListItemIcon>
                        <ListItemText primary="Categories" />
                    </ListItemButton>
                    <Divider />
                    {state.prevDomains.slice(0).reverse().map((prevDomain, idx) =>
                        <Tooltip key={prevDomain} title={prevDomain}>
                            <ListItemButton key={prevDomain} onClick={() => {
                                dispatch({ type: 'updateDomainHistory', payload: prevDomain })
                                navigate(`/domains/${prevDomain}`)
                            }}>
                                <ListItemIcon >
                                    {numberIcons[idx]}
                                </ListItemIcon>
                                <ListItemText disableTypography primary={<Typography sx={{ overflow: 'hidden', fontSize: '0.75rem !important' }}>{prevDomain}</Typography>} />
                            </ListItemButton>
                        </Tooltip>
                    )}
                </List>
            </CustomDrawer >
        </>
    )
}

export default Navbar