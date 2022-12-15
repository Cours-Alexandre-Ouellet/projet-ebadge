import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';

const columns = [
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

        return alert("SUPPRESSION");
      };

      return (<Button variant="outlined" onClick={onClick}>Supprimer</Button>);
    }
  },

];



class ProgramGrid extends React.Component {

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

export default (ProgramGrid);
