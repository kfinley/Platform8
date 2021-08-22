using System;
using System.Collections.Generic;
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

namespace Platform8.Accounts.Tests {
  [Subject("List Accounts")]
  public class When_ListAccounts_Requested : SpecBase {
    public When_ListAccounts_Requested(MSpecFixture fixture)
      : base(fixture) {
      Setup(this, context, of);
    }

    static Sut<ListAccountsHandler> Sut = new Sut<ListAccountsHandler, ListAccountsResponse>();

    static ListAccountsRequest Request;
    static ListAccountsResponse Result;

    Establish context = () => {
      Request = new ListAccountsRequest();

      Sut.SetupAsync<IAsyncRepository<AccountsDataContext>, IReadOnlyList<Models.AccountInList>>(r
        => r.ListAsync<Models.Account, AccountInList>(
            Argument.IsAny<IQuerySpec<Models.Account, Models.AccountInList>>(),
            Argument.IsAny<CancellationToken>())
        )
        .ReturnsAsync(new List<Models.AccountInList>() {
          new AccountInList
          {
            Id = Guid.NewGuid(),
            Name = "Checking",
            Balance = 2235.54m,
          },
          new AccountInList {
            Id = Guid.NewGuid(),
            Name = "Savings",
            Balance = 23235.54m,
          }
        }.AsReadOnly());
    };

    Because of = async () => Result = await Sut.Target.Handle(Request, new CancellationTokenSource().Token);

    It should_return_a_successful_result = () => {
      Result.Should().NotBeNull();
    };

    [Fact]
    public void It_should_return_a_successful_result() =>
        should_return_a_successful_result();

    It should_return_a_list_of_accounts = () => {
      Result.Count.Should().Be(2);
    };

    [Fact]
    public void It_should_return_a_list_of_accounts() =>
        should_return_a_list_of_accounts();
  }
}
