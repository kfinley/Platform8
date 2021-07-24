using System.Threading;
using System.Threading.Tasks;

using Microsoft.Extensions.Logging;

using AutoMapper;
using MediatR;

using Platform8.Core;
using Platform8.Core.Data;
using Platform8.BudgetService.Data;
using Platform8.BudgetService.Models;

namespace Platform8.BudgetService.Commands
{
  public class AddCategoryHandler : IRequestHandler<AddCategoryRequest, AddCategoryResponse>
  {
    private readonly ILogger<AddCategoryHandler> logger;
    private readonly IAsyncRepository<BudgetDataContext, Data.Budget> budgets;
    private readonly IAsyncRepository<BudgetDataContext, Data.Category> categories;
    private readonly IMapper mapper;

    public AddCategoryHandler(
      IMapper mapper,
      ILogger<AddCategoryHandler> logger,
      IAsyncRepository<BudgetDataContext, Data.Budget> budgets,
      IAsyncRepository<BudgetDataContext, Data.Category> categories
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
