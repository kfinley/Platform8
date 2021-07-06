using System.Threading.Tasks;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using MediatR;

using Platform8.FinancialAccounts.Models;

namespace Platform8.FinancialAccounts.Api.Controllers
{

  [Authorize]
  [ApiController]
  public class AccountController : ControllerBase
  {
    private readonly ILogger<AccountController> logger;
    private readonly IMediator mediator;
    public AccountController(IMediator mediator, ILogger<AccountController> logger)
    {
      this.mediator = mediator;
      this.logger = logger;
    }

    [HttpPost]
    [Route("/financial-accounts/v1/account")]
    public async Task<IActionResult> Account(AddAccountRequest request) => Ok(await mediator.Send(request));
  }
}
