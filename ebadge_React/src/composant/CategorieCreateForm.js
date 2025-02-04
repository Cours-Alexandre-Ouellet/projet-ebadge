import React from 'react';
import '@mui/material';
import { Button, TextField } from '@mui/material';
import Api from '../utils/Api';
import CategorieComponent from './PageProfil/CategorieComponent';
import './CategorieCreateForm.css';

class CategorieCreateForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nameError: '',
            categorie: {
                name: '',
                possession: 0
            }
        }

        this.handleCategorieChange = this.handleCategorieChange.bind(this);
        this.validateName = this.validateName.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    /**
     * fonction qui change la valeur du champ quand on tape dedans
     * @param {*} event 
     */
    handleCategorieChange(event) {
        this.setState({ categorie: { ...this.state.categorie, [event.target.name]: event.target.value } });
    }

    /**
     * Fonction qui vérifie si le nom est valide
     * @returns boolean 
     */
    validateName() {
        if (this.state.categorie.name.length === 0) {
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

                formData.append('nom', this.state.categorie.name);

                Api.post('/categorie', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then((response) => {
                    this.props.addCategorie(response.data);
                })
                .catch((error) => {
                    this.props.errorCategorie('Erreur lors de la création de la catégorie');
                    console.log(error);
                });
            this.props.handleClose();
        }
    }

    render() {
        return (
            <div className="categorie-create-form">
                <div className="categorie-create-form-container">
                    <div className="categorie-create-form-background">
                        <div className="categorie-create-form-content">
                            <h1>Créer une catégorie</h1>
                            <form className='create-categorie' onSubmit={this.handleSubmit}>
                                <TextField
                                    id="name"
                                    name="name"
                                    label="Nom"
                                    variant="outlined"
                                    value={this.state.categorie.name}
                                    onChange={this.handleCategorieChange}
                                    onBlur={this.validateName}
                                    error={this.state.nameError.length > 0}
                                    helperText={this.state.nameError}
                                    inputProps={{ maxLength: 45 }}
                                    required
                                    sx={{ width: '80%', marginTop: '20px' }}
                                />
                                
                                <div className="categorie-create-form-button-submit">
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
                        <div className="categorie-create-form-preview">
                            <h2>Prévisualisation</h2>
                            <div className="categorie-create-form-preview-content">
                                <CategorieComponent categorie={this.state.categorie}></CategorieComponent>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CategorieCreateForm;