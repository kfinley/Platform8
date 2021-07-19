using System.Threading;
using System.Threading.Tasks;

using MediatR;

using Platform8.Core;
using Platform8.Core.Data;
using Platform8.FinancialAccounts.Data;
using Platform8.FinancialAccounts.Models;

namespace Platform8.FinancialAccounts.Commands
{
  public class AddAccountHandler : IRequestHandler<AddAccountRequest, AddAccountResponse>
  {
    private readonly IAsyncRepository<FinancialAccountsDataContext, Models.Account> accounts;
    private readonly IAsyncRepository<FinancialAccountsDataContext, Models.Balance> balances;

    public AddAccountHandler(
      IAsyncRepository<FinancialAccountsDataContext, Models.Account> accounts,
      IAsyncRepository<FinancialAccountsDataContext, Models.Balance> balances
      ) {
      this.accounts = accounts;
      this.balances = balances;
    }

    public async Task<AddAccountResponse> Handle(AddAccountRequest request, CancellationToken cancellationToken)
    {
      var account = await this.accounts.SaveAsync(new Models.Account {
        OwnerId = request.OwnerId.Value,
        Name = request.Name,
        FinancialInstitution = request.FinancialInstitution,
        AccountType = request.AccountType
      });

      var balance = await this.balances.SaveAsync(new Models.Balance {
        Account = account,
        Date = SystemTime.UtcNow,
        Amount = request.StartingBalance
      });

      return new AddAccountResponse {
        Id = account.Id,
        Success = account.HasValue() && balance.HasValue()
      };
    }
  }
}
