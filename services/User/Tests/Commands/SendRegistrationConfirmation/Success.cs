using System;
using System.Net;
using System.Threading;

using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;

using Machine.Specifications;
using Machine.Specifications.Model;

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
  public class When_SendRegistrationConfirmation_Requested : SpecBase {
    public When_SendRegistrationConfirmation_Requested(MSpecFixture fixture)
      : base(fixture) {
      Setup(this, context, of);
    }

    static Sut<SendRegistrationConfirmationHandler> Sut = new Sut<SendRegistrationConfirmationHandler>();

    static SendRegistrationConfirmationRequest Request;

    Establish context = () => {
      Request = new SendRegistrationConfirmationRequest {
        UserId = Guid.NewGuid(),
        FirstName = "Bob",
        LastName = "Jones",
        Email = "Bob@Jones.com"
      };

      Sut.Setup<IOptions<SiteOptions>, SiteOptions>(o => o.Value).Returns(new SiteOptions {
        Url = "http://test.domain"
      });

      Sut.Setup<IOptions<ContactOptions>, ContactOptions>(o => o.Value).Returns(new ContactOptions {
        SenderEmail = "no-reply@email.com"
      });

      Sut.SetupAsync<IAmazonSimpleEmailService, SendTemplatedEmailResponse>(p =>
          p.SendTemplatedEmailAsync(Argument.IsAny<SendTemplatedEmailRequest>(), Argument.IsAny<CancellationToken>()))
        .ReturnsAsync(
        new SendTemplatedEmailResponse() {
          HttpStatusCode = HttpStatusCode.OK,
        });

      Sut.Setup<IOptions<CognitoOptions>, CognitoOptions>(o => o.Value).Returns(new CognitoOptions {
        UserPoolId = "test-user-pool-id"
      });

    };

    Because of = async () => await Sut.Target.Handle(Request, new CancellationTokenSource().Token);

    [Fact]
    public void It_should_send_confirm_registration_email() => should_send_confirm_registration_email();
    It should_send_confirm_registration_email = () => {
      Sut.Verify<IAmazonSimpleEmailService>(p => p.SendTemplatedEmailAsync(Argument.IsAny<SendTemplatedEmailRequest>(), Argument.IsAny<CancellationToken>()), Times.Once());
    };

  }
}
