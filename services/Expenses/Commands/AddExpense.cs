using System.Threading;
using System.Threading.Tasks;

using Microsoft.Extensions.Logging;

using AutoMapper;
using MediatR;

using Platform8.Core.Data;
using Platform8.Expenses.Data;
using Platform8.Expenses.Models;

namespace Platform8.Expenses.Commands
{
  public class AddExpenseHandler : IRequestHandler<AddExpenseRequest, AddExpenseResponse>
  {

    private readonly ILogger<AddExpenseHandler> logger;
    private readonly IMapper mapper;
    private readonly IAsyncRepository<DataContext, Data.Expense> expenses;

    public AddExpenseHandler(
      IMapper mapper,
      ILogger<AddExpenseHandler> logger,
      IAsyncRepository<DataContext, Data.Expense> expenses
    )
    {
      this.mapper = mapper;
      this.logger = logger;
      this.expenses = expenses;
    }

    public async Task<AddExpenseResponse> Handle(AddExpenseRequest request, CancellationToken cancellationToken) {

      var expense = await this.expenses.SaveAsync(new Data.Expense {
        OwnerId = request.OwnerId,
        Description = request.Description,
        Amount = request.Amount,
        CategoryId = request.CategoryId,
        IsFullTransaction  = request.IsFullTransaction,
        TransactionId = request.TransactionId
      });

      return new AddExpenseResponse {
        Id = expense.Id,
        Success = true
      };
    }

  }
}
