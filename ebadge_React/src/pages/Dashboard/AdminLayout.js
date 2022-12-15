import { Outlet } from "react-router-dom";
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { Button } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Role from '../../policies/Role';
import PoliciesHelper from '../../policies/PoliciesHelper';

const drawerWidth = 240;

class AdminLayout extends React.Component {

    constructor(props) {
        super(props);

        this.policiesHelper = new PoliciesHelper();

        this.container = window !== undefined ? () => window.document.body : undefined;
        this.mobileOpen = false;

        this.handleDrawerToggle = this.handleDrawerToggle.bind(this);

        this.state = {
            tabs: [
                {
                    sectionName: "Gestion des utilisateurs",
                    tabs: this.policiesHelper.getvisibleRoutes([
                        { id: 1, label: 'Mes utilisateurs', icon: <InboxIcon />, path: '/admin/users', minimumRole: Role.Teacher },
                        { id: 2, label: 'Mes groupes', icon: <InboxIcon />, path: "/admin/groups", minimumRole: Role.Teacher },
                        {id: 4, label: 'Mes programmes', icon: <InboxIcon />, path: '/admin/programs', minimumRole: Role.Admin},
                    ])
                },
                {
                    sectionName: "Gestion des badges",
                    tabs: this.policiesHelper.getvisibleRoutes([
                        { id: 3, label: 'Liste des badges', icon: <InboxIcon />, path: "/admin/badges", minimumRole: Role.Teacher },
                    ])
                }
            ],
        };

    }

    handleDrawerToggle = () => {
        this.mobileOpen = !this.mobileOpen;
    };

    render() {
        return (
            <>
                <Box sx={{ display: 'flex' }}>
                    <CssBaseline />
                    <AppBar
                        position="fixed"
                        sx={{
                            width: { sm: `calc(100% - ${drawerWidth}px)` },
                            ml: { sm: `${drawerWidth}px` },
                        }}
                    >
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={this.handleDrawerToggle}
                                sx={{ mr: 2, display: { sm: 'none' } }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Button variant="outlined" color="secondary" component={Link} to="/" sx={ { mr: 3 } } startIcon={<ArrowBackIcon/>}>                             
                                 Retour au site
                            </Button>

                            <Typography variant="h6" noWrap component="div">
                                E-Badge | Administration
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Box
                        component="nav"
                        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                        aria-label="mailbox folders"
                    >
                        {}
                        <Drawer
                            container={this.container}
                            variant="temporary"
                            open={this.mobileOpen}
                            onClose={this.handleDrawerToggle}
                            ModalProps={{
                                keepMounted: true,
                            }}
                            sx={{
                                display: { xs: 'block', sm: 'none' },
                                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                            }}
                        >
                            <div>
                                <Toolbar />
                                <Divider />
                                {
                                    this.state.tabs.map((tab, index) => (
                                        <List key={index}>
                                            <ListItem key={index} disablePadding>
                                                <ListItemButton disabled >
                                                    <ListItemText primary={tab.sectionName} />
                                                </ListItemButton>
                                            </ListItem>
                                            {
                                                tab.tabs.map((tab, index) => (
                                                    <ListItem key={index} disablePadding >
                                                        <ListItemButton component={Link} to={tab.path}>
                                                            <ListItemIcon>
                                                                {tab.icon}
                                                            </ListItemIcon>
                                                            <ListItemText primary={tab.label} />
                                                        </ListItemButton>
                                                    </ListItem>
                                                ))
                                            }
                                        </List>
                                    ))
                                }
                            </div>
                        </Drawer>
                        <Drawer
                            variant="permanent"
                            sx={{
                                display: { xs: 'none', sm: 'block' },
                                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                            }}
                            open
                        >
                            <Toolbar />
                            <Divider />
                            {
                                this.state.tabs.map((tab, index) => (
                                    <List key={index}>
                                        <ListItem key={index} disablePadding>
                                            <ListItemButton disabled >
                                                <ListItemText primary={tab.sectionName} />
                                            </ListItemButton>
                                        </ListItem>
                                        {
                                            tab.tabs.map((tab, index) => (
                                                <ListItem key={index} disablePadding >
                                                    <ListItemButton component={Link} to={tab.path}>
                                                        <ListItemIcon>
                                                            {tab.icon}
                                                        </ListItemIcon>
                                                        <ListItemText primary={tab.label} />
                                                    </ListItemButton>
                                                </ListItem>
                                            ))
                                        }
                                    </List>
                                ))
                            }
                        </Drawer>
                    </Box>
                    <Box
                        component="main"
                        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
                    >
                        <Toolbar />
                        <div className='dashboard'>
                            <h3>{
                            this.state.tabs.map((tab, index) => (
                                tab.tabs.map((tab, index) => (
                                    tab.path === window.location.pathname ? tab.label : null
                                ))
                            ))}</h3>
                            <Outlet />
                        </div>
                    </Box>
                </Box >
            </>
        )
    }
}

export default AdminLayout;


