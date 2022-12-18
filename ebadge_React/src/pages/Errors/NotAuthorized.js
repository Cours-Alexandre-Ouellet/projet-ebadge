
import React from 'react';
import '@mui/material';
import { Button } from '@mui/material';


class NotAuthorized extends React.Component {

    render() {
        return (
            <div className="notAuthorized">
                <h1>Vous n'êtes pas autorisé à accéder à cette page</h1>
                <Button variant="contained" color="primary" href="/">Retour à l'accueil</Button>
            </div>
        );
    }
}

export default NotAuthorized;