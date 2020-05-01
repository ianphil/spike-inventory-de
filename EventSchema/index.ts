import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { readFileSync } from 'fs';

const eventSchema = JSON.parse(
  readFileSync(`./Shared/eventSchema.json`, 'utf8')
);

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log('HTTP trigger function processed a request.');

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: eventSchema,
  };
};

export default httpTrigger;
