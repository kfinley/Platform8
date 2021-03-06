using System;
using System.Collections.Generic;
using MediatR;

using Platform8.Core;

namespace Platform8.Budgets.Models {
  public class Category {
    public Guid Id { get; set; }
    public string Name { get; set; }
    public NumberRange Allocation { get; set; }
    public Models.Budget Budget { get; set; }
  }

  public class AddCategoryRequest : IRequest<AddCategoryResponse> {
    public Guid OwnerId { get; set; }
    public string Name { get; set; }
    public NumberRange Allocation { get; set; }
  }

  public class AddCategoryResponse {
    public Guid Id { get; set; }
    public Guid BudgetId { get; set; }
    public bool Success { get; set; }
  }

  public class CategoryByNameRequest : IRequest<CategoryByNameResponse> {
    public Guid OwnerId { get; set; }
    public string Name { get; set; }
  }

  public class CategoryByNameResponse {
    public IReadOnlyList<Category> Categories { get; set; }
    public string Error { get; set; }
  }
}
