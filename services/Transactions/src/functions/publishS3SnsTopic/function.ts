import 'source-map-support/register';
import { S3Event, Context } from 'aws-lambda';
import { container } from 'inversify-props';
import { PublishMessageCommand } from '@platform8/aws-commands/src';

import bootstrapper from './../../bootstrapper';

bootstrapper();

export const handler = async (event: S3Event, context: Context) => {
  
  try {
    const cmd = container.get<PublishMessageCommand>("PublishMessageCommand");
    const response = await cmd.runAsync({
      topic: 'TransactionsUploadedTopic',
      message: JSON.stringify(event),
    });
    
    return { status_code: 200 };
  } catch (error) {
    console.log(error);
  }
};
