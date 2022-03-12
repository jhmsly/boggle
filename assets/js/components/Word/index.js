/**
 * Word Component
 *
 * @description Renders the word display and submission button.
 */

export default class Word {
  /**
   * Declare Private Variables
   */

  #el; // Holds the tile DOM element.
  #elClassName; // Word element class name prefix.
  #textEl; // Word text element.
  #submitEl; // Submit button element.
  #initialText; // Initial text for component word.
  #inactiveText; // Inactive text for component word.
  #initialSubmitText; // Initial text for the submit button.
  #state; // Component state.

  constructor(
    {
      text = {
        current: '',
        initial: '',
        inactive: '',
      },
      submitText = 'Submit',
      status = 'ready',
    },
    className = ''
  ) {
    /**
     * Private Properties
     */

    // Component properties.
    this.#el = null;
    this.#elClassName = className;
    this.#textEl = null;
    this.#submitEl = null;
    this.#initialText = text.initial;
    this.#inactiveText = text.inactive;
    this.#initialSubmitText = submitText;

    // State of component.
    this.#state = {
      text: {
        current: text.current,
      },
      submitText: submitText,
      status: status,
    };
  }

  /**
   * Getter for the word element.
   */

  get el() {
    // Initialize the tile element if it has not been initialized.
    if (!this.#el) this.#init();

    // Return the rendered word element.
    return this.#el;
  }

  /**
   * Getter for submit button element.
   */

  get submitEl() {
    // Initialize the tile element if it has not been initialized.
    if (!this.#el) this.#init();

    // Return the rendered submit button.
    return this.#submitEl;
  }

  /**
   * Setter to set the current component state.
   */

  set state(
    state = {
      text: '',
      submitText: '',
      status: '',
    }
  ) {
    const { text, submitText, status } = state;

    // Update the word.
    this.#setText(text);

    // Update the submit button text.
    this.#setSubmitText(submitText);

    // Update the status.
    this.#setStatus(status);
  }

  /**
   * Get the current component state.
   */

  get state() {
    return this.#state;
  }

  /**
   * Initialize the word DOM element.
   */

  #init() {
    if (!this.#el) {
      // Create word section container.
      const el = document.createElement('div');
      el.className = `${this.#elClassName}__word is-${this.#state.status}`;

      // Store element.
      this.#el = el;

      // Create current word text.
      const textEl = document.createElement('span');
      textEl.className = `${this.#elClassName}__word-text`;
      textEl.innerHTML = this.#initialText;
      this.#el.appendChild(textEl);

      this.#textEl = textEl;

      // Create submit button.
      const submitEl = document.createElement('button');
      submitEl.className = `${this.#elClassName}__word-submit`;
      submitEl.setAttribute('type', 'button');
      submitEl.innerHTML = this.#initialSubmitText;
      this.#el.appendChild(submitEl);

      this.#submitEl = submitEl;

      // Set initial game status.
      this.#setStatus(this.#state.status);
    }
  }

  /**
   * Set new text for the word.
   */

  #setText(text = '') {
    if (!text || text.length <= 0) {
      this.#state.text.current = this.#inactiveText;
    } else {
      this.#state.text.current = text;
    }

    this.#textEl.innerHTML = this.#state.text.current;
  }

  /**
   * Set new text for the submit button.
   */

  #setSubmitText(text = '') {
    if (!text || text.length <= 0) {
      this.#state.text.submitText = this.#initialSubmitText;
    } else {
      this.#state.text.submitText = text;
    }

    this.#submitEl.innerHTML = this.#state.text.submitText;
  }

  /**
   * Set new status for the word component.
   */

  #setStatus(status = '') {
    if (!status || status.length <= 0) {
      this.#state.status = null;
      this.#el.className = `${this.#elClassName}__word`;
    } else {
      this.#state.status = status;
      this.#el.className = `${this.#elClassName}__word is-${
        this.#state.status
      }`;
    }

    // Additional steps to disable submissions and alter aria attributes.
    if (status !== 'active') {
      this.#submitEl.setAttribute('disabled', true);
      this.#submitEl.setAttribute('tabindex', -1);
    } else {
      this.#submitEl.removeAttribute('disabled');
      this.#submitEl.setAttribute('tabindex', 0);
    }
  }
}
