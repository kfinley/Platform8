export interface GetStoredObjectRequest {
  bucket: string;
  key: string;
}

export interface GetStoredObjectResponse {
  body: string;
}

export interface PublishMessageRequest {
  subject?: string,
  message?: string,
  topic: string
}

export interface PublishMessageResponse {

}

export interface StartStepFunctionRequest {
  stateMachineArn?: string, 
  stateMachineName?: string, 
  input: string
}

export interface StartStepFunctionResponse {

}
