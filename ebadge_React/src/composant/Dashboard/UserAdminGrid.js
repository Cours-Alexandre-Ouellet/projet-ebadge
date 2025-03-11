import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import Api from '../../../src/utils/Api';


class UserAdminGrid extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { field: 'id', headerName: 'ID', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'first_name', headerName: 'Prénom', flex: 1 },
        { field: 'last_name', headerName: 'Nom', flex: 1 },
        {
          field: "deleteAction",
          minWidth: 150,
          headerName: "Action",
          sortable: false,
          renderCell: (params) => {
            const onDelete = (e) => {
              e.stopPropagation();
              // console.log(params.row.id);
              this.deleteAdmin(params.row.id);
              
            };

             // Cache le bouton si seulement il reste un admin 
              return this.props.rows.length > 1 ? (
                <Button variant="outlined" color="error" onClick={onDelete}>Supprimer</Button>
            ) : null;
          }
        }
      ]
    };
  }

  /**
   * Supprime un administrateur
   * @param {number} userId 
   */
  deleteAdmin(userId) {
    Api.delete(`/user/admin/${userId}`)
      .then(() => {
        console.log(`Admin ${userId} supprimé avec succès.`);
        if (this.props.onAdminDeleted) {
          this.props.onAdminDeleted(userId);
        }
      })
      .catch(err => {
        console.error("Erreur lors de la suppression :", err);
      });
  }

  render() {
    return (
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={this.props.rows ?? []}
          columns={this.state.columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </div>
    );
  }
}

export default UserAdminGrid;
