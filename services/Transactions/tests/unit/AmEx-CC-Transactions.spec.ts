import 'reflect-metadata';

import { FileParserResponse, ParsedTransactions } from '../../src/models';
import { AmericanExpress_CC_Transactions_File_Parser_Command } from '../../src/commands/file-parsers/AmericanEpress-CC-Transactions';

describe("American Express Credit Card Transactions File Parser", () => {

  describe("Success", () => {

    let response: FileParserResponse<ParsedTransactions>;

    const testText = `Date,Description,Amount,Extended Details,Appears On Your Statement As,Address,City/State,Zip Code,Country,Reference,Category
08/05/2021,AUTOPAY PAYMENT - THANK YOU,-234.62,AUTOPAY PAYMENT - THANK YOU,AUTOPAY PAYMENT - THANK YOU,,,,,'680215270241487554',
08/03/2021,Amazon Web Services AWS.Amazon.com      WA,12.20,"1194IJ5RM05 WEB SERVICES
Amazon Web Services
AWS.Amazon.com
WA
WEB SERVICES",Amazon Web Services AWS.Amazon.com      WA,410 Terry Ave N,"Seattle
WA",98109,UNITED STATES,'354212290543352771',Merchandise & Supplies-Internet Purchase
08/01/2021,VIXE,11.47,"7245021    87824            67556
HOSTING
PROMOHOSTING
VIXE.COM
555-555-5555
CA
HOSTING
PROMOHOSTING
85322            94362",VIXE.COM          555-555-5555        CA,10 CORPORATE DR STE 300,"BURLINGTON
MA",01803,UNITED STATES,'320212140996120409',Other-Miscellaneous`
      ;

    beforeAll(async () => {

      // Arrange
      const fileParserCommand = new AmericanExpress_CC_Transactions_File_Parser_Command();

      // Act
      response = await fileParserCommand.runAsync({
        text: testText
      });

    });

    it("should return success", () =>
      expect(response.success).toBeTruthy());
  });

  describe("Failure", () => { })
});
