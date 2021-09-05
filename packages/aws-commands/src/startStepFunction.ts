import { Inject } from 'inversify-props';
import { SFNClient, StartExecutionCommand, StartExecutionCommandInput, ListStateMachinesCommand,  } from "@aws-sdk/client-sfn";
import { Command } from '@platform8/commands/src';

export interface StartStepFunctionRequest {
  stateMachineArn?: string,
  stateMachineName?: string,
  input: string
}

export interface StartStepFunctionResponse {
  statusCode?: number;
  executionArn?: string;
}

export class StartStepFunctionCommand implements Command<StartStepFunctionRequest, StartStepFunctionResponse> {

  @Inject("SFNClient")
  private sfnClient!: SFNClient;

  async runAsync(params: StartStepFunctionRequest): Promise<StartStepFunctionResponse> {

    if (params.stateMachineArn === undefined && params.stateMachineName !== undefined) {
      const stateMachinesResult = await this.sfnClient.send(new ListStateMachinesCommand({}));

      if (stateMachinesResult.stateMachines) {
        for (var i = 0; i < stateMachinesResult.stateMachines.length; i++) {
          const item = stateMachinesResult.stateMachines[i];
          if (item.name === params.stateMachineName) {
            params.stateMachineArn = item.stateMachineArn;
          }
        }
      }
      if (params.stateMachineArn === undefined) {
        throw Error(`State Machine ${params.stateMachineName} was not found.`);
      }
    } else {
      throw Error('StateMachineName or StateMachineArn must be provided.');
    }

    var sendParams: StartExecutionCommandInput = {
      stateMachineArn: params.stateMachineArn,
      input: params.input
    };

    const command = new StartExecutionCommand(sendParams);
    var result = await this.sfnClient.send(command);

    console.log(`Started Step Function. Execution: ${result.executionArn}`);

    return {
      statusCode: result.$metadata.httpStatusCode,
      executionArn: result.executionArn
    };
  }
}
