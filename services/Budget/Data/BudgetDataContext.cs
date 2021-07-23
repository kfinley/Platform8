using Microsoft.EntityFrameworkCore;

using Platform8.Core.Data;

namespace Platform8.Budget.Data {

  public class BudgetDataContext: DataContext<BudgetDataContext> {
      public BudgetDataContext(DbContextOptions<BudgetDataContext> options): base(options) { }

      public DbSet<Models.Budget> Budgets { get; set; }
      public DbSet<Models.Category> Categories { get; set; }      
  }
}
