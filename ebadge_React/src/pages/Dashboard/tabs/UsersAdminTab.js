import React from 'react';
import '@mui/material';
import Item from '@mui/material/Grid';
import './../Dashboard.css';
import Api from '../../../utils/Api';
import UserGrid from '../../../composant/Dashboard/UserGrid';

class UserAdminTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            adminUsers: []
        };
    }

    componentDidMount() {
        this.getAdminUsers();
    }

    /**
     * Récupère la liste des utilisateurs et filtre ceux ayant role_id = 1
     */
    getAdminUsers() {
        Api.get('/user').then(res => {
            const users = res.data.users || [];
            const adminUsers = users.filter(user => user.role_id === 1);
            this.setState({ adminUsers });
        });
    }

    render() {
        return (
            <Item className='bordered'>
                <h4>Liste des administrateurs</h4>
                <UserGrid rows={this.state.adminUsers} />
            </Item>
        );
    }
}

export default UserAdminTab;
