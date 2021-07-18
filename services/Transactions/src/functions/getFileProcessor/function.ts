import 'source-map-support/register';
import { Context, Handler, S3Event } from 'aws-lambda';
import { container } from 'inversify-props';
import { GetStoredObjectCommand } from '@platform8/aws-commands/src';
import { GetFileProcessorCommand } from './../../commands';
import bootstrapper from './../../bootstrapper';

bootstrapper();

export const handler: Handler = async (event: S3Event, context: Context) => {

  try {
    const cmd = container.get<GetStoredObjectCommand>("GetStoredObjectCommand");
    const response = await cmd.runAsync({
      bucket: event.Records[0].s3.bucket.name,
      key: event.Records[0].s3.object.key
    });

    const getProcessor = await container.get<GetFileProcessorCommand>("GetFileProcessorCommand").runAsync({
      text: response.body
    });

    const payload = {
      processor: getProcessor.processor,
      bucket: event.Records[0].s3.bucket.name,
      key: event.Records[0].s3.object.key
    };

    return payload;

  } catch (error) {
    console.log(error);
  }
};
