# Simple Inventory Management

Pre-aggregate inventory based on balance on hand and shipments received. The question we are trying to answer is: *What is the inventory level of all SKUs for a given store?*

`(dd + (s + d + h))/sid = l`

 - dd:    Current day 0:00-24:00
 - s:     SKU shipment count
 - d:     SKU detail (meta data)
 - h:     SKU on hand count
 - sid:   Store ID
 - l:     Inventory Level

## Constraints

 - As shipment and on hand counts are received, we combine that with detail information. 
 - Once both shipment and on-hand balances per store have arrived we write that to a new table. 
 - Once the day has ended we start with a new entity.
 - Multiple shipments can arrive in a single day.
 - Shipment counts can be wrong and updated.
 - On-hand counts can be wrong and updated.
 - If a shipment or on-hand balance isn't received, this is an error.
 - No specific arrival order is predicted for shipments or on-hand balances.
 - SKU Detail may or may not received updated information.

# Logical Diagram
![image](https://user-images.githubusercontent.com/17349002/79244649-25307f80-7e45-11ea-83c9-822f2c98d21c.png)

# Tech
Data is pushed at radom intervals into CosmosDB. The items s, d, h will each land in their own collection. Using the change feed we will trigger Azure Durable Functions using durable entities to maintain state. Once all criteria is met we will drop the aggregated data in a fourth collection.

We should expect to use a single entity per day and per store.