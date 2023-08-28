import { theBackground } from './src/theBackground';
import startStarryBackground from './src/man-thats-beautiful';

// inject random radial-gradient 
window.onload = function() {
  document.body.style.backgroundImage = theBackground();
};

startStarryBackground();
