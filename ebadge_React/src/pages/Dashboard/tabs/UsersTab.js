import React from 'react';
import '@mui/material';
import Item from '@mui/material/Grid';
import './../Dashboard.css';
import Api from '../../../utils/Api';
import UserGrid from '../../../composant/dashboard/UserGrid';

class Dashboard extends React.Component {
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
        Api.get('/users', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(res => {
            const users = res.data;
            this.setState({ users: users });
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

export default Dashboard;