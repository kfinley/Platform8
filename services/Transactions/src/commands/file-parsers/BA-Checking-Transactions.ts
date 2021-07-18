
import { Command } from '@platform8/commands/src';
import { Transaction, ParsedTransactions, FileParserRequest, FileParserResponse } from "../../models";
import * as uuid from "uuid";

export class BA_Checking_Transactions_File_Parser_Command implements Command<FileParserRequest, FileParserResponse<ParsedTransactions>> {

  async runAsync(params: FileParserRequest): Promise<FileParserResponse<ParsedTransactions>> {

    let allLines = params.text.split(/\r\n|\r|\n/);

    let endingBalanceRow = allLines[4].split(',');
    let beginningBalanceRow = allLines[7].split(',');

    let data: ParsedTransactions = {
      startDate: new Date(beginningBalanceRow[0]),
      beginningBalance: Number.parseFloat(beginningBalanceRow[3].replace('"', '')),
      endDate: new Date(endingBalanceRow[0].split(' ')[4]),
      endingBalance: Number.parseFloat(endingBalanceRow[2].replace('"', '')),
      transactions: new Array<Transaction>(),
    };

    // Skip Beginning balance line and only loaad transactions
    for (let i = 8; i < allLines.length; i++) {
      let transactionRow = allLines[i].split(',');
      // Skip any empty rows
      if (transactionRow.length == 4) {
        data.transactions.push({
          id: uuid.v4(),
          date: new Date(transactionRow[0]),
          description: transactionRow[1].replace('"', ''),
          amount: Number.parseFloat(transactionRow[2].replace('"', ''))
        });
      }
    }

    return {
      success: true,
      data
    }
  }
}