using System.Threading;
using System.Threading.Tasks;

using Microsoft.Extensions.Logging;

using AutoMapper;
using MediatR;
using EFQuerySpecs;

using Platform8.Core.Data;
using Platform8.Budgets.Data;
using Platform8.Budgets.Models;

namespace Platform8.Budgets.Commands {
  public class AddCategoryHandler : IRequestHandler<AddCategoryRequest, AddCategoryResponse> {
    private readonly ILogger<AddCategoryHandler> logger;
    private readonly IAsyncRepository<BudgetsDataContext, IEntity> repository;
    private readonly IMapper mapper;

    public AddCategoryHandler(
      IMapper mapper,
      ILogger<AddCategoryHandler> logger,
      IAsyncRepository<BudgetsDataContext, IEntity> repository
      ) {
      this.mapper = mapper;
      this.logger = logger;
      this.repository = repository;
    }

    public async Task<AddCategoryResponse> Handle(AddCategoryRequest request, CancellationToken cancellationToken) {
      var budget = await this.repository.FirstOrDefaultAsync<Data.Budget>(b => b.OwnerId == request.OwnerId);

      if (budget == null) {
        budget = await this.repository.SaveAsync(new Data.Budget {
          OwnerId = request.OwnerId,
        });
      }

      var category = await this.repository.SaveAsync(new Data.Category {
        Name = request.Name,
        Allocation = request.Allocation,
        Budget = budget
      });

      return new AddCategoryResponse {
        Id = category.Id,
        BudgetId = budget.Id,
        Success = true
      };
    }
  }
}
