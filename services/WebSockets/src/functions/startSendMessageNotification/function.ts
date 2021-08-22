import 'source-map-support/register';
import { SNSEvent, Context } from 'aws-lambda';
import { container } from 'inversify-props';
import { StartStepFunctionCommand } from '@platform8/aws-commands/src';
import bootstrapper from './../../bootstrapper';

bootstrapper();
export const handler = async (event: SNSEvent, context: Context) => {

  try {

    console.log(`Send client message via SNS Event. Count: ${event.Records.length}`);
    const { userId } = JSON.parse(event.Records[0].Sns.Message);

    if (!userId) {
      throw new Error('userId must be provided in Message in order to send to client.');
    }

    const cmd = container.get<StartStepFunctionCommand>("StartStepFunctionCommand");
    const response = await cmd.runAsync({
      input: JSON.stringify({
        subject: event.Records[0].Sns.Subject,
        message: event.Records[0].Sns.Message
      }),
      stateMachineName: 'WebSockets-SendMessage'
    });

    return {
      status_code: response.statusCode
    };
    
  } catch (error) {
    console.log(error);
    return {
      status_code: 500,
      body: error
    }
  }
};
