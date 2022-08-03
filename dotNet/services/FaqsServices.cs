using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.FAQs;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class FaqsServices : IFaqsServices
    {
        IDataProvider _data = null;

        public FaqsServices(IDataProvider data)
        {
            _data = data;
        }



        public void Delete(int id)
        {
            string procName = "[dbo].[FAQs_Delete_ById]";

            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);
            });

        }


        public int Add(FaqAddRequest model,int currentUserId)
        {
            int id = 0;

            string procName = "[dbo].[FAQs_Insert]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddWithValue(model, col);
                    col.AddWithValue("@CreatedBy", currentUserId);
                    col.AddWithValue("@ModifiedBy", currentUserId);
                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;

                    col.Add(idOut);

                },
                returnParameters: delegate (SqlParameterCollection returnCollection)
                {
                    object oId = returnCollection["@Id"].Value;

                    int.TryParse(oId.ToString(), out id);


                });

            return id;
        }

        public void Update(FaqUpdateRequest model, int currentUserId)
        {
            string procName = "[dbo].[FAQs_Update]";
            _data.ExecuteNonQuery(procName,
               inputParamMapper: delegate (SqlParameterCollection col)
               {
                   AddWithValue(model, col);
                   col.AddWithValue("@Id", model.Id);
                   col.AddWithValue("@CreatedBy", currentUserId);
                   col.AddWithValue("@ModifiedBy", currentUserId);
               },
               returnParameters: null);
        }


        public Faqs GetById(int Id)
        {
            string procName = "[dbo].[FAQs_Select_ById]";
            Faqs faq = null;
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@id", Id);

            },delegate (IDataReader reader, short set)
            {
                int startingIdex = 0;
                faq = MapFaqs(reader, ref startingIdex);

            }


            );
            return faq;


        }

        public List<FaqCategories> GetTop()
        {
            List<FaqCategories> list = null;
            string procName = "[dbo].[FAQCategories_SelectAll]";

            _data.ExecuteCmd(procName, inputParamMapper: null
             , singleRecordMapper: delegate (IDataReader reader, short set)
             {
                 FaqCategories faq = MappFaqsCat(reader);

                 if (list == null)
                 {
                     list = new List<FaqCategories>();
                 }
                 list.Add(faq);
             }
           );
            return list;
        }


        public Paged<Faqs> Pagination(int pageIndex, int pageSize, int createdBy)
        {
            Paged<Faqs> pagedList = null;
            List<Faqs> list = null;
            int totalCount = 0;
            string procName = "[dbo].[FAQs_Select_ByCreatedBy_Paginated]";
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@CreatedBy", createdBy);
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
            }, delegate (IDataReader reader, short set)
            {
                int startingIdex = 0;
                Faqs faq = MapFaqs(reader, ref startingIdex);
                  
                totalCount = reader.GetSafeInt32(startingIdex++);

                if (list == null)
                {
                    list = new List<Faqs>();
                }
                list.Add(faq);
            });
            if (list != null)
            {
                pagedList = new Paged<Faqs>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;

        }

        public Paged<Faqs> SelectAllPagination(int pageIndex, int pageSize)
        {
            Paged<Faqs> pagedList = null;
            List<Faqs> list = null;
            int totalCount = 0;
            string procName = "dbo.FAQs_SelectAll_Paginated";
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
            }, delegate (IDataReader reader, short set)
            {
                int startingIdex = 0;
                Faqs faq = MapFaqs(reader, ref startingIdex);

                totalCount = reader.GetSafeInt32(startingIdex++);

                if (list == null)
                {
                    list = new List<Faqs>();
                }
                list.Add(faq);
            });
            if (list != null)
            {
                pagedList = new Paged<Faqs>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;

        }

        public Paged<Faqs> SelectAllByCategoryPagination(string category, int pageIndex, int pageSize)
        {
            Paged<Faqs> pagedList = null;
            List<Faqs> list = null;
            int totalCount = 0;
            string procName = "dbo.FAQs_SelectAll_byCategory_Paginated";
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Category", category);
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
            }, delegate (IDataReader reader, short set)
            {
                int startingIdex = 0;
                Faqs faq = MapFaqs(reader, ref startingIdex);

                totalCount = reader.GetSafeInt32(startingIdex++);

                if (list == null)
                {
                    list = new List<Faqs>();
                }
                list.Add(faq);
            });
            if (list != null)
            {
                pagedList = new Paged<Faqs>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;

        }


        public List<Faqs> SelectAllDetails()
        {
          
            List<Faqs> list = null;
           
            string procName = "[dbo].[FAQs_SelectAllDetails]";
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {

            }, delegate (IDataReader reader, short set)
            {
                int startingIdex = 0;
                Faqs faq = MapFaqs(reader, ref startingIdex);

                if (list == null)
                {
                    list = new List<Faqs>();
                }
                list.Add(faq);
            });           
            return list;

        }
        public List<Faqs> SelectAllByCategory(string category)
        {
            List<Faqs> result = null;
            string procName = "dbo.FAQs_SelectAll_byCategory";
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Name", category);
            }, singleRecordMapper: delegate(IDataReader reader, short set)
            {
                int startingIdex = 0;
                Faqs faq = MapFaqs(reader, ref startingIdex);

                if (result == null)
                {
                    result = new List<Faqs>();
                }
                result.Add(faq);
            });

            return result;
        }


        private static Faqs MapFaqs(IDataReader reader, ref int startingIdex)
        {
            Faqs faq = new Faqs();
            faq.FaqCategories = new FaqCategories();

            
            faq.Id = reader.GetInt32(startingIdex++);
            faq.Question = reader.GetSafeString(startingIdex++);
            faq.Answer = reader.GetSafeString(startingIdex++);
            faq.CategoryId = reader.GetInt32(startingIdex++);
            faq.SortOrder = reader.GetInt32(startingIdex++);
            faq.DateCreated = reader.GetSafeDateTime(startingIdex++);
            faq.DateModified = reader.GetSafeDateTime(startingIdex++);
            faq.CreatedBy = reader.GetInt32(startingIdex++);
            faq.ModifiedBy = reader.GetInt32(startingIdex++);
            faq.FaqCategories.Id = reader.GetInt32(startingIdex++);
            faq.FaqCategories.Name = reader.GetString(startingIdex++);
            return faq;
        }

        private static FaqCategories MappFaqsCat(IDataReader reader)
        {
            FaqCategories faq = new FaqCategories();

            int startingIdex = 0;

            faq.Id = reader.GetInt32(startingIdex++);
            faq.Name = reader.GetSafeString(startingIdex++);
           
            return faq;
        }

        private static void AddWithValue(FaqAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@Question", model.Question);
            col.AddWithValue("@Answer", model.Answer);
            col.AddWithValue("@CategoryId", model.CategoryId);
            col.AddWithValue("@SortOrder", model.SortOrder);
      
        }


    }
}
