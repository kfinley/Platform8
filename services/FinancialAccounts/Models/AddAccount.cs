using System;

using MediatR;

namespace Platform8.FinancialAccounts.Models
{
  public class AddAccountRequest : IRequest<AddAccountResponse>
  {
    public Guid? OwnerId { get; set; }
    public string Name { get; set; }
    public string FinancialInstitution { get; set; }
    public string AccountType { get; set; }
    public decimal StartingBalance { get; set; }
  }

  public class AddAccountResponse
  {
    public Guid Id { get; set; }
    public bool Success { get; set; }
  }
}
