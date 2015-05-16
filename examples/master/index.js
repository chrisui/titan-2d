 import Engine from '../../lib/Engine';
 import Entity from '../../lib/Entity';
 import Input from '../../lib/Input';

 import {World, Bodies, Body, Vector} from 'matter';

 import Mousetrap from 'mousetrap';
 import values from 'lodash/object/values';

 export function render(renderTo) {

  const engine = Engine.create({
    render: {
      element: renderTo
    }
  });

  const player = Bodies.circle(100, 100, 30, {restitution: 0.6, friction: 0.1});
  const crosshairs = Bodies.circle(300, 300, 5, {isStatic: true});

  World.add(engine.world, [player, crosshairs]);

  var offset = 5;
  World.add(engine.world, [
    Bodies.rectangle (400, -offset, 800.5 + 2 * offset, 50.5, { isStatic: true }),
    Bodies.rectangle(400, 600 + offset, 800.5 + 2 * offset, 50.5, { isStatic: true }),
    Bodies.rectangle(800 + offset, 300, 50.5, 600.5 + 2 * offset, { isStatic: true }),
    Bodies.rectangle(-offset, 300, 50.5, 600.5 + 2 * offset, { isStatic: true })
  ]);

  const jump       = Input.create(null, [Input.KEYBOARD_UP, Input.KEYBOARD_W, Input.GAMEPAD_A]);
  const runRight   = Input.create(null, [Input.KEYBOARD_RIGHT, Input.KEYBOARD_D, Input.GAMEPAD_L_RIGHT]);
  const runLeft    = Input.create(null, [Input.KEYBOARD_LEFT, Input.KEYBOARD_A, Input.GAMEPAD_L_LEFT]);
  const aimUp      = Input.create(null, [Input.GAMEPAD_R_UP]);
  const aimRight   = Input.create(null, [Input.GAMEPAD_R_RIGHT]);
  const aimDown    = Input.create(null, [Input.GAMEPAD_R_DOWN]);
  const aimLeft    = Input.create(null, [Input.GAMEPAD_R_LEFT]);
  const toggleTime = Input.create(null, [Input.GAMEPAD_X]);

  const AIM_SENSITIVITY = 10;
  const RUN_FORCE = 0.01;
  const JUMP_FORCE = 0.1;
  const RUN_THRESHOLD = 5;
  const JUMP_THRESHOLD = 3;
  const Y_TO_MOVE_THRESHOLD = 0.5;

  let canJump = true;

  Engine.run(engine, function() {

    if (jump.value && Math.abs(player.velocity.y) < JUMP_THRESHOLD && jump.hasChanged) {
      Body.applyForce(player,
        Vector.sub(player.position, {x: player.position.y, y: player.position.y + 15}), {x: 0, y: -JUMP_FORCE * jump.value});
    }

    if (runRight.value && player.velocity.x < RUN_THRESHOLD) {
      Body.applyForce(player,
        Vector.sub(player.position, {x: player.position.x - 15, y: player.position.y}), {x: RUN_FORCE * runRight.value, y: 0});
    }

    if (runLeft.value && player.velocity.x > -RUN_THRESHOLD) {
      Body.applyForce(player,
        Vector.sub(player.position, {x: player.position.x + 15, y: player.position.y}), {x: -RUN_FORCE * runLeft.value, y: 0});
    }

    if (aimUp.value) {
      Body.translate(crosshairs, {x: 0, y: -AIM_SENSITIVITY * aimUp.value});
    }

    if (aimRight.value) {
      Body.translate(crosshairs, {x: AIM_SENSITIVITY * aimRight.value, y: 0});
    }

    if (aimDown.value) {
      Body.translate(crosshairs, {x: 0, y: AIM_SENSITIVITY * aimDown.value});
    }

    if (aimLeft.value) {
      Body.translate(crosshairs, {x: -AIM_SENSITIVITY * aimLeft.value, y: 0});
    }

    if (toggleTime.value && toggleTime.hasChanged) {
      engine.timeScale = engine.timeScale === 1 ? 0.1 : 1;
    }

  });

  // debug
  window.engine = engine;
  window.world = engine.world;
  window.player = player;

}

export function cleanup(cleanFrom) {

}