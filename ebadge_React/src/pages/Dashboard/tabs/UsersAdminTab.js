import React from 'react';
import '@mui/material';
import Item from '@mui/material/Grid';
import './../Dashboard.css';
import Api from '../../../utils/Api';
import { Add } from '@mui/icons-material';
import { Button } from '@mui/material';
import UserAdminGrid from '../../../composant/Dashboard/UserAdminGrid';
import AssignAdminPopup from '../../../composant/Dashboard/Popups/UserAdminPopup/AssignAdminPopup';

class UserAdminTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            adminUsers: [],
            openAssignAdminPopup: false,
        };
    }

    onAdminDeleted = (deletedId) => {
        this.setState(prevState => ({
            adminUsers: prevState.adminUsers.filter(admin => admin.id !== deletedId)
        }));
    };

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

    /**
     * Ajout d'un message d'alerte si le nombre d'admins est inférieur à 2
     */
    render() {
        return (
            <Item className='bordered'>
                <div className="title">
                <h4>Liste des administrateurs</h4>
                <Button variant="contained" onClick={() => this.setState({ openAssignAdminPopup: true })} startIcon={<Add />}>
                    Ajouter un Admin
                </Button>
                </div>
                <UserAdminGrid rows={this.state.adminUsers} onAdminDeleted={this.onAdminDeleted}/>
                {this.state.adminUsers.length < 2 && (
                <p style={{ 
                    color: 'red', 
                    // fontWeight: 'bold', 
                    backgroundColor: '#ffe5e5', 
                    padding: '10px', 
                    borderRadius: '5px', 
                    border: '1px solid red'
                }}>
                    ⚠ Attention, vous avez seulement {this.state.adminUsers.length} administrateur. 
                    Il est recommandé d'en avoir entre 2 et 3. <br />
                    L'administrateur restant ne peut pas être supprimé ou rétrogradé.
                </p>
    )}
        <AssignAdminPopup 
            isOpen={this.state.openAssignAdminPopup} 
            handleClose={() => this.setState({ openAssignAdminPopup: false })} 
            refreshAdmins={this.getAdminUsers.bind(this)}  
        />
            </Item>
        );
    }
}

export default UserAdminTab;
