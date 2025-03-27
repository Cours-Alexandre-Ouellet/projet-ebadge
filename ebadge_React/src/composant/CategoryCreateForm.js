import React, { useState } from 'react';
import '@mui/material';
import { Button, FormControl, TextField } from '@mui/material';
import Api from '../utils/Api';
import './CategoryCreateForm.css';

/**
 * Composant du formulaire de création de catégorie
 * 
 * @author Alexandre del Fabbro
 * D'après le code du projet E-Badge
 * Inspiré du code de OpenAi - ChatGPT - [Modèle massif de langage] - chatpgt.com - [Consulté le 27 mars 2025]
 */
export default function CategoryCreateForm({ addCategory, errorCategory, handleClose }) {

    // État pour stocker le nom de la catégorie
    const [categoryName, setCategoryName] = useState('');

    // État pour gérer les erreurs de validation du nom de la catégorie
    const [nameError, setNameError] = useState('');

    /**
     * Fonction qui change la valeur du champ quand on tape dedans
     * @param {*} event 
     */
    const handleCategoryChange = (event) => {
        setCategoryName(event.target.value);
    };

    /**
     * Fonction qui vérifie si le nom est valide
     * @returns boolean 
     */
    const validateName = () => {
        if (categoryName.trim().length === 0) {
            setNameError('Veuillez donner un nom à la catégorie');
            return false;
        }
        setNameError('');
        return true;
    };

    /**
     * fonction qui envoie les données au serveur
     * @param {*} event 
     */
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateName()) return;

        try {
            const formData = new FormData();
            formData.append('name', categoryName);

            const response = await Api.post('/category', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            addCategory(response.data);
            handleClose();
        } catch (error) {
            errorCategory('Erreur lors de la création de la catégorie');
            console.error(error);
        }
    };

    return (
        <div className="category-create-form">
            <div className="category-create-form-container">
                <div className="category-create-form-background">
                <div className="category-create-form-content">
            <h1>Créer une catégorie</h1>
            <FormControl className="create-category" onSubmit={handleSubmit}>
                <TextField
                    name="name"
                    label="Nom"
                    variant="outlined"
                    value={categoryName}
                    onChange={handleCategoryChange}
                    onBlur={validateName}
                    error={Boolean(nameError)}
                    helperText={nameError}
                    inputProps={{ maxLength: 45 }}
                    required
                    sx={{ width: '80%', marginTop: '20px' }}
                />
                
                <div className="category-create-form-button-submit">
                    <Button variant="outlined" onClick={handleClose} sx={{
                        width: '100%',
                        marginTop: '20px',
                        marginRight: '20px',
                    }}>Annuler</Button>
                    <Button type="submit" variant="contained" sx={{
                        width: '100%',
                        marginTop: '20px',
                    }}>Créer</Button>
                </div>
            </FormControl>
            </div>
            </div>
            </div>
        </div>
    );
};

