/**
 * Dictionary Component
 *
 * @description Handles solved word record keeping and validation.
 */

/**
 * Create the dictionary component.
 */

export default class Dictionary {
  // Declare private variables.
  #dictionary;
  #rules;
  #solved;

  constructor({
    dictionary = [],
    rules = {
      minWordLength: 3,
    },
  }) {
    // Private properties.
    this.#dictionary = dictionary;
    this.#rules = rules;
    this.#solved = [];
  }

  /**
   * Getter for the dictionary.
   */

  get dictionary() {
    return this.#dictionary.filter(
      (word) => word.length >= this.#rules.minWordLength
    );
  }

  /**
   * Set Solved Words
   */

  set solved(solvedWords = []) {
    this.#solved = solvedWords;
  }

  validate(word) {
    const result = {
      result: '',
      message: '',
      shortMessage: '',
    };

    // If word is empty, return error.
    if (word.length <= 0) {
      result.result = 'invalid';
      result.message = 'Word is empty.';
      result.shortMessage = 'Invalid word!';

      return result;
    }

    // If word is less than minimum length, return error.
    if (word.length < this.#rules.minWordLength) {
      result.result = 'invalid';
      result.message = `Minimum word length is ${
        this.#rules.minWordLength
      } characters.`;
      result.shortMessage = 'Too short!';

      return result;
    }

    // If word is not in dictionary, return error.
    if (!this.dictionary.includes(word)) {
      result.result = 'invalid';
      result.message = `&ldquo;${word}&rdquo; isn't a valid word.`;
      result.shortMessage = 'Invalid word!';

      return result;
    }

    // If word is already solved, return error.
    if (this.#solved.includes(word)) {
      result.result = 'duplicate';
      result.message = `&ldquo;${word}&rdquo; has already been solved.`;
      result.shortMessage = 'Word already solved!';

      return result;
    }

    result.result = 'valid';
    result.message = `&ldquo;${word}&rdquo; is valid!`;
    result.shortMessage = 'Word found!';

    return result;
  }
}
