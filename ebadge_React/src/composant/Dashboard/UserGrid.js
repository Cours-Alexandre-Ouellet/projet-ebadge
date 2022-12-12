import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import UserBadgesPopup from './UserBadgesPopup';


class UserGrid extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
      selectedUser: null,
      columns: [
        { field: 'id', headerName: 'ID', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'first_name', headerName: 'Prénom', flex: 1 },
        { field: 'last_name', headerName: 'Nom', flex: 1 },
        {
          field: "profileAction",
          minWidth: 200,
          headerName: "",
          sortable: false,
          renderCell: (params) => {
            const onClick = (e) => {
              e.stopPropagation();
              this.setState({ open: true, selectedUser: params.row });
            };

            return (<Button variant="outlined" onClick={onClick}>Voir le profile</Button>);
          }
        },
        {
          field: "assignBadgeAction",
          minWidth: 200,
          headerName: "",
          sortable: false,
          renderCell: (params) => {
            const onClick = (e) => {
              e.stopPropagation();
              this.setState({ open: true, selectedUser: params.row });
            };

            return <Button variant="outlined" onClick={onClick}>Assigner un badge</Button>;
          }
        }

      ]
    };

    this.handleClose = this.handleClose.bind(this);
  }

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

        <UserBadgesPopup isOpen={this.state.open} handleClose={this.handleClose} />
      </div>
    )
  }
}

export default (UserGrid);
