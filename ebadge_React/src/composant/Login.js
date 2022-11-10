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
            identifierValid: false,
            passwordValid: false,
            submitDisabled: true
        }
    }

    handleChangeIdentifier(e) {
        let identifierValid = e.target.value ? true : false; 
        let submitValid = this.state.textValid && identifierValid;
        this.setState({
            identifier: e.target.value,
            identifierValid: identifierValid,
            identifierDisabled: !submitValid
        })
    }

    handleChangePassword(e) {
        let passwordValid = e.target.value ? true : false;
        let submitValid = this.state.emailValid && passwordValid;
        this.setState({
            password: '',
            passwordValid: passwordValid,
            submitDisabled: !submitValid
        })
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
                                    label="Identifiant"
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    onChange={this.handleChangeIdentifier.bind(this)}
                                    value={this.state.identifier}
                                    sx={{ width: '100%' }}
                                />
                                <TextField
                                    id="password"
                                    label="Mot de passe"
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    onChange={this.handleChangePassword.bind(this)}
                                    value={this.state.password}
                                    sx={{ width: '100%' }}
                                />
                                <Button
                                    variant="contained"
                                    size="Large"
                                    enable={this.state.submitDisabled}
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