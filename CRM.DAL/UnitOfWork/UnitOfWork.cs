using CRM.DAL.DBContexts;
using CRM.DAL.GenericRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CRM.DAL.UnitOfWork
{
    public class UnitOfWork<T> : IUnitOfWork<T> where T : class
    {
        private readonly DataContext _context;
        public IGenericRepository<T> _entity;
        public IGenericRepository<T> Entity
        {
            get
            {
                return _entity ?? (_entity = new GenericRepository<T>(_context));
            }
        }



        public UnitOfWork(DataContext context)
        {
            _context = context;
        }

        public void Save()
        {
            _context.SaveChanges();
        }
    }
}
