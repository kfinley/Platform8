using System.Threading;
using System.Threading.Tasks;

using Microsoft.Extensions.Logging;

using AutoMapper;
using MediatR;

using Platform8.Core;
using Platform8.Core.Data;
using Platform8.Budgets.Data;
using Platform8.Budgets.Models;

namespace Platform8.Budgets.Commands
{
  public class AddCategoryHandler : IRequestHandler<AddCategoryRequest, AddCategoryResponse>
  {
    private readonly ILogger<AddCategoryHandler> logger;
    private readonly IAsyncRepository<BudgetsDataContext, Data.Budget> budgets;
    private readonly IAsyncRepository<BudgetsDataContext, Data.Category> categories;
    private readonly IMapper mapper;

    public AddCategoryHandler(
      IMapper mapper,
      ILogger<AddCategoryHandler> logger,
      IAsyncRepository<BudgetsDataContext, Data.Budget> budgets,
      IAsyncRepository<BudgetsDataContext, Data.Category> categories
      )
    {
      this.mapper = mapper;
      this.logger = logger;
      this.budgets = budgets;
      this.categories = categories;
    }

    public async Task<AddCategoryResponse> Handle(AddCategoryRequest request, CancellationToken cancellationToken)
    {
      var budget = await this.budgets.FirstOrDefaultAsync(b => b.OwnerId == request.OwnerId);

      if (budget == null) {
        budget = await this.budgets.SaveAsync(new Data.Budget {
          OwnerId = request.OwnerId,
        });
      }

      var category = await this.categories.SaveAsync(new Data.Category {
        Name = request.Name,
        Allocation = request.Allocation,
        Budget = budget
      });

      return new AddCategoryResponse
      {
        Id = category.Id,
        BudgetId = budget.Id,
        Success = true
      };
    }
  }
}
