using System.Threading;
using System.Threading.Tasks;

using Microsoft.Extensions.Logging;

using MediatR;

using Platform8.Core;
using Platform8.Core.Data;
using Platform8.Accounts.Data;
using Platform8.Accounts.Models;

namespace Platform8.Accounts.Commands
{
  public class AddBalanceHandler : IRequestHandler<AddBalanceRequest, AddBalanceResponse>
  {
    private readonly ILogger<AddBalanceHandler> logger;
    private readonly IAsyncRepository<AccountsDataContext, Models.Balance> balances;
    private readonly IAsyncRepository<AccountsDataContext, Models.Account> accounts;

    public AddBalanceHandler(IAsyncRepository<AccountsDataContext, Models.Balance> balances,
                              IAsyncRepository<AccountsDataContext, Models.Account> accounts,
                              ILogger<AddBalanceHandler> logger) {
      this.logger = logger;
      this.balances = balances;
      this.accounts = accounts;
    }

    public async Task<AddBalanceResponse> Handle(AddBalanceRequest request, CancellationToken cancellationToken)
    {

      this.logger.LogInformation($"Processing AddBalanceRequest for accountId: {request.AccountId}");

      if ((await this.balances.FirstOrDefaultAsync(b => b.Date == request.Date && b.Amount == request.Amount)).HasValue()) {
        this.logger.LogInformation($"Balance exists for accountId: {request.AccountId}");
      } else {
        var account = await this.accounts.GetAsync(request.AccountId);

        var balance = await this.balances.SaveAsync(new Models.Balance {
          Account = account,
          Date = request.Date,
          Amount = request.Amount
        });
        this.logger.LogInformation("Saved Balance");

        return new AddBalanceResponse {
          Id = balance.Id,
          Success = balance.HasValue()
        };
      }

      return new AddBalanceResponse {
        Success = true
      };
    }
  }
}
