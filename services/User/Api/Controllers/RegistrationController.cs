using System.Threading.Tasks;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using MediatR;

using Platform8.User.Models;
using Platform8.WebApi;

namespace Platform8.User.Api.Controllers {
  [ApiController]
  [AllowAnonymous]

  public class RegistrationController : ApiControllerBase {

    public RegistrationController(IMediator mediator) : base(mediator) { }

    [HttpPost]
    [Route("/user/v1/register")]
    public async Task<IActionResult> Register(RegistrationRequest request)
      => Ok(await base.Send(request));
  }
}

