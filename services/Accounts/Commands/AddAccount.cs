using System.Threading;
using System.Threading.Tasks;

using MediatR;

using Platform8.Core;
using Platform8.Core.Data;
using Platform8.Accounts.Data;
using Platform8.Accounts.Models;

namespace Platform8.Accounts.Commands
{
  public class AddAccountHandler : IRequestHandler<AddAccountRequest, AddAccountResponse>
  {
    private readonly IAsyncRepository<AccountsDataContext, Models.Account> accounts;
    private readonly IAsyncRepository<AccountsDataContext, Models.Balance> balances;

    public AddAccountHandler(
      IAsyncRepository<AccountsDataContext, Models.Account> accounts,
      IAsyncRepository<AccountsDataContext, Models.Balance> balances
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
