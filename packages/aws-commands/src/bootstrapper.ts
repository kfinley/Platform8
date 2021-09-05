import 'reflect-metadata';
import { S3Client } from '@aws-sdk/client-s3';
import { SNSClient, } from "@aws-sdk/client-sns";
import { SFNClient } from "@aws-sdk/client-sfn";
import { Container } from 'inversify-props';
import {
  PublishMessageCommand,
  StartStepFunctionCommand,
  GetStoredObjectCommand
} from "./index";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { AuthorizeCommand } from './authorize';

export default function bootstrapper(container: Container) {

  if (!container.isBound("CognitoIdentityClient")) {
    container.bind<CognitoIdentityClient>("CognitoIdentityClient")
      .toDynamicValue(() => new CognitoIdentityClient({
        endpoint: "http://platform8.cognito:9229"
      }));
  }

  if (!container.isBound("CognitoIdentityProvider")) {
    container.bind<CognitoIdentityProvider>("CognitoIdentityProvider")
      .toDynamicValue(() => new CognitoIdentityProvider({
        endpoint: "http://platform8.cognito:9229"
      }));
  }

  if (!container.isBound("SNSClient")) {
    container.bind<SNSClient>("SNSClient")
      .toDynamicValue(() => new SNSClient({
        region: "us-west-1",
        endpoint: "http://localhost:4002"
      }));
  }

  if (!container.isBound("SFNClient")) {
    container.bind<SFNClient>("SFNClient")
      .toDynamicValue(() => new SFNClient({
        endpoint: "http://platform8.sfn:8083"
      }));
  }

  if (!container.isBound("S3Client")) {
    container.bind<S3Client>("S3Client")
      .toDynamicValue(() => new S3Client({
        region: "us-west-1",
        endpoint: "http://localhost:4569",
        forcePathStyle: true,
        credentials: {
          accessKeyId: 'S3RVER',
          secretAccessKey: 'S3RVER',
        }
      }));
  }

  addTransientIfNeeded<AuthorizeCommand>(AuthorizeCommand, "AuthorizeCommand", container);
  addTransientIfNeeded<GetStoredObjectCommand>(GetStoredObjectCommand, "GetStoredObjectCommand", container);
  addTransientIfNeeded<PublishMessageCommand>(PublishMessageCommand, "PublishMessageCommand", container);
  addTransientIfNeeded<StartStepFunctionCommand>(StartStepFunctionCommand, "StartStepFunctionCommand", container);
}

function addTransientIfNeeded<T>(constructor: any, id: string, container: Container) {
  if (!container.isBound(id)) {
    container.addTransient<T>(constructor, id);
  }
}

