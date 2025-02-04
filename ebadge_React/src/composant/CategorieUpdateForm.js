import React from 'react';
import '@mui/material';
import { Button, TextField } from '@mui/material';
import Api from '../utils/Api';
import './CategorieCreateForm.js';
import CategorieComponent from './PageProfil/CategorieComponent';

class CategorieUpdateForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nomError: '',
            categorie: {
                id: 0,
                nom: '',
                // possession: 0
            }
        }

        this.handleCategorieChange = this.handleCategorieChange.bind(this);
        this.validateNom = this.validateNom.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({ categorie: this.props.selectedCategorie });
    }

    handleCategorieChange(event) {
        this.setState({ categorie: { ...this.state.categorie, [event.target.name]: event.target.value } });
    }

    validateNom() {
        if (this.state.categorie.nom.length === 0) {
            this.setState({ nomError: 'Veuillez donner un nom à la catégorie.' });
            return false;
        } else {
            this.setState({ nomError: '' });
            return true;
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.validateNom()) {
            Api.put('/categorie', this.state.categorie)
                .then((response) => {
                    this.props.editCategorie(response.data);
                })
                .catch((error) => {
                    this.props.errorCategorie('Une erreur est survenue');
                    console.log(error);
                });
            }
        this.props.handleClose();
        }


    render() {
        return (
            <div className="categorie-create-form">
                <div className="categorie-create-form-container">
                    <div className="categorie-create-form-background">
                        <div className="categorie-create-form-content">
                            <h1>Modifier une catégorie</h1>
                            <form className='create-categorie' onSubmit={this.handleSubmit}>
                                <TextField
                                    id="nom"
                                    name="nom"
                                    label="Nom"
                                    variant="outlined"
                                    value={this.state.categorie.nom}
                                    onChange={this.handleCategorieChange}
                                    onBlur={this.validateNom}
                                    error={this.state.nomError.length > 0}
                                    helperText={this.state.nomError}
                                    inputProps={{ maxLength: 45 }}
                                    required
                                    sx={{ width: '80%', marginTop: '20px' }}
                                />
                                <div className="Categorie-create-form-button-submit">
                                    <Button variant="outlined" onClick={this.props.handleClose} sx={{
                                        width: '100%',
                                        marginTop: '20px',
                                        marginRight: '20px'
                                    }}>Annuler</Button>
                                    <Button type="submit" variant="contained" disabled={this.state.categorie === this.props.selectedCategorie} sx={{
                                        width: '100%',
                                        marginTop: '20px'
                                    }}>Modifier</Button>
                                </div>
                            </form>
                        </div>
                        <div className="Categorie-create-form-preview">
                            <h2>Prévisualisation</h2>
                            <div className="Categorie-create-form-preview-content">
                                <CategorieComponent categorie={this.state.categorie}></CategorieComponent>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
}

export default CategorieUpdateForm;