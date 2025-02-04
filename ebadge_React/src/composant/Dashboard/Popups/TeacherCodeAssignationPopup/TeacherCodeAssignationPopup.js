import React, { useState, useEffect } from "react";
import "./TeacherCodeAssignationPopup.css";
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

export default function TeacherCodeAssignationPopup({ isOpen, handleClose, teacherCode, teacherCodeId }) {
    const [loading, setLoading] = useState(false);
    const [loadingCount, setLoadingCount] = useState(0);
    const [users, setUsers] = useState([]);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        setSelectedUser(null);
        refreshUsers();
    }, [isOpen]);

    const refreshUsers = () => {
        addStep();
        Api.get(`/user/role/${RoleIds.Student}`)
            .then((response) => {
                setUsers(response.data.users ?? []);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                removeStep();
            });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        setLoading(true);

        Api.put("/teacher-code", {
            user_id: selectedUser,
            teacher_code_id: teacherCodeId,
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
            <DialogTitle>Assignation du code enseignant <b>{teacherCode}</b> à un utilisateur</DialogTitle>
            <DialogContent className={"teacher-code-popup"}>
                <DialogContentText>
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={loading}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>

                    <Snackbar onClose={handleCloseSuccessMessage} open={showSuccessMessage} autoHideDuration={3000}>
                        <Alert onClose={handleCloseSuccessMessage} severity="success" sx={{ width: '100%' }} md={{ minWidth: '300px' }}>
                            Le code enseignant a été assigné !
                        </Alert>
                    </Snackbar>
                    <form>
                        <FormControl fullWidth>
                            <InputLabel id="teacher-code-select-label">Sélectionner un utilisateur</InputLabel>
                            <Select
                                id="teacher-code-select"
                                label="Enseignant à assigner"
                                name="userIdToAssign"
                                labelId="teacher-code-select-label"
                                className="teacher-code-selector"
                                value={selectedUser}
                                onChange={(event) => {
                                    setSelectedUser(event.target.value);
                                }}
                            >
                                {
                                    users.length === 0 ? <MenuItem disabled value={0}>Aucun enseignant disponible</MenuItem> :
                                        users.map((user, index) => {
                                            return (
                                                <MenuItem value={user.id} key={index}>
                                                    <div className="teacher-code-row">
                                                        <Avatar className="teacher-code" alt={"Avatar"} src={user.avatarImagePath} />
                                                        {`${user.first_name} ${user.last_name}`}
                                                    </div>
                                                </MenuItem>)
                                        }
                                        )
                                }
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <Button variant="contained" className={"mt-2"} onClick={handleSubmit} >Assigner le code enseignant</Button>
                        </FormControl>

                    </form>
                </DialogContentText>
            </DialogContent>
        </Dialog >
    );
}