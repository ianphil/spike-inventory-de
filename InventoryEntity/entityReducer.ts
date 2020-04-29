import { InventoryState, InventoryEvent, aggregateItems } from './index';
export function entityReducer(
  state: InventoryState,
  event: InventoryEvent
): InventoryState {
  switch (event.type) {
    case 'onHand.update':
    case 'shipment.update':
    case 'detail.update':
      state.events.push(event);
      state.items = aggregateItems(state.events);
      return state;
    default:
      return state;
  }
}
