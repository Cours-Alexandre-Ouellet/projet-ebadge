import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';

const columns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'title', headerName: 'Titre', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 1 },
    { field: 'image', headerName: 'Image', flex: 1 },
    { field: 'color', headerName: 'Couleur', flex: 1 },
];

class BadgeGrid extends React.Component {
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
        );
    }
}

export default BadgeGrid;

