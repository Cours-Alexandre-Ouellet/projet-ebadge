import { Outlet } from "react-router-dom";
import Navbar from '../composant/layout/Navbar';
import React, { useLayoutEffect } from "react";

class Logout extends React.Component {

    componentDidMount() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
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