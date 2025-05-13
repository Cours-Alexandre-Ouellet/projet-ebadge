import React from "react";
import { getResource } from "../../utils/Api";
import "./MetalBadge.css";
import { initParticleEffect } from './ParticulesBadge.js';
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

/**
 * Composant BadgeComponent
 * 
 * Ce composant affiche un badge avec une image, un titre, une description,
 * un pourcentage d'obtention et le nom de l'enseignant qui l'a créé.
 */
class BadgeComponent extends React.Component {

  componentDidMount() {
    // Initialiser l'effet de particules après le rendu du composant
    // Codé par VSCode Copilot - Claude 3.7 Sonnet - [Modèle massif de langage]
    setTimeout(initParticleEffect, 100);
  }

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

  /// Fonction pour obtenir les couleurs pour le style du badge
  /// @returns {Object} Un objet contenant les couleurs pour le style du badge
  /// Codé par VSCode Copilot - Claude 3.7 Sonnet - [Modèle massif de langage] 
  getBadgeStyle() {
    const categoryColor = this.props.badge.category_color || '#839489';

    const darkerColor = this.adjustColor(categoryColor, -80, 0.7);
    const mediumColor = this.adjustColor(categoryColor, -40, 0.8);
    const lighterColor = this.adjustColor(categoryColor, 60, 1.5);

    return {
      '--badge-color': categoryColor,
      '--badge-color-dark': darkerColor,
      '--badge-color-medium': mediumColor,
      '--badge-color-light': lighterColor
    };
  }

  /// Fonction pour ajuster les couleurs du style du badge
  /// @param {string} color - La couleur à ajuster
  /// @param {number} brightnessFactor - Le facteur de luminosité
  /// Codé par VSCode Copilot - Claude 3.7 Sonnet - [Modèle massif de langage] 
  adjustColor(color, brightnessFactor) {
    if(!color || color === 'transparent') return '#C0C0C0';

    if(color.length === 4) {
      color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
    }

    let r = parseInt(color.substring(1, 3), 16);
    let g = parseInt(color.substring(3, 5), 16);
    let b = parseInt(color.substring(5, 7), 16);

    let [h, s, l] = this.rgbToHsl(r, g, b);
  

    l = Math.max(0, Math.min(1, l + (brightnessFactor / 100)));
  
    s = Math.max(0, Math.min(1, s));
  
    [r, g, b] = this.hslToRgb(h, s, l);
  
    const rHex = Math.round(r).toString(16).padStart(2, '0');
    const gHex = Math.round(g).toString(16).padStart(2, '0');
    const bHex = Math.round(b).toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`;
  }

 /// Fonction pour convertir RGB en HSL
  /// @param {number} r - La valeur rouge
  /// @param {number} g - La valeur verte
  /// @param {number} b - La valeur bleue
  /// @returns {Array} Un tableau contenant les valeurs HSL
  /// Codé par VSCode Copilot - Claude 3.7 Sonnet - [Modèle massif de langage]
rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    
    h /= 6;
  }
  
  return [h, s, l];
}

/// Fonction pour convertir HSL en RGB
/// @param {number} h - La valeur de teinte
/// @param {number} s - La valeur de saturation
/// @param {number} l - La valeur de luminosité
/// @returns {Array} Un tableau contenant les valeurs RGB
/// Codé par VSCode Copilot - Claude 3.7 Sonnet - [Modèle massif de langage]
hslToRgb(h, s, l) {
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  return [r * 255, g * 255, b * 255];
}

  render() {
    const categoryName = this.props.badge.category_name || "Non catégorisé";
    const teacherName = this.props.badge.creator_name || "";
    const teacherLastName = this.props.badge.creator_last_name || "";
    const fullName = `${teacherName} ${teacherLastName}`.trim();
    const creator = fullName ? `Créé par ${fullName}` : "Créateur inconnu";
    const badgeStyle = this.getBadgeStyle();
    const badgeImageUrl = this.props.badge.imagePath || getResource("badge.png");

    return (
    <div className='Badge'>
      <div className="badge-wrapper" style={badgeStyle}>       
        <div className="badge metal-badge">
          <div className="umbrella"></div>
      <div className="inner">
        <img 
          src={badgeImageUrl} 
          alt={this.props.badge.title} 
          className='badgeIcon'
        />
      </div>
      <div className="glossy"></div>
    </div>    
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
