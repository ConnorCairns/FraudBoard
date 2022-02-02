import React, { useState } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { AppBar, Divider, Drawer, IconButton, ListItem, Toolbar, Typography, List, ListItemIcon, Box, Container, Grid, Paper, CssBaseline } from '@mui/material';
import MenuIcon from '@material-ui/icons/Menu';
import { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { ChevronLeft } from '@material-ui/icons';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { ListItemText } from '@material-ui/core';

const drawerWidth: number = 210;

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const CustomAppBar = styled(AppBar, {
    shouldForwardProp: (prop) => prop !== "open"
})<AppBarProps>(({ theme, open }) => ({
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

const Navbar = (): JSX.Element => {
    const [open, setOpen] = useState(false);

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
                            <ListItem button key={"Dashboard"}>
                                <ListItemIcon>
                                    <DashboardIcon />
                                </ListItemIcon>
                                <ListItemText primary="Dashboard" />
                            </ListItem>
                        </List>
                    </CustomDrawer>
                </>
    )
}

export default Navbar