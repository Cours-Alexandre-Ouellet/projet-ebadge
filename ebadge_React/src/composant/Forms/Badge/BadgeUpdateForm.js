import React from 'react';
import '@mui/material';
import { Button, TextField, InputAdornment, Autocomplete, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Alert, Divider } from '@mui/material';
import { PhotoCamera, Check } from '@mui/icons-material';
import Api from '../../../utils/Api';
import './BadgeCreateForm.css';
import BadgeComponent from '../../PageProfil/BadgeComponent';

function isImage(url) {
    return /(http(s?):)*\.(?:jpg|gif|png)/.test(url);
}

class BadgeUpdateForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            titleError: '',
            descriptionError: '',
            colorError: '',
            openImageDialog: false,
            imageUrlField: "",
            imageFile: null,
            imageError: "",
            badge: {
                id: 0,
                title: '',
                description: '',
                imagePath: '',
                color: 'ffffff',
                possession: 0
            }
        }

        this.handleBadgeChange = this.handleBadgeChange.bind(this);
        this.handleImageDialog = this.handleImageDialog.bind(this);
        this.handleImageDelete = this.handleImageDelete.bind(this);
        this.handleImageModify = this.handleImageModify.bind(this);
        this.validateTitle = this.validateTitle.bind(this);
        this.validateDescription = this.validateDescription.bind(this);
        this.validateColor = this.validateColor.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({ badge: this.props.selectedBadge });
    }

    handleBadgeChange(event) {
        this.setState({ badge: { ...this.state.badge, [event.target.name]: event.target.value } });
    }

    handleImageDialog() {
        this.setState({ openImageDialog: !this.state.openImageDialog })

    }

    handleImageDelete() {
        this.setState({ badge: { ...this.state.badge, imagePath: '' } });
        this.setState({ imageFile: null, imageUrlField: '' });
        this.handleImageDialog();
    }

    handleImageModify() {
        if (this.state.imageFile !== null) {
            this.setState({ badge: { ...this.state.badge, imagePath: URL.createObjectURL(this.state.imageFile) } });
            this.handleImageDialog();
        } else if (isImage(this.state.imageUrlField)) {
            this.setState({ badge: { ...this.state.badge, imagePath: this.state.imageUrlField } });
            this.handleImageDialog();
        } else {
            alert('Image invalide');
        }
    }

    validateTitle() {
        if (this.state.badge.title.length === 0) {
            this.setState({ titleError: 'Veuillez renseigner le titre' });
            return false;
        } else {
            this.setState({ titleError: '' });
            return true;
        }
    }

    validateDescription() {
        if (this.state.badge.description.length === 0) {
            this.setState({ descriptionError: 'Veuillez renseigner la description' });
            return false;
        } else {
            this.setState({ descriptionError: '' });
            return true;
        }
    }

    validateColor() {
        if (this.state.badge.color.length < 6 || this.state.badge.color.length > 8) {
            this.setState({ badge: { ...this.state.badge, color: 'ffffff' } });
        }
        return true;
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.validateTitle() && this.validateDescription() && this.validateColor()) {
            if (this.state.imageFile != null) {
                let formData = new FormData();

                formData.append('id', this.state.badge.id);
                formData.append('title', this.state.badge.title);
                formData.append('description', this.state.badge.description);
                formData.append('image', this.state.imageFile);
                formData.append('color', this.state.badge.color);

                Api.put('/badge', formData)
                    .then((response) => {
                        this.props.editBadge(response.data);
                    })
                    .catch((error) => {
                        this.props.errorBadge('Une erreur est survenue');
                        console.log(error);
                    });

            } else if (isImage(this.state.badge.imagePath)) {
                Api.put('/badge', this.state.badge)
                    .then((response) => {
                        this.props.editBadge(response.data);
                    })
                    .catch((error) => {
                        this.props.errorBadge('Une erreur est survenue');
                        console.log(error);
                    });
            }
            this.props.handleClose();
        }
    }

    render() {
        return (
            <div className="badge-create-form">
                <div className="badge-create-form-container">
                    <div className="badge-create-form-background">
                        <div className="badge-create-form-content">
                            <h1>Modifier un badge</h1>
                            <form className='create-badge' onSubmit={this.handleSubmit}>
                                <TextField
                                    id="title"
                                    name="title"
                                    label="Titre"
                                    variant="outlined"
                                    value={this.state.badge.title}
                                    onChange={this.handleBadgeChange}
                                    onBlur={this.validateTitle}
                                    error={this.state.titleError.length > 0}
                                    helperText={this.state.titleError}
                                    inputProps={{ maxLength: 45 }}
                                    required
                                    sx={{ width: '80%', marginTop: '20px' }}
                                />
                                <TextField
                                    id="description"
                                    name="description"
                                    label="Description"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    inputProps={{ maxLength: 255 }}
                                    value={this.state.badge.description}
                                    onChange={this.handleBadgeChange}
                                    onBlur={this.validateDescription}
                                    error={this.state.descriptionError.length > 0}
                                    helperText={this.state.descriptionError}
                                    required
                                    sx={{ width: '80%', marginTop: '20px' }}
                                />
                                <div className="badge-create-form-button-field">
                                        <Button
                                            variant="contained"
                                            color='secondary'
                                            onClick={this.handleImageDialog}
                                            sx={{
                                                width: '100%',
                                                marginTop: '20px',
                                                marginRight: '20px'
                                            }}
                                            error={this.state.imageError.length > 0}
                                            startIcon={<PhotoCamera />}
                                        >
                                            {this.state.badge.imagePath.length === 0 ? 'Ajouter une image' : 'Modifier l\'image'}
                                        </Button>
                                    <Dialog open={this.state.openImageDialog} onClose={this.handleClose}>
                                        <DialogTitle>Modifier l'image du badge</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText>
                                                Pour changer l'image du badge, veuillez entrer l'URL de l'image.
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
                                        inputValue={this.state.badge.color}
                                        onInputChange={(event, newInputValue) => {
                                            this.setState({ badge: { ...this.state.badge, color: newInputValue } });
                                        }}
                                        getOptionLabel={(option) => option}
                                        selectOnFocus
                                        handleHomeEndKeys
                                        freeSolo
                                        sx={{ width: '100%', marginTop: '20px' }}
                                        renderOption={(props, option) => (
                                            <li {...props}>
                                                <div
                                                    className="badge-create-form-color"
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
                                                        className="badge-create-form-color"
                                                        style={{ backgroundColor: "#" + this.state.badge.color, width: '20px', height: '20px' }}
                                                    />
                                                    #
                                                </InputAdornment>
                                            ),
                                        }} />}
                                    />
                                </div>
                                <div className="badge-create-form-button-submit">
                                    <Button variant="outlined" onClick={this.props.handleClose} sx={{
                                        width: '100%',
                                        marginTop: '20px',
                                        marginRight: '20px'
                                    }}>Annuler</Button>
                                    <Button type="submit" variant="contained" disabled={this.state.badge === this.props.selectedBadge} sx={{
                                        width: '100%',
                                        marginTop: '20px'
                                    }}>Modifier</Button>
                                </div>
                            </form>
                        </div>
                        <div className="badge-create-form-preview">
                            <h2>Prévisualisation</h2>
                            <div className="badge-create-form-preview-content">
                                <BadgeComponent badge={this.state.badge}></BadgeComponent>
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

export default BadgeUpdateForm;