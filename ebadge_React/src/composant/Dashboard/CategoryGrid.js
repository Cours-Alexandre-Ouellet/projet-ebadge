import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, Slide } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import CategoryDeleteAction from './CategoryDeletePopup';
import CategoryUpdateForm from '../CategoryUpdateForm';
import CategoryBadgesPopup from './Popups/CategoryBadgesPopup/CategoryBadgesPopup';


const Transition = React.forwardRef((props, ref) => (
    <Slide direction="up" ref={ref} {...props} />
));


/**
 * Composant qui affiche les catégories sous forme de tableau
 */
const CategoryGrid = ({ rows = [], deleteCategory, editCategory, errorCategory }) => {
    const [pageSize, setPageSize] = useState(5);
    const [openAssignDialog, setOpenAssignDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const columns = [
        { field: 'id', headerName: 'ID', flex: 0.5, align: 'center', headerAlign: 'center' },
        { field: 'name', headerName: 'Nom', flex: 2, headerAlign: 'center' },
        {
            field: 'assignAction',
            minWidth: 150,
            headerName: '',
            sortable: false,
            align: 'center',
            renderCell: (params) => {
                const onClick = (e) => {
                    e.stopPropagation();
                    setSelectedCategory(params.row);
                    setOpenAssignDialog(true);
                };

                return <Button variant="outlined" onClick={onClick}>Assigner badge</Button>;
            },
        },
        {
            field: 'editAction',
            minWidth: 150,
            headerName: '',
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCategory(params.row);
                        setOpenEditDialog(true);
                    }}
                    startIcon={<Edit />}
                >
                    Modifier
                </Button>
            )
        },
        {
            field: 'deleteAction',
            minWidth: 150,
            headerName: '',
            align: 'center',
            headerAlign: 'center',
            sortable: false,
            renderCell: (params) => (
                <Button
                    variant="outlined"
                    color='error'
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCategory(params.row);
                        setOpenDeleteDialog(true);
                    }}
                    startIcon={<Delete />}
                >
                    Supprimer
                </Button>
            )
        }
    ];

    return (
        <div style={{ height: 600, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                rowHeight={100}
                pageSize={pageSize}
                rowsPerPageOptions={[5, 10, 15, 20, 25, 30, 35, 40, 45, 50]}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            />

            <CategoryDeleteAction
                isOpen={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                selectedCategory={selectedCategory}
                deleteCategory={deleteCategory}
                errorCategory={errorCategory}
            />

            <Dialog
                fullScreen
                open={openEditDialog}
                onClose={() => setOpenEditDialog(false)}
                TransitionComponent={Transition}
            >
                <CategoryUpdateForm
                    handleClose={() => setOpenEditDialog(false)}
                    editCategory={editCategory}
                    selectedCategory={selectedCategory}
                    errorCategory={errorCategory}
                />
            </Dialog>

            {selectedCategory && (
                <CategoryBadgesPopup
                    isOpen={openAssignDialog}
                    handleClose={() => setOpenAssignDialog(false)} 
                    selectedCategory={selectedCategory}
                    
                />)}
        </div>
    );
};

export default CategoryGrid;
