import * as df from 'durable-functions';
import { entityReducer } from './entityReducer';

export interface ItemData {
  sku: string;
  amount: number;
  detail: any;
}

export type InventoryEvent =
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

export interface ItemsAggregate {
  [sku: string]: ItemData;
}

export interface InventoryState {
  storeId: string;
  items: ItemsAggregate;
  events: InventoryEvent[];
}

export function aggregateItems(
  inventoryEvents: InventoryEvent[]
): ItemsAggregate {
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

export const entityFunction = df.entity((context) => {
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

  const nextState = entityReducer(currentState, event);

  context.df.setState(nextState);
});
