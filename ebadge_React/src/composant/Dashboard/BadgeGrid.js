import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Avatar } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const columns = [
    { field: 'id', headerName: 'ID', flex: 1, align: 'center', headerAlign: 'center'},
    { field: 'imagePath', headerName: 'Image', sortable: false, flex: 2, align: 'center' , headerAlign: 'center', renderCell: (params) => {
        return <Avatar alt={params.row.title} src={params.value} sx={{ width: 70, height: 70, bgcolor: `#${params.row.color}` }}/>;
     },
    },
    { field: 'title', headerName: 'Titre', flex: 2, headerAlign: 'center' },
    { field: 'description', headerName: 'Description', flex: 4, headerAlign: 'center'},
    { field: 'color', headerName: 'Couleur', flex: 1, align: 'center', headerAlign: 'center', sortable: false, renderCell: (params) => {
        return <div style={{ backgroundColor: `#${params.value}`, width: '100%', height: '100%' }}></div>;
    } },
    { field : 'BadgeEditAction', minWidth: 150, headerName: "", align: 'center', headerAlign: 'center', sortable: false, renderCell: (params) => {
        const onClick = (e) => {
            // TODO: EDIT
            e.stopPropagation();
            return alert("Modifier le badge");
        };
        return <Button variant="outlined" onClick={onClick} startIcon={<Edit></Edit>} >Modifier</Button>;
    } },
    { field : 'BadgeDeleteAction', minWidth: 150, headerName: "", align: 'center', headerAlign: 'center', sortable: false, renderCell: (params) => {
        const onClick = (e) => {
            // TODO: DELETE
            e.stopPropagation();
            return alert("Supprimer le badge");
        };
        return <Button variant="outlined" color='error' onClick={onClick} startIcon={<Delete></Delete>} >Supprimer</Button>;
    } }
];

class BadgeGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: 5,
        };
    }


    render() {
        return (
            <div style={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={this.props.rows ?? []}
                    columns={columns}
                    rowHeight={100}
                    pageSize={this.state.pageSize}
                    rowsPerPageOptions={[5, 10, 15, 20, 25, 30, 35, 40, 45, 50]}
                    onPageSizeChange={(newPageSize) => {
                        this.setState({ pageSize: newPageSize });
                    }}
                />
            </div>
        );
    }
}

export default BadgeGrid;

