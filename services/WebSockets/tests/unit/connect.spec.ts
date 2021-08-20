import 'reflect-metadata';

import { APIGatewayEventRequestContextWithAuthorizer, APIGatewayProxyResult } from 'aws-lambda';
import bootstrapper from "../../src/bootstrapper";

import { handler as connect } from '../../src/functions/connect/function';
import { AuthorizeCommand } from '@platform8/aws-commands/src';
import { SaveConnectionCommand } from '../../src/commands';

import event from '../data/connect-event.json';

describe("connect", () => {

  const context = {
    awsRequestId: 'ckshohv7y00040kp6fhg28r7h',
    callbackWaitsForEmptyEventLoop: true,
    clientContext: undefined,
    functionName: 'Platform8-Dev-WebSockets-connect',
    functionVersion: '$LATEST',
    identity: undefined,
    invokedFunctionArn: 'offline_invokedFunctionArn_for_Platform8-Dev-WebSockets-connect',
    logGroupName: 'offline_logGroupName_for_Platform8-Dev-WebSockets-connect',
    logStreamName: 'offline_logStreamName_for_Platform8-Dev-WebSockets-connect',
    memoryLimitInMB: '1024',
    getRemainingTimeInMillis: () => { return 100 },
    done: () => { },
    fail: () => { },
    succeed: () => { }
  };

  describe("Success", () => {

    let result: APIGatewayProxyResult | undefined = undefined;
    const authorizeRunAsyncMock = jest.fn();
    const saveConnectionRunAsyncMock = jest.fn();

    beforeAll(async () => {

      AuthorizeCommand.prototype.runAsync = authorizeRunAsyncMock;
      authorizeRunAsyncMock.mockReturnValue(Promise.resolve({
        username: '90662ced-a485-4a71-b3e2-5b11bea678c9',
        attributes: { 'username': '90662ced-a485-4a71-b3e2-5b11bea678c9' },
        authorized: true,
      }));

      SaveConnectionCommand.prototype.runAsync = saveConnectionRunAsyncMock;
      saveConnectionRunAsyncMock.mockReturnValue(Promise.resolve({
        success: true
      }))

      bootstrapper();

      result = await connect(event, context, () => { }) as APIGatewayProxyResult;
    });

    it("should run", () => {

      expect(result?.statusCode).toEqual(200);
    });
  });

  describe("Unauthenticated", () => {

    let result: APIGatewayProxyResult | undefined = undefined;
    const authorizeRunAsyncMock = jest.fn();

    beforeAll(async () => {

      AuthorizeCommand.prototype.runAsync = authorizeRunAsyncMock;
      authorizeRunAsyncMock.mockReturnValue(Promise.resolve({
        username: '90662ced-a485-4a71-b3e2-5b11bea678c9',
        authorized: false,
      }));

      bootstrapper();

      result = await connect(event, context, () => { }) as APIGatewayProxyResult;
    });

    it("should return a 401 status", () => {

      expect(result?.statusCode).toEqual(401);
    });
  });
});
