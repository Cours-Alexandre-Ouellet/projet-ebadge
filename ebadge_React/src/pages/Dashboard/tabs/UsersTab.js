import React from 'react';
import '@mui/material';
import Item from '@mui/material/Grid';
import './../Dashboard.css';
import Api from '../../../utils/Api';
import UserGrid from '../../../composant/Dashboard/UserGrid';

class UsersTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        }
    }

    componentDidMount() {
        this.getUsers();
    }

    /**
     * Recupere la liste des utilisateurs depuis l'API
     */
    getUsers() {
        Api.get('/user').then(res => {
            const users = res.data;
            this.setState({ users: users.users });
        }
        )
    }

    render() {
        return (
            <Item className='bordered'>
                <h4>Liste des utilisateurs</h4>
                <UserGrid rows={this.state.users} />
            </Item>
        );
    }
}

export default UsersTab;