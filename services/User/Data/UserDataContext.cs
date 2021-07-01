using Microsoft.EntityFrameworkCore;

using Platform8.Core.Data;

namespace Platform8.User.Data {

  public class UserDataContext: DataContext<UserDataContext> {
      public UserDataContext(DbContextOptions<UserDataContext> options): base(options) { }

      public DbSet<Models.User> Users { get; set; }
  }
}
