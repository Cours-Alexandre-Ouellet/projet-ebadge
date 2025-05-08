import * as React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
} from '@mui/material';

import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';
import Role from '../../policies/Role';
import PoliciesHelper from '../../policies/PoliciesHelper';
import { Link } from 'react-router-dom';

/**
 * Composant Navbar
 */
class Navbar extends React.Component {

  constructor(props) {
    super(props);

    this.PoliciesHelper = new PoliciesHelper();

    this.handleCloseNavMenu = this.handleCloseNavMenu.bind(this);
    this.handleOpenNavMenu = this.handleOpenNavMenu.bind(this);
    this.handleCloseUserMenu = this.handleCloseUserMenu.bind(this);
    this.handleOpenUserMenu = this.handleOpenUserMenu.bind(this);

    this.state = {
      anchorElNav: false,
      anchorElUser: false,
      pages: this.PoliciesHelper.getvisibleRoutes([
        { name: 'Mon profil', href: '/', minimumRole: Role.User },

        { name: 'Classement', href: '/leaderboard', minimumRole: Role.User },

        { name: 'Liste des badges', href: '/badges', minimumRole: Role.User },

        { name: 'Administration', href: '/admin/users', minimumRole: Role.Teacher },
        
        { name: 'Contactez-nous', href: '/contactez-nous', minimumRole: Role.Guest }

      ]),
      initials: 'ND',
      userSettings: [
        { name: 'Mon profil', href: '/' },
        { name: 'Paramètres', href:'/modify-profile'},
        { name: 'Se déconnecter', href: '/auth/logout' }
      ]
    };
  }

  componentDidMount() {
    this.setState({ initials: this.getInitials(localStorage.getItem('username') ?? "na") });
  }

  /**
   * Fonction pour ouvrir le menu
   * @param {*} event 
   */
  handleOpenNavMenu = (event) => {
    this.setState({ anchorElNav: true });
  };

  /**
   * Fonction pour ouvrir le menu utilisateur
   * @param {*} event
   */
  handleOpenUserMenu = (event) => {
    this.setState({ anchorElUser: true });
  };

  /**
   * Fonction pour fermer le menu
   * @param {*} event
   */
  handleCloseNavMenu = () => {
    this.setState({ anchorElNav: false });
  };

  /**
   * Fonction pour fermer le menu utilisateur
   * @param {*} event
   */
  handleCloseUserMenu = () => {
    this.setState({ anchorElUser: false });
  };

  /**
   * Fonction pour récupérer les initiales
   * @param {*} name 
   * @returns 
   */
  getInitials = (name) => {
    let initials = name.match(/\b\w/g) || [];
    initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
    return initials;
  }

  render() {
    return (
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              E-badge
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={this.handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={this.state.anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={this.state.anchorElNav}
                onClose={this.handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {this.state.pages.map((page) => (
                  <MenuItem key={page.href} component={Link}
                    to={page.href} onClick={this.handleCloseNavMenu}>
                    <Typography textAlign="center">{page.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              E-badge
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {this.state.pages.map((page) => (
                <Button
                  component={Link}
                  to={page.href}
                  key={page.name}
                  onClick={this.handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>

            <Box sx={{ display: 'flex'  }}>
              <Tooltip title="Mon compte">
                <IconButton
                  size="large"
                  component={Link}
                  onClick={this.handleOpenUserMenu}
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  color="inherit"
                >
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>{this.state.initials}</Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={this.state.anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={this.state.anchorElUser}
                onClose={this.handleCloseUserMenu}
              >
                {this.state.userSettings.map((setting) => (
                  <MenuItem key={setting.name} component={Link}
                    to={setting.href} onClick={this.handleCloseUserMenu}>
                    <Typography textAlign="center">{setting.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

          </Toolbar>
        </Container>
      </AppBar>)
  }
}

export default Navbar;