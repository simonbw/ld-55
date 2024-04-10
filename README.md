# INSERT GAME TITLE HERE

This repo houses the source code for [our submission to Ludum Dare 55](https://ldjam.com/events/ludum-dare/55/$384591).
You can play the most recent version [here](https://ld-55.simonbw.com/).

## How to run locally

1. Make sure you have a recent version of [node.js](https://nodejs.org/en) installed
2. Clone this repo
3. Run `npm install` inside this repo
4. Run `npm start` to start the dev server
5. You should now be able to play the game at http://localhost:1234

## Contributing

### Contributing Code

### Contributing Assets

## Structure of this project

#### `src/`

The folder where all the source code goes.

#### `src/core`

This is the engine code that I (Simon) have built up over many years and games.

#### `src/ld-55`

This is where our game's code lives.

#### `src/index.html`

This is the entrypoint to our code from the browser.

#### `resources`

This is where all of our assets like images, sound effects, music, fonts, etc. go.

#### `resources/audio`

This is where all of our audio files go.

#### `resources/images`

This is where all of our images go.

#### `resources/fonts`

This is where all of our fonts go.

## Technologies Used

This game is built on an engine I have cobbled together over the years.
There are a few big libraries in it that do the heavy lifting.

### TypeScript

The code for this project is written in [TypeScript](https://www.typescriptlang.org/), a superset of JavaScript that adds static type analysis.

### Pixi.js

This game uses a 2d rendering engine called [Pixi.js](https://pixijs.com/).

### P2.js

This game uses a 2d physics engine called [p2.js](https://github.com/schteppe/p2.js/).
It isn't the most performant or featureful engine, but the API is really simple, which is why I originally chose it.
I'm hoping to replace it soon.

### Parcel

This project uses [Parcel](https://parceljs.org/) as the bundler and dev server.
It handles everything with almost zero configuration and tends to _just work_.
Hopefully you shouldn't have to mess with this.
