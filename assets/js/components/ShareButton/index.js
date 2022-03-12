/**
 * Share Button Component
 *
 * @description Renders the dynamic share button.
 */

/**
 * Create the share button component.
 */

export default class ShareButton {
  /**
   * Declare Private Variables
   */

  #el;
  #elClassName;
  #gameId;
  #tiles;
  #maxScore;
  #columns;
  #domain;
  #state;

  constructor(
    {
      score = 0,
      maxScore = 0,
      tiles = [],
      gameId = 0,
      status = '',
      columns = 0,
      domain = '',
    },
    className = ''
  ) {
    /**
     * Private Properties
     */

    // Component properties.
    this.#el = null;
    this.#elClassName = className;
    this.#gameId = gameId;
    this.#tiles = tiles;
    this.#maxScore = maxScore;
    this.#columns = columns;
    this.#domain = domain;

    // State of component.
    this.#state = {
      score: score,
      status: status,
    };
  }

  /**
   * Getter for the share button DOM element.
   */

  get el() {
    if (!this.#el) this.#init();

    return this.#el;
  }

  /**
   * Get to get the share game text.
   */

  get game() {
    let text = '';

    console.log(this.#state.status);

    if (this.#state.status === 'win' || this.#state.status === 'lose') {
      text = `${this.#state.score} of ${this.#maxScore}\n\n`;
    }

    const letters = [];

    this.#tiles.forEach((tile) => letters.push(tile.letter));

    letters.forEach((letter, index) => {
      if (index % this.#columns === 0) {
        if (index === 0) text += `${letter}`;
        else text += `\n${letter}`;
      } else {
        text += `-${letter}`;
      }
    });

    text += `\n\n${this.#domain}/${this.#gameId}`;

    return text;
  }

  /**
   * Setter to set the current component state.
   */

  set score(newScore) {
    this.#state.score = newScore;
  }

  set status(newStatus) {
    // Update the status.
    this.#setStatus(newStatus);
  }

  /**
   * Initialize the tile DOM element.
   */

  #init() {
    if (!this.#el) {
      // Create tile element.
      const el = document.createElement('button');
      el.className = `${this.#elClassName}__share-button`;

      el.setAttribute('type', 'button');
      el.setAttribute('tabindex', 0);

      el.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="60px" height="60px"><path d="M 23 3 A 4 4 0 0 0 19 7 A 4 4 0 0 0 19.09375 7.8359375 L 10.011719 12.376953 A 4 4 0 0 0 7 11 A 4 4 0 0 0 3 15 A 4 4 0 0 0 7 19 A 4 4 0 0 0 10.013672 17.625 L 19.089844 22.164062 A 4 4 0 0 0 19 23 A 4 4 0 0 0 23 27 A 4 4 0 0 0 27 23 A 4 4 0 0 0 23 19 A 4 4 0 0 0 19.986328 20.375 L 10.910156 15.835938 A 4 4 0 0 0 11 15 A 4 4 0 0 0 10.90625 14.166016 L 19.988281 9.625 A 4 4 0 0 0 23 11 A 4 4 0 0 0 27 7 A 4 4 0 0 0 23 3 z"/></svg>';

      // Store element.
      this.#el = el;
    }
  }

  /**
   * Set new status for the tile.
   */

  #setStatus(status = '') {
    if (!status || status.length <= 0) {
      this.#state.status = '';
      this.#el.className = `${this.#elClassName}__share-button`;
    } else {
      this.#state.status = status;
      this.#el.className = `${this.#elClassName}__share-button is-${
        this.#state.status
      }`;
    }
  }
}
