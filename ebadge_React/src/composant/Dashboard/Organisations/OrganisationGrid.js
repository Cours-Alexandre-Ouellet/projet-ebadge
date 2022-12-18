import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';

class OrganisationGrid extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      columns: [
        { field: 'id', headerName: 'ID', flex: 1 },
        {field: "name", headerName: "Nom", flex: 5},
        {
          field: "deleteAction",
          minWidth: 150,
          headerName: "",
          sortable: false,
          renderCell: (params) => {
            const onClick = (e) => {
              e.stopPropagation();
              this.props.deleteOrganisation(params.row.id);
            };
      
            return (<Button variant="outlined" onClick={onClick} disabled={params.row.id === 0}>Supprimer</Button>);
          }
        },
      ]
    };
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
    )
  }
}

export default (OrganisationGrid);
