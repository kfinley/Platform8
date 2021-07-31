import 'source-map-support/register';
import { Context } from 'aws-lambda';
import { container } from 'inversify-props';
import { PublishMessageCommand } from '@platform8/aws-commands/src';
import bootstrapper from './../../bootstrapper';

bootstrapper();

export const handler = async (event: any, context: Context) => {

  try {

    await container.get<PublishMessageCommand>("PublishMessageCommand").runAsync({
      topic: 'Transactions-LinkedItemTopic',
      message: JSON.stringify(event),
    });

    return {
      status_code: 200
    }

  } catch (error) {
    console.log(error);
  }
};
