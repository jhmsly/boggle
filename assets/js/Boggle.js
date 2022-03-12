/**
 * --------------------------------------------------------------------------
 * Boggle Word Game
 * Licensed under MIT: https://github.com/jhmsly/boggle/LICENSE
 * --------------------------------------------------------------------------
 */

/**
 * Import Components
 */

import Board from "./components/Board";
import Tile from "./components/Tile";
import Word from "./components/Word";
import Dictionary from "./lib/dictionary";
import ScoreBoard from "./components/ScoreBoard";
import ShareButton from "./components/ShareButton";

/**
 * Game Constants
 */

// Game Identifier
const gameIdentifier = "boggle";

// Game Container ID
const gameContainerId = `js-${gameIdentifier}`;
const gameContainerClass = gameIdentifier;

// Default Game Settings
const gameSettingsDefault = {
  id: 0,
  board: {
    columns: 4,
    rows: 4,
    letters: [
      "A",
      "C",
      "E",
      "F",
      "M",
      "N",
      "R",
      "D",
      "C",
      "X",
      "U",
      "F",
      "I",
      "E",
      "N",
      "F",
    ],
  },
  dictionary: ["ACE", "CAM", "RUN"],
  rules: {
    minWordLength: 3,
  },
  domain: "words.xyz",
};

/**
 * Game Class
 */

export default class Boggle {
  // Define private properties.
  #settings;
  #containerId;
  #containerClass;
  #dictionary;
  #score;
  #scoreBoard;
  #board;
  #wordEntry;
  #tiles;
  #activeTiles;
  #currentWord;
  #solvedWords;
  #shareButton;

  constructor(customSettings = {}) {
    // Set game identifier, container id and container class.
    this.#settings = { ...gameSettingsDefault, ...customSettings };
    this.#containerId = gameContainerId;
    this.#containerClass = gameContainerClass;
    this.#dictionary = null; // Dictionary component.
    this.#score = 0; // Score.
    this.#scoreBoard = null; // ScoreBoard component.
    this.#board = null;
    this.#wordEntry = null; // Word entry component.
    this.#shareButton = null; // Share button component.
    this.#tiles = []; // Hold tiles.
    this.#activeTiles = []; // Hold active tiles.
    this.#currentWord = ""; // Current word.
    this.#solvedWords = [];
  }

  /**
   * Start the game.
   */

  play() {
    // Initialize game.
    this.#init();
  }

  /**
   * Initialize the game.
   */

  #init() {
    /**
     * Check if settings are valid and present.
     */

    if (!this.#settings)
      throw new Error("A valid game configuration is required.");
    const { board, dictionary, rules } = this.#settings;

    /**
     * Initialize the dictionary and rules.
     */

    // New instance of Dictionary component.
    const gameDictionary = new Dictionary({
      dictionary: dictionary,
      rules: rules,
    });

    this.#dictionary = gameDictionary;

    /**
     * Create game container element.
     */

    // Check if game container element exists.
    if (!document.getElementById(this.#containerId))
      throw new Error(
        `Game container element with ID "#${this.#containerId}" does not exist.`
      );

    // Get game container element.
    const gameContainerEl = document.getElementById(this.#containerId);

    // Add game container class.
    gameContainerEl.className = this.#containerClass;

    /**
     * Create the score board.
     */

    const scoreBoard = new ScoreBoard(
      {
        score: this.#score,
        maxScore: this.#dictionary.dictionary.length,
      },
      this.#containerClass
    );

    this.#scoreBoard = scoreBoard;

    gameContainerEl.appendChild(this.#scoreBoard.el);

    /**
     * Create game board.
     */

    // New instance of Board component.
    const gameBoard = new Board(
      {
        columns: board.columns,
        rows: board.rows,
      },
      this.#containerClass
    );

    // Add Board to game constructor.
    this.#board = gameBoard;

    // Add Board to game container.
    gameContainerEl.appendChild(this.#board.el);

    /**
     * Add tiles to game board.
     */

    // Number of Tiles
    const numberOfTiles = board.columns * board.rows;

    // Check if number of letters is equal to the number of tiles.
    if (board.letters.length < numberOfTiles)
      throw new Error(
        `Number of letters provided in game settings (${board.letters.length}) should be equal to or greater than the number of tiles set for the game (${numberOfTiles}).`
      );

    // Extract appropriate number of letters from provided settings (first in first out).
    const validLetters = board.letters.slice(0, numberOfTiles);

    // Create array of tiles from valid letters.
    const tiles = validLetters.map((letter, index) => {
      // New instance of Tile component.
      const tile = new Tile(
        {
          id: index,
          letter: letter,
        },
        this.#containerClass
      );

      return tile;
    });

    // Store the tiles in the class.
    this.#tiles = tiles;

    // Add tiles to board.
    this.#board.tiles = this.#tiles;

    /**
     * Create word section.
     */

    // New instance of word component.
    const wordEntry = new Word(
      {
        text: {
          initial: "Tap to Play",
          inactive: "Select a Tile",
        },
      },
      this.#containerClass
    );

    this.#wordEntry = wordEntry;

    gameContainerEl.appendChild(this.#wordEntry.el);

    /**
     * Add share button to the game.
     */

    const shareButton = new ShareButton(
      {
        score: this.#score,
        maxScore: this.#dictionary.dictionary.length,
        tiles: this.#tiles,
        gameId: this.#settings.id,
        columns: board.columns,
        domain: this.#settings.domain,
      },
      this.#containerClass
    );

    this.#shareButton = shareButton;

    gameContainerEl.appendChild(this.#shareButton.el);

    /**
     * Initialize the game controls.
     */

    this.#initTileControls();
    this.#initWordControls();
    this.#initShareControls();
  }

  /**
   * Listen for interactions with tiles.
   */

  #initTileControls() {
    /**
     * Listen to each tile for a click event.
     */

    this.#tiles.forEach((tile) => {
      tile.el.addEventListener("click", this.#handleTileClick.bind(this, tile));
    });
  }

  /**
   * Listen for interactions with the word elements.
   */

  #initWordControls() {
    /**
     * Listen to the submit button for a click event.
     */

    // Establish controller for event listener.
    const submitListener = new AbortController();

    this.#wordEntry.submitEl.addEventListener(
      "click",
      this.#handleWordSubmit.bind(this, submitListener),
      { signal: submitListener.signal }
    );
  }

  /**
   * Handle tile selection.
   */

  #handleTileClick(tile, event) {
    event.preventDefault();

    // Toggle adding tile to the active tiles array.
    if (!this.#activeTiles.includes(tile)) {
      this.#activeTiles.push(tile);
    } else {
      this.#activeTiles.splice(this.#activeTiles.indexOf(tile), 1);
    }

    // Send active tile array to the board.
    this.#board.state = {
      activeTiles: this.#activeTiles,
    };

    // Update the current word.
    this.#currentWord = this.#activeTiles
      .map((tile) => {
        return tile.letter;
      })
      .join("");

    // Create empty object to store word state.
    const newWordEntryState = {};

    // Set the current word in new state.
    newWordEntryState.text = this.#currentWord;

    // Set new status for word entry component.
    if (this.#currentWord.length >= this.#settings.rules.minWordLength)
      newWordEntryState.status = "active";
    else newWordEntryState.status = null;

    // Update the word entry state.
    this.#wordEntry.state = newWordEntryState;
  }

  /**
   * Handle word submission.
   */

  #handleWordSubmit(submitListener, event) {
    event.preventDefault();

    // Get the result from the dictionary.
    const { result, message, shortMessage } = this.#dictionary.validate(
      this.#currentWord
    );

    // Update the board and word states with the results.
    this.#board.state = {
      activeTiles: this.#activeTiles,
      status: result,
    };

