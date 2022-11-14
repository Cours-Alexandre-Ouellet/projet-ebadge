import React from 'react';
import './Login.css';
import '@mui/material';
import { Button, TextField } from '@mui/material';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            identifier: '',
            password: '',
            identifierError: '',
            passwordError: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.validateIdentifier = this.validateIdentifier.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    validateIdentifier() {
        if (this.state.identifier.length === 0) {
            this.setState({ identifierError: 'Veuillez renseigner votre identifiant' });
            return false;
        } else {
            this.setState({ identifierError: '' });
            return true;
        } // TODO: check format of identifier
    }

    validatePassword() {
        if (this.state.password.length === 0) {
            this.setState({ passwordError: 'Veuillez renseigner votre mot de passe' });
            return false;
        } else {
            this.setState({ passwordError: '' });
            return true;
        } // TODO: check format of password
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.validateIdentifier() && this.validatePassword()) {
            // TODO: Appel API
        }
    }

    render() {
        return (
            <div className="login">
                <div className="login-container">
                    <div className="login-background">
                    </div>
                    <div className="login-right">
                        <div className="login-right-content">
                            <h1>E-Badge</h1>
                            <form>
                                <TextField
                                    id="identifier"
                                    name="identifier"
                                    label="Identifiant"
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    onChange={this.handleChange}
                                    onBlur={this.validateIdentifier.bind(this)}
                                    value={this.state.identifier}
                                    error={this.state.identifierError !== ''}
                                    helperText={this.state.identifierError === "" ? "" : this.state.identifierError}
                                    sx={{ width: '100%' }}
                                />
                                <TextField
                                    id="password"
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
                            <p><a href='/'>Mot de passe oublié?</a></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;