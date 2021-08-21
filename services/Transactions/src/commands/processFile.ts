
import { Command } from '@platform8/commands/src';
import { FileProcessors, ParsedTransactions, ProcessFileRequest, ProcessFileResponse } from "../models";
import { container } from 'inversify-props';
import { AmericanExpress_CC_Transactions_File_Parser_Command, BA_Checking_Transactions_File_Parser_Command } from '../commands/file-parsers';
import { GetStoredObjectCommand } from '@platform8/aws-commands/src';

export class ProcessFileCommand implements Command<ProcessFileRequest, ProcessFileResponse<ParsedTransactions>> {

  async runAsync(params: ProcessFileRequest): Promise<ProcessFileResponse<ParsedTransactions>> {

    let data: ParsedTransactions;

    const cmd = container.get<GetStoredObjectCommand>("GetStoredObjectCommand");
    const fileObject = await cmd.runAsync({
      bucket: params.bucket,
      key: params.key
    });

    switch (params.processor) {
      case FileProcessors.BankOfAmericaCheckingTransactions:

        data = (
          await container
            .get<BA_Checking_Transactions_File_Parser_Command>(FileProcessors.BankOfAmericaCheckingTransactions)
            .runAsync({
              text: fileObject.body
            })).data;

        break;
      case FileProcessors.AmericanExpressCreditCardActivity:

        data = (
          await container
            .get<AmericanExpress_CC_Transactions_File_Parser_Command>(FileProcessors.AmericanExpressCreditCardActivity)
            .runAsync({
              text: fileObject.body
            })).data;

        break;
      default:
        throw new Error(`Unhandled processor. ${params.processor}`);
    }

    return {
      success: true,
      data
    };

  }
}
