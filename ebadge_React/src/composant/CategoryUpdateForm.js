import React from 'react';
import '@mui/material';
import { Button, TextField } from '@mui/material';
import Api from '../utils/Api.js';
import './CategoryCreateForm.js';
import CategoryComponent from './PageProfil/CategoryComponent.js';

class CategoryUpdateForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nameError: '',
            category: {
                id: 0,
                name: '',
                // possession: 0
            }
        }

        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.validateName = this.validateName.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({ category: this.props.selectedCategory });
    }

    handleCategoryChange(event) {
        this.setState({ category: { ...this.state.category, [event.target.name]: event.target.value } });
    }

    validateName() {
        if (this.state.category.name.length === 0) {
            this.setState({ nameError: 'Veuillez donner un nom à la catégorie.' });
            return false;
        } else {
            this.setState({ nameError: '' });
            return true;
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.validateName()) {
            Api.put('/category', this.state.category)
                .then((response) => {
                    this.props.editCategory(response.data);
                })
                .catch((error) => {
                    this.props.errorCategory('Une erreur est survenue');
                    console.error(error);
                });
            }
        this.props.handleClose();
        }


    render() {
        return (
            <div className="category-create-form">
                <div className="category-create-form-container">
                    <div className="category-create-form-background">
                        <div className="category-create-form-content">
                            <h1>Modifier une catégorie</h1>
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
                                <div className="Category-create-form-button-submit">
                                    <Button variant="outlined" onClick={this.props.handleClose} sx={{
                                        width: '100%',
                                        marginTop: '20px',
                                        marginRight: '20px'
                                    }}>Annuler</Button>
                                    <Button type="submit" variant="contained" disabled={this.state.category === this.props.selectedCategory} sx={{
                                        width: '100%',
                                        marginTop: '20px'
                                    }}>Modifier</Button>
                                </div>
                            </form>
                        </div>
                        <div className="Category-create-form-preview">
                            <h2>Prévisualisation</h2>
                            <div className="Category-create-form-preview-content">
                                <CategoryComponent category={this.state.category}></CategoryComponent>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
}

export default CategoryUpdateForm;