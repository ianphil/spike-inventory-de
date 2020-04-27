import * as df from 'durable-functions';

interface ItemData {
  sku: string;
  amount: number;
  detail: any;
}

type InventoryEvent =
  | {
      type: 'onHand.update';
      documentId: string;
      data: ItemData[];
    }
  | {
      type: 'shipment.update';
      documentId: string;
      data: ItemData[];
    }
  | {
      type: 'detail.update';
      documentId: string;
      data: ItemData[];
    };

interface ItemsAggregate {
  [sku: string]: ItemData;
}

interface InventoryState {
  storeId: string;
  items: ItemsAggregate;
  events: InventoryEvent[];
}

function aggregateItems(inventoryEvents: InventoryEvent[]): ItemsAggregate {
  const latestDocumentEvents: Record<string, InventoryEvent> = {};
  const itemsAggregate: ItemsAggregate = {};

  inventoryEvents.forEach((inventoryEvent) => {
    // Overwrite events that have the same `documentId` to account for updates
    latestDocumentEvents[inventoryEvent.documentId] = inventoryEvent;
  });

  Object.values(latestDocumentEvents).forEach((inventoryEvent) => {
    inventoryEvent.data.forEach((item) => {
      const existingItem = itemsAggregate[item.sku];

      if (!existingItem) {
        itemsAggregate[item.sku] = { ...item };
        return;
      }

      switch (inventoryEvent.type) {
        case 'detail.update':
          existingItem.detail = item.detail;
          break;
        case 'shipment.update':
        case 'onHand.update':
          existingItem.amount += item.amount || 0;
          break;
      }
    });
  });

  return itemsAggregate;
}

const entityFunction = df.entity((context) => {
  const input = context.df.getInput() as any;
  const storeId = context.df.entityName;

  const currentState = context.df.getState(() => {
    return {
      storeId,
      totals: {},
      events: [],
    };
  }) as InventoryState;

  const event = {
    type: context.df.operationName,
    ...input,
  } as InventoryEvent;

  context.log(event);

  if (context.df.operationName === 'get') {
    context.df.return(currentState);
    return;
  }

  switch (event.type) {
    case 'onHand.update':
    case 'shipment.update':
    case 'detail.update':
      currentState.events.push(event);

      currentState.items = aggregateItems(currentState.events);
      context.df.setState(currentState);
      break;

    default:
      break;
  }
});

export default entityFunction;
