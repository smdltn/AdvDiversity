using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Groups;
using Sabio.Models.Requests.Groups;

namespace Sabio.Services.Interfaces
{
    public interface IGroupService
    {
        Paged<Group> GetAllPaginated(int pageIndex, int pageSize);
        void Update(GroupUpdateRequest model, int userId);
        int Add(GroupAddRequest model, int userId);
        Group GetById(int id);
        void Delete(int id);
        Paged<Group> GetByCreatedBy(int pageIndex, int pageSize, int createdById);
        Paged<Group> GetAllByGroupTypeNamePaginated(string groupTypeName, int pageIndex, int pageSize);
    }
}