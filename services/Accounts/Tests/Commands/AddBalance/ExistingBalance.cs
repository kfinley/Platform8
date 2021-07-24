using System;
using System.Linq.Expressions;
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
  [Subject("Add Existing Account Balance")]
  public class When_AddBalance_Requested_with_existing_balance : SpecBase
  {
    public When_AddBalance_Requested_with_existing_balance(MSpecFixture fixture)
      : base(fixture)
    {
      Setup(this, context, of);
    }

    static Sut<AddBalanceHandler> Sut = new Sut<AddBalanceHandler, AddBalanceResponse>();

    static AddBalanceRequest Request;
    static AddBalanceResponse Result;

    Establish context = () =>
    {
      var testAccountId = Guid.NewGuid();
      var testBalance = new Models.Balance
      {
        Id = Guid.NewGuid(),
        Account = new Models.Account {
          Id = testAccountId,
          Name = "Bank"
        },
        Amount = 234.43m,
        Date = DateTime.Parse("2021-02-15"),
        Status = EntityStatus.Active
      };

      Request = new AddBalanceRequest
      {
        AccountId = testAccountId,
        Amount = 234.43m,
        Date = DateTime.Parse("2021-02-15")
      };

      Sut.SetupAsync<IAsyncRepository<AccountsDataContext, Models.Balance>, Models.Balance>(r =>
          r.FirstOrDefaultAsync(Argument.IsAny<Expression<Func<Models.Balance, bool>>>(), Argument.IsAny<CancellationToken>()))
        .ReturnsAsync(testBalance);
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
    public void It_should_not_save_the_Balance_to_the_Data_Repository() => should_not_save_the_Balance_to_the_Data_Repository();
    It should_not_save_the_Balance_to_the_Data_Repository = () =>
    {
      Sut.Verify<IAsyncRepository<AccountsDataContext, Models.Balance>>(p => p.SaveAsync(Argument.IsAny<Models.Balance>(), Argument.IsAny<CancellationToken>()), Times.Never());
    };

    [Fact]
    public void It_should_get_an_existing_Balance_from_the_Data_Repository() => should_get_an_existing_Balance_from_the_Data_Repository();
    It should_get_an_existing_Balance_from_the_Data_Repository = () =>
    {
      Sut.Verify<IAsyncRepository<AccountsDataContext, Models.Balance>>(p => p.FirstOrDefaultAsync(Argument.IsAny<Expression<Func<Models.Balance, bool>>>(), Argument.IsAny<CancellationToken>()), Times.Once());
    };

    [Fact]
    public void It_should_not_return_the_id_of_the_added_balance() => should_return_the_id_of_the_added_balance();
    It should_return_the_id_of_the_added_balance = () =>
    {
      Result.Id.Should().BeEmpty();
    };
  }
}
