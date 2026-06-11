using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Linq.Expressions;

namespace CRM.DAL.GenericRepository
{
    public interface IGenericRepository<T> where T:class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);
        Task<T?> GetByIdAsync(object id);
        Task InsertAsync(T entity);
        Task UpdateAsync(T entity);
        Task DeleteAsync(object id);
        

    }
}
