import * as df from 'durable-functions';

const orchestrator = df.orchestrator(function*(context) {
  const entityId = new df.EntityId('InventoryEntity', 'inventory0');

  const currentValue = yield context.df.callEntity(entityId, 'get');

  return currentValue;
});

export default orchestrator;
