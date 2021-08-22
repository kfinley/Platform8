using Microsoft.EntityFrameworkCore.Metadata.Builders;

using Platform8.Core.Data;

namespace Platform8.User.Data {
  public class UserConfiguration : EntityTypeConfiguration<Models.User> {
    public override void Configure(EntityTypeBuilder<Models.User> builder) {
      base.ConfigureEntityTable(builder);
    }
  }
}
