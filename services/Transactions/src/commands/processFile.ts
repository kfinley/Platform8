
import { Command } from '@platform8/commands/src';
import { FileProcessors, ParsedTransactions, ProcessFileRequest, ProcessFileResponse } from "../models";
import { container } from 'inversify-props';
import { BA_Checking_Transactions_File_Parser_Command } from '../commands/file-parsers';
import { GetStoredObjectCommand } from '../commands';

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

        const cmd = container.get<BA_Checking_Transactions_File_Parser_Command>(FileProcessors.BankOfAmericaCheckingTransactions);
        const response = await cmd.runAsync({
          text: fileObject.body
        });
        data = response.data;
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
