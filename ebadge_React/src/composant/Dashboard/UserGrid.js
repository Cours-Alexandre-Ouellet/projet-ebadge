import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'ID', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1 },
  { field: 'first_name', headerName: 'Prénom', flex: 1 },
  { field: 'last_name', headerName: 'Nom', flex: 1 },
  {
    field: 'full_name',
    flex: 1,
    headerName: 'Nom complet',
    description: 'Cette colonne ne peut être filtrer ou trié.',
    sortable: false,
    valueGetter: (params) =>
      `${params.row.first_name || ''} ${params.row.last_name || ''}`,
  },


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
