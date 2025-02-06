import React from 'react';
import Api from '../../../utils/Api';
import CategoryGrid from '../../../composant/Dashboard/CategoryGrid';
import Item from '@mui/material/Grid';
import CategoryCreateForm from '../../../composant/CategoryCreateForm';
import { Button, Dialog, Slide, Snackbar, Alert } from '@mui/material';
import './../Dashboard.css';
import { Add } from '@mui/icons-material';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class CategoriesTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            closeCategoryForm: false,
            showSuccessMessage: false,
            successMessage: '',
            showErrorMessage: false,
            errorMessage: '',
            badges: []
        }

        this.handleCategoryForm = this.handleCategoryForm.bind(this);
        this.getCategories = this.getCategories.bind(this);
        this.addCategory = this.addCategory.bind(this);
        this.editCategory = this.editCategory.bind(this);
        this.deleteCategory = this.deleteCategory.bind(this);
        this.errorCategory = this.errorCategory.bind(this);
        this.handleCloseSuccessMessage = this.handleCloseSuccessMessage.bind(this);
        this.handleCloseErrorMessage = this.handleCloseErrorMessage.bind(this);
    }

    componentDidMount() {
        this.getCategories();
    }

    /**
     * Recupere la liste des catégories depuis l'API
     */
    getCategories() {
        Api.get('/category').then(res => {
            const categories = res.data;
            this.setState({ categories: categories.categories });
        }
        )
    }

    handleCategoryForm() {
        this.setState({ closeCategoryForm: !this.state.closeCategoryForm });
    }

    addCategory(category) {
        this.setState({ categories: [category, ...this.state.categories], successMessage: 'La catégorie a été ajouté avec succès !', showSuccessMessage: true });
    }

    editCategory(category) {
        const categories = this.state.categories.map(c => {
            if (c.id === category.id) {
                return category;
            }
            return c;
        });
        this.setState({ categories, successMessage: 'La catégorie a été modifiée avec succès !', showSuccessMessage: true });
    }

    deleteCategory(category) {
        console.log(category);
        console.log(this.state.categories);
        const categories = this.state.categories.filter(c => c.id !== category.id);
        console.log(categories);
        this.setState({ categories, successMessage: 'La catégorie a été supprimée avec succès !', showSuccessMessage: true });
        console.log(this.state.categories);
    }


    handleCloseSuccessMessage() {
        this.setState({ showSuccessMessage: false, successMessage: '' });
    }

    errorCategory(message) {
        this.setState({ errorMessage: message, showErrorMessage: true });
    }

    handleCloseErrorMessage() {
        this.setState({ showErrorMessage: false, errorMessage: '' });
    }

    render() {
        return (
            <Item className='bordered'>
                <div className="title">
                    <h4>Liste des catégories</h4>
                    <Button variant="contained" onClick={this.handleCategoryForm} startIcon={<Add></Add>}>Créer une catégorie</Button>
                    <Dialog fullScreen open={this.state.closeCategoryForm} onClose={this.handleCategoryForm} TransitionComponent={Transition}>
                        <CategoryCreateForm handleClose={this.handleCategoryForm} addCategory={this.addCategory} errorCategory={this.errorCategory} />
                    </Dialog>
                </div>
                <CategoryGrid rows={this.state.categories} refresh={this.getCategories} deleteCategory={this.deleteCategory} editCategory={this.editCategory} errorCategory={this.errorCategory} />
                <Snackbar onClose={this.handleCloseSuccessMessage} open={this.state.showSuccessMessage} autoHideDuration={3000}>
                    <Alert onClose={this.handleCloseSuccessMessage} severity="success" sx={{ width: '100%' }} md={{ minWidth: '300px' }}>
                        {this.state.successMessage}
                    </Alert>
                </Snackbar>
                <Snackbar onClose={this.handleCloseErrorMessage} open={this.state.showErrorMessage} autoHideDuration={3000}>
                    <Alert onClose={this.handleCloseErrorMessage} severity="error" sx={{ width: '100%' }} md={{ minWidth: '300px' }}>
                        {this.state.errorMessage}
                    </Alert>
                </Snackbar>
            </Item>
        );
    }
}

export default CategoriesTab;