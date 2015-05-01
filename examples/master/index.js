import {Engine, World, Events, Bodies, RenderPixi, Composites, Constraint, Common, Composite, Sleeping} from 'matter';
import math from 'mathjs';
import pixi from 'pixi';
window.PIXI = pixi;
import cloneDeep from 'lodash/lang/cloneDeep';

export function render(renderTo) {

  const FPS = 60;
  const FRAME = 1000 / FPS;

  var renderOptions = {};
  renderOptions.wireframes = false;
  renderOptions.hasBounds = false;
  renderOptions.showDebug = true;
  renderOptions.showBroadphase = false;
  renderOptions.showBounds = false;
  renderOptions.showVelocity = false;
  renderOptions.showCollisions = false;
  renderOptions.showAxes = false;
  renderOptions.showPositions = false;
  renderOptions.showAngleIndicator = false;
  renderOptions.showIds = false;
  renderOptions.showShadows = false;
  renderOptions.width = window.innerWidth,
  renderOptions.height = window.innerHeight;

  var futureEngine;

  var worldOptions = {
    bounds: { 
      min: { x: 0, y: 0 }, 
      max: { x: window.innerWidth, y: window.innerHeight } 
    },
    gravity: {x: 0, y: 1}
  };

  // create a Matter.js engine
  var engine = Engine.create({
    render: {
      element: renderTo,
      options: renderOptions,
      controller: RenderPixi
    },
    world: worldOptions,
    enableSleeping: true,
    timing: {
      timeScale: 1
    }
  });

  engine.metrics.extended = true;

  var offset = 5;
  var wallSize = 10;
  World.add(engine.world, [
      Bodies.rectangle (window.innerWidth * 0.5, window.innerHeight - wallSize - 50, window.innerWidth - 100, wallSize, { isStatic: true })
  ]);  

  var rows = 10;

  var stack = Composites.stack(window.innerWidth * 0.5, -200, 5, 10, 0, 0, function(x, y, column, row) {
      return Bodies.rectangle(x, y, 20, 20, { friction: 0.9, restitution: 1 });
  });

  World.add(engine.world, stack);

  var ball = Bodies.circle(window.innerWidth * 0.5 + 400, 400, 50, { density: 0.5, frictionAir: 0.001});

  World.add(engine.world, ball);
  World.add(engine.world, Constraint.create({
      pointA: {x: window.innerWidth * 0.5, y: 10},
      bodyB: ball,
      stiffness: 1
  }));

  var balls = Composites.stack(0, 50, 500, 1, 10, 10, function(x, y, column, row) {
      return Bodies.rectangle(x, y, 10, 10, { restitution: 1, friction: 0.1 });
      return Bodies.circle(x, y, Common.random(5, 10), { restitution: 1, friction: 0.1 });
  });

  World.add(engine.world, balls);

  Engine.run(engine);

  setTimeout(function() {
    engine.timing.timeScale = 0.1
  }, 1300);

  setTimeout(function() {
    engine.timing.timeScale = 1;
    var balls = Composites.stack(0, 50, 500, 1, 10, 10, function(x, y, column, row) {
      return Bodies.rectangle(x, y, 10, 10, { restitution: 1, friction: 0.1 });
      return Bodies.circle(x, y, Common.random(5, 10), { restitution: 1, friction: 0.1 });
    });

    World.add(engine.world, balls);
  }, 3500);

  setTimeout(function() {
    engine.timing.timeScale = 0.1
  }, 4800);

  setTimeout(function() {
    engine.timing.timeScale = 1;
    var stack = Composites.stack(window.innerWidth * 0.5, -200, 5, 10, 0, 0, function(x, y, column, row) {
        return Bodies.rectangle(x, y, 20, 20, { friction: 0.9, restitution: 1 });
    });

    World.add(engine.world, stack);
  }, 6500);

  setTimeout(function() {
    engine.timing.timeScale = 0.1
  }, 8000);

  Events.on(engine, 'afterUpdate', function() {
    
  });

  function cloneEngine(engine) {
    return cloneDeep(engine);
  }

  function mergeWorlds(engineA, engineB) {
    if (engineB.world) {
        engineA.world = engineB.world;

        Engine.clear(engineA);

        var bodies = Composite.allBodies(engineA.world);

        for (var i = 0; i < bodies.length; i++) {
            var body = bodies[i];
            Sleeping.set(body, false);
            body.id = Common.nextId();
        }
    }
  }

  window.advanceFuture = function(frames = FPS) {
    for (var i = 0; i < frames; ++i) {
      Engine.update(futureEngine, FRAME);
    }
    Engine.render(futureEngine);
  }


  window.pauseSim = function() {
    engine.enabled = false;

    futureEngine = Engine.create({
      render: {
        element: document.getElementById('future'),
        options: cloneDeep(renderOptions)
      },
      world: cloneDeep(worldOptions),
      enableSleeping: true
    });

    mergeWorlds(futureEngine, cloneEngine(engine));

    window.futureEngine = futureEngine;
  };


  window.engine = engine;
  window.math = math;

}

export function cleanup(cleanFrom) {

}