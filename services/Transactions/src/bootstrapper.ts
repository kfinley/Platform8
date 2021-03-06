import 'reflect-metadata';
import { Container, container } from 'inversify-props';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { bootstrapper as awsCommandsBootstrapper } from '@platform8/aws-commands/src';
import {
  GetFileProcessorCommand,
  ProcessFileCommand,
  SaveTransactionsCommand,
  GetTransactionCommand,
  SaveTransactionCommand,
  SaveLinkedItemCommand
} from "./commands";
import {
  FileProcessors
} from "./models";

import { AmericanExpress_CC_Transactions_File_Parser_Command, BA_Checking_Transactions_File_Parser_Command } from './commands/file-parsers';

export default function bootstrapper() {

  awsCommandsBootstrapper(container);

  if (!container.isBound("DynamoDBClient")) {
    container.bind<DynamoDBClient>("DynamoDBClient")
      .toDynamicValue(() => new DynamoDBClient({
        endpoint: "http://platform8.dynamodb:8000"
      }))
  }

  addTransientIfNeeded<GetFileProcessorCommand>(GetFileProcessorCommand, "GetFileProcessorCommand", container);
  addTransientIfNeeded<ProcessFileCommand>(ProcessFileCommand, "ProcessFileCommand", container);
  addTransientIfNeeded<SaveTransactionsCommand>(SaveTransactionsCommand, "SaveTransactionsCommand", container);
  addTransientIfNeeded<GetTransactionCommand>(GetTransactionCommand, "GetTransactionCommand", container);
  addTransientIfNeeded<SaveTransactionCommand>(SaveTransactionCommand, "SaveTransactionCommand", container);
  addTransientIfNeeded<SaveLinkedItemCommand>(SaveLinkedItemCommand, "SaveLinkedItemCommand", container);

  addTransientIfNeeded<BA_Checking_Transactions_File_Parser_Command>(
    BA_Checking_Transactions_File_Parser_Command,
    FileProcessors.BankOfAmericaCheckingTransactions,
    container);

  addTransientIfNeeded<AmericanExpress_CC_Transactions_File_Parser_Command>(
    AmericanExpress_CC_Transactions_File_Parser_Command,
    FileProcessors.AmericanExpressCreditCardActivity,
    container);
}

function addTransientIfNeeded<T>(constructor: any, id: string, container: Container) {
  if (!container.isBound(id)) {
    container.addTransient<T>(constructor, id);
  }
}

