using System;
using System.Threading;
using MediatR;

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

namespace Platform8.User.Tests {
  [Subject("User Registration")]
  public class When_Registration_Requested : SpecBase {
    public When_Registration_Requested(MSpecFixture fixture)
      : base(fixture) {
      Setup(this, context, of);
    }

    static Sut<RegistrationHandler> Sut = new Sut<RegistrationHandler, RegistrationResponse>();

    static RegistrationRequest Request;
    static RegistrationResponse Result;
    static string TempPassword = "This is a temporary p@ssw0rd";

    Establish context = () => {
      Request = new RegistrationRequest {
        FirstName = "Bob",
        LastName = "Jones",
        Email = "Bob@Jones.com"
      };

      Sut.SetupAsync<IMediator, CreateCognitoUserResponse>(m => m.Send(Argument.Is<CreateCognitoUserRequest>(r =>
          r.FirstName == Request.FirstName &&
          r.LastName == Request.LastName &&
          r.Email == Request.Email),
        Argument.IsAny<CancellationToken>()
      )).ReturnsAsync(new CreateCognitoUserResponse {
        Success = true,
        TempPassword = TempPassword,
        Email = Request.Email,
        UserId = Guid.NewGuid().ToString(),
      });

      Sut.SetupAsync<IMediator, SaveUserResponse>(m => m.Send(Argument.Is<SaveUserRequest>(r =>
          r.FirstName == Request.FirstName &&
          r.LastName == Request.LastName &&
          r.Email == Request.Email
      ), Argument.IsAny<CancellationToken>()
      )).ReturnsAsync(new SaveUserResponse {
        Success = true
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
        Sut.Verify<IMediator>(p => p.Send(Argument.IsAny<CreateCognitoUserRequest>(), Argument.IsAny<CancellationToken>()), Times.Once());
    };

    [Fact]
    public void It_should_create_a_new_User_in_the_Data_Store() => should_create_a_new_User_in_the_Data_Store();
    It should_create_a_new_User_in_the_Data_Store = () => {
        Sut.Verify<IMediator>(p => p.Send(Argument.IsAny<SaveUserRequest>(), Argument.IsAny<CancellationToken>()), Times.Once());
    };

    [Fact]
    public void It_should_publish_Send_Registration_Confirmation_message() => should_publish_Send_Registration_Confirmation_message();
    It should_publish_Send_Registration_Confirmation_message = () => {
        Sut.Verify<IMediator>(p => p.Publish(Argument.IsAny<SendRegistrationConfirmationRequest>(), Argument.IsAny<CancellationToken>()), Times.Once());
    };
  }
}
