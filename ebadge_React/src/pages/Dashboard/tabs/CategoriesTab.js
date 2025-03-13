import React, { useState, useEffect, useCallback } from 'react';
import Api from '../../../utils/Api';
import CategoryGrid from '../../../composant/Dashboard/CategoryGrid';
import CategoryCreateForm from '../../../composant/CategoryCreateForm';
import { Button, Dialog, Slide, Snackbar, Alert, Grid } from '@mui/material';
import { Add } from '@mui/icons-material';
import './../Dashboard.css';
import Loading from '../../../composant/Loading/LoadingComponent';

const Transition = React.forwardRef((props, ref) => (
    <Slide direction="up" ref={ref} {...props} />
));

// Tableau des catégories
const CategoriesTab = () => {
    const [categoryFormOpen, setCategoryFormOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [categories, setCategories] = useState([]);
    const [charge, setCharge] = useState(false);

    const getCategories = useCallback(() => {
        Api.get('/category')
            .then(res => {setCategories(res.data.categories);setCharge(true);})
            .catch(err => setErrorMessage("Erreur lors de la récupération des catégories."));
    }, []);

    useEffect(() => {
        getCategories();
    }, [getCategories]);

    const handleCategoryFormToggle = () => {
        setCategoryFormOpen(prev => !prev);
    };

    const addCategory = (category) => {
        setCategories(prev => [category, ...prev]);
        setSuccessMessage('La catégorie a été ajoutée avec succès !');
    };

    const editCategory = (category) => {
        setCategories(prev => prev.map(c => c.id === category.id ? category : c));
        setSuccessMessage('La catégorie a été modifiée avec succès !');
    };

    const deleteCategory = (category) => {
        setCategories(prev => prev.filter(c => c.id !== category.id));
        setSuccessMessage('La catégorie a été supprimée avec succès !');
    };

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
