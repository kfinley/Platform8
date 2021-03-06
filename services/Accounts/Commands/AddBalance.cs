using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

using Microsoft.Extensions.Logging;

using MediatR;
using EFQuerySpecs;

using Platform8.Aws.Commands;
using Platform8.Core;
using Platform8.Core.Data;
using Platform8.Accounts.Data;
using Platform8.Accounts.Models;

namespace Platform8.Accounts.Commands {
  public class AddBalanceHandler : IRequestHandler<AddBalanceRequest, AddBalanceResponse> {
    private readonly ILogger<AddBalanceHandler> logger;
    private readonly IMediator mediator;
    private readonly IAsyncRepository<AccountsDataContext, IEntity> repository;

    public AddBalanceHandler(IAsyncRepository<AccountsDataContext, IEntity> repository,
                              IMediator mediator,
                              ILogger<AddBalanceHandler> logger) {
      this.logger = logger;
      this.mediator = mediator;
      this.repository = repository;
    }

    public async Task<AddBalanceResponse> Handle(AddBalanceRequest request, CancellationToken cancellationToken) {

      this.logger.LogInformation($"Processing AddBalanceRequest for accountId: {request.AccountId}");

      if ((await this.repository.FirstOrDefaultAsync<Models.Balance>(b => b.Date >= request.Date && b.Amount == request.Amount && b.Account.Id == request.AccountId)).HasValue()) {
        this.logger.LogInformation($"Balance exists for accountId: {request.AccountId}");
      } else {
        var account = await this.repository.GetAsync<Models.Account>(request.AccountId);

        var balance = await this.repository.SaveAsync(new Models.Balance {
          Account = account,
          Date = request.Date,
          Amount = request.Amount
        });

        await this.mediator.Publish(new PublishMessageRequest {
          Topic = "AccountBalanceAddedTopic",
          Subject = "Accounts-NewBalance",
          // To avoid dealing with mapping and setting naming option to camel case
          // just new up the message with camel casing.
          Message = JsonSerializer.Serialize(new {
            userId = request.UserId,
            accountId = account.Id,
            date = request.Date,
            amount = request.Amount
          })
        });

        this.logger.LogInformation("Saved Balance");

        return new AddBalanceResponse {
          Id = balance.Id,
          Success = balance.HasValue()
        };
      }

      return new AddBalanceResponse {
        Success = true
      };
    }
  }
}
