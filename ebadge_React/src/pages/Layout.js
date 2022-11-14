import React from 'react';
import { Outlet, Link } from "react-router-dom";
import Navbar from '../composant/layout/Navbar';

class Layout extends React.Component {
    render() {
        return (
            <>
              <Navbar />
              <nav>
                <ul>
                  <li>
                    <Link to="/">Accueil</Link>
                  </li>
                  <li>
                    <Link to="/login">Se connecter</Link>
                  </li>
                </ul>
              </nav>
        
              <Outlet />
            </>
          )
    }
}

export default Layout;