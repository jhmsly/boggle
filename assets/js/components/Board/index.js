/**
 * Board Component
 *
 * @description Renders the board component.
 */

/**
 * Create the board component.
 */

export default class Board {
  /**
   * Declare Private Variables
   */

  #el; // Holds the board DOM element.
  #elClassName; // Board element class name prefix.
  #columns; // Number of columns for the board.
  #rows; // Number of rows for the board.
  #tiles; // Tiles for the board.
  #state; // Board state.

  constructor(
    { columns = 0, rows = 0, tiles = [], activeTiles = [] },
    className = ''
  ) {
    // Private properties.
    this.#el = null;
    this.#elClassName = className;
    this.#columns = columns;
    this.#rows = rows;
    this.#tiles = tiles;

    // Component state.
    this.#state = {
      activeTiles: activeTiles,
      status: null,
    };

    /**
     * Initialize the board DOM element.
     */

    if (!this.#el) {
      // Create board element.
      const el = document.createElement('div');
      el.className = `${this.#elClassName}__board`;

      // Store element in class.
      this.#el = el;

      if (this.#tiles.length > 0) {
        // Create the letter tiles.
        this.#resetTiles();
      }

      if (this.#state.activeTiles.length > 0) {
        // Set the active tiles.
        this.state = {
          activeTiles: this.#state.activeTiles,
        };
      }
    }
  }

  /**
   * Getter for the board DOM element.
   */

  get el() {
    // Return the rendered tile element.
    return this.#el;
  }

  /**
   * Setter to add the tiles to the board.
   */

  set tiles(tiles = []) {
    // If no tiles have been provided, exit.
    if (!tiles || tiles.length === 0) return;

    // If tiles have already been added, exit.
    if (this.#tiles.length > 0) return;

    this.#tiles = tiles;

    this.#resetTiles();
  }

  /**
   * Setter to set active tiles.
   */

  set state(
    state = {
      activeTiles: [],
      status: null,
    }
  ) {
    const { activeTiles, status } = state;

    this.#updateTiles(activeTiles);

    this.#updateStatus(status);
  }

  /**
   * Add the tile elements to the board.
   */

  #resetTiles() {
    // Group tiles array into groups of the number of columns.
    const groupedTiles = [];

    for (let i = 0; i < this.#columns; i++) {
      groupedTiles.push(
        this.#tiles.slice(i * this.#rows, (i + 1) * this.#rows)
      );
    }

    // Generate tile row and tile DOM elements.
    const groupedTilesRowEls = groupedTiles.map((row) => {
      const rowEl = document.createElement('div');

      rowEl.className = `${this.#elClassName}__board-row`;

      row.forEach((tile) => {
        // Append the tile to the row element.
        rowEl.appendChild(tile.el);
      });

      return rowEl;
    });

    // Append the tile row elements to the board element.
    groupedTilesRowEls.forEach((rowEl) => {
      this.#el.appendChild(rowEl);
    });
  }

  /**
   * Update tiles on state change.
   */

  #updateTiles(tiles) {
    // If no tiles have been provided, clear the active and adjacent tiles.
    if (!tiles || tiles.length === 0) {
      this.#state.activeTiles = [];

      this.#tiles.forEach((tile) => {
        tile.state = {
          status: null,
        };
      });
    } else {
      // Add active tiles to class prop.
      this.#state.activeTiles = tiles;

      // Set each active tile to `active` or `active-last`.
      this.#state.activeTiles.forEach((tile, index) => {
        if (index === this.#state.activeTiles.length - 1) {
          tile.state = {
            status: 'active-last',
          };
        } else {
          tile.state = {
            status: 'active',
          };
        }
      });

      // Get the `active-last` tile from the active tiles array.
      const lastActiveTile = this.#state.activeTiles.find(
        (tile) => tile.state.status === 'active-last'
      );

      /**
       * @todo: Do something about the readability of this code. I don't even
       *        know how it works, this was done by Github Copilot... but it
       *        works.
       */

      this.#tiles.forEach((tile) => {
        const lastActiveTileId = lastActiveTile.id;
        const id = tile.id;
        let isAdjacent =
          (id === lastActiveTileId - 1 &&
            !(lastActiveTileId % this.#columns === 0)) ||
          (id === lastActiveTileId + 1 && !(id % this.#columns === 0)) ||
          id === lastActiveTileId - this.#columns ||
          id === lastActiveTileId + this.#columns;

        if (this.#state.activeTiles.includes(tile)) return;

        if (isAdjacent && !this.#state.activeTiles.includes(tile)) {
          tile.state = {
            status: null,
          };
        } else {
          tile.state = {
            status: 'disabled',
          };
        }
      });
    }
  }

  /**
   * Update global board status.
   */

  #updateStatus(status) {
    this.#state.status = status;

    if (this.#state.status) {
      this.#el.className = `${this.#elClassName}__board is-${
        this.#state.status
      }`;

      this.#state.activeTiles.forEach((tile) => {
        tile.state = {
          status: this.#state.status,
        };
      });
    } else {
      this.#el.className = `${this.#elClassName}__board`;
    }
  }
}
