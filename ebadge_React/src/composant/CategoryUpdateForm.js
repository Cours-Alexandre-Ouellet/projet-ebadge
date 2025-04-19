import React, { useState, useEffect} from 'react';
import { Button, FormControl, TextField, Box } from '@mui/material';
import Api from '../utils/Api.js';
import './CategoryCreateForm.css';
import { MuiColorInput } from 'mui-color-input'

/**
 * Composant du formulaire de modification d'une catégorie
 * 
 * D'après le code du projet E-Badge
 * Inspiré du code de OpenAi - ChatGPT - [Modèle massif de langage] - chatpgt.com - [Consulté le 27 mars 2025]
 */
export default function CategoryUpdateForm ({ selectedCategory, editCategory, errorCategory, handleClose }) {
    const [category, setCategory] = useState({
        id: 0,
        name: '',
        color: '#FFFFFF'
    });

    const [nameError, setNameError] = useState('');

    useEffect(() => {
        if (selectedCategory) {
            setCategory(selectedCategory);
        }
    }, [selectedCategory]);

    // Fonction pour gérer le changement de nom de la catégorie
    const handleCategoryChange = (event) => {
        const { name, value } = event.target;
        setCategory(prev => ({ ...prev, [name]: value }));
    };

    // Fonction pour gérer le changement de couleur de la catégorie
    const handleColorChange = (newColor) => {
        setCategory(prev => ({ ...prev, color: newColor }));
    };

    // Fonction pour valider le nom de la catégorie
    const validateName = () => {
        if (!category.name.trim()) {
            setNameError('Veuillez donner un nom à la catégorie.');
            return false;
        }
        setNameError('');
        return true;
    };

    // Fonction pour gérer la soumission du formulaire
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!validateName()) return;

        Api.put('/category', category)
            .then((response) => {
                editCategory(response.data);
                handleClose();
            })
            .catch((error) => {
                console.error(error);
                errorCategory('Une erreur est survenue');
            });
    };

    // Constante de comparaison pour vérifier si la catégorie n'a pas changé
    const isUnchanged = category.name === selectedCategory?.name && category.color === selectedCategory?.color;

    return (
        <div className="category-create-form">
            <div className="category-create-form-container">
                <div className="category-create-form-background">
                    <div className="category-create-form-content">
                        <h1>Modifier une catégorie</h1>
                        <form className='create-category' onSubmit={handleSubmit}>
                            <TextField
                                id="name"
                                name="name"
                                label="Nom"
                                variant="outlined"
                                value={category.name}
                                onChange={handleCategoryChange}
                                onBlur={validateName}
                                error={!!nameError}
                                helperText={nameError}
                                inputProps={{ maxLength: 45 }}
                                required
                                sx={{ width: '80%', marginTop: '20px' }}
                            />
                            <Box sx={{ marginTop: '20px', width: '80%' }}>
                                <MuiColorInput
                                    format="hex"
                                    value={category.color}
                                    onChange={handleColorChange}
                                    fullWidth
                                />
                            </Box>
                            <div className="category-create-form-button-submit">
                                <Button
                                    variant="outlined"
                                    onClick={handleClose}
                                    sx={{ width: '100%', marginTop: '20px', marginRight: '20px' }}
                                >Annuler</Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isUnchanged}
                                    sx={{ width: '100%', marginTop: '20px' }}
                                >Modifier</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}