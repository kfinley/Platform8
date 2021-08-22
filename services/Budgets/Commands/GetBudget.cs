using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

using AutoMapper;
using MediatR;

using Platform8.Core.Data;
using Platform8.Budgets.Data;
using Platform8.Budgets.Models;

namespace Platform8.Budgets.Commands {
  public class GetBudgetHandler : IRequestHandler<GetBudgetRequest, GetBudgetResponse> {
    private readonly IAsyncRepository<BudgetsDataContext> repository;
    private readonly IMapper mapper;

    public GetBudgetHandler(IAsyncRepository<BudgetsDataContext> repository, IMapper mapper) {
      this.repository = repository;
      this.mapper = mapper;
    }

    public async Task<GetBudgetResponse> Handle(GetBudgetRequest request, CancellationToken cancellationToken) {
      var budget = await this.repository.FirstOrDefaultAsync<Data.Budget, IList<Data.Category>>(b => b.OwnerId == request.OwnerId, b => b.Categories);

      return new GetBudgetResponse {
        Budget = this.mapper.Map<Models.Budget>(budget)
      };
    }
  }
}
