import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import UserBadgesPopup from './Popups/UserBadgesPopup/UserBadgesPopup';


class UserGrid extends React.Component {
  constructor(props) {
    super(props);

    this.badgeAssignationPopup = React.createRef();

    this.state = {
      open: false,
      selectedUser: null,
      columns: [
        { field: 'id', headerName: 'ID', flex: 1 },
        { 
          field: 'role', 
          headerName: 'Rôle', 
          flex: 1,
          valueGetter: (params) => {
            const roleMapping = { 1: "Administrateur", 2:"Contact Admin", 3: "Professeur", 4: "Étudiant" };
            return roleMapping[params.row.role_id] || "Inconnu"; // Gestion des valeurs imprévues
          }
        },
        { field: 'first_name', headerName: 'Prénom', flex: 1 },
        { field: 'last_name', headerName: 'Nom', flex: 1 },
        {
          field: "assignBadgeAction",
          minWidth: 200,
          headerName: "",
          sortable: false,
          renderCell: (params) => {
            const onClick = (e) => {
              e.stopPropagation();
              this.setState({ open: true, selectedUser: params.row });
              this.badgeAssignationPopup.current.refreshBadgesAssignation(true);
            };

            return <Button variant="outlined" onClick={onClick}>Gestion des badges</Button>;
          }
        }
      ]
    };

    this.handleClose = this.handleClose.bind(this);
  }

  /**
   * Ferme la popup de gestion des badges
   */
  handleClose = () => {
    this.setState({ open: false });
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
      </div>
    )
  }
}

export default (UserGrid);