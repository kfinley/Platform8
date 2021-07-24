using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

using AutoMapper;
using MediatR;

using Platform8.Core;
using Platform8.Core.Data;
using Platform8.Budgets.Data;
using Platform8.Budgets.Models;

namespace Platform8.Budgets.Commands
{
  public class GetBudgetHandler : IRequestHandler<GetBudgetRequest, GetBudgetResponse>
  {
    private readonly IAsyncRepository<BudgetsDataContext, Data.Budget> budgets;
    private readonly IMapper mapper;

    public GetBudgetHandler(IAsyncRepository<BudgetsDataContext, Data.Budget> budgets, IMapper mapper)
    {
      this.budgets = budgets;
      this.mapper = mapper;
    }

    public async Task<GetBudgetResponse> Handle(GetBudgetRequest request, CancellationToken cancellationToken)
    {
      var budget = await this.budgets.FirstOrDefaultAsync(b => b.OwnerId == request.OwnerId, b => b.Categories);

      return new GetBudgetResponse {
        Budget = this.mapper.Map<Models.Budget>(budget)
      };
    }
  }
}
