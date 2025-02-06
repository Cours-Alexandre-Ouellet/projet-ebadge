import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Avatar, Slide, Dialog } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import CategorieDeleteAction from './CategorieDeletePopup';
import CategorieUpdateForm from '../CategorieUpdateForm';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class CategorieGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: 5,
            openDeleteDialog: false,
            openEditDialog: false,
            selectedCategorie: null,
            columns: [
                { field: 'id', headerName: 'ID', flex: 1, align: 'center', headerAlign: 'center' },
                { field: 'nom', headerName: 'Nom', flex: 2, headerAlign: 'center' },
                {
                    field: 'CategorieEditAction', minWidth: 150, headerName: "", align: 'center', headerAlign: 'center', sortable: false, renderCell: (params) => {
                        const onClick = (e) => {
                            e.stopPropagation();

                            this.setState({
                                openEditDialog: true,
                                selectedCategorie: params.row
                            })
                        };
                        return <Button variant="outlined" onClick={onClick} startIcon={<Edit></Edit>} >Modifier</Button>;
                    }
                },
                {
                    field: 'CategorieDeleteAction', minWidth: 150, headerName: "", align: 'center', headerAlign: 'center', sortable: false, renderCell: (params) => {
                        const onClick = (e) => {
                            e.stopPropagation();

                            this.setState({
                                openDeleteDialog: true,
                                selectedCategorie: params.row
                            })
                        };
                        return <Button variant="outlined" color='error' onClick={onClick} startIcon={<Delete></Delete>} >Supprimer</Button>;
                    }
                }
            ]
        };

        this.handleCloseDeleteDialog = this.handleCloseDeleteDialog.bind(this);
        this.handleCloseEditDialog = this.handleCloseEditDialog.bind(this);
    }

    handleCloseDeleteDialog = () => {
        this.setState({ openDeleteDialog: false });
    };

    handleCloseEditDialog = () => {
        this.setState({ openEditDialog: false });
    };

    
    render() {
        return (
            <div style={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={this.props.rows ?? []}
                    columns={this.state.columns}
                    rowHeight={100}
                    pageSize={this.state.pageSize}
                    rowsPerPageOptions={[5, 10, 15, 20, 25, 30, 35, 40, 45, 50]}
                    onPageSizeChange={(newPageSize) => {
                        this.setState({ pageSize: newPageSize });
                    }}
                />

                <CategorieDeleteAction
                    isOpen={this.state.openDeleteDialog}
                    onClose={this.handleCloseDeleteDialog}
                    selectedCategorie={this.state.selectedCategorie}
                    deleteCategorie={this.props.deleteCategorie}
                    errorCategorie={this.props.errorCategorie}
                />
                <Dialog fullScreen open={this.state.openEditDialog} onClose={this.handleCloseEditDialog} TransitionComponent={Transition}>
                    <CategorieUpdateForm handleClose={this.handleCloseEditDialog} editCategorie={this.props.editCategorie} selectedCategorie={this.state.selectedCategorie} errorCategorie={this.props.errorCategorie} />
                </Dialog>
            </div>
        );
    }
}

export default CategorieGrid;

