using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;

namespace CRM.DAL.GenericRepository
{
    public abstract class RepositoryBaseDapper
    {
        private readonly string _connectionString;
        protected RepositoryBaseDapper(string connectionString)
        {
            _connectionString = connectionString ?? throw new ArgumentNullException(nameof(connectionString));     
        }

        protected async Task<IEnumerable<T>> ExecuteAsync<T>(string sql , object?param = null)
        {
            using IDbConnection connection = new SqlConnection(_connectionString);
            return  await connection.QueryAsync<T>(sql, param,commandType:CommandType.StoredProcedure);
        }
        protected async Task<T?> ExecuteScalarAsync<T>(string sql, object? param = null)
        {
            using IDbConnection connection = new SqlConnection(_connectionString);
            return await connection.QueryFirstOrDefaultAsync<T>(sql, param, commandType: CommandType.StoredProcedure);
        }

        protected async Task<TReturn?> ExecuteAsyncWithSpliteOn<TFirst,TSecond,TReturn>(string sql,Func<TFirst,TSecond,TReturn> map , object? param=null , string spliteOn = "id")
        
        {
            using IDbConnection connection = new SqlConnection(_connectionString);
            //query the database 
            var res = await connection.QueryAsync(sql, map, param, splitOn: spliteOn);
            // return the first result or defautl   


            return res.FirstOrDefault();
        }


   


        // New version that accepts three parameters (TFirst, TSecond, TThird)
        protected async Task<TReturn?> ExecuteAsyncWithSplitOn<TFirst, TSecond, TThird, TReturn>(
            string sql,
            Func<TFirst, TSecond, TThird, TReturn> map,
             object? param = null,
                string splitOn = "Id")
             {
            using IDbConnection connection = new SqlConnection(_connectionString);

            // Query the database
            var res = await connection.QueryAsync(sql, map, param, splitOn: splitOn);

            // Return the first result or default
            return res.FirstOrDefault();
        }
        protected async Task<List<TReturn>> ExecuteListAsyncWithSplitOn<TFirst, TSecond, TReturn>(string sql, Func<TFirst, TSecond, TReturn> map, object? param = null, string splitOn = "Id")
        {
            using IDbConnection connection = new SqlConnection(_connectionString);
            var result = await connection.QueryAsync(sql, map, param, splitOn: splitOn);
            return result.ToList();
        }

        protected async Task<List<TReturn>> QueryWithMappingAsync<TFirst, TSecond, TThird, TFourth, TReturn>(
            string sql,
            Func<TFirst, TSecond, TThird, TFourth, TReturn> map,
            object? param = null,
            string splitOn = "Id")
        {
            using IDbConnection connection = new SqlConnection(_connectionString);
            var result = await connection.QueryAsync(sql, map, param, splitOn: splitOn);
            return result.ToList();
        }


    }

   
}
