using System;
using System.Threading;
using System.Threading.Tasks;

using MediatR;

using Platform8.FinancialAccounts.Models;

namespace Platform8.FinancialAccounts.Commands
{
  public class AddAccountHandler : IRequestHandler<AddAccountRequest, AddAccountResponse>
  {
    public async Task<AddAccountResponse> Handle(AddAccountRequest request, CancellationToken cancellationToken)
    {
      throw new NotImplementedException();
    }
  }
}
