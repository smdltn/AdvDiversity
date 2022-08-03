using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.EmailFaq;
using Sabio.Models.Requests.FAQs;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/Faqs")]
    [ApiController]
    public class FaqApiController : BaseApiController
    {
        private IFaqsServices _service = null;
        private IAuthenticationService<int> _authService = null;
        private IEmailService _emailService = null;

        public FaqApiController(IFaqsServices service, ILogger<FaqApiController> logger,
            IAuthenticationService<int> authService, IEmailService emailService) : base(logger)
        {
            _service = service;
            _authService = authService;
            _emailService = emailService;
        }

        [HttpPost("emails")]
        public async Task<ActionResult<SuccessResponse>> SendFaqEmail(EmailFaq model)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                await _emailService.SendFaqQuestionConfirmation(model);
                await _emailService.SendFaqQuestionToHost(model);
                response = new SuccessResponse();
            }
            catch(Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.ToString());
            }

            return StatusCode(iCode, response);
        }


        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                _service.Delete(id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }


        [HttpPost]
        public ActionResult<ItemResponse<int>> Create(FaqAddRequest model)
        {
            ObjectResult result = null;
            int currentUserId = _authService.GetCurrentUserId();

            try
            {
                if (currentUserId != 0) 
                {
                    int id = _service.Add(model, currentUserId);
                    ItemResponse<int> response = new ItemResponse<int>() { Item = id };
                    result = Created201(response);
                }
                else
                {
                    ErrorResponse response = new ErrorResponse("Logging in before making changes to FAQ database");
                    result = StatusCode(404, response);
                }

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
        public ActionResult<ItemResponse<Faqs>> GetById(int id)
        {
            int iCode = 200;
            BaseResponse response = null;
            try
            {
                Faqs aFaq = _service.GetById(id);
                if (aFaq == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Application Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Faqs> { Item = aFaq };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                base.Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Error: {ex.Message}");
            }
            return StatusCode(iCode, response);
        }




        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(FaqUpdateRequest model, int Id)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                int currentUserId = _authService.GetCurrentUserId();
                _service.Update(model, currentUserId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(code, response);
        }



        
        [HttpGet("paginatecreatedby")]
        public ActionResult<ItemResponse<Paged<Faqs>>> GetPage(int pageIndex, int pageSize, int createdBy)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                int currentUserId = _authService.GetCurrentUserId();
                Paged<Faqs> page = _service.Pagination(pageIndex, pageSize, currentUserId);
                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Faqs>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [AllowAnonymous]
        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<Faqs>>> GetAllPaginate(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                //int currentUserId = _authService.GetCurrentUserId();
                Paged<Faqs> page = _service.SelectAllPagination(pageIndex, pageSize);
                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Faqs>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }


        [AllowAnonymous]
        [HttpGet("bycategorypaginate")]
        public ActionResult<ItemResponse<Paged<Faqs>>> GetAllByCategoryPaginate(string category, int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                //int currentUserId = _authService.GetCurrentUserId();
                Paged<Faqs> page = _service.SelectAllByCategoryPagination(category, pageIndex, pageSize);
                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Faqs>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }



        [AllowAnonymous]
        [HttpGet("SelectAllDetails")]
        public ActionResult<ItemResponse<Paged<Faqs>>> SelectAllDetails()
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                List<Faqs> page = _service.SelectAllDetails();
                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<List<Faqs>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [AllowAnonymous]
        [HttpGet("category")]
        public ActionResult<ItemResponse<Paged<Faqs>>> SelectAllByCategory(string category)
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                List<Faqs> page = _service.SelectAllByCategory(category);
                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<List<Faqs>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }



        [HttpGet]
        public ActionResult<ItemsResponse<FaqCategories>> GetTop()
        {
            int code = 200;
            BaseResponse response = null;
            try
            {
                List<FaqCategories> list = _service.GetTop();
                if (list == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemsResponse<FaqCategories> { Items = list };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }


    }

}


