import { container } from 'inversify-props';
import { Context, Handler } from 'aws-lambda';
import bootstrapper from './../../bootstrapper';
import { GetConnectionByUserIdCommand } from '../../commands';

bootstrapper();

const getConnectionCmd = () => container.get<GetConnectionByUserIdCommand>("GetConnectionByUserIdCommand");

export const handler: Handler = async (event: any, context: Context) => {

  const { userId } = JSON.parse(event.message);

  console.log(userId);

  const response = await getConnectionCmd().runAsync({
    userId
  });

  if (response && response.success) {
    return {
      ...event,
      connectionId: response.connectionId
    };
  } return event;
};
