import assign from 'lodash/object/assign';
import {Composite} from 'matter';

const Entity = {};

Entity.create = function(state = {}) {
  const entity = Composite.create(assign({
    label: 'TIEntity'
  }, state));

  return entity;
}

Entity.update = function(entity, deltaTime, timeScale, correction) {
  // Note: This is pre physics update
}

export default Entity; 