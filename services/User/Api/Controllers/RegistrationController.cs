using System.Threading.Tasks;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using MediatR;

using Platform8.User.Models;

namespace Platform8.User.Api.Controllers
{
    [ApiController]
    [AllowAnonymous]

    public class RegistrationController : ControllerBase
    {
        private readonly ILogger<RegistrationController> logger;
        private readonly IMediator mediator;
        public RegistrationController(IMediator mediator, ILogger<RegistrationController> logger)
        {
            this.mediator = mediator;
            this.logger = logger;
        }

        [HttpPost]
        [Route("/user/v1/register")]
        public async Task<IActionResult> Register(RegistrationRequest request) => Ok(await mediator.Send(request));
    }
}

