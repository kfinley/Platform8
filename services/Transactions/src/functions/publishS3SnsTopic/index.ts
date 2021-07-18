import { handlerPath } from './../../handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/function.handler`,
  events: [
    {
      s3: {
        bucket: 'Transactions-uploads',
        event: 's3:ObjectCreated:Put'
      }
    }
  ]
}
