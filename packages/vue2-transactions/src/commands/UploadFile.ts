import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { Inject } from 'inversify-props';
import { UploadFileRequest, UploadFileResponse } from '../models';
import { Command } from '@platform8/commands/src';
import { authHelper } from '@platform8/api-client/src/helpers'

export class UploadFileCommand implements Command<UploadFileRequest, UploadFileResponse> {

  @Inject("S3Client")
  private s3Client!: S3Client;

  @Inject('CognitoIdentityProvider')
  private cognitoProvider!: CognitoIdentityProvider;

  async runAsync(params: UploadFileRequest): Promise<UploadFileResponse> {

    try {
      const user = await this.cognitoProvider.getUser({
        AccessToken: authHelper.authToken()
      });

      const uploadParams = {
        Bucket: params.bucket,
        Key: `${user.Username}/${params.accountId}/${params.file.lastModified}_${params.file.name}`,
        Body: params.file
      };

      await this.s3Client.send(new PutObjectCommand(uploadParams));

      return {
        success: true,
      }
    } catch (error) {
      const message = `Upload failed. Error: ${error.message ?? error}`;
      return {
        success: false,
        error: message
      };
    }
  }
}
