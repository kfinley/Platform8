using Platform8.Core.Data;

namespace Platform8.FinancialAccounts.Models
{
  public class Account : BaseEntity
  {
    public string Name { get; set; }
    public string FinancialInstitution { get; set; }
    public string AccountType { get; set; }
    public decimal StartingBalance { get; set; }
  }
}
