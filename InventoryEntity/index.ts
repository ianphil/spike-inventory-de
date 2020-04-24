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

// function createItem(sku: string): Item {
//   return {
//     sku,
//     amount: 0,
//     events: [],
//   };
// }

function aggregateItems(inventoryEvents: InventoryEvent[]) {
  const itemsAggregate: ItemsAggregate = {};

  inventoryEvents.forEach((inventoryEvent) => {
    inventoryEvent.data.forEach((item) => {
      let aggregatedItem = itemsAggregate[item.sku];
      if (!aggregatedItem) {
        aggregatedItem = item;
      } else {
        Object.assign(aggregatedItem, item);
      }

      itemsAggregate[item.sku] = aggregatedItem;
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
      currentState.events.push(event);
      // currentState.totals = aggregateItems(currentState.events);

      currentState.items = aggregateItems(currentState.events);
      context.df.setState(currentState);
      break;
    case 'detail.update':

    default:
      break;
  }
});

export default entityFunction;
