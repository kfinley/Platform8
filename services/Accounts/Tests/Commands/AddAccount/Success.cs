using System;
using System.Threading;

using Machine.Specifications;
using Machine.Specifications.Model;

using FluentAssertions;
using Xunit;
using Moq;
using It = Machine.Specifications.It;
using Argument = Moq.It;
using EFQuerySpecs;

using Platform8.Tests.Common.Specs;
using Platform8.Tests.Common;
using Platform8.Accounts.Commands;
using Platform8.Accounts.Models;
using Platform8.Core.Data;
using Platform8.Accounts.Data;
using Platform8.Core;

namespace Platform8.Accounts.Tests {
  [Subject("Add Account")]
  public class When_AddAccount_Requested : SpecBase {
    public When_AddAccount_Requested(MSpecFixture fixture)
      : base(fixture) {
      Setup(this, context, of);
    }

    static Sut<AddAccountHandler> Sut = new Sut<AddAccountHandler, AddAccountResponse>();

    static AddAccountRequest Request;
    static AddAccountResponse Result;

    Establish context = () => {
      Request = new AddAccountRequest {
        OwnerId = Guid.NewGuid(),
        Name = "Test",
        FinancialInstitution = "Chase",
        AccountType = "Checking",
        StartingBalance = 234.54m
      };

      var newAccountId = Guid.NewGuid();

      Sut.SetupAsync<IAsyncRepository<AccountsDataContext, IEntity>, Models.Account>(r => r.SaveAsync(Argument.IsAny<Models.Account>(), Argument.IsAny<CancellationToken>()))
        .ReturnsAsync(new Models.Account {
          Id = newAccountId,
          Name = Request.Name,
          AccountType = Request.AccountType,
          FinancialInstitution = Request.FinancialInstitution,
          StartingBalance = Request.StartingBalance.Value,
          DateCreated = SystemTime.UtcNow,
          Status = EntityStatus.Active
        });

      Sut.SetupAsync<IAsyncRepository<AccountsDataContext, IEntity>, Models.Balance>(r => r.SaveAsync(Argument.IsAny<Models.Balance>(), Argument.IsAny<CancellationToken>()))
        .ReturnsAsync(new Models.Balance {
          Id = Guid.NewGuid(),
          Account = Argument.Is<Account>(a => a.Id == newAccountId),
          Amount = Request.StartingBalance.Value,
          Date = SystemTime.UtcNow,
          DateCreated = SystemTime.UtcNow,
          Status = EntityStatus.Active
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
    public void It_should_save_a_new_Account_to_the_Data_Repository() => should_save_a_new_User_to_the_Data_Repository();
    It should_save_a_new_User_to_the_Data_Repository = () => {
      Sut.Verify<IAsyncRepository<AccountsDataContext, IEntity>>(p => p.SaveAsync(Argument.IsAny<Models.Account>(), Argument.IsAny<CancellationToken>()), Times.Once());
    };

    [Fact]
    public void It_should_return_the_id_of_the_added_account() => should_return_the_id_of_the_added_account();
    It should_return_the_id_of_the_added_account = () => {
      Result.Id.Should().NotBeEmpty();
    };

    [Fact]
    public void It_should_save_a_new_Balance_to_the_Data_Repository() => should_save_a_new_Balance_to_the_Data_Repository();
    It should_save_a_new_Balance_to_the_Data_Repository = () => {
      Sut.Verify<IAsyncRepository<AccountsDataContext, IEntity>>(p => p.SaveAsync(Argument.IsAny<Models.Balance>(), Argument.IsAny<CancellationToken>()), Times.Once());
    };
  }
}
