using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Groups;
using Sabio.Models.Requests.BecomeAMentor;
using Sabio.Models.Requests.ContactUs;
using Sabio.Models.Requests.Groups;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/groups")]
    [ApiController]
    public class GroupApiController : BaseApiController
    {
        private IGroupService _service = null;
        private IAuthenticationService<int> _authService = null;
        private IEmailService _emailService = null;
        public GroupApiController(
            IGroupService service,
            IEmailService mailService,
            ILogger<GroupApiController> logger,
            IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
            _emailService = mailService;
        }

        [HttpPost("emails")]
        public async Task<ActionResult<SuccessResponse>> ContactUsAsync(BecomeAMentor model)
        {
            int iCode = 200;
            BaseResponse result = null;
            try
            {
                await _emailService.SendBecomeAMentorConfirmation(model);

                await _emailService.SendBecomeAMentorInitInfo(model);

                result = new SuccessResponse();

            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = new ErrorResponse($"Error Message: {ex.Message}");
                iCode = 500;
            }
            return StatusCode(iCode, result);

        }

        [HttpPost("")]
        public ActionResult<ItemResponse<int>>GroupCreate(GroupAddRequest model)
        {

            ObjectResult result = null;
         

            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.Add(model,userId);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };

                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Group>> GroupSelectById(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                Group blogs = _service.GetById(id);

                if (blogs == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application resource not found.");

                }
                else
                {
                    response = new ItemResponse<Group>() { Item = blogs };
                }
            }

            catch (Exception ex)
            {
                iCode = 500;
                Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }

            return StatusCode(iCode, response);

        }

        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<Group>>>GroupSelectAllPaginated(int pageIndex, int pageSize)
        {
            ActionResult result = null;

            try
            {
                Paged<Group> pagedList = _service.GetAllPaginated(pageIndex, pageSize);

                if (pagedList == null)
                {
                    result = NotFound404(new ErrorResponse("Records Not Found"));
                }
                else
                {
                    ItemResponse<Paged<Group>> response = new ItemResponse<Paged<Group>>();
                    response.Item = pagedList;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.Message.ToString()));
            }

            return result;
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> GroupUpdate(GroupUpdateRequest model)
        {
            int iCode = 200;
            BaseResponse response = null;
            int userId = _authService.GetCurrentUserId();

            try
            {              
                _service.Update(model, userId);
                response = new SuccessResponse();

            }
            
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse("Records not found." + ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(iCode, response);
        }

        [HttpGet("grouptypepaginate")]
        public ActionResult<ItemResponse<Paged<Group>>> GroupGetAllByGroupTypePaginated( string groupTypeName, int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                int userId = _authService.GetCurrentUserId();
                if (userId == 0)
                {
                    code = 500;
                    response = new ErrorResponse("Log in before perform getting pagination");
                }
                else
                {
                    Paged<Group> paged = _service.GetAllByGroupTypeNamePaginated(groupTypeName , pageIndex, pageSize);
                    if (paged == null)
                    {
                        code = 404;
                        response = new ErrorResponse("No records found");
                    }
                    else
                    {
                        response = new ItemResponse<Paged<Group>> { Item = paged };
                    }
            }
            }

            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);

        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> GroupDelete(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                if (userId == 0)
                {
                    code = 500;
                    response = new ErrorResponse("Log in before perform getting pagination");
                }
                else
                {
                    Group aGroup = _service.GetById(id);
                    if (aGroup == null)
                    {
                        code = 404;
                        response = new ErrorResponse("No records found");
                    }
                    else
                    {
                        response = new ItemResponse<Group> { Item = aGroup };

                    }
            }

            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);            ;
        }


    }
}
