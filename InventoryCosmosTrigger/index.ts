import { AzureFunction, Context } from '@azure/functions';
import * as df from 'durable-functions';

const cosmosDBTrigger: AzureFunction = async function(
  context: Context,
  documents: any[]
): Promise<void> {
  const client = df.getClient(context);

  if (!!documents && documents.length > 0) {
    const { storeId, count } = documents[0];
    context.log('Store id: ', storeId);
    context.log('Store count: ', count);
    context.log('Document Id: ', documents[0].id);

    const entityId = new df.EntityId('InventoryEntity', `${storeId}`);
    client.signalEntity(entityId, 'add', { amount: count });
  }
};

export default cosmosDBTrigger;
