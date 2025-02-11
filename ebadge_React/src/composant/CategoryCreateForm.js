import React from 'react';
import '@mui/material';
import { Button, TextField } from '@mui/material';
import Api from '../utils/Api';
import CategoryComponent from './PageProfil/CategoryComponent';
import './CategoryCreateForm.css';

class CategoryCreateForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nameError: '',
            category: {
                name: '',
                possession: 0
            }
        }

        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.validateName = this.validateName.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * fonction qui change la valeur du champ quand on tape dedans
     * @param {*} event 
     */
    handleCategoryChange(event) {
        this.setState({ category: { ...this.state.category, [event.target.name]: event.target.value } });
    }

    /**
     * Fonction qui vérifie si le nom est valide
     * @returns boolean 
     */
    validateName() {
        if (this.state.category.name.length === 0) {
            this.setState({ nameError: 'Veuillez donner un nom à la catégorie' });
            return false;
        } else {
            this.setState({ nameError: '' });
            return true;
        }
    }

    /**
     * fonction qui envoie les données au serveur
     * @param {*} event 
     */
    handleSubmit = (event) => {
        event.preventDefault();
        if (this.validateName()) {

                let formData = new FormData();

                formData.append('name', this.state.category.name);

                Api.post('/category', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then((response) => {
                    this.props.addCategory(response.data);
                })
                .catch((error) => {
                    this.props.errorCategory('Erreur lors de la création de la catégorie');
                    console.log(error);
                });
            this.props.handleClose();
        }
    }

    render() {
        return (
            <div className="category-create-form">
                <div className="category-create-form-container">
                    <div className="category-create-form-background">
                        <div className="category-create-form-content">
                            <h1>Créer une catégorie</h1>
                            <form className='create-category' onSubmit={this.handleSubmit}>
                                <TextField
                                    id="name"
                                    name="name"
                                    label="Nom"
                                    variant="outlined"
                                    value={this.state.category.name}
                                    onChange={this.handleCategoryChange}
                                    onBlur={this.validateName}
                                    error={this.state.nameError.length > 0}
                                    helperText={this.state.nameError}
                                    inputProps={{ maxLength: 45 }}
                                    required
                                    sx={{ width: '80%', marginTop: '20px' }}
                                />
                                
                                <div className="category-create-form-button-submit">
                                    <Button variant="outlined" onClick={this.props.handleClose} sx={{
                                        width: '100%',
                                        marginTop: '20px',
                                        marginRight: '20px'
                                    }}>Annuler</Button>
                                    <Button type="submit" variant="contained" sx={{
                                        width: '100%',
                                        marginTop: '20px'
                                    }}>Créer</Button>
                                </div>
                            </form>
                        </div>
                        <div className="category-create-form-preview">
                            <h2>Prévisualisation</h2>
                            <div className="category-create-form-preview-content">
                                <CategoryComponent category={this.state.category}></CategoryComponent>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CategoryCreateForm;