    this.#wordEntry.state = {
      text: message,
      submitText: shortMessage,
      status: result,
    };

    // Handle a correct entry.
    if (result === "valid") {
      this.#score = this.#score + 1;

      this.#scoreBoard.state = {
        score: this.#score,
      };

      this.#solvedWords.push(this.#currentWord);

      this.#dictionary.solved = this.#solvedWords;
    }

    // If the game isn't over, reset the board.
    if (
      result !== "invalid" &&
      this.#score !== this.#dictionary.dictionary.length
    ) {
      setTimeout(() => {
        this.#reset({
          board: true,
          word: true,
        });
      }, 2000);
    }

    // If the game is over, display an error and end the game.
    if (result === "invalid") {
      this.#shareButton.status = "lose";

      this.#wordEntry.state = {
        text: `Invalid word. Game over!<br />Score: ${this.#score} of ${
          this.#dictionary.dictionary.length
        }`,
        submitText: "Play again?",
        status: result,
      };
    }

    // If the game is a success, display a success message and end the game.
    if (
      result === "valid" &&
      this.#score === this.#dictionary.dictionary.length
    ) {
      this.#board.state = {
        status: "win",
      };

      this.#shareButton.status = "win";

      this.#wordEntry.state = {
        text: `You won!<br />Score: ${this.#score} of ${
          this.#dictionary.dictionary.length
        }`,
        submitText: "Play again?",
        status: result,
      };
    }

    if (
      result === "invalid" ||
      (result === "valid" && this.#score === this.#dictionary.dictionary.length)
    ) {
      // Remove the default event listener for the submit button.
      submitListener.abort();

      // Create controller for reset listener.
      const resetListener = new AbortController();

      // Enable button.
      this.#wordEntry.submitEl.removeAttribute("disabled");
      this.#wordEntry.submitEl.setAttribute("tabindex", 0);
      this.#wordEntry.submitEl.setAttribute("style", "pointer-events: auto");

      this.#wordEntry.submitEl.addEventListener(
        "click",
        (event) => {
          event.preventDefault();

          this.#reset({
            score: true,
            board: true,
            word: true,
            game: true,
          });

          this.#wordEntry.submitEl.removeAttribute("style");

          resetListener.abort();
        },
        { signal: resetListener.signal }
      );
    }
  }

  /**
   * Initialize share button event listener.
   */

  #initShareControls() {
    this.#shareButton.el.addEventListener(
      "click",
      this.#handleShareClick.bind(this)
    );
  }

  /**
   * Handle share button click.
   */

  async #handleShareClick(event) {
    event.preventDefault();

    this.#shareButton.score = this.#score;

    if (!navigator.clipboard) return;

    const gameText = this.#shareButton.game;

    try {
      await navigator.clipboard.writeText(gameText);
    } catch (error) {
      console.error("Failed to copy game to clipboard.", error);
    }
  }

  /**
   * Handle section resets.
   */

  #reset(
    type = {
      score: false,
      board: false,
      word: false,
      game: false,
    }
  ) {
    const { score, board, word, game } = type;

    if (score) {
      this.#score = 0;
      this.#scoreBoard.state = {
        score: this.#score,
      };
    }

    if (board) {
      this.#activeTiles = [];

      this.#board.state = {
        activeTiles: this.#activeTiles,
        status: null,
      };
    }

    if (word) {
      this.#currentWord = null;

      this.#wordEntry.state = {
        text: this.#currentWord,
        submitText: null,
        status: null,
      };
    }

    if (game) {
      this.#solvedWords = [];

      this.#dictionary.solved = this.#solvedWords;

      this.#shareButton.score = 0;
      this.#shareButton.status = null;

      this.#initWordControls();
    }
  }
}
