import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import BadgeComponent from '../BadgeComponent';

const columns = [
    { field: 'id', headerName: 'ID', flex: 1, align: 'center', headerAlign: 'center'},
    { field: 'image', headerName: 'Image', sortable: false, flex: 2, headerAlign: 'center', renderCell: (params) => {
        return <BadgeComponent badge={params.row}></BadgeComponent>;
     },
    },
    { field: 'title', headerName: 'Titre', flex: 2, headerAlign: 'center' },
    { field: 'description', headerName: 'Description', flex: 4, headerAlign: 'center'},
    { field: 'color', headerName: 'Couleur', flex: 1, align: 'center', headerAlign: 'center', sortable: false, renderCell: (params) => {
        return <div style={{ backgroundColor: `#${params.value}`, width: '100%', height: '100%' }}></div>;
    } },
    { field : 'BadgeEditAction', minWidth: 200, headerName: "", align: 'center', headerAlign: 'center', sortable: false, renderCell: (params) => {
        const onClick = (e) => {
            // TODO: EDIT
            e.stopPropagation();
            return alert("Modifier le badge");
        };
        return <Button variant="outlined" onClick={onClick}>Modifier le badge</Button>;
    } },
    { field : 'BadgeDeleteAction', minWidth: 200, headerName: "", align: 'center', headerAlign: 'center', sortable: false, renderCell: (params) => {
        const onClick = (e) => {
            // TODO: DELETE
            e.stopPropagation();
            return alert("Supprimer le badge");
        };
        return <Button variant="outlined" color='error' onClick={onClick}>Supprimer le badge</Button>;
    } }
];

class BadgeGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: 3,
        };
    }


    render() {
        return (
            <div style={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={this.props.rows ?? []}
                    columns={columns}
                    rowHeight={160}
                    pageSize={this.state.pageSize}
                    rowsPerPageOptions={[3, 5, 10]}
                    onPageSizeChange={(newPageSize) => {
                        this.setState({ pageSize: newPageSize });
                    }}
                />
            </div>
        );
    }
}

export default BadgeGrid;

