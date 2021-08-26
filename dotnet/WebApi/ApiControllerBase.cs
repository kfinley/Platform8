using System.Threading.Tasks;
using System.Threading;

using Microsoft.AspNetCore.Mvc;

using MediatR;

namespace Platform8.WebApi {

  public abstract class ApiControllerBase : ControllerBase {

    private readonly IMediator mediator;

    public ApiControllerBase(IMediator mediator) {
      this.mediator = mediator;
    }

    [NonAction]
    public Task<TResponse> Send<TResponse>(IRequest<TResponse> request, CancellationToken cancellationToken = default) {
      return this.mediator.Send(request, cancellationToken);
    }

    [NonAction]
    public Task<object> Send(object request, CancellationToken cancellationToken = default) {
      return this.mediator.Send(request, cancellationToken);
    }

    [NonAction]
    public Task Publish(object notification, CancellationToken cancellationToken = default) {
      return this.mediator.Publish(notification, cancellationToken);
    }

    [NonAction]
    public Task Publish<TNotification>(TNotification notification, CancellationToken cancellationToken = default) where TNotification : INotification {
      return this.mediator.Publish(notification, cancellationToken);
    }
  }
}
