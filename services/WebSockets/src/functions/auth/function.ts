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

const generateDeny = (principalId: string, resource: string) => generatePolicy(principalId, 'Deny', resource);

export const handler: APIGatewayProxyHandler = async (event) => {

  const { Authorization } = event.headers;

  if (!Authorization) {
    return {
      statusCode: 401,
      body: 'Unauthorized'
    };
  }

  const authResult = await container.get<AuthorizeCommand>("AuthorizeCommand")
                                    .runAsync({ authHeader: Authorization });

  if (authResult.authorized) {
    return generateAllow(authResult.username, event.resource == undefined ? '$connect' : event.resource);
  } else {
    return generateDeny(authResult.username, event.resource == undefined ? '$connect' : event.resource);
  }
};
