using System;

using MediatR;

namespace Platform8.Accounts.Models
{
  public class AddBalanceRequest : IRequest<AddBalanceResponse>
  {
    public Guid UserId { get; set; }
    public Guid AccountId { get; set; }
    public DateTime Date { get; set; }
    public decimal Amount { get; set; }
  }

  public class AddBalanceResponse
  {
    public Guid Id { get; set; }
    public bool Success { get; set; }
  }
}
