/**
 * Script utilitaire pour les badges
 */

/**
 * Script pour créer un effet de particules sur les badges
 * Particules qui apparaissent au survol et au mouvement de la souris
 * Codé par Copilot - Claude 3.7 Sonnet - [Modèle massif de langage] - [Consulté le 13 main 2025]
 */
export const initParticleEffect = () => {
  // Find all badge wrappers
  const badgeWrappers = document.querySelectorAll('.badge-wrapper');

  badgeWrappers.forEach(wrapper => {
    // Create particle container
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    
    // Create particles
    const numParticles = 20;
    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Set initial size - varying sizes for more dynamic effect
      const size = Math.random() * 5 + 2; // 2-7px
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      particleContainer.appendChild(particle);
    }
    
    // Find the badge element and insert the particle container
    const badge = wrapper.querySelector('.badge');
    if (badge) {
      badge.appendChild(particleContainer);
    }
    
    // Add mouse events
    wrapper.addEventListener('mouseenter', () => {
      createSparkleEffect(particleContainer);
    });
    
    wrapper.addEventListener('mousemove', (e) => {
      if (Math.random() > 0.7) { // Throttle particle creation on move
        createSparkleOnMove(e, particleContainer, wrapper);
      }
    });
  });
};

// Function to create sparkle effect on hover
function createSparkleEffect(container) {
  const particles = container.querySelectorAll('.particle');
  
  particles.forEach((particle, i) => {
    setTimeout(() => {
      // Random positioning around the edge of the badge
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 60; // 40-100% of radius
      
      const startX = Math.cos(angle) * distance;
      const startY = Math.sin(angle) * distance;
      
      // Set particle initial position
      particle.style.left = `calc(50% + ${startX}px)`;
      particle.style.top = `calc(50% + ${startY}px)`;
      
      // Calculate travel direction (inward or outward)
      const travelMultiplier = Math.random() < 0.5 ? -1 : 1;
      const xTravel = Math.cos(angle) * (20 + Math.random() * 80) * travelMultiplier;
      const yTravel = Math.sin(angle) * (20 + Math.random() * 80) * travelMultiplier;
      
      // Set custom properties for the animation
      particle.style.setProperty('--x-travel', `${xTravel}px`);
      particle.style.setProperty('--y-travel', `${yTravel}px`);
      
      // Apply animation
      particle.style.animation = `particle-animation ${0.5 + Math.random() * 1}s ease-out forwards`;
      
      // Reset animation after it completes
      setTimeout(() => {
        particle.style.animation = 'none';
      }, 1500);
    }, i * 50); // Stagger the effect
  });
}

// Function to create sparkles on mouse movement
function createSparkleOnMove(e, container, wrapper) {
  const rect = wrapper.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  // Calculate mouse position relative to the badge center
  const mouseX = e.clientX - centerX;
  const mouseY = e.clientY - centerY;
  
  // Calculate distance from center
  const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
  const maxDistance = rect.width / 2;
  
  // Only create particles near the edge (80-100% of radius)
  if (distance > maxDistance * 0.7 && distance < maxDistance * 0.95) {
    // Find a particle that's not currently animating
    const particles = container.querySelectorAll('.particle');
    const availableParticle = Array.from(particles).find(p => p.style.animation === 'none' || p.style.animation === '');
    
    if (availableParticle) {
      // Position particle at mouse location relative to container
      const relativeX = (e.clientX - rect.left) / rect.width * 100;
      const relativeY = (e.clientY - rect.top) / rect.height * 100;
      
      availableParticle.style.left = `${relativeX}%`;
      availableParticle.style.top = `${relativeY}%`;
      
      // Set travel direction (mostly outward)
      const angle = Math.atan2(mouseY, mouseX);
      const xTravel = Math.cos(angle) * (10 + Math.random() * 40);
      const yTravel = Math.sin(angle) * (10 + Math.random() * 40);
      
      availableParticle.style.setProperty('--x-travel', `${xTravel}px`);
      availableParticle.style.setProperty('--y-travel', `${yTravel}px`);
      
      // Apply animation
      availableParticle.style.animation = `particle-animation ${0.3 + Math.random() * 0.4}s ease-out forwards`;
      
      // Reset animation after it completes
      setTimeout(() => {
        availableParticle.style.animation = 'none';
      }, 700);
    }
  }
}

/**
 * Fonction pour produire les variantes de couleur d'un badge
 * 
 * Codé par Copilot - Claude 3.7 Sonnet - [Modèle massif de langage] - [Consulté le 13 mai 2025]
 * 
 * @param {string} categoryColor - La couleur de la catégorie du badge
 * @returns {Object} Un objet contenant les variables CSS pour le badge
 */
export const getBadgeStyle = (categoryColor) => {
  const baseColor = categoryColor || '#839489';
  
  const darkerColor = adjustColor(baseColor, -80);
  const mediumColor = adjustColor(baseColor, -40);
  const lighterColor = adjustColor(baseColor, 60);

  return {
    '--badge-color': baseColor,
    '--badge-color-dark': darkerColor,
    '--badge-color-medium': mediumColor,
    '--badge-color-light': lighterColor
  };
};

/**
 * Fonction pour ajuster la couleur d'un badge
 * Convertit en format de couleur long si le format est court.
 * Ajuste la luminosité et la saturation.
 * 
 * Codé par Copilot - Claude 3.7 Sonnet - [Modèle massif de langage] - [Consulté le 13 mai 2025]
 * 
 * @param {string} color - La couleur à ajuster (en hexadécimal)
 * @param {number} brightnessFactor - Le facteur d'ajustement de la luminosité
 * @returns {string} The adjusted color in hex format
 */
export const adjustColor = (color, brightnessFactor) => {
  if(!color || color === 'transparent') return '#C0C0C0';

  if(color.length === 4) {
    color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
  }

  let r = parseInt(color.substring(1, 3), 16);
  let g = parseInt(color.substring(3, 5), 16);
  let b = parseInt(color.substring(5, 7), 16);

  let [h, s, l] = rgbToHsl(r, g, b);

  l = Math.max(0, Math.min(1, l + (brightnessFactor / 100)));
  s = Math.max(0, Math.min(1, s));

  [r, g, b] = hslToRgb(h, s, l);

  const rHex = Math.round(r).toString(16).padStart(2, '0');
  const gHex = Math.round(g).toString(16).padStart(2, '0');
  const bHex = Math.round(b).toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
};

/**
 * Convertit la couleur RGB en HSL
 * 
 * Codé par Copilot - Claude 3.7 Sonnet - [Modèle massif de langage] - [Consulté le 13 mai 2025]
 * 
 * @param {number} r - Valeur rouge (0-255)
 * @param {number} g - Valeur vert (0-255)
 * @param {number} b - Valeur bleue (0-255)
 * @returns {Array} Array contenant les valeurs [h, s, l]
 */
export const rgbToHsl = (r, g, b) => {
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
};

/**
 * Convertit la couleur HSL en RGB
 * 
 * Codé par Copilot - Claude 3.7 Sonnet - [Modèle massif de langage] - [Consulté le 13 mai 2025]
 * 
 * @param {number} h - Valeur couleur (0-1)
 * @param {number} s - Valeur saturation (0-1)
 * @param {number} l - Valeur luminosité (0-1)
 * @returns {Array} Array contenant les valeurs [r, g, b] (0-255)
 */
export const hslToRgb = (h, s, l) => {
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
};