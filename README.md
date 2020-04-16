# spike-inventory-de

Spike on basic inventory math using Durable Entities

## Prerequisites

- See the [Azure Durable Functions prerequisites](https://docs.microsoft.com/en-us/azure/azure-functions/durable/quickstart-js-vscode#prerequisites)
- Install the durable functions binding extension:

```
func extensions install --package Microsoft.Azure.WebJobs.Extensions.DurableTask --version 2.1.0
```

# Running the Azure Function

1. In VS Code, press <kbd>F5</kbd> to start the function host.

The `/api/stores/` route provides a simple command/query endpoint for keeping a counter per store.

- `GET /api/stores/{storeId}` will return the current state of a store. The response should look like:

```json
{
  "amount": 42
}
```

E.g., http://localhost:7071/api/stores/2

- `POST /api/stores/{storeId}` will send an event to update the state of the store. The body should look like:

```json
{
  "amount": 1
}
```

Where `"amount"` is the amount to add, in this example.
