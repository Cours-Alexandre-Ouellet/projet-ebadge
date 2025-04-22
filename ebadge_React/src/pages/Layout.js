import React from 'react';
import { Outlet } from "react-router-dom";
import Navbar from '../composant/layout/Navbar';
import BadgeAchievementPopup from '../composant/Dashboard/Popups/BadgeAchievementPopup/BadgeAchievementPopup';

class Layout extends React.Component {
  render() {
    return (
      <>
        <Navbar />
        <div className="main">
          <Outlet />
          <BadgeAchievementPopup />
        </div>
      </>
    )
  }
}

export default Layout;