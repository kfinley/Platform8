using System;
using System.Net;
using System.Threading;

using Amazon.CognitoIdentityProvider;
using Amazon.CognitoIdentityProvider.Model;

using Machine.Specifications;
using Machine.Specifications.Model;

using FluentAssertions;
using Xunit;
using Moq;
using It = Machine.Specifications.It;
using Argument = Moq.It;

using Platform8.Tests.Common.Specs;
using Platform8.Tests.Common;
using Platform8.User.Commands;
using Platform8.User.Models;
using Microsoft.Extensions.Options;

namespace Platform8.User.Tests {
  [Subject("Create Cognito User")]
  public class When_CreateCognitoUser_Requested : SpecBase {
    public When_CreateCognitoUser_Requested(MSpecFixture fixture)
      : base(fixture) {
      Setup(this, context, of);
    }

    static Sut<CreateCognitoUserHandler> Sut = new Sut<CreateCognitoUserHandler, CreateCognitoUserResponse>();

    static CreateCognitoUserRequest Request;
    static CreateCognitoUserResponse Result;

    Establish context = () => {
      Request = new CreateCognitoUserRequest {
        UserId = Guid.NewGuid().ToString(),
        FirstName = "Bob",
        LastName = "Jones",
        Email = "Bob@Jones.com"
      };

      Sut.SetupAsync<IAmazonCognitoIdentityProvider, AdminCreateUserResponse>(p =>
          p.AdminCreateUserAsync(Argument.IsAny<AdminCreateUserRequest>(), Argument.IsAny<CancellationToken>()))
        .ReturnsAsync(
        new AdminCreateUserResponse() {
          HttpStatusCode = HttpStatusCode.OK,
        });

      Sut.Setup<IOptions<CognitoOptions>, CognitoOptions>(o => o.Value).Returns(new CognitoOptions {
        UserPoolId = "test-user-pool-id"
      });

    };

    Because of = async () => Result = await Sut.Target.Handle(Request, new CancellationTokenSource().Token);

    It should_return_a_successful_result = () => {
      Result.Should().NotBeNull();
      Result.Success.Should().BeTrue();
    };

    [Fact]
    public void It_should_return_a_successful_result() =>
        should_return_a_successful_result();

    [Fact]
    public void It_should_create_a_new_Cognito_account() => should_create_a_new_Cognito_account();
    It should_create_a_new_Cognito_account = () => {
      Sut.Verify<IAmazonCognitoIdentityProvider>(p => p.AdminCreateUserAsync(Argument.IsAny<AdminCreateUserRequest>(), Argument.IsAny<CancellationToken>()), Times.Once());
    };

  }
}
