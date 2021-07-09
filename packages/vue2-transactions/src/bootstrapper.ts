import { S3Client } from '@aws-sdk/client-s3';
import { container } from 'inversify-props';
import { UploadFileCommand } from "./commands";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';

export default function bootstrapper() {

  container.bind<CognitoIdentityClient>("CognitoIdentityClient")
  .toDynamicValue(() => new CognitoIdentityClient({
    endpoint: "http://localhost:9229"
  }));

  container.bind<CognitoIdentityProvider>("CognitoIdentityProvider")
  .toDynamicValue(() => new CognitoIdentityProvider({
    endpoint: "http://localhost:9229"
  }));

  container.bind<S3Client>("S3Client")
  .toDynamicValue(() => new S3Client({    
    endpoint: "http://localhost:4569"
  }));

  container.addTransient<UploadFileCommand>(UploadFileCommand, "UploadFileCommand");

}
