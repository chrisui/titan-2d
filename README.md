Titan 2d
========
A Javascript engine/framework for creating 2d games.

This is a hack I'm working on as a bid to re-enforce many different methods and patterns of programming in an area which deals with large amounts of data, user interaction and the need for performance on top. I am not a games programmer but a web developer with a ton of javascript experience building ui's and large apps wanting to explore something new.

Direction, philosophy and aims
------------------------------
A few core points to constantly refer to as this framework evolves. Some broad; Some technical and head on. These are of course simply initial desirables which could later become impractical and therefore deprecated.

### Functional
Functional programming is taking off in a big way and for very good reasons. This way of writing code can force simplicity and real modularity which can prevent headaches in the long run.

Some key points in this area:

1. Immutability might be a bit *too* much of an ask in terms of performance sacrifice
2. The mutative functional approach of matter-js is okay ???

### Reactive
Reactive programming is helping developers manage asynchronous state change in beautiful ways. Considering games are a massive cluster of continuous state change it makes sense to tackle the complications of this from the ground up in the core of the framework.

Streams could be an incredibly useful way of sharing game change across areas of code. Ie. imagine a stream of keyboard/controller input or a stream of collisions.

### Simplicity first, scoped for performance later
The ability for everyone to jump on board and achieve output with ease far outweighs the 10% which need the edge performance. With the ultimate simplicity and the correct level of modularity we can add layers of performance optimisations which will add complexity while not hurting the initial simplicity.

90% easy, 10% possible.

### Composition over inheritance
You don't have to go far within the Javascript community (or any wider programming community) to see the debate over classes and inheritance etc. In game development the single inheritance pattern seems to fall down even quicker so it makes sense to try and find another route. Most likely looking towards behaviour pattern.

Javascript is such a dynamic and powerful language (of course that makes it important to tread lightly too!) and we, as developers, should not be shooting ourselves in the foot by using simpler but more familiar patterns from other languages.

### Strong code separation
Considering the wide range of possible usages of a game engine it is important that code is well structured and generally strongly separated where different features are concerned. This will pretty much be helped by all of the previous points but we should always keep the use-cases for separation in our thoughts.

- Multiplayer games where game logic must be replicated on the server (strong separation of game state and rendering)
- Performance requirements where we want fast rendering (splitting jobs off into workers and leaving main thread rendering)

### Flexibility and first-class support for common libraries
Every feature of a game engine should be flexible to the degree it can be completely re-shaped by the consuming developers. With such a wide range of outputs this is particularly important.

To aid in onboarding the framework should expose first-class support for common libraries handling all kind of aspects. Having a nice plugin api is therefore essential.

### A few others
- Strong no-bullshit JS (ES6) from the ground up - play to it's strengths
	- The idea of macros and language transpilation is not out the question in the long run if it is super easy to run (babel plugins???)
- Don't reinvent the wheel - reuse what is available
	- Reusing what is available can help develop a solid plugin spec to allow for even more flexibility down the line
- 2D focus - no doubt some scope later down the line for 2.5d and *then* taking the concepts and structure of the engine and making a `titan-3d`

Inspiration
-----------
- Impact JS (and impact++) for it's initial developer accessibility
- Ori and the blind forest for an insanely good target showcase

Some vague ideas
----------------
- Service driven - large global registry of services which can be accessed
  - Ie. Input service, Physics service, Render service, UI service etc.
  - Allows easy access and user overrides of core services

