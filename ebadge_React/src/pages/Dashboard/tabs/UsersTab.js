import React from 'react';
import '@mui/material';
import Item from '@mui/material/Grid';
import './../Dashboard.css';
import Api from '../../../utils/Api';
import UserGrid from '../../../composant/Dashboard/UserGrid';
import Loading from '../../../composant/Loading/LoadingComponent';

import { Tabs, Tab, Box } from '@mui/material';

class UsersTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeUsers: [],
            inactiveUsers: [],
            charge: false,
            tabIndex: 0
        };
    }

    componentDidMount() {
        this.fetchActiveUsers();
        this.fetchInactiveUsers();
    }

    fetchActiveUsers = () => {
        Api.get('/user/active/1').then(res => {
            this.setState({ activeUsers: res.data.users });
        });
    };

    fetchInactiveUsers = () => {
        Api.get('/user/active/0').then(res => {
            this.setState({ inactiveUsers: res.data.users, charge: true });
        });
    };

    handleTabChange = (event, newValue) => {
        this.setState({ tabIndex: newValue });
    };
    
    refreshAllUsers = () => {
        this.fetchActiveUsers();
        this.fetchInactiveUsers();
      };

    render() {
        const { tabIndex, activeUsers, inactiveUsers, charge } = this.state;

        return (
            <Item className="bordered">
                <h4>Liste des utilisateurs</h4>

                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabIndex} onChange={this.handleTabChange}>
                        <Tab label="Utilisateurs actifs" />
                        <Tab label="Utilisateurs désactivés" />
                    </Tabs>
                </Box>

                <Box sx={{ mt: 2 }}>
                    {tabIndex === 0 && (
                        <UserGrid rows={activeUsers} refreshUsers={this.fetchActiveUsers} refreshAllUsers={this.refreshAllUsers}/>
                    )}
                    {tabIndex === 1 && (
                        <UserGrid rows={inactiveUsers} refreshUsers={this.fetchInactiveUsers} refreshAllUsers={this.refreshAllUsers}/>
                    )}
                </Box>

                {!charge && <Loading />}
            </Item>
        );
    }
}

export default UsersTab;
