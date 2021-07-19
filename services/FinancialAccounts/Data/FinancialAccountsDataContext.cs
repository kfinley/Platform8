using Microsoft.EntityFrameworkCore;

using Platform8.Core.Data;

namespace Platform8.FinancialAccounts.Data {

  public class FinancialAccountsDataContext: DataContext<FinancialAccountsDataContext> {
      public FinancialAccountsDataContext(DbContextOptions<FinancialAccountsDataContext> options): base(options) { }

      public DbSet<Models.Account> Accounts { get; set; }
      public DbSet<Models.Balance> Balances { get; set; }
  }
}
