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
      confirmDowngrade: false,
      adminToModify: null,
      downgradeRole: null
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
    this.setState({ confirmDelete: true, adminToModify: adminId });
  };

  // Ferme la popup de confirmation
  handleCloseConfirmDelete = () => {
    this.setState({ confirmDelete: false, adminToModify: null });
  };

  // Supprime un admin (uniquement si ce n'est pas le dernier admin)
  deleteAdmin = () => {
    if (this.props.rows.length <= 1) return; // Empêche la suppression du dernier admin
    const { adminToModify } = this.state;

    Api.delete(`/user/admin/${adminToModify}`)
      .then(() => {
        console.log(`Admin ${adminToModify} supprimé avec succès.`);
        if (this.props.onAdminDeleted) {
          this.props.onAdminDeleted(adminToModify);
        }
        this.handleCloseConfirmDelete();
      })
      .catch(err => {
        console.error("Erreur lors de la suppression :", err);
      });
  };

  // Ouvre la popup de confirmation avant rétrogradation
  handleConfirmDowngrade = (adminId, roleId) => {
    this.setState({ confirmDowngrade: true, adminToModify: adminId, downgradeRole: roleId });
  };

  // Ferme la popup de confirmation de rétrogradation
  handleCloseConfirmDowngrade = () => {
    this.setState({ confirmDowngrade: false, adminToModify: null, downgradeRole: null });
  };

  // Rétrograde un admin en étudiant (3) ou professeur (2)
  downgradeAdmin = () => {
    const { adminToModify, downgradeRole } = this.state;

    Api.post("/user/remove-admin", { user_id: adminToModify, new_role: downgradeRole })
      .then(() => {
        console.log(`Admin ${adminToModify} rétrogradé avec succès.`);
        if (this.props.onAdminDeleted) {
          this.props.onAdminDeleted(adminToModify);
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
              if (action === "downgrade_student") this.handleConfirmDowngrade(admin.id, 3);
              if (action === "downgrade_teacher") this.handleConfirmDowngrade(admin.id, 2);
              if (action === "delete") this.handleConfirmDelete(admin.id);
              if (action === "change_password") this.setState({ openPasswordPopup: true, selectedAdmin: admin });
            }}
          >
            <MenuItem value="info">Voir Infos</MenuItem>
            <MenuItem value="downgrade_student" disabled={this.props.rows.length <= 1}>
              Rétrograder en Étudiant
            </MenuItem>
            <MenuItem value="downgrade_teacher" disabled={this.props.rows.length <= 1}>
              Rétrograder en Professeur
            </MenuItem>
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
    Êtes-vous sûr de vouloir rétrograder{" "}
    <strong>
      {this.props.rows.find(admin => admin.id === this.state.adminToModify)?.first_name}{" "}
      {this.props.rows.find(admin => admin.id === this.state.adminToModify)?.last_name}
    </strong>{" "}
    en{" "}
    <strong>
      {this.state.downgradeRole === 2 ? "Professeur" : "Étudiant"}
    </strong>{" "}
    ?
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
