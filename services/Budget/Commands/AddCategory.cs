using System.Threading;
using System.Threading.Tasks;

using Microsoft.Extensions.Logging;

using MediatR;

using Platform8.Core;
using Platform8.Core.Data;
using Platform8.Budget.Data;
using Platform8.Budget.Models;

namespace Platform8.Budget.Commands
{
  public class AddCategoryHandler : IRequestHandler<AddCategoryRequest, AddCategoryResponse>
  {
    private readonly ILogger<AddCategoryHandler> logger;
    private readonly IAsyncRepository<BudgetDataContext, Models.Budget> budgets;
    private readonly IAsyncRepository<BudgetDataContext, Models.Category> categories;

    public AddCategoryHandler(
      ILogger<AddCategoryHandler> logger,
      IAsyncRepository<BudgetDataContext, Models.Budget> budgets,
      IAsyncRepository<BudgetDataContext, Models.Category> categories
      )
    {
      this.logger = logger;
      this.budgets = budgets;
      this.categories = categories;
    }

    public async Task<AddCategoryResponse> Handle(AddCategoryRequest request, CancellationToken cancellationToken)
    {
      var budget = await this.budgets.FirstOrDefaultAsync(b => b.OwnerId == request.OwnerId);

      if (budget == null) {
        budget = await this.budgets.SaveAsync(new Models.Budget {
          OwnerId = request.OwnerId,
        });
      }

      var category = await this.categories.SaveAsync(new Models.Category {
        Name = request.Name,
        Allocation = request.Allocation,
        Budget = budget
      });

      return new AddCategoryResponse
      {
        Id = category.Id,
        Success = true
      };
    }
  }
}
