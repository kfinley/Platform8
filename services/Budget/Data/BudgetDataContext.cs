using Microsoft.EntityFrameworkCore;

using Platform8.Core.Data;

namespace Platform8.BudgetService.Data {

  public class BudgetDataContext: DataContext<BudgetDataContext> {
      public BudgetDataContext(DbContextOptions<BudgetDataContext> options): base(options) { }

      public DbSet<Budget> Budgets { get; set; }
      public DbSet<Category> Categories { get; set; }      
  }
}
