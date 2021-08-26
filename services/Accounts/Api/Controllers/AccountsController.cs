using System;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using MediatR;

using Platform8.Accounts.Models;
using Platform8.WebApi;

namespace Platform8.Accounts.Api.Controllers {

  [Authorize]
  [ApiController]
  public class AccountsController : ApiControllerBase {

    public AccountsController(IMediator mediator)
      : base(mediator) {
    }

    [HttpPost]
    [Route("/accounts/v1/account")]
    public async Task<IActionResult> Account(AddAccountRequest request) {
      request.OwnerId = new Guid(this.User.Claims.FirstOrDefault(c => c.Type == "username")?.Value);
      return Ok(await base.Send(request));
    }

    [HttpGet]
    [Route("/accounts/v1")]
    public async Task<IActionResult> Accounts([FromQuery] ListAccountsRequest request) {
      request.OwnerId = new Guid(this.User.Claims.FirstOrDefault(c => c.Type == "username")?.Value);
      return new JsonResult(await base.Send(request));
    }
  }
}
