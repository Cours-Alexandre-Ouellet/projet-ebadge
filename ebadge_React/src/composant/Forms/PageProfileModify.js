import { Button, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './PageProfileModify.css';
import Api from '../../utils/Api.js'

export default function PageProfileModify() {

    const [user, setUser] = useState();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
    const [oldPasswordError, setOldPasswordError] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [newPasswordConfirmationError, setNewPasswordConfirmationError] = useState("");


    // Va chercher l'utilisateur connecter
    useEffect(() => {
        Api.get('/auth/current_user').then((response) => {
            setUser(response.data);
        }).catch((error) => {
            console.log(error);
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

    const validateNewPassword = () => {
        setNewPasswordError("");
        if (newPassword.length === 0) {
            setNewPasswordError("Veuillez choisir un mot de passe plus long.");
            return false;
        } else {
            return true;
        }
    }

    const validateNewPasswordConfirmation = () => {
        setNewPasswordConfirmationError("");
        if (newPasswordConfirmation != newPassword) {
            setNewPasswordConfirmationError("Les mots de passe ne correspondent pas");
            return false;
        } else {
            return true;
        }
    }


    const handleSubmit = (event) => {


        if (validateOldPassword() && validateNewPassword() && validateNewPasswordConfirmation()) {
            let formData = new FormData();
            formData.append('id', user.id);
            formData.append('oldPassword', oldPassword);
            formData.append('newPassword', newPassword);

            event.preventDefault();
            Api.post('/user/modify-password', {
                id: user.id,
                oldPassword : oldPassword,
                newPassword : newPassword
            }).then((response) => {
                console.log(response);
            }).catch((error) => {
                console.log(error);
            })
        }
    }

    return (
        <div className="profile-modify-form">
            <div className="profile-modify-form-container">
                <div className="profile-modify-form-background">
                    <div className="profile-modify-form-content">
                        <h1>Modifier son profile</h1>
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
                            <div className="profile-modify-form-button-submit">
                                <Button variant="outlined" sx={{
                                    width: '100%',
                                    marginTop: '20px',
                                    marginRight: '20px'
                                }}>Annuler</Button>
                                <Button onClick={handleSubmit} variant="contained" sx={{
                                    width: '100%',
                                    marginTop: '20px'
                                }}>Modifier</Button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}
