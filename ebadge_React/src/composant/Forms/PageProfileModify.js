import { Button, TextField, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './PageProfileModify.css';
import Api from '../../utils/Api.js'
import InformationPopup from '../Dashboard/Popups/InformationPopup.js';
import { Link } from 'react-router-dom';
import UserModifyPasswordPopup from '../Dashboard/Popups/UserModifyPasswordPopup.js';
import Loading from '../Loading/LoadingComponent.js';

/**
 * Affiche le formulaire de modfication de mot de passe
 * @returns la page de modification de mot de passe
 * @author Vincent Houle
 */
export default function PageProfileModify() {

    const [user, setUser] = useState();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
    const [oldPasswordError, setOldPasswordError] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [newPasswordConfirmationError, setNewPasswordConfirmationError] = useState("");

    const [loading, setLoading] = useState(false);

    const [route, setRoute] = useState("/");

    const [isOpenConfirmation, setIsOpenConfirmation] = useState(false);

    const [severity, setSeverity] = useState("info");
    const [isOpenInformation, setIsOpenInformation] = useState(false);
    const [messageInfo, setMessageInfo] = useState("");

    // Va chercher l'utilisateur connecté
    useEffect(() => {
        Api.get('/auth/current_user').then((response) => {
            setUser(response.data);

            // Changer la route si ce n'est pas un étudiant
            if (response.data.role_id < 4)
                setRoute("/admin/users");

        }).catch((_) => {
            setSeverity("error");
            setMessageInfo("Une erreur est survenue avec nos serveurs. Veuillez ressayer plus tard ou contactez un admin sur l'onglet contactez-nous.");
            setIsOpenInformation(true);
        })
    }, [])


    // Valide l'ancien mot de passe
    const validateOldPassword = () => {
        setOldPasswordError("");
        if (oldPassword.length === 0) {
            setOldPasswordError('Veuillez entrer votre ancien mot de passe');
            return false;
        } else {
            return true;
        }
    }

    // Valide la confirmation de mot de passe
    const validateNewPassword = () => {
        setNewPasswordError("");
        if (newPassword.length < 6) {
            setNewPasswordError("Veuillez choisir un mot de passe de six caractères et plus");
            return false;
        } else {
            return true;
        }
    }

    // Valide la confirmation de mot de passe
    const validateNewPasswordConfirmation = () => {
        setNewPasswordConfirmationError("");
        if (newPasswordConfirmation != newPassword) {
            setNewPasswordConfirmationError("Les mots de passe ne correspondent pas");
            return false;
        } else {
            return true;
        }
    }

    // Gère la modification de mot de passe
    const handleSubmit = (event) => {
        event.preventDefault();

        setLoading(true);
        if (validateOldPassword() && validateNewPassword() && validateNewPasswordConfirmation()) {
            let formData = new FormData();
            formData.append('id', user.id);
            formData.append('oldPassword', oldPassword);
            formData.append('newPassword', newPassword);

            Api.put('/user/modify-password', {
                id: user.id,
                oldPassword: oldPassword,
                newPassword: newPassword
            }).then((response) => {
                setLoading(false);
                // Si ça marche
                if (response.data.sucess) {
                    setSeverity("success");
                    setMessageInfo(response.data.sucess);
                    setIsOpenInformation(true);
                }
                // Si l'ancien mot de passe n'est pas le bon
                else if (response.data.errorOldPassword) {
                    setSeverity("error");
                    setMessageInfo(response.data.errorOldPassword);
                    setIsOpenInformation(true);
                    setOldPasswordError(response.data.errorOldPassword);
                }
                // Si le nouveau mot de passe est le même que l'ancien
                else if (response.data.errorNewPassword) {
                    setSeverity("error");
                    setMessageInfo(response.data.errorNewPassword);
                    setIsOpenInformation(true);
                    setNewPasswordError(response.data.errorNewPassword);
                }
            }).catch((_) => {
                setLoading(false);
                setSeverity("error");
                setMessageInfo("Une erreur est survenue avec nos serveurs. Veuillez ressayer plus tard ou contactez un admin sur l'onglet contactez-nous.");
                setIsOpenInformation(true);

            });


        }
        handleCloseConfirmation();
    }

    // Actions faits après fermeture de la popup
    const onClosePopupInformation = () => {
        setIsOpenInformation(false);
        setMessageInfo("");

    }

    // Gère la fermeture de la confirmation
    const handleCloseConfirmation = () => {
        setIsOpenConfirmation(false);
    }

    // Gère l'ouverture de la confirmation
    const handleOpenConfirmation = () => {
        if (validateOldPassword() && validateNewPassword() && validateNewPasswordConfirmation()) {
            setIsOpenConfirmation(true);
        }
    }

    return (
        <div className="profile-modify-form">
            <div className="profile-modify-form-container">
                <div className="profile-modify-form-background">
                    {loading ? <Loading></Loading> : null}
                    <div className="profile-modify-form-content">
                        <h1>Modification de mot de passe</h1>
                        <form className='profile-modify' >
                            <TextField
                                id="oldPassword"
                                name="oldPassword"
                                label="Ancien mot de passe"
                                variant="outlined"
                                type="password"
                                onChange={(e) => {
                                    setOldPassword(e.target.value);
                                }}
                                onBlur={validateOldPassword}
                                error={oldPasswordError.length > 0}
                                helperText={oldPasswordError}
                                inputProps={{ maxLength: 60 }}
                                required
                                sx={{ width: '80%', marginTop: '20px' }}
                            />
                            <Typography variant="caption" component={Link} to={"/contactez-nous"}
                                sx={{ margin: '-0.8em 0em -0.8em 0em', paddingLeft: '10px' }}>* Mot de passe oublié</Typography>
                            <TextField
                                id="newPassword"
                                name="newPassword"
                                label="Nouveau mot de passe"
                                variant="outlined"
                                type="password"
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                }}
                                onBlur={validateNewPassword}
                                error={newPasswordError.length > 0}
                                helperText={newPasswordError}
                                inputProps={{ maxLength: 60 }}
                                required
                                sx={{ width: '80%', marginTop: '20px' }}
                            />
                            <TextField
                                id="newPasswordConfirmation"
                                name="newPasswordConfirmation"
                                label="Confirmer le nouveau mot de passe"
                                variant="outlined"
                                type="password"
                                onChange={(e) => {
                                    setNewPasswordConfirmation(e.target.value);
                                }}
                                error={newPasswordConfirmationError.length > 0}
                                helperText={newPasswordConfirmationError}
                                inputProps={{ maxLength: 60 }}
                                required
                                sx={{ width: '80%', marginTop: '20px' }}
                            />
                            <InformationPopup onClose={onClosePopupInformation} isOpen={isOpenInformation} message={messageInfo} severity={severity} />
                            <UserModifyPasswordPopup handleClose={handleCloseConfirmation} isOpen={isOpenConfirmation} handleSubmit={handleSubmit} />
                            <div className="profile-modify-form-button-submit">
                                <Button onClick={handleOpenConfirmation} variant="contained" sx={{
                                    width: '100%',
                                    marginRight: '20px',
                                    marginTop: '20px'
                                }}>Modifier</Button>
                                <Button variant="outlined" component={Link} to={route} sx={{
                                    width: '100%',
                                    marginTop: '20px'
                                }}>Retour</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
