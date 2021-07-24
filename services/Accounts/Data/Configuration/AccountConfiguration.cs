using Microsoft.EntityFrameworkCore.Metadata.Builders;

using Platform8.Core.Data;

namespace Platform8.Accounts.Data
{
  public class AccountConfiguration : EntityTypeConfiguration<Models.Account>
  {
    public override void Configure(EntityTypeBuilder<Models.Account> builder)
    {
      base.ConfigureEntityTable(builder);
    }
  }
}
