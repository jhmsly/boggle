/**
 * Game Bootstrap File
 */

// Import new game.
import Boggle from './Boggle';

// Initialize the game when the page has loaded.
window.addEventListener('load', () => {
  // Create empty container for non-default game settings.
  let gameSettingsCustom = {};

  // Check if user provided game settings are present and not empty.
  // eslint-disable-next-line no-undef
  if (typeof gameSettings !== 'undefined' && gameSettings !== null)
    // eslint-disable-next-line no-undef
    gameSettingsCustom = gameSettings;

  // Create a new instance of the game.
  const boggle = new Boggle(gameSettingsCustom);
});
