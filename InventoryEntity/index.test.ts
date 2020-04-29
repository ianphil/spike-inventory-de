import { InventoryState, InventoryEvent } from './index';
import { entityReducer } from './entityReducer';

describe('entity reducer', () => {
  it('should respond to shipment.update events', () => {
    const currentState: InventoryState = {
      storeId: '0001',
      items: {},
      events: [],
    };

    const nextState = entityReducer(currentState, {
      type: 'shipment.update',
      documentId: 'doc0001',
      data: [
        {
          sku: 'item0001',
          amount: 100,
          detail: null,
        },
      ],
    });

    expect(nextState.items).toMatchInlineSnapshot(`
      Object {
        "item0001": Object {
          "amount": 100,
          "detail": null,
          "sku": "item0001",
        },
      }
    `);
  });

  it('should update (not add) item amounts for the same document ID', () => {
    const currentState: InventoryState = {
      storeId: '0001',
      items: {},
      events: [],
    };

    const events: InventoryEvent[] = [
      {
        type: 'shipment.update',
        documentId: 'doc0001',
        data: [
          {
            sku: 'item0001',
            amount: 100,
            detail: null,
          },
        ],
      },
      {
        type: 'shipment.update',
        documentId: 'doc0001',
        data: [
          {
            sku: 'item0001',
            amount: 50,
            detail: null,
          },
        ],
      },
    ];

    const nextState = events.reduce((acc, event) => {
      return entityReducer(acc, event);
    }, currentState);

    // 50 replaces 100 = 50
    expect(nextState.items['item0001'].amount).toEqual(50);
  });

  it('should add item amounts for different document IDs', () => {
    const currentState: InventoryState = {
      storeId: '0001',
      items: {},
      events: [],
    };

    const events: InventoryEvent[] = [
      {
        type: 'shipment.update',
        documentId: 'doc0001',
        data: [
          {
            sku: 'item0001',
            amount: 100,
            detail: null,
          },
        ],
      },
      {
        type: 'shipment.update',
        documentId: 'doc0002',
        data: [
          {
            sku: 'item0001',
            amount: 50,
            detail: null,
          },
        ],
      },
    ];

    const nextState = events.reduce((acc, event) => {
      return entityReducer(acc, event);
    }, currentState);

    // 100 + 50 = 150
    expect(nextState.items['item0001'].amount).toEqual(150);
  });
});
