import React from "react";
import { getResource } from "../../utils/Api";
/**
 * @param {Object} props
 * @param {Object} props.badge - Objet badge
 * @param {string} props.badge.title - Titre du badge
 * @param {string} props.badge.description - Description du badge
 * @param {string | null} props.badge.imagePath - Le chemin de l'image du badge
 * @param {number} props.badge.possession - La possession du badge
 * @param {string} props.badge.category_color - La couleur de la catégorie du badge
 * @param {string} props.badge.creator_name - Le nom de l'enseignant
 * @param {string} props.badge.creator_last_name - Le prénom de l'enseignant
 */
class BadgeComponent extends React.Component {

  /// Fonction pour obtenir les initiales de l'enseignant
  /// @returns {string} Les initiales de l'enseignant
  getInitials() {
    const firstName = this.props.badge.creator_name || "";
    const lastName = this.props.badge.creator_last_name || "";

    if (!firstName && !lastName) return "??";

    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "?";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "?";

    return `${firstInitial}${lastInitial}`;
  }
  
  render() {
    const shadowColor = this.props.badge.category_color || 'transparent';
    const categoryName = this.props.badge.category_name || "Non catégorisé";
    const teacherName = this.props.badge.creator_name || "";
    const teacherLastName = this.props.badge.creator_last_name || "";
    const fullName = `${teacherName} ${teacherLastName}`.trim();
    const creator = fullName ? `Créé par ${fullName}` : "Créateur inconnu";

    return (<div className='Badge'>
      <div className="badge-wrapper">
        <img 
          src={this.props.badge.imagePath || getResource("badge.png") } 
          alt={this.props.badge.title} 
          className='badgeIcon'  
          style={{ boxShadow: `0 0 8px 10px ${shadowColor}`,}}
        />
        <div className="teacher-circle" title={creator}>
          {this.getInitials()}
        </div>
      </div>
      <div className="hideDisplay">
        <h3 className='textBadge'>{this.props.badge.title}</h3>
        <p>Catégorie: {categoryName}</p>
        <p>{this.props.badge.description}</p>
        <p>Pourcentage d'obtention : {this.props.badge.possession ? (this.props.badge.possession).toFixed(0) : 0}%</p>
        <p>{creator}</p>
      </div>
    </div>
    );
  }
}

export default (BadgeComponent);