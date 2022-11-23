import React from "react";
import { isLogin } from "../../utils/AuthUtils";
import LoadingSpinner from "../../composant/LoadingSpinner/LoadingSpinner";
import { Navigate } from "react-router-dom";
import { AuthRequest } from "../../utils/Api";



class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            loading: true,
            users: [],
        }
    }

    async componentDidMount() {
        const redirect = !(await isLogin());
        console.log(redirect);
        this.setState({ redirect: redirect, loading: false });
        if (redirect) {
            return;
        }

        try {
            let response = await AuthRequest.get('/user');
            console.log(response);
            let users = response.data;

            this.setState({ users: users });
        } catch (error) {
            console.error(error);
        }


    }

    render() {
        if (this.state.loading) {
            return <div className="loading"><LoadingSpinner /></div>
        }
        if (this.state.redirect) {
            return <Navigate to="/login" />
        }

        return (
            <div>
                <h1>Admin</h1>
                {/* //TODO FAIRE LA PAGE */}
            </div>

        )
    }
}

export default Admin;