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
  public class CategoryController : ApiControllerBase {


    public CategoryController(IMediator mediator) : base(mediator) { }

    [HttpPost]
    [Route("/budgets/v1/category")]
    public async Task<IActionResult> Category(AddCategoryRequest request) {
      request.OwnerId = new Guid(this.User.Claims.FirstOrDefault(c => c.Type == "username")?.Value);
      return Ok(await base.Send(request));
    }

    [HttpGet]
    [Route("/budgets/v1/category")]
    public async Task<IActionResult> Category([FromQuery] CategoryByNameRequest request) {
      request.OwnerId = new Guid(this.User.Claims.FirstOrDefault(c => c.Type == "username")?.Value);
      return Ok(await base.Send(request));
    }
  }
}
