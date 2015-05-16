import assign from 'lodash/object/assign';
import {Engine, RenderPixi} from 'matter';
import World from './World';
import Entity from './Entity';
import Runner from './Runner';
import {observe as observeInput, update as updateInput} from './Input';

const GameEngine = {};

GameEngine.create = function(state = {}) {
  const engine = assign({
    timeScale: 1,
    inputs: {}
  }, state);

  engine.world = World.create(engine.world);

  engine.physics = Engine.create(engine.physics)
  engine.physics.world = engine.world;

  engine.render = RenderPixi.create(engine.render);

  return engine;
};

GameEngine.update = function(engine, deltaTime, correction) {
  const entities = World.allEntities(engine.world);
  const numEntities = entities.length;

  updateInput();

  for (let i = 0; i < numEntities; i++) {
    Entity.update(entities[i], deltaTime, engine.timeScale, correction);
  }

  Engine.update(engine.physics, deltaTime, correction);
};

GameEngine.run = function(engine, tick) {
  engine.runner = Runner.create(null, function(delta, correction) {
    if (tick) {
      tick(delta, correction);
    }

    GameEngine.update(engine, delta, correction);

    RenderPixi.world(engine);
  });

  observeInput();
};

GameEngine.stop = function(engine) {
  Runner.destroy(engine.runner);
};

export default GameEngine;