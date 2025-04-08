import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, Slide } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import CategoryDeleteAction from './CategoryDeletePopup';
import CategoryUpdateForm from '../CategoryUpdateForm';
import CategoryBadgesPopup from './Popups/CategoryBadgesPopup/CategoryBadgesPopup';


// Transition pour l'affichage en glissement du Dialog (modale) d'édition
const Transition = React.forwardRef((props, ref) => (
    <Slide direction="up" ref={ref} {...props} />
));

// Récupération du rôle de l'utilisateur depuis le localStorage
const role = localStorage.getItem('role');


/**
 * Composant qui affiche les catégories sous forme de tableau
 * 
 * @author Alexandre del Fabbro
 * D'après le code du projet E-Badge
 * Inspiré du code de OpenAi - ChatGPT - [Modèle massif de langage] - chatpgt.com - [Consulté le 27 mars 2025]
 */
const CategoryGrid = ({ rows = [], deleteCategory, editCategory, errorCategory }) => {

    // État pour gérer la pagination du tableau
    const [pageSize, setPageSize] = useState(5);

    // États pour gérer l'ouverture des différentes modales (popups)
    const [openAssignDialog, setOpenAssignDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);

    // Stocke la catégorie actuellement sélectionnée (pour édition ou suppression)
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Définition des colonnes du tableau
    const columns = [
        // Colonne pour l'ID de la catégorie
        { 
            field: 'id',
            headerName: 'ID', 
            flex: 0.2, 
            align: 'center', 
            headerAlign: 'center',
            renderCell: (params) => {
                return (
                <div
                    style={{
                        borderLeft: `15px solid ${params.row.color || 'transparent'}`,
                        width: '100%',
                        textAlign: 'center',
                        lineHeight: '100px',
                    }}
                    >
                        {params.value}
                    </div>
                );
            },
        },

        // Colonne pour le nom de la catégorie
        { field: 'name', headerName: 'Nom', flex: 2, headerAlign: 'center' },

        // Colonne pour l'action d'assignation de badge
        {
            field: 'assignAction',
            minWidth: 150,
            headerName: '',
            sortable: false,
            align: 'center',
            renderCell: (params) => {
                // Fonction appelée lors du clic sur le bouton "Assigner badge"
                const onClick = (e) => {
                    e.stopPropagation(); // Empêche la sélection de la ligne
                    setSelectedCategory(params.row); // Définit la catégorie sélectionnée
                    setOpenAssignDialog(true); // Ouvre la popup d'assignation
                };

                return <Button variant="outlined" onClick={onClick}>Assigner badge</Button>;
            },
        },

        // Colonnes supplémentaires visibles uniquement pour les administrateurs
        ...(role === 'Administrateur' ? [
            // Colonne pour l'action de modification
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
                            e.stopPropagation(); // Empêche la sélection de la ligne
                            setSelectedCategory(params.row); // Définit la catégorie sélectionnée
                            setOpenEditDialog(true); // Ouvre la popup d'édition
                        }}
                        startIcon={<Edit />}
                    >
                        Modifier
                    </Button>
                )
            },

            // Colonne pour l'action de suppression
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
                            e.stopPropagation(); // Empêche la sélection de la ligne
                            setSelectedCategory(params.row); // Définit la catégorie sélectionnée
                            setOpenDeleteDialog(true); // Ouvre la popup de suppression
                        }}
                        startIcon={<Delete />}
                    >
                        Supprimer
                    </Button>
                )
            }
        ] : [])
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
