import React from 'react';
import { Outlet } from "react-router-dom";
import Navbar from '../composant/layout/Navbar';

class Layout extends React.Component {
  render() {
    return (
      <>
        <Navbar />
        <div className="main">
          <Outlet />
        </div>
      </>
    )
  }
}

export default Layout;