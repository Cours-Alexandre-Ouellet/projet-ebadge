import React from 'react';
import { Outlet } from "react-router-dom";
import Navbar from '../composant/layout/Navbar';
import BadgeAchievementPopup from '../composant/Dashboard/Popups/BadgeAchievementPopup/BadgeAchievementPopup';

const isConnected = !!localStorage.getItem("token");

class Layout extends React.Component {
  render() {
    return (
      <>
        <Navbar />
        <div className="main">
          <Outlet />
          {isConnected && <BadgeAchievementPopup />}
        </div>
      </>
    )
  }
}

export default Layout;