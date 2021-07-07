using System;
using System.Linq;
using System.Linq.Expressions;

using Microsoft.EntityFrameworkCore;

namespace Platform8.Core.Data {

  public interface IQuerySpec<T, TResult> : IQuerySpec<T> {
    Func<T, TResult> Selector { get; }
  }

  public interface IQuerySpec<T> {
    int? Take { get; }
    int? Skip { get; }
    Expression<Func<T, bool>> Where { get; }
    Expression<Func<T, object>> OrderBy { get; }
    IQueryable<T> Apply(DbContext context);
  }
}
