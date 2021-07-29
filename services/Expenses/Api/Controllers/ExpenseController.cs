using System;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using MediatR;

using Platform8.Expenses.Models;

namespace Platform8.Expenses.Api.Controllers {
  [Authorize]
  [ApiController]
  public class ExpenseController : ControllerBase {


    private readonly ILogger<ExpenseController> logger;
    private readonly IMediator mediator;

    public ExpenseController(IMediator mediator, ILogger<ExpenseController> logger)
    {
      this.mediator = mediator;
      this.logger = logger;
    }

    [HttpPost]
    [Route("/expenses/v1")]
    public async Task<IActionResult> Expense(AddExpenseRequest request) {
      request.OwnerId = new Guid(this.User.Claims.FirstOrDefault(c => c.Type == "username")?.Value);
      return Ok(await mediator.Send(request));
    }

  }
}
