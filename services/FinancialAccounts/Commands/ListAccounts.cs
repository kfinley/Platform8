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
      var querySpec = new QuerySpec<Account, AccountInList>()
      {
        Where = (a => a.OwnerId == request.OwnerId),
        OrderBy = (a => a.Name),
        Skip = request.Skip ?? 0,
        Take = request.Take ?? 10,
        Selector = a => new AccountInList
        {
          Id = a.Id,
          Name = a.Name,
          Balance = a.StartingBalance // TODO: For now just using starting balance before adding balance tracking bits.
        }
      };

      var list = await this.repository.ListAsync<AccountInList>(querySpec);

      return new ListAccountsResponse(list);
    }
  }
}
