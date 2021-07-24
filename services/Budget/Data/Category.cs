using Platform8.Core;
using Platform8.Core.Data;

namespace Platform8.BudgetService.Data {
  public class Category : BaseEntity {
    public string Name { get; set; }
    public NumberRange Allocation { get; set; }     
    public Budget Budget { get; set; }
  }
}
