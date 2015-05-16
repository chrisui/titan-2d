 import Engine from '../../lib/Engine';
 import Entity from '../../lib/Entity';
 import Input from '../../lib/Input';

 import {World, Bodies, Body, Vector} from 'matter';

 import values from 'lodash/object/values';

 export function render(renderTo) {

  const engine = Engine.create({
    render: {
      element: renderTo
    }
  });

  const player = Bodies.circle(100, 100, 30, {restitution: 0.6, friction: 0.1});

  var offset = 5;
  World.add(engine.world, [
      Bodies.rectangle ( 400, -offset, 800.5 + 2 * offset, 50.5, { isStatic: true }),
      Bodies.rectangle(400, 600 + offset, 800.5 + 2 * offset, 50.5, { isStatic: true }),
      Bodies.rectangle(800 + offset, 300, 50.5, 600.5 + 2 * offset, { isStatic: true }),
      Bodies.rectangle(-offset, 300, 50.5, 600.5 + 2 * offset, { isStatic: true })
  ]);

  World.add(engine.world, [player]);

  const jump = Input.create(null, [Input.KEYBOARD_UP, Input.GAMEPAD_A]);
  const runRight = Input.create(null, [Input.KEYBOARD_RIGHT, Input.GAMEPAD_L_RIGHT]);
  const runLeft = Input.create(null, [Input.KEYBOARD_LEFT, Input.GAMEPAD_L_LEFT]);

  Engine.run(engine, function() {

    if (jump.value && player.velocity.y < 10) {
      Body.applyForce(player,
        Vector.sub(player.position, {x: player.position.y, y: player.position.y + 15}), {x: 0, y: -0.02});
    }

    if (runRight.value && player.velocity.x < 10) {
      Body.applyForce(player,
        Vector.sub(player.position, {x: player.position.x - 15, y: player.position.y}), {x: 0.01, y: 0});
    }

    if (runLeft.value && player.velocity.x > -10) {
      Body.applyForce(player,
        Vector.sub(player.position, {x: player.position.x + 15, y: player.position.y}), {x: -0.01, y: 0});
    }

    if (engine.runner.frameCount % 20 === 0) {

      const gamepads = navigator.getGamepads();
      values(gamepads).filter(pad => pad && pad.axes).forEach((pad, i) => console.log(i, pad.axes[0], pad.axes[1], pad.axes[2], pad.axes[3]));
      //values(gamepads).filter(pad => pad && pad.buttons).forEach((pad, padI) => pad.buttons.forEach((but, butI) => console.log(padI, butI, but.pressed, but.value)));
    }

  });

  // debug
  window.engine = engine;
  window.world = engine.world;
  window.player = player;

}

export function cleanup(cleanFrom) {

}