using System.Threading;
using System.Threading.Tasks;

using MediatR;
using EFQuerySpecs;

using Platform8.Core;
using Platform8.Core.Data;
using Platform8.Accounts.Data;
using Platform8.Accounts.Models;

namespace Platform8.Accounts.Commands {
  public class AddAccountHandler : IRequestHandler<AddAccountRequest, AddAccountResponse> {
    private readonly IAsyncRepository<AccountsDataContext, IEntity> repository;

    public AddAccountHandler(
      IAsyncRepository<AccountsDataContext, IEntity> repository
      ) {
      this.repository = repository;
    }

    public async Task<AddAccountResponse> Handle(AddAccountRequest request, CancellationToken cancellationToken) {
      var account = await this.repository.SaveAsync(new Models.Account {
        OwnerId = request.OwnerId.Value,
        Name = request.Name,
        FinancialInstitution = request.FinancialInstitution,
        AccountType = request.AccountType
      });

      if (request.StartingBalance.HasValue) {
        var balance = await this.repository.SaveAsync(new Models.Balance {
          Account = account,
          Amount = request.StartingBalance.Value
        });
      }

      return new AddAccountResponse {
        Id = account.Id,
        Success = account.HasValue()
      };
    }
  }
}
