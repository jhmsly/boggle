/**
 * Score Board Component
 *
 * @description Renders the score and max points.
 */

/**
 * Create the score board component.
 */

export default class ScoreBoard {
  /**
   * Declare Private Variables
   */

  #el; // Holds the DOM element.
  #elClassName; // Class name.
  #scoreEl; // Holds the actual score text.
  #maxScore; // Max possible points.
  #state; // Holds component state.

  constructor({ score = 0, maxScore = 0 }, className = '') {
    /**
     * Private Properties
     */

    // Component properties.
    this.#el = null;
    this.#elClassName = className;
    this.#scoreEl = null;
    this.#maxScore = maxScore;

    // State of component.
    this.#state = {
      score: score,
    };

    /**
     * Initialize the score board DOM element.
     */

    if (!this.#el) {
      const el = document.createElement('div');
      el.classList.add(`${this.#elClassName}__score-board`);
      this.#el = el;

      const scoreEl = document.createElement('span');
      scoreEl.classList.add(`${this.#elClassName}__score`);
      scoreEl.textContent = `Score: ${this.#state.score}`;
      this.#el.appendChild(scoreEl);
      this.#scoreEl = scoreEl;

      const maxScoreEl = document.createElement('span');
      maxScoreEl.classList.add(`${this.#elClassName}__max-score`);
      maxScoreEl.textContent = `Max Score: ${this.#maxScore}`;
      el.appendChild(maxScoreEl);
    }
  }

  /**
   * Getter for the score board DOM element.
   */

  get el() {
    // Return the rendered tile element.
    return this.#el;
  }

  /**
   * Set State
   */

  set state(state = { score: this.#state.score }) {
    const { score } = state;

    this.#state.score = score;

    this.#scoreEl.textContent = `Score: ${this.#state.score}`;
  }
}
