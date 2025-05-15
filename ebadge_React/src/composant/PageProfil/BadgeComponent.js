import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { getResource } from "../../utils/Api";
import "./MetalBadge.css";
import { initParticleEffect, getBadgeStyle } from './EffetsBadge.js';

/**
 * Composant BadgeComponent
 * 
 * Ce composant affiche un badge avec une image, un titre, une description,
 * un pourcentage d'obtention et le nom de l'enseignant qui l'a créé.
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.badge - Les données du badge à afficher
 */
const BadgeComponent = ({ badge }) => {
  // Initialize particle effect after component mounts
  useEffect(() => {
    const particleTimer = setTimeout(initParticleEffect, 100);
    
    // Clean up the timer when component unmounts
    return () => clearTimeout(particleTimer);
  }, []);

  /**
   * Obtient la couleur du badge selon différentes structures de données
   * 
   * Codé par Copilot - Claude 3.7 Sonnet - [Modèle massif de langage] - [Consulté le 13 mai 2025]
   * 
   * @returns {Object} Style CSS du badge avec les variantes de couleur
   */
  const getComputedBadgeStyle = () => {
    if (!badge) return {};

    let categoryColor;
    
    if (badge.category === null || badge.category === undefined) {
      categoryColor = badge.category_color || "#C0C0C0";
    } else {
      categoryColor = badge.category?.color || badge.category_color || "#C0C0C0";
    }

    // For debugging
    // console.log("Badge data:", badge);
    // console.log("Selected color:", categoryColor);
    
    return getBadgeStyle(categoryColor);
  };

  /// Fonction pour obtenir les initiales de l'enseignant
  /// @returns {string} Les initiales de l'enseignant
  const getInitials = () => {
    const firstName = badge.creator_name || "";
    const lastName = badge.creator_last_name || "";

    if (!firstName && !lastName) return "??";

    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "?";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "?";

    return `${firstInitial}${lastInitial}`;
  };
  
  const categoryName = badge.category_name || "Non catégorisé";
  const teacherName = badge.creator_name || "";
  const teacherLastName = badge.creator_last_name || "";
  const fullName = `${teacherName} ${teacherLastName}`.trim();
  const creator = fullName ? `Créé par ${fullName}` : "Créateur inconnu";
  const badgeStyle = getComputedBadgeStyle(badge.category_color);
  const badgeImageURL = badge.imagePath || getResource("badge.png");
  const possession = badge.possession ? (badge.possession).toFixed(0) : 0;

    return (
    <div className='Badge'>
      <div className="badge-wrapper" style={badgeStyle}>       
        <div className="badge metal-badge">
          <div className="umbrella"></div>
          <div className="inner">
            <img 
              src={badgeImageURL} 
              alt={badge.title} 
              className='badgeIcon'
            />
          </div>
          <div className="glossy"></div>
        </div>    
        <div className="teacher-circle" title={creator}>
          {getInitials()}
        </div>
      </div>
      
      <div className="hideDisplay">
        <h3 className='textBadge'>{badge.title}</h3>
        <p>Catégorie: {categoryName}</p>
        <p>{badge.description}</p>
        <p>Pourcentage d'obtention : {possession}%</p>
        <p>{creator}</p>
      </div>
    </div>
  );
};

// Validation des props
BadgeComponent.propTypes = {
  badge: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    imagePath: PropTypes.string,
    possession: PropTypes.number,
    category_color: PropTypes.string,
    category_name: PropTypes.string,
    creator_name: PropTypes.string,
    creator_last_name: PropTypes.string
  }).isRequired
};

// Valeurs par défaut pour le badge
BadgeComponent.defaultProps = {
  badge: {
    title: "Badge sans titre",
    description: "Pas de description disponible",
    possession: 0,
    category_name: "Non catégorisé",
    category_color: "#838489"
  }
};

export default (BadgeComponent);