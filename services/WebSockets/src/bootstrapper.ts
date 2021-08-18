import 'reflect-metadata';
import { Container, container } from 'inversify-props';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { bootstrapper as awsCommandsBootstrapper}  from '@platform8/aws-commands/src';
import { DeleteConnectionCommand, SaveConnectionCommand } from './commands';

export default function bootstrapper() {

  awsCommandsBootstrapper();

  if (!container.isBound("DynamoDBClient")) {
    container.bind<DynamoDBClient>("DynamoDBClient")
      .toDynamicValue(() => new DynamoDBClient({
        endpoint: "http://platform8.dynamodb:8000"
      }));
  }

  addTransientIfNeeded<SaveConnectionCommand>(SaveConnectionCommand, "SaveConnectionCommand", container);
  addTransientIfNeeded<DeleteConnectionCommand>(DeleteConnectionCommand, "DeleteItemCommand", container);
}

function addTransientIfNeeded<T>(constructor: any, id: string, container: Container) {
  if (!container.isBound(id)) {
    container.addTransient<T>(constructor, id);
  }
}

