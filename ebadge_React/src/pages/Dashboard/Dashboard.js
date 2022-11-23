import React from 'react';
import '@mui/material';
import { Button, TextField } from '@mui/material';
import UserGrid from '../../composant/Dashboard/UserGrid';
import Grid from '@mui/material/Grid';
import Item from '@mui/material/Grid';
import './Dashboard.css';
import Api from '../../utils/Api';



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
            <Grid className='dashboard' container m={4} spacing={1}>
                <Grid item xs={12}>
                    <Item>
                        <h3>Tableau de bord</h3>
                    </Item>
                </Grid>
                <Grid item xs={8}>
                    <Item className='bordered'>
                        <h4>Liste des utilisateurs</h4>
                        <UserGrid rows={this.state.users} />
                    </Item>
                </Grid>
                <Grid item xs={4}>
                    <Item></Item>
                </Grid>
                <Grid item xs={4}>
                    <Item></Item>
                </Grid>
                <Grid item xs={8}>
                    <Item></Item>
                </Grid>
            </Grid>

        );
    }
}

export default Dashboard;