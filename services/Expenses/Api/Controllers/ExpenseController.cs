using System;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using MediatR;

using Platform8.Expenses.Models;
using Platform8.WebApi;

namespace Platform8.Expenses.Api.Controllers {
  [Authorize]
  [ApiController]
  public class ExpenseController : ApiControllerBase {

    public ExpenseController(IMediator mediator) : base(mediator) { }

    [HttpPost]
    [Route("/expenses/v1")]
    public async Task<IActionResult> Expense(AddExpenseRequest request) {
      request.OwnerId = new Guid(this.User.Claims.FirstOrDefault(c => c.Type == "username")?.Value);
      return Ok(await base.Send(request));
    }
    
    [HttpGet]
    [Route("/expenses/v1")]
    public async Task<IActionResult> Expenses([FromQuery] ListExpensesRequest request) {
      request.OwnerId = new Guid(this.User.Claims.FirstOrDefault(c => c.Type == "username")?.Value);
      return Ok(await base.Send(request));
    }
  }
}
