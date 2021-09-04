using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

using Microsoft.Extensions.Logging;

using AutoMapper;
using MediatR;
using EFQuerySpecs;

using Platform8.Aws.Commands;
using Platform8.Core.Data;
using Platform8.Expenses.Data;
using Platform8.Expenses.Models;

namespace Platform8.Expenses.Commands {
  public class AddExpenseHandler : IRequestHandler<AddExpenseRequest, AddExpenseResponse> {
    private readonly IMediator mediator;
    private readonly ILogger<AddExpenseHandler> logger;
    private readonly IMapper mapper;
    private readonly IAsyncRepository<DataContext, IEntity> repository;

    public AddExpenseHandler(
      IMediator mediator,
      IMapper mapper,
      ILogger<AddExpenseHandler> logger,
      IAsyncRepository<DataContext, IEntity> repository
    ) {
      this.mediator = mediator;
      this.mapper = mapper;
      this.logger = logger;
      this.repository = repository;
    }

    public async Task<AddExpenseResponse> Handle(AddExpenseRequest request, CancellationToken cancellationToken) {

      var expense = await this.repository.SaveAsync(new Data.Expense {
        OwnerId = request.OwnerId,
        Description = request.Description,
        Amount = request.Amount,
        CategoryId = request.CategoryId,
        IsFullTransaction = request.IsFullTransaction,
        TransactionId = request.TransactionId
      });

      await this.mediator.Publish(new PublishMessageRequest {
        Topic = "ExpenseAddedTopic",
        // To avoid dealing with mapping and setting naming option to camel case
        // just new up the message with camel casing.
        Message = JsonSerializer.Serialize(new {
          ownerId = request.OwnerId,
          expenseId = expense.Id,
          transactionId = request.TransactionId,
          amount = request.Amount,
          categoryId = request.CategoryId
        })
      });

      return new AddExpenseResponse {
        Id = expense.Id,
        Success = true
      };
    }

  }
}
