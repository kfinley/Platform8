// import { APIGatewayRequestAuthorizerHandler } from 'aws-lambda';
import { APIGatewayProxyEventQueryStringParameters, APIGatewayProxyHandler } from 'aws-lambda';

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

const generateAllow = (principalId: any, resource: any) => generatePolicy(principalId, 'Allow', resource);

//TODO: move this to command...

const authorize = (token: any) => {
  if (token !== undefined) {
    return true;
  }
  return false;
  // TODO: lookup token in UsersTable
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const generateDeny = (principalId, resource) => generatePolicy(principalId, 'Deny', resource);

// eslint-disable-next-line consistent-return
export const handler: APIGatewayProxyHandler = async (event) => {
  console.log(event.headers);
  
  // Read input parameters from event
  const { resource } = event;
  const { token } = event.queryStringParameters as APIGatewayProxyEventQueryStringParameters;

  console.log(token);

  if (!token || authorize(token)) {
    // return failedResponse(401);
    return {
      statusCode: 401,
      body: 'Unauthorized'
    };
  }

  // context
  return generateAllow(token, resource);

  // Get the kid from the headers prior to verification
  // const sections = token.split('.');
  // let header = jose.util.base64url.decode(sections[0]);
  // header = JSON.parse(header);
  // const { kid } = header;

  // // Fetch known valid keys
  // const rawRes = await fetch(CONSTANTS.KEYS_URL);
  // const response = await rawRes.json();

  // if (rawRes.ok) {
  //   const { keys } = response;
  //   const foundKey = keys.find((key) => key.kid === kid);

  //   if (!foundKey) {
  //     context.fail('Public key not found in jwks.json');
  //   } else {
  //     try {
  //       const result = await jose.JWK.asKey(foundKey);
  //       const keyVerify = jose.JWS.createVerify(result);
  //       const verificationResult = await keyVerify.verify(token);

  //       const claims = JSON.parse(verificationResult.payload);

  //       // Verify the token expiration
  //       const currentTime = Math.floor(new Date() / 1000);
  //       if (currentTime > claims.exp) {
  //         console.error('Token expired!');
  //         context.fail('Token expired!');
  //       } else if (claims.aud !== CONSTANTS.COGNITO_USER_POOL_CLIENT) {
  //         console.error('Token wasn\'t issued for target audience');
  //         context.fail('Token was not issued for target audience');
  //       } else {
  //         context.succeed(generateAllow('me', methodArn));
  //       }
  //     } catch (error) {
  //       console.error('Unable to verify token', error);
  //       context.fail('Signature verification failed');
  //     }
  //   }
  // }
};
