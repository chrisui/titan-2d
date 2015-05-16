import assign from 'lodash/object/assign';
import Entity from './Entity';
import {Composite} from 'matter';

const World = {};

World.create = function(state = {}) {
  const world = Entity.create(assign({
    label: 'TIWorld',
    gravity: {x: 0, y: 1},
    bounds: { 
        min: {x: 0, y: 0}, 
        max: {x: 800, y: 600} 
    }
  }, state));

  return world;
}

World.allEntities = function(world) {
  return Composite.allComposites(world);
};

export default World;