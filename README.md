# spike-inventory-de

Spike on basic inventory math using Durable Entities

## Prerequisites

- See the [Azure Durable Functions prerequisites](https://docs.microsoft.com/en-us/azure/azure-functions/durable/quickstart-js-vscode#prerequisites)
- Install the durable functions binding extension:

```bash
func extensions install --package Microsoft.Azure.WebJobs.Extensions.DurableTask --version 2.1.0
func extensions install --package Microsoft.Azure.WebJobs.Extensions.CosmosDB --version 3.0.5
```

# Running the Azure Function

## 1. Set up a Cosmos database

Set up a Cosmos Database in your subscription. The connection string will go in `./local.settings.json` under the `CosmosDB` setting:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "...",
    "CosmosDB": "AccountEndpoint=https://...",
    "FUNCTIONS_WORKER_RUNTIME": "node"
  }
}
```

Then, in your `local.settings.json` file, specify these properties:

- `leaseCollectionName`
- `databaseName`
- `collectionName`

Your `local.settings.json` structure can be copied from [`local.settings.template.json`](./local.settings.template.json).

## 2. Start the function host

In VS Code, press <kbd>F5</kbd> to start the function host.

When you update or insert an item into the Cosmos DB collection you created, it will trigger the [`InventoryCosmosTrigger`](./InventoryCosmosTrigger/index.ts) to start accumulating values for that store ID.

An item in the collection looks like this:

```json
{
  "type": "shipment.update",
  "storeId": "store004",
  "data": [
    {
      "sku": "item0",
      "amount": 1000
    },
    {
      "sku": "item1",
      "amount": 1000
    },
    {
      "sku": "item2",
      "amount": 0
    }
  ]
}
```

Where `type` is `"shipment.update"`, `"onHand.update"`, or `"detail.update"`, and `data` contains an array of item information, including `sku`, `amount`, and `detail`.
