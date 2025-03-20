import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import Api from '../../../src/utils/Api';
import UserAdminPopup from './Popups/UserAdminPopup/UserAdminPopup'; // Le composant de la popup
import { Add } from '@mui/icons-material';


class UserAdminGrid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      selectedAdmin: null,
      columns: [
        { field: 'id', headerName: 'ID', flex: 1 },
        // { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'first_name', headerName: 'Prénom', flex: 1 },
        { field: 'last_name', headerName: 'Nom', flex: 1 },
        {
          field: "actions",
          minWidth: 200,
          headerName: "Actions",
          sortable: false,
          renderCell: (params) => {
            const onClick = (e) => {
              e.stopPropagation();
              this.setState({ open: true, selectedAdmin: params.row });
            };

            return (
              <Button variant="outlined" onClick={onClick}>Détails</Button>
            );
          }
        }
      ]
    };
  }

  handleClose = () => {
    this.setState({ open: false, selectedAdmin: null });
  };

  deleteAdmin = (userId) => {
    Api.delete(`/user/admin/${userId}`)
      .then(() => {
        console.log(`Admin ${userId} supprimé avec succès.`);
        if (this.props.onAdminDeleted) {
          this.props.onAdminDeleted(userId);
        }
        this.handleClose(); // Fermer la popup après suppression
      })
      .catch(err => {
        console.error("Erreur lors de la suppression :", err);
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

        {/* Popup d'affichage des infos de l'admin */}
        {this.state.selectedAdmin && (
          <UserAdminPopup
            isOpen={this.state.open}
            selectedAdmin={this.state.selectedAdmin}
            handleClose={this.handleClose}
            deleteAdmin={this.deleteAdmin}
            canDelete={this.props.rows.length > 1} // Désactive le bouton si dernier admin
          />
        )}
      </div>
    );
  }
}

export default UserAdminGrid;
