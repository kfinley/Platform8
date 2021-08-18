// import { APIGatewayRequestAuthorizerHandler } from 'aws-lambda';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { container } from 'inversify-props';
import { AuthorizeCommand } from "@platform8/aws-commands/src";

const generatePolicy = (principalId: any, effect: any, resource: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const authResponse: any = {};
  authResponse.principalId = principalId;

  if (effect && resource) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const policyDocument: any = {};
    // default version
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const statementOne: any = {};
    // default action
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
};

const generateAllow = (principalId: string, resource: string) => generatePolicy(principalId, 'Allow', resource);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const generateDeny = (principalId: string, resource: string) => generatePolicy(principalId, 'Deny', resource);

// eslint-disable-next-line consistent-return
export const handler: APIGatewayProxyHandler = async (event) => {

  const { Authorization } = event.headers;

  if (!Authorization) {
    return {
      statusCode: 401,
      body: 'Unauthorized'
    };
  }

  // 'Basic dGVzdDpwYXNzd29yZA=='
  const idAndToken = Buffer.from(Authorization.split(' ')[1], 'base64').toString()
  const [id, token] = idAndToken.split(':');

  const authResult = await container.get<AuthorizeCommand>("AuthorizeCommand").runAsync({ token });

  if (authResult.success) {
    return generateAllow(id, event.resource == undefined ? '$connect' : event.resource);
  } else {
    return generateDeny(id, event.resource == undefined ? '$connect' : event.resource);
  }
};
