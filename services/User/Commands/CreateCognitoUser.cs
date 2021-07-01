using System;
using System.Linq;
using System.Security.Cryptography;
using System.Threading;
using System.Threading.Tasks;

using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

using Amazon.CognitoIdentityProvider;
using Amazon.CognitoIdentityProvider.Model;

using MediatR;

using Platform8.User.Models;

namespace Platform8.User.Commands {
  public class CreateCognitoUserHandler : IRequestHandler<CreateCognitoUserRequest, CreateCognitoUserResponse> {

    private readonly IAmazonCognitoIdentityProvider provider;
    private readonly CognitoOptions cognitoOptions;
    private readonly ILogger<CreateCognitoUserHandler> logger;

    public CreateCognitoUserHandler(IAmazonCognitoIdentityProvider provider,
      IOptions<CognitoOptions> cognitoOptions, ILogger<CreateCognitoUserHandler> logger) {
      this.provider = provider;
      this.cognitoOptions = cognitoOptions.Value;
      this.logger = logger;
    }

    public async Task<CreateCognitoUserResponse> Handle(CreateCognitoUserRequest request, CancellationToken cancellationToken) {

      try {

        var tempPassword = GeneratePassword();

        var adminCreateRequest = new AdminCreateUserRequest {
          UserPoolId = cognitoOptions.UserPoolId,
          Username = request.UserId.ToString(),
          TemporaryPassword = tempPassword,
          MessageAction = MessageActionType.SUPPRESS
        };

        adminCreateRequest.UserAttributes.Add("email", request.Email);
        adminCreateRequest.UserAttributes.Add("given_name", request.FirstName);
        adminCreateRequest.UserAttributes.Add("family_name", request.LastName);

        var response = await this.provider.AdminCreateUserAsync(adminCreateRequest);

        if (response.IsSuccess()) {
          return new CreateCognitoUserResponse {
            Success = true,
            TempPassword = tempPassword,
            Email = request.Email
          };
        } else {
          this.logger.LogWarning($"Could not create Cognito user. Status Code: {response.HttpStatusCode}");
        }
      } catch (Exception e) {
        this.logger.LogError(e.Message);
      }
      return new CreateCognitoUserResponse {
        Success = false
      };
    }

    const string PASSWORD_ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$.@?;^*~-=+()[]{};':<>?,.";

    private string GeneratePassword(int length = 50) {

      var random = new RNGCryptoServiceProvider();
      var passwordBytes = new byte[length];
      random.GetBytes(passwordBytes);
      var token =
          Enumerable
              .Range(0, length)
              .Select(i => PASSWORD_ALPHABET[passwordBytes[i] % PASSWORD_ALPHABET.Length])
              .ToArray();

      return new String(token);

    }
  }
}
