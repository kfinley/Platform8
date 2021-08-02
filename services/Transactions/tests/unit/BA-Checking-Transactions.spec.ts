import 'reflect-metadata'; // <-- deal with this...

import { FileParserResponse, ParsedTransactions } from '../../src/models';
import { BA_Checking_Transactions_File_Parser_Command } from '../../src/commands/file-parsers';

describe("Bank of America Checking Transaction File Parser - Success", () => {


  let response: FileParserResponse<ParsedTransactions>;

  const testText = `Description,,Summary Amt.
Beginning balance as of 06/11/2021,,"106.41"
Total credits,,"500.00"
Total debits,,"-377.73"
Ending balance as of 07/12/2021,,"228.68"

Date,Description,Amount,Running Bal.
06/11/2021,Beginning balance as of 06/11/2021,,"106.41"
06/16/2021,"CITI AUTOPAY DES:PAYMENT ID:XXXXX6865485658 INDN:JOHN P DOE CO ID:CITICARDAP WEB","-99.00","7.41"
06/18/2021,"CAPITAL ONE DES:CRCARDPMT ID:5F3DDF3PJ65GZ2X INDN:JOHN DOE CO ID:XXXXX18654 WEB","-25.00","-17.59"
06/18/2021,"CITY OF HOT SPRI DES:UTILITYPMT ID:XXXXX0035624512 INDN:JOHN PAUL DOE CO ID:XXXXX08985 PPD","-21.92","-39.51"
06/18/2021,"ITEM FEE FOR ACTIVITY OF 06-18 ELECTRONIC TRANSACTION POSTING DATE 06-18-21 POSTING SEQ 00001","-35.00","-74.51"
06/18/2021,"ITEM FEE FOR ACTIVITY OF 06-18 ELECTRONIC TRANSACTION POSTING DATE 06-18-21 POSTING SEQ 00002","-35.00","-109.51"
06/22/2021,"REGIONS BANK DES:ZELLE ID:JOHN P DOE INDN:JOHN DOE CO ID:XXXXX65848 WEB","500.00","390.49"
07/06/2021,"NAVIENT DES:NAVI DEBIT ID:XXXXX314201001F INDN:JOHN P DOE CO ID:XXXXX68598 PPD","-137.06","253.43"
07/07/2021,"LIBERTY MUTUAL DES:PAYMENT ID:H4728526766987 INDN:DOE JOHN CO ID:XXXXX98745 PPD","-24.75","228.68"`
;
  
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
    expect(response.data.startDate).toEqual(new Date('2021-06-11')));

  it("should return end date", () => 
    expect(response.data.endDate).toEqual(new Date('2021-07-12')));
  
  it("should return beginning balance", () => 
    expect(response.data.beginningBalance).toEqual(106.41));
  
  it("should return ending balance", () => 
    expect(response.data.endingBalance).toEqual(228.68));

  it("should return collection of transactions", () => {
    expect(response.data.transactions);
    expect(response.data.transactions.length).toBe(8);
  });

  it("should handle sequence numbers", () => {
    expect(response.data.transactions[0].sequence).toBe(1);
    expect(response.data.transactions[3].sequence).toBe(1);
    expect(response.data.transactions[4].sequence).toBe(2);
    expect(response.data.transactions[5].sequence).toBe(1);
    
  });
});
