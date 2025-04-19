import React from "react";
import { getResource } from "../../utils/Api";
/**
 * @param {Object} props
 * @param {Object} props.badge - Objet badge
 * @param {string} props.badge.title - Titre du badge
 * @param {string} props.badge.description - Description du badge
 * @param {string | null} props.badge.imagePath - Le chemin de l'image du badge
 * @param {number} props.badge.possession - La possession du badge
 */
class BadgeComponent extends React.Component {

  render() {

    const shadowColor = this.props.badge.category_color || 'transparent';

    return (<div className='Badge'>
      <img src={this.props.badge.imagePath || getResource("badge.png") } alt={this.props.badge.title} className='badgeIcon'  style={{ 
      boxShadow: `0 0 8px 10px ${shadowColor}`,
    }} />
      <div className="hideDisplay">
        <h3 className='textBadge'>{this.props.badge.title}</h3>
        <p>{this.props.badge.description}</p>
        <p>Pourcentage d'obtention : {this.props.badge.possession ? (this.props.badge.possession).toFixed(0) : 0}%</p>
      </div>
    </div>
    );
  }
}

export default (BadgeComponent);
