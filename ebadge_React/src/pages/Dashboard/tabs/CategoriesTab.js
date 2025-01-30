import React from 'react';
import Api from '../../../utils/Api';
import CategorieGrid from '../../../composant/Dashboard/CategorieGrid';
import Item from '@mui/material/Grid';
import CategorieCreateForm from '../../../composant/CategorieCreateForm';
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
            closeCategorieForm: false,
            showSuccessMessage: false,
            successMessage: '',
            showErrorMessage: false,
            errorMessage: '',
            badges: []
        }

        this.handleCategorieForm = this.handleCategorieForm.bind(this);
        this.getCategories = this.getCategories.bind(this);
        this.addCategorie = this.addCategorie.bind(this);
        this.editCategorie = this.editCategorie.bind(this);
        this.deleteCategorie = this.deleteCategorie.bind(this);
        this.errorCategorie = this.errorCategorie.bind(this);
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
        Api.get('/categorie').then(res => {
            const categories = res.data;
            this.setState({ categories: categories.categories });
        }
        )
    }

    handleCategorieForm() {
        this.setState({ closeCategorieForm: !this.state.closeCategorieForm });
    }

    addCategorie(categorie) {
        this.setState({ categories: [categorie, ...this.state.categories], successMessage: 'La catégorie a été ajouté avec succès !', showSuccessMessage: true });
    }

    editCategorie(categorie) {
        const categories = this.state.categories.map(c => {
            if (c.id === categorie.id) {
                return categorie;
            }
            return c;
        });
        this.setState({ categories, successMessage: 'La catégorie a été modifiée avec succès !', showSuccessMessage: true });
    }

    deleteCategorie(categorie) {
        console.log(categorie);
        console.log(this.state.categories);
        const categories = this.state.categories.filter(c => c.id !== categorie.id);
        console.log(categories);
        this.setState({ categories, successMessage: 'La catégorie a été supprimée avec succès !', showSuccessMessage: true });
        console.log(this.state.categories);
    }


    handleCloseSuccessMessage() {
        this.setState({ showSuccessMessage: false, successMessage: '' });
    }

    errorCategorie(message) {
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
                    <Button variant="contained" onClick={this.handleCategorieForm} startIcon={<Add></Add>}>Créer une catégorie</Button>
                    <Dialog fullScreen open={this.state.closeCategorieForm} onClose={this.handleCategorieForm} TransitionComponent={Transition}>
                        <CategorieCreateForm handleClose={this.handleCategorieForm} addBadge={this.addCategorie} errorBadge={this.errorCategorie} />
                    </Dialog>
                </div>
                <CategorieGrid rows={this.state.categories} refresh={this.getCategories} deleteCategorie={this.deleteCategorie} editCategorie={this.editCategorie} errorCategorie={this.errorCategorie} />
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