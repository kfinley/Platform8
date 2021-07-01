using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Platform8.Core.Data
{
    public interface IAsyncRepository<TContext, TEntity>
      where TEntity: IEntity
      where TContext: DbContext
    {
      Task<TEntity> SaveAsync(TEntity entity, CancellationToken cancellationToken = default);
    }
}
