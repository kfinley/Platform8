import { Inject } from 'inversify-props';
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Command } from '@platform8/commands/src';
import { GetStoredObjectRequest, GetStoredObjectResponse } from "./models";

export class GetStoredObjectCommand implements Command<GetStoredObjectRequest, GetStoredObjectResponse> {

  @Inject("S3Client")
  private s3Client!: S3Client;

  async runAsync(params: GetStoredObjectRequest): Promise<GetStoredObjectResponse> {

    // https://github.com/aws/aws-sdk-js-v3/issues/1877#issuecomment-755387549
    const streamToString = (stream: any): Promise<string> =>
      new Promise((resolve, reject) => {
        const chunks: any[] = [];
        stream.on("data", (chunk: any) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      });

    const data = await this.s3Client.send(new GetObjectCommand({
      Bucket: params.bucket,
      Key: params.key
    }));

    return {
      body: await streamToString(data.Body)
    };

  }
}
