import React from "react";
import Loading from "../composant/Loading/LoadingComponent";

class Logout extends React.Component {

    componentDidMount() {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        window.location = '/auth/login';
    }

    render() {
        return (
            <Loading></Loading>
        )
    }
}

export default Logout;