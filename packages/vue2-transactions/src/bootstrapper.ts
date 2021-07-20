import { S3Client } from '@aws-sdk/client-s3';
import { Container, container } from 'inversify-props';
import { LoadTransactionsCommand, UploadFileCommand } from "./commands";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { apiClient, ApiClient } from '@platform8/api-client/src';

export default function bootstrapper() {

  if (!container.isBound("CognitoIdentityClient")) {
    container.bind<CognitoIdentityClient>("CognitoIdentityClient")
      .toDynamicValue(() => new CognitoIdentityClient({
        endpoint: "http://localhost:9229"
      }));
  }

  if (!container.isBound("CognitoIdentityProvider")) {
    container.bind<CognitoIdentityProvider>("CognitoIdentityProvider")
      .toDynamicValue(() => new CognitoIdentityProvider({
        endpoint: "http://localhost:9229"
      }));
  }

  if (!container.isBound("S3Client")) {
    container.bind<S3Client>("S3Client")
      .toDynamicValue(() => new S3Client({
        region: "us-west-1",
        endpoint: "http://localhost:4569",
        forcePathStyle: true,
        // This would work if cognito-local supported GetId
        // Cognito Local unsupported feature: Unsupported x-amz-target header "GetId"
        // credentials: fromCognitoIdentityPool({
        //   client: container.get<CognitoIdentityClient>("CognitoIdentityClient"),
        //   identityPoolId: config.PoolId,
        //   logins: {
        //     ["COGNITO_ID"]: authHelper.idToken()
        //   }
        // })
        // For local development use built-in s3-local keys
        credentials: {
          accessKeyId: 'S3RVER',
          secretAccessKey: 'S3RVER',
        }
      }))
  }
  addTransientIfNeeded<ApiClient>(apiClient, 'ApiClient', container);
  addTransientIfNeeded<UploadFileCommand>(UploadFileCommand, "UploadFileCommand", container);
  addTransientIfNeeded<LoadTransactionsCommand>(LoadTransactionsCommand, "LoadTransactionsCommand", container);
}

function addTransientIfNeeded<T>(constructor: any, id: string, container: Container) {
  if (!container.isBound(id)) {
    container.addTransient<T>(constructor, id);
  }
}