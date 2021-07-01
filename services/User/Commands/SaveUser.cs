using System.Threading;
using System.Threading.Tasks;

using MediatR;

using Platform8.Core;
using Platform8.Core.Data;
using Platform8.User.Models;
using Platform8.User.Data;

namespace Platform8.User.Commands
{
  public class SaveUserHandler : IRequestHandler<SaveUserRequest, SaveUserResponse>
  {

    private readonly IAsyncRepository<UserDataContext, Models.User> repository;

    public SaveUserHandler(IAsyncRepository<UserDataContext, Models.User> repository)
    {
      this.repository = repository;
    }

    public async Task<SaveUserResponse> Handle(SaveUserRequest request, CancellationToken cancellationToken)
    {
      var user = await this.repository.SaveAsync(new Models.User
      {
        Id = request.Id,
        FirstName = request.FirstName,
        LastName = request.LastName,
        Email = request.Email
      });

      return new SaveUserResponse
      {
        Success = user.HasValue()
      };
    }
  }
}
