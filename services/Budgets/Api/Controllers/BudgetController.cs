using System;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using MediatR;

using Platform8.Budgets.Models;

namespace Platform8.Budgets.Api.Controllers
{
  [Authorize]
  [ApiController]
  public class BudgetController : ControllerBase
  {

    private readonly ILogger<BudgetController> logger;
    private readonly IMediator mediator;

    public BudgetController(IMediator mediator, ILogger<BudgetController> logger)
    {
      this.mediator = mediator;
      this.logger = logger;
    }

    [HttpGet]
    [Route("/budgets/v1")]
    public async Task<IActionResult> Budget() {
      var request = new GetBudgetRequest {
        OwnerId = new Guid(this.User.Claims.FirstOrDefault(c => c.Type == "username")?.Value)
      };
      return Ok(await mediator.Send(request));
    }
  }
}
