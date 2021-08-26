
using System;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using MediatR;

using Platform8.Transactions.Models;
using Platform8.WebApi;

namespace Platform8.Transactions.Api.Controllers {

  [Authorize]
  [ApiController]
  public class TransactionsController : ApiControllerBase {

    public TransactionsController(IMediator mediator) : base(mediator) { }

    [HttpGet]
    [Route("/transactions/v1")]
    public async Task<IActionResult> Transactions([FromQuery] ListTransactionsRequest request) {
      request.OwnerId = new Guid(this.User.Claims.FirstOrDefault(c => c.Type == "username")?.Value);
      return Ok(await base.Send(request));
    }

    [HttpGet]
    [Route("/transactions/v1/unreviewed")]
    public async Task<IActionResult> UnreviewedTransactions([FromQuery] UnreviewedTransactionsRequest request) {
      request.OwnerId = new Guid(this.User.Claims.FirstOrDefault(c => c.Type == "username")?.Value);
      return Ok(await base.Send(request));
    }
  }
}
