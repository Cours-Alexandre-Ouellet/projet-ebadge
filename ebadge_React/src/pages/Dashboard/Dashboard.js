import React from 'react';
import '@mui/material';
import { Button, TextField } from '@mui/material';
import UserGrid from '../../composant/Dashboard/UserGrid';
import Grid from '@mui/material/Grid';
import Item from '@mui/material/Grid';
import './Dashboard.css';
//import axios from 'axios';
import Skeleton from '@mui/material/Skeleton';



class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            usersInLoading: true
        }
    }

    //on monnt le composant
    componentDidMount() {
        this.getUsers();
    }

    getUsers() {
        /*todo modifier pour le bon axios
        axios.get('http://localhost:3000/api/users')

            .then(res => {
                const users = res.data;
                this.setState({ users });
            }
            )*/

        this.setState({ users: [
            { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
            { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
            { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
            { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
            { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
            { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
            { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
            { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
            { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
        ], usersInLoading: false });
    }

    render() {
        return (
            <Grid className='dashboard' container spacing={1}>
                <Grid item xs={12}>
                    <Item>
                        <h3>Tableau de bord</h3>
                    </Item>
                </Grid>
                <Grid item xs={8}>
                    <Item className='bordered'>
                        <h4>Liste Utilisateurs</h4>
                        
                        {
                            this.state.usersInLoading ? <Skeleton  animation="wave" /> : <UserGrid rows={this.state.users} />
                        }

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