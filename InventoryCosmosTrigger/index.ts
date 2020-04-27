import { AzureFunction, Context } from '@azure/functions';
import * as df from 'durable-functions';

const cosmosDBTrigger: AzureFunction = async function(
  context: Context,
  documents: any[]
): Promise<void> {
  const client = df.getClient(context);

  if (!!documents && documents.length > 0) {
    const { storeId, type, data, id: documentId } = documents[0];

    const entityId = new df.EntityId('InventoryEntity', `${storeId}`);
    client.signalEntity(entityId, type, { documentId, data });
  }
};

export default cosmosDBTrigger;
