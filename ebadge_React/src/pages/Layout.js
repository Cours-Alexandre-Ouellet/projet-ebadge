import React from 'react';
import { Outlet } from "react-router-dom";
import Navbar from '../composant/layout/Navbar';

class Layout extends React.Component {
    render() {
        return (
            <>
              <Navbar />       
              <Outlet />
            </>
          )
    }
}

export default Layout;