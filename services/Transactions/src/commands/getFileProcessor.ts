import { Command } from '@platform8/commands/src';
import { FileProcessors, GetFileProcessorRequest, GetFileProcessorResponse } from "../models";

export class GetFileProcessorCommand implements Command<GetFileProcessorRequest, GetFileProcessorResponse> {

  async runAsync(params: GetFileProcessorRequest): Promise<GetFileProcessorResponse> {

    let processor = FileProcessors.Unknown;

    if (params.text.includes("Summary Amt.") &&
      params.text.includes("Beginning balance as of") &&
      params.text.includes("Ending balance as of") &&
      params.text.includes("Running Bal.")) {
      processor = FileProcessors.BankOfAmericaCheckingTransactions
    }

    return {
      processor
    }

  }
}