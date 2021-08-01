import 'source-map-support/register';
import { Context, Handler } from 'aws-lambda';
import { container } from 'inversify-props';
import bootstrapper from '../../bootstrapper';
import { SaveLinkedItemCommand } from '../../commands';

bootstrapper();

export const handler: Handler = async (event: any, context: Context) => {
  
  try {
    const { ownerId, transaction, linkedItem } = event;
    
    const addLinkedItem = await container.get<SaveLinkedItemCommand>("SaveLinkedItemCommand").runAsync({
      ownerId,
      transaction,
      linkedItem
    });

    console.log('Linked Item added to Transaction:', transaction.id);

    const payload = {
      transactionId: transaction.id,
      linkedItemId: addLinkedItem.data.id
    };

    return payload;

  } catch (error) {
    console.log(error);
  }
};
