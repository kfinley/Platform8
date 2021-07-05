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
using Platform8.FinancialAccounts.Commands;
using Platform8.FinancialAccounts.Models;
using Microsoft.Extensions.Options;

namespace Platform8.FinancialAccounts.Tests
{
  [Subject("Add Financial Account")]
  public class When_AddAccount_Requested : SpecBase
  {
    public When_AddAccount_Requested(MSpecFixture fixture)
      : base(fixture)
    {
      Setup(this, context, of);
    }

    static Sut<AddAccountHandler> Sut = new Sut<AddAccountHandler, AddAccountResponse>();

    static AddAccountRequest Request;
    static AddAccountResponse Result;

    Establish context = () =>
    {
      Request = new AddAccountRequest
      {
        Name = "Test",
        FinancialInstitution = "Chase",
        AccountType = "Checking",
        StartingBalance = 234.54m
      };
    };

    Because of = async () => Result = await Sut.Target.Handle(Request, new CancellationTokenSource().Token);

    It should_return_a_successful_result = () =>
    {
      Result.Should().NotBeNull();
      Result.Success.Should().BeTrue();
    };

    [Fact]
    public void It_should_return_a_successful_result() =>
        should_return_a_successful_result();

  }
}
