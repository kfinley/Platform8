using Microsoft.EntityFrameworkCore.Metadata.Builders;

using Platform8.Core.Data;

namespace Platform8.Accounts.Data {
  public class BalanceConfiguration : EntityTypeConfiguration<Models.Balance> {
    public override void Configure(EntityTypeBuilder<Models.Balance> builder) {
      base.ConfigureEntityTable(builder);
    }
  }
}
