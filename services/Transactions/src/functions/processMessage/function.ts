import 'source-map-support/register';
import { Context, Handler } from 'aws-lambda';
import { container } from 'inversify-props';
import bootstrapper from '../../bootstrapper';
import { GetTransactionCommand } from '../../commands';

bootstrapper();

export const handler: Handler = async (event: any, context: Context) => {

  try {
    const { ownerId, transactionId, ...linkedItem} = event;

    const cmd = container.get<GetTransactionCommand>("GetTransactionCommand");
    const response = await cmd.runAsync({
      ownerId,
      id: transactionId
    });

    const payload = {
      ownerId,
      transaction: response.data,
      linkedItem
    };
    
    return payload;

  } catch (error) {
    console.log(error);
  }
};
