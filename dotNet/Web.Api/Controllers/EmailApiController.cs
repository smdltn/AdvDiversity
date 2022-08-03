using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Sabio.Models.AppSettings;
using Sabio.Models.Requests;
using Sabio.Models.Requests.ContactUs;
using Sabio.Models.Domain.Stripe;
using Sabio.Models.Requests.Donations;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/emails")]
    [ApiController]
    public class EmailApiController : BaseApiController
    {
        private IEmailService _emailService;
      
        public EmailApiController( IEmailService service
            , ILogger<EmailApiController> logger) : base(logger)
        {
            _emailService = service;
        }


        [HttpPost]
        public async Task<ActionResult<SuccessResponse>> SendEmailAsync()
        {
            int iCode = 0;
            BaseResponse result = null;
            try
            {
                iCode = 200;
                await _emailService.SendWelcomeEmail();
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

        [AllowAnonymous]
        [HttpPost("contactus")]
        public async Task<ActionResult<SuccessResponse>> ContactUsAsync(ContactAddRequest model)
        {
            int iCode = 0;
            BaseResponse result = null; 
            try
            {
                iCode = 200;
                await _emailService.SendContactUsEmail(model);

                await _emailService.SendUserEmail(model);

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
        
        [HttpPost("receipt")]
        public async Task<ActionResult<SuccessResponse>> SendStripeRecepit(CreateEmailRequest cust)
        {
            int iCode = 0;
            BaseResponse result = null;
            try
            {
                iCode = 200;
                await _emailService.SendStripeEmail(cust);
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
        [AllowAnonymous]
        [HttpPost("donation")]
        public async Task<ActionResult<SuccessResponse>> SendDonationReceipt(DonationEmailRequest cust)
        {
            int iCode = 0;
            BaseResponse result = null;
            try
            {
                iCode = 200;
                await _emailService.SendDonationEmail(cust);
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

    }
}
