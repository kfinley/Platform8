using System;

using MediatR;

namespace Platform8.Expenses.Models {
  public class Expense {
    public Guid Id { get; set; }
    public string Description { get; set; }
    public decimal Amount { get; set; }
    public Nullable<bool> IsFullTransaction { get; set; }
    public Nullable<Guid> TransactionId { get; set; }
    public Guid CategoryId { get; set; }
  }

  public class AddExpenseRequest : IRequest<AddExpenseResponse> {
    public Guid OwnerId { get; set; }
    public string Description { get; set; }
    public decimal Amount { get; set; }
    public Nullable<bool> IsFullTransaction { get; set; }
    public Nullable<Guid> TransactionId { get; set; }
    public Guid CategoryId { get; set; }

  }

  public class AddExpenseResponse {
    public Guid Id { get; set; }
    public string Errror { get; set; }
    public bool Success { get; set; }
  }
}
