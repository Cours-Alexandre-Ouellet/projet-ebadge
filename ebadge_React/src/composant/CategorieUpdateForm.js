import React from 'react';
import '@mui/material';
import { Button, TextField, InputAdornment, Autocomplete, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Alert } from '@mui/material';
import { PhotoCamera, Check } from '@mui/icons-material';
import Api from '../utils/Api';
import './CategorieCreateForm.css';
import CategorieComponent from './PageProfil/CategorieComponent';

function isImage(url) {
    return /(http(s?):)*\.(?:jpg|gif|png)/.test(url);
}

class CategorieUpdateForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nameError: '',
            categorie: {
                id: 0,
                name: '',
                possession: 0
            }
        }

        this.handleCategorieChange = this.handleCategorieChange.bind(this);
        this.validateName = this.validateName.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({ Categorie: this.props.selectedCategorie });
    }

    handleCategorieChange(event) {
        this.setState({ Categorie: { ...this.state.categorie, [event.target.name]: event.target.value } });
    }

    validateName() {
        if (this.state.categorie.name.length === 0) {
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
            Api.put('/categorie', this.state.Categorie)
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
                                    value={this.state.Categorie.name}
                                    onChange={this.handleCategorieChange}
                                    onBlur={this.validateName}
                                    error={this.state.nameError.length > 0}
                                    helperText={this.state.nameError}
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
                                    <Button type="submit" variant="contained" disabled={this.state.Categorie === this.props.selectedCategorie} sx={{
                                        width: '100%',
                                        marginTop: '20px'
                                    }}>Modifier</Button>
                                </div>
                            </form>
                        </div>
                        <div className="Categorie-create-form-preview">
                            <h2>Prévisualisation</h2>
                            <div className="Categorie-create-form-preview-content">
                                <CategorieComponent Categorie={this.state.Categorie}></CategorieComponent>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
}

export default CategorieUpdateForm;