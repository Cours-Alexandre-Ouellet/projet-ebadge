import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip } from '@mui/material';
import UserBadgesPopup from './Popups/UserBadgesPopup/UserBadgesPopup';
import ChangePasswordPopup from './Popups/UserAdminPopup/ChangePasswordPopup';
import Api from '../../utils/Api';

class UserGrid extends React.Component {
  constructor(props) {
    super(props);

    this.badgeAssignationPopup = React.createRef();

    this.state = {
      open: false,
      openPasswordPopup: false,
      confirmDelete: false,
      selectedUser: null,
      columns: [
        {
          field: 'role_id',
          headerName: 'Rôle',
          flex: 1,
          valueGetter: (params) => {
            const roleMapping = { 1: "Administrateur", 2: "Contact Admin", 3: "Professeur", 4: "Étudiant" };
            return roleMapping[params] || "Inconnu";
          }
        },
        { field: 'first_name', headerName: 'Prénom', flex: 1 },
        { field: 'last_name', headerName: 'Nom', flex: 1 },
        {
          field: 'active',
          headerName: 'Statut',
          flex: 1,
          valueGetter: (params) => {
            const isActive = params;
            return isActive === 1 ? 'Actif' : 'Désactivé';
            }
        },
        {
          field: "actions",
          headerName: "Actions",
          sortable: false,
          flex: 2,
          renderCell: (params) => (
            <Select
              defaultValue=""
              displayEmpty
              inputProps={{ 'aria-label': 'Sans label' }}
              renderValue={() => "Actions"}
              fullWidth
              value={''}
            >
              <MenuItem onClick={() => this.handleBadgeManagement(params.row)}>Gestion des badges</MenuItem>
              <MenuItem onClick={() => this.setState({ openPasswordPopup: true, selectedUser: params.row })}>Modifier le mot de passe</MenuItem>
              <MenuItem onClick={() => this.setState({ confirmDelete: true, selectedUser: params.row })}>Supprimer</MenuItem>
              <MenuItem onClick={() => this.toggleUserStatus(params.row)}>
                {params.row.active === 1 ? 'Désactiver' : 'Activer'}
              </MenuItem>
            </Select>
          )
        }
      ]
    };
  }

  handleBadgeManagement = (user) => {
    this.setState({ open: true, selectedUser: user });
    this.badgeAssignationPopup.current.refreshBadgesAssignation(true);
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  deleteUser = () => {
    const { selectedUser } = this.state;
    Api.delete(`/user/${selectedUser.id}`)
      .then(() => {
        this.props.refreshUsers?.();
        this.setState({ confirmDelete: false, selectedUser: null });
      })
      .catch(() => {
        alert("Erreur lors de la suppression de l'utilisateur.");
      });
  };

  toggleUserStatus = (user) => {
    Api.post(`/user/${user.id}/toggle-active`)
      .then(() => {
        this.props.refreshAllUsers?.();
      })
      .catch(() => {
        alert("Erreur lors du changement de statut de l'utilisateur.");
      });
  };

  render() {
    return (
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={this.props.rows ?? []}
          columns={this.state.columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />

        <UserBadgesPopup
          isOpen={this.state.open}
          selectedUser={this.state.selectedUser}
          handleClose={this.handleClose}
          ref={this.badgeAssignationPopup}
        />

        {this.state.selectedUser && (
          <ChangePasswordPopup
            isOpen={this.state.openPasswordPopup}
            handleClose={() => this.setState({ openPasswordPopup: false })}
            userId={this.state.selectedUser.id}
          />
        )}

        {/* Confirmation suppression */}
        <Dialog open={this.state.confirmDelete} onClose={() => this.setState({ confirmDelete: false })}>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogContent>
            Êtes-vous sûr de vouloir supprimer {this.state.selectedUser?.first_name} {this.state.selectedUser?.last_name} ?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.setState({ confirmDelete: false })} variant="outlined">Annuler</Button>
            <Button onClick={this.deleteUser} variant="contained" color="error">Confirmer</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default UserGrid;
