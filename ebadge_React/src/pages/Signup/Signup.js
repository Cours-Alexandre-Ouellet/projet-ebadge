import React from "react";
import './Signup.css';
import '@mui/material';
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import Api from '../../utils/Api';
import Loading from '../../composant/Loading/LoadingComponent';
import { Navigate } from "react-router-dom";

class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            password2: '',
            first_name: '',
            last_name: '',
            organisation_id: '',
            program_id: '',
            teacher_code: '',
            isLoading: false,
            redirect: false,
            errors: {
                username: '',
                email: '',
                password: '',
                first_name: '',
                last_name: '',
                organisation_id: '',
                program_id: '',
                teacher_code: '',
            },
        }

        this.getOrganisations = this.getOrganisations.bind(this);
        this.getPrograms = this.getPrograms.bind(this);
    }

    // fonction qui permet d'aller chercher les données des organisations
    getOrganisations() {
        if (this.state.organisations) {
            return;
        }
        Api.get('/organisation')
            .then(res => {
                this.setState({ organisations: res.data });
            })
            .catch(err => {
                console.log(err);
            });
    }

    // fonction qui permet d'aller chercher les données des programmes
    getPrograms() {
        if (this.state.programs) {
            return;
        }
        Api.get('/program')
            .then(res => {
                this.setState({ programs: res.data });
            })
            .catch(err => {
                console.log(err);
            });
    }

    // fonction qui permet de valider les données du formulaire
    //et créer un nouvel utilisateur
    handleSubmit() {
        this.setState({ isLoading: true });
        console.log("Submit");

        const data = new FormData();
        data.append('username', this.state.username);
        data.append('email', this.state.email);
        data.append('password', this.state.password);
        data.append('first_name', this.state.first_name);
        data.append('last_name', this.state.last_name);
        data.append('organisation_id', this.state.organisation_id);
        data.append('program_id', this.state.program_id);

        if (this.state.show_teacher_code) {
            data.append('teacher_code', this.state.teacher_code);
        }

        Api.post('/auth/signup', data)
            .then(res => {
                console.log(res.data.user);
                localStorage.setItem('token', res.data.access_token);
                localStorage.setItem('username', res.data.user.username);
                this.setState({ redirect: true, isLoading: false });
            })
            .catch(err => {
                if (err.response.status === 422) {
                    console.log(err.response.data.errors);
                    for (const [key, value] of Object.entries(err.response.data.errors)) {
                        this.setState({ errors: { ...this.state.errors, [key]: value[0] } });
                    }
                    this.setState({ isLoading: false });
                }
            });
    }

    render() {
        if (this.state.redirect) {
            return (
                <Navigate to="/" />
            );

        }
        return (
            <div className="signup">
                <div className="signup-container">
                    <div className="signup-background">
                    </div>
                    <div className="signup-right" onMouseEnter={(e) => {
                        this.getOrganisations();
                        this.getPrograms();
                    }}>
                        <div className="signup-right-content">
                            <h1>Créer un compte</h1>
                            <form
                                id="signup-form"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    this.handleSubmit();
                                }}
                            >
                                <TextField
                                    id="identifier"
                                    name="identifier"
                                    label="Adresse courriel"
                                    variant="outlined"
                                    margin="normal"
                                    helperText={this.state.errors.email}
                                    error={this.state.errors.email ? true : false}
                                    onChange={(e) => this.setState({ email: e.target.value })}
                                    required
                                    sx={{ width: '100%' }}
                                />
                                <TextField
                                    id="first_name"
                                    name="first_name"
                                    label="Prénom"
                                    variant="outlined"
                                    margin="normal"
                                    helperText={this.state.errors.first_name}
                                    error={this.state.errors.first_name ? true : false}
                                    onChange={(e) => this.setState({ first_name: e.target.value })}
                                    required
                                    sx={{ width: '100%' }}
                                />
                                <TextField
                                    id="last_name"
                                    name="last_name"
                                    label="Nom de famille"
                                    variant="outlined"
                                    margin="normal"
                                    helperText={this.state.errors.last_name}
                                    error={this.state.errors.last_name ? true : false}
                                    onChange={(e) => this.setState({ last_name: e.target.value })}
                                    required
                                    sx={{ width: '100%' }}
                                />
                                <TextField
                                    id="username"
                                    name="username"
                                    label="Nom d'utilisateur"
                                    variant="outlined"
                                    margin="normal"
                                    helperText={this.state.errors.username}
                                    error={this.state.errors.username ? true : false}
                                    onChange={(e) => this.setState({ username: e.target.value })}
                                    required
                                    sx={{ width: '100%' }}
                                />

                                <TextField
                                    id="password"
                                    type="password"
                                    name="password"
                                    label="Mot de passe"
                                    variant="outlined"
                                    margin="normal"
                                    helperText={this.state.errors.password}
                                    error={this.state.errors.password ? (this.state.password !== this.state.password2) && (this.state.password2 !== '') : false}
                                    onChange={(e) => this.setState({ password: e.target.value })}
                                    required
                                    sx={{ width: '100%' }}
                                />
                                <TextField
                                    id="password2"
                                    type="password"
                                    name="password2"
                                    label="Confirmer le mot de passe"
                                    variant="outlined"
                                    margin="normal"
                                    helperText={this.state.errors.password}
                                    error={this.state.errors.password ? (this.state.password !== this.state.password2) && (this.state.password2 !== '') : false}
                                    onChange={(e) => this.setState({ password2: e.target.value })}
                                    required
                                    sx={{ width: '100%' }}
                                />
                                <FormControl fullWidth sx={{
                                    marginTop: '1rem',
                                }}
                                >
                                    <InputLabel id="organisation">Organisation</InputLabel>
                                    <Select
                                        id="organisation"
                                        label="Organisation"
                                        onChange={(e) => this.setState({ organisation_id: e.target.value })}
                                        value={this.state.organisation_id}
                                        required
                                    >
                                        {this.state.organisations && this.state.organisations.map((organisation) => (
                                            <MenuItem key={organisation.id} value={organisation.id}>{organisation.name}</MenuItem>
                                        ))}

                                    </Select>
                                </FormControl>

                                <FormControl fullWidth sx={{
                                    marginTop: '1rem',
                                }}
                                >
                                    <InputLabel id="program">Programme</InputLabel>
                                    <Select
                                        id="program"
                                        label="Programme"
                                        onChange={(e) => this.setState({ program_id: e.target.value })}
                                        value={this.state.program_id}
                                        required
                                    >
                                        {this.state.programs && this.state.programs.map((program) => (
                                            <MenuItem key={program.id} value={program.id}>{program.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControlLabel control={
                                    <Checkbox
                                        id="show_teacher_code"
                                        name="show_teacher_code"
                                        label="Compte enseignant"
                                        onChange={(e) => this.setState({ show_teacher_code: e.target.checked })}
                                    />
                                } label="Compte enseignant" />
                                <div hidden={!this.state.show_teacher_code}>

                                    <TextField
                                        id="teacher_code"
                                        name="teacher_code"
                                        label="Code d'enseignant"
                                        variant="outlined"
                                        margin="normal"
                                        helperText={this.state.errors.teacher_code}
                                        error={this.state.errors.teacher_code ? true : false}
                                        onChange={(e) => this.setState({ teacher_code: e.target.value })}
                                        sx={{ width: '100%' }}
                                    />
                                </div>

                                <Button
                                    variant="contained"
                                    form="signup-form"
                                    type="submit"
                                >
                                    Créer un compte
                                </Button>
                                <p>Vous avez déjà un compte ? <a href="/auth/login">Se connecter</a></p>
                            </form>
                        </div>
                    </div>
                </div>
                {this.state.isLoading ? <Loading></Loading> : null}
            </div>
        )
    }
}

export default (Signup);