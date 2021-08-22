using Microsoft.EntityFrameworkCore.Metadata.Builders;

using Platform8.Core.Data;

namespace Platform8.Budgets.Data {
  public class BudgetConfiguration : EntityTypeConfiguration<Budget> {
    public override void Configure(EntityTypeBuilder<Budget> builder) {
      base.ConfigureEntityTable(builder);
    }
  }
}
