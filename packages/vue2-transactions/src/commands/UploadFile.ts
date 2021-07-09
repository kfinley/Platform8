import { S3Client, AbortMultipartUploadCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { CognitoIdentityClient } from"@aws-sdk/client-cognito-identity";
import {
  fromCognitoIdentityPool,
} from"@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { Inject, injectable } from 'inversify-props';
import { UploadFileRequest, UploadFileResponse } from '../models';
import { Command } from '@platform8/commands/src';
import { authHelper } from '@platform8/api-client/src/helpers'
import { config } from "@platform8/config/src";

export class UploadFileCommand implements Command<UploadFileRequest, UploadFileResponse> {
  
  @Inject("S3Client")
  private s3Client!: S3Client;

  @Inject("CognitoIdentityClient")
  private cognitoClient!: CognitoIdentityClient;

  @Inject('CognitoIdentityProvider')
  private cognitoProvider!: CognitoIdentityProvider;

  async runAsync(params: UploadFileRequest): Promise<UploadFileResponse> {
    
    try {
      
      const user = await this.cognitoProvider.getUser({
        AccessToken: authHelper.authToken()
      });
      
      const uploaadParams = {
        Bucket: params.bucket,
        Key: `${user.Username}/${params.file.name}`,
        Body: params.file
      };

      this.s3Client.config.credentials = fromCognitoIdentityPool({
        client: this.cognitoClient,
        identityPoolId: config.PoolId,
        logins: {
          ["COGNITO_ID"]: authHelper.idToken()
        }
      });
  
      const data = await this.s3Client.send(new PutObjectCommand(uploaadParams));
      console.log(data);

      return {
        success: true,
      }
    } catch (error) {
      const message = `Upload failed. Error: ${error.message}`;
      return {
        success: false,
        error: message
      };
    }
  }
}
