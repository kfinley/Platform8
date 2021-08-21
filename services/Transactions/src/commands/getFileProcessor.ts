import { Command } from '@platform8/commands/src';
import { FileProcessors, GetFileProcessorRequest, GetFileProcessorResponse } from "../models";

export class GetFileProcessorCommand implements Command<GetFileProcessorRequest, GetFileProcessorResponse> {

  async runAsync(params: GetFileProcessorRequest): Promise<GetFileProcessorResponse> {

    let processor = FileProcessors.Unknown;

    if (params.text.includes("Summary Amt.") &&
      params.text.includes("Beginning balance as of") &&
      params.text.includes("Ending balance as of") &&
      params.text.includes("Running Bal.")) {
      return {
        processor: FileProcessors.BankOfAmericaCheckingTransactions
      }
    }

    if (params.text.includes('Extended Details') &&
      params.text.includes('Appears On Your Statement As') &&
      params.text.includes('Address') &&
      params.text.includes('City/State') &&
      params.text.includes('Reference') &&
      params.text.includes('Category')) {
      return {
        processor: FileProcessors.AmericanExpressCreditCardActivity
      }
    }

    return {
      processor
    }

  }
}
