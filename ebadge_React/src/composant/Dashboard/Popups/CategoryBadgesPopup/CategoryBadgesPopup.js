import { useState, useEffect, useCallback } from "react";
import './CategoryBadgesPopup.css';
import Api from '../../../../utils/Api';
import { 
    FormControl, InputLabel, Select, MenuItem, Button, Avatar, 
    Dialog, DialogContent, DialogTitle, DialogContentText, 
    Alert, Snackbar, Backdrop, CircularProgress
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';

const CategoryBadgesPopup = ({ isOpen, handleClose, selectedCategory }) => {

    const [loadingCount, setLoadingCount] = useState(0);
    const [leftBadges, setLeftBadges] = useState([]);
    const [ownBadges, setOwnBadges] = useState([]);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [badgeIdToAssign, setBadgeIdToAssign] = useState(0);
    const [badgeIdToAssignErrorMessage, setBadgeIdToAssignErrorMessage] = useState('');

    const addStep = () => setLoadingCount(count => count + 1);
    const removeStep = () => setLoadingCount(count => Math.max(0, count - 1));

    const refreshPendingBadges = useCallback(() => {
        addStep();
        Api.get(`/category/${selectedCategory.id}/badges-left`)
            .then(response => setLeftBadges(response.data.badges))
            .catch(console.error)
            .finally(removeStep);
    }, [selectedCategory.id]);

    const refreshOwnBadges = useCallback(() => {
        addStep();
        Api.get(`/category/${selectedCategory.id}/badges`)
            .then(response => setOwnBadges(response.data.badges))
            .catch(console.error)
            .finally(removeStep);
    }, [selectedCategory.id]);

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

    const columns = [
        {
            field: 'imagePath', headerName: 'Image', width: 70,
            renderCell: (params) => <Avatar alt={params.row.title} src={params.row.imagePath} />
        },
        { field: 'title', headerName: 'Titre', flex: 1 },
        {
            field: "removeBadgeAction",
            minWidth: 200,
            headerName: "",
            sortable: false,
            renderCell: (params) => (
                <Button variant="outlined" onClick={() => removeBadge(params.row.id)}>
                    Retirer le badge
                </Button>
            )
        }
    ];

    return (
        <Dialog open={isOpen} onClose={handleClose}>
            <DialogTitle>Assignation des badges</DialogTitle>
            <DialogContent className="category-popup">
                <DialogContentText>
                    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loadingCount > 0}>
                        <CircularProgress color="inherit" />
                    </Backdrop>

                    <Snackbar open={showSuccessMessage} autoHideDuration={3000} onClose={() => setShowSuccessMessage(false)}>
                        <Alert severity="success" sx={{ width: '100%' }}>
                            Le badge a été assigné avec succès !
                        </Alert>
                    </Snackbar>

                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth>
                            <InputLabel id="badge-select-label">Badge à assigner</InputLabel>
                            <Select
                                id="badge-select"
                                required
                                labelId="badge-select-label"
                                value={badgeIdToAssign}
                                error={!!badgeIdToAssignErrorMessage}
                                onChange={(e) => setBadgeIdToAssign(e.target.value)}
                            >
                                {leftBadges.length === 0 ? (
                                    <MenuItem disabled value={0}>Aucun badge disponible</MenuItem>
                                ) : (
                                    leftBadges.map(badge => (
                                        <MenuItem value={badge.id} key={badge.id}>
                                            <div className="category-row">
                                                <Avatar className="category" alt={badge.title} src={badge.imagePath} />
                                                {badge.title}
                                            </div>
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <Button variant="contained" className="mt-2" type="submit">Assigner le badge</Button>
                        </FormControl>
                    </form>

                    <hr />
                    Liste des badges de la catégorie
                    <DataGrid
                        autoHeight
                        rows={ownBadges}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                    />
                    <hr />
                    <Button variant="outlined" onClick={handleClose} className="category-button">
                        Fermer
                    </Button>
                </DialogContentText>
            </DialogContent>
        </Dialog>
    );
};

export default CategoryBadgesPopup;