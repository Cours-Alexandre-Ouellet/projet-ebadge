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