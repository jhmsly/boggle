/**
 * Tile Component
 *
 * @description Renders the tile component.
 */

/**
 * Create the tile component.
 */

export default class Tile {
  /**
   * Declare Private Variables
   */

  #el; // Holds the tile DOM element.
  #elClassName; // Tile element class name prefix
  #letter; // Tile letter.
  #state; // Tile state.

  constructor({ id = 0, letter = '' }, className = '') {
    /**
     * Public Properties
     */

    this.id = id;

    /**
     * Private Properties
     */

    // Component properties.
    this.#el = null;
    this.#elClassName = className;
    this.#letter = letter;

    // State of component.
    this.#state = {
      status: '',
    };
  }

  /**
   * Getter for the tile DOM element.
   */

  get el() {
    // Initialize the tile element if it has not been initialized.
    if (!this.#el) this.#init();

    // Return the rendered tile element.
    return this.#el;
  }

  /**
   * Get letter of tile.
   */

  get letter() {
    return this.#letter;
  }

  /**
   * Get the current component state.
   */

  get state() {
    return this.#state;
  }

  /**
   * Setter to set the current component state.
   */

  set state(
    state = {
      status: '',
    }
  ) {
    const { status } = state;

    // Update the status.
    this.#setStatus(status);
  }

  /**
   * Initialize the tile DOM element.
   */

  #init() {
    if (!this.#el) {
      // Create tile element.
      const el = document.createElement('button');
      el.className = `${this.#elClassName}__tile`;

      el.setAttribute('type', 'button');
      el.setAttribute('tabindex', 0);
      el.setAttribute('aria-pressed', false);
      el.setAttribute('data-letter', this.letter);
      el.setAttribute('data-tile-id', this.id);

      // Store element.
      this.#el = el;

      // Create tile letter label.
      const letterEl = document.createElement('span');
      letterEl.className = `${this.#elClassName}__tile-letter`;
      letterEl.textContent = this.letter;

      this.#el.appendChild(letterEl);
    }
  }

  /**
   * Set new status for the tile.
   */

  #setStatus(status = '') {
    if (!status || status.length <= 0) {
      this.#state.status = '';
      this.#el.className = `${this.#elClassName}__tile`;
    } else {
      this.#state.status = status;
      this.#el.className = `${this.#elClassName}__tile is-${
        this.#state.status
      }`;
    }

    // If the status is empty, reset ot the default state.
    if (!this.#state.status || this.#state.status.length <= 0) {
      this.#el.removeAttribute('disabled');
      this.#el.setAttribute('tabindex', 0);
      this.#el.setAttribute('aria-pressed', false);
    }

    // If the status is not empty, and not `active-last`, disable it.
    if (
      (this.#state.status || this.#state.status.length > 0) &&
      this.#state.status !== 'active-last'
    ) {
      this.#el.setAttribute('disabled', true);
      this.#el.setAttribute('tabindex', -1);

      if (this.#state.status !== 'disabled')
        this.#el.setAttribute('aria-pressed', true);
    }

    // If it is the most recent active tile.
    if (this.#state.status === 'active-last') {
      this.#el.removeAttribute('disabled');
      this.#el.setAttribute('tabindex', 0);
      this.#el.setAttribute('aria-pressed', true);
    }
  }
}
