import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'first_name', headerName: 'Prénom', width: 130 },
    { field: 'last_name', headerName: 'Côté', width: 130 },
    { field: 'age',
      headerName: 'Age',
      type: 'number',
      width: 90,
    },
    {
      field: 'full_name',
      headerName: 'Nom complet',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 160,
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
              rows={this.props.users || []}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
            />
          </div>
        )
    }
}

export default (UserGrid);
