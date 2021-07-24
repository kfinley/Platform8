using System;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using MediatR;

using Platform8.Accounts.Models;

namespace Platform8.Accounts.Api.Controllers
{

  [Authorize]
  [ApiController]
  public class AccountsController : ControllerBase
  {
    private readonly ILogger<AccountsController> logger;
    private readonly IMediator mediator;
    public AccountsController(IMediator mediator, ILogger<AccountsController> logger)
    {
      this.mediator = mediator;
      this.logger = logger;
    }

    [HttpPost]
    [Route("/accounts/v1/account")]
    public async Task<IActionResult> Account(AddAccountRequest request) {
      request.OwnerId = new Guid(this.User.Claims.FirstOrDefault(c => c.Type == "username")?.Value);
      return Ok(await mediator.Send(request));
    }

    [HttpGet]
    [Route("/accounts/v1")]
    public async Task<IActionResult> Accounts([FromQuery] ListAccountsRequest request) {
      request.OwnerId = new Guid(this.User.Claims.FirstOrDefault(c => c.Type == "username")?.Value);
      return new JsonResult(await mediator.Send(request));
    }
  }
}
