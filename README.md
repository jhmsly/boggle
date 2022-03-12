# Boggle

A simple boggle-like word game built with vanilla javascript.

[View the Demo](https://jhmsly.github.io/boggle/)

*Note: This code is basically first draft code, so it is rough around the edges!*

---

## Game Information

Game settings are loaded in through a specific variable in the html page header. Use this code in the `<head>` of your html page inside of `<script>` tags, and have a div with the id `js-boggle` in the body.

```js
/* Game configuration template. */

var gameSettings = {
  id: 0,
  board: {
    columns: 4,
    rows: 4,
    letters: [
      'A',
      'B',
      'C',
      'D',
      ...
    ],
  },
  dictionary: [
    'RUN',
    'DOG',
    'CAR',
    ...
  ],
  rules: {
    minWordLength: 3,
  },
  domain: 'example.com',
};
```

## For Development

Requirements: Node v15+ and NPM v7+/

To get started, clone this repository, then install and run the project.

```sh
$ npm install
$ npm run start
```

## Settings

The development environment's default paths and options can be found and modified in `launchpad.config.js`.

## Commands

Below are a list of all of the commands that can be used.

### Development

**Primary Scripts:**

- `npm run dev` - Starts the gulp development script.
- `npm run prod` - Compiles theme to distribution directory.

**Component Scripts:**

- `npm run src:dev` - Copies source files to theme build directory.
- `npm run styles:dev` - Processes SCSS, generates sourcemaps and copies to build directory.
- `npm run scripts:dev` - Bundles scripts, generates sourcemaps, copies scripts to build directory.
- `npm run images:dev` - Optimizes images and copies to build directory.
- `npm run includes:dev` - Copies included files to build directory.

To run the individual tasks for production, simply replace `:dev` with `:prod` and the respective files will be minified without sourcemaps and/or optimized and copied to the distribution directory.
