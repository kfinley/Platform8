import 'source-map-support/register';
import { Context, Handler } from 'aws-lambda';
import { container } from 'inversify-props';
import { ProcessFileCommand, SaveTransactionsCommand } from './../../commands';
import bootstrapper from './../../bootstrapper';

bootstrapper();

export const handler: Handler = async (event: any, context: Context) => {

  try {
    // Parse file based on processor
    const processFile = await container.get<ProcessFileCommand>('ProcessFileCommand').runAsync({
      processor: event.processor,
      bucket: event.bucket,
      key: event.key
    });

    const keySplit = event.key.split('/');
    const userId = keySplit[0];
    const accountId = keySplit[1];

    const saveTransactions = await container.get<SaveTransactionsCommand>('SaveTransactionsCommand').runAsync({
      userId,
      accountId,
      transactions: processFile.data.transactions
    });

    console.log('Transactions Saved:', saveTransactions);

    const payload = {
      userId,
      accountId,
      count: saveTransactions.count,
      saved: saveTransactions.saved,
      balance: {
        date: processFile.data.endDate,
        amount: processFile.data.endingBalance
      }
    };

    return payload;

  } catch (error) {
    console.log(error);
  }
};
