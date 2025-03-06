import React, { useState, useEffect } from "react";
import "./CategoryAssignationPopup.css";
import Api from "../../../../utils/Api";

import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Avatar,
} from "@mui/material";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogContentText,
} from "@mui/material";
import { Alert, Snackbar } from "@mui/material";
import { Backdrop, CircularProgress } from "@mui/material";
import { RoleIds } from "../../../../policies/Role";

export default function CategoryAssignationPopup({ isOpen, handleClose, category, categoryId }) {
    const [loading, setLoading] = useState(false);
    const [loadingCount, setLoadingCount] = useState(0);
    const [badges, setBadges] = useState([]);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [selectedBadge, setSelectedBadge] = useState(null);

    useEffect(() => {
        setSelectedBadge(null);
        refreshBadges();
    }, [isOpen]);

    /**
     * Rafraîchissement de la liste des utilisateurs
     */
    const refreshBadges = () => {
        addStep();
        Api.get('/badge')
            .then((response) => {
                setBadges(response.data.badges ?? []);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                removeStep();
            });
    };

    /**
     * Soumission du formulaire
     * @param {*} event 
     */
    const handleSubmit = (event) => {
        event.preventDefault();

        setLoading(true);

        Api.put("/category/assign", {
            idBadge: selectedBadge,
            idCategory: categoryId,
        })
            .then((_) => {
                handleClose();
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    /**
     * Fermeture du message de succès
     */
    const handleCloseSuccessMessage = () => {
        setShowSuccessMessage(false);
    };

    /**
     * Ajout d'une étape à la barre de chargement
     */
    const addStep = () => {
        setLoadingCount(prev => prev + 1);

        if (loadingCount > 0 && !loading) {
            setLoading(true);
        }
    }

    /**
     * Enlever une étape à la barre de chargement
     */
    const removeStep = () => {
        setLoadingCount(prev => prev - 1);

        if (loadingCount < 0) {
            loadingCount = 0;
        }

        if (loadingCount <= 0 && loading) {
            setLoading(false);
        }
    }

    return (
        <Dialog open={isOpen ?? false} onClose={handleClose}>
            <DialogTitle>Assignation de badges à la catégorie <b>{category}</b></DialogTitle>
            <DialogContent className={"category-popup"}>
                <DialogContentText>
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={loading}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>

                    <Snackbar onClose={handleCloseSuccessMessage} open={showSuccessMessage} autoHideDuration={3000}>
                        <Alert onClose={handleCloseSuccessMessage} severity="success" sx={{ width: '100%' }} md={{ minWidth: '300px' }}>
                            Les badges ont été assignés!
                        </Alert>
                    </Snackbar>
                    <form>
                        <FormControl fullWidth>
                            <InputLabel id="category-select-label">Sélectionner un utilisateur</InputLabel>
                            <Select
                                id="category-select"
                                label="Badge à assigner"
                                name="badgeIdToAssign"
                                labelId="category-select-label"
                                className="category-selector"
                                value={selectedBadge ?? ""}
                                onChange={(event) => {
                                    setSelectedBadge(event.target.value);
                                }}
                            >
                                {
                                    badges.length === 0 ? <MenuItem disabled value={0}>Aucun badge disponible</MenuItem> :
                                        badges.map((user, index) => {
                                            return (
                                                <MenuItem value={user.id} key={index}>
                                                    <div className="category-row">
                                                        <Avatar className="category-code" alt={"Avatar"} src={user.avatarImagePath} />
                                                        {`${badges.title}`}
                                                    </div>
                                                </MenuItem>)
                                        }
                                        )
                                }
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <Button variant="contained" className={"mt-2"} onClick={handleSubmit} >Assigner les badges</Button>
                        </FormControl>

                    </form>
                </DialogContentText>
            </DialogContent>
        </Dialog >
    );
}