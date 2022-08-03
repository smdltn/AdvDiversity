using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Groups;
using Sabio.Models.Domain.Users;
using Sabio.Models.Requests.Groups;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class GroupService : IGroupService
    {
        IDataProvider _data = null;

        public GroupService(IDataProvider data)
        {
            _data = data;
        }

        public void Update(GroupUpdateRequest model, int userId)
        {
            string procName = "[dbo].[Groups_Update]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", model.Id);
                    col.AddWithValue("@CreatedById", userId);
                    AddCommonParams(model, col);

                }, returnParameters: null);
        }

        public int Add(GroupAddRequest model, int userId)
        {
            int id = 0;
            string procName = "[dbo].[Groups_Insert]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@CreatedById", userId);
                    AddCommonParams(model, col);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;

                    col.Add(idOut);

                }, returnParameters: delegate (SqlParameterCollection returnCollection)
                {
                    object oId = returnCollection["@Id"].Value;

                    int.TryParse(oId.ToString(), out id);

                });

            return id;

        }
        public Group GetById(int id) 
        {
            string procName = "[dbo].[Groups_SelectById]";
            Group group = null;


            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", id);

            }, delegate (IDataReader reader, short set)

            {
                int index = 0;
                group = MapSingleGroup(reader, ref index);

            });

            return group;
        }

        public Paged<Group> GetAllPaginated(int pageIndex, int pageSize)
        {
            Paged<Group> pagedList = null;
            List<Group> list = null;
            int totalCount = 0;
            string procName = "[dbo].[Groups_Select_All_Paginated]";
            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@PageIndex", pageIndex);
                paramCollection.AddWithValue("@PageSize", pageSize);
            }, delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Group group = MapSingleGroup(reader, ref startingIndex);

                totalCount = reader.GetSafeInt32(startingIndex++);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex++);
                }

                if (list == null)
                {
                    list = new List<Group>();
                }
                list.Add(group);
            });
            if (list != null)
            {
                pagedList = new Paged<Group>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;

        } 

        public void Delete(int id) 
        {
            string procName = "[dbo].[Groups_DeleteById]";
            Group groupDelete = null;
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", id);
                }, returnParameters: null);
            Console.Write(groupDelete);
        }

        public Paged<Group> GetByCreatedBy(int createdBy, int pageIndex, int pageSize)
        {
            string procName = "[dbo].[Groups_Select_Createdby_Paginated]";
            Paged<Group> pagedList = null;
            List<Group> groupList = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName, (inputParams) =>
            {
                inputParams.AddWithValue("@CreatedBy", createdBy);
                inputParams.AddWithValue("@PageIndex", pageIndex);
                inputParams.AddWithValue("@PageSize", pageSize);



            }, (reader, set) =>
            {
                int index = 0;
                Group groups = MapSingleGroup(reader, ref index);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(index++);
                }
                if (groupList == null)
                {
                    groupList = new List<Group>();
                }
                groupList.Add(groups);
            });
            if (groupList != null)
            {
                pagedList = new Paged<Group>(groupList, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<Group> GetAllByGroupTypeNamePaginated(string groupTypeName, int pageIndex, int pageSize)
        {
            string procName = "dbo.Groups_Select_GroupType_Paginated";
            Paged<Group> pagedResult = null;
            int totalCount = 0;
            List<Group> result = null;
            _data.ExecuteCmd(
                procName,
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@GroupTypeName", groupTypeName);
                    parameterCollection.AddWithValue("@PageIndex", pageIndex);
                    parameterCollection.AddWithValue("@PageSize", pageSize);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int index = 0;
                    Group aGroup = MapSingleGroup(reader, ref index);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index++);
                    }
                    if (result == null)
                    {
                        result = new List<Group>();
                    }
                    result.Add(aGroup);
                }
            );
            if (result != null)
            {
                pagedResult = new Paged<Group>(result, pageIndex, pageSize, totalCount);
            }
            return pagedResult;
        }


        private static Group MapSingleGroup(IDataReader reader, ref int startingIndex)
        {
            Group group = new Group();
            group.GroupType = new LookUp();

            group.Id = reader.GetSafeInt32(startingIndex++);
            group.Name = reader.GetSafeString(startingIndex++);
            group.Headline = reader.GetSafeString(startingIndex++);
            group.Description = reader.GetSafeString(startingIndex++);
            group.Logo = reader.GetSafeString(startingIndex++);
            group.CreatedById = reader.GetSafeInt32(startingIndex++);
            group.DateCreated = reader.GetSafeDateTime(startingIndex++);
            group.DateModified = reader.GetSafeDateTime(startingIndex++);
            group.GroupType.Id = reader.GetSafeInt32(startingIndex++);
            group.GroupType.Name = reader.GetSafeString(startingIndex++);

            return group;
        }

        private static void AddCommonParams(GroupAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@GroupTypeId", model.GroupTypeId);
            col.AddWithValue("@Name", model.Name);
            col.AddWithValue("@Headline", model.Headline);
            col.AddWithValue("@Description", model.Description);
            col.AddWithValue("@Logo", model.Logo);
        }
     
    }
}
