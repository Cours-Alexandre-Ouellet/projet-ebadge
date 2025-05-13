import React from 'react';
import '@mui/material';
import Item from '@mui/material/Grid';
import './../Dashboard.css';
import Api from '../../../utils/Api';
import UserGrid from '../../../composant/Dashboard/UserGrid';
import Loading from '../../../composant/Loading/LoadingComponent';

import { Tabs, Tab, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import InformationPopup from '../../../composant/Dashboard/Popups/InformationPopup';
import { RoleIds } from '../../../policies/Role';

class UsersTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeUsers: [],
            inactiveUsers: [],
            charge: false,
            tabIndex: 0,
            confirmDelete: false,
            openSuccessPopup: false,
            openErrorPopup: false,
            role:0
        };
    }

    componentDidMount() {
        this.fetchUser();
        this.fetchActiveUsers();
        this.fetchInactiveUsers();
        
    }

    fetchUser(){
        Api.get("/auth/current_user")
            .then((response) => {
            this.setState({role:response.data.role_id})
            
            })
          .catch((error) => {
            console.error(error);
          });
          
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

    deleteLink = () => {
        Api.delete(`/user/delete-all-links`)
          .then(() => {
            this.setState({ confirmDelete: false});
            this.setState({openSuccessPopup:true});
          })
          .catch(() => {
            alert("Erreur lors de la suppression des liens.");
            this.setState({openErrorPopup:true});
          });
    };

    onClosePopupInformation = () =>{
        this.setState({openSuccessPopup:false, openErrorPopup: false});
    }

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
                {(this.state.role === RoleIds.Admin || this.state.role === RoleIds.AdminContact)&& (
                <Box className='linkDeleteButton'>
                    <Button variant="contained" onClick={() => this.setState({ confirmDelete: true })}>Supprimer les liens badges-étudiants</Button>
                </Box>
                )}
                <Dialog open={this.state.confirmDelete} onClose={() => this.setState({ confirmDelete: false })}>
                    <DialogTitle>Confirmer la suppression</DialogTitle>
                    <DialogContent>
                        Êtes-vous sûr de vouloir supprimer tous les liens badges-utilisateurs? Cette action est irréversible. 
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.deleteLink} variant="contained" color="error">Confirmer</Button>
                        <Button onClick={() => this.setState({ confirmDelete: false })} variant="outlined">Annuler</Button>
                    </DialogActions>
                </Dialog>
                <InformationPopup onClose={this.onClosePopupInformation} isOpen={this.state.openSuccessPopup} message="Réussite de la suppression" severity="success"/>
                <InformationPopup onClose={this.onClosePopupInformation} isOpen={this.state.openErrorPopup} message="Échec de la suppression" severity="error"/>
                {!charge && <Loading />}
            </Item>
        );
    }
}

export default UsersTab;
