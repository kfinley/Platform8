using System;

using Platform8.Core.Data;

namespace Platform8.Expenses.Data {
  public class Expense : BaseEntity {
    public Guid OwnerId { get; set; }
    public string Description { get; set; }
    public decimal Amount { get; set; }
    public Nullable<bool> IsFullTransaction { get; set; }
    public Nullable<Guid> TransactionId { get; set; }
    public Guid CategoryId { get; set; }
  }
}
