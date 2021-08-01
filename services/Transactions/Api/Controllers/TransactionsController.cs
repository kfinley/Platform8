
using System;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using MediatR;

using Platform8.Transactions.Models;

namespace Platform8.Transactions.Api.Controllers
{

  [Authorize]
  [ApiController]
  public class TransactionsController : ControllerBase
  {
    private readonly ILogger<TransactionsController> logger;
    private readonly IMediator mediator;
    public TransactionsController(IMediator mediator, ILogger<TransactionsController> logger)
    {
      this.mediator = mediator;
      this.logger = logger;
    }

    [HttpGet]
    [Route("/transactions/v1")]
    public async Task<IActionResult> Transactions([FromQuery] ListTransactionsRequest request) {
      request.OwnerId = new Guid(this.User.Claims.FirstOrDefault(c => c.Type == "username")?.Value);
      return Ok(await mediator.Send(request));
    }

    [HttpGet]
    [Route("/transactions/v1/unreviewed")]
    public async Task<IActionResult> UnreviewedTransactions([FromQuery] UnreviewedTransactionsRequest request) {
      request.OwnerId = new Guid(this.User.Claims.FirstOrDefault(c => c.Type == "username")?.Value);
      return Ok(await mediator.Send(request));
    }
  }
}
