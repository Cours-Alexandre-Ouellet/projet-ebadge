import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Api from '../../../src/utils/Api';
import UserAdminPopup from './Popups/UserAdminPopup/UserAdminPopup'; // Popup des détails
import ChangePasswordPopup from './Popups/UserAdminPopup/ChangePasswordPopup';

class UserAdminGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      selectedAdmin: null,
      openPasswordPopup: false,
      confirmDelete: false,
      adminToDelete: null,
      confirmDowngrade: false,  // État pour la popup de rétrogradation
      adminToDowngrade: null,   // Stocke l'admin à rétrograder
      targetRole: null          // Stocke le rôle cible (Professeur ou Étudiant)
    };
  }

  // Ouvre la popup des détails
  handleOpenDetails = (admin) => {
    this.setState({ open: true, selectedAdmin: admin });
  };

  // Ferme la popup
  handleClose = () => {
    this.setState({ open: false, selectedAdmin: null });
  };

  // Ouvre la popup de confirmation avant suppression
  handleConfirmDelete = (adminId) => {
    this.setState({ confirmDelete: true, adminToDelete: adminId });
  };

  // Ferme la popup de confirmation
  handleCloseConfirmDelete = () => {
    this.setState({ confirmDelete: false, adminToDelete: null });
  };

  // Supprime un admin (uniquement si ce n'est pas le dernier)
  deleteAdmin = () => {
    if (this.props.rows.length <= 1) return; // Empêche la suppression du dernier admin
    const { adminToDelete } = this.state;

    Api.delete(`/user/admin/${adminToDelete}`)
      .then(() => {
        console.log(`Admin ${adminToDelete} supprimé avec succès.`);
        if (this.props.onAdminDeleted) {
          this.props.onAdminDeleted(adminToDelete);
        }
        this.handleCloseConfirmDelete();
      })
      .catch(err => {
        console.error("Erreur lors de la suppression :", err);
      });
  };

  // Ouvre la popup de confirmation pour rétrograder un admin
  handleConfirmDowngrade = (admin, roleId) => {
    this.setState({ 
      confirmDowngrade: true, 
      adminToDowngrade: admin, 
      targetRole: roleId 
    });
  };

  // Ferme la popup de confirmation de rétrogradation
  handleCloseConfirmDowngrade = () => {
    this.setState({ confirmDowngrade: false, adminToDowngrade: null, targetRole: null });
  };

  // Effectue la rétrogradation après confirmation
  downgradeAdmin = () => {
    const { adminToDowngrade, targetRole } = this.state;

    Api.post("/user/remove-admin", { user_id: adminToDowngrade.id, new_role: targetRole })
      .then(() => {
        console.log(`Admin ${adminToDowngrade.id} rétrogradé en ${targetRole === 2 ? "Professeur" : "Étudiant"} avec succès.`);
        if (this.props.onAdminDeleted) {
          this.props.onAdminDeleted(adminToDowngrade.id);
        }
        this.handleCloseConfirmDowngrade();
      })
      .catch(err => {
        console.error("Erreur lors de la rétrogradation :", err);
      });
  };

  render() {
    const columns = [
      { field: 'id', headerName: 'ID', flex: 1 },
      { field: 'first_name', headerName: 'Prénom', flex: 1 },
      { field: 'last_name', headerName: 'Nom', flex: 1 },
      {
        field: "actions",
        minWidth: 200,
        headerName: "Actions",
        sortable: false,
        renderCell: (params) => (
          <Select
            defaultValue=""
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
            renderValue={() => "Actions"}
            onChange={(e) => {
              const action = e.target.value;
              const admin = params.row;

              if (action === "info") this.handleOpenDetails(admin);
              if (action === "downgrade_student") this.handleConfirmDowngrade(admin, 3);
              if (action === "downgrade_teacher") this.handleConfirmDowngrade(admin, 2);
              if (action === "delete") this.handleConfirmDelete(admin.id);
              if (action === "change_password") this.setState({ openPasswordPopup: true, selectedAdmin: admin });
            }}
          >
            <MenuItem value="info">Voir Infos</MenuItem>
            <MenuItem value="downgrade_student">Rétrograder en Étudiant</MenuItem>
            <MenuItem value="downgrade_teacher">Rétrograder en Professeur</MenuItem>
            <MenuItem value="change_password">Modifier le mot de passe</MenuItem>
            <MenuItem value="delete" disabled={this.props.rows.length <= 1}>
              Supprimer
            </MenuItem>
          </Select>
        ),
      }
    ];

    return (
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={this.props.rows ?? []}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />

        {/* Popup d'affichage des infos de l'admin */}
        {this.state.selectedAdmin && (
          <UserAdminPopup
            isOpen={this.state.open}
            selectedAdmin={this.state.selectedAdmin}
            handleClose={this.handleClose}
          />
        )}

        {/* Popup de confirmation de suppression */}
        <Dialog open={this.state.confirmDelete} onClose={this.handleCloseConfirmDelete}>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogContent>
            Êtes-vous sûr de vouloir supprimer cet administrateur ?
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseConfirmDelete} variant="outlined">Annuler</Button>
            <Button onClick={this.deleteAdmin} variant="contained" color="error">Confirmer</Button>
          </DialogActions>
        </Dialog>

        {/* Popup de confirmation de rétrogradation */}
        <Dialog open={this.state.confirmDowngrade} onClose={this.handleCloseConfirmDowngrade}>
          <DialogTitle>Confirmer la rétrogradation</DialogTitle>
          <DialogContent>
            Êtes-vous sûr de vouloir rétrograder{"  "}
            <strong>{this.state.adminToDowngrade?.first_name} {this.state.adminToDowngrade?.last_name} </strong> 
            en <strong>{this.state.targetRole === 2 ? "Professeur" : "Étudiant"}</strong> ?
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseConfirmDowngrade} variant="outlined">Annuler</Button>
            <Button onClick={this.downgradeAdmin} variant="contained" color="warning">Confirmer</Button>
          </DialogActions>
        </Dialog>

        {/* Popup de changement de mot de passe */}
        {this.state.selectedAdmin && (
          <ChangePasswordPopup
            isOpen={this.state.openPasswordPopup}
            handleClose={() => this.setState({ openPasswordPopup: false })}
            adminId={this.state.selectedAdmin.id}
          />
        )}
      </div>
    );
  }
}

export default UserAdminGrid;
