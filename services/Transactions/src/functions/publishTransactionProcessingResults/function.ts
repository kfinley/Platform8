import 'source-map-support/register';
import { Context } from 'aws-lambda';
import { container } from 'inversify-props';
import { PublishMessageCommand } from '@platform8/aws-commands/src';
import bootstrapper from './../../bootstrapper';

bootstrapper();

export const handler = async (event: any, context: Context) => {

  try {

    await container.get<PublishMessageCommand>("PublishMessageCommand").runAsync({
      topic: 'AccountBalanceTopic',
      message: JSON.stringify({
        userId: event.ownerId,
        accountId: event.accountId,
        date: event.balance.date,
        amount: event.balance.amount
      }),
    });

    await container.get<PublishMessageCommand>("PublishMessageCommand").runAsync({
      topic: 'TransactionsProcessedTopic',
      subject: 'Transactions-Processed',
      message: JSON.stringify({
        accountId: event.accountId,
        userId: event.ownerId,
        count: event.count,
        saved: event.saved
      }),
    });

    return {
      status_code: 200
    }

  } catch (error) {
    console.log(error);
  }
};
