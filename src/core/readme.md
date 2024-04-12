# Core

These files make up the game "engine". They are a collection of useful patterns that I have developed over many years and many games. I tend to just copy/paste this folder from project to project as I go, rather than actually publishing this as a library because I tend to make lots of upgrades to it,
but sometimes I also make some game-specific changes to it.

## Game

The `Game` class is the top level data structure that is in charge of making everything happen.
There will be exactly

Some things that `Game` does:

- Initializes the physics, rendering, and input handling systems
- Keeps track of entities
- Runs the game loop
- Runs the event system, dispatching events and calling the appropriate handlers on entities

## Entities

Just about anything you want in the game will be implemented as an `Entity`.
This `Entity` is roughly equivalent to Unity's `GameObject`, or Unreal's `Actor`.

Every entity should extend the `BaseEntity` class and implement the `Entity` interface.

```TypeScript
class Ball extends BaseEntity implements Entity  {
  constructor() {
    super()
    // initialize stuff...
  }
}
```

### Body

If you want an entity to be included in the physics simulation, you can give it a `body`.

```TypeScript
const shape = new Circle({ radius: 1 /** in meters, generally */ });
this.body.addShape(shape);
```

If you want to give an entity multiple bodies, you can use the `bodies` field instead, though be careful.

### Sprite

If you want an entity to have a visual representation in the world, you can give it a `sprite`.

```TypeScript
this.sprite = Sprite.from(imageName("favicon"));
```

_Note: `imageName` is a helper function that limits the string type to only names of images found in our `resources/` folder. It's really handy for autocomplete_

### Events

Entities can run code at certain times in the game loop.
The three most important events are probably `onAdd`, `onTick`, and `onRender`.

#### `onAdd?(game: Game)`

Called when added to the game, before dealing with the body, sprite, handlers, or anything else.
Useful for initializing stuff that you need access to the `game` for.

#### `onTick()`

If you want an entity to do something every frame, put that logic in the `onTick()` method.

```TypeScript
  onTick(dt: number) {
    if (this.game!.io.keyIsDown("Space")) {
      // Accelerate upwards
      this.body.applyForce([-10, 0]);
    }
  }
```

#### `onRender?(dt: number)`

Called on every frame right before the screen is redrawn.
Useful for logic like updating the position of the sprite.

```TypeScript
  onRender(dt: number): void {
    this.sprite?.position.set(...this.body.position);
  }
```

### Less important events

`afterAdded?(game: Game)` — Called when added to the game, _after_ the body, sprite, handlers, and everything else is dealt with.
Most of the time you probably want to use `onAdd`, but there are some times when this comes in handy.

`beforeTick?()` — Sometimes you want to make sure stuff happens at the beginning of the tick, before any `onTick()` handlers are called.
That's when this is useful.

`onLateRender?(dt: number)` — Called _right_ before rendering. This is for special cases only

`onPause?()` — Called when the game is paused

`onUnpause?()` — Called when the game is unpaused

`onDestroy?(game: Game)` — Called after being destroyed.

`onResize?(size: [number, number])` — Called when the renderer is resized or recreated for some reason.
You shouldn't need to deal with this often.

### Custom Events

You can define handlers for any type of custom event you want using the `handlers` field.

For example, say we have a `LevelManager` class somewhere that determines when we start a level.
It can

```TypeScript
class Ball extends BaseEntity implements Entity {
  onTick() {
    //...level management stuff
    this.game.dispatch({ type: 'levelStarted', level: 1 });
  }
}
```

```TypeScript
class Ball extends BaseEntity implements Entity
  handlers = {
    levelStarted: () => {
      this.body.velocity = [0, 0];
    },
  };
```

## Finding Entities

There are a few

## Graphics

...

## IO

...

## Physics

...

## Sound

Playing sounds in the game is done by creating instances of the `SoundInstance` entity and adding them to the game.

### Audio Effects

It is possible

...

## Util

...

## Vector

...

```

```
