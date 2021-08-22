using System.Threading;
using System.Threading.Tasks;

using AutoMapper;
using MediatR;

using Platform8.Core.Data;
using Platform8.Budgets.Data;
using Platform8.Budgets.Models;

namespace Platform8.Budgets.Commands {
  public class FindCategoriesByNameHandler : IRequestHandler<CategoryByNameRequest, CategoryByNameResponse> {
    private readonly IAsyncRepository<BudgetsDataContext> repository;
    private readonly IMapper mapper;

    public FindCategoriesByNameHandler(IAsyncRepository<BudgetsDataContext> repository, IMapper mapper) {
      this.repository = repository;
      this.mapper = mapper;
    }

    public async Task<CategoryByNameResponse> Handle(CategoryByNameRequest request, CancellationToken cancellationToken) {
      var querySpec = new QuerySpec<Data.Category, Models.Category> {
        Where = (c => c.Budget.OwnerId == request.OwnerId && c.Name.StartsWith(request.Name)),
        OrderBy = (c => c.Name),
        Take = 10,
        Selector = c => this.mapper.Map<Models.Category>(c)
      };
      querySpec.AddInclude(c => c.Budget);

      var list = await this.repository.ListAsync(querySpec);

      return new CategoryByNameResponse {
        Categories = list
      };
    }
  }
}
