import React, { useState } from "react";
import './Signup.css';
import '@mui/material';
import { Button, TextField, Checkbox, FormControlLabel } from '@mui/material';
import Api from '../../utils/Api';
import Loading from '../../composant/Loading/LoadingComponent';
import { Navigate } from "react-router-dom";

/**
 * 
 * @returns La page de création de compte
 * @author Vincent Houle
 */
export default function Signup() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [teacherCode, setTeacherCode] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const [showTeacherCode, setShowTeacherCode] = useState(false);

    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
        teacher_code: ""
    })

    const formatEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    //fonction qui envoie les données au serveur pour créer un nouvel utilisateur
    const handleSubmit = (event) => {
        setErrors({
            username: "",
            email: "",
            password: "",
            first_name: "",
            last_name: "",
            teacher_code: ""
        });
        event.preventDefault();
        if (validateEmail() && validateFirstName() && validateLastName() && validateUsername() &&
            validatePassword() && validatePassword2()) {

            setIsLoading(true);

            const formData = new FormData();
            formData.append('username', username);
            formData.append('email', email);
            formData.append('password', password);
            formData.append('first_name', firstName);
            formData.append('last_name', lastName);

            //Si le code de professeur est affiché, on l'ajoute aux données         
            if (showTeacherCode)
                formData.append('teacher_code', teacherCode);

            // On envoie les données au serveur pour créer un nouvel utilisateur
            Api.post('/auth/signup', formData)
                .then((response) => {
                    localStorage.setItem('token', response.data.access_token);
                    localStorage.setItem('username', response.data.user.username);
                    setRedirect(true);
                    setIsLoading(false);
                })
                .catch((error) => {
                    if (error.response.status === 422) {
                        for (const [key, value] of Object.entries(error.response.data.errors)) {
                            setErrors((prevState) => ({ ...prevState, [key]: value[0] }));
                        }
                        setIsLoading(false);
                    }
                });
        }
    }


    // Validation du nom d'utilisateur
    const validateUsername = () => {
        setErrors((prevState) => ({ ...prevState, username: "" }));
        if (username.length == 0) {
            setErrors((prevState) => ({
                ...prevState,
                username: "Veuillez choisir votre nom d'utilisateur."
            }));
            return false;
        }

        else if (username.length > 50 || username.length < 2) {
            setErrors((prevState) => ({
                ...prevState,
                username: "Votre nom d'utilisateur ne peut contenir qu'entre 2 à 50 caractères."
            }));
            return false;

        }
        return true;
    }

    const validateEmail = () => {
        setErrors((prevState) => ({ ...prevState, email: "" }));

        if (email.length == 0) {
            setErrors((prevState) => ({
                ...prevState,
                email: "Veuillez choisir votre adresse électronique."
            }));
            return false;
        }
        else if (!formatEmail.test(email)) {
            setErrors((prevState) => ({
                ...prevState,
                email: "Votre format d'adresse électronique est incorrecte."
            }));
            return false;
        }
        else if (email.length > 125) {
            setErrors((prevState) => ({ ...prevState, email: "Votre adresse électronique ne peut contenir que 125 caractères." }));
            return false;

        }
        return true;
    }

    const validatePassword = () => {
        setErrors((prevState) => ({ ...prevState, password: "" }));
        if (password.length == 0) {
            setErrors((prevState) => ({
                ...prevState,
                password: "Veuillez choisir votre mot de passe."
            }));
            return false;
        }
        else if (password.length > 60 || password.length < 6) {
            setErrors((prevState) => ({
                ...prevState,
                password: "Votre mot de passe ne peut contenir qu'entre 6 et 60 caractères."
            }));
            return false;

        }
        return true;
    }

    const validatePassword2 = () => {
        setErrors((prevState) => ({ ...prevState, password: "" }));
        if (password2 != password) {
            setErrors((prevState) => ({
                ...prevState,
                password: "Vos mots de passe doivent être identiques."
            }));
            return false;
        }
        return true;

    }

    const validateFirstName = () => {
        setErrors((prevState) => ({ ...prevState, first_name: "" }));
        if (firstName.length == 0) {
            setErrors((prevState) => ({
                ...prevState,
                first_name: "Veuillez indiquer votre prénom."
            }));
            return false;
        }

        else if (firstName.length > 60 || firstName.length < 2) {
            setErrors((prevState) => ({
                ...prevState,
                first_name: "Votre prénom ne peut contenir qu'entre 2 à 60 caractères."
            }));
            return false;

        }
        return true;
    }
    const validateLastName = () => {
        setErrors((prevState) => ({ ...prevState, last_name: "" }));
        if (lastName.length == 0) {
            setErrors((prevState) => ({
                ...prevState,
                last_name: "Veuillez indiquer votre nom de famille."
            }));
            return false;
        }

        else if (lastName.length > 60 || lastName.length<2) {
            setErrors((prevState) => ({
                ...prevState,
                last_name: "Votre nom de famille ne peut contenir qu'entre 2 à 60 caractères."
            }));
            return false;

        }
        return true;
    }



    // Popup de confirmation de courriel

    return (
        <div className="signup">
            {!redirect || <Navigate to="/" />
            }
            <div className="signup-container">
                <div className="signup-background"></div>
                <div className="signup-right">
                    <div className="signup-right-content">
                        <h2 className="titre-creer-compte">Créer un compte</h2>
                        <form
                            id="signup-form"
                            className="signup-form"
                        >
                            <TextField
                                id="identifier"
                                name="identifier"
                                label="Adresse courriel"
                                variant="outlined"
                                margin="normal"
                                helperText={errors.email}
                                error={errors.email.length != 0}
                                onChange={(e) =>setEmail(e.target.value)}
                                onBlur={validateEmail}
                                required
                                sx={{ width: '100%' }}
                                size="small"
                            />
                            <TextField
                                id="first_name"
                                name="first_name"
                                label="Prénom"
                                variant="outlined"
                                margin="normal"
                                helperText={errors.first_name}
                                error={errors.first_name.length != 0}
                                onChange={(e) => setFirstName(e.target.value)}
                                onBlur={validateFirstName}
                                required
                                sx={{ width: '100%' }}
                                size="small"
                            />
                            <TextField
                                id="last_name"
                                name="last_name"
                                label="Nom de famille"
                                variant="outlined"
                                margin="normal"
                                helperText={errors.last_name}
                                error={errors.last_name.length != 0}
                                onChange={(e) => setLastName(e.target.value)}
                                onBlur={validateLastName}
                                required
                                sx={{ width: '100%' }}
                                size="small"
                            />
                            <TextField
                                id="username"
                                name="username"
                                label="Nom d'utilisateur"
                                variant="outlined"
                                margin="normal"
                                helperText={errors.username}
                                error={errors.username.length != 0}
                                onChange={(e) => setUsername(e.target.value)}
                                onBlur={validateUsername}
                                required
                                sx={{ width: '100%' }}
                                size='small'
                            />

                            <TextField
                                id="password"
                                type="password"
                                name="password"
                                label="Mot de passe"
                                variant="outlined"
                                margin="normal"
                                helperText={errors.password}
                                error={errors.password.length != 0}
                                onChange={(e) => setPassword(e.target.value)}
                                onBlur={validatePassword}
                                required
                                sx={{ width: '100%' }}
                                size='small'
                            />
                            <TextField
                                id="password2"
                                type="password"
                                name="password2"
                                label="Confirmer le mot de passe"
                                variant="outlined"
                                margin="normal"
                                helperText={errors.password}
                                error={errors.password.length != 0}
                                onChange={(e) => setPassword2(e.target.value)}
                                required
                                sx={{ width: '100%' }}
                                size='small'
                            />

                            <FormControlLabel control={
                                <Checkbox
                                    id="show_teacher_code"
                                    name="show_teacher_code"
                                    label="Compte enseignant"
                                    onChange={(e) => setShowTeacherCode(e.target.checked)}
                                />
                            } label="Compte enseignant" />
                            <div hidden={!showTeacherCode} className="hidden-div">

                                <TextField
                                    id="teacher_code"
                                    name="teacher_code"
                                    label="Code d'enseignant"
                                    variant="outlined"
                                    margin="normal"
                                    helperText={errors.teacher_code}
                                    error={errors.teacher_code.length != 0}
                                    onChange={(e) => setTeacherCode(e.target.value)}
                                    sx={{ width: '100%' }}
                                    size='small'
                                />
                            </div>

                            <Button
                                variant="contained"
                                form="signup-form"
                                onClick={(e) => handleSubmit(e)}
                            >
                                Créer un compte
                            </Button>
                            <p>Vous avez déjà un compte ? <a href="/auth/login">Se connecter</a></p>
                        </form>
                    </div>
                </div>
            </div>
            {!isLoading || <Loading></Loading>}
        </div>
    )

}
