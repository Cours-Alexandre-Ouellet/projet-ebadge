import { useState, useEffect, useCallback } from "react";
import './CategoryBadgesPopup.css';
import Api from '../../../../utils/Api';
import { 
    FormControl, TextField, Button, Avatar, 
    Dialog, DialogContent, DialogTitle, DialogContentText, 
    Alert, Snackbar, Backdrop, CircularProgress,
    Autocomplete
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';

/**
 * Composant qui affiche une popup pour assigner des badges à une catégorie
 * 
 * Auteur: Alexandre del Fabbro - [alexandre.delfabbro@gmail.com]
 * D'après le code du projet eBadge
 * Inspiré de: OpenAi - ChatGPT [Modèle massif de langage] - chat.openai.com - [Consulté le 14 mars 2025]
 * 
 * @param {any} isOpen - Etat d'ouverture de la popup
 * @param {any} handleClose - Fonction de fermeture de la popup
 * @param {any} selectedCategory - Catégorie sélectionnée 
 * @returns {React.JSX.Element} - Elément React représentant la popup
 */
const CategoryBadgesPopup = ({ isOpen, handleClose, selectedCategory }) => {

    // Nombre de chargements en cours
    const [loadingCount, setLoadingCount] = useState(0);
    // Badges restants à assigner
    const [leftBadges, setLeftBadges] = useState([]);
    // Badges déjà assignés
    const [ownBadges, setOwnBadges] = useState([]);
    // Message de succès
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    // ID du badge à assigner
    const [badgeIdToAssign, setBadgeIdToAssign] = useState(0);
    // Message d'erreur
    const [badgeIdToAssignErrorMessage, setBadgeIdToAssignErrorMessage] = useState('');

    // Fonctions pour ajouter ou retirer un chargement
    const addStep = () => setLoadingCount(count => count + 1);
    const removeStep = () => setLoadingCount(count => Math.max(0, count - 1));

    // Fonctions pour rafraîchir les badges restants
    const refreshPendingBadges = useCallback(() => {
        addStep();
        Api.get(`/category/${selectedCategory.id}/badges-left`)
            .then(response => setLeftBadges(response.data.badges))
            .catch(console.error)
            .finally(removeStep);
    }, [selectedCategory.id]);

    // Fonctions pour rafraîchir les badges assignés
    const refreshOwnBadges = useCallback(() => {
        addStep();
        Api.get(`/category/${selectedCategory.id}/badges`)
            .then(response => setOwnBadges(response.data.badges))
            .catch(console.error)
            .finally(removeStep);
    }, [selectedCategory.id]);

    // Fonction pour rafraîchir les assignations de badges
    const refreshBadgesAssignation = useCallback(async (delay = false) => {
        addStep();
        setTimeout(() => {
            refreshOwnBadges();
            refreshPendingBadges();
            removeStep();
            setBadgeIdToAssign(0);
            setBadgeIdToAssignErrorMessage('');
        }, delay ? 500 : 0);
    }, [refreshOwnBadges, refreshPendingBadges]);

    // Fonction pour retirer un badge
    const removeBadge = useCallback((badgeId) => {
        addStep();
        Api.post('/category/remove-badge', { category_id: selectedCategory.id, badge_id: badgeId })
            .then(() => refreshBadgesAssignation())
            .catch(console.error)
            .finally(removeStep);
    }, [selectedCategory.id, refreshBadgesAssignation]);

    useEffect(() => {
        if (isOpen) {
            refreshBadgesAssignation();
        }
    }, [isOpen, refreshBadgesAssignation]);

    // Fonction pour gérer la soumission du formulaire
    const handleSubmit = (event) => {
        event.preventDefault();

        if (badgeIdToAssign === 0) {
            setBadgeIdToAssignErrorMessage('Veuillez sélectionner un badge');
            return;
        }

        addStep();
        Api.post('/category/assign-badge', {
            category_id: selectedCategory.id,
            badge_id: badgeIdToAssign
        })
            .then(() => {
                refreshBadgesAssignation();
                setShowSuccessMessage(true);
            })
            .catch(console.error)
            .finally(removeStep);
    };

    // Colonnes du tableau de badges assignés
    const columns = [
        // L'image du badge
        {
            field: 'imagePath', headerName: 'Image', width: 70,
            renderCell: (params) => <Avatar alt={params.row.title} src={params.row.imagePath} />
        },
        // Le titre du badge
        { field: 'title', headerName: 'Titre', flex: 1 },
        // L'action pour retirer le badge
        {
            field: "removeBadgeAction",
            minWidth: 200,
            headerName: "",
            sortable: false,
            renderCell: (params) => (
                // Bouton pour retirer le badge
                <Button variant="outlined" onClick={() => removeBadge(params.row.id)}>
                    Retirer le badge
                </Button>
            )
        }
    ];

    return (
        <Dialog open={isOpen} onClose={handleClose}>
            {/* Titre de la popup */}
            <DialogTitle>Assignation des badges</DialogTitle>
            <DialogContent className="category-popup">
                <DialogContentText>
                    {/* Affichage du chargement */}
                    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loadingCount > 0}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    {/* Affichage du message de succès */}
                    <Snackbar open={showSuccessMessage} autoHideDuration={3000} onClose={() => setShowSuccessMessage(false)}>
                        <Alert severity="success" sx={{ width: '100%' }}>
                            Le badge a été assigné avec succès !
                        </Alert>
                    </Snackbar>

                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth>
                            {/* Champ de sélection du badge à assigner */}
                            <Autocomplete
                                id="badge-select"
                                options={leftBadges}
                                getOptionLabel={(option) => option.title}
                                value={leftBadges.find(badge => badge.id === badgeIdToAssign) || null}
                                onChange={(event, newValue) => setBadgeIdToAssign(newValue ? newValue.id : null)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Badge à assigner"
                                        variant="outlined"
                                        error={!!badgeIdToAssignErrorMessage}
                                        labelId="badge-select-label"
                                        />
                                )}
                                renderOption={(props, option) => (
                                    <li {...props}>
                                    <Avatar alt={option.title} src={option.imagePath} sx={{ marginRight: 1 }} />
                                    {option.title}
                                    </li>
                                )}
                                noOptionsText="Aucun badge disponible"
                                />
                        </FormControl>
                        
                        <FormControl fullWidth sx={{ paddingTop: '20px' }}>
                            {/* Bouton de soumission du formulaire */}
                            <Button variant="contained" className="mt-2" type="submit">Assigner le badge</Button>
                        </FormControl>
                    </form>

                    <hr />
                    Liste des badges de la catégorie
                    {/* Tableau des badges assignés */}
                    <DataGrid
                        autoHeight
                        rows={ownBadges}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                    />
                    <hr />
                    {/* Bouton pour fermer la popup */}
                    <Button variant="outlined" onClick={handleClose} className="category-button">
                        Fermer
                    </Button>
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
};

export default CategoryBadgesPopup;