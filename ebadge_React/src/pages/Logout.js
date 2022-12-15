import React from "react";

class Logout extends React.Component {

    componentDidMount() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        window.location = '/auth/login';
    }

    render() {
        return (
            <>
                <p>Déconnexion en cours...</p>
            </>
        )
    }
}

export default Logout;