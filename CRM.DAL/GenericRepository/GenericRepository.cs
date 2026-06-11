using CRM.DAL.DBContexts;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Linq.Expressions;

namespace CRM.DAL.GenericRepository
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private readonly DataContext _context;
        private readonly DbSet<T> _table;

        public GenericRepository(DataContext context)
        {
            _context = context;
            _table = _context.Set<T>();
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _table.ToListAsync();
        }

        public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            return await _table.Where(predicate).ToListAsync();
        }

        public async Task<T?> GetByIdAsync(object id)
        {
            return await _table.FindAsync(id);
        }

        public async Task InsertAsync(T entity)
        {
            await _table.AddAsync(entity);
        }

        public Task UpdateAsync(T entity)
        {
            _table.Attach(entity);
            _context.Entry(entity).State = EntityState.Modified;
            return Task.CompletedTask;
        }

        public async Task DeleteAsync(object id)
        {
            var existing = await GetByIdAsync(id);
            if (existing != null)
            {
                _table.Remove(existing);
            }
        }
    }
}

