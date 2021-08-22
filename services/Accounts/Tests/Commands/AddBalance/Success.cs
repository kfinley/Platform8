using System;
using System.Threading;

using Machine.Specifications;
using Machine.Specifications.Model;

using FluentAssertions;
using Xunit;
using Moq;
using It = Machine.Specifications.It;
using Argument = Moq.It;

using Platform8.Tests.Common.Specs;
using Platform8.Tests.Common;
using Platform8.Accounts.Commands;
using Platform8.Accounts.Models;
using Platform8.Core.Data;
using Platform8.Accounts.Data;
using Platform8.Core;

namespace Platform8.Accounts.Tests
{
  [Subject("Add Account Balance")]
  public class When_AddBalance_Requested : SpecBase
  {
    public When_AddBalance_Requested(MSpecFixture fixture)
      : base(fixture)
    {
      Setup(this, context, of);
    }

    static Sut<AddBalanceHandler> Sut = new Sut<AddBalanceHandler, AddBalanceResponse>();

    static AddBalanceRequest Request;
    static AddBalanceResponse Result;

    Establish context = () =>
    {
      var testAccount = new Models.Account
      {
        Id = Guid.NewGuid(),
        Name = "Test Account",
        AccountType = "Checking",
        FinancialInstitution = "Bank",
        DateCreated = DateTime.Parse("2021-01-02"),
        Status = EntityStatus.Active,
        OwnerId = Guid.NewGuid(),
        StartingBalance = 234.23m
      };

      Request = new AddBalanceRequest
      {
        AccountId = testAccount.Id,
        Amount = 234.43m,
        Date = DateTime.Parse("2021-02-15")
      };

      Sut.SetupAsync<IAsyncRepository<AccountsDataContext>, Models.Account>(r => r.GetAsync<Models.Account>(Argument.Is<Guid>(x => x == testAccount.Id), Argument.IsAny<CancellationToken>()))
        .ReturnsAsync(testAccount);

      Sut.SetupAsync<IAsyncRepository<AccountsDataContext>, Models.Balance>(r => r.SaveAsync(Argument.IsAny<Models.Balance>(), Argument.IsAny<CancellationToken>()))
        .ReturnsAsync(new Models.Balance
        {
          Id = Guid.NewGuid(),
          Date = Request.Date,
          Amount = Request.Amount,
          Account = testAccount,
          DateCreated = SystemTime.UtcNow,
          Status = EntityStatus.Active
        });
    };

    Because of = async () => Result = await Sut.Target.Handle(Request, new CancellationTokenSource().Token);

    [Fact]
    public void It_should_return_a_successful_result() => should_return_a_successful_result();
    It should_return_a_successful_result = () =>
    {
      Result.Should().NotBeNull();
      Result.Success.Should().BeTrue();
    };


    [Fact]
    public void It_should_save_a_new_Balance_to_the_Data_Repository() => should_save_a_new_Balance_to_the_Data_Repository();
    It should_save_a_new_Balance_to_the_Data_Repository = () =>
    {
      Sut.Verify<IAsyncRepository<AccountsDataContext>>(p => p.SaveAsync(Argument.IsAny<Models.Balance>(), Argument.IsAny<CancellationToken>()), Times.Once());
    };

    [Fact]
    public void It_should_return_the_id_of_the_added_balance() => should_return_the_id_of_the_added_balance();
    It should_return_the_id_of_the_added_balance = () =>
    {
      Result.Id.Should().NotBeEmpty();
    };
  }
}
