import React from 'react';
import './BadgeCreateForm.css';
import '@mui/material';
import { Button, TextField, InputAdornment } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

class BadgeCreateForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            description: '',
            image: '',
            color: '',
            titleError: '',
            descriptionError: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.validateTitle = this.validateTitle.bind(this);
        this.validateDescription = this.validateDescription.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    validateTitle() {
        if (this.state.title.length === 0) {
            this.setState({ titleError: 'Veuillez renseigner le titre' });
            return false;
        } else {
            this.setState({ titleError: '' });
            return true;
        }
    }

    validateDescription() {
        if (this.state.description.length === 0) {
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
                                    value={this.state.title}
                                    onChange={this.handleChange}
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
                                    value={this.state.description}
                                    onChange={this.handleChange}
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
                                        value={this.state.image}
                                        onChange={this.handleChange}
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
                                    <TextField
                                        id="color"
                                        name="color"
                                        label="Hex couleur background"
                                        variant="standard"
                                        value={this.state.color}
                                        onChange={this.handleChange}
                                        sx={{
                                            width: '100%',
                                            marginTop: '20px'
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    #
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <div
                                                        className="badge-create-form-color"
                                                        style={{ backgroundColor: "#" + this.state.color, width: '20px', height: '20px' }}
                                                    />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </div>
                                <div className="badge-create-form-button-submit">
                                    <Button variant="outlined" sx={{
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
                                <div className="badge-create-form-preview-content-title">
                                    <h2>{this.state.title}</h2>
                                </div>
                                <div className="badge-create-form-preview-content-description">
                                    <p>{this.state.description}</p>
                                </div>
                                <div className="badge-create-form-preview-content-image">
                                    <img src={this.state.image} alt="Badge" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default BadgeCreateForm;