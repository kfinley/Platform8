using System.Linq;
using System.Threading;
using System.Threading.Tasks;

using MediatR;

using Platform8.Core.Data;
using Platform8.FinancialAccounts.Data;
using Platform8.FinancialAccounts.Models;

namespace Platform8.FinancialAccounts.Commands
{
  public class ListAccountsHandler : IRequestHandler<ListAccountsRequest, ListAccountsResponse>
  {
    private readonly IAsyncRepository<FinancialAccountsDataContext, Models.Account> repository;

    public ListAccountsHandler(IAsyncRepository<FinancialAccountsDataContext, Models.Account> repository)
    {
      this.repository = repository;
    }

    public async Task<ListAccountsResponse> Handle(ListAccountsRequest request, CancellationToken cancellationToken)
    {
      var querySpec = new QuerySpec<Account, AccountInList>
      {
        Where = (a => a.OwnerId == request.OwnerId),
        OrderBy = (a => a.Name),
        Skip = request.Page.HasValue ? request.Page - 1 : 0,
        Take = request.PageSize ?? 10,
        Selector = a => new AccountInList
        {
          Id = a.Id,
          Name = a.Name,
          Balance = a.Balances.OrderByDescending(b => b.Date).FirstOrDefault()?.Amount ?? a.StartingBalance
        }
      };

      querySpec.AddInclude(a => a.Balances);

      var list = await this.repository.ListAsync<AccountInList>(querySpec);

      return new ListAccountsResponse(list);
    }
  }
}
