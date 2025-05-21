import React, { useState, useEffect, useCallback } from 'react';
import Api from '../../../utils/Api';
import CategoryGrid from '../../../composant/Dashboard/CategoryGrid';
import CategoryCreateForm from '../../../composant/CategoryCreateForm';
import { Button, Dialog, Slide, Snackbar, Alert, Grid } from '@mui/material';
import { Add } from '@mui/icons-material';
import './../Dashboard.css';
import Loading from '../../../composant/Loading/LoadingComponent';

// Transition pour l'affichage en glissement du Dialog (modale) de création d'une catégorie
const Transition = React.forwardRef((props, ref) => (
    <Slide direction="up" ref={ref} {...props} />
));

/** Composant principal pour afficher la liste des catégories
 * 
 * @author Alexandre del Fabbro
 * D'après le code du projet E-Badge
 * Inspiré du code de OpenAi - ChatGPT - [Modèle massif de langage] - chatpgt.com - [Consulté le 27 mars 2025]
 */
const CategoriesTab = () => {

    // État pour gérer l'ouverture du formulaire de création de catégorie
    const [categoryFormOpen, setCategoryFormOpen] = useState(false);

    // États pour gérer les messages de succès et d'erreur
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // État pour stocker la liste des catégories
    const [categories, setCategories] = useState([]);

    // État pour gérer le chargement des catégories
    // Utilisé pour afficher un indicateur de chargement pendant la récupération des données
    const [charge, setCharge] = useState(false);

    // Fonction pour récupérer la liste des catégories depuis l'API
    // Utilise useCallback pour éviter de recréer la fonction à chaque rendu
    const getCategories = useCallback(() => {
        Api.get('/category')
            .then(res => {
                const categories = res.data.categories.map(category => ({
                    ...category,
                    color: category.color || '#FFFFFF',
                })); 
                setCategories(categories);
                setCharge(true);
            })
            .catch(err => setErrorMessage("Erreur lors de la récupération des catégories."));
    }, []);

    useEffect(() => {
        getCategories();
    }, [getCategories]);

    // Fonction pour gérer l'ouverture et la fermeture du formulaire de création de catégorie
    // Inverse l'état de categoryFormOpen à chaque appel
    const handleCategoryFormToggle = () => {
        setCategoryFormOpen(prev => !prev);
    };

    // Fonction pour ajouter une nouvelle catégorie
    // Met à jour la liste des catégories en ajoutant la nouvelle catégorie au début de la liste
    const addCategory = (category) => {
        setCategories(prev => [category, ...prev]);
        setSuccessMessage('La catégorie a été ajoutée avec succès !');
    };

    // Fonction pour éditer une catégorie existante
    // Met à jour la liste des catégories en remplaçant la catégorie modifiée par la nouvelle version
    const editCategory = (category) => {
        setCategories(prev => prev.map(c => c.id === category.id ? category : c));
        setSuccessMessage('La catégorie a été modifiée avec succès !');
    };

    // Fonction pour supprimer une catégorie
    // Met à jour la liste des catégories en filtrant la catégorie supprimée
    const deleteCategory = (category) => {
        setCategories(prev => prev.filter(c => c.id !== category.id));
        setSuccessMessage('La catégorie a été supprimée avec succès !');
    };

    // Récupération du rôle de l'utilisateur depuis le localStorage
    const role = localStorage.getItem('role');

    return (
        <Grid item className='bordered'>
            <div className="title">
                <h4>Liste des catégories</h4>
                {role === 'Administrateur' && <Button variant="contained" onClick={handleCategoryFormToggle} startIcon={<Add />}>Créer une catégorie</Button>}
                <Dialog fullScreen open={categoryFormOpen} onClose={handleCategoryFormToggle} TransitionComponent={Transition}>
                    <CategoryCreateForm 
                        handleClose={handleCategoryFormToggle} 
                        addCategory={addCategory} 
                        errorCategory={setErrorMessage} 
                    />
                </Dialog>
            </div>
            <CategoryGrid 
                rows={categories} 
                refresh={getCategories} 
                deleteCategory={deleteCategory} 
                editCategory={editCategory} 
                errorCategory={setErrorMessage} 
            />
            <Snackbar open={Boolean(successMessage)} autoHideDuration={3000} onClose={() => setSuccessMessage('')}>
                <Alert severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>
            <Snackbar open={Boolean(errorMessage)} autoHideDuration={3000} onClose={() => setErrorMessage('')}>
                <Alert severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
            {charge?<hr></hr>:<Loading/>}
        </Grid>
        
    );
};

export default CategoriesTab;
