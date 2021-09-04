using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using EFQuerySpecs;
using MediatR;
using Platform8.Core.Data;
using Platform8.Expenses.Data;
using Platform8.Expenses.Models;

namespace Platform8.Expenses.Commands {
  public class ListExpensesHandler : IRequestHandler<ListExpensesRequest, ListExpensesResponse> {


    private readonly IMapper mapper;
    private readonly IAsyncRepository<DataContext, IEntity> repository;
    public ListExpensesHandler(
      IMapper mapper,
      IAsyncRepository<DataContext, IEntity> repository
    ) {
      this.mapper = mapper;
      this.repository = repository;
    }

    public async Task<ListExpensesResponse> Handle(ListExpensesRequest request, CancellationToken cancellationToken) {
      var querySpec = new QuerySpec<Data.Expense, Models.Expense> {
        Where = (e => e.OwnerId == request.OwnerId),
        // OrderBy = (e => e.TransactionDate),
        Skip = request.Page.HasValue ? request.Page - 1 : 0,
        Take = request.PageSize ?? 10,
        Selector = e => this.mapper.Map<Models.Expense>(e),
      };
      var list = await this.repository.ListAsync(querySpec);

      return new ListExpensesResponse(list);
    }
  }
}
