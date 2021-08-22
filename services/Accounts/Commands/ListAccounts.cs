using System.Linq;
using System.Threading;
using System.Threading.Tasks;

using MediatR;

using Platform8.Core.Data;
using Platform8.Accounts.Data;
using Platform8.Accounts.Models;

namespace Platform8.Accounts.Commands {
  public class ListAccountsHandler : IRequestHandler<ListAccountsRequest, ListAccountsResponse> {
    private readonly IAsyncRepository<AccountsDataContext> repository;

    public ListAccountsHandler(IAsyncRepository<AccountsDataContext> repository) {
      this.repository = repository;
    }

    public async Task<ListAccountsResponse> Handle(ListAccountsRequest request, CancellationToken cancellationToken) {
      var querySpec = new QuerySpec<Account, AccountInList> {
        Where = (a => a.OwnerId == request.OwnerId),
        OrderBy = (a => a.Name),
        Skip = request.Page.HasValue ? request.Page - 1 : 0,
        Take = request.PageSize ?? 10,
        Selector = a => new AccountInList {
          Id = a.Id,
          Name = a.Name,
          Balance = a.Balances.OrderByDescending(b => b.Date).FirstOrDefault()?.Amount ?? a.StartingBalance
        }
      };

      querySpec.AddInclude(a => a.Balances);

      var list = await this.repository.ListAsync(querySpec);

      return new ListAccountsResponse(list);
    }
  }
}
