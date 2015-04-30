import {Engine, World, Bodies, RenderPixi, Composites, Constraint, Common} from 'matter';

export function render(renderTo) {

  // create a Matter.js engine
  var engine = Engine.create({
    render: {
        element: renderTo,
        controller: RenderPixi
    }
  });

  var offset = 5;
  World.add(engine.world, [
      Bodies.rectangle ( 400, -offset, 800.5 + 2 * offset, 50.5, { isStatic: true }),
      Bodies.rectangle(400, 600 + offset, 800.5 + 2 * offset, 50.5, { isStatic: true }),
      Bodies.rectangle(800 + offset, 300, 50.5, 600.5 + 2 * offset, { isStatic: true }),
      Bodies.rectangle(-offset, 300, 50.5, 600.5 + 2 * offset, { isStatic: true })
  ]);  

  var rows = 10,
      yy = 600 - 21 - 40 * rows;

  var stack = Composites.stack(400, yy, 5, rows, 0, 0, function(x, y, column, row) {
      return Bodies.rectangle(x, y, 40, 40, { friction: 0.9, restitution: 0.1 });
  });

  World.add(engine.world, stack);

  var ball = Bodies.circle(100, 400, 50, { density: 0.07, frictionAir: 0.001});

  World.add(engine.world, ball);
  World.add(engine.world, Constraint.create({
      pointA: { x: 300, y: 100 },
      bodyB: ball
  }));


  var balls = Composites.stack(100, 50, 10, 3, 10, 10, function(x, y, column, row) {
      return Bodies.circle(x, y, Common.random(15, 30), { restitution: 0.6, friction: 0.1 });
  });

  World.add(engine.world, balls);

  // run the engine
  Engine.run(engine);

}

export function cleanup(cleanFrom) {

}