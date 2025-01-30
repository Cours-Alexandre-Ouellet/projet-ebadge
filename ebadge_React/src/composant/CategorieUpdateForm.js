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
            titleError: '',
            descriptionError: '',
            colorError: '',
            openImageDialog: false,
            imageUrlField: "",
            imageFile: null,
            categorie: {
                id: 0,
                title: '',
                description: '',
                imagePath: '',
                color: 'ffffff',
                possession: 0
            }
        }

        this.handleCategorieChange = this.handleCategorieChange.bind(this);
        this.handleImageDialog = this.handleImageDialog.bind(this);
        this.handleImageDelete = this.handleImageDelete.bind(this);
        this.handleImageModify = this.handleImageModify.bind(this);
        this.validateTitle = this.validateTitle.bind(this);
        this.validateDescription = this.validateDescription.bind(this);
        this.validateColor = this.validateColor.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({ Categorie: this.props.selectedCategorie });
    }

    handleCategorieChange(event) {
        this.setState({ Categorie: { ...this.state.categorie, [event.target.name]: event.target.value } });
    }

    handleImageDialog() {
        this.setState({ openImageDialog: !this.state.openImageDialog });
    }

    handleImageDelete() {
        this.setState({ Categorie: { ...this.state.categorie, imagePath: '' } });
        this.setState({ imageFile: null, imageUrlField: '' });
        this.handleImageDialog();
    }

    handleImageModify() {
        if (this.state.imageFile !== null) {
            this.setState({ Categorie: { ...this.state.categorie, imagePath: URL.createObjectURL(this.state.imageFile) }});
            this.handleImageDialog();
        } else if (isImage(this.state.imageUrlField)) {
            this.setState({ Categorie: { ...this.state.categorie, imagePath: this.state.imageUrlField }});
            this.handleImageDialog();
        } else {
            alert('Image invalide');
        }
    }

    validateTitle() {
        if (this.state.categorie.title.length === 0) {
            this.setState({ titleError: 'Veuillez renseigner le titre' });
            return false;
        } else {
            this.setState({ titleError: '' });
            return true;
        }
    }

    validateDescription() {
        if (this.state.categorie.description.length === 0) {
            this.setState({ descriptionError: 'Veuillez renseigner la description' });
            return false;
        } else {
            this.setState({ descriptionError: '' });
            return true;
        }
    }

    validateColor() {
        if (this.state.categorie.color.length < 6 || this.state.categorie.color.length > 8) {
            this.setState({ Categorie: { ...this.state.categorie, color: 'ffffff' } });
        }
        return true;
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.validateTitle() && this.validateDescription() && this.validateColor()) {
            if (this.state.imageFile != null) {
                let formData = new FormData();

                formData.append('id', this.state.categorie.id);
                formData.append('nom', this.state.categorie.nom);

                Api.put('/categorie', formData)
                .then((response) => {
                    this.props.editCategorie(response.data);
                })
                .catch((error) => {
                    this.props.errorCategorie('Une erreur est survenue');
                    console.log(error);
                });

            } else if (isImage(this.state.Categorie.imagePath)) {
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
                                    value={this.state.Categorie.title}
                                    onChange={this.handleCategorieChange}
                                    onBlur={this.validateTitle}
                                    error={this.state.titleError.length > 0}
                                    helperText={this.state.titleError}
                                    inputProps={{ maxLength: 45 }}
                                    required
                                    sx={{ width: '80%', marginTop: '20px' }}
                                />
                                <div className="categorie-create-form-button-field">
                                    <Button
                                        variant="contained"
                                        color='secondary'
                                        onClick={this.handleImageDialog}
                                        sx={{
                                            width: '100%',
                                            marginTop: '20px',
                                            marginRight: '20px'
                                        }}
                                        startIcon={<PhotoCamera />}
                                    >
                                        {this.state.Categorie.imagePath.length === 0 ? 'Ajouter une image' : 'Modifier l\'image'}
                                    </Button>
                                    <Dialog open={this.state.openImageDialog} onClose={this.handleClose}>
                                        <DialogTitle>Modifier l'image du Categorie</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText>
                                                Pour changer l'image du Categorie, veuillez entrer l'URL de l'image.
                                            </DialogContentText>
                                            <TextField
                                                autoFocus
                                                margin="dense"
                                                name='imagePath'
                                                label="URL"
                                                type="url"
                                                fullWidth
                                                variant="standard"
                                                value={this.state.imageUrlField}
                                                inputProps={{ maxLength: 2048 }}
                                                onChange={e => {
                                                    this.setState({
                                                        imageUrlField: e.target.value,
                                                        imageFile: null
                                                    });
                                                }}
                                            />
                                            <br />
                                            <br />
                                            <br />
                                            <DialogContentText>
                                                Vous pouvez également importé une image.
                                            </DialogContentText>
                                            <br />
                                            <Button
                                                variant="contained"
                                                component="label"
                                            >
                                                Importer une image
                                                <input
                                                    type="file"
                                                    accept="image/png, image/jpeg"
                                                    hidden
                                                    onChange={e => {
                                                        this.setState({
                                                            imageFile: e.target.files[0],
                                                            imageUrlField: ''
                                                        });
                                                    }}
                                                />
                                            </Button>
                                            <div hidden={this.state.imageFile === null}>
                                                <Check></Check> Image importée
                                            </div>
                                            <div className="hiddenAlert">
                                                <Alert variant="filled" severity="error" >
                                                    L'url de l'image n'est pas valide.
                                                </Alert>
                                            </div>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={this.handleImageDialog}>Annuler</Button>
                                            <Button onClick={this.handleImageDelete}>Supprimer</Button>
                                            <Button onClick={this.handleImageModify}>Modifier</Button>
                                        </DialogActions>
                                    </Dialog>
                                    <Autocomplete
                                        id="color"
                                        name="color"
                                        options={colors}
                                        inputValue={this.state.Categorie.color}
                                        onInputChange={(event, newInputValue) => {
                                            this.setState({ Categorie: { ...this.state.Categorie, color: newInputValue } });
                                        }}
                                        getOptionLabel={(option) => option}
                                        selectOnFocus
                                        handleHomeEndKeys
                                        freeSolo
                                        sx={{ width: '100%', marginTop: '20px' }}
                                        renderOption={(props, option) => (
                                            <li {...props}>
                                                <div
                                                    className="Categorie-create-form-color"
                                                    style={{ backgroundColor: "#" + option, width: '20px', height: '20px' }}
                                                />
                                                #{option}
                                            </li>
                                        )}
                                        renderInput={(params) => <TextField {...params} label="Hex couleur arrière-plan" variant='standard' InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <div
                                                        className="Categorie-create-form-color"
                                                        style={{ backgroundColor: "#" + this.state.Categorie.color, width: '20px', height: '20px' }}
                                                    />
                                                    #
                                                </InputAdornment>
                                            ),
                                        }} />}
                                    />
                                </div>
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
    }
}

const colors = [
    'ff0000',
    'ff8000',
    'ffff00',
    '80ff00',
    '00ff00',
    '00ff80',
    '00ffff',
    '0080ff',
];

export default CategorieUpdateForm;