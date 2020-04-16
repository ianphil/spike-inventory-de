import * as df from 'durable-functions';
import { AzureFunction, HttpRequest } from '@azure/functions';

const client: AzureFunction = async function(context, req: HttpRequest) {
  const { storeId } = context.bindingData;

  const client = df.getClient(context);
  const entityId = new df.EntityId('InventoryEntity', `${storeId}`);

  if (req.method === 'POST') {
    await client.signalEntity(entityId, 'add', req.body);

    context.res.status = 200;

    return;
  } else if (req.method === 'GET') {
    const response = await client.readEntityState(entityId);

    return response.entityState;
  }
};

export default client;
