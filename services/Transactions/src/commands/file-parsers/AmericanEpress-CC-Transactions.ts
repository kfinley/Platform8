import { Command } from '@platform8/commands/src';
import { Transaction, ParsedTransactions, FileParserRequest, FileParserResponse } from "../../models";

export class AmericanExpress_CC_Transactions_File_Parser_Command implements Command<FileParserRequest, FileParserResponse<ParsedTransactions>> {
  async runAsync(params: FileParserRequest): Promise<FileParserResponse<ParsedTransactions>> {

    let { text } = params;

    // https://stackoverflow.com/a/23582323
    let rows = text.split(/\n(?=(?:(?:[^"]*"){2})*[^"]*$)/gi);
    /*
    \n        '\n'
    (?=       look ahead to see if there is:
    (?:       group, but do not capture (0 or more times):
    (?:       group, but do not capture (2 times):
    [^"]*     any character except: '"' (0 or more times)
    "         '"'
    ){2}      end of grouping
    )*        end of grouping
    [^"]*     any character except: '"' (0 or more times)
    $         before an optional \n, and the end of the string
    )         end of look-ahead */

    let data: ParsedTransactions = {
      startDate: new Date(rows[rows.length - 1].split(',')[0]),
      endDate: new Date(rows[1].split(',')[0]),
      transactions: new Array<Transaction>(),
    };

    for (let i = 1; i < rows.length; i++) {
      let [date,
        description,
        amount,
        extendedDetails,
        appearsOnStatementAs,
        address,
        cityState,
        postalCode,
        country,
        reference,
        category] = rows[i].split(',');

      const cityStateParts = cityState.split(/[\s,]+/);
      const state = cityStateParts[cityStateParts.length - 1].replace(/"/g, '');

      data.transactions.push({
        amount: Number.parseFloat(amount),
        date: new Date(date),
        description,
        sequence: 0,
        extendedDetails: extendedDetails.replace(/"/g, ''),
        appearsOnStatementAs,
        address: address.replace(/"/g, ''),
        city: cityState.replace(/"/g, '').replace(`${state}`, '').trim(),
        state,
        postalCode,
        country,
        reference: reference.replace(/'/g, ''),
        category
      });
    }

    return {
      success: true,
      data
    }

  }

}
