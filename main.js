import './style.css';
import { theBackground } from './src/theBackground';
import startStarryBackground from './src/man-thats-beautiful';

window.onload = function() {
  document.body.style.backgroundImage = theBackground();
};

startStarryBackground();
