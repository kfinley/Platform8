using Microsoft.EntityFrameworkCore.Metadata.Builders;

using Platform8.Core.Data;

namespace Platform8.Budget.Data
{
  public class BudgetConfiguration : EntityTypeConfiguration<Models.Budget>
  {
    public override void Configure(EntityTypeBuilder<Models.Budget> builder)
    {
      base.ConfigureEntityTable(builder);
    }
  }
}
