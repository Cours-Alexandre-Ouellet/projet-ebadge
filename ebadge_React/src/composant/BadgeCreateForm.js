import React from 'react';
import './BadgeCreateForm.css';
import '@mui/material';
import { Button, TextField, InputAdornment, Autocomplete } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import Api from '../utils/Api';
import BadgeComposant from './BadgeComponent';

class BadgeCreateForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            titleError: '',
            descriptionError: '',
            colorAutoComplete: null,
            badge: {
                title: '',
                description: '',
                imagePath: '',
                color: '',
                pourcentage: 0
            }
        }

        this.handleBadgeChange = this.handleBadgeChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validateTitle = this.validateTitle.bind(this);
        this.validateDescription = this.validateDescription.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleBadgeChange(event) {
        // change state of badge.name
        this.setState({ badge: { ...this.state.badge, [event.target.name]: event.target.value } });
    }

    handleChange(event) {
        this.setState({ [event.target.name]: event.target.value });
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

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.validateTitle() && this.validateDescription()) {
            // TODO: Appel API
            Api.post('/badge', {
                title: this.state.badge.title,
                description: this.state.badge.description,
                image: this.state.badge.image,
                color: this.state.badge.color
            })
                .then((response) => {
                    console.log(response);
                }
                )
                .catch((error) => {
                    console.log(error);
                }
                );
        }
    }

    render() {
        return (
            <div className="badge-create-form">
                <div className="badge-create-form-container">
                    <div className="badge-create-form-background">
                        <div className="badge-create-form-content">
                            <h1>Créer un badge</h1>
                            <form onSubmit={this.handleSubmit}>
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
                                    required
                                    sx={{ width: '80%', marginTop: '20px' }}
                                />
                                <TextField
                                    id="description"
                                    name="description"
                                    label="Description"
                                    variant="outlined"
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
                                        id='image'
                                        name='image'
                                        value={this.state.badge.imagePath}
                                        onChange={this.handleBadgeChange}
                                        sx={{
                                            width: '100%',
                                            marginTop: '20px',
                                            marginRight: '20px'
                                        }}
                                        startIcon={<PhotoCamera />}
                                    >
                                        Image
                                        <input
                                            type="file"
                                            accept='image/*'
                                            hidden
                                        />
                                    </Button>
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
                                    <Button type="submit" variant="contained" sx={{
                                        width: '100%',
                                        marginTop: '20px'
                                    }}>Créer</Button>
                                </div>
                            </form>
                        </div>
                        <div className="badge-create-form-preview">
                            <h2>Prévisualisation</h2>
                            <div className="badge-create-form-preview-content">
                                <BadgeComposant badge={this.state.badge}></BadgeComposant>
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

export default BadgeCreateForm;