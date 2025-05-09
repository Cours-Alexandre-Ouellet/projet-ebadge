import React from 'react';
import './Login.css';
import '@mui/material';
import { Button, TextField } from '@mui/material';
import Api from '../../utils/Api';
import { Navigate } from 'react-router-dom';
import Loading from '../../composant/Loading/LoadingComponent';
import PoliciesHelper from '../../policies/PoliciesHelper';
import Role from '../../policies/Role';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            identifier: '',
            password: '',
            identifierError: '',
            passwordError: '',
            isLoading: false,
            redirectPath: '/'
        }
        this.handleChange = this.handleChange.bind(this);
        this.validateIdentifier = this.validateIdentifier.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.redirectUser = this.redirectUser.bind(this);
    }

    /**
     * fonction qui change la valeur du champ quand on tape dedans
     * @param {*} event 
     */
    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    /**
     * fonction qui valide l'identifiant
     * @returns boolean 
     */
    validateIdentifier() {
        if (this.state.identifier.length === 0) {
            this.setState({ identifierError: 'Veuillez renseigner votre identifiant' });
            return false;
            //regex email
        } else if (!this.state.identifier.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
            this.setState({ identifierError: 'Le format de l\'adresse couriel est invalide' });
            return false;
        } else {
            this.setState({ identifierError: '' });
            return true;
        }
    }

    /**
     * fonction qui valide le mot de passe
     * @returns 
     */
    validatePassword() {
        if (this.state.password.length === 0) {
            this.setState({ passwordError: 'Veuillez renseigner votre mot de passe' });
            return false;
        } else {
            this.setState({ passwordError: '' });
            return true;
        }
    }

    /**
     * fonction qui gère la soumission du formulaire
     * @param {*} event 
     */
    redirectUser() {
        this.setState({ isLoading: false });

        var policiesHelper = new PoliciesHelper();

        window.location = policiesHelper.getDefaultRoute();
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.validateIdentifier() && this.validatePassword()) {
            this.setState({ isLoading: true });
            Api.post('/auth/login', {
                email: this.state.identifier,
                password: this.state.password
            }).then((response) => {
                localStorage.setItem('token', response.data.access_token);
                localStorage.setItem('username', response.data.username);
                localStorage.setItem('role', response.data.role);

                this.redirectUser();
            }).catch((error) => {
                this.setState({isLoading: false})
                if (error.response) {
                    switch (error.response.status) {
                        case 401:
                            this.setState({ identifierError: 'Identifiant ou mot de passe incorrect' });
                            this.setState({ passwordError: 'Identifiant ou mot de passe incorrect' });
                            break;
                        case 422:
                            this.setState({ identifierError: 'Le format de l\'adresse couriel est invalide' });
                            break;
                        default:
                            this.setState({ identifierError: 'Une erreur est survenue' });
                            this.setState({ passwordError: 'Une erreur est survenue' });
                            break;
                    }
                    console.log(error.response.data);
                } else {
                    console.error(error);
                }
            });
        }
    }

    /**
     * Si l'utilisateur est déjà connecté, on le redirige vers la page d'accueil
     */
    componentDidMount() {
        if (localStorage.getItem('token')) {
            Api.get('/auth/current_user').then((response) => {

                this.redirectUser();

            }).catch((error) => {
                console.error(error);
            });
        }
    }

    render() {
        return (
            <div className="login">
                {this.state.isLoading ? <Loading></Loading> : null}
                <div className="login-container">
                    <div className="login-background">
                    </div>
                    <div className="login-right">
                        <div className="login-right-content">
                            <h1>E-Badge</h1>
                            <form className='form-login'>
                                <TextField
                                    id="identifier"
                                    name="identifier"
                                    label="Adresse courriel"
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    autoFocus
                                    onChange={this.handleChange}
                                    onBlur={this.validateIdentifier.bind(this)}
                                    value={this.state.identifier}
                                    error={this.state.identifierError !== ''}
                                    helperText={this.state.identifierError === "" ? "" : this.state.identifierError}
                                    sx={{ width: '100%' }}
                                />
                                <TextField
                                    id="password"
                                    type="password"
                                    name="password"
                                    label="Mot de passe"
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    onChange={this.handleChange}
                                    onBlur={this.validatePassword.bind(this)}
                                    value={this.state.password}
                                    error={this.state.passwordError !== ""}
                                    helperText={this.state.passwordError === "" ? "" : this.state.passwordError}
                                    sx={{ width: '100%' }}
                                />
                                <Button
                                    variant="contained"
                                    size="Large"
                                    disabled={this.state.identifier === '' || this.state.password === ''}
                                    onClick={this.handleSubmit}
                                    sx={{
                                        width: '60%',
                                        marginTop: '20px'
                                    }}>
                                    Connexion →
                                </Button>
                            </form>
                            <p>Pas de compte ? <a href='/auth/signup'>Créer un compte</a></p>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;