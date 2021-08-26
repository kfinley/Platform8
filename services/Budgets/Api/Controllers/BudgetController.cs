using System;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using MediatR;

using Platform8.Budgets.Models;
using Platform8.WebApi;

namespace Platform8.Budgets.Api.Controllers {
  [Authorize]
  [ApiController]
  public class BudgetController : ApiControllerBase {

    public BudgetController(IMediator mediator) : base(mediator) { }

    [HttpGet]
    [Route("/budgets/v1")]
    public async Task<IActionResult> Budget() {
      var request = new GetBudgetRequest {
        OwnerId = new Guid(this.User.Claims.FirstOrDefault(c => c.Type == "username")?.Value)
      };
      return Ok(await base.Send(request));
    }
  }
}
