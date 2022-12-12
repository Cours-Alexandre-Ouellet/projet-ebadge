import { Outlet } from "react-router-dom";
import Navbar from '../composant/layout/Navbar';
import React, { useLayoutEffect } from "react";
import Loading from "../composant/Loading/LoadingComponent";

class Logout extends React.Component {

    componentDidMount() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location = '/auth/login';
    }

    render() {
        return (
            <Loading></Loading>
        )
    }
}

export default Logout;