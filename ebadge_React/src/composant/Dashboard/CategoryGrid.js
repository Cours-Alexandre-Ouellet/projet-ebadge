import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Avatar, Slide, Dialog } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import CategoryDeleteAction from './CategoryDeletePopup';
import CategoryUpdateForm from '../CategoryUpdateForm';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class CategoryGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageSize: 5,
            openDeleteDialog: false,
            openEditDialog: false,
            selectedCategory: null,
            columns: [
                { field: 'id', headerName: 'ID', flex: 1, align: 'center', headerAlign: 'center' },
                { field: 'name', headerName: 'Nom', flex: 2, headerAlign: 'center' },
                {
                    field: 'CategoryEditAction', minWidth: 150, headerName: "", align: 'center', headerAlign: 'center', sortable: false, renderCell: (params) => {
                        const onClick = (e) => {
                            e.stopPropagation();

                            this.setState({
                                openEditDialog: true,
                                selectedCategory: params.row
                            })
                        };
                        return <Button variant="outlined" onClick={onClick} startIcon={<Edit></Edit>} >Modifier</Button>;
                    }
                },
                {
                    field: 'CategoryDeleteAction', minWidth: 150, headerName: "", align: 'center', headerAlign: 'center', sortable: false, renderCell: (params) => {
                        const onClick = (e) => {
                            e.stopPropagation();

                            this.setState({
                                openDeleteDialog: true,
                                selectedCategory: params.row
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

                <CategoryDeleteAction
                    isOpen={this.state.openDeleteDialog}
                    onClose={this.handleCloseDeleteDialog}
                    selectedCategory={this.state.selectedCategory}
                    deleteCategory={this.props.deleteCategory}
                    errorCategory={this.props.errorCategory}
                />
                <Dialog fullScreen open={this.state.openEditDialog} onClose={this.handleCloseEditDialog} TransitionComponent={Transition}>
                    <CategoryUpdateForm handleClose={this.handleCloseEditDialog} editCategory={this.props.editCategory} selectedCategory={this.state.selectedCategory} errorCategory={this.props.errorCategory} />
                </Dialog>
            </div>
        );
    }
}

export default CategoryGrid;

