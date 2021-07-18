import 'reflect-metadata'; // <-- deal with this...

import { FileParserResponse, ParsedTransactions } from '../../src/models';
import { BA_Checking_Transactions_File_Parser_Command } from '../../src/commands/file-parsers';

describe("Bank of America Checking Transaction File Parser - Success", () => {


  let response: FileParserResponse<ParsedTransactions>;

  const testText = `Description,,Summary Amt.
Beginning balance as of 05/11/2021,,"395.66"
Total credits,,"0"
Total debits,,"-289.25"
Ending balance as of 06/10/2021,,"106.41"

Date,Description,Amount,Running Bal.
05/11/2021,Beginning balance as of 05/11/2021,,"395.66"
05/18/2021,"CITI AUTOPAY DES:PAYMENT ID:XXXXX4610647648 INDN:ROBERT W JONES CO ID:CITICARDAP WEB","-100.00","295.66"
05/20/2021,"CITY OF HOT SPRI DES:UTILITYPMT ID:XXXXX0235501234 INDN:ROBERT WILLIAM JONES CO ID:XXXXX08764 PPD","-27.44","268.22"
06/07/2021,"NAVIENT DES:NAVI DEBIT ID:XXXXX314208564F INDN:ROBERT W JONES CO ID:XXXXX75497 PPD","-137.06","131.16"
06/07/2021,"LIBERTY MUTUAL DES:PAYMENT ID:H4726126774679 INDN:JONES ROBERT CO ID:XXXXX27943 PPD","-24.75","106.41"`;
  
  beforeAll(async () => {
    
    // Arrange
    const fileParserCommand = new BA_Checking_Transactions_File_Parser_Command();

    // Act
    response = await fileParserCommand.runAsync({
      text: testText
    });

  });

  it("should return success", () => 
    expect(response.success).toBeTruthy());

  it("should return start date", () => 
    expect(response.data.startDate).toEqual(new Date('2021-05-11')));

  it("should return end date", () => 
    expect(response.data.endDate).toEqual(new Date('2021-06-10')));
  
  it("should return beginning balance", () => 
    expect(response.data.beginningBalance).toEqual(395.66));
  
  it("should return ending balance", () => 
    expect(response.data.endingBalance).toEqual(106.41));

  it("should return collection of transactions", () => {
    expect(response.data.transactions);
    expect(response.data.transactions.length).toBe(4);
  });
});