import { handlerPath } from './../../handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/function.handler`,
  events: [
    {
      sns: {
        arn: 'arn:aws:sns:us-west-1:101010101010:TransactionsUploadedTopic'
      }
    }
  ]
}
