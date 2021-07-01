using Platform8.Core.Data;

namespace Platform8.User.Models {
  public class User : BaseEntity
  {
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
  }
}
