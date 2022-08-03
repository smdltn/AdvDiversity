using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.FAQs;
using System;
using System.Collections.Generic;

namespace Sabio.Services
{
    public interface IFaqsServices
    {
        void Delete(int id);

        int Add(FaqAddRequest model, int currentUserId);

        void Update(FaqUpdateRequest model,int currentUserId);

        Faqs GetById(int Id);

        List<Faqs> SelectAllDetails();
        List<Faqs> SelectAllByCategory(string category);

        Paged<Faqs> Pagination(int pageIndex, int pageSize, int createdBy);
        Paged<Faqs> SelectAllPagination(int pageIndex, int pageSize);
        Paged<Faqs> SelectAllByCategoryPagination (string category, int pageIndex, int pageSize);

        List<FaqCategories> GetTop();
    };

    
}