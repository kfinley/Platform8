using System;
using System.Collections.Generic;

using Platform8.Core.Data;

namespace Platform8.Budget.Models {
  public class Budget : BaseEntity {    
    public Guid OwnerId { get; set; }
    public IList<Category> Categories { get; set; }
  }
}
