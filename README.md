# Detention Prevention

This repo houses the source code for [our submission to Ludum Dare 55](https://ldjam.com/events/ludum-dare/55/$384591).
You can play the most recent version [here](https://ld-55.simonbw.com/).

## How to run locally

1. Make sure you have a recent version of [node.js](https://nodejs.org/en) installed
2. Clone this repo
3. Run `npm install` inside this repo
4. Run `npm start` to start the dev server
5. You should now be able to play the game at http://localhost:1234

## How To Contribute

### Contributing Code

- Don't break `main`
- Check out [src/core](src/core) for an overview of the engine.
- Try to add placeholder assets (images, sounds) where possible. This makes it easy for artists to just go and upload a new version when they have a real version ready.

### Contributing Non-Code Assets

You can contribute assets to the game by adding them to the appropriate folder in the `resources` folder.
If you replace

#### Images

- Go in `resources/images`
- Should be in `.png` format
- These should all be made by us, so we shouldn't have to worry about copyright

#### Audio

- Go in `resources/audio`
- `.flac` format is preferred, `.mp3` or `.wav` are probably also fine
- These should all be made by us, so we shouldn't have to worry about copyright/licenses

#### Fonts

- Go in `resources/fonts`
- Make sure we are licensed to use them. [Google fonts](https://fonts.google.com) are a good source.

## Structure of this project

### `src/`

The folder where all our source code (TypeScript) goes.

- `src/index.html` — This is the entrypoint to our code from the browser.
  This file then imports `src/ld-55/index.tsx` which is the entrypoint to our typescript code.

- `src/core/` — This is the engine code that I (Simon) have built up over many years and games.
  See [src/core](src/core/) for more details about the engine.

- `src/ld-55/`
  This is where our game's code lives.
  Basically all the code you'll be writing will probably live in here.

- `src/ld-55/index.tsx` — The entrypoint for our TypeScript code on the page. All our code that runs can eventually be traced up to this file.

### `dist/`

This is where our compiled game goes.
You shouldn't need to poke around in here.

### `resources/`

This is where all of our assets like images, sound effects, music, fonts, etc. go.
The build system watches this folder for added/removed files and generates `.d.ts` files that make typescript aware that it can import these files. It also generates `resources.ts`, which contains lists of all the resources that we use to automatically preload them.

- `resources/audio` — This is where all of our audio files go.
- `resources/images` — This is where all of our images go.
- `resources/fonts` — This is where all of our fonts go.

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
