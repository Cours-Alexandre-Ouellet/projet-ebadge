import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip } from '@mui/material';
import Api from '../../../src/utils/Api';
import UserAdminPopup from './Popups/UserAdminPopup/UserAdminPopup'; // Popup des détails
import ChangePasswordPopup from './Popups/UserAdminPopup/ChangePasswordPopup';
import Role, { RoleIds } from '../../policies/Role';
import EmailIcon from '@mui/icons-material/Email';
import Info from '@mui/icons-material/Info';

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
      downgradeRole: null,
      adminToDelete: null,
      confirmDowngrade: false,  // État pour la popup de rétrogradation
      confirmUpgrade: false,  // État pour la popup de promotion
      adminToAffect: null,   // Stocke l'admin à rétrograder
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

    Api.delete(`/user/${adminToModify}`)
      .then(() => {
        console.log(`Admin ${adminToModify} supprimé avec succès.`);
        if (this.props.onAdminDeleted) {
          this.props.onAdminDeleted(adminToModify);
        }
        this.props.refreshAdmins();
        this.handleCloseConfirmDelete();
      })
      .catch(err => {
        console.error("Erreur lors de la suppression :", err);
      });
  };

  // Ouvre la popup de confirmation pour promouvoir un admin en contact administrateur
  handleConfirmUpgrade = (admin) => {
    this.setState({
      confirmUpgrade: true,
      adminToAffect: admin
    });
  };

  // Ouvre la popup de confirmation pour rétrograder un admin
  handleConfirmDowngrade = (admin) => {
    this.setState({
      confirmDowngrade: true,
      adminToAffect: admin,
      targetRole: RoleIds.Teacher
    });
  };

  // Ferme la popup de confirmation de promotion
  handleCloseConfirmUpgrade = () => {
    this.setState({ confirmUpgrade: false });
  };

  // Ferme la popup de confirmation de rétrogradation
  handleCloseConfirmDowngrade = () => {
    this.setState({ confirmDowngrade: false, adminToAffect: null, targetRole: null });
  };

  // Effectue la promotion après confirmation
  upgradeAdminContact = () => {
    const { adminToAffect } = this.state;

    Api.post("/user/assign-admin-contact", { user_id: adminToAffect.id })
      .then(() => {
        this.props.refreshAdmins();
        this.handleCloseConfirmUpgrade();
      })
      .catch(err => {
        console.error("Erreur lors de la promotion :", err);
      });
  };

  // Rétrograde un admin en professeur (2)
  downgradeAdmin = () => {
    const { adminToAffect, targetRole } = this.state;

    Api.post("/user/remove-admin", { user_id: adminToAffect.id, new_role: targetRole })
      .then(() => {
        this.props.refreshAdmins();
        this.handleCloseConfirmDowngrade();
      })
      .catch(err => {
        console.error("Erreur lors de la rétrogradation :", err);
      });
  };

  render() {
    const columns = [
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
            fullWidth
            value=''
          >
            <MenuItem onClick={() => this.handleOpenDetails(params.row)}>Détails</MenuItem>
            <MenuItem onClick={() => this.handleConfirmUpgrade(params.row)} disabled={params.row.role_id === RoleIds.AdminContact}>
              Promouvoir en contact
              {params.row.role_id === RoleIds.AdminContact && <Tooltip title="Impossible de promouvoir un contact administrateur"><Info style={{ marginLeft: 5, pointerEvents: 'auto' }} /></Tooltip>}
            </MenuItem>
            <MenuItem onClick={() => this.handleConfirmDowngrade(params.row)} disabled={params.row.role_id === RoleIds.AdminContact}>
              Rétrograder en professeur
              {params.row.role_id === RoleIds.AdminContact && <Tooltip title="Impossible de rétrograder un contact administrateur"><Info style={{ marginLeft: 5, pointerEvents: 'auto' }} /></Tooltip>}
            </MenuItem>
            <MenuItem onClick={() => this.setState({ openPasswordPopup: true, selectedAdmin: params.row })}>Modifier le mot de passe</MenuItem>
            <MenuItem onClick={() => this.handleConfirmDelete(params.row.id)} disabled={this.props.rows.length <= 1}>
              Supprimer
            </MenuItem>
          </Select>
        ),
      },
      {
        field: "details",
        minWidth: 50,
        headerName: "Détails",
        sortable: false,
        renderCell: (params) => {
          if (params.row.role_id === RoleIds.AdminContact) {
            return (
              <Tooltip title="Contact Administrateur">
                <EmailIcon />
              </Tooltip>
            );
          }

          return <></>

        },
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
            <Button onClick={this.deleteAdmin} variant="contained" color="error">Confirmer</Button>
            <Button onClick={this.handleCloseConfirmDelete} variant="outlined">Annuler</Button>
          </DialogActions>
        </Dialog>

        {/* Popup de confirmation de promotion */}
        <Dialog open={this.state.confirmUpgrade} onClose={this.handleCloseConfirmUpgrade}>
          <DialogTitle>Confirmer la promotion</DialogTitle>
          <DialogContent>
            Êtes-vous sûr de promouvoir <strong>{this.state.adminToAffect?.first_name} {this.state.adminToAffect?.last_name} </strong> en administrateur de contact ?
            <br />
            L'ancien utilisateur assigné sera rétrogradé en administrateur.
          </DialogContent>
          <DialogActions>
            <Button onClick={this.upgradeAdminContact} variant="contained" color="warning">Confirmer</Button>
            <Button onClick={this.handleCloseConfirmUpgrade} variant="outlined">Annuler</Button>
          </DialogActions>
        </Dialog>

        {/* Popup de confirmation de rétrogradation */}
        <Dialog open={this.state.confirmDowngrade} onClose={this.handleCloseConfirmDowngrade}>
          <DialogTitle>Confirmer la rétrogradation</DialogTitle>
          <DialogContent>
            Êtes-vous sûr de vouloir rétrograder{"  "}
            <strong>{this.state.adminToAffect?.first_name} {this.state.adminToAffect?.last_name} </strong>
            en <strong>{this.state.targetRole === RoleIds.Teacher ? Role.Teacher : Role.User}</strong> ?
          </DialogContent>
          <DialogActions>
            <Button onClick={this.downgradeAdmin} variant="contained" color="warning">Confirmer</Button>
            <Button onClick={this.handleCloseConfirmDowngrade} variant="outlined">Annuler</Button>
          </DialogActions>
        </Dialog>

        {/* Popup de changement de mot de passe */}
        {this.state.selectedAdmin && (
          <ChangePasswordPopup
            isOpen={this.state.openPasswordPopup}
            handleClose={() => this.setState({ openPasswordPopup: false })}
            userId ={this.state.selectedAdmin.id}
          />
        )}
      </div>
    );
  }
}

export default UserAdminGrid;
