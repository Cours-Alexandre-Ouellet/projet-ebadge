import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';

const columns = [
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

        return alert("Go to profile");
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

        return alert("Assigner un badge");
      };

      return <Button variant="outlined" onClick={onClick}>Assigner un badge</Button>;
    }
  }

];



class UserGrid extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={this.props.rows ?? []}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </div>
    )
  }
}

export default (UserGrid);